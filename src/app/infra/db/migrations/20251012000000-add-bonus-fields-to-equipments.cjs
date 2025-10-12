'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('equipments', 'attack_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    await queryInterface.addColumn('equipments', 'damage_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    await queryInterface.addColumn('equipments', 'armor_class_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    await queryInterface.addColumn('equipments', 'fortitude_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    await queryInterface.addColumn('equipments', 'reflex_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    await queryInterface.addColumn('equipments', 'will_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('equipments', 'attack_bonus')
    await queryInterface.removeColumn('equipments', 'damage_bonus')
    await queryInterface.removeColumn('equipments', 'armor_class_bonus')
    await queryInterface.removeColumn('equipments', 'fortitude_bonus')
    await queryInterface.removeColumn('equipments', 'reflex_bonus')
    await queryInterface.removeColumn('equipments', 'will_bonus')
  },
}
