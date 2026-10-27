'use client';

// Submit button that asks for confirmation before deleting. Lives in its own
// client component so the surrounding form can stay a server component wired to
// the deleteArticle server action.
export default function DeleteButton({ label = 'this article' }: { label?: string }) {
  return (
    <button
      type="submit"
      className="admin-btn admin-btn--sm admin-btn--danger"
      onClick={(e) => {
        if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}
