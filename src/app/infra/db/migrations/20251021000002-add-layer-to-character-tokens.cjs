module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('character_tokens', 'layer', {
      type: Sequelize.ENUM('public', 'gm'),
      allowNull: false,
      defaultValue: 'public',
      after: 'label',
    })

    // Atualiza todos os tokens existentes para o layer público
    await queryInterface.sequelize.query(
      "UPDATE character_tokens SET layer = 'public' WHERE layer IS NULL"
    )
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('character_tokens', 'layer')
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_character_tokens_layer'
    )
  },
}
