require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import routeConfig from "./config/route.config";
import googleAuthConfig from "./config/google.config";
import Auth from "./API/Auth";
import Restaurant from "./API/Restaurant";
import Food from "./API/Food";
import Menu from "./API/Menu";
import Image from "./API/Image";
import orders from "./API/orders";
import reviews from "./API/reviews";
import ConnectDB from "./database/connection";


const zomato = express();


zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false}));
zomato.use(helmet());
zomato.use(cors());
zomato.use(passport.initialize());
zomato.use(passport.session());

googleAuthConfig(passport);
routeConfig(passport);


zomato.use("/auth", Auth);
zomato.use("/restaurant",Restaurant);
zomato.use("/food",Food);
zomato.use("/menu",Menu);
zomato.use("/image",Image);
zomato.use("/orders",orders);
zomato.use("/reviews",reviews);

zomato.get("/", (req, res) => res.json({ message: "setup success"}));

zomato.listen(4000, () =>
  ConnectDB()
    .then(() => console.log("Server is running "))
    .catch(() =>
      console.log("Server is running, but database connection failed... ")
    )
);
