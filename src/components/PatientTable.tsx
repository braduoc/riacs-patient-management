import type { Patient } from "../types/patient";
import { formatDate, calcAge } from "../services/patient.service";
import { IcoChevL, IcoChevR, IcoDel, IcoEdit } from "./ui/icons";

interface PatientTableProps {
  rows: Patient[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  filtered: Patient[];
}

const PAGE_SIZE = 6;

export function PatientTable({
  rows,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  filtered,
}: PatientTableProps) {
  return (
    <>
      {/* ── Desktop table ── */}
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
              {[
                "Nombre y Apellido",
                "RUT",
                "Nacimiento / Edad",
                "Correo Electrónico",
                "Teléfono",
                "Acciones",
              ].map((h) => (
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
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 48,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 14,
                  }}
                >
                  No se encontraron pacientes.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600 }}>
                      {p.nombre} {p.apellido}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "13px 16px",
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  {p.rut}
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 13 }}>{formatDate(p.fechaNacimiento)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {calcAge(p.fechaNacimiento)} años
                  </div>
                </td>
                <td
                  style={{
                    padding: "13px 16px",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  {p.email}
                </td>
                <td
                  style={{
                    padding: "13px 16px",
                    whiteSpace: "nowrap",
                    fontSize: 13,
                  }}
                >
                  {p.telefono}
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => onEdit(p)}
                      title="Editar"
                      style={{
                        background: "var(--accent-bg)",
                        color: "var(--accent-light)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        width: 32,
                        height: 32,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(122,62,153,0.28)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--accent-bg)";
                      }}
                    >
                      <IcoEdit />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      title="Eliminar"
                      style={{
                        background: "var(--danger-bg)",
                        color: "var(--danger)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        width: 32,
                        height: 32,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239,68,68,0.22)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--danger-bg)";
                      }}
                    >
                      <IcoDel />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="show-mobile">
        {rows.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            No se encontraron pacientes.
          </div>
        )}
        {rows.map((p) => (
          <div
            key={p.id}
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
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: "'DM Sans',sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.nombre} {p.apellido}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "monospace",
                    }}
                  >
                    {p.rut}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => onEdit(p)}
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent-light)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IcoEdit />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  style={{
                    background: "var(--danger-bg)",
                    color: "var(--danger)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IcoDel />
                </button>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5px 12px",
                fontSize: 13,
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)" }}>Nac: </span>
                {formatDate(p.fechaNacimiento)} · {calcAge(p.fechaNacimiento)}{" "}
                años
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Tel: </span>
                {p.telefono}
              </div>
              <div
                style={{
                  gridColumn: "1/-1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Email: </span>
                {p.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                width: 32,
                height: 32,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.35 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
              }}
            >
              <IcoChevL />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                style={{
                  background: page === n ? "var(--accent)" : "var(--surface-2)",
                  color: page === n ? "#fff" : "var(--text)",
                  border: `1px solid ${
                    page === n ? "var(--accent)" : "var(--border-subtle)"
                  }`,
                  borderRadius: "var(--radius-sm)",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontWeight: page === n ? 700 : 400,
                  fontSize: 14,
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                width: 32,
                height: 32,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.35 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
              }}
            >
              <IcoChevR />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
