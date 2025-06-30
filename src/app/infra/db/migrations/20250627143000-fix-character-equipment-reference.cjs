module.exports = {
  async up(queryInterface, Sequelize) {
    // Primeiro, remover a constraint antiga
    await queryInterface.removeConstraint(
      'character_equipments',
      'character_equipments_equipment_id_fkey'
    )

    // Adicionar a nova constraint com a referência correta
    await queryInterface.addConstraint('character_equipments', {
      fields: ['equipment_id'],
      type: 'foreign key',
      name: 'character_equipments_equipment_id_fkey',
      references: {
        table: 'equipments',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    // No down, reverter para a referência antiga
    await queryInterface.removeConstraint(
      'character_equipments',
      'character_equipments_equipment_id_fkey'
    )

    await queryInterface.addConstraint('character_equipments', {
      fields: ['equipment_id'],
      type: 'foreign key',
      name: 'character_equipments_equipment_id_fkey',
      references: {
        table: 'equipment',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
}
