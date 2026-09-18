'use client';

import { useEffect, useRef, useState } from 'react';

// Tags kept when pasting; everything else is unwrapped to plain content.
const ALLOWED = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'H2', 'H3', 'H4',
  'UL', 'OL', 'LI', 'A', 'BLOCKQUOTE',
]);
const BLOCK_TAGS = ['H2', 'H3', 'H4', 'P', 'BLOCKQUOTE', 'LI'];

function sanitizePasted(html: string): string {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 8) { node.removeChild(child); continue; }
      if (child.nodeType !== 1) continue;
      const el = child as HTMLElement;
      walk(el);
      if (!ALLOWED.has(el.tagName)) {
        while (el.firstChild) node.insertBefore(el.firstChild, el);
        node.removeChild(el);
      } else {
        for (const attr of Array.from(el.attributes)) {
          if (el.tagName === 'A' && attr.name === 'href') continue;
          el.removeAttribute(attr.name);
        }
        if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noreferrer'); }
      }
    }
  };
  walk(tpl.content);
  return tpl.innerHTML;
}

function escapeText(t: string): string {
  return t
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

// WYSIWYG article editor. The contentEditable surface is UNCONTROLLED — typing
// never triggers a React re-render (which would wipe the caret / content). Edits
// mirror into a hidden textarea (the real form field) via refs. Toolbar active
// state is toggled imperatively (also no re-render) so it reflects the caret.
export default function RichTextEditor({
  name,
  defaultValue = '',
}: {
  name: string;
  label?: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLTextAreaElement>(null);
  const htmlRef = useRef<string>(defaultValue);
  const [source, setSource] = useState(false);
  const [sourceValue, setSourceValue] = useState(defaultValue);

  function setValue(v: string) {
    htmlRef.current = v;
    if (hiddenRef.current) hiddenRef.current.value = v;
  }
  function syncFromEditor() {
    setValue(editorRef.current?.innerHTML ?? '');
  }

  function currentBlockTag(): string | null {
    const sel = window.getSelection();
    const root = editorRef.current;
    if (!sel || sel.rangeCount === 0 || !root) return null;
    let el: Node | null = sel.anchorNode;
    el = el && el.nodeType === 1 ? el : el?.parentElement ?? null;
    while (el && el !== root) {
      const tag = (el as HTMLElement).tagName;
      if (BLOCK_TAGS.includes(tag)) return tag.toLowerCase();
      el = (el as HTMLElement).parentElement;
    }
    return null;
  }

  function updateActive() {
    const bar = toolbarRef.current;
    if (!bar) return;
    const setFmt = (key: string, on: boolean) =>
      bar.querySelector(`[data-fmt="${key}"]`)?.classList.toggle('active', on);
    try {
      setFmt('bold', document.queryCommandState('bold'));
      setFmt('italic', document.queryCommandState('italic'));
      setFmt('ul', document.queryCommandState('insertUnorderedList'));
      setFmt('ol', document.queryCommandState('insertOrderedList'));
    } catch { /* queryCommandState can throw if unfocused */ }
    const block = currentBlockTag();
    bar.querySelectorAll('[data-block]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-block') === block),
    );
  }

  // Reflect the caret's formatting in the toolbar whenever the selection moves.
  useEffect(() => {
    function onSel() {
      const sel = window.getSelection();
      if (sel && editorRef.current && sel.anchorNode && editorRef.current.contains(sel.anchorNode)) {
        updateActive();
      }
    }
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncFromEditor();
    updateActive();
  }
  function addLink() {
    const url = window.prompt('Link URL (https://…)');
    if (url) exec('createLink', url);
  }
  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const cb = e.clipboardData;
    const html = cb.getData('text/html');
    const text = cb.getData('text/plain');
    document.execCommand('insertHTML', false, html ? sanitizePasted(html) : escapeText(text));
    syncFromEditor();
  }

  function toggleSource() {
    if (!source) {
      const v = editorRef.current?.innerHTML ?? htmlRef.current;
      setValue(v); setSourceValue(v); setSource(true);
    } else {
      setValue(sourceValue); setSource(false);
    }
  }
  function onSourceChange(v: string) {
    setSourceValue(v); setValue(v);
  }

  const btn = (
    label: React.ReactNode,
    onClick: () => void,
    title: string,
    data?: Record<string, string>,
  ) => (
    <button type="button" className="admin-rte__btn" {...data} onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title}>
      {label}
    </button>
  );

  return (
    <div className="admin-field admin-rte">
      <div className="admin-rte__bar">
        <span>Content</span>
        <button type="button" className="admin-rte__source" onClick={toggleSource}>
          {source ? 'Visual editor' : 'HTML source'}
        </button>
      </div>

      {!source && (
        <div className="admin-rte__toolbar" ref={toolbarRef}>
          {btn(<b>B</b>, () => exec('bold'), 'Bold', { 'data-fmt': 'bold' })}
          {btn(<i>I</i>, () => exec('italic'), 'Italic', { 'data-fmt': 'italic' })}
          {btn('H2', () => exec('formatBlock', 'h2'), 'Heading 2', { 'data-block': 'h2' })}
          {btn('H3', () => exec('formatBlock', 'h3'), 'Heading 3', { 'data-block': 'h3' })}
          {btn('¶', () => exec('formatBlock', 'p'), 'Paragraph', { 'data-block': 'p' })}
          {btn('• List', () => exec('insertUnorderedList'), 'Bullet list', { 'data-fmt': 'ul' })}
          {btn('1. List', () => exec('insertOrderedList'), 'Numbered list', { 'data-fmt': 'ol' })}
          {btn('Link', addLink, 'Insert link')}
          {btn('Clear', () => exec('removeFormat'), 'Clear formatting')}
        </div>
      )}

      {source ? (
        <textarea
          className="admin-field__code"
          rows={18}
          value={sourceValue}
          onChange={(e) => onSourceChange(e.target.value)}
        />
      ) : (
        <div
          ref={editorRef}
          className="admin-rte__editor"
          contentEditable
          suppressContentEditableWarning
          onInput={syncFromEditor}
          onBlur={syncFromEditor}
          onPaste={onPaste}
          onKeyUp={updateActive}
          onMouseUp={updateActive}
          dangerouslySetInnerHTML={{ __html: htmlRef.current }}
        />
      )}

      <textarea ref={hiddenRef} name={name} defaultValue={defaultValue} hidden readOnly />
    </div>
  );
}
