import type { Patient } from "../../types/patient";

interface DeletePatientDialogProps {
  patient: Patient | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeletePatientDialog({
  patient,
  onConfirm,
  onCancel,
}: DeletePatientDialogProps) {
  if (!patient) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(10,10,14,0.72)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto", // Permite scroll si la pantalla es muy pequeña
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: 400,
          boxShadow: "var(--shadow-modal)",
          border: "1px solid var(--border)",
          padding: "30px 28px 24px",
          display: "flex", // Centrado interno
          flexDirection: "column",
          alignItems: "center", // Centra icono, título y texto
          textAlign: "center",  // Alinea el texto al centro
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-pill)",
            background: "var(--danger-bg)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--danger)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 700,
            fontSize: 19,
            margin: "0 0 8px",
          }}
        >
          Eliminar Paciente
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            margin: "0 0 22px",
            lineHeight: 1.65,
          }}
        >
          ¿Confirma que desea eliminar a{" "}
          <strong style={{ color: "var(--text)" }}>
            {patient.firstName} {patient.lastName}
          </strong>{" "}
          ({patient.rut})? Esta acción no se puede deshacer.
        </p>
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: "transparent",
              color: "var(--text-muted)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              padding: 11,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: "var(--danger)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-pill)",
              padding: 11,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}