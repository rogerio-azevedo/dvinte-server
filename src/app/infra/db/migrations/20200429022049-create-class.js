module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('classes', {
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
      attack: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fortitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reflex: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      will: {
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
    return queryInterface.dropTable('classes')
  },
}
