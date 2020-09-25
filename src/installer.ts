import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'

export async function getNdk(version: string): Promise<string> {
  await checkArch()
  const platform = os.platform()

  let toolPath: string
  toolPath = tc.find('ndk', version)

  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
  } else {
    core.info(`Attempting to download ${version}...`)
    const downloadUrl = await getDownloadUrl(version, platform)
    const downloadPath = await tc.downloadTool(downloadUrl)

    core.info('Extracting...')
    const extractPath = await tc.extractZip(downloadPath)

    core.info('Adding to the cache...')
    toolPath = await tc.cacheDir(extractPath, 'ndk', version)

    core.info('Done')
  }

  core.addPath(toolPath)
  return toolPath
}

async function checkArch(): Promise<void> {
  const arch = os.arch()
  if (os.arch() !== 'x64') {
    throw new Error(`Unexpected arch '${arch}'`)
  }
}

async function getDownloadUrl(
  version: string,
  platform: NodeJS.Platform
): Promise<string> {
  switch (platform) {
    case 'linux':
      return `https://dl.google.com/android/repository/android-ndk-${version}-linux-x86_64.zip`
    case 'win32':
      return `https://dl.google.com/android/repository/android-ndk-${version}-windows-x86_64.zip`
    case 'darwin':
      return `https://dl.google.com/android/repository/android-ndk-${version}-darwin-x86_64.zip`
    default:
      throw new Error(`Unexpected OS '${platform}'`)
  }
}
