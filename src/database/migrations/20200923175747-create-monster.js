module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monsters', {
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
      sub_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ca: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      defense: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      health: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      health_now: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      initiative: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      displacement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attack_special: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      special_qualities: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      grab: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fort: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reflex: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      will: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      skills: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      feats: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      challenge: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      alignment_id: {
        type: Sequelize.INTEGER,
        references: { model: 'alignments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      monster_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_ativo: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('monsters')
  },
}
