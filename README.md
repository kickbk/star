# react-native-star-io10 on Expo

The `react-native-star-io10` library can easily be installed with an Expo custom dev client using the attached Expo config plugin.
The `withStarPrinter` config plugin adds the necessary bluetooth permissions, and updates the `minSdkVersion` for android, from 21 which is currently supported by Expo SDK 43/44 to 23 which is required by `react-native-star-io10`.
Warning: changing the `minSdkVersion` may result in unexpected errors on Android.

How this project was created:

- Started a new project with `expo init star` and selected the typescript tabs template. You can choose any template.
- Added `expo-dev-client` with `expo install expo-dev-client`
- Installed `react-native-star-io10`. [see instructions](https://github.com/star-micronics/react-native-star-io10)
- Installed Expo config plugins with `expo install @expo/config-plugins`
- Used [patch-package](https://github.com/ds300/patch-package) to generate a patch as described in PR [#38](https://github.com/star-micronics/react-native-star-io10/pull/38) (why is this not merged yet?)
- Generated a config plugin in `plugins/withStarPrinter.js`. Credit [Kim](https://github.com/kbrandwijk).
- Added the configuration for the config plugin to `app.json`:

```js
"expo": {
  ...
  "plugins": [
    [
      "./plugins/withStarPrinter.js",
      {
        "minSdkVersion": 23,
        "bluetoothAlwaysPermission": "My permission description",
        "localNetworkUsagePermission": "My other permission description"
      }
    ]
  ]
}
```

- Built the project with EAS: `eas build --profile development`
- Installed on phone via the QR code Expo provided
- Connected a star TSP650II printer via ethernet cable to my router
- Opened the app connected to the router's wifi network
- The app runs the `useStarPrinter` hook in `TabOne` screen, which searches for printers. I slightly changed the [default discover code](https://github.com/star-micronics/react-native-star-io10#discover-devices) since it only shows how the app discovers a single printer, but in reality, the code will discover more than one printer, and in my use case, the user may want to select one of many printers. Note I use each printer interface in an array loop to avoid breaking the discovery if one of the interfaces is not supported by the device you install the app on.
- Added two buttons - One to get the printer status and another to print. [Reference](https://github.com/star-micronics/react-native-star-io10).

* Tested using Hermes as well (test by adding `"jsEngine": "hermes"` to app.json), and it worked.
* Don't forget to check the console.log while testing

### What doesn't work

Printing with an image returns `Invalid source`. Tried with `icon.png` which is placed in the same directory `TabOne`. Maybe one of the maintainers can comment on this?

Thanks to the maintainers for providing this library.
