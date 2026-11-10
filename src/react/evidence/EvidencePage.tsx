import { useState } from "react";
import { readStoredBookmarks, readStoredNotes, writeStoredBookmarks, writeStoredNotes } from "../../storage.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { toggleId } from "../data/toggleId.ts";
import { EvidenceToolbar } from "./EvidenceToolbar.tsx";
import { EvidenceCard } from "./EvidenceCard.tsx";
import { EvidenceDetail } from "./EvidenceDetail.tsx";
import { filterAndSortEvidence, NO_FILTERS, type EvidenceFilters } from "./evidenceFilters.ts";

interface EvidencePageProps {
  data: CaseData;
}

export function EvidencePage({ data }: EvidencePageProps) {
  const [filters, setFilters] = useState<EvidenceFilters>(NO_FILTERS);
  // readonly: push/splice on the state array are a type error, so it can only be replaced
  const [bookmarks, setBookmarks] = useState<readonly string[]>(readStoredBookmarks);
  const [notes, setNotes] = useState(readStoredNotes);
  // id of the evidence item shown in the detail view, null = none open
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = toggleId(bookmarks, evidenceId);
    setBookmarks(nextBookmarks);
    writeStoredBookmarks(nextBookmarks);
  }

  function saveNote(evidenceId: string, text: string) {
    const nextNotes = { ...notes, [evidenceId]: text };
    setNotes(nextNotes);
    writeStoredNotes(nextNotes);
  }

  // derived, not stored: recalculated from the full list and the filters on every render
  const visibleEvidence = filterAndSortEvidence(data.evidence, filters);

  const openEvidence = data.evidence.find((ev) => ev.id === openId);

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        data={data}
        filters={filters}
        onFiltersChange={(changes) => setFilters({ ...filters, ...changes })}
      />

      {openEvidence && (
        <EvidenceDetail
          // a new key for another item: the detail (and its unsaved note draft) starts fresh
          key={openEvidence.id}
          evidence={openEvidence}
          data={data}
          note={notes[openEvidence.id] ?? ""}
          onSaveNote={(text) => saveNote(openEvidence.id, text)}
          onClose={() => setOpenId(null)}
        />
      )}

      <div className="evidence-grid">
        {visibleEvidence.length === 0 ? (
          <p>No evidence matches the current filters.</p>
        ) : (
          visibleEvidence.map((ev) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              isBookmarked={bookmarks.includes(ev.id)}
              onToggleBookmark={() => toggleBookmark(ev.id)}
              onOpen={() => setOpenId(ev.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
