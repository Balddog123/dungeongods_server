import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/id/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you get a single record by name
router.get("/name/:userName", async (req, res) => {
  let collection = await db.collection("users");
  let query = { userName: req.params.userName};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userName: req.body.userName,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

// This section will help you update a record by id.
router.patch("/id/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        userName: req.body.userName,
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

router.delete("/delete/:userId", async (req, res) => {
    try {
      // Extract userId from request parameters
      const { userId } = req.params;
  
      // Get the users collection
      const collection = await db.collection("users");
  
      // Query the database for the user by _id
      const query = { _id: new ObjectId(userId) };
      const user = await collection.findOne(query);
  
      // If the user doesn't exist, return a forbidden error
      if (!user) {
        return res.status(404).send("User not found.");
      }
  
      // Delete the user record
      const result = await collection.deleteOne(query);
  
      if (result.deletedCount === 1) {
        res.status(200).send("User deleted successfully.");
      } else {
        res.status(500).send("Failed to delete user.");
      }
    } catch (err) {
      // Handle errors (e.g., invalid ObjectId format)
      console.error(err);
      res.status(500).send("Error deleting user.");
    }
  });
  

export default router;