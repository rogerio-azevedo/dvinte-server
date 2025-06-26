'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('equipments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      str_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dex_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      con_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      int_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wis_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cha_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      book: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      version: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('equipments')
  },
}
