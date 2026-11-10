import type { TimelineEvent } from "../../types.ts";
import { formatDate } from "../../utils/format.ts";
import { Badge, type BadgeVariant } from "../components/Badge.tsx";

// Lookup table: certainty -> badge color. A value that is not listed
// (e.g. a new certainty in the data) falls back to the neutral badge.
const CERTAINTY_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  confirmed: "badge-reviewed",
  reported: "badge-flagged",
  contradictory: "badge-critical",
};

function certaintyBadgeVariant(certainty: string): BadgeVariant {
  return CERTAINTY_BADGE_VARIANTS[certainty] ?? "badge-unreviewed";
}

interface TimelineEventCardProps {
  event: TimelineEvent;
  // "L01 - Robotics Lab", resolved by the page
  locationNames: string[];
}

export function TimelineEventCard({ event, locationNames }: TimelineEventCardProps) {
  return (
    <div className={"timeline-event certainty-" + event.certainty}>
      <div className="timeline-time">
        {formatDate(event.time)} &middot;{" "}
        <Badge text={event.certainty} variant={certaintyBadgeVariant(event.certainty)} />
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <LocationLine names={locationNames} />
      {event.evidenceIds.length > 0 && <p className="evidence-meta">Evidence: {event.evidenceIds.join(", ")}</p>}
    </div>
  );
}

interface LocationLineProps {
  names: string[];
}

// Renders nothing at all (null) when the event has no location.
function LocationLine({ names }: LocationLineProps) {
  if (names.length === 0) {
    return null;
  }
  return <p className="evidence-meta">Location: {names.join(", ")}</p>;
}
