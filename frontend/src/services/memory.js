import api from "./api";

// NOTE: api.js's response interceptor already unwraps to the backend's
// {success, data, error} body directly - `res` below is NOT a full axios
// response anymore, it IS {success, data, error}. Don't do res.data.data.
function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function createMemory(memory) {
  const res = await api.post("/memory/", memory);
  return unwrap(res);
}

// Returns { items, total, skip, limit } - paginated.
export async function getAllMemories(skip = 0, limit = 50) {
  const res = await api.get("/memory/", { params: { skip, limit } });
  return unwrap(res);
}

export async function getMemoryById(id) {
  const res = await api.get(`/memory/${id}`);
  return unwrap(res);
}

export async function updateMemory(id, memory) {
  const res = await api.put(`/memory/${id}`, memory);
  return unwrap(res);
}

export async function deleteMemory(id) {
  const res = await api.delete(`/memory/${id}`);
  return unwrap(res);
}

export async function getMemoryStats() {
  const res = await api.get("/memory/stats");
  return unwrap(res);
}

export async function searchMemories(keyword) {
  const res = await api.get("/memory/search", { params: { keyword } });
  return unwrap(res);
}

export async function getMemoryTimeline() {
  const res = await api.get("/memory/timeline");
  return unwrap(res);
}

export async function getMemoriesByCategory(category) {
  const res = await api.get(`/memory/category/${category}`);
  return unwrap(res);
}

export async function getImportantMemories(minImportance = 3) {
  const res = await api.get("/memory/important", {
    params: { min_importance: minImportance },
  });
  return unwrap(res);
}