module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('weapons', {
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
      dice_s: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dice_m: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      multiplier_s: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      multiplier_m: {
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
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      str_bonus: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      book: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      version: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('weapons')
  },
}
