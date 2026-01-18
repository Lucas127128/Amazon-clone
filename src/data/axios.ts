import axios from "axios";

export const internal = axios.create({
  baseURL: "http://localhost:3000",
});

export const external = axios.create({
  baseURL: "https://localhost:3001",
});
