import { Model, ModelStatic } from 'sequelize'
import {
  UserAttributes,
  CharacterAttributes,
  RaceAttributes,
  ClassAttributes,
  AlignmentAttributes,
  DivinityAttributes,
  WeaponAttributes,
  ArmorAttributes,
  EquipmentAttributes,
  PortraitAttributes,
  TokenAttributes,
  CharacterTokenAttributes,
  CharacterWeaponAttributes,
} from './interfaces'

// Interface para o objeto de modelos
export interface Models {
  User: ModelStatic<any>
  Character: ModelStatic<any>
  Race: ModelStatic<any>
  Class: ModelStatic<any>
  Alignment: ModelStatic<any>
  Divinity: ModelStatic<any>
  Weapon: ModelStatic<any>
  Armor: ModelStatic<any>
  Equipment: ModelStatic<any>
  Portrait: ModelStatic<any>
  Token: ModelStatic<any>
  CharacterToken: ModelStatic<any>
  CharacterWeapon: ModelStatic<any>
  CharacterClass: ModelStatic<any>
  CharacterArmor: ModelStatic<any>
  CharacterEquipment: ModelStatic<any>
  GameMap: ModelStatic<any>
  Attribute: ModelStatic<any>
  AttributeTemp: ModelStatic<any>
  BaseAttack: ModelStatic<any>
  BaseResist: ModelStatic<any>
  Campaign: ModelStatic<any>
  Monster: ModelStatic<any>
  MonsterAttribute: ModelStatic<any>
  MonsterAttack: ModelStatic<any>
}

// Função para configurar todas as associações
export function setupAssociations(models: Models): void {
  // Configurar associações existentes
  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models)
    }
  })

  // Associações específicas do Monster
  models.Monster.hasOne(models.MonsterAttribute, {
    foreignKey: 'monster_id',
    as: 'monster_attribute',
  })

  models.Monster.hasMany(models.MonsterAttack, {
    foreignKey: 'monster_id',
    as: 'monster_attacks',
  })

  models.Monster.belongsTo(models.Alignment, {
    foreignKey: 'alignment_id',
    as: 'alignment',
  })
}

export default function initAssociations() {
  // ... existing code ...
  // Removendo a inicialização do Note
  // ... existing code ...
  // ... existing code ...
  // Removendo a associação do Note
  // ... existing code ...
}
