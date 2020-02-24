const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config/env");
const validateRegister = require("../validation/register");
const validateLogin = require("../validation/login");
const User = require("../models/Users");
const Controller = require("../controllers/controller");
const UserController = new Controller(User);
const router = express.Router();
const passport = require("passport");
// @route POST /register
// @desc Register user
// @access Public

router.post("/register", (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return user.status(400).json({ username: "username already exist" });
    } else {
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        rewardPoints: req.body.rewardPoints
      });

      //hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.name
        };
        jwt.sign(
          payload,
          config.secretKey,
          {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({
          error: "User not found"
        });
      }
    });
  });
});

//------------------------------------------------------------------------------------------------------//

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    UserController.getAll((error, result) => {
      handleCallBack(error, result, res);
    });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    UserController.find(req.params.id, (error, result) => {
      handleCallBack(error, result, res);
    });
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    UserController.update(req.params.id, req.body, (error, result) => {
      handleCallBack(error, result, res);
    });
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    UserController.delete(req.params.id, (error, result) => {
      handleCallBack(error, result, res);
    });
  }
);

let handleCallBack = (error, result, response) => {
  console.log("error: " + JSON.stringify(error));
  console.log("result:" + JSON.stringify(result));

  if (error) return response.status(500).json({ error: error });
  return response.status(200).json({ data: result });
};

module.exports = router;
