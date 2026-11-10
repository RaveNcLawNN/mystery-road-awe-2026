interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  // screen-reader label (visually hidden, as in the vanilla toolbar)
  label: string;
  options: SelectOption[];
  // Either controlled (value + onChange, the Evidence toolbar) or display
  // only with an initial selection (defaultValue, the Timeline toolbar).
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export function FilterSelect({ id, label, options, value, onChange, defaultValue }: FilterSelectProps) {
  return (
    <>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange && ((event) => onChange(event.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
