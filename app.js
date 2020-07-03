const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
