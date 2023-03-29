const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const postRoutes = require("./post-routes.js");
const commentRoutes = require("./comment-routes.js");

//routes for users posts comments
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

//export
module.exports = router;
