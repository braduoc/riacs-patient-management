using Backend.Application.Repositories;
using Backend.Domain.Entities;
using Backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly ApplicationDbContext _context;

    public PatientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Patient> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize, string? search = null)
    {
        var query = _context.Patients.AsNoTracking();

        // Filter by search term (optional)
        if (!string.IsNullOrWhiteSpace(search))
        {
            string term = search.Trim().ToLower();
            query = query.Where(p => 
                p.FirstName.ToLower().Contains(term) || 
                p.LastName.ToLower().Contains(term) || 
                p.RUT.Contains(term));
        }

        // Count total records matching the filter
        int totalRecords = await query.CountAsync();

        // Pagination in database using Skip and Take
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalRecords);
    }

    public async Task<Patient?> GetByIdAsync(int id)
    {
        return await _context.Patients.FindAsync(id);
    }

    public async Task<Patient?> GetByRutAsync(string rut)
    {
        return await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.RUT == rut);
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var patient = await GetByIdAsync(id);
        if (patient != null)
        {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsRutAsync(string rut, int? excludeId = null)
    {
        return await _context.Patients
            .AnyAsync(p => p.RUT == rut && (!excludeId.HasValue || p.Id != excludeId.Value));
    }
}
