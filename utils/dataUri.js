const DataUriParser = require('datauri/parser.js');
const path = require('path');

const getDataUri = (file) => {
  const parser = new DataUriParser();
  // Ensure file.originalname is defined and use lowercase 'name'
  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer);
};

module.exports = getDataUri;
