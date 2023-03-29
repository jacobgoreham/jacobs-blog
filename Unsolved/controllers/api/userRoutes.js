const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

//get every user
router.get("/", (req, res) => {
  //grabs all users
  User.findAll({
    attributes: {
      exclude: ["password"],
    },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//route for getting user by ID
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: {
      exclude: ["password"],
    },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    //if no user data returns
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({
          message: "No post with this ID...",
        });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create new user with username and password
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    //session saves user with an id, username, and that logged in is set to true
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//route for login
router.post("/login", (req, res) => {
  //finds user by req.body.username
  User.findOne({
    where: {
      username: req.body.username,
    },
    //if theres not a user found shows err
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({
        message: "No user with that username...",
      });
      return;
    }
    //no err => session logs in UserData.id and .username
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({
        user: dbUserData,
        message: "You are logged in!",
      });
    });

    //password check
    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: "Incorrect password!",
      });
      return;
    }

    //if password check is a go then session saves UserData
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      //and logs in
      res.json({
        user: dbUserData,
        message: "You are logged in!",
      });
    });
  });
});

//logout route
router.post("/logout", (req, res) => {
  //when logout is ran session will destroy the loggedIn with res.status(204).end();, on 404 error will .end();
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
