'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('States', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      extTemp: {
        type: Sequelize.INTEGER
      },
      extHum: {
        type: Sequelize.INTEGER
      },
      extLight: {
        type: Sequelize.INTEGER
      },
      intTemp: {
        type: Sequelize.INTEGER
      },
      intHum: {
        type: Sequelize.INTEGER
      },
      intLight: {
        type: Sequelize.INTEGER
      },
      intPop: {
        type: Sequelize.INTEGER
      },
      targetTemp: {
        type: Sequelize.INTEGER
      },
      targetHum: {
        type: Sequelize.INTEGER
      },
      targetLight: {
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
    return queryInterface.dropTable('States');
  }
};