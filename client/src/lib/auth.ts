// Authentication utilities
import { getAuthToken } from "./cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log('Login response status:', res);
  return res.json();
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  phoneNumber?: string;
  password: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  cropsPlanted?: string[];
  farmLatitude?: number | null;
  farmLongitude?: number | null;
  termsAccepted?: boolean;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getProfile(token?: string) {
  const authToken = token || getAuthToken();
  if (!authToken) throw new Error("No authentication token");

  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.json();
}

export async function getFarmerData(token?: string) {
  const authToken = token || getAuthToken();
  if (!authToken) throw new Error("No authentication token");

  const res = await fetch(`${API_BASE}/farmers/profile`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.json();
}

export async function getAdminFarmers(token?: string) {
  const authToken = token || getAuthToken();
  if (!authToken) throw new Error("No authentication token");

  const res = await fetch(`${API_BASE}/admin/farmers`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.json();
}

export async function updateFarmerStatus(
  farmerId: string,
  status: "pending" | "certified" | "declined",
  token?: string
) {
  const authToken = token || getAuthToken();
  if (!authToken) throw new Error("No authentication token");

  const res = await fetch(`${API_BASE}/admin/farmers/${farmerId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${API_BASE}/users/roles`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
