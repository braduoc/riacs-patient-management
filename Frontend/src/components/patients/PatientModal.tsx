import type { FormData, FormErrors } from "../../types/patient";
import { Field } from "../ui/Field";
import { IcoClose } from "../ui/icons";
import { RutValidatorHelper } from "../../utils/rutValidator";
import { PhoneValidatorHelper } from "../../utils/phoneValidator";

interface PatientModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: FormData;
  errors: FormErrors;
  error?: string | null;
  onClose: () => void;
  onFieldChange: (key: keyof FormData, value: string) => void;
  onSave: () => void;
}

export function PatientModal({
  isOpen,
  isEditing,
  form,
  errors,
  error,
  onClose,
  onFieldChange,
  onSave,
}: PatientModalProps) {
  if (!isOpen) return null;

  // Límite local para evitar fechas futuras en el selector nativo (YYYY-MM-DD)
  const today = new Date().toLocaleDateString("sv-SE");

  // Auto-formateo del RUT al perder el foco
  const handleRutBlur = () => {
    if (form.rut && form.rut.trim()) {
      const formattedRut = RutValidatorHelper.format(form.rut);
      onFieldChange("rut", formattedRut);
    }
  };

  // Auto-formateo del Teléfono sin forzar prefijos ni procesar campos vacíos
  const handlePhoneBlur = () => {
    if (form.phone && form.phone.trim()) {
      const formattedPhone = PhoneValidatorHelper.format(form.phone);
      onFieldChange("phone", formattedPhone);
    }
  };

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
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: 520,
          boxShadow: "var(--shadow-modal)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: 19,
                margin: 0,
              }}
            >
              {isEditing ? "Editar Paciente" : "Registrar Paciente"}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                margin: "4px 0 0",
              }}
            >
              {isEditing
                ? "Modifique los datos del paciente."
                : "Complete los campos para el registro."}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-pill)",
              width: 34,
              height: 34,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            <IcoClose />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              margin: "16px 24px 0",
              padding: "10px 12px",
              color: "var(--danger)",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger)",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field
              label="Nombre"
              name="firstName"
              placeholder="Ej: Valentina"
              value={form.firstName}
              error={errors.firstName}
              onChange={onFieldChange}
            />
            <Field
              label="Apellido"
              name="lastName"
              placeholder="Ej: Morales Soto"
              value={form.lastName}
              error={errors.lastName}
              onChange={onFieldChange}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field
              label="RUT"
              name="rut"
              placeholder="12345678-9"
              maxLength={12}
              value={form.rut}
              error={errors.rut}
              onChange={onFieldChange}
              onBlur={handleRutBlur}
            />
            <Field
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              max={today}
              value={form.birthDate}
              error={errors.birthDate}
              onChange={onFieldChange}
            />
          </div>
          <Field
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="correo@mail.cl"
            value={form.email}
            error={errors.email}
            onChange={onFieldChange}
          />
          <Field
            label="Teléfono"
            name="phone"
            type="tel"
            placeholder="9 XXXX XXXX o +56 9 XXXX XXXX"
            maxLength={15}
            value={form.phone}
            error={errors.phone}
            onChange={onFieldChange}
            onBlur={handlePhoneBlur}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px 20px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              color: "var(--text-muted)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              transition: "opacity 0.15s",
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
            type="button"
            onClick={onSave}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-pill)",
              padding: "10px 26px",
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
            {isEditing ? "Actualizar" : "Guardar Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}