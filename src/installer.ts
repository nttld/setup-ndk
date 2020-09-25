import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as os from 'os'

export async function getNdk(version: string): Promise<string> {
  await checkCompatibility()

  let toolPath: string
  toolPath = tc.find('ndk', version)

  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
  } else {
    core.info(`Attempting to download ${version}...`)
    const downloadUrl = await getDownloadUrl(version)
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

  core.addPath(toolPath)
  return toolPath
}

async function checkCompatibility(): Promise<void> {
  const platform = os.platform()
  if (platform !== 'linux' && platform !== 'win32' && platform !== 'darwin') {
    throw new Error(`Unexpected platform '${platform}'`)
  }

  const arch = os.arch()
  if (arch !== 'x64') {
    throw new Error(`Unexpected arch '${arch}'`)
  }
}

async function getDownloadUrl(version: string): Promise<string> {
  const platform = os.platform()
  switch (platform) {
    case 'linux':
      return `https://dl.google.com/android/repository/android-ndk-${version}-linux-x86_64.zip`
    case 'win32':
      return `https://dl.google.com/android/repository/android-ndk-${version}-windows-x86_64.zip`
    case 'darwin':
      return `https://dl.google.com/android/repository/android-ndk-${version}-darwin-x86_64.zip`
    default:
      throw new Error()
  }
}
