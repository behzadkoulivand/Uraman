const { Router } = require('express');
const passport = require('passport');

const userController = require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');
const router = new Router();

router.get("/login", userController.getLogin);

// router.post("/login", userController.handleLogin, userController.rememberMe);
router.post(
  "/login",
  passport.authenticate('local', {
    failureRedirect: "/users/login",
    successMessage: "logined",
    session: true,
    successFlash: true
  }), (req, res, next) => {
    if (req.user.isAdmin == "admin") {
      res.redirect("/dashboard/account");
      req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 * 10; // 10 Day
    }
    if (req.user.isAdmin == "normalUser") {
      res.redirect("/dashboard/account");
      req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 * 10;
    }
  });


router.get("/register", userController.register);

router.get("/logout", userController.logout);

router.post("/register", userController.createUser);

module.exports = router;