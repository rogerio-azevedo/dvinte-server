module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro remove a constraint antiga
    await queryInterface.removeConstraint(
      'character_equipments',
      'character_equipments_equipment_id_fkey'
    )

    // Depois adiciona a nova constraint apontando para a tabela equipments
    return queryInterface.addConstraint('character_equipments', {
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

  down: async (queryInterface, Sequelize) => {
    // Primeiro remove a nova constraint
    await queryInterface.removeConstraint(
      'character_equipments',
      'character_equipments_equipment_id_fkey'
    )

    // Depois adiciona a constraint antiga apontando para a tabela equipment
    return queryInterface.addConstraint('character_equipments', {
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
