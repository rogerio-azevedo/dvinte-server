module.exports = {
  up: queryInterface => {
    return queryInterface.dropTable('equipment')
  },

  down: (queryInterface, Sequelize) => {
    // Não vamos implementar o down pois queremos manter apenas a tabela no plural
    return Promise.resolve()
  },
}
