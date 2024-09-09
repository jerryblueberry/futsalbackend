const express = require('express');
const connectDb = require('./database/db');
const Add = require('./routes/FutsalRoutes');

//  Test for cron jobs
const cron = require('node-cron');

cron.schedule('* * * * * ',() => {
  console.log("Running Cron Job");
})

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to my Server');
});

app.use('/futsal', Add);

// Connect to database and start the server
connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error("Database connection error:", error.message);
});
