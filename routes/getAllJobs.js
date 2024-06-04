const express = require("express");
const router = express.Router();

const getAllJobs = (database) => {
  const jobsCollection = database.collection("jobs");

  router.get("/", async (req, res) => {
    try {
      const result = await jobsCollection.find().toArray();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  return router;
};

module.exports = getAllJobs;
