'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Forecasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      temp: {
        type: Sequelize.INTEGER
      },
      hum: {
        type: Sequelize.INTEGER
      },
      light: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      scenarioId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Forecasts');
  }
};