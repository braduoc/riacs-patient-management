using Backend.Application.Dtos;
using Backend.Application.Exceptions;
using Backend.Application.Repositories;
using Backend.Domain.Entities;
using Backend.Domain.ValueObjects;

namespace Backend.Application.Patients;

public sealed class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;

    public PatientService(IPatientRepository repository)
    {
        _repository = repository;
    }

    public async Task<(IEnumerable<PatientDto> Items, int TotalRecords)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? search = null)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize < 1 || pageSize > 100 ? 10 : pageSize;

        var (items, totalRecords) = await _repository.GetPagedAsync(pageNumber, pageSize, search);
        return (items.Select(PatientMapper.ToDto), totalRecords);
    }

    public async Task<PatientDto> GetByIdAsync(int id)
    {
        Patient patient = await GetPatientOrThrowAsync(id);
        return PatientMapper.ToDto(patient);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto createDto)
    {
        Rut rut = Rut.Create(createDto.RUT);
        if (await _repository.ExistsRutAsync(rut.Value))
            throw new RutAlreadyExistsException("A patient with this RUT is already registered.");

        var patient = new Patient
        {
            FirstName = createDto.FirstName.Trim(),
            LastName = createDto.LastName.Trim(),
            RUT = rut.Value,
            BirthDate = createDto.BirthDate,
            Email = createDto.Email.Trim().ToLowerInvariant(),
            PhoneNumber = createDto.PhoneNumber?.Trim() ?? string.Empty
        };

        Patient createdPatient = await _repository.CreateAsync(patient);
        return PatientMapper.ToDto(createdPatient);
    }

    public async Task UpdateAsync(int id, UpdatePatientDto updateDto)
    {
        Patient patient = await GetPatientOrThrowAsync(id);
        Rut rut = Rut.Create(updateDto.RUT);

        if (await _repository.ExistsRutAsync(rut.Value, excludeId: id))
            throw new RutAlreadyExistsException("The provided RUT belongs to another patient.");

        patient.FirstName = updateDto.FirstName.Trim();
        patient.LastName = updateDto.LastName.Trim();
        patient.RUT = rut.Value;
        patient.BirthDate = updateDto.BirthDate;
        patient.Email = updateDto.Email.Trim().ToLowerInvariant();
        patient.PhoneNumber = updateDto.PhoneNumber?.Trim() ?? string.Empty;

        await _repository.UpdateAsync(patient);
    }

    public async Task PatchAsync(int id, PatchPatientDto patchDto)
    {
        Patient patient = await GetPatientOrThrowAsync(id);

        if (!string.IsNullOrWhiteSpace(patchDto.FirstName))
            patient.FirstName = patchDto.FirstName.Trim();

        if (!string.IsNullOrWhiteSpace(patchDto.LastName))
            patient.LastName = patchDto.LastName.Trim();

        if (!string.IsNullOrWhiteSpace(patchDto.RUT))
        {
            Rut rut = Rut.Create(patchDto.RUT);
            if (await _repository.ExistsRutAsync(rut.Value, excludeId: id))
                throw new RutAlreadyExistsException("The provided RUT belongs to another patient.");

            patient.RUT = rut.Value;
        }

        if (patchDto.BirthDate.HasValue)
            patient.BirthDate = patchDto.BirthDate.Value;

        if (!string.IsNullOrWhiteSpace(patchDto.Email))
            patient.Email = patchDto.Email.Trim().ToLowerInvariant();

        if (patchDto.PhoneNumber != null)
            patient.PhoneNumber = patchDto.PhoneNumber.Trim();

        await _repository.UpdateAsync(patient);
    }

    public async Task DeleteAsync(int id)
    {
        _ = await GetPatientOrThrowAsync(id);
        await _repository.DeleteAsync(id);
    }

    private async Task<Patient> GetPatientOrThrowAsync(int id)
    {
        return await _repository.GetByIdAsync(id)
            ?? throw new PatientNotFoundException(id);
    }
}