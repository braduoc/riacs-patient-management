import type { FormData } from "../types/patient";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (k: keyof FormData, v: string) => void;
}) {
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
        value={value}
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
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}
