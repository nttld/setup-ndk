# setup-ndk

![build-test status](https://github.com/nttld/setup-ndk/workflows/build-test/badge.svg)

This action sets up an Android NDK environment by downloading and caching a version the NDK adding it to the PATH

## Usage

See [action.yml](action.yml)

Basic:

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r21d
  - runs: ndk-build
```

Use the installation path:

```yml
steps:
  - uses: actions/checkout@v2
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r21d
    id: install-ndk
  - runs: cat ${{ format('{0}/README.md', steps.install-ndk.outputs.ndk-path) }}
```
