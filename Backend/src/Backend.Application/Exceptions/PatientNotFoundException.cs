namespace Backend.Application.Exceptions;

public sealed class PatientNotFoundException : Exception
{
    public PatientNotFoundException(int id)
        : base($"Patient with ID {id} was not found")
    {
    }
}