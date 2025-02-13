export const getResponseString = (result) => {
  const {content} = result

  if (content.length === 0) {
    return 'empty'
  }
  const first = content[0]
  return first.text
}
