const express = require('express');
const fetch = require('node-fetch');
const db = require('../../models');

const router = express.Router();

router.get('/get',(req,res)=>{
	let {extTemp, extHum, extLight, intTemp, intHum, intLight, intPop, targetTemp, targetHum, targetLight} = req.query;
	fetch('http://stathashost:3030/api/query?extTemp='+ extTemp + '&extHum='+ extHum + '&extLight='+ extLight+ '&intTemp='+ intTemp + '&intHum='+ intHum + '&intLight='+ intLight + '&intPop='+ intPop + '&targetTemp='+ targetTemp + '&targetHum='+ targetHum + '&targetLight='+ targetLight).then(newstate => newstate.json()).then(newstate=>{
		db.State.create(newstate);
		res.json(newstate);
	});
});

module.exports = router;
