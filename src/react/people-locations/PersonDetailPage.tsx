import { Link, useParams } from "react-router";
import type { CaseData } from "../data/loadCaseData.ts";
import { PersonCard } from "./PersonCard.tsx";

interface PersonDetailPageProps {
  data: CaseData;
}

// Route: /team/people/:personId, e.g. /team/people/nova-byte
export function PersonDetailPage({ data }: PersonDetailPageProps) {
  // from the URL: may not belong to a real person
  const { personId } = useParams();
  const person = data.people.find((p) => p.id === personId);

  if (!person) {
    return (
      <section>
        <h2>Person not found</h2>
        <p>There is no person with the id &ldquo;{personId}&rdquo; in this case.</p>
        <Link to="/team/people">Back to all people</Link>
      </section>
    );
  }

  return (
    <section>
      <p>
        <Link to="/team/people">&larr; All people</Link>
      </p>
      <h2>{person.name}</h2>
      <PersonCard
        person={person}
        evidenceCount={data.evidence.filter((ev) => ev.personIds.includes(person.id)).length}
      />
      <h3>Background</h3>
      <p>{person.background}</p>
      <p>
        <Link to={"/timeline?person=" + person.id}>Timeline events involving {person.name}</Link>
      </p>
    </section>
  );
}
