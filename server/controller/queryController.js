// controllers/queryController.js
const Query = require("../model/queryModel");

// Fetch all queries
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json({ success: true, queries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add a new query
exports.addQuery = async (req, res) => {
  const { name, email, query } = req.body;
  try {
    const newQuery = new Query({ name, email, query });
    await newQuery.save();
    res
      .status(201)
      .json({ success: true, message: "Query submitted successfully" });
  } catch (error) {
    console.error("Error adding query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Respond to a query
exports.respondToQuery = async (req, res) => {
  const { response } = req.body;
  const { id } = req.params;
  try {
    const query = await Query.findById(id);
    if (!query) {
      return res
        .status(404)
        .json({ success: false, message: "Query not found" });
    }
    query.response = response;
    await query.save();
    res
      .status(200)
      .json({ success: true, message: "Response added successfully" });
  } catch (error) {
    console.error("Error responding to query:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
