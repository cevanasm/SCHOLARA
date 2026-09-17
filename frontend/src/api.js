import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function getOpportunities(kind, q = "") {
  return api.get("/opportunities", {
    params: {
      kind,
      q
    }
  });
}

export function getOpportunity(id) {
  return api.get(`/opportunities/${id}`);
}

export function matchOpportunities(student, kind) {
  return api.post(
    `/opportunities/match?kind=${kind}`,
    student
  );
}

export default api;