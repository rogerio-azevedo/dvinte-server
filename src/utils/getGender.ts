export const getGender = (gender: number): string => {
  let textGender = ''

  switch (gender) {
    case 1:
      textGender = 'MASCULINO'
      break
    case 2:
      textGender = 'FEMININO'
      break

    default:
  }

  return textGender
}
