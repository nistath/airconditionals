const express = require('express');
const fetch = require('node-fetch');
const db = require('../../models');
const router = express.Router();

router.post('/create',(req,res)=>{
	let {name, extTemp, extHum, extLight, intTemp, intHum, intLight, intPop} = req.body;
	db.Scenario.create({
		name, extTemp, extHum, extLight, intTemp, intHum, intLight, intPop
	}).then(item=>{
		fetch('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/182536?apikey=KuCuq4C3xllx6FsS8nLJVp6OSJ7hw9Uv&metric=true&details=true').then(data=>data.json()).then(data=>{
			let now = new Date();
			for(let i = 0; i < 3; i++){
				let temperature = Math.ceil(data[i].Temperature.Value), humidity = Math.ceil(data[i].RelativeHumidity),time = data[i].DateTime, light = Math.ceil(50*Math.sin((now.getHours()+i-5)*Math.PI/12)+50);
				item.createForecast({
					temp : temperature, hum : humidity, light : light, time : time
				});
			}
		});
		res.json(item);	
	});
});

router.get('/get',(req,res)=>{
	db.Scenario.findAll({
		include : db.Forecast	
	}).then(items=>{
		res.json(items);
	});
});

router.get('/get/:id',(req,res)=>{
	let {id} = req.params;
	db.Scenario.findById(id,{
		include : db.Forecast	
	}).then(item=>{
		res.json(item);
	});
});

module.exports = router;
