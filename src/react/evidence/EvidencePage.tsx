import { useEffect, useReducer, useState } from "react";
import type { Evidence } from "../../types.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { EvidenceToolbar } from "./EvidenceToolbar.tsx";
import { EvidenceCard } from "./EvidenceCard.tsx";
import { EvidenceDetail } from "./EvidenceDetail.tsx";
import { filterAndSortEvidence, filtersReducer, NO_FILTERS } from "./evidenceFilters.ts";

interface EvidencePageProps {
  data: CaseData;
  // the case data is owned by App as well; this asks App to change one item
  onUpdateEvidence: (evidenceId: string, changes: Partial<Pick<Evidence, "status" | "relevance">>) => void;
  // owned by App, so the Workspace shows the same notes
  notes: Record<string, string>;
  onSaveNote: (evidenceId: string, text: string) => void;
}

export function EvidencePage({ data, onUpdateEvidence, notes, onSaveNote }: EvidencePageProps) {
  // all seven filter values in one reducer: every change is an action (see filtersReducer)
  const [filters, dispatch] = useReducer(filtersReducer, NO_FILTERS);
  // id of the evidence item shown in the detail view, null = none open
  const [openId, setOpenId] = useState<string | null>(null);

  // useEffect examples for demo

  // empty array: run only at mount (first render)
  useEffect(() => {
    console.log("[]: onMount");
  }, []);

  // array with a value: run at mount and after every render in which that value changed
  useEffect(() => {
    console.log("[filters.search]: onMount and OnChange");
  }, [filters.search]);

  // no array: run after every render
  useEffect(() => {
    console.log("onRender");
  });

  // derived, not stored: recalculated from the full list and the filters on every render
  const visibleEvidence = filterAndSortEvidence(data.evidence, filters);

  const openEvidence = data.evidence.find((ev) => ev.id === openId);

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar data={data} filters={filters} dispatch={dispatch} />

      {openEvidence && (
        <EvidenceDetail
          // a new key for another item: the detail (and its unsaved note draft) starts fresh
          key={openEvidence.id}
          evidence={openEvidence}
          data={data}
          note={notes[openEvidence.id] ?? ""}
          onSaveNote={(text) => onSaveNote(openEvidence.id, text)}
          onReviewChange={(changes) => onUpdateEvidence(openEvidence.id, changes)}
          onClose={() => setOpenId(null)}
        />
      )}

      <div className="evidence-grid">
        {visibleEvidence.length === 0 ? (
          <p>No evidence matches the current filters.</p>
        ) : (
          visibleEvidence.map((ev) => <EvidenceCard key={ev.id} evidence={ev} onOpen={() => setOpenId(ev.id)} />)
        )}
      </div>
    </section>
  );
}
