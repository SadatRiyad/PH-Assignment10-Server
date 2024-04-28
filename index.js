const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efrqq6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// create db and collection references from mongoDB connection
const db = client.db("BB-ArtistryDB");
const collection = db.collection("PaintingAndDrawing");

// middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("BB-Artistry server is running");
});

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Get all the data from the collection
    app.get("/PaintingAndDrawing", async (req, res) => {
      const data = collection.find();
      const userData = await data.toArray();
      res.send(userData);
    });

    // Add data to the collection
    app.post("/AddPaintingAndDrawing", async (req, res) => {
      const data = req.body;
      const result = await collection.insertOne(data);
      res.send(result);
    });




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// Listen for incoming requests
app.listen(port, () => console.log(`Server is running on port ${port}`));
