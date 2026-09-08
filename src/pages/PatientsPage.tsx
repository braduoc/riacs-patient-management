import { usePatients } from "../hooks/usePatients";
import { PatientTable } from "../components/PatientTable";
import { PatientModal } from "../components/PatientModal";
import { DeletePatientDialog } from "../components/DeletePatientDialog";
import { IcoPlus, IcoSearch } from "../components/ui/icons";
import { PatientTableSkeleton, PatientCardsSkeleton } from "../components/ui/PatientSkeletons";
import { Spinner } from "../components/ui/Spinner";

export function PatientsPage() {
  const {
    patients,
    search,
    setSearch,
    setPage,
    modalOpen,
    setModalOpen,
    editId,
    form,
    errors,
    deleteTarget,
    setDeleteTarget,
    filtered,
    totalPages,
    safeP,
    rows,
    openCreate,
    openEdit,
    handleFieldChange,
    handleSave,
    handleDelete,
    loadingState,
    error,
  } = usePatients();

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 20px",
            height: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <img
              src="https://riacs.cl/wp-content/uploads/Logo_RIACS-final-Manuel-Alfaro.svg"
              alt="RIACS Health"
              style={{
                height: "42px",
                width: "auto",
                marginLeft: "5px",
              }}
            />
            
          </div>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {/* Title + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: 22,
                margin: 0,
                color: "var(--text)",
              }}
            >
              Gestión de Pacientes
            </h1>
            <span
              style={{
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "var(--radius-pill)",
                padding: "2px 11px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {patients.length}
            </span>
          </div>
          <button
            onClick={openCreate}
            disabled={loadingState !== "idle"}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-pill)",
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: loadingState === "idle" ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "'DM Sans',sans-serif",
              transition: "background 0.15s",
              opacity: loadingState === "idle" ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              if (loadingState === "idle") {
                e.currentTarget.style.background = "var(--accent-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (loadingState === "idle") {
                e.currentTarget.style.background = "var(--accent)";
              }
            }}
          >
            {loadingState === "acting" ? (
              <>
                <Spinner /> Procesando...
              </>
            ) : (
              <>
                <IcoPlus /> Registrar Paciente
              </>
            )}
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 18, maxWidth: 340 }}>
          <span
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            <IcoSearch />
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre o RUT…"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              padding: "9px 16px 9px 38px",
              fontSize: 14,
              color: "var(--text)",
              outline: "none",
              width: "100%",
              fontFamily: "'Inter',sans-serif",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />
        </div>

        {/* Card wrapper */}
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          {loadingState === "loading" && (
            <>
              <PatientTableSkeleton />
              <PatientCardsSkeleton />
            </>
          )}

          {loadingState === "error" && (
            <div
              style={{
                padding: 48,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, color: "var(--danger)", fontWeight: 600 }}>
                {error || "Error al cargar los pacientes"}
              </div>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: 16,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {loadingState === "idle" && (
            <PatientTable
              rows={rows}
              page={safeP}
              totalPages={totalPages}
              onPageChange={setPage}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              filtered={filtered}
            />
          )}
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <PatientModal
        isOpen={modalOpen}
        isEditing={editId !== null}
        form={form}
        errors={errors}
        onClose={() => setModalOpen(false)}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />

      <DeletePatientDialog
        patient={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}