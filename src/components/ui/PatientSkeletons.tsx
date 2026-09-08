import { Skeleton } from "./Skeleton";

export function PatientTableSkeleton() {
  return (
    <div style={{ overflowX: "auto" }} className="hidden-mobile">
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          minWidth: 700,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-subtle)" }}>
            {["Nombre y Apellido", "RUT", "Nacimiento / Edad", "Correo Electrónico", "Teléfono", "Acciones"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <td key={j} style={{ padding: "13px 16px" }}>
                  <Skeleton height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PatientCardsSkeleton() {
  return (
    <div className="show-mobile">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ marginBottom: 8 }}>
                  <Skeleton height={16} />
                </div>
                <Skeleton height={12} width="70%" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <Skeleton width={32} height={32} borderRadius="var(--radius-sm)" />
              <Skeleton width={32} height={32} borderRadius="var(--radius-sm)" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
