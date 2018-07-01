const express = require('express');
const router = express.Router();
const scenario = require('./scenario');

router.use('/scenario',scenario);

module.exports = router;
