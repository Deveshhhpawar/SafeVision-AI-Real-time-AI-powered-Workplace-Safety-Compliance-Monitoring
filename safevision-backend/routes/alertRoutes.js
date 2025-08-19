const express = require("express");
const router = express.Router();
const { createAlert, getAlerts } = require("../controllers/alertController");

router.post("/", createAlert);   // Save new alert
router.get("/", getAlerts);      // Fetch all alerts

module.exports = router;
