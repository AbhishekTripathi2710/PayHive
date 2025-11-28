const express = require("express");
const router = express.Router();

const  auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/planMiddleware");
const planController = require("../controllers/planController");

router.post("/",auth,admin,planController.create);
router.get("/",auth,admin,planController.list);
router.put("/:id",auth,admin,planController.update);
router.delete("/:id",auth,admin,planController.delete);

module.exports = router;