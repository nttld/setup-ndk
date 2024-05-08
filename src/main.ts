import * as core from "@actions/core"

import { getNdk } from "./installer"

async function main() {
  const version = core.getInput("ndk-version")
  const addToPath = core.getBooleanInput("add-to-path")
  const linkToSdk = core.getBooleanInput("link-to-sdk")
  const localCache = core.getBooleanInput("local-cache")

  const { path, fullVersion } = await getNdk(version, {
    addToPath,
    linkToSdk,
    localCache,
  })

  core.setOutput("ndk-path", path)
  if (fullVersion) core.setOutput("ndk-full-version", fullVersion)
}

export function asError(error: unknown): Error | string {
  if (typeof error === "string") return error
  else if (error instanceof Error) return error
  else return String(error)
}

main().catch((error: unknown) => {
  core.setFailed(asError(error))
})
