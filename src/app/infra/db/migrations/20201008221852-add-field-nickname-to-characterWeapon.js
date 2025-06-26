module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('character_weapons', 'nickname', {
      type: Sequelize.STRING,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('character_weapons', 'nickname')
  },
}
