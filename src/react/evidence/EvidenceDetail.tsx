import { useEffect, useState } from "react";
import type { Evidence } from "../../types.ts";
import { formatDate } from "../../utils/format.ts";
import type { CaseData } from "../data/loadCaseData.ts";

interface EvidenceDetailProps {
  evidence: Evidence;
  data: CaseData;
  // "" if there is none
  note: string;
  onSaveNote: (text: string) => void;
  // the evidence belongs to App, the detail only reports changes
  onReviewChange: (changes: Partial<Pick<Evidence, "status" | "relevance">>) => void;
  onClose: () => void;
}

export function EvidenceDetail({ evidence, data, note, onSaveNote, onReviewChange, onClose }: EvidenceDetailProps) {
  // saved only on "Save note"
  const [noteDraft, setNoteDraft] = useState(note);

  // Escape closes the detail. THROWAWAY logs (Exercise 6 Demo 3)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        console.log(`Escape: listener of ${evidence.id} runs`);
        onClose();
      }
    }
    console.log(`effect:  add listener (${evidence.id})`);
    window.addEventListener("keydown", handleKeyDown);
    // cleanup: React calls it before the effect runs again and when the detail unmounts
    return () => {
      console.log(`cleanup: remove listener (${evidence.id})`);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [evidence.id, onClose]);

  const personNames = evidence.personIds.map((id) => data.people.find((p) => p.id === id)?.name ?? id);
  const locationNames = evidence.locationIds.map((id) => {
    const location = data.locations.find((loc) => loc.id === id);
    return location ? location.id + " - " + location.name : id;
  });

  return (
    <div className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <h2>{evidence.title}</h2>
          <div className="evidence-meta">
            {evidence.id} &middot; {evidence.type} &middot; {formatDate(evidence.timestamp)}
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-small" onClick={onClose}>
          Close
        </button>
      </div>

      {evidence.tags.includes("critical") && (
        <div className="warning-banner">This item is tagged as critical evidence.</div>
      )}

      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>
      <div className="evidence-detail-content">{evidence.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Tags</strong>
        {evidence.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="detail-field">
        <strong>Review status</strong>
        {/* the data has "Reviewed" and "reviewed", so compared in lower case */}
        <select
          value={evidence.status.toLowerCase()}
          onChange={(event) => onReviewChange({ status: event.target.value })}
        >
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      <div className="detail-field">
        <strong>Relevance</strong>
        <select
          value={evidence.relevance.toLowerCase()}
          onChange={(event) => onReviewChange({ relevance: event.target.value })}
        >
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
      </div>

      <div className="detail-field">
        <strong>Investigator note</strong>
        <textarea
          className="note-textarea"
          rows={3}
          placeholder="Add a private note about this evidence..."
          value={noteDraft}
          onChange={(event) => setNoteDraft(event.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          style={{ marginTop: "6px" }}
          onClick={() => onSaveNote(noteDraft)}
        >
          Save note
        </button>
      </div>
      <div className="detail-field">
        <strong>Note preview</strong>
        <div>{note}</div>
      </div>
    </div>
  );
}
