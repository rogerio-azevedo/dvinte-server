module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('character_weapons', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      character_id: {
        type: Sequelize.INTEGER,
        references: { model: 'characters', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      weapon_id: {
        type: Sequelize.INTEGER,
        references: { model: 'weapons', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      hit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      damage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      element: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      crit_mod: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      crit_from_mod: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dex_damage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('character_weapons')
  },
}
