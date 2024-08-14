const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express();
const port = 7079;

app.use(express.json());


const uri = process.env.DB_CONNECT;
const client = new MongoClient(uri);

app.post('/checkUser', async (req, res) => {
  const { username } = req.body;

  try {
    console.log("Waiting for db connection...");
    await client.connect();
    console.log("Connected");
    const database = client.db('test');
    const collection = database.collection('users');

    const user = await collection.findOne({ username });

    if (user) {
      res.status(200).send({ message: 'User exists', user });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
