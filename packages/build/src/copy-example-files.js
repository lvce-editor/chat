import { cp, mkdir, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { execa } from 'execa'
import { root } from './root.js'
import { existsSync } from 'fs'

const url = 'https://github.com/mediaelement/mediaelement-files'
const toRemove = [
  'AirReview-Landmarks-02-ChasingCorporate.mp3',
  'big_buck_bunny.jpg',
  'echo-hereweare.jpg',
  'echo-hereweare.mp4',
  'echo-hereweare.webm',
  'guqin.flv',
  'mediaelement.srt',
  'README.md',
  '.git',
]

const downloadRepo = async (tmpDir) => {
  if (existsSync(tmpDir)) {
    return
  }
  await rm(tmpDir, { recursive: true })
  await mkdir(dirname(tmpDir), { recursive: true })
  await execa('git', ['clone', url, tmpDir], { stdio: 'inherit' })
}

const copyRepoFiles = async (tmpDir) => {
  const outDir = join(root, 'packages', 'sample-files', 'files')
  await mkdir(outDir, { recursive: true })
  await cp(tmpDir, outDir, {
    recursive: true,
  })
}

const removeUnusedFiles = async () => {
  const outDir = join(root, 'packages', 'sample-files', 'files')
  for (const item of toRemove) {
    await rm(join(outDir, item), { recursive: true, force: true })
  }
}

const main = async () => {
  const tmpDir = join(tmpdir(), 'mediaelement-files')
  await downloadRepo(tmpDir)
  await copyRepoFiles(tmpDir)
  await removeUnusedFiles()
}

main()
