import express from 'express';

const app = express();
const port = 3000; 

// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});