const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const updateJobs = (database) => {
  const jobsCollection = database.collection("jobs");

  router.put("/:id", async (req, res) => {
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
  return router;
};

module.exports = updateJobs;
