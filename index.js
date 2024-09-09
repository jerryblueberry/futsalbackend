const express = require('express');
const connectDb = require('./database/db');
const Add = require('./routes/FutsalRoutes');
const cors = require('cors');


//  Test for cron jobs
const cron = require('node-cron');





const app = express();
const port = process.env.PORT || 8000;
app.use(cors({
  origin:true,
  credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // res.send('Welcome to my Server');
  res.status(200).json('Welcome to my Server');
});
cron.schedule('* * * * * ',async() => {
  try {
    const response = await axios.get('https://futsalbackend.vercel.app');
    console.log("Cron Job Executed",response.data);
  } catch (error) {
    console.error("Error in Cron Jobs");
  }

 
})


app.use('/futsal', Add);

// Connect to database and start the server
connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error("Database connection error:", error.message);
});
