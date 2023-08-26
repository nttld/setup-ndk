import * as core from "@actions/core"

import { getNdk } from "./installer"

async function main() {
  const version = core.getInput("ndk-version")
  const addToPath = core.getBooleanInput("add-to-path")
  const localCache = core.getBooleanInput("local-cache")
  const path = await getNdk(version, addToPath, localCache)
  core.setOutput("ndk-path", path)
}

function asError(error: unknown): Error | string {
  if (typeof error === "string") return error
  else if (error instanceof Error) return error
  else return Object.prototype.toString.call(error)
}

main().catch((error) => {
  core.setFailed(asError(error))
})
