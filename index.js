const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
let users = [];

// middleware
app.use(cors());
app.use(express.json()); 

//-------------------------USER ROUTES START-------------------------
app.get('/', (req, res) => {
    res.send('BB-Artistry server is running');
});

app.listen(port, () =>{
    console.log(`server is running on port ${port}`)
})