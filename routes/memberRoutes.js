const express = require("express");
const auth = require("../middleware/auth");
const {
  getMembers,
  getStats,
  createMember,
  updateMember,
  deleteMember,
  addPayment,
  deletePayment,
} = require("../controller/memberController");

const router = express.Router();

router.use(auth); // protect all member routes

router.get("/stats", getStats);
router.get("/", getMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

router.post("/:id/payments", addPayment);
router.delete("/:id/payments/:paymentId", deletePayment);

module.exports = router;
