const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

// 5ObCV4J9v0fzHVsD
// market_place

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwhf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const jobCollection = client.db('market_place').collection('jobs')

    // save a job data in database
    app.post('/add-job', async (req, res) => {
      const jobData = req.body;
      const result = await jobCollection.insertOne(jobData)
      res.send(result)
    })

    // get all job data from database
    app.get('/jobs', async (req, res) => {
      const jobs = await jobCollection.find().toArray()
      res.send(jobs)
    })

    // get all posted by a specific email address
    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "buyar.email": email };
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    })

    // find one data 
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result)
    })

    // delete my posted data
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
