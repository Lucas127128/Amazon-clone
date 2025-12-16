import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { ip } from "elysia-ip";
import Products from "../../products.json";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
      method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
    ip()
  )
  .get("/", () => "Hello Elysia")
  .get("/products", ({request, server}) => {
    const clientIP = server?.requestIP(request);;
    console.log(`new request from ${clientIP.address}`);
    return Products;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
