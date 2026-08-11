import api from "./api";

function unwrap(res) {
  if (!res.success) {
    throw new Error(res.error || "Something went wrong");
  }
  return res.data;
}

export async function getMilestones() {
  const res = await api.get("/milestones");
  return unwrap(res);
}

export async function createMilestone(milestone) {
  const res = await api.post("/milestones", milestone);
  return unwrap(res);
}
