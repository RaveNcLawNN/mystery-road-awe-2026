import { Link, useLocation } from "react-router";

// Rendered by the catch-all route (path="*") for every URL no other route matches.
export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <section>
      <h2>Page not found</h2>
      <p>There is no page at &ldquo;{pathname}&rdquo;.</p>
      <Link to="/" className="btn btn-primary">
        Go to the Dashboard
      </Link>
    </section>
  );
}
