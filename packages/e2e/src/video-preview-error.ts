export const name = 'video-preview-error'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.mp4`, `abc`)

  // act
  await Main.openUri(`${tmpDir}/test.mp4`)

  // assert
  const error = Locator('.Viewlet.Error')
  await expect(error).toBeVisible()
  // TODO make it less browser specific
  await expect(error).toHaveText(
    'Error: Failed to decode video: DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed',
  )

  // TODO
  // await expect(error).toContainText('Error: Failed to decode video')
}
