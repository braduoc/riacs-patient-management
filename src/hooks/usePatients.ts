import { useState, useMemo, useEffect } from "react";
import type { Patient, FormData, FormErrors } from "../types/patient";
import { SEED, EMPTY, validate } from "../services/patient.service";

type LoadingState = "idle" | "loading" | "acting" | "error";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  // Simular carga inicial de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setPatients(SEED);
        setLoadingState("idle");
        setError(null);
      } catch {
        setLoadingState("error");
        setError("Error al cargar los pacientes");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      (p) => `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) || p.rut.toLowerCase().includes(q)
    );
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const safeP = Math.min(page, totalPages);
  const rows = filtered.slice((safeP - 1) * 6, safeP * 6);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(p: Patient) {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      apellido: p.apellido,
      rut: p.rut,
      fechaNacimiento: p.fechaNacimiento,
      email: p.email,
      telefono: p.telefono,
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleFieldChange(key: keyof FormData, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSave() {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoadingState("acting");
    const timer = setTimeout(() => {
      try {
        if (editId !== null) {
          setPatients((prev) =>
            prev.map((p) => (p.id === editId ? { id: p.id, ...form } : p))
          );
        } else {
          const id = Math.max(0, ...patients.map((p) => p.id)) + 1;
          setPatients((prev) => [...prev, { id, ...form }]);
        }
        setModalOpen(false);
        setPage(1);
        setLoadingState("idle");
        setError(null);
      } catch {
        setLoadingState("error");
        setError("Error al guardar el paciente");
      }
    }, 600);

    return () => clearTimeout(timer);
  }

  function handleDelete() {
    if (!deleteTarget) return;

    setLoadingState("acting");
    const timer = setTimeout(() => {
      try {
        setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
        setLoadingState("idle");
        setError(null);
      } catch {
        setLoadingState("error");
        setError("Error al eliminar el paciente");
      }
    }, 600);

    return () => clearTimeout(timer);
  }

  return {
    patients,
    search,
    setSearch,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editId,
    form,
    setForm,
    errors,
    setErrors,
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
  };
}
