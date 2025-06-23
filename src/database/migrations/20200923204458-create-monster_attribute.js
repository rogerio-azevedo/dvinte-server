module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monster_attributes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      strength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dexterity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      constitution: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      intelligence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wisdom: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      charisma: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      monster_id: {
        type: Sequelize.INTEGER,
        references: { model: 'monsters', key: 'id' },
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
    return queryInterface.dropTable('monster_attributes')
  },
}
