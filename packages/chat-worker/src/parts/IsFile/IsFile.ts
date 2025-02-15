export const isFile = (item: unknown): item is File => {
  return Boolean(item && item instanceof File)
}
