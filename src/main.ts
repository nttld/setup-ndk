import * as core from '@actions/core'
import {getNdk} from './installer'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('ndk-version')
    const path = await getNdk(version)
    core.setOutput('ndk-path', path)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
