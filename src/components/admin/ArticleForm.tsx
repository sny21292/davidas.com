import Link from 'next/link';
import { saveArticle } from '@/app/admin/actions';
import ImageField from '@/components/admin/ImageField';
import MultiImageField from '@/components/admin/MultiImageField';
import TitleSlugFields from '@/components/admin/TitleSlugFields';
import ComboBox from '@/components/admin/ComboBox';
import DateField from '@/components/admin/DateField';
import RichTextEditor from '@/components/admin/RichTextEditor';

export type ArticleFormValues = {
  id: string;
  title: string;
  tag: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  image2: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  metaKeywords: string;
  sort_order: number;
};

// Shared create/edit form. Posts to the saveArticle server action.
export default function ArticleForm({
  values,
  isNew,
  error,
  tags,
  authors,
  nextOrder,
}: {
  values: ArticleFormValues;
  isNew: boolean;
  error?: string;
  tags: string[];
  authors: string[];
  nextOrder: number;
}) {
  const orderValue = isNew ? (values.sort_order || nextOrder) : values.sort_order;

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1>{isNew ? 'New article' : 'Edit article'}</h1>
        <Link href="/admin/articles" className="admin-btn admin-btn--ghost">Cancel</Link>
      </div>

      {error && <p className="admin-notice admin-notice--err">{error}</p>}

      <form action={saveArticle} className="admin-form">
        <input type="hidden" name="isNew" value={isNew ? '1' : '0'} />

        <TitleSlugFields defaultTitle={values.title} defaultSlug={values.id} isNew={isNew} />

        <div className="admin-form__row">
          <ComboBox name="tag" label="Tag" options={tags} defaultValue={values.tag} placeholder="Select or type a tag" />
          <ComboBox name="author" label="Author" options={authors} defaultValue={values.author} placeholder="Select or type an author" />
        </div>

        <div className="admin-form__row">
          <DateField name="date" label="Date" defaultValue={values.date} />
          <label className="admin-field admin-field--narrow">
            <span>Sort order</span>
            <input type="number" name="sort_order" defaultValue={orderValue} min={0} />
            <small>{isNew ? `Next is ${nextOrder}. Must be unique.` : 'Must be unique.'}</small>
          </label>
        </div>

        <label className="admin-field">
          <span>Excerpt (used for meta description &amp; card)</span>
          <textarea name="excerpt" rows={3} defaultValue={values.excerpt} />
        </label>

        <ImageField name="image" label="Main image" defaultValue={values.image} />

        <MultiImageField name="image2" label="Gallery images (optional, shown at the end)" defaultValue={values.image2} />

        <RichTextEditor name="content" defaultValue={values.content} />

        <div className="admin-form__seo">
          <h3 className="admin-form__seotitle">SEO &amp; social</h3>
          <label className="admin-field">
            <span>Meta title</span>
            <input type="text" name="metaTitle" defaultValue={values.metaTitle} placeholder="Falls back to the article title" />
          </label>
          <label className="admin-field">
            <span>Meta description</span>
            <textarea name="metaDescription" rows={2} defaultValue={values.metaDescription} placeholder="Falls back to the excerpt" />
          </label>
          <label className="admin-field">
            <span>Meta keywords</span>
            <input type="text" name="metaKeywords" defaultValue={values.metaKeywords} placeholder="comma, separated, optional" />
          </label>
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary">
            {isNew ? 'Create article' : 'Save changes'}
          </button>
          <Link href="/admin/articles" className="admin-btn admin-btn--ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
