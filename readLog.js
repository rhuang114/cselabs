var fs = require('fs');

var data = fs.readFileSync("log.txt", "utf8");

exports.date = data.substring(0,28);
var labsArray = [];

labsArray.push("L" + data.substring(29,71));
labsArray.push("L" + data.substring(72,114));
labsArray.push("L" + data.substring(115,157));
labsArray.push("L" + data.substring(158,200));
labsArray.push("L" + data.substring(201,243));
labsArray.push("L" + data.substring(244,286));

exports.labs = labsArray;