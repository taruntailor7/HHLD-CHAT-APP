import express from "express";
import dotenv from "dotenv";
import authRouter from './routes/auth.route.js'
import connectToMongoDB from './db/connection.js'
import cors from 'cors';
import usersRouter from './routes/users.route.js'
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  allowedHeaders: ["Content-Type", "Authorization"], // Define necessary headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  credentials: true,
}));


app.use('/auth', authRouter);
app.use('/users', usersRouter);

// Define a route
app.get("/", (req, res) => {
  res.send("Authentication Backend");
});

// Start the server
app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
