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

        string clean = raw.Replace(".", string.Empty)
            .Replace("-", string.Empty)
            .Trim()
            .ToUpperInvariant();

        if (clean.Length < 8 || clean.Length > 9)
            throw new InvalidRutException(raw);

        string body = clean[..^1];
        char providedCheckDigit = clean[^1];

        if (!long.TryParse(body, NumberStyles.None, CultureInfo.InvariantCulture, out long number)
            || (providedCheckDigit < '0' || providedCheckDigit > '9') && providedCheckDigit != 'K')
        {
            throw new InvalidRutException(raw);
        }

        char calculatedCheckDigit = CalculateCheckDigit(number);
        if (providedCheckDigit != calculatedCheckDigit)
            throw new InvalidRutException(raw);

        string formattedBody = number.ToString("N0", CultureInfo.InvariantCulture)
            .Replace(",", ".");

        return new Rut($"{formattedBody}-{calculatedCheckDigit}");
    }

    public bool Equals(Rut? other) => other is not null && Value == other.Value;

    public override bool Equals(object? obj) => obj is Rut other && Equals(other);

    public override int GetHashCode() => Value.GetHashCode(StringComparison.Ordinal);

    public override string ToString() => Value;

    private static char CalculateCheckDigit(long number)
    {
        int sum = 0;
        int multiplier = 2;

        while (number > 0)
        {
            sum += (int)(number % 10) * multiplier;
            number /= 10;
            multiplier = multiplier == 7 ? 2 : multiplier + 1;
        }

        int remainder = 11 - (sum % 11);
        return remainder switch
        {
            11 => '0',
            10 => 'K',
            _ => (char)('0' + remainder)
        };
    }
}