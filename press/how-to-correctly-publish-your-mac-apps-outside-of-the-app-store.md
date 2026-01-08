# How to correctly publish your Mac apps outside of the App Store

Distributing Mac apps outside of the App Store requires more than just building and zipping your .app. 

Since macOS Catalina, Apple requires all apps to be notarized by Apple to run without warnings on users' machines. Notarization ensures the app is from a known developer and free of malicious code.

Without notarization, users will see a warning saying the app “can’t be opened because Apple cannot check it for malicious software.”

With proper notarization and signing, your app behaves like a first-class citizen on macOS, even outside the App Store.

Here’s a streamlined process to do it correctly:

### Step 1: Archive Your App in Xcode

Open your project in Xcode and create an archive:

In the menu, go to Product > Archive.

![Image description](/media/4e069123.png)

After the archive builds, the Organizer window will open. Click "Distribute App" on the build you want to export, then click "Direct Distribution".

![Image description](/media/1432b579.png)

When it's done, click "Export", and save the app somewhere; you'll receive a signed .app.

### Step 2: Create the notarized DMG

To simplify post-export steps, I wrote a script that takes your exported .app, packages it into a .dmg, submits it for notarization, and staples the result — all automatically.

Before doing anything, install the necessary tools:

```sh
brew install create-dmg
```

Now we want to export the credentials that you already have into Xcode to the keychain, so that other tools can use it:

```
xcrun notarytool store-credentials "AC_PASSWORD" --apple-id $EMAIL --team-id $TEAM_ID
```

Perfect - you can now use [my create-my-dmg.sh script](https://gist.github.com/kopiro/7b77b2a6d3dfc2c5359ff0f25667747b) to create a DMG.

{% embed https://gist.github.com/kopiro/7b77b2a6d3dfc2c5359ff0f25667747b %}

You can run it using:

```bash
create-my-dmg.sh YourMacApp.app
```

This will create a DMG like `YourMacApp-1.2.0.dmg`, correctly notarized and stapled.