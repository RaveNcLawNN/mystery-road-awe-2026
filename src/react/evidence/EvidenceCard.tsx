import type { Evidence } from "../../types.ts";
import { formatDate, getRelevanceBadgeClass, getStatusBadgeClass } from "../../utils/format.ts";
import { Badge } from "../components/Badge.tsx";
import { useBookmarks } from "../data/BookmarksContext.tsx";

interface EvidenceCardProps {
  evidence: Evidence;
  onOpen: () => void;
}

export function EvidenceCard({ evidence, onOpen }: EvidenceCardProps) {
  // straight from context
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarks.includes(evidence.id);

  return (
    <div className="evidence-card" onClick={onOpen}>
      <button
        type="button"
        className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={"Toggle bookmark for " + evidence.title}
        onClick={(event) => {
          // otherwise the click would also open the card
          event.stopPropagation();
          toggleBookmark(evidence.id);
        }}
      >
        <span className="bookmark-icon">{isBookmarked ? "★" : "☆"}</span>
      </button>
      <h3>{evidence.title}</h3>
      <div className="evidence-meta">
        {evidence.id} &middot; {evidence.type} &middot; {formatDate(evidence.timestamp)}
      </div>
      <div className="evidence-summary">{evidence.summary}</div>
      {evidence.tags.includes("critical") && <Badge text="Critical" variant="badge-critical" />}
      <Badge text={evidence.status} variant={getStatusBadgeClass(evidence.status)} />
      <Badge text={evidence.relevance} variant={getRelevanceBadgeClass(evidence.relevance)} />
      <div>
        {evidence.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
