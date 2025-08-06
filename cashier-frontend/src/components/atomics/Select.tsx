type Option = {
  value: string
  label: string
}

type SelectProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  className?: string
}

export const Select = ({ value, onChange, options, className }: SelectProps) => (
  <select value={value} onChange={onChange} className={className}>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)
