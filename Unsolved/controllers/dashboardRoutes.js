const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

//landing page for logins uses withAuth to check
router.get("/", withAuth, (req, res) => {
  //finds all posts for landing page for current session
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "created_at"],
    //post model
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    //Post is mapped and limited to basic data using plain: true
    .then((dbPostData) => {
      const posts = dbPostData.map((post) =>
        post.get({
          plain: true,
        })
      );
      //response post is rendered to dashboard if withAuth is true
      res.render("dashboard", {
        posts,
        loggedIn: true,
      });
    })
    //for error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  //route for specific post
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    //error for post with no id
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: "No post with this ID...",
        });
        return;
      }

      //limits PostData using plain: true
      const post = dbPostData.get({
        plain: true,
      });

      //renders the response at edit-post
      res.render("edit-post", {
        post,
        loggedIn: true,
      });
    })
    //error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//new post route response renders the add-post if logged in
router.get("/new", (req, res) => {
  res.render("add-post", {
    loggedIn: true,
  });
});

module.exports = router;
