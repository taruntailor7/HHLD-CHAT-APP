import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  
  socket.on("chat msg", (msg) => {
    console.log("Received msg " + msg);
  });
});

// Define a route
app.get("/", (req, res) => {
  res.send("Congratulations HHLD Folks!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
