import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport"; 

import { UserModel } from "../../database/user";

import {ValidateSignup , ValidateSignin} from "../../validation/auth";

const Router = express.Router();


/*
Route     /signup
Des       Register new user
Params    none
Access    Public
Method    POST  
*/
Router.post("/signup", async (req, res) => {
    try {

         await ValidateSignup(req.body.credentials);
         await UserModel.findEmailAndPhone(req.body.credentials);
         const newUser = await UserModel.create(req.body.credentials);
         const token = newUser.generateJwtToken();
         return res.status(200).json({token});
         } catch (error) {
        return res.status(500).json({error: error.message});
        }
      });

  /*
Route         /signin
Descrip       Signin with email and password
Params        None
Access        Public
Method        POST
*/

Router.post("/signin", async(req,res) => {
  try {
    await ValidateSignin(req.body.credentials);
    const user = await UserModel.findByEmailAndPassword(req.body.credentials);
    const token = user.generateJwtToken();
    return res.status(200).json({token, status: "Success"});
    } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

/*
Route         /google
Descrip       Google Signin
Params        None
Access        Public
Method        GET
*/

Router.get("/google", passport.authenticate("google",{
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  })
  );

  /*
Route         /google/callback
Descrip       Google Signin callback
Params        None
Access        Public
Method        GET
*/

Router.get("/google/callback", passport.authenticate("google",{failureRedirect: "/"}),
(req,res) => {
  return res.json({token: req.session.passport.user.token});
}
);




export default Router;