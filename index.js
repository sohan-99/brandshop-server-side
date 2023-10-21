const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middlewere
// app.use(cors());
app.use(express.json());
const corsConfig = {
    origin: '*',
    Credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsConfig));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.julqny1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}
run().catch(console.dir);
const phoneCollation = client.db('devicedazzleDb').collection('phoneCollation');
const mycartPhoneCollation = client.db('mycartDB').collection('cart');
// get all data to database 
app.get('/products', async (req, res) => {
    const result = await phoneCollation.find().toArray();
    res.send(result);
})
// get 
app.get('/products/:brand_name', async (req, res) => {
    const brand_name = req.params.brand_name
    const query = { bandName: brand_name }
    const result = await phoneCollation.find(query).toArray();
    res.send(result);
})
// update single data find 
app.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const user = await phoneCollation.findOne(query);
    res.send(user)
})
// details apicheck 
app.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const user = await phoneCollation.findOne(query);
    res.send(user)
})

// data updata single 
app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const updated = req.body;
    console.log(updated);
    const filter = { _id: new ObjectId(id) }
    const option = { upsert: true }
    const updetedu = {
        $set: {
            image: updated.image,
            name: updated.name,
            type: updated.type,
            rating: updated.rating,
            sdec: updated.sdec,
            bandName: updated.bandName,
            price: updated.price

        }
    }
    const result = await phoneCollation.updateOne(filter, updetedu, option)
    res.send(result)
})
// my cart data 
app.get('/mycart', async (req, res) => {
    const cursor = mycartPhoneCollation.find();
    const result = await cursor.toArray();
    res.send(result);
})
// post my cart 
app.post('/mycart', async (req, res) => {
    const resCart = req.body;
    console.log(resCart);
    const result = await mycartPhoneCollation.insertOne(resCart);
    res.send(result);
})
//   delete 
app.delete('/mycart/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await mycartPhoneCollation.deleteOne(query);
    res.send(result);
})

// post 
app.post('/products', async (req, res) => {
    const addp = req.body;
    const result = await phoneCollation.insertOne(addp);
    res.send(result);
    console.log(phoneCollation);
})


app.get('/', (req, res) => {
    res.send('Server  is Runing!')
})

app.listen(port, () => {
    console.log(`this is port :${port}`);
})