const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// MongoDB Atlas connection string
const uri = 'mongodb+srv://danujagreru:SjLbizTkfdQXb974@cluster0.ysc1krx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB database name and collection name
const dbName = 'hotels';
const collectionName = 'hotels';

// Connect to MongoDB Atlas
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

// Define a route to handle POST requests for storing hotel data
app.post('/hotels', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(req.body);
        res.status(201).json({ message: 'Hotel data stored successfully' });
    } catch (error) {
        console.error('Error storing hotel data:', error);
        res.status(500).json({ message: 'Error storing hotel data' });
    }
});

app.get('/hotels', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // Fetch all documents from the collection
        const hotels = await collection.find({}).toArray();
        res.json(hotels); // Return the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).json({ message: 'Error fetching hotel data' });
    }
});

app.get('/hotels/search', async (req, res) => {
    const type = req.query.type; // Get the type of hotel from query parameters
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // Search for hotels by type
        const hotels = await collection.find({ 'facilities.rooms.type': type }).toArray();
        res.json(hotels); // Return the fetched data as JSON response
    } catch (error) {
        console.error('Error searching hotel data by type:', error);
        res.status(500).json({ message: 'Error searching hotel data by type' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
