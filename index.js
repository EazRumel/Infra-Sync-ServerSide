const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get("/",(req,res) =>{
  res.send("Infra Sync Is Running For Your Service")
})

app.listen(port,()=>{
  console.log(`Infra Sync is running on ${port}`);
})