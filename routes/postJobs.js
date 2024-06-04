const express = require("express");
const router = express.Router();

const postJobs = (database) => {
  const jobsCollection = database.collection("jobs");

  router.post("/", async (req, res) => {
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
  return router;
};

module.exports = postJobs;
