import type {
  AdventureDetail,
  AdventuresResponse,
  City,
  Reservation,
} from "@/types/ticket-trip";

const API_URL = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Something went wrong",
    }));

    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export async function fetchCities(): Promise<City[]> {
  const response = await fetch(`${API_URL}/cities`);

  return handleResponse<City[]>(response);
}

export async function fetchAdventures(
  city: string,
  category?: string,
  duration?: string,
): Promise<AdventuresResponse> {
  const params = new URLSearchParams();

  params.set("city", city);

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (duration && duration !== "all") {
    params.set("duration", duration);
  }

  const response = await fetch(`${API_URL}/adventures?${params.toString()}`);

  return handleResponse<AdventuresResponse>(response);
}

export async function fetchAdventure(id: string): Promise<AdventureDetail> {
  const response = await fetch(`${API_URL}/adventures/detail?adventure=${id}`);

  return handleResponse<AdventureDetail>(response);
}

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_URL}/reservations`);

  return handleResponse<Reservation[]>(response);
}

export async function createReservation(data: {
  name: string;
  date: string;
  person: number;
  adventure: string;
}) {
  const response = await fetch(`${API_URL}/reservations/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ success: boolean }>(response);
}
