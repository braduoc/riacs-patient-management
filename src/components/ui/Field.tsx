import type { FormData } from "../../types/patient";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  max,
  maxLength,
  onBlur,
  onChange,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  max?: string;
  maxLength?: number;
  onBlur?: () => void;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  // Limpia valores de tipo fecha para asegurar el formato estricto YYYY-MM-DD
  const formattedValue =
    type === "date" && typeof value === "string" && value.includes("T")
      ? value.split("T")[0]
      : value ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={formattedValue}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        style={{
          background: "var(--bg)",
          border: `1.5px solid ${error ? "var(--danger)" : "var(--border)"}`,
          borderRadius: "var(--radius-sm)",
          padding: "10px 13px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          width: "100%",
          fontFamily: "'Inter',sans-serif",
          transition: "border-color 0.15s",
          colorScheme: "dark",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? "var(--danger)"
            : "var(--accent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "var(--danger)"
            : "var(--border)";
          
          // Ejecuta la función onBlur personalizada si se envió (ej. formatear RUT)
          if (onBlur) onBlur();
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}