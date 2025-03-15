import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const port = process.env.PORT || 8083;

const app = express();

const routes = {
  "/api/auth": "http://localhost:8000/auth",
  "/api/users": "http://localhost:8000/users",
  "/api/msgs": "http://localhost:5000/msgs",
};

for (const route in routes) {
  const target = routes[route];
  app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
}


app.listen(port, () => {
  console.log(`api gateway started listening on port : ${port}`);
});
