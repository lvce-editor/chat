export const getResponseString = (result) => {
  const content = result.content

  if (content.length === 0) {
    return 'empty'
  }
  const first = content[0]
  return first.text
}
