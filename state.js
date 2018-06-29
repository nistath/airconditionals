'use strict';
module.exports = (sequelize, DataTypes) => {
  var State = sequelize.define('State', {
    extTemp: DataTypes.INTEGER,
    extHum: DataTypes.INTEGER,
    extLight: DataTypes.INTEGER,
    intTemp: DataTypes.INTEGER,
    intHum: DataTypes.INTEGER,
    intLight: DataTypes.INTEGER,
    intPop: DataTypes.INTEGER,
    targetTemp: DataTypes.INTEGER,
    targetHum: DataTypes.INTEGER,
    targetLight: DataTypes.INTEGER
  }, {});
  State.associate = function(models) {
    // associations can be defined here
  };
  return State;
};