export const getCharXp = (lv: number): number => {
  let exp = 0

  switch (lv) {
    case 1:
      exp = 0
      break
    case 2:
      exp = 1000
      break
    case 3:
      exp = 3000
      break
    case 4:
      exp = 6000
      break
    case 5:
      exp = 10000
      break
    case 6:
      exp = 15000
      break
    case 7:
      exp = 21000
      break
    case 8:
      exp = 28000
      break
    case 9:
      exp = 36000
      break
    case 10:
      exp = 45000
      break
    case 11:
      exp = 55000
      break
    case 12:
      exp = 66000
      break
    case 13:
      exp = 78000
      break
    case 14:
      exp = 91000
      break
    case 15:
      exp = 105000
      break
    case 16:
      exp = 120000
      break
    case 17:
      exp = 136000
      break
    case 18:
      exp = 153000
      break
    case 19:
      exp = 171000
      break
    case 20:
      exp = 190000
      break
    default:
  }

  return exp
}
