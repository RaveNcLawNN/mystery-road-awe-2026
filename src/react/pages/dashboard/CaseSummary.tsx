import type { CaseFile } from "../../../types.ts";
import { formatDay } from "../../../utils/format.ts";
import { Badge } from "../../components/Badge.tsx";

interface CaseSummaryProps {
  caseFile: CaseFile;
}

export function CaseSummary({ caseFile }: CaseSummaryProps) {
  // only the facts that case.json actually provides
  const caseFacts = [
    caseFile.caseId,
    caseFile.opened ? "opened " + formatDay(caseFile.opened) : "",
    caseFile.leadInvestigator ? "lead investigator: " + caseFile.leadInvestigator : "",
  ].filter((fact) => fact);

  return (
    <div className="case-summary-card">
      <h3>{caseFile.title || "Case"}</h3>
      <p>
        <Badge text={(caseFile.status || "unknown").toUpperCase()} variant="badge-flagged" />
      </p>
      {caseFacts.length > 0 && <p className="evidence-meta">{caseFacts.join(" · ")}</p>}
      <p>{caseFile.summary}</p>
    </div>
  );
}
