import type { CaseData } from "../data/loadCaseData.ts";
import { useBookmarks } from "../data/BookmarksContext.tsx";
import { HowToCard } from "./HowToCard.tsx";
import { CaseSummary } from "./CaseSummary.tsx";
import { StatCard } from "./StatCard.tsx";
import { ReviewProgress } from "./ReviewProgress.tsx";
import { RecentEvidenceList } from "./RecentEvidenceList.tsx";
import { RecentTimelineList } from "./RecentTimelineList.tsx";

interface DashboardPageProps {
  data: CaseData;
}

export function DashboardPage({ data }: DashboardPageProps) {
  const { bookmarks } = useBookmarks();
  // Derived values: calculated on every render from the current data, never
  // stored, so they cannot get out of date.
  const reviewedCount = data.evidence.filter((ev) => ev.status.toLowerCase() === "reviewed").length;
  const progressPercent = data.evidence.length === 0 ? 0 : Math.round((reviewedCount / data.evidence.length) * 100);
  // slice() copies, so reverse() does not reorder the shared array
  const recentEvidence = data.evidence.slice(-5).reverse();
  const recentTimeline = data.timeline.slice(-5).reverse();

  return (
    <section>
      <h2>Case Dashboard</h2>
      <HowToCard />
      <CaseSummary caseFile={data.caseFile} />

      <div className="stat-grid">
        <StatCard value={data.evidence.length} label="Evidence items" />
        <StatCard value={data.people.length} label="People" />
        <StatCard value={data.locations.length} label="Locations" />
        <StatCard value={bookmarks.length} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>

      <ReviewProgress percent={progressPercent} />

      <div className="dashboard-columns">
        <RecentEvidenceList items={recentEvidence} />
        <RecentTimelineList events={recentTimeline} />
      </div>
    </section>
  );
}
