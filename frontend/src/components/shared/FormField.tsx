interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  variant?: "modal" | "auth";
}

export function FormField({
  label,
  hint,
  error,
  children,
  variant = "modal",
}: FormFieldProps) {
  const labelClass =
    variant === "auth"
      ? "text-[12px] font-medium text-white/40 uppercase tracking-wider"
      : "text-[11px] font-semibold text-white/50 uppercase tracking-wider";

  const errorClass =
    variant === "auth"
      ? "mt-1.5 text-[12px] text-red-400"
      : "mt-1 text-[11px] text-rose-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={`block ${labelClass}`}>{label}</label>
        {hint && <span className="text-[10px] text-white/30">{hint}</span>}
      </div>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
