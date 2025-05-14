import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import connectToMongoDB from "./db/connection.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    allowedHeaders: ["Content-Type", "Authorization"], // Define necessary headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    allowedHeaders: ["Content-Type", "Authorization"], // Define necessary headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client connected");

  const username = socket.handshake.query.username;
  console.log("Username:", username);

  userSocketMap[username] = socket;

  // The callback function is executed whenever a message is received on
  // the specified Redis channel. When a message is received,
  // it's passed to this callback function as the msg parameter.
  const channelName = `chat_${username}`;
  subscribe(channelName, (msg) => {
    console.log("Received message:", msg);
    socket.emit("chat msg", JSON.parse(msg));
  });

  // socket.on("chat msg", (msg) => {
  //   console.log("Received msg " + msg);
  //   socket.broadcast.emit("chat msg", msg);
  // });
  socket.on("chat msg", (msg) => {
    // console.log(msg.sender);
    console.log(msg.receiver);
    // console.log(msg.text);
    // socket.broadcast.emit("chat msg", msg.text);
    const receiverSocket = userSocketMap[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg);
    } else {
      const channelName = `chat_${msg.receiver}`;
      publish(channelName, JSON.stringify(msg));
    }

    addMsgToConversation([msg.sender, msg.receiver], {
      text: msg.text,
      sender: msg.sender,
      receiver: msg.receiver,
    });
  });
});

app.use(express.json());
app.use("/msgs", msgsRouter);

// Define a route
app.get("/", (req, res) => {
  res.send("Congratulations HHLD Folks!");
});

// Start the server
server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
