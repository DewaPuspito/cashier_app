import { Label } from '../atomics/Label';
import { Input } from '../atomics/Input';

interface InputWithLabelProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  showPasswordToggle,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
      showPasswordToggle={showPasswordToggle}
    />
  </div>
);