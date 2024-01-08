const {Router} = require('express');

const reserveController = require('../controllers/reserveController');
const {authenticated} = require('../middlewares/auth');

const router = new Router();

router.get('/', authenticated, reserveController.getReservePage);

router.get("/vila", authenticated, reserveController.getVilaReserve);

router.get("/apartment", authenticated, reserveController.getApartmentReserve);

router.get("/boom-gardi", authenticated, reserveController.getBoomGardiReserve);

router.get("/final-reserve/:id", authenticated, reserveController.getFinalReserve);

router.post("/final-reserve/:id", authenticated, reserveController.createFinalReserve);

router.get("/myTravels", authenticated, reserveController.getMyTravels);

router.get("/delete-reserve/:id", authenticated, reserveController.deleteReserve);

module.exports = router;