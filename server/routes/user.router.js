
const { Router } = require("express");
const {
    Signup,
    Signin,
    Signout,
    ForgotPassword,
    ResetPassword,
    AddFriend,
    FetchFriends,
    DeleteFriend,
    Search,
    UserProfile,
    EditUser,
    FetchPosts,
    LikeAndDislikePost,
    AddPost
} = require("../controllers/user.controller");

const userRouter = Router();


userRouter.post("/signup", Signup);

userRouter.post("/signin", Signin);

userRouter.delete("/signout", Signout);

userRouter.post("/forgot_password", ForgotPassword);

userRouter.post("/reset/:id", ResetPassword);

userRouter.post('/addFriend', AddFriend);       

userRouter.get('/friends/:username',FetchFriends);

userRouter.post('/delete/friend',DeleteFriend);

userRouter.get('/search/:searchParam/:username',Search);

userRouter.get('/user/:username',UserProfile);

userRouter.post('/edit',EditUser);

userRouter.get('/posts/:username',FetchPosts);

userRouter.post('/posts',AddPost);

userRouter.post('/like/:postID',LikeAndDislikePost);

userRouter.post('/dislike/:postID',LikeAndDislikePost);

module.exports = userRouter;
