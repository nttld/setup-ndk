import * as core from '@actions/core'
import {getNdk} from './installer'

async function run(): Promise<void> {
  const version = core.getInput('ndk-version')
  const addToPath = getNegatableOutput('add-to-path')
  const path = await getNdk(version, addToPath)
  core.setOutput('ndk-path', path)
}

function getNegatableOutput(
  name: string,
  options?: core.InputOptions
): boolean {
  const normalised = core.getInput(name, options).toLowerCase()
  const falseyValues = ['false', 'f', 'no', 'n']

  return !falseyValues.includes(normalised)
}

function asError(error: unknown): Error | string {
  if (typeof error === 'string') return error
  else if (error instanceof Error) return error
  else return `${error}`
}

run().catch((e) => core.setFailed(asError(error)))
