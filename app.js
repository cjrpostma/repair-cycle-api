const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v0/auth', require('./routes/auth'));
app.use('/api/v0/dashboard', require('./routes/dashboard'));

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
