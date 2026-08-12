import api from "./api";

function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function sendChatMessage(message) {
  const res = await api.post("/chat", {
    message,
  });
  return unwrap(res);
}
