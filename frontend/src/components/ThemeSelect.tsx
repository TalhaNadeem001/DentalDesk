import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ThemeSelectOption {
  value: string;
  label: string;
}

interface ThemeSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ThemeSelectOption[];
  placeholder?: string;
  className?: string;
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (opt: ThemeSelectOption) => {
    onChange({
      target: { name, value: opt.value },
    } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`theme-select relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="theme-select-trigger w-full text-left"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
      >
        <span className={!selectedOption ? 'theme-select-placeholder' : ''}>{displayLabel}</span>
        <ChevronDown className={`theme-select-chevron ${open ? 'theme-select-chevron-open' : ''}`} />
      </button>
      {open && (
        <div className="theme-select-dropdown" role="listbox">
          <button
            type="button"
            role="option"
            aria-selected={!value}
            className={`theme-select-option ${!value ? 'theme-select-option-selected' : ''}`}
            onClick={() => handleSelect({ value: '', label: placeholder })}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={`theme-select-option ${value === opt.value ? 'theme-select-option-selected' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
