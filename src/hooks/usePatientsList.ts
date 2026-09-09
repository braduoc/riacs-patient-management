// hooks/usePatientsList.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { Patient } from "../types/patient";
import { mapFromBackend } from "../mappers/patient.mapper";
import { patientApi } from "../services/patient.api";

type ListState = "idle" | "loading" | "error";

interface CachedResponse {
  items: Patient[];
  totalRecords: number;
  totalPages: number;
  expiresAt: number;
}

const PAGE_SIZE = 6;
const CACHE_TTL = 30_000;
const CACHE_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 400;

export function usePatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingState, setLoadingState] = useState<ListState>("loading");
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(""); // lo que el usuario escribe (inmediato)
  const [search, setSearch] = useState("");            // lo que se usa para buscar (debounced)
  const [page, setPage] = useState(1);

  const cacheRef = useRef<Record<string, CachedResponse>>({});
  const abortRef = useRef<AbortController | null>(null);

  const invalidateCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  // Debounce: solo actualiza `search` 400ms después de que el usuario deja de escribir
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchPatients = useCallback(async (ignoreCache = false) => {
    const cacheKey = `${page}-${search}`;
    const cached = cacheRef.current[cacheKey];

    if (!ignoreCache && cached && cached.expiresAt > Date.now()) {
      setPatients(cached.items);
      setTotalRecords(cached.totalRecords);
      setTotalPages(cached.totalPages);
      setLoadingState("idle");
      return;
    }

    // Cancela el request anterior si sigue en vuelo
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingState("loading");
    setError(null);

    try {
      const response = await patientApi.getPaged(page, PAGE_SIZE, search, controller.signal);
      const dataToCache: CachedResponse = {
        items: response.items.map(mapFromBackend),
        totalRecords: response.totalRecords,
        totalPages: Math.max(1, Math.ceil(response.totalRecords / PAGE_SIZE)),
        expiresAt: Date.now() + CACHE_TTL,
      };

      cacheRef.current[cacheKey] = dataToCache;
      const cacheKeys = Object.keys(cacheRef.current);
      if (cacheKeys.length > CACHE_LIMIT) delete cacheRef.current[cacheKeys[0]];

      setPatients(dataToCache.items);
      setTotalRecords(dataToCache.totalRecords);
      setTotalPages(dataToCache.totalPages);
      setLoadingState("idle");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // ignorar cancelaciones
      setLoadingState("error");
      setError(err instanceof Error ? err.message : "Error al cargar los pacientes");
    }
  }, [page, search]);

  useEffect(() => {
    void fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    rows: patients,
    search: searchInput,      // el input usa esto (responde al instante mientras escribes)
    setSearch: setSearchInput, // pero el fetch se dispara con el valor debounced
    page,
    setPage,
    totalPages,
    totalRecords,
    pageSize: PAGE_SIZE,
    safeP: Math.min(page, totalPages),
    loadingState,
    error,
    refetch: () => fetchPatients(true),
    invalidateCache,
  };
}