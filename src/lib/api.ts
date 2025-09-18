import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // 🚀 Coloque aqui o link do seu backend NestJS
});

export default api;
