import api from "./api";

// NOTE: api.js's response interceptor unwraps to the backend's {success, data, error} body directly.
function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function getFinanceSnapshot() {
  const res = await api.get("/finance");
  return unwrap(res);
}

export async function updateFinanceSnapshot(revenue, expenses) {
  const res = await api.put("/finance", { revenue, expenses });
  return unwrap(res);
}
