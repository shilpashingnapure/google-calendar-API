import { OAuth2Client, auth } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config({});

// Oatuh client
export const client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000"
  );