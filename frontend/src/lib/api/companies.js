import uploadApi from "@/lib/authenticatedAxios";

export async function fetchAllCompanies() {
  const res = await uploadApi.get("/media/company");
  return res.data;
}