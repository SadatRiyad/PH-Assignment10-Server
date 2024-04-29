const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efrqq6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ph-assignment10-sadatriyad.surge.sh",
      "https://ph-assignment10-sadatriyad.netlify.app/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("BB-Artistry server is running");
});

async function run() {
  const ArtistryCollection = client
    .db("BB-ArtistryDB")
    .collection("PaintingAndDrawing");
  try {
    // Get all the data from the collection
    app.get("/PaintingAndDrawing", async (req, res) => {
      const data = ArtistryCollection.find();
      const result = await data.toArray();
      res.send(result);
    });
    // get data by id
    app.get("/PaintingAndDrawing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ArtistryCollection.findOne(query);
      res.send(result);
    });
    // get data by subcategory_Name
    app.get("/PaintingAndDrawing/subcategory/:subcategory_Name", async (req, res) => {
      const subcategory_Name = req.params.subcategory_Name;
      const query = { subcategory_Name: subcategory_Name };
      const cursor = ArtistryCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });
    // get data by userEmail
    app.get("/PaintingAndDrawing/myArtList/:userEmail", async (req, res) => {
      const userEmail = req.params.userEmail;
      const query = { userEmail: userEmail };
      const cursor = ArtistryCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    // Add data to the collection
    app.post("/PaintingAndDrawing", async (req, res) => {
      const data = req.body;
      const result = await ArtistryCollection.insertOne(data);
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
