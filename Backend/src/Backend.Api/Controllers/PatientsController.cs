using Backend.Application.Dtos;
using Backend.Application.Patients;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<PatientDto>>> GetPaged(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        var (items, totalRecords) = await _service.GetPagedAsync(pageNumber, pageSize, search);
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize < 1 || pageSize > 100 ? 10 : pageSize;

        return Ok(new PagedResponseDto<PatientDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PatientDto>> GetById(int id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> Create([FromBody] CreatePatientDto createDto)
    {
        PatientDto patient = await _service.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto updateDto)
    {
        await _service.UpdateAsync(id, updateDto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Patch(int id, [FromBody] PatchPatientDto patchDto)
    {
        await _service.PatchAsync(id, patchDto);
        return NoContent();
    }
}