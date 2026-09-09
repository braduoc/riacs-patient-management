using System.ComponentModel.DataAnnotations;

namespace Backend.Application.Dtos;

public class PatchPatientDto
{
    [StringLength(100)]
    public string? FirstName { get; set; }

    [StringLength(100)]
    public string? LastName { get; set; }

    public string? RUT { get; set; }

    public DateTime? BirthDate { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }
}