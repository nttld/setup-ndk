# setup-ndk

![build-test status](https://github.com/nttld/setup-ndk/workflows/build-test/badge.svg)

This action sets up an Android NDK environment by downloading and caching a version of the NDK and adding it to the PATH

## Usage

See [action.yml](action.yml)

Basic:

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r21d
  - runs: ndk-build NDK_PROJECT_PATH=. APP_BUILD_SCRIPT=./Android.mk NDK_APPLICATION_MK=./Application.mk
```

Using the installation path:

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    id: setup-ndk
    with:
      ndk-version: r21d
  - run: |
      echo ${{ steps.setup-ndk.outputs.ndk-path }} > ./ndkpath.txt
      pwsh -Command ./build.ps1
```
