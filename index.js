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
    // update data by id
    app.put("/PaintingAndDrawing/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = req.body;
      const data = {
        $set: {
          customization: updatedData.customization,
          image: updatedData.image,
          item_name: updatedData.item_name,
          price: updatedData.price,
          processing_time: updatedData.processing_time,
          rating: updatedData.rating,
          short_description: updatedData.short_description,
          stockStatus: updatedData.stockStatus,
          subcategory_Name: updatedData.subcategory_Name,
        },
      };
      const result = await ArtistryCollection.updateOne(filter, data);
      res.send(result);
    });
    // delete data by id
    app.delete("/PaintingAndDrawing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ArtistryCollection.deleteOne(query);
      res.send(result);
    });

    // get data by subcategory_Name
    app.get(
      "/PaintingAndDrawing/subcategory/:subcategory_Name",
      async (req, res) => {
        const subcategory_Name = req.params.subcategory_Name;
        const query = { subcategory_Name: subcategory_Name };
        const cursor = ArtistryCollection.find(query);
        const results = await cursor.toArray();
        res.send(results);
      }
    );
    app.get("/PaintingAndDrawing/myArtList/:userEmail", async (req, res) => {
        const userEmail = req.params.userEmail;
        const sortBy = req.query.sortBy || "price"; // Default sort by price if sortBy parameter is not provided
      
        try {
          const query = { userEmail: userEmail };
          const cursor = ArtistryCollection.find(query).sort({ [sortBy]: 1 }); // Sorting by the specified field
          const results = await cursor.toArray();
          res.send(results);
        } catch (error) {
          console.error("Error fetching art and craft items:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
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
