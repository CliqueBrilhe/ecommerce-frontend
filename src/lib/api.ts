import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:7777" //"https://ecommercebackend-production-d712.up.railway.app", // 🚀 Coloque aqui o link do seu backend NestJS
});

export default api;
