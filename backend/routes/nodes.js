const csv = require("csvtojson");
const converter = require("json-2-csv");
var formidable = require("formidable");
var arrayToTree = require("array-to-tree");

module.exports = {
  start(req, res) {
    res.status(200).json({ message: "Wellcome to the Api Nodes" });
  },
  async nodesGet(req, res) {
    {
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        var file = files.filetoupload.path;
        config = {
          noheader: false,
          delimiter: "\t",
        };

        global.jsonData = await csv(config).fromFile(file);

        capturedData = arrayToTree(global.jsonData, {
          parentProperty: "parent",
          customID: "id",
        });

        res.status(200).send(capturedData);
      });
    }
  },
  nodeUpdate(req, res) {
    let id = req.body.id;
    let name = req.body.name;

    let control = 0;
    global.jsonData.forEach((item) => {
      if (item.id == id && item.read_only == 0) {
        item.name = name;
        control = 1;
      }
      return item;
    });

    capturedData = arrayToTree(global.jsonData, {
      parentProperty: "parent",
      customID: "id",
    });

    if (control == 1) {
      res.status(200).send({ success: true, data: capturedData });
    } else {
      res.status(400).json({
        error: "You can't edit read_only elements.",
        data: capturedData,
      });
    }
  },
  nodeDelete(req, res) {
    let id = req.body.id;

    let control = 0;

    global.jsonData.forEach((item, index) => {
      if (item.id == id && item.read_only == 0) {
        jsonData.splice(index, 1);
        control = 1;
      }
    });

    capturedData = arrayToTree(jsonData, {
      parentProperty: "parent",
      customID: "id",
    });

    if (control == 1) {
      res.status(200).send({ success: true, data: capturedData });
    } else {
      res.status(400).json({
        error: "You can't delete read_only elements.",
        data: capturedData,
      });
    }
  },
  nodeCreate(req, res) {
    let parent = req.body.parent;
    let node = req.body.node;
    let newId = 0;

    global.jsonData.map((item) => {
      elId = parseInt(item.id);
      if (elId > newId) {
        newId = parseInt(item.id);
      }
    });

    node.id = `${(newId += 1)}`;
    node.parent = `${parent}`;

    let newOrder = ["id", "name", "description", "parent", "read_only"];
    node = JSON.parse(JSON.stringify(node, newOrder));

    global.jsonData.push(node);

    capturedData = arrayToTree(global.jsonData, {
      parentProperty: "parent",
      customID: "id",
    });

    res.status(200).send({ success: true, id: node.id, data: capturedData });
  },
  nodesExport(req, res) {
    converter.json2csv(global.jsonData, (err, csv) => {
      res.setHeader("Content-disposition", "attachment; filename=output.csv");
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    });
  },
};
