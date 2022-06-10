import * as core from '@actions/core'
import {getNdk} from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('ndk-version')
    const addToPath = getNegatableOutput('add-to-path')
    const path = await getNdk(version, addToPath)
    core.setOutput('ndk-path', path)
  } catch (error) {
    core.setFailed(error.toString())
  }
}

function getNegatableOutput(
  name: string,
  options?: core.InputOptions
): boolean {
  const normalised = core.getInput(name, options).toLowerCase()
  const falseyValues = ['false', 'f', 'no', 'n']

  return !falseyValues.includes(normalised)
}

run()
