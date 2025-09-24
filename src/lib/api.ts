import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommercebackend-production-d712.up.railway.app", // 🚀 Coloque aqui o link do seu backend NestJS
});

export default api;
