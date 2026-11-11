interface BulletListProps {
  items: string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <ul>
      {items.map((item) => (
        // the texts are unique, so they work as keys
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
