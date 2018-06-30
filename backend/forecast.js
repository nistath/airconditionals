'use strict';
module.exports = (sequelize, DataTypes) => {
  var Forecast = sequelize.define('Forecast', {
    temp: DataTypes.INTEGER,
    hum: DataTypes.INTEGER,
    light: DataTypes.INTEGER,
    time: DataTypes.DATE,
    scenarioId: DataTypes.INTEGER
  }, {});
  Forecast.associate = function(models) {
    // associations can be defined here
    Forecast.belongsTo(models.Scenario,{
	foreignKey : {
		name : 'scenarioId'
	}
    });
  };
  return Forecast;
};
