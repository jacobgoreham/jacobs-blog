const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./homeRoutes.js");
const dashboardRoutes = require("./dashboardRoutes.js");

//route controllers
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/", homeRoutes);

//if error ends
router.use((req, res) => {
  res.status(404).end();
});

//export
module.exports = router;
