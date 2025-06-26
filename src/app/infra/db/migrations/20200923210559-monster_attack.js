module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monster_attacks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      multiplier: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      critical: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      crit_from: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      range: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      hit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      damage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      monster_id: {
        type: Sequelize.INTEGER,
        references: { model: 'monsters', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('monster_attacks')
  },
}
