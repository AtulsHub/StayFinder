import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.route.js'
import listingRouter from './routes/listing.route.js'
import bookingRoutes from "./routes/booking.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";



//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/listing", listingRouter)
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);




// http://localhost:8000/api/v1/users/register

export { app }