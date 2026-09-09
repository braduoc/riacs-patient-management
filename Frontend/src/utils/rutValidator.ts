export const RutValidatorHelper = {
  /**
   * Valida formato y dígito verificador según Módulo 11
   */
  validate(rut: string): boolean {
    if (!rut || !rut.trim()) return false;

    // Limpia puntos y guiones, convierte a mayúsculas
    const clean = rut.replace(/[.-]/g, "").trim().toUpperCase();
    if (clean.length < 8 || clean.length > 9) return false;

    const body = clean.slice(0, -1);
    const checkDigitProvided = clean.slice(-1);

    if (!/^\d+$/.test(body)) return false;

    const checkDigitExpected = this.calculateCheckDigit(parseInt(body, 10));
    return checkDigitProvided === checkDigitExpected;
  },

  /**
   * Formatea un RUT chileno a formato X.XXX.XXX-X
   */
  format(rut: string): string {
    if (!rut || !rut.trim()) return "";
    const clean = rut.replace(/[.-]/g, "").trim().toUpperCase();
    if (clean.length < 8) return rut;

    const body = clean.slice(0, -1);
    const checkDigit = clean.slice(-1);

    const formattedBody = new Intl.NumberFormat("es-CL").format(parseInt(body, 10));
    return `${formattedBody}-${checkDigit}`;
  },

  /**
   * Algoritmo Módulo 11 para calcular el dígito verificador
   */
  calculateCheckDigit(rutNumeric: number): string {
    let sum = 0;
    let multiplier = 2;
    let tempRut = rutNumeric;

    while (tempRut > 0) {
      sum += (tempRut % 10) * multiplier;
      tempRut = Math.floor(tempRut / 10);
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = 11 - (sum % 11);

    if (remainder === 11) return "0";
    if (remainder === 10) return "K";
    return remainder.toString();
  }
};