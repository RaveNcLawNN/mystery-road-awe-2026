import { useState } from "react";
import { readStoredHypothesis, writeStoredHypothesis, type HypothesisDraft } from "../../storage.ts";
import { formatDate } from "../../utils/format.ts";
import type { CaseData } from "../data/loadCaseData.ts";

const EMPTY_DRAFT: HypothesisDraft = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
  savedAt: "",
};

interface HypothesisFormProps {
  data: CaseData;
}

export function HypothesisForm({ data }: HypothesisFormProps) {
  // One object for the whole form: it is loaded and saved as one draft.
  // The function form of useState reads localStorage only on the first render.
  const [draft, setDraft] = useState(() => readStoredHypothesis() ?? EMPTY_DRAFT);

  // copies the draft and overwrites the changed fields (never changes `draft` itself)
  function update(changes: Partial<HypothesisDraft>) {
    setDraft({ ...draft, ...changes });
  }

  function save() {
    const savedDraft = { ...draft, savedAt: new Date().toISOString() };
    try {
      writeStoredHypothesis(savedDraft);
    } catch (err) {
      console.error("Could not save hypothesis draft", err);
      alert("Your hypothesis could not be saved to local storage.");
      return;
    }
    setDraft(savedDraft);
  }

  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>
      <form
        onSubmit={(event) => {
          // without this the browser would send the form and reload the page
          event.preventDefault();
          save();
        }}
      >
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select
            id="hypSuspect"
            value={draft.suspectId}
            onChange={(event) => update({ suspectId: event.target.value })}
          >
            <option value="">Select a person…</option>
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypNature">Accidental or deliberate incident</label>
          <select id="hypNature" value={draft.nature} onChange={(event) => update({ nature: event.target.value })}>
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select
            id="hypEvidence"
            multiple
            size={6}
            // a multi-select is controlled with an array of the selected values
            value={draft.evidenceIds}
            onChange={(event) =>
              update({ evidenceIds: Array.from(event.target.selectedOptions, (option) => option.value) })
            }
          >
            {data.evidence.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypConfidence">Confidence (0–100)</label>
          <input
            type="range"
            id="hypConfidence"
            min={0}
            max={100}
            value={draft.confidence}
            onChange={(event) => update({ confidence: event.target.value })}
          />
          <output htmlFor="hypConfidence">{draft.confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            rows={4}
            placeholder="Explain your reasoning…"
            value={draft.explanation}
            onChange={(event) => update({ explanation: event.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            rows={3}
            placeholder="What else could explain the evidence?"
            value={draft.alternative}
            onChange={(event) => update({ alternative: event.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>
          {draft.savedAt !== "" && <span className="saved-msg">Last saved: {formatDate(draft.savedAt)}</span>}
        </div>
      </form>
    </div>
  );
}
