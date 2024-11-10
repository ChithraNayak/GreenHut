const express = require("express");
const router = express.Router();
const queryController = require("../controller/queryController");

// Fetch all queries
router.get("/", queryController.getAllQueries);

// Add a new query
router.post("/addquery", queryController.addQuery);

// Respond to a query
router.put("/:id", queryController.respondToQuery);

module.exports = router;
