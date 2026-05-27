---
title: "How to stop neighbours from pairing with your LG TV"
publishedAt: "2026-05-27T16:12:28.000Z"
description: "How I hide my rooted LG webOS TV from Bluetooth discovery so random neighbours cannot keep attempting to pair with it."
---
# How to stop neighbours from pairing with your LG TV

This tutorial is for everyone who has an LG webOS TV that keeps showing annoying Bluetooth pairing attempts from nearby devices.

In my case, I do not want to disable Bluetooth completely, because the LG Magic Remote uses Bluetooth for the pointer, voice button, and other remote-specific features. I just want the TV to stop advertising itself as something that every phone nearby can try to pair with.

The trick is to disable Bluetooth discoverability, not Bluetooth itself.

But, first of all, you need to root your TV - you can find several methods, a good place to start is [this guide](https://github.com/RootMyTV/RootMyTV.github.io).

Once you have root, SSH into your TV.

## Disable Bluetooth discoverability

Run this command:

```bash
luna-send -n 1 -f luna://com.webos.service.bluetooth2/adapter/setState \
  '{"discoverable":false}'
```

That's it.

This does not power off Bluetooth. It only tells the Bluetooth adapter to stop being discoverable by new devices. The Magic Remote should keep working because already-paired devices are not affected by discoverability.

To check the current state, run:

```bash
luna-send -n 1 -f luna://com.webos.service.bluetooth2/adapter/getStatus '{"subscribe":false}'
```

In the output, look for:

```json
"discoverable": false
```

## Make it survive reboot

The setting may not survive a reboot, so I recommend adding a small startup script.

The important detail here is that the Bluetooth Luna service may not be ready immediately during boot. So instead of sleeping for a fixed amount of time and hoping for the best, I prefer a small retry loop.

Create the script:

```bash
cat >/var/lib/webosbrew/init.d/disable-bt-discoverable.sh <<'EOF'
#!/bin/sh

i=0
while [ "$i" -lt 30 ]; do
  if luna-send -n 1 -f luna://com.webos.service.bluetooth2/adapter/setState '{"discoverable":false}' | grep -q '"returnValue"[[:space:]]*:[[:space:]]*true'; then
    exit 0
  fi

  i=$((i + 1))
  sleep 2
done

exit 1
EOF

chmod +x /var/lib/webosbrew/init.d/disable-bt-discoverable.sh
```

This waits up to around 60 seconds, but it will stop as soon as the command succeeds.

After rebooting the TV, SSH again and verify:

```bash
luna-send -n 1 -f luna://com.webos.service.bluetooth2/adapter/getStatus '{"subscribe":false}'
```

Again, you want to see:

```json
"discoverable": false
```

## What not to do

I would not start by disabling Bluetooth power:

```bash
luna-send -n 1 -f luna://com.webos.service.bluetooth2/adapter/setState \
  '{"powered":false}'
```

That is the one that can break the Magic Remote Bluetooth features. Maybe basic IR buttons will still work, depending on the remote and TV, but losing the pointer or voice button is not what we want here.
