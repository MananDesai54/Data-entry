import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { connect, Schema, model } from "mongoose";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectToDatabase = async () => {
  try {
    const connection = connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(
      "Connected with database: ",
      (await connection).connection.host
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectToDatabase().then(() => {
  app.listen(PORT, () =>
    console.log("Server is running at http://127.0.0.1:" + PORT)
  );
});

const personModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const Person = model("Person", personModel);

//cors & helmet => for security
app.use(cors());
app.use(helmet());

// used to log requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (_, res) => {
  res.json("API running.");
});

app.post("/auth", (req, res) => {
  const { name, password }: { name: string; password: string } = req.body;
  if (
    (name.toLowerCase() === "vrunda" && password === "vrunda6977") ||
    (name.toLowerCase() === "nilesh" && password === "nilesh1976")
  ) {
    res.status(200).json("Login");
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
});

app.get("/data", async (req, res) => {
  try {
    const person = await Person.find({});
    return res.json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        message: "Person Not found",
      });
    }
    return res.json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/", async (req, res) => {
  const { name, amount, date, dueDate } = req.body;
  if (!name || !amount || !date || !dueDate) {
    return res.status(400).json({
      message: "Provide all fields",
    });
  }
  try {
    const person = new Person({
      name,
      amount,
      date,
    });
    await person.save();
    return res.json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
app.put("/:id", async (req, res) => {
  const { name, amount, date, dueDate } = req.body;
  const { id } = req.params;
  try {
    const person = await Person.findById(id);
    if (name) person.name = name;
    if (amount) person.amount = amount;
    if (date) person.date = date;
    if (dueDate) person.dueDate = dueDate;
    await person.save();
    return res.json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
