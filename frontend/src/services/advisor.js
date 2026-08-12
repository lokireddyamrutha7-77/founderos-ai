import api from "./api";

function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function analyzeStartupIdea(ideaDescription) {
  const res = await api.post("/advisor/analyze", {
    idea_description: ideaDescription,
  });
  return unwrap(res);
}

export async function getLatestReport() {
  const res = await api.get("/advisor/latest");
  return unwrap(res);
}

