export default function getMonsterType(type) {
  let text = ''

  switch (type) {
    case 0:
      text = 'NENHUM'
      break
    case 1:
      text = 'ABERRAÇÃO'
      break
    case 2:
      text = 'ANIMAL'
      break
    case 3:
      text = 'BESTA MÁGICA'
      break
    case 4:
      text = 'CONSTRUCTO'
      break
    case 5:
      text = 'DRGÃO'
      break
    case 6:
      text = 'ELEMENTAL'
      break
    case 7:
      text = 'EXTRA-PLANAR'
      break
    case 8:
      text = 'FADA'
      break
    case 9:
      text = 'GIGANTE'
      break
    case 10:
      text = 'HUMANOIDE MONSTRUOSO'
      break
    case 11:
      text = 'HUMANOIDE'
      break
    case 12:
      text = 'INSETO'
      break
    case 13:
      text = 'LIMO'
      break
    case 14:
      text = 'MORTO–VIVO'
      break
    case 15:
      text = 'PLANTA'
      break
    default:
  }
  return text
}
