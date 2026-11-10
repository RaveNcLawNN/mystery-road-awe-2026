interface PlaceholderPageProps {
  title: string;
}

// Stands in for the views that are migrated in Exercises 4 and 5.
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>
        Not migrated to React yet. <a href="index.html">Open this view in the current app.</a>
      </p>
    </section>
  );
}
