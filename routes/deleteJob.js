const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const deleteJob = (database) => {
  const jobsCollection = database.collection("jobs");

  router.delete("/:id", async (req, res) => {
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

  return router;
};

module.exports = deleteJob;
