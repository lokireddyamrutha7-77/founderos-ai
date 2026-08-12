import api from "./api";

function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong generating analysis");
  }
  return res.data;
}

export async function analyzeIdea(ideaDescription) {
  const res = await api.post("/advisor/analyze", {
    idea_description: ideaDescription,
  });
  return unwrap(res);
}
