module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('character_armors', 'price', {
      type: Sequelize.INTEGER,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('character_armors', 'price')
  },
}
