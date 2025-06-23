module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('character_tokens', 'enabled', {
      type: Sequelize.BOOLEAN,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('character_tokens', 'enabled')
  },
}
