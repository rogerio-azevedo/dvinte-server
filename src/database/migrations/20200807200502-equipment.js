module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('equipment', {
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
      str_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dex_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      con_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      int_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wis_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cha_temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      weight: {
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
    return queryInterface.dropTable('equipment')
  },
}
