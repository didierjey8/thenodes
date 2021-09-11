const csv = require("csvtojson");
const converter = require("json-2-csv");

module.exports = {
  start(req, res) {
    res.status(200).json({ message: "Wellcome to the Api Nodes" });
  },
  async nodesGet(req, res) {
    {
      var formidable = require("formidable");
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        var file = files.filetoupload.path;
        config = {
          noheader: false,
          delimiter: "\t",
        };
        global.jsonData = await csv(config).fromFile(file);
        res.status(200).send(global.jsonData);
      });
    }
  },
  nodeUpdate(req, res) {
    let jsonData = global.jsonData;
    let id = req.body.id;
    let name = req.body.name;

    let control = 0;
    jsonData.forEach((item) => {
      if (item.id == id && item.read_only == 0) {
        item.name = name;
        control = 1;
      }
      return item;
    });
    if (control == 1) {
      res.status(200).send({ success: true, data: jsonData });
    } else {
      res
        .status(400)
        .json({ error: "You can't edit read_only elements.", data: jsonData });
    }
  },
  nodeDelete(req, res) {
    let jsonData = global.jsonData;
    let id = req.body.id;
    let control = 0;

    jsonData.forEach((item, index) => {
      if (item.id == id && item.read_only == 0) {
        jsonData.splice(index, 1);
        control = 1;
      }
    });
    if (control == 1) {
      res.status(200).send({ success: true, data: jsonData });
    } else {
      res.status(400).json({
        error: "You can't delete read_only elements.",
        data: jsonData,
      });
    }
  },
  nodeCreate(req, res) {
    let jsonData = global.jsonData;
    let parent = req.body.parent;
    let node = req.body.node;
    let newId = 0;

    jsonData.map((item) => {
      elId = parseInt(item.id);
      if (elId > newId) {
        newId = parseInt(item.id);
      }
    });

    node.id = `${(newId += 1)}`;
    node.parent = `${parent}`;

    let newOrder = ["id", "name", "description", "parent", "read_only"];
    node = JSON.parse(JSON.stringify(node, newOrder));

    jsonData.push(node);

    res.status(200).send({ success: true, id: newId, data: jsonData });
  },
  nodesExport(req, res) {
    let jsonData = global.jsonData;
    converter.json2csv(jsonData, (err, csv) => {
      res.setHeader("Content-disposition", "attachment; filename=output.csv");
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    });
  },
};
