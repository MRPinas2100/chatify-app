import { BASE_URL_APIS } from "../constants/BASE_URLS"
import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: BASE_URL_APIS,
  withCredentials: true,
})
