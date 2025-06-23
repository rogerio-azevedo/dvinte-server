module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      platinum: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gold: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      silver: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      copper: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      character_id: {
        type: Sequelize.INTEGER,
        references: { model: 'characters', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('monies')
  },
}
