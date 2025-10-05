module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('character_tokens', 'label', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('character_tokens', 'label')
  },
}
