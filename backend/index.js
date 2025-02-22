import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';  
dotenv.config(); 
const port = process.env.PORT || 3000; 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', () => {
  console.log('Client connected...');
})

// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});