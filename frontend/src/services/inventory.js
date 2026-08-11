import api from "./api";

function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function getItems() {
  const res = await api.get("/inventory");
  return unwrap(res);
}

export async function createItem(item) {
  const res = await api.post("/inventory", item);
  return unwrap(res);
}

export async function updateItem(id, item) {
  const res = await api.put(`/inventory/${id}`, item);
  return unwrap(res);
}

export async function deleteItem(id) {
  const res = await api.delete(`/inventory/${id}`);
  return unwrap(res);
}
