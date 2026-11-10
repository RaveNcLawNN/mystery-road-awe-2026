interface NotFoundPageProps {
  route: string;
  onBackToDashboard: () => void;
}

export function NotFoundPage({ route, onBackToDashboard }: NotFoundPageProps) {
  return (
    <section>
      <h2>Page not found</h2>
      <p>There is no view called &ldquo;{route}&rdquo;.</p>
      <button type="button" className="btn btn-primary" onClick={onBackToDashboard}>
        Go to the Dashboard
      </button>
    </section>
  );
}
