import type {
  CreatePatientDto,
  PatchPatientDto,
  UpdatePatientDto,
} from "../types/patient";
import {
  type BackendPagedResponse,
  type BackendPatient,
  mapPatchToBackend,
  mapToBackend,
} from "../mappers/patient.mapper";

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

if (!API_ORIGIN) {
  throw new Error("La variable de entorno VITE_API_URL no está definida");
}

const API_BASE_URL = `${API_ORIGIN}/api/patients`;

async function handleResponse<T>(response: Response, fallbackMsg: string): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || fallbackMsg);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const patientApi = {
  async getPaged(
    pageNumber = 1,
    pageSize = 6,
    search = "",
    signal?: AbortSignal,
  ): Promise<BackendPagedResponse> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (search.trim()) params.append("search", search.trim());

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, { signal });
    return handleResponse<BackendPagedResponse>(
      response,
      "Error al obtener la lista de pacientes",
    );
  },

  async getById(id: number, signal?: AbortSignal): Promise<BackendPatient> {
    const response = await fetch(`${API_BASE_URL}/${id}`, { signal });
    return handleResponse<BackendPatient>(response, "Paciente no encontrado");
  },

  async create(data: CreatePatientDto): Promise<BackendPatient> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToBackend(data)),
    });
    return handleResponse<BackendPatient>(response, "Error al crear el paciente");
  },

  async update(id: number, data: UpdatePatientDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToBackend(data)),
    });
    await handleResponse<void>(response, "Error al actualizar el paciente");
  },

  async patch(id: number, data: PatchPatientDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapPatchToBackend(data)),
    });
    await handleResponse<void>(response, "Error al modificar el paciente");
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    await handleResponse<void>(response, "Error al eliminar el paciente");
  },
};