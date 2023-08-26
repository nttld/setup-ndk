import * as os from "node:os"
import * as path from "node:path"
import { env } from "node:process"

import * as cache from "@actions/cache"
import * as core from "@actions/core"
import * as tc from "@actions/tool-cache"
import { copy, mkdirp, readdir, readFile, symlink } from "fs-extra"
import * as ini from "ini"

import { asError } from "./main"

export async function getNdk(
  version: string,
  addToPath: boolean,
  linkToSdk: boolean,
  localCache: boolean,
): Promise<string> {
  checkCompatibility()

  const cacheKey = getCacheKey(version)
  const cacheDir = path.join(os.homedir(), ".setup-ndk", version)

  let installPath: string
  installPath = tc.find("ndk", version)

  if (installPath) {
    core.info(`Found in tool cache @ ${installPath}`)
  } else if (localCache) {
    const restored = await cache.restoreCache([cacheDir], cacheKey)
    if (restored === cacheKey) {
      core.info(`Found in local cache @ ${cacheDir}`)
      installPath = cacheDir
    }
  }

  if (!installPath) {
    core.info(`Attempting to download ${version}...`)
    const downloadUrl = getDownloadUrl(version)
    const downloadPath = await tc.downloadTool(downloadUrl)

    core.info("Extracting...")
    const parentExtractPath = await tc.extractZip(downloadPath)
    const extractedFiles = await readdir(parentExtractPath)
    if (extractedFiles.length !== 1)
      throw new Error(
        `Invalid NDK archive contents (${extractedFiles.join(", ")})`,
      )
    const extractedPath = path.join(parentExtractPath, extractedFiles[0]!)

    core.info("Adding to the tool cache...")
    installPath = await tc.cacheDir(extractedPath, "ndk", version)

    if (localCache) {
      core.info("Adding to the local cache...")
      await mkdirp(cacheDir)
      await copy(installPath, cacheDir)
      await cache.saveCache([cacheDir], cacheKey)
      installPath = cacheDir
    }

    core.info("Done")
  }

  if (addToPath) {
    core.addPath(installPath)
    core.info("Added to path")
  } else {
    core.info("Not added to path")
  }

  try {
    const fullVersion = await getFullVersion(installPath)
    core.setOutput("ndk-full-version", fullVersion)

    if (linkToSdk && "ANDROID_HOME" in env) {
      const ndksPath = path.join(env.ANDROID_HOME!, "ndk")
      await mkdirp(ndksPath)

      const ndkPath = path.join(ndksPath, fullVersion)
      await symlink(installPath, ndkPath, "dir")
    }
  } catch (error) {
    core.warning(asError(error))
    core.warning("Failed to detect full version")
  }

  return installPath
}

async function getFullVersion(installPath: string) {
  core.info("Detecting full version...")

  const propertiesPath = path.join(installPath, "source.properties")
  const propertiesContent = await readFile(propertiesPath, {
    encoding: "utf-8",
  })
  const properties = ini.parse(propertiesContent)

  if (
    "Pkg.Revision" in properties &&
    typeof properties["Pkg.Revision"] === "string"
  ) {
    return properties["Pkg.Revision"]
  } else {
    throw new Error("source.properties file is missing Pkg.Revision")
  }
}

function checkCompatibility() {
  const platform = os.platform()
  const supportedPlatforms = ["linux", "win32", "darwin"]
  if (!supportedPlatforms.includes(platform)) {
    throw new Error(`Unsupported platform "${platform}"`)
  }

  const arch = os.arch()
  const supportedArchs = ["x64"]
  if (!supportedArchs.includes(arch)) {
    throw new Error(`Unsupported arch "${arch}"`)
  }
}

function getPlatormString() {
  const platform = os.platform()
  switch (platform) {
    case "linux":
      return "-linux"
    case "win32":
      return "-windows"
    case "darwin":
      return "-darwin"
    default:
      throw new Error()
  }
}

function getArchString(version: string) {
  const numStr = version.slice(1)
  const num = parseInt(numStr, 10)

  if (num >= 23) {
    return ""
  }

  const arch = os.arch()
  switch (arch) {
    case "x64":
      return "-x86_64"
    default:
      throw new Error()
  }
}

function getCacheKey(version: string) {
  const platform = getPlatormString()
  return `setup-ndk-${version}${platform}`
}

function getDownloadUrl(version: string) {
  const platform = getPlatormString()
  const arch = getArchString(version)
  return `https://dl.google.com/android/repository/android-ndk-${version}${platform}${arch}.zip`
}
