const express = require("express");
const assert = require("assert");
const app = express();
const { MongoClient, ObjectID } = require("mongodb");

app.use(express.json());

const mongoURI =
  "mongodb+srv://manoo:toto@cluster0-s09nu.mongodb.net/test?retryWrites=true&w=majority";
const dataBase = "ContactList";
MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null, "connection to database failed");

  const db = client.db(dataBase);
  app.post("/add_contact", (req, res) => {
    let newContact = req.body;
    db.collection("contacts").insertOne(newContact, (err, data) => {
      err ? console.log("cannot add contact") : res.send(data);
    });
  });
  app.get("/contacts", (req, res) => {
    db.collection("contacts")
      .find()
      .toArray((err, data) => {
        err ? console.log("cannot get contacts") : res.send(data);
      });
  });
  app.put("/edit_contact/:id", (req, res) => {
    let contact = req.params.id;
    db.collection("contacts").findOneAndUpdate(
      { _id: ObjectID(contact) },
      { $set: req.body },
      (err, data) =>
        err
          ? console.log("cannot modifie contact")
          : res.send(data)
    );
  });
  app.delete("/delete_contact/:id", (req, res) => {
    let contact = req.params.id;
    db.collection("contacts").findOneAndDelete(
      { _id: ObjectID(contact) },
      (err, data) =>
        err
          ? console.log("cannot delete contact")
          : res.send("contact deleted ")
    );
  });
});
const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  err
    ? console.log("cannot run server")
    : console.log(`server is running on port ${port}`);
});