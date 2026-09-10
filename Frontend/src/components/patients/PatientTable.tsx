import { memo } from "react";
import type { Patient } from "../../types/patient";
import { formatDate, calcAge } from "../../utils/date.utils";
import { IcoChevL, IcoChevR, IcoDel, IcoEdit } from "../ui/icons";
import styles from "./PatientTable.module.css";

interface PatientTableProps {
  rows: Patient[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

// Botón de número de página memorizado
const PageButton = memo(
  ({
    n,
    active,
    onClick,
  }: {
    n: number;
    active: boolean;
    onClick: (page: number) => void;
  }) => (
    <button
      onClick={() => !active && onClick(n)}
      disabled={active}
      style={{
        background: active ? "var(--accent)" : "var(--surface-2)",
        color: active ? "#fff" : "var(--text)",
        border: `1px solid ${
          active ? "var(--accent)" : "var(--border-subtle)"
        }`,
        borderRadius: "var(--radius-sm)",
        width: 32,
        height: 32,
        cursor: active ? "default" : "pointer",
        fontWeight: active ? 700 : 400,
        fontSize: 14,
      }}
    >
      {n}
    </button>
  )
);

PageButton.displayName = "PageButton";

function getVisiblePages(
  page: number,
  totalPages: number,
  maxVisiblePages: 7 | 3 = 7,
): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (maxVisiblePages === 3) {
    if (page === 1) return [1, 2, "ellipsis-right", totalPages];
    if (page === totalPages) return [1, "ellipsis-left", totalPages - 1, totalPages];
    return [1, "ellipsis-left", page, "ellipsis-right", totalPages];
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  }

  if (page >= totalPages - 3) {
    return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-left", page - 1, page, page + 1, "ellipsis-right", totalPages];
}

export function PatientTable({
  rows,
  page,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onEdit,
  onDelete,
}: PatientTableProps) {
  // Cálculo de rangos dinámico basado en los datos del servidor
  const startItem = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalRecords);
  const visiblePages = getVisiblePages(page, totalPages);
  const mobileVisiblePages = getVisiblePages(page, totalPages, 3);

  const renderPageItems = (items: Array<number | "ellipsis-left" | "ellipsis-right">) =>
    items.map((item) =>
      typeof item === "number" ? (
        <PageButton
          key={item}
          n={item}
          active={page === item}
          onClick={onPageChange}
        />
      ) : (
        <span
          key={item}
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          …
        </span>
      ),
    );

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
                className={styles.row}
              >
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600 }}>
                      {p.firstName} {p.lastName}
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
                  <div style={{ fontSize: 13 }}>{formatDate(p.birthDate)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {calcAge(p.birthDate)} años
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
                  {p.phone}
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => onEdit(p)}
                      title="Editar"
                      className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                    >
                      <IcoEdit />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      title="Eliminar"
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
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
                    {p.firstName} {p.lastName}
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
                  title="Editar"
                  className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                >
                  <IcoEdit />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  title="Eliminar"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
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
                {formatDate(p.birthDate)} · {calcAge(p.birthDate)} años
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Tel: </span>
                {p.phone}
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

      {/* ── Server Pagination ── */}
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
            {startItem}–{endItem} de {totalRecords}
          </span>
          <div className={styles.desktopPagination} style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => page > 1 && onPageChange(page - 1)}
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

            {renderPageItems(visiblePages)}

            <button
              onClick={() => page < totalPages && onPageChange(page + 1)}
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
          <div className={styles.mobilePagination} style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => page > 1 && onPageChange(page - 1)}
              disabled={page === 1}
              aria-label="Página anterior"
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
            {renderPageItems(mobileVisiblePages)}
            <button
              onClick={() => page < totalPages && onPageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Página siguiente"
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