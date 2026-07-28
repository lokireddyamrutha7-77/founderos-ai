import api from "./api";

// Every backend response looks like: { success, data, error }
// These functions unwrap that and throw if success is false,
// so components can just try/catch and use the data directly.

function unwrap(response) {
  const { success, data, error } = response.data;
  if (!success) {
    throw new Error(error || "Something went wrong");
  }
  return data;
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