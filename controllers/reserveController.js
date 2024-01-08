const Stay = require('../models/Stay');
const User = require('../models/User');
const Reserve = require('../models/Reserve');
const { get500 } = require("./errorController");

exports.getReservePage = async (req, res) => {
    try {
        const vilaStays = await Stay.find({ typeStay: "ویلا" }).sort({
            createdAt: "desc",
        });

        const apartments = await Stay.find({ typeStay: "آپارتمان" }).sort({
            createdAt: "desc",
        });

        const boomGardis = await Stay.find({ typeStay: "بوم گردی" }).sort({
            createdAt: "desc",
        });

        res.render("reservePage", {
            pageTitle: "اورامانات | اقامت",
            path: "/booking",
            layout: "./layouts/homeLayout",
            vilaStays,
            apartments,
            boomGardis,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500();
    }
};

exports.getVilaReserve = async (req, res) => {
    try {
        const vilaStays = await Stay.find({ typeStay: "ویلا" }).sort({
            createdAt: "desc",
        });
        res.render("private/reserveVila", {
            pageTitle: "اورامانات | رزرو ویلا",
            layout: "./layouts/homeLayout",
            path: "/vila-reserve",
            vilaStays,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500();
    }
};

exports.getBoomGardiReserve = async (req, res) => {
    try {
        const boomGardis = await Stay.find({ typeStay: "بوم گردی" }).sort({
            createdAt: "desc",
        });
        res.render("private/reserveBoomGardi", {
            pageTitle: "اورامانات | رزرو بوم‌گردی",
            layout: "./layouts/homeLayout",
            path: "/boomgardi-reserve",
            boomGardis,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500();
    }
};

exports.getApartmentReserve = async (req, res) => {
    try {
        const apartments = await Stay.find({ typeStay: "آپارتمان" }).sort({
            createdAt: "desc",
        });
        res.render("private/reserveApartment", {
            pageTitle: "اورامانات | رزرو آپارتمان",
            layout: "./layouts/homeLayout",
            path: "/apartment-reserve",
            apartments,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500();
    }
};

exports.getMyTravels = async (req, res) => {
    var myTravels = [];
    var stayReserveds = [];
    var travels = [];

    travels = await Reserve.find({ reservatore: req.user.id });

    for (var i = 0; i < travels.length; i++) {
        stayReserveds[i] = await Stay.findById({ _id: travels[i].stay });
        myTravels.push({ stay: stayReserveds[i], travel: travels[i] });
    };

    try {
        res.render("private/myTravels", {
            pageTitle: "اورامانات | سفرهای من",
            layout: "./layouts/homeLayout",
            path: "/myTravels",
            myTravels,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getFinalReserve = async (req, res) => {
    const id = req.params.id;
    const stay = await Stay.findById(id);
    const admin = await User.findById(stay.user._id);
    try {
        res.render("private/finalReserve", {
            pageTitle: "اورامانات | رزرو اقامت‌گاه",
            layout: "./layouts/homeLayout",
            path: "/final-reserve",
            stay,
            admin,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500();
    }
};

exports.deleteReserve = async (req, res) => {
    try {
        const result = await Reserve.findByIdAndRemove(req.params.id);
        console.log(result);
        res.redirect("/reserve/myTravels");
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.createFinalReserve = async (req, res) => {
    const id = req.params.id;
    const stay = await Stay.findById(id);
    const admin = await User.findById(stay.user._id);
    try {
        req.body = { ...req.body };
        const { entryDate, exitDate } = req.body;

        await Reserve.create({
            reservatore: req.user.id,
            stay: req.params.id,
            entryDate,
            exitDate
        });

    } catch (err) {
        console.log(err);
        res.render("private/finalReserve", {
            pageTitle: "اورامانات | رزرو اقامت‌گاه",
            layout: "./layouts/homeLayout",
            path: "/final-reserve",
            stay,
            admin,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    }
};