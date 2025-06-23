export default function getGender(gender) {
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
