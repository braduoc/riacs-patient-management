namespace Backend.Domain.Exceptions;

public sealed class InvalidRutException : DomainException
{
    public InvalidRutException(string rawRut)
        : base($"The provided RUT '{rawRut}' is invalid.")
    {
    }
}

public abstract class DomainException : Exception
{
    protected DomainException(string message)
        : base(message)
    {
    }
}