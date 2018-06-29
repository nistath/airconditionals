'use strict';
module.exports = (sequelize, DataTypes) => {
  var Scenario = sequelize.define('Scenario', {
    name: DataTypes.STRING,
    description : DataTypes.TEXT,
    extTemp: DataTypes.INTEGER,
    extHum: DataTypes.INTEGER,
    extLight: DataTypes.INTEGER,
    intTemp: DataTypes.INTEGER,
    intHum: DataTypes.INTEGER,
    intLight: DataTypes.INTEGER,
    intPop: DataTypes.INTEGER
  }, {});
  Scenario.associate = function(models) {
    // associations can be defined here
    Scenario.hasMany(models.Forecast,{
	    foreignKey : {
		    name : 'scenarioId'
	    }
    });
  };
  return Scenario;
};
