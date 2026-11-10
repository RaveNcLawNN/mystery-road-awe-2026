interface BulletListProps {
  items: string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <ul>
      {items.map((item) => (
        // the texts are unique within each list, so the text itself is the key
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
