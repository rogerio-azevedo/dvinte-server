module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('base_attacks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      low: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      medium: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      high: {
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
    return queryInterface.dropTable('base_attacks')
  },
}
