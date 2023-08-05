const { Router } = require('express');
const router = Router();
const controller = require('../controller/controller');

router.get("/base", controller.base);
router.get("/find/:id", controller.find);

module.exports = router;