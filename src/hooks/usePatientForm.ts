import { useState } from "react";
import type { FormData, FormErrors, Patient } from "../types/patient";
import { EMPTY, validate } from "../validators/patientForm.validator";

export function usePatientForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(patient: Patient) {
    setEditId(patient.id);
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      rut: patient.rut,
      birthDate: patient.birthDate,
      email: patient.email,
      phone: patient.phone,
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleFieldChange(key: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validateForm() {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return {
    modalOpen,
    setModalOpen,
    editId,
    form,
    errors,
    openCreate,
    openEdit,
    handleFieldChange,
    validateForm,
  };
}