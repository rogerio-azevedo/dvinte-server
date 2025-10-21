module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('game_maps', 'battle_gm', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })

    await queryInterface.addColumn('game_maps', 'portrait_gm', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('game_maps', 'battle_gm')
    await queryInterface.removeColumn('game_maps', 'portrait_gm')
  },
}

