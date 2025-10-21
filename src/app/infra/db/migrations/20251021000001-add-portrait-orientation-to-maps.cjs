module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('game_maps')

    // Adiciona portrait se não existir
    if (!tableInfo.portrait) {
      await queryInterface.addColumn('game_maps', 'portrait', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      })
    }

    // Adiciona orientation se não existir
    if (!tableInfo.orientation) {
      await queryInterface.addColumn('game_maps', 'orientation', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      })
    }
  },

  down: async queryInterface => {
    const tableInfo = await queryInterface.describeTable('game_maps')

    if (tableInfo.portrait) {
      await queryInterface.removeColumn('game_maps', 'portrait')
    }

    if (tableInfo.orientation) {
      await queryInterface.removeColumn('game_maps', 'orientation')
    }
  },
}
