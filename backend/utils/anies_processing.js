const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const aniesProcess = document => {
  document = document.replace(/\[\"/g, '"');
  document = document.replace(/\"]/g, '"');
  document = document.replace(/\\/g, '');
  console.log('document=======  ', document);
  let xmlParsedDoc = new dom().parseFromString(document);
  //console.log('xmlParsedDoc', xmlParsedDoc);
  let nodes = xpath.select('//datafield[@tag=906]/subfield', xmlParsedDoc);
  let nodesData = nodes[0].toString();
  console.log('nodes=====  ', nodesData);
  nodesData = nodesData.replace(/<subfield(.*?)>/g, '');
  nodesData = nodesData.replace(/<\/subfield>/g, '');
  console.log('nodes=====  ', nodesData);
};

module.exports = aniesProcess;
