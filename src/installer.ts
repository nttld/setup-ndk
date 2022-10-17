import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as os from 'node:os'
import * as path from 'node:path'
import * as tc from '@actions/tool-cache'
import {copy, mkdirp} from 'fs-extra'

export async function getNdk(
  version: string,
  addToPath: boolean,
  localCache: boolean
): Promise<string> {
  await checkCompatibility()

  const cacheKey = getCacheKey(version)
  const cacheDir = path.join(os.homedir(), '.ndk')

  let installPath: string
  installPath = tc.find('ndk', version)

  if (installPath) {
    core.info(`Found in tool cache @ ${installPath}`)
  } else if (localCache) {
    const restored = await cache.restoreCache([cacheDir], cacheKey)
    if (restored === cacheKey) {
      core.info(`Found in local cache @ ${cacheDir}`)
      installPath = cacheDir
    }
  } else {
    core.info(`Attempting to download ${version}...`)
    const downloadUrl = getDownloadUrl(version)
    const downloadPath = await tc.downloadTool(downloadUrl)

    core.info('Extracting...')
    const parentExtractPath = await tc.extractZip(downloadPath)
    const extractedPath = path.join(parentExtractPath, `android-ndk-${version}`)

    core.info('Adding to the tool cache...')
    installPath = await tc.cacheDir(extractedPath, 'ndk', version)

    if (localCache) {
      core.info('Adding to the local cache...')
      await mkdirp(cacheDir)
      await copy(installPath, cacheDir)
      await cache.saveCache([cacheDir], cacheKey)
      installPath = cacheDir
    }

    core.info('Done')
  }

  if (addToPath) {
    core.addPath(installPath)
    core.info('Added to path')
  } else {
    core.info('Not added to path')
  }

  return installPath
}

async function checkCompatibility(): Promise<void> {
  const platform = os.platform()
  const supportedPlatforms = ['linux', 'win32', 'darwin']
  if (!supportedPlatforms.includes(platform)) {
    throw new Error(`Unsupported platform '${platform}'`)
  }

  const arch = os.arch()
  const supportedArchs = ['x64']
  if (!supportedArchs.includes(arch)) {
    throw new Error(`Unsupported arch '${arch}'`)
  }
}

function getPlatormString(): string {
  const platform = os.platform()
  switch (platform) {
    case 'linux':
      return '-linux'
    case 'win32':
      return '-windows'
    case 'darwin':
      return '-darwin'
    default:
      throw new Error()
  }
}

function getArchString(version: string): string {
  const numStr = version.slice(1)
  const num = parseInt(numStr, 10)

  if (num >= 23) {
    return ''
  }

  const arch = os.arch()
  switch (arch) {
    case 'x64':
      return '-x86_64'
    default:
      throw new Error()
  }
}

function getCacheKey(version: string): string {
  const platform = getPlatormString()
  const arch = getArchString(version)
  return `ndk-${version}${platform}${arch}`
}

function getDownloadUrl(version: string): string {
  const platform = getPlatormString()
  const arch = getArchString(version)
  return `https://dl.google.com/android/repository/android-ndk-${version}${platform}${arch}.zip`
}
