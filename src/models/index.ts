import { Sequelize } from 'sequelize'
import databaseConfig from '../config/database'
import { Models } from './associations'

// Importações dos modelos
import { initUser } from './User'
import { initCharacter } from './character'
import { initRace } from './Race'
import { initClass } from './Class'
import { initAlignment } from './Alignment'
import { initDivinity } from './Divinity'
import { initWeapon } from './Weapon'
import { initArmor } from './Armor'
import { initEquipment } from './Equipment'
import { initPortrait } from './Portrait'
import { initToken } from './Token'
import { initCharacterToken } from './CharacterToken'
import { initCharacterClass } from './CharacterClass'
import { initCharacterWeapon } from './CharacterWeapon'
import { initCharacterArmor } from './CharacterArmor'
import { initCharacterEquipment } from './CharacterEquipment'
import { initGameMap } from './GameMap'
import { initAttribute } from './Attribute'
import { initAttributeTemp } from './AttributeTemp'
import { initBaseAttack } from './BaseAttack'
import { initBaseResist } from './BaseResist'
import { setupAssociations } from './associations'

// Inicializa a conexão com o banco de dados
const sequelize = new Sequelize(databaseConfig)

// Inicializa os modelos
const models: Models = {
  User: initUser(sequelize),
  Character: initCharacter(sequelize),
  Race: initRace(sequelize),
  Class: initClass(sequelize),
  Alignment: initAlignment(sequelize),
  Divinity: initDivinity(sequelize),
  Weapon: initWeapon(sequelize),
  Armor: initArmor(sequelize),
  Equipment: initEquipment(sequelize),
  Portrait: initPortrait(sequelize),
  Token: initToken(sequelize),
  CharacterToken: initCharacterToken(sequelize),
  CharacterClass: initCharacterClass(sequelize),
  CharacterWeapon: initCharacterWeapon(sequelize),
  CharacterArmor: initCharacterArmor(sequelize),
  CharacterEquipment: initCharacterEquipment(sequelize),
  GameMap: initGameMap(sequelize),
  Attribute: initAttribute(sequelize),
  AttributeTemp: initAttributeTemp(sequelize),
  BaseAttack: initBaseAttack(sequelize),
  BaseResist: initBaseResist(sequelize),
}

// Executa as associações
setupAssociations(models)

export { sequelize }
export default models
