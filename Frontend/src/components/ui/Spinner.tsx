export function Spinner() {
  return (
    <div
      style={{
        display: "inline-block",
        width: 20,
        height: 20,
        border: "3px solid rgba(122, 62, 153, 0.2)",
        borderTop: "3px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
