export const getMonsterSubType = (type: number): string => {
  let text = ''

  switch (type) {
    case 0:
      text = 'NENHUM'
      break
    case 1:
      text = 'ÁGUA'
      break
    case 2:
      text = 'ANJO'
      break
    case 3:
      text = 'AQUÁTICO'
      break
    case 4:
      text = 'AR'
      break
    case 5:
      text = 'ARCONTE'
      break
    case 6:
      text = 'AVANÇADO'
      break
    case 7:
      text = 'BAATEZU'
      break
    case 8:
      text = 'BEM'
      break
    case 9:
      text = 'CAÓTICO'
      break
    case 10:
      text = 'ELADRIM'
      break
    case 11:
      text = 'ENXAME'
      break
    case 12:
      text = 'FOGO'
      break
    case 13:
      text = 'FRIO'
      break
    case 14:
      text = 'GOBLINÓIDE'
      break
    case 15:
      text = 'GUARDINAL'
      break
    case 16:
      text = 'INCORPÓREO'
      break
    case 17:
      text = 'LEAL'
      break
    case 18:
      text = 'MAL'
      break
    case 19:
      text = 'METAMORFO'
      break
    case 20:
      text = 'NATIVO'
      break
    case 21:
      text = 'PLANAR'
      break
    case 22:
      text = 'RÉPTIL'
      break
    case 23:
      text = 'TANAR’RI'
      break
    case 24:
      text = 'TERRA'
      break
    default:
  }
  return text
}
