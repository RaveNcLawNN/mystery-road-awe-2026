import { Link } from "react-router";
import type { Person } from "../../types.ts";
import { BulletList } from "./BulletList.tsx";

interface PersonCardProps {
  person: Person;
  // how many evidence items mention this person (calculated by the page)
  evidenceCount: number;
}

export function PersonCard({ person, evidenceCount }: PersonCardProps) {
  return (
    <div className="person-card">
      <div className="person-card-header">
        <img className="person-avatar" src={person.avatar} alt={"Portrait of " + person.name} />
        <div>
          <h3>
            <Link to={"/team/people/" + person.id}>{person.name}</Link>
          </h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <BulletList items={person.responsibilities} />
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}
