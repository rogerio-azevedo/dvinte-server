export const getModifier = (mod: number): number => {
  let textMod = 0

  if (Number(mod) > 10) {
    textMod = Math.floor((Number(mod) - 10) / 2)
    return textMod
  }

  switch (Number(mod)) {
    case 10:
      textMod = 0
      break
    case 9:
      textMod = -1
      break
    case 8:
      textMod = -1
      break
    case 7:
      textMod = -2
      break
    case 6:
      textMod = -2
      break
    case 5:
      textMod = -3
      break
    case 4:
      textMod = -3
      break
    case 3:
      textMod = -4
      break
    case 2:
      textMod = -4
      break
    case 1:
      textMod = -5
      break
    default:
  }
  return textMod
}
