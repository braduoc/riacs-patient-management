using Backend.Application.Dtos;

namespace Backend.Application.Patients;

public interface IPatientService
{
    Task<(IEnumerable<PatientDto> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize, string? search = null);
    Task<PatientDto> GetByIdAsync(int id);
    Task<PatientDto> CreateAsync(CreatePatientDto createDto);
    Task UpdateAsync(int id, UpdatePatientDto updateDto);
    Task PatchAsync(int id, PatchPatientDto patchDto);
    Task DeleteAsync(int id);
}