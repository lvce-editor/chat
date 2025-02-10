export const name = 'video-preview-error-not-found'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // act
  await Main.openUri(`${tmpDir}/not-found.mp4`)

  // assert
  const error = Locator('.Viewlet.Error')
  await expect(error).toBeVisible()
  await expect(error).toHaveText('Error: File not found: /workspace/not-found.mp4')
}
