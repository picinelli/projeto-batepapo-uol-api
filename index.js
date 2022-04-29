import express from "express";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI); // USAR O ENV !!!!!!!!!!!!!!!!!!!
let db;

const promise = mongoClient.connect().then(() => {
  db = mongoClient.db("projeto_batepapo_api");
});

app.post("/participants", async (req, res) => {
  const { name } = req.body;
  try {
    
    const participants = await db.collection("users").find({}).toArray();
    const userAlreadyExists = participants.find((user) => user.name === name);
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    const { error, value } = schema.validate({ name: name });
    if (userAlreadyExists) {
      res.status(409).send("User already exists");
      
      return;
    } else if (error === undefined) {
      const now = Date.now();

      await db
        .collection("users")
        .insertOne({ name: value.name, lastStatus: now });
      await db.collection("messages").insertOne({
        from: value.name,
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: dayjs(now).format("HH:mm:ss"),
      });

      res.sendStatus(201);
      
      return;
    } else {
      
      res.status(422).send(error);
      return;
    }
  } catch (e) {
    console.error(e);
  }
  
});

app.get("/participants", async (req, res) => {
  try {
    
    const participants = await db.collection("users").find({}).toArray();
    res.status(200).send(participants);
    
    return;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    
    return;
  }
});

app.post("/messages", async (req, res) => {
  const now = Date.now();
  const nowFormattted = dayjs(now).format("HH:mm:ss");
  const body = req.body;
  const thisUser = req.headers.user;
  const newMessage = { from: thisUser, ...body, time: nowFormattted };

  try {
    
    const users = await db.collection("users").find({}).toArray();
    const userIsOnline = users.find((user) => user.name === thisUser);
    const schema = Joi.object({
      to: Joi.string().required(),
      text: Joi.string().required(),
      type: Joi.any().valid("message", "private_message"),
      time: Joi.any(),
      from: Joi.any().required(),
    });
    const { error, value } = schema.validate({
      ...newMessage,
      from: userIsOnline,
    });

    if (error === undefined) {
      await db.collection("messages").insertOne(newMessage);
      res.sendStatus(201);
      
      return;
    } else {
      res.status(422).send(error);
      
      return;
    }
  } catch (e) {
    console.error(e);
    
    return;
  }
});

// nao esta retornando as mais recentes.
app.get("/messages", async (req, res) => {
  const user = req.headers.user;
  const messagesAmount = parseInt(req.query.limit);
  try {
    
    const messages = await db.collection("messages").find({}).toArray();
    const haveAccessMessages = messages.filter((message) => {
      if (
        user === message.to ||
        user === message.from ||
        message.to === "Todos"
      ) {
        return message;
      }
    });
    const messagesSliced = haveAccessMessages.slice(-messagesAmount);
    res.status(200).send(messagesSliced);
    
    return;
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
    
    return;
  }
});

app.post("/status", async (req, res) => {
  const userHeader = req.headers.user;

  try {
    
    const users = await db.collection("users").find({}).toArray();
    const userIsOnline = users.some((user) => user.name === userHeader);
    if (!userIsOnline) {
      res.sendStatus(404);
      
      return;
    } else {
      const now = Date.now();
      for (let i = 0; i < users.length; i++) {
        if (users[i].name === userHeader) {
          await db.collection("users").updateOne(
            { name: userHeader },
            {
              $set: {
                lastStatus: now,
              },
            }
          );
          break;
        }
      }
      res.sendStatus(200);
      
      return;
    }
  } catch (e) {
    console.error(e);
    
    return;
  }
});

setInterval(async () => {
  const now = Date.now();

  try {
    
    const users = await db.collection("users").find({}).toArray();
    const disconnectedUsers = users.filter((user) => {
      if (now - user.lastStatus > 10000) return user;
    });
    disconnectedUsers.map(async (user) => {
      await db.collection("users").deleteOne(user);
      await db.collection("messages").insertOne({
        from: user.name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: dayjs(now).format("HH:mm:ss"),
      });
      
      return;
    });
  } catch (e) {
    
    console.error(e);
    return;
  }
}, 15000);

app.listen(5000, () => {
  console.log("Servidor Iniciado!");
});
