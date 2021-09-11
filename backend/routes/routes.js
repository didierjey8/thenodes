const express = require("express");
const router = express.Router();
const nodes = require("./nodes");

router.all("/", nodes.start);

router.post("/get_tree/", nodes.nodesGet);
router.post("/update_node/", nodes.nodeUpdate);
router.post("/delete_node/", nodes.nodeDelete);
router.post("/create_node/", nodes.nodeCreate);
router.post("/export_csv/", nodes.nodesExport);

module.exports = router;
