const express = require('express');
const fetch = require('node-fetch');
const db = require('../../models');

const router = express.Router();

router.post('/create',(req,res)=>{
	let {name, description, extTemp, extHum, extLight, intTemp, intHum,intLight, intPop} = req.body;
	db.Scenario.create({
		name, description, extTemp, extHum, extLight, intTemp, intHum, intLight, intPop
	}).then(scenario=>{
		res.json(scenario);
	});
});

router.get('/get',(req,res)=>{
	db.Scenario.findAll({
		include : db.State	
	}).then(scenarios=>{
		res.json(scenarios.map((scenario) => { 
				let nvalue = scenario.States[0].tarTemp * 100, ovalue = scenario.States[0].acTarTemp * 90;
				let now = new Date();
				return {
					id : scenario.id,
					name : scenario.name,
					desc : scenario.description,
					external : {
						temperature : scenario.extTemp,
						humidity : scenario.extHum,
						light : scenario.extLight	
					},
					internal : {
						temperature : scenario.intTemp,
						humidity : scenario.intHum,
						light : scenario.intLight,
						population : scenario.intPop
					},
					results : {
						resultData : {
							isReal : true,
							naive : {
								value : nvalue,
								unit : 'W'	
							},
							optimized : {
								value : ovalue,
								unit : 'W'
							},
							savings : {
								unit : '€',
								value : (nvalue - ovalue)*3.6*2
							},
						},
						settings : {
							ac: 0,
							humidity : 0,
							light : 0
					//		ac : scenario.States[0].acTarTemp,
					//		humidity : ((scenario.extHum + scenario.intHum) / 2),
					//		light : (100 - (Math.ceil(50*Math.sin((now.getHours()-6)*Math.PI/12)+50) / 2))
						}
					}
				}; 
			}
		));
	});
});

router.get('/get/:id', (req,res)=>{
	let {id} = req.params;
	db.Scenario.findById(id,{
		include : db.State
	}).then(item=>{
		if(!item){
			res.json([]);
			return;
		}
		let states = item.States;
		let now = new Date();
		res.json(states.map((state, idx)=>{
			let nvalue = state.tarTemp * 100, ovalue = state.acTarTemp * 90;
			return {
				resultData : {
					isReal : true,
					naive : {
						value : nvalue,
						unit : 'W'	
					},
					optimized : {
						value : ovalue,
						unit : 'W'
					},
					savings : {
						unit : '€',
						value : (nvalue - ovalue)*3.6*2
					},
				},
				settings : {
					ac : ((idx)? (states[idx-1].acTarTemp + states[idx-1].acAction):(states[idx].acTarTemp)),
					humidity : ((item.extHum + item.intHum) / 2),
					light : Math.ceil((100 - (Math.ceil(50*Math.sin((now.getHours()-6)*Math.PI/12)+50) / 2)))
				}
			};
		})[states.length - 1]);
	});
});

module.exports = router;
