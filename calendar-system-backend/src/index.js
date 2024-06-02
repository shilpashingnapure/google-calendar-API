import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { dbConnection } from "./config/db.js";
import { User } from "./user.model.js";
import { authenticateToken } from "./middlerware/authenticate-token.js";
import { createEvent } from "./controllers/create-event.js";
import { client } from "./config/oauth-config.js";
import { updateEvent } from "./controllers/update-event.js";
import { deleteEvent } from "./controllers/delete-event.js";
import { getAllEvents } from "./controllers/all-events.js";


// middlewares
dotenv.config({});
const app = express();
app.use(cors());

// preflight req
app.options('*', cors());
app.use(express.json());


// user auth login
app.post("/auth/google", async (req, res) => {
  try {
    const { code } = req.body;
    console.log('code' , code);
    const { tokens } = await client.getToken(code);

    console.log('tokens' ,  tokens);

    // verity token
    const tokenResponse = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
    });

    // extract data to store into DB
    const payload = tokenResponse.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } else {
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
    }

    await user.save();

    // generate JWT token
    const userToken = jwt.sign({ googleId, userid: user._id }, process.env.SECRET_KEY);
    res.status(200).send({
      message: "Login successful",
      token: userToken,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});


// event CURD oprations 
app.get("/events", authenticateToken , getAllEvents);

app.post("/create-event", authenticateToken, createEvent);

app.patch("/update-event/:id", authenticateToken , updateEvent);

app.delete("/delete-event/:id" , authenticateToken , deleteEvent)


const port = 8000;
app.listen(port, () => {
  dbConnection();
  console.log("port is listing..", port);
});
