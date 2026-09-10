using Backend.Application.Exceptions;
using Backend.Domain.Exceptions;

namespace Backend.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (InvalidRutException exception)
        {
            _logger.LogWarning(exception, "RUT inválido al procesar {Method} {Path}.", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (RutAlreadyExistsException exception)
        {
            _logger.LogWarning(exception, "RUT duplicado al procesar {Method} {Path}.", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (PatientNotFoundException exception)
        {
            _logger.LogWarning(exception, "Paciente no encontrado al procesar {Method} {Path}.", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Excepción no controlada al procesar {Method} {Path}. Excepción: {ExceptionMessage}",
                context.Request.Method,
                context.Request.Path,
                exception.Message);
            await WriteErrorAsync(context, StatusCodes.Status500InternalServerError, "Ocurrió un error inesperado.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, int statusCode, string message)
    {
        if (context.Response.HasStarted)
            return;

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message });
    }
}