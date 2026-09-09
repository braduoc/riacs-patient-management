using Backend.Application.Dtos;
using Backend.Domain.Entities;

namespace Backend.Application.Patients;

public static class PatientMapper
{
    public static PatientDto ToDto(Patient patient) => new()
    {
        Id = patient.Id,
        FirstName = patient.FirstName,
        LastName = patient.LastName,
        RUT = patient.RUT,
        BirthDate = patient.BirthDate,
        Email = patient.Email,
        PhoneNumber = patient.PhoneNumber,
        CreatedAt = patient.CreatedAt
    };
}