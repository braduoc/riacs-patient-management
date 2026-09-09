import { useState } from "react";
import type { FormData, Patient } from "../types/patient";
import { patientApi } from "../services/patient.api";

interface UsePatientMutationsParams {
  editId: number | null;
  form: FormData;
  deleteTarget: Patient | null;
  validateForm: () => boolean;
  closeForm: () => void;
  clearDeleteTarget: () => void;
  resetToFirstPage: () => void;
  refetch: () => Promise<void>;
  invalidateCache: () => void;
}

export function usePatientMutations({
  editId,
  form,
  deleteTarget,
  validateForm,
  closeForm,
  clearDeleteTarget,
  resetToFirstPage,
  refetch,
  invalidateCache,
}: UsePatientMutationsParams) {
  const [loadingState, setLoadingState] = useState<"idle" | "acting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
    setLoadingState("idle");
  }

  async function handleSave() {
    clearError();
    if (!validateForm()) return;

    setLoadingState("acting");
    setError(null);
    try {
      if (editId !== null) {
        await patientApi.update(editId, form);
      } else {
        await patientApi.create(form);
        resetToFirstPage();
      }
      closeForm();
      invalidateCache();
      await refetch();
      setLoadingState("idle");
    } catch (err) {
      setLoadingState("error");
      setError(err instanceof Error ? err.message : "Error al guardar el paciente");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setLoadingState("acting");
    setError(null);
    try {
      await patientApi.delete(deleteTarget.id);
      clearDeleteTarget();
      invalidateCache();
      await refetch();
      setLoadingState("idle");
    } catch (err) {
      setLoadingState("error");
      setError(err instanceof Error ? err.message : "Error al eliminar el paciente");
    }
  }

  return { handleSave, handleDelete, loadingState, error, clearError };
}