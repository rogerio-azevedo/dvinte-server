import { Sequelize, Model } from 'sequelize'

class Monster extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type: Sequelize.INTEGER,
        sub_type: Sequelize.INTEGER,
        ca: Sequelize.INTEGER,
        defense: Sequelize.STRING,
        health: Sequelize.INTEGER,
        health_now: Sequelize.INTEGER,
        size: Sequelize.INTEGER,
        initiative: Sequelize.INTEGER,
        displacement: Sequelize.STRING,
        attack_special: Sequelize.STRING,
        special_qualities: Sequelize.STRING,
        grab: Sequelize.INTEGER,
        fort: Sequelize.INTEGER,
        reflex: Sequelize.INTEGER,
        will: Sequelize.INTEGER,
        skills: Sequelize.STRING,
        feats: Sequelize.STRING,
        challenge: Sequelize.INTEGER,
        notes: Sequelize.STRING,
        monster_url: Sequelize.STRING,
        is_ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    )

    return this
  }
  static associate(models) {
    this.hasOne(models.MonsterAttributes, {
      foreignKey: 'monster_id',
      as: 'monster_attribute',
    })

    this.hasMany(models.MonsterAttack, {
      foreignKey: 'monster_id',
      as: 'monster_attack',
    })

    this.belongsTo(models.Alignment, {
      foreignKey: 'alignment_id',
      as: 'alignment',
    })
  }
}

export default Monster
