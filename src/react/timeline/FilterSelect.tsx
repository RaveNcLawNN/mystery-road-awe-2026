interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  // screen-reader label (visually hidden, as in the vanilla toolbar)
  label: string;
  options: SelectOption[];
  // the option selected when the select first appears (e.g. from the URL)
  defaultValue?: string;
}

// Display only for now: no onChange yet, the browser keeps the selection
// itself (wiring it up is Exercise 5).
export function FilterSelect({ id, label, options, defaultValue }: FilterSelectProps) {
  return (
    <>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select id={id} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
