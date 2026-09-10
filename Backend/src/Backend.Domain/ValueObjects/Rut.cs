using System.Globalization;
using Backend.Domain.Exceptions;

namespace Backend.Domain.ValueObjects;

public sealed class Rut : IEquatable<Rut>
{
    private Rut(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Rut Create(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            throw new InvalidRutException(raw);

        // Normaliza el RUT: quita puntos, guiones y espacios, y pasa la 'k' a mayúscula
        string clean = raw.Replace(".", string.Empty)
            .Replace("-", string.Empty)
            .Trim()
            .ToUpperInvariant();

        // Un RUT chileno válido tiene entre 7 y 8 dígitos en el cuerpo + 1 dígito verificador
        if (clean.Length < 8 || clean.Length > 9)
            throw new InvalidRutException(raw);

        // Separa el cuerpo numérico del dígito verificador (el último carácter)
        string body = clean[..^1];
        char providedCheckDigit = clean[^1];

        if (!long.TryParse(body, NumberStyles.None, CultureInfo.InvariantCulture, out long number)
            || (providedCheckDigit < '0' || providedCheckDigit > '9') && providedCheckDigit != 'K')
        {
            throw new InvalidRutException(raw);
        }

      

        // Formatea el RUT sin puntos, solo con guion antes del dígito verificador (ej: 12345678-5)
        string formattedBody = number.ToString(CultureInfo.InvariantCulture);

        return new Rut($"{formattedBody}-{providedCheckDigit}");
    }

    public bool Equals(Rut? other) => other is not null && Value == other.Value;

    public override bool Equals(object? obj) => obj is Rut other && Equals(other);

    public override int GetHashCode() => Value.GetHashCode(StringComparison.Ordinal);

    public override string ToString() => Value;

    /// <summary>
    /// Calcula el dígito verificador de un RUT chileno usando el algoritmo módulo 11.
    /// El algoritmo:
    /// 1. Recorre los dígitos del cuerpo del RUT de derecha a izquierda.
    /// 2. Multiplica cada dígito por un factor cíclico que va de 2 a 7 (2,3,4,5,6,7,2,3,...).
    /// 3. Suma todos los productos.
    /// 4. Calcula 11 menos el resto de esa suma dividida por 11.
    /// 5. El resultado se traduce así:
    ///    - Si da 11 -> el dígito verificador es '0'
    ///    - Si da 10 -> el dígito verificador es 'K'
    ///    - En cualquier otro caso -> el dígito verificador es ese mismo número (0-9)
    /// </summary>
    // private static char CalculateCheckDigit(long number)
    // {
    //     int sum = 0;
    //     int multiplier = 2; 

    //     while (number > 0)
    //     {
    //         sum += (int)(number % 10) * multiplier;
    //         number /= 10;

    //         multiplier = multiplier == 7 ? 2 : multiplier + 1;
    //     }

    //     int remainder = 11 - (sum % 11);
    //     return remainder switch
    //     {
    //         11 => '0', 
    //         10 => 'K',
    //         _ => (char)('0' + remainder) 
    //     };
    // }
}