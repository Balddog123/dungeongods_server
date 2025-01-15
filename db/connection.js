import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://shurtleff123ds:hWWvucRDDZyoJXXa@dungeongodscluster0.47pbo.mongodb.net/?retryWrites=true&w=majority&appName=DungeonGodsCluster0" || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
    console.log(uri);
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("PlayerData");

export default db;