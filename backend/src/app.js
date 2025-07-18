import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://stayfinder-production-6a9f.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRoutes from "./routes/booking.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

// http://localhost:8000/api/v1/users/register

export { app };
