const express = require('express');
const bodyParser = require('body-parser');
const api = require('./Routes/api');

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use('/api',api);

app.listen(3003,()=>{console.log('Server listening on port 3003')});
