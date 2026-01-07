export const BASE_URL_APIS =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api"

export const BASE_URL_SOCKET =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/"
