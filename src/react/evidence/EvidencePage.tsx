import { useState } from "react";
import { readStoredBookmarks, readStoredNotes, writeStoredBookmarks, writeStoredNotes } from "../../storage.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { EvidenceToolbar } from "./EvidenceToolbar.tsx";
import { EvidenceCard } from "./EvidenceCard.tsx";
import { EvidenceDetail } from "./EvidenceDetail.tsx";

interface EvidencePageProps {
  data: CaseData;
}

export function EvidencePage({ data }: EvidencePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState(readStoredBookmarks);
  const [notes, setNotes] = useState(readStoredNotes);
  // id of the evidence item shown in the detail view, null = none open
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = bookmarks.includes(evidenceId)
      ? bookmarks.filter((id) => id !== evidenceId)
      : [...bookmarks, evidenceId];
    setBookmarks(nextBookmarks);
    writeStoredBookmarks(nextBookmarks);
  }

  function saveNote(evidenceId: string, text: string) {
    const nextNotes = { ...notes, [evidenceId]: text };
    setNotes(nextNotes);
    writeStoredNotes(nextNotes);
  }

  // matches the vanilla search: title, summary and tags, ignoring case
  const term = searchTerm.trim().toLowerCase();
  const visibleEvidence = data.evidence
    .filter((ev) => (ev.title + " " + ev.summary + " " + ev.tags.join(" ")).toLowerCase().includes(term))
    // newest first; filter() returned a new array, so sorting it leaves data.evidence alone
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const openEvidence = data.evidence.find((ev) => ev.id === openId);

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar data={data} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
