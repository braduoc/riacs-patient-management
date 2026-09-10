export const RutValidatorHelper = {
  /**
   * Valida formato del RUT (largo y que el cuerpo sea numérico).
   * ⚠️ La validación del dígito verificador está deshabilitada (ver calculateCheckDigit comentado).
   */
  validate(rut: string): boolean {
    if (!rut || !rut.trim()) return false;

    // Limpia puntos y guiones, convierte a mayúsculas
    const clean = rut.replace(/[.-]/g, "").trim().toUpperCase();
    if (clean.length < 8 || clean.length > 9) return false;

    const body = clean.slice(0, -1);
    const checkDigitProvided = clean.slice(-1);

    if (!/^\d+$/.test(body)) return false;

    if (!/^[0-9K]$/.test(checkDigitProvided)) return false;

    // const checkDigitExpected = this.calculateCheckDigit(parseInt(body, 10));
    // return checkDigitProvided === checkDigitExpected;

    return true;
  },

  /**
   * Formatea un RUT chileno sin puntos, solo con guion antes del dígito verificador (ej: 12345678-5)
   */
  format(rut: string): string {
    if (!rut || !rut.trim()) return "";
    const clean = rut.replace(/[.-]/g, "").trim().toUpperCase();
    if (clean.length < 8) return rut;

    const body = clean.slice(0, -1);
    const checkDigit = clean.slice(-1);

    return `${body}-${checkDigit}`;
  },

  /**
   * Algoritmo Módulo 11 para calcular el dígito verificador.
   * 1. Recorre los dígitos del cuerpo del RUT de derecha a izquierda.
   * 2. Multiplica cada dígito por un factor cíclico que va de 2 a 7 (2,3,4,5,6,7,2,3,...).
   * 3. Suma todos los productos.
   * 4. Calcula 11 menos el resto de esa suma dividida por 11.
   * 5. El resultado se traduce así:
   *    - Si da 11 -> el dígito verificador es '0'
   *    - Si da 10 -> el dígito verificador es 'K'
   *    - En cualquier otro caso -> el dígito verificador es ese mismo número (0-9)
   *
   */
  // calculateCheckDigit(rutNumeric: number): string {
  //   let sum = 0;
  //   let multiplier = 2;
  //   let tempRut = rutNumeric;

  //   while (tempRut > 0) {
  //     sum += (tempRut % 10) * multiplier;
  //     tempRut = Math.floor(tempRut / 10);
  //     multiplier = multiplier === 7 ? 2 : multiplier + 1;
  //   }

  //   const remainder = 11 - (sum % 11);

  //   if (remainder === 11) return "0";
  //   if (remainder === 10) return "K";
  //   return remainder.toString();
  // }
};