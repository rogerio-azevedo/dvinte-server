module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('game_maps', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        references: { model: 'campaigns', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      battle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      world: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      grid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      fog: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      gm_layer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      owner: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable('game_maps')
  },
}
