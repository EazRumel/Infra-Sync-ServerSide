const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t89ec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.get("/",(req,res) =>{
  res.send("Infra Sync Is Running For Your Service")
})






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


  const apartmentCollection = client.db("apartmentDB").collection("apartment")
  const agreementCollection = client.db("apartmentDB").collection("agreement")

  const userCollection = client.db("apartmentDB").collection("user")

//apis for user related information
app.get("/users",async(req,res)=>{
  const cursor = await userCollection.find().toArray();
   res.send(cursor);
})

app.post("/users",async(req,res)=>{
  const user = req.body;
  const query = {email:user.email};
  const existingUser = await userCollection.findOne(query)
  if(existingUser){
    return res.send({message:"User Already Exists",insertedId:null})
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
})


//apis for apartment related data
  app.get("/apartment",async(req,res)=>{
    const cursor = apartmentCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })
   

  //apis for agreement related data
  app.get("/agreement",async(req,res)=>{
    const email = req.query.email;
    const query = {email:email};
    const cursor =await agreementCollection.find(query).toArray();
    res.send(cursor);
  })
  app.post("/agreement",async(req,res)=>{
    const agreementData = req.body;
    const result = await agreementCollection.insertOne(agreementData)
    res.send(result)
  })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
  console.log(`Infra Sync is running on ${port}`);
})