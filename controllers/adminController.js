const fs = require('fs');

const shortId = require('shortid');
const appRoot = require('app-root-path');
const sharp = require('sharp');

const Stay = require('../models/Stay');
const Reserve = require('../models/Reserve');
const User = require('../models/User');
const { formatDate } = require('../utils/jalali');
const { get500 } = require("./errorController");

// exports.getDashboard = async (req, res) => {

//     try {
//         const stays = await Stay.find({ user: req.user.id });
//         res.render("private/dashboard", {
//             pageTitle: "بخش مدیریت | داشبورد",
//             path: "/dashboard",
//             layout: "./layouts/dashLayout",
//             fullname: req.user.fullname,
//             stays,
//             formatDate,
//         });
//     } catch (err) {
//         console.log(err);
//         get500(req, res);
//     }
// };
exports.getMyHostings = async (req, res) => { 
    try {
        const stays = await Stay.find({ user: req.user.id });
        res.render("private/myHostings", {
            pageTitle: "بخش مدیریت اقامت‌ها | داشبورد",
            path: "/myHostings",
            layout: "./layouts/homeLayout",
            user: req.user,
            stays,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.getListOfReservations = async (req, res) => {
    const id = req.params.id;
    const stay = await Stay.findById(id);
    const reserves = await Reserve.find({stay: id});
    var userId = [];
    var reservatore = [];
    var reservedList = [];
    for(var i = 0; i < reserves.length; i++){
        userId.push(reserves[i].reservatore);
        reservatore.push(await User.findById(userId[i]));
        reservedList.push({reservatore: reservatore[i], reserve: reserves[i]});
    };

    try {
        res.render("private/listOfReservations", {
            pageTitle: "لیست رزروشده‌ها",
            layout: "./layouts/homeLayout",
            path: "/listOf",
            stay,
            reservedList,
            formatDate,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        })
    } catch (err) {
        console.log(err);
        get500();
    }

}

exports.getNewHosting = (req, res) => {
    res.render("private/newHosting", {
        pageTitle: "بخش مدیریت | ساخت اقامت جدید",
        path: "/dashboard/newhosting",
        layout: "./layouts/homeLayout",
        user: req.user,
        fullname: req.user.fullname,
        isLogined: req.isAuthenticated()
    });
};

exports.getEditHosting = async (req, res) => {
    const stay = await Stay.findOne({
        _id: req.params.id,
    });

    if (!stay) {
        return res.redirect("errors/404");
    }

    if (stay.user.toString() != req.user._id) {
        return res.redirect("/dashboard/myHostings");
    } else {
        res.render("private/editHosting", {
            pageTitle: "بخش مدیریت | ویرایش اقامت",
            path: "/dashboard/edit-stay",
            layout: "./layouts/homeLayout",
            user: req.user,
            stay,
            isLogined: req.isAuthenticated()
        });
    }
};

exports.editStay = async (req, res) => {
    const errorArr = [];

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    const thumbnail2 = req.files ? req.files.thumbnail2 : {};
    const fileName2 = `${shortId.generate()}_${thumbnail2.name}`;
    const uploadPath2 = `${appRoot}/public/uploads/thumbnails/${fileName2}`;

    const stay = await Stay.findOne({ _id: req.params.id });
    try {
        if (thumbnail.name)
            await Stay.stayValidation({ ...req.body, thumbnail });
        else
            await Stay.stayValidation({
                ...req.body,
                thumbnail: {
                    name: "placeholder",
                },
            });
        if (!stay) {
            return res.redirect("errors/404");
        }

        if (stay.user.toString() != req.user._id) {
            return res.redirect("/dashboard");
        } else {
            if (thumbnail.name) {
                fs.unlink(
                    `${appRoot}/public/uploads/thumbnails/${stay.thumbnail}`,
                    async (err) => {
                        if (err) console.log(err);
                        else {
                            await sharp(thumbnail.data)
                                .jpeg({ quality: 60 })
                                .toFile(uploadPath)
                                .catch((err) => console.log(err));
                        }
                    }
                );
            };
            let Vojod;
            fs.exists(`${appRoot}/public/uploads/thumbnails/${stay.thumbnail2}`, (e) => {
                console.log(e ? Vojod = 1 : Vojod = 0);
            });

            if (thumbnail2.name && Vojod == 1) {
                fs.unlink(
                    `${appRoot}/public/uploads/thumbnails/${stay.thumbnail2}`,
                    async (err) => {
                        if (err) console.log(err);
                        else {
                            await sharp(thumbnail2.data)
                                .jpeg({ quality: 60 })
                                .toFile(uploadPath2)
                                .catch((err) => console.log(err));
                        }
                    }
                );
            };
            if (thumbnail2.name && Vojod == 0) {
                async (err) => {
                    if (err) console.log(err);
                    else {
                        await sharp(thumbnail2.data)
                            .jpeg({ quality: 60 })
                            .toFile(uploadPath2)
                            .catch((err) => console.log(err));
                    }
                }
            };

            const { title, price, entryDate, exitDate } = req.body;
            stay.title = title;
            stay.price = price;
            stay.entryDate = entryDate;
            stay.exitDate = exitDate;
            stay.thumbnail = thumbnail.name ? fileName : stay.thumbnail;
            stay.thumbnail2 = thumbnail2.name ? fileName2 : stay.thumbnail2;

            await stay.save();
            return res.redirect("/dashboard");
        }
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/editStay", {
            pageTitle: "بخش مدیریت | ویرایش اقامت",
            path: "/dashboard/edit-stay",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
            stay,
        });
    }
};

exports.deleteStay = async (req, res) => {
    try {
        await Stay.findByIdAndRemove(req.params.id);
        await Reserve.deleteMany({ stay: req.params.id });
        res.redirect("/dashboard/myHostings");
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.createStay = async (req, res) => {
    const errorArr = [];

    const thumbnail = req.files ? req.files.thumbnail : {};
    var fileName = [];
    var uploadPath = [];
    for (let i = 0; i < thumbnail.length; i++) {
        fileName[i] = { fname: `${shortId.generate()}_${thumbnail[i].name}` };
    }
    for (let i = 0; i < fileName.length; i++) {
        uploadPath[i] = { pathh: `${appRoot}/public/uploads/thumbnails/${fileName[i].fname}` };
    }

    //const fileName = `${shortId.generate()}_${thumbnail.name}`;
    // const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    // const thumbnail2 = req.files ? req.files.thumbnail2 : {};
    // const fileName2 = `${shortId.generate()}_${thumbnail2.name}`;
    // const uploadPath2 = `${appRoot}/public/uploads/thumbnails/${fileName2}`;

    try {
        req.body = { ...req.body, thumbnail };
        //req.body = { ...req.body };

        await Stay.stayValidation(req.body);

        for (let i = 0; i < thumbnail.length; i++) {
            await sharp(thumbnail[i].data)
                .jpeg({ quality: 60 })
                .toFile(uploadPath[i].pathh)
                .catch((err) => console.log(err));
        }


        await Stay.create({
            ...req.body,
            user: req.user.id,
            thumbnail: fileName,
            // thumbnail2: fileName2,
        });
        //res.redirect("/dashboard/myHostings");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/newHosting", {
            pageTitle: "بخش مدیریت | ساخت اقامت جدید",
            path: "/dashboard/newhosting",
            layout: "./layouts/homeLayout",
            user: req.user,
            errors: errorArr,
            fullname: req.user.fullname,
            isLogined: req.isAuthenticated()
        });
    }
};

exports.getAccount = async (req, res) => {

    res.render("private/account", {
        pageTitle: "اورامانات | حساب کاربری",
        layout: "./layouts/homeLayout",
        path: "/account",
        user: req.user,
        fullname: req.user.fullname,
        isLogined: req.isAuthenticated()
    });
};

exports.getBardasht = (req, res) => {

    res.render("private/bardasht", {
        pageTitle: "اورامانات | برداشت از کیف‌ پول",
        layout: "./layouts/homeLayout",
        path: "/account",
        user: req.user,
        fullname: req.user.fullname,
        isLogined: req.isAuthenticated()
    });
};

//----------------------------------------------------------reserve---------------------------

