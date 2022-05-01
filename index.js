const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// heroku

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgl77.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('geniusCar').collection('service');
        app.get('/service', async (req, res) => {
            const quary = {};
            const cursor = servicesCollection.find(quary);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(quary);
            res.send(service);
        })

        // POST 
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            res.send(result);
        })

        // DELETE
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })




    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('car server running')
})

app.listen(port, () => {
    console.log('cart port listening')
})