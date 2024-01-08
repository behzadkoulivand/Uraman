const Stay = require('../models/Stay');
const { get500 } = require('./errorController');
const { formatDate } = require('../utils/jalali');

exports.getHome = (req, res) => {
    res.render("index", {
        pageTitle: "صفحه اصلی اورامانات",
        path: "/home",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
    });
};

exports.getMap = (req, res) => {
    res.render("map", {
        pageTitle: "اورامانات | نقشه",
        path: "/map",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
         
    });
};

exports.getIntro = (req, res) => {
    res.render("intro", {
        pageTitle: "اورامانات | معرفی",
        path: "/intro",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
         
    });
};

exports.getNature = (req, res) => {
    res.render("nature", {
        pageTitle: "اورامانات | طبیعت",
        path: "/nature",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
    });
};

exports.getPirshaliar = (req, res) => {
    res.render("pirshaliar", {
        pageTitle: "اورامانات | پیرشالیار",
        path: "/pirshaliar",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
    });
};

exports.getSupport = (req, res) => {
    res.render("support", {
        pageTitle: "اورامانات | پشتیبانی",
        path: "/support",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
    });
};

exports.getGallery = (req, res) => {
    res.render("gallery", {
        pageTitle: "اورامانات | گالری تصاویر",
        path: "/gallery",
        layout: "./layouts/homeLayout",
        isLogined: req.isAuthenticated()
         
    });
};



// exports.getReserve = async (req, res) => {
//     try {
//         const stay = await Stay.findOne({_id: req.params.id});
//         res.render("reserve", {
//             pageTitle: "اورامانات | رزرو اقامت",
//             path: "/reserve",
//             layout: "./layouts/homeLayout",
//             stay,
//             formatDate
//         });
//     } catch (err) {
//         console.log(err);
//         get500();
//     }
// };

// exports.createReserve = async (req, res) => {
//     const errors = [];
//     try {
//         await Karber.karbarValidation(req.body);
//         const { fname, phone } = req.body;
//         //const stay = await Stay.findOne({_id: req.params.id});
//         const StayID =  req.params.id;

//         const karbar = await Karber.create({ ... req.body, reservedStay: StayID});
//         //res.status(200).json(karbar);
//         req.flash("success_msg", "اقامت برای شما با موفقیت رزرو شد");
//         res.render("karbarDashboard", {
//             pageTitle: "اورامانات | داشبورد کاربر",
//             path: "/karbarDashboard",
//             layout: "./layouts/homeLayout",
//             formatDate,
//             karbar,
//         })
//     } catch (err) {
//         console.log(err);
//         //res.status(500).json("مشکلی هست")
//         err.inner.forEach((e) => {
//             errors.push({
//                 name: e.path,
//                 message: e.message,
//             });
//         });

//         res.render("reserve", {
//             pageTitle: "اورامانات | رزرو اقامت",
//             path: "/reserve",
//             layout: "./layouts/homeLayout",
//             stay,
//             formatDate, 
//             errors
//         });
//     }
// };

