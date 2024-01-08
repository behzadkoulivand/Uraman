const { Router } = require('express');

const homeController = require('../controllers/homeController');

const router = new Router();

router.get("/", homeController.getHome);

router.get("/map", homeController.getMap);

router.get("/intro", homeController.getIntro);

router.get("/nature", homeController.getNature);

router.get("/pirshaliar", homeController.getPirshaliar);

router.get("/support", homeController.getSupport);

router.get("/gallery", homeController.getGallery);

// router.get("/reserve/:id", homeController.getReserve);

// router.post("/reserve/:id", homeController.createReserve);

module.exports = router;
