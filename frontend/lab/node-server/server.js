const express = require('express');
const path = require('path');
const yargs = require('yargs');

const app = express();

const argv = yargs
  .option('port', {
    alias: 'p',
    description: 'port to run the server on',
    type: 'number',
    default: 9000,
  })
  .option('path', {
    alias: 'pt',
    description: 'Path to listen for files',
    type: 'string',
    default: __dirname,
  })
  .help()
  .alias('help', 'h').argv;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const port = argv.port;
const vpath = argv.path;

app.use(express.static(path.join(vpath, 'dist')));

app.listen(port, () => {
  console.warn(`Server is running in port : ${port}`);
  console.warn(`Server is listening in location : ${path.join(vpath, 'dist')}`);
});
