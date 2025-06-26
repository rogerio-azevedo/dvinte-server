module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('character_weapons', 'price', {
      type: Sequelize.INTEGER,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('character_weapons', 'price')
  },
}
