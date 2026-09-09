import type { FormData, FormErrors } from "../types/patient";
import { PhoneValidatorHelper } from "../utils/phoneValidator";
import { RutValidatorHelper } from "../utils/rutValidator";

export const EMPTY: FormData = {
  firstName: "",
  lastName: "",
  rut: "",
  birthDate: "",
  email: "",
  phone: "",
};

export function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.firstName || !form.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio.";
  }

  if (!form.lastName || !form.lastName.trim()) {
    errors.lastName = "El apellido es obligatorio.";
  }

  if (!form.rut || !form.rut.trim()) {
    errors.rut = "El RUT es obligatorio.";
  } else if (!RutValidatorHelper.validate(form.rut)) {
    errors.rut = "El RUT ingresado no es válido.";
  }

  if (!form.birthDate) {
    errors.birthDate = "La fecha de nacimiento es obligatoria.";
  } else {
    const today = new Date().toLocaleDateString("sv-SE");
    if (form.birthDate > today) {
      errors.birthDate = "La fecha de nacimiento no puede ser futura.";
    }
  }

  if (!form.email || !form.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "El correo electrónico no es válido.";
  }

  if (form.phone && form.phone.trim() && !PhoneValidatorHelper.validate(form.phone)) {
    errors.phone = "El número de teléfono no es válido.";
  }

  return errors;
}