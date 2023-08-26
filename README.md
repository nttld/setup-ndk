# setup-ndk

This action sets up an Android NDK environment by downloading and caching a version of the NDK and optionally adding it to the PATH and linking it to the Android SDK.

## Usage

See [action.yml](action.yml)

### Basic

```yml
steps:
  - uses: actions/checkout@v3
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r25c
  - runs: ndk-build NDK_PROJECT_PATH=. APP_BUILD_SCRIPT=./Android.mk NDK_APPLICATION_MK=./Application.mk
```

### Using the installation path

```yml
steps:
  - uses: actions/checkout@v3
  - uses: nttld/setup-ndk@v1
    id: setup-ndk
    with:
      ndk-version: r21e
      add-to-path: false
  - run: ./build.sh
    env:
      ANDROID_NDK_HOME: ${{ steps.setup-ndk.outputs.ndk-path }}
```

### Linking to the SDK

```yml
steps:
  - uses: actions/checkout@v3
  - uses: nttld/setup-ndk@v1
    id: setup-ndk
    with:
      ndk-version: r25c
      link-to-sdk: true
  - run: ./gradlew build
```

### Caching locally in the workflow

```yml
steps:
  - uses: actions/checkout@v3
  - uses: nttld/setup-ndk@v1
    with:
      ndk-version: r21e
      local-cache: true
```
