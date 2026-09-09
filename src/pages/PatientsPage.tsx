import { useState } from "react";
import { usePatientsList } from "../hooks/usePatientsList";
import { usePatientForm } from "../hooks/usePatientForm";
import { usePatientMutations } from "../hooks/usePatientMutations";
import type { Patient } from "../types/patient";
import { PatientTable } from "../components/patients/PatientTable";
import { PatientModal } from "../components/patients/PatientModal";
import { DeletePatientDialog } from "../components/patients/DeletePatientDialog";
import { IcoPlus, IcoSearch } from "../components/ui/icons";
import { PatientTableSkeleton, PatientCardsSkeleton } from "../components/ui/PatientSkeletons";
import { Spinner } from "../components/ui/Spinner";

export function PatientsPage() {
    const list = usePatientsList();
    const formState = usePatientForm();
    const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
    const mutations = usePatientMutations({
        editId: formState.editId,
        form: formState.form,
        deleteTarget,
        validateForm: formState.validateForm,
        closeForm: () => formState.setModalOpen(false),
        clearDeleteTarget: () => setDeleteTarget(null),
        resetToFirstPage: () => list.setPage(1),
        refetch: list.refetch,
        invalidateCache: list.invalidateCache,
    });
    const loadingState = mutations.loadingState === "acting" ? "acting" : list.loadingState;
    const error = mutations.error || list.error;

    const { search, setSearch, setPage, totalPages, totalRecords, pageSize, safeP, rows, refetch, } = list;
    const {
        modalOpen, setModalOpen, editId, form, errors, openCreate, openEdit,
        handleFieldChange,
    } = formState;
    const { handleSave, handleDelete, clearError } = mutations;

    const handleCreate = () => {
        clearError();
        openCreate();
    };

    const handleEdit = (patient: Patient) => {
        clearError();
        openEdit(patient);
    };

    const handleCloseModal = () => {
        clearError();
        setModalOpen(false);
    };

    const handleModalFieldChange = (key: Parameters<typeof handleFieldChange>[0], value: string) => {
        clearError();
        handleFieldChange(key, value);
    };

    return (
        <div
            style={{
                background: `var(--bg) url("https://riacs.cl/wp-content/uploads/vector-fondo-riacs.svg")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
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
                        height: 70,
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
                                height: "45px",
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
                            {totalRecords}
                        </span>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={loadingState === "acting"}
                        style={{
                            background: "var(--accent)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "var(--radius-pill)",
                            padding: "10px 20px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: loadingState !== "acting" ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontFamily: "'DM Sans',sans-serif",
                            transition: "background 0.15s",
                            opacity: loadingState !== "acting" ? 1 : 0.7,
                        }}
                        onMouseEnter={(e) => {
                            if (loadingState !== "acting") {
                                e.currentTarget.style.background = "var(--accent-hover)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (loadingState !== "acting") {
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
                                onClick={refetch}
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

                    {loadingState !== "loading" && loadingState !== "error" && (
                        <PatientTable
                            rows={rows}
                            page={safeP}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                            onPageChange={setPage}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
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
                error={error}
                onClose={handleCloseModal}
                onFieldChange={handleModalFieldChange}
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