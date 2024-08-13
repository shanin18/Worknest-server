const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// Start Server
const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Initialize Express App
const app = express();

// Middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

// Enable CORS
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gacal02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("worknest");
    const jobsCollection = database.collection("jobs");

    // Routes

    // get jobs
    app.get("/jobs", async (req, res) => {
      try {
        const result = await jobsCollection.find().toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // get single job by id
    app.get("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
  
        if (id) {
          const result = await jobsCollection.findOne({ _id: new ObjectId(id) });
          res.json(result);
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // post/add a job
    app.post("/jobs", async (req, res) => {
      try {
        const data = req.body;
        if (data) {
          const result = await jobsCollection.insertOne(data);
          res.status(201).json(result);
        } else {
          res.status(400).json({ message: "Invalid request body" });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // update a job details
    app.patch("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;
  
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid ID format" });
        } else if (!data) {
          return res
            .status(400)
            .json({ message: `Missing required field: ${field}` });
        }
  
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            title: data.title,
            location: data.location,
            start_date: data.start_date,
            type: data.type,
            key_responsibilities: data.key_responsibilities,
            skills_required: data.skills_required,
            benefits: data.benefits,
            shift_options: data.shift_options,
            who_can_apply: data.who_can_apply,
            salary: data.salary,
          },
        };
  
        const result = await jobsCollection.updateOne(filter, updateDoc, options);
  
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Job not found" });
        } else {
          res.status(201).json(result);
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // delete a job
    app.delete("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
  
        if (!id) {
          return res.status(400).json({ message: "Missing ID parameter" });
        }
  
        const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
        console.log(result);
  
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Job not found" });
        }
  
        res.status(200).json({ message: "Job deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to worknest server");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

