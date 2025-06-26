export const getSize = (size: number): string => {
  let text = ''

  switch (size) {
    case 1:
      text = 'MINÚSCULO'
      break
    case 2:
      text = 'DIMINUTO'
      break
    case 3:
      text = 'MIÚDO'
      break
    case 4:
      text = 'PEQUENO'
      break
    case 5:
      text = 'MÉDIO'
      break
    case 6:
      text = 'GRANDE'
      break
    case 7:
      text = 'ENORME'
      break
    case 8:
      text = 'IMENSO'
      break
    case 9:
      text = 'COLOSSAL'
      break
    default:
  }
  return text
}
