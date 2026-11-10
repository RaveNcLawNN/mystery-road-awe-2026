import type { HypothesisDraft } from "../../storage.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { useBookmarks } from "../data/BookmarksContext.tsx";
import { HypothesisForm } from "./HypothesisForm.tsx";

interface WorkspacePageProps {
  data: CaseData;
  // owned by App (saved from the Evidence detail)
  notes: Record<string, string>;
  hypothesisDraft: HypothesisDraft;
  onHypothesisDraftChange: (draft: HypothesisDraft) => void;
}

export function WorkspacePage({ data, notes, hypothesisDraft, onHypothesisDraftChange }: WorkspacePageProps) {
  const { bookmarks } = useBookmarks();
  // derived from the bookmarks in context, not stored here
  const bookmarkedEvidence = data.evidence.filter((ev) => bookmarks.includes(ev.id));
  const notedEvidence = data.evidence.filter((ev) => notes[ev.id]);

  return (
    <section>
      <h2>Investigator Workspace</h2>

      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            {bookmarkedEvidence.length === 0 ? (
              <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
            ) : (
              bookmarkedEvidence.map((ev) => (
                <div key={ev.id} className="mini-list-item">
                  <strong>{ev.id}</strong> &mdash; {ev.title}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">
            Notes are attached to whichever evidence item is currently open in the Evidence view.
          </p>
          <div className="notes-list">
            {notedEvidence.length === 0 ? (
              <p>No notes yet. Add one from an evidence item&apos;s detail view.</p>
            ) : (
              notedEvidence.map((ev) => (
                <div key={ev.id} className="mini-list-item">
                  <strong>{ev.id}</strong> &mdash; {ev.title}
                  <div>{notes[ev.id]}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <HypothesisForm data={data} draft={hypothesisDraft} onDraftChange={onHypothesisDraftChange} />
    </section>
  );
}
