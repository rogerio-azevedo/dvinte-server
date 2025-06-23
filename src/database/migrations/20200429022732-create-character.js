module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('characters', {
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
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gender: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      skin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      eye: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hair: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      health: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      health_now: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      exp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      portrait_id: {
        type: Sequelize.INTEGER,
        references: { model: 'portraits', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      alignment_id: {
        type: Sequelize.INTEGER,
        references: { model: 'alignments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      race_id: {
        type: Sequelize.INTEGER,
        references: { model: 'races', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      divinity_id: {
        type: Sequelize.INTEGER,
        references: { model: 'divinities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      is_ativo: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('characters')
  },
}
