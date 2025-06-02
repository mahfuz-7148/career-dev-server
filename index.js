const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://mrahman7148:M83UyZjXMIm31Abh@careerdev.6rwjfy7.mongodb.net/?retryWrites=true&w=majority&appName=careerDev";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const jobsCollection = client.db('careerDev').collection('jobs')
        const applicationsCollection = client.db('careerDev').collection('applications')

        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.send(result)
        })

        app.get('/jobs/:id', async (req, res) => {
            const result = await jobsCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result)
        });

        app.post('/applications', async (req, res) => {
            const application = req.body;
            console.log(application);
            const result = await applicationsCollection.insertOne(application);
            res.send(result);
        });

        app.get('/applications', async (req, res) => {

            const email = req.query.email;

            const query = {
                applicant: email
            }
            const result = await applicationsCollection.find(query).toArray()

            for (const application of result) {
                const jobId = application.jobId;
                const jobQuery = { _id: new ObjectId(jobId) }
                const job = await jobsCollection.findOne(jobQuery);
                console.log(job)

                application.company = job.company
                application.title = job.title
                application.company_logo = job.company_logo
            }

            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`server ${port}`)
})