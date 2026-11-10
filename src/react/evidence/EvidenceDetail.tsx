import { useState } from "react";
import type { Evidence } from "../../types.ts";
import { formatDate, getRelevanceBadgeClass, getStatusBadgeClass } from "../../utils/format.ts";
import type { CaseData } from "../data/loadCaseData.ts";
import { Badge } from "../components/Badge.tsx";

interface EvidenceDetailProps {
  evidence: Evidence;
  data: CaseData;
  // the saved note for this item ("" if there is none)
  note: string;
  onSaveNote: (text: string) => void;
  onClose: () => void;
}

export function EvidenceDetail({ evidence, data, note, onSaveNote, onClose }: EvidenceDetailProps) {
  // what is typed in the textarea; saved only when "Save note" is clicked
  const [noteDraft, setNoteDraft] = useState(note);

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
        <Badge text={evidence.status} variant={getStatusBadgeClass(evidence.status)} />
      </div>
      <div className="detail-field">
        <strong>Relevance</strong>
        <Badge text={evidence.relevance} variant={getRelevanceBadgeClass(evidence.relevance)} />
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
