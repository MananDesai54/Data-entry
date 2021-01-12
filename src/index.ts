import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { connect, Schema, model } from "mongoose";
import schedule from "node-schedule";
import webPush from "web-push";
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

const subscriptionModel = new Schema({
  subscription: {
    type: Object,
    required: true,
  },
});

const Subscription = model("Subscription", subscriptionModel);

/**
 * Schedule push notifications
 */
schedule.scheduleJob("30 10 * * *", async () => {
  try {
    const persons: [] = await Person.find({});
    const filteredPersons = persons.filter(
      (person: any) => new Date(person.dueDate).getTime() > Date.now()
    );
    let message: string;
    if (filteredPersons.length === 0) {
      message = "No more dues are remaining";
    } else {
      const todayPersons = persons.filter(
        (person: any) =>
          new Date(person.dueDate).getDate() === new Date().getDate() &&
          new Date(person.dueDate).getMonth() === new Date().getMonth() &&
          new Date(person.dueDate).getFullYear() === new Date().getFullYear()
      );
      console.log(todayPersons);
      console.log("============================================");
      const tomorrowPersons = persons.filter(
        (person: any) =>
          new Date(person.dueDate).getDate() === new Date().getDate() + 1 &&
          new Date(person.dueDate).getMonth() === new Date().getMonth() &&
          new Date(person.dueDate).getFullYear() === new Date().getFullYear()
      );
      console.log(tomorrowPersons);
      message = "Your Post due reminder";
      webPush.setVapidDetails(
        `mailto:test@test.com`,
        process.env.PUBLIC_VAPID_KEY,
        process.env.PRIVATE_VAPID_KEY
      );
      const subs: [] = await Subscription.find({});
      subs.forEach(async (sub: any) => {
        const { subscription } = sub;
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.keys.auth,
              p256dh: subscription.keys.p256dh,
            },
          },
          JSON.stringify({
            title: message,
            content: `You have ${todayPersons.length} dues Today and ${tomorrowPersons.length} dues tomorrow`,
            openUrl: "/list",
          })
        );
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

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

app.post("/subscribe", async (req, res) => {
  const { subscription } = req.body;
  console.log(subscription);
  try {
    if (subscription) {
      const sub = new Subscription({
        subscription,
      });

      await sub.save();
      return res.status(200).json({
        subscription: sub,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/auth", (req, res) => {
  const { name, password }: { name: string; password: string } = req.body;
  if (name.toLowerCase() === "vrunda" && password === "vrunda6977") {
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
    console.log(name, amount, date, dueDate);
    return res.status(400).json({
      message: "Provide all fields",
    });
  }
  try {
    const person = new Person({
      name,
      amount,
      date,
      dueDate,
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
