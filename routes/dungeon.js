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
  let collection = await db.collection("dungeons");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/id/:id", async (req, res) => {
  let collection = await db.collection("dungeons");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you get a single record by name
router.get("/name/:dungeonName", async (req, res) => {
  let collection = await db.collection("dungeons");
  let query = { dungeonName: req.params.dungeonName};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      dungeonName: req.body.dungeonName,
      creatorId: req.body.creatorId,
      rooms: req.body.rooms
    };
    let collection = await db.collection("dungeons");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding dungeon");
  }
});

// This section will help you update a record by id.
router.patch("/id/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        dungeonName: req.body.dungeonName,
        creatorId: req.body.creatorId,
        rooms: req.body.rooms
      },
    };

    let collection = await db.collection("dungeons");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating dungeon");
  }
});

// This section will help you delete a record
router.delete("/delete/:creatorId/:dungeonId", async (req, res) => {
  try {
    const {creatorId, dungeonId} = req.params;
    let collection = await db.collection("dungeons");

    const query = { 
      _id: new ObjectId(dungeonId),
      creatorId: creatorId
     };
    const dungeon = await collection.findOne(query);
    if(!dungeon) return res.status(403).send("Forbidden: You do not have permission to delete this dungeon!");

    let result = await collection.deleteOne(query);

    if (result.deletedCount === 1) {
      res.status(200).send("Dungeon deleted successfully.");
    } else {
      res.status(404).send("Dungeon not found or already deleted.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting dungeon");
  }
});

export default router;