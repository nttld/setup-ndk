# setup-ndk

![build-test status](https://github.com/nttld/setup-ndk/workflows/build-test/badge.svg)

This action sets up an Android NDK environment by downloading and caching a version of the NDK and adding it to the PATH

## Usage

See [action.yml](action.yml)

### Basic

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r25b
  - runs: ndk-build NDK_PROJECT_PATH=. APP_BUILD_SCRIPT=./Android.mk NDK_APPLICATION_MK=./Application.mk
```

### Using the installation path

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    id: setup-ndk
    with:
      ndk-version: r21e
      add-to-path: false
  - run: ./build.sh
    env:
      ANDROID_NDK_HOME: ${{ steps.setup-ndk.outputs.ndk-path }}
```

### Caching locally

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r25b
      local-cache: true
```
