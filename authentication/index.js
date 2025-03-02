import express from "express";
import dotenv from "dotenv";
import authRouter from './routes/auth.route.js'
import connectToMongoDB from './db/connection.js'
import cors from 'cors'

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(cors({
  origin: "*", // Allows all origins (not safe for production)
  allowedHeaders: ["Content-Type", "Authorization"], // Define necessary headers
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
}));

app.use(express.json());

app.use('/auth', authRouter);

// Define a route
app.get("/", (req, res) => {
  res.send("Authentication Backend");
});

// Start the server
app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
