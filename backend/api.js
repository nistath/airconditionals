const express = require('express');
const router = express.Router();
const cases = require('./case');
const actions = require('./action');

router.use('/cases',cases);
router.use('/actions',actions);

module.exports = router;
