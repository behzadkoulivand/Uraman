const passport = require('passport');

const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
    });
};

// exports.handleLogin = (req, res, next) => {
//     passport.authenticate("local", {
//         successMessage:"okk",
//         failureRedirect: "/users/login",
//         failureFlash: true,
//     })(req, res, next);
// };

exports.rememberMe = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect("/dashboard");
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err); });
        req.flash("success_msg", "خروج موفقیت آمیز بود");
        res.redirect("/");
    
};

exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "اورامانات | ثبت‌نام کاربر",
        path: "/register",
    });
};

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, phone, password, isAdmin } = req.body;

        const user = await User.findOne({ phone });
        if (user) {
            errors.push({ message: "کاربری با این شماره تلفن موجود است" });
            return res.render("register", {
                pageTitle: "اورامانات | ثبت‌نام کاربر",
                path: "/register",
                errors,
            });
        }

        await User.create({ fullname, phone, password, isAdmin });

        req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });

        return res.render("register", {
            pageTitle: "اورامانات | ثبت‌نام کاربر",
            path: "/register",
            errors,
        });
    }
};
