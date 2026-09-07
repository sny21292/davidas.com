// Adds a parallel `@modal` slot alongside the normal page. On a soft (in-app)
// navigation to /showcase/[slug], the @modal/(.)[slug] intercepting route fills
// this slot with the quick-view modal while `children` stays on the case listing.
// On a direct visit / refresh the interceptor doesn't run — `children` renders the
// full /showcase/[slug] page and the modal slot falls back to default (null).
export default function ShowcaseLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
