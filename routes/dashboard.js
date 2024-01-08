const { Router } = require('express');

const adminController = require('../controllers/adminController');
const { authenticated} = require('../middlewares/auth');

const router = new Router();

//  @desc   Dashboard
//  @route  GET /dashboard
//router.get("/", authenticated, adminController.getDashboard);

router.get("/account", authenticated, adminController.getAccount);

router.get("/bardasht", authenticated, adminController.getBardasht);

router.get("/myHostings", authenticated, adminController.getMyHostings);

router.get("/list-of-reservations/:id", authenticated, adminController.getListOfReservations);

//  @desc   Dashboard Add Stay
//  @route  GET /dashboard/add-stay
router.get("/newHosting", authenticated, adminController.getNewHosting);

//  @desc   Dashboard Delete Stay
//  @route  GET /dashboard/delete-stay/:id
router.get("/delete-stay/:id", authenticated, adminController.deleteStay);

//  @desc   Dashboard Handle Stay Creation
//  @route  POST /dashboard/add-stay
router.post("/newHosting", authenticated, adminController.createStay);

//  @desc   Dashboard Edit Stay
//  @route  GET /dashboard/edit-stay/:id
router.get("/editHosting/:id", authenticated, adminController.getEditHosting);

//  @desc   Dashboard Handle Stay Edit
//  @route  POST /dashboard/edit-stay/:id
router.post("/edit-stay/:id", authenticated, adminController.editStay);


module.exports = router;