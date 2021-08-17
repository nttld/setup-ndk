import * as core from '@actions/core'
import * as os from 'os'
import * as path from 'path'
import * as tc from '@actions/tool-cache'

export async function getNdk(
  version: string,
  addToPath: boolean
): Promise<string> {
  await checkCompatibility()

  let toolPath: string
  toolPath = tc.find('ndk', version)

  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
  } else {
    core.info(`Attempting to download ${version}...`)
    const downloadUrl = getDownloadUrl(version)
    const downloadPath = await tc.downloadTool(downloadUrl)

    core.info('Extracting...')
    const extractPath = await tc.extractZip(downloadPath)

    core.info('Adding to the cache...')
    toolPath = await tc.cacheDir(
      path.join(extractPath, `android-ndk-${version}`),
      'ndk',
      version
    )

    core.info('Done')
  }

  if (addToPath) {
    core.addPath(toolPath)
    core.info('Added to path')
  } else {
    core.info('Not added to path')
  }

  return toolPath
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
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const numStr = version
    .split('')
    .filter(c => digits.includes(c))
    .join('')
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

function getDownloadUrl(version: string): string {
  const platform = getPlatormString()
  const arch = getArchString(version)
  return `https://dl.google.com/android/repository/android-ndk-${version}${platform}${arch}`
}
