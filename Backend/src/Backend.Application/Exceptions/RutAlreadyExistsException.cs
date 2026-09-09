namespace Backend.Application.Exceptions;

public sealed class RutAlreadyExistsException : Exception
{
    public RutAlreadyExistsException(string message)
        : base(message)
    {
    }
}