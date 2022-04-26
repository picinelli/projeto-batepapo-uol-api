import express from "express";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const messages = [];

app.post("/participants", (req, res) => {
  const { name } = req.body;
  const userAlreadyExists = users.find((user) => user.name === name);
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error, value } = schema.validate({ name: name });

  if (userAlreadyExists) {
    res.status(409).send("User already exists");
  } else if (error === undefined) {
    const now = Date.now();
    users.push({ name: value.name, lastStatus: now });
    messages.push({
      from: value.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs(now).format("HH:mm:ss"),
    });

    res.status(201).send();
    console.log(users);
    console.log(messages);
  } else {
    res.status(422).send(error);
  }
});

app.listen(5000, () => {
  console.log("Servidor Iniciado!");
});
