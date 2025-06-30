import uploadApi from "@/lib/authenticatedAxios";
export async function fetchAllActors() {
  const res = await uploadApi.get("/media/actor");
  return res.data;
}