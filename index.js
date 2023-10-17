const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json())

// crud-operation
// sStD7XMIf3FE4OIj


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://crud-operation:sStD7XMIf3FE4OIj@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority";

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

        const usersCollection = client.db('crudDB').collection('users')

        // read in database
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray()
            res.send(users)
         })


        //  create data in database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        // read data from database for update
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.findOne(query);
            res.send(result)
         })
        //  update data
        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true};
            const updatedUser = req.body;
            
            const users = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    password: updatedUser.password
                }
            }
            const result = await usersCollection.updateOne(filter, users, options);
            res.send(result)
        })

        //  delete data from database
         app.delete('/users/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('CRUD Operation server is running')
})

app.listen(port, () => {
    console.log(`CRUD Operation server PORT: ${port}`);
})