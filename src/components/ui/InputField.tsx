interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs text-warm-500 dark:text-warm-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-warm-200 dark:border-warm-700 dark:bg-warm-800/50 dark:text-warm-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-200/50 transition-all bg-white/80"
      />
    </div>
  );
}
