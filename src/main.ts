import * as core from '@actions/core'
import {getNdk} from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('ndk-version')
    const addToPath = core.getBooleanInput('add-to-path')
    const localCache = core.getBooleanInput('local-cache')
    const path = await getNdk(version, addToPath, localCache)
    core.setOutput('ndk-path', path)
  } catch (error) {
    core.setFailed(asError(error))
  }
}

function asError(error: unknown): Error | string {
  if (typeof error === 'string') return error
  else if (error instanceof Error) return error
  else return `${error}`
}

run()
