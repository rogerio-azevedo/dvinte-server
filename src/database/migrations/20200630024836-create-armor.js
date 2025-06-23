module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('armors', {
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
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bonus: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dexterity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      penalty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      magic: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      displacement_s: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      displacement_m: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('armors')
  },
}
