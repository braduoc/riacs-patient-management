export const PhoneValidatorHelper = {
  /**
   * Valida si un texto corresponde a un teléfono chileno válido.
   * Acepta números locales de 9 dígitos o internacionales (+56/56).
   */
  validate(phone: string): boolean {
    if (!phone || !phone.trim()) return false;
    
    // Limpia caracteres innecesarios manteniendo solo números y '+'
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    
    // Expresión regular: Valida 9 dígitos locales o con prefijo +56 / 56
    const CHILE_PHONE_REGEX = /^(\+?56)?(9\d{8}|[2-8]\d{8})$/;
    
    return CHILE_PHONE_REGEX.test(cleanPhone);
  },

  format(phone: string): string {
    if (!phone || !phone.trim()) return "";

    const clean = phone.trim();
    const digits = clean.replace(/\D/g, "");

    // Si incluyeron el prefijo de país (+56 / 56)
    if (digits.length === 11 && digits.startsWith("56")) {
      const numberPart = digits.slice(2);
      const prefix = clean.startsWith("+") ? "+56" : "56";
      return `${prefix} ${numberPart[0]} ${numberPart.slice(1, 5)} ${numberPart.slice(5)}`;
    }

    // Si ingresaron solo los 9 dígitos sin prefijo (ej: 912345678)
    if (digits.length === 9) {
      return `${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`;
    }

    return clean; // Retorna la entrada original si no coincide con los patrones
  },
};