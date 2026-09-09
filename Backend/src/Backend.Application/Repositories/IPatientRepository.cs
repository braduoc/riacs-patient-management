using Backend.Domain.Entities;

namespace Backend.Application.Repositories;

public interface IPatientRepository
{
    Task<(IEnumerable<Patient> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize, string? search = null);
    Task<Patient?> GetByIdAsync(int id);
    Task<Patient?> GetByRutAsync(string rut);
    Task<Patient> CreateAsync(Patient patient);
    Task UpdateAsync(Patient patient);
    Task DeleteAsync(int id);
    Task<bool> ExistsRutAsync(string rut, int? excludeId = null);
}