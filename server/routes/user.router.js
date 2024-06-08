
const { Router } = require("express");
const { Signup, Signin, Signout, ForgotPassword, ResetPassword } = require("../controllers/user.controller");

const userRouter = Router();


userRouter.post("/signup", Signup);

userRouter.post("/signin", Signin);

userRouter.delete("/signout", Signout);

userRouter.post("/forgot_password", ForgotPassword);

userRouter.post("/reset/:id", ResetPassword);


module.exports = userRouter;
