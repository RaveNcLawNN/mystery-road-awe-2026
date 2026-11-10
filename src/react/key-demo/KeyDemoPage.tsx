import type { Person } from "../../types.ts";

interface KeyDemoPageProps {
  people: Person[];
  reversed: boolean;
}

// Throwaway example for Exercise 4, Demo 4 (react.html#key-demo, not in the
// navigation). The note inputs are uncontrolled: the browser keeps what was
// typed in each <input> element. Reversing the list shows whether React
// moves those elements together with their person.
export function KeyDemoPage({ people, reversed }: KeyDemoPageProps) {
  const list = reversed ? [...people].reverse() : people;

  return (
    <section>
      <h2>Key demo</h2>
      <p>
        Type a note next to the first person, then{" "}
        {reversed ? <a href="#key-demo">restore the order</a> : <a href="#key-demo-reversed">reverse the order</a>}.
      </p>
      <ul>
        {list.map((person) => (
          // the person's id: the row (and its input) moves with the person
          <li key={person.id}>
            <strong>{person.name}</strong>{" "}
            <input type="text" placeholder="note" aria-label={"Note for " + person.name} />
          </li>
        ))}
      </ul>
    </section>
  );
}
