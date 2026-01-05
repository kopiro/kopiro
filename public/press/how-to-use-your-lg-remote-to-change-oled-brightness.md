# How to use your LG remote to change OLED brightness

This tutorial is for everyone who wants to use their LG remote to change the brightness of their OLED TV.

Why would someone want to do this? Well, these OLED LG TV these days are so bright that they can be a bit overwhelming at night, and I want something quick and easy to use.

It's very convenient to map this function to the channel up and down buttons, as most of the time you don't need these channels if you (like me) use an Apple TV or something similar, and Live TV is just a relic of the past.

But, first of all, you need to root your TV - you can find several methods, a good place to start is [this guide](https://github.com/RootMyTV/RootMyTV.github.io).

Once you have root, SSH into your TV and use the following command to install the [Magic Mapper](https://github.com/andrewfraley/magic_mapper).

Magic Mapper is a script that will let you remap unused buttons on the LG Magic Remote. The script itself runs on your rooted LG TV, detects button presses, and allows you to control anything available via the luna-send api. Note your TV must be rooted to use this.

The installation is straightforward, just download the script and the mapping config:

```bash
cd /home/root
wget https://raw.githubusercontent.com/andrewfraley/magic_mapper/main/magic_mapper.py
wget https://gist.githubusercontent.com/kopiro/083d975ae2c49d26bf6b0880a0de46d9/raw/992fa86c945e383d88cec5714e02feac15c862a0/lg_magic_mapper_config.json
```

The mapping config is taken from [my gist](https://gist.github.com/kopiro/083d975ae2c49d26bf6b0880a0de46d9):

```json
{
  "ch_up": {
    "function": "increase_oled_light",
    "inputs": {
      "increment": 10,
      "disable_energy_savings": "no"
    }
  },
  "ch_down": {
    "function": "reduce_oled_light",
    "inputs": {
      "increment": 10,
      "disable_energy_savings": "no"
    }
  }
}
```

Start the mapper manually with `/usr/bin/python -u /home/root/magic_mapper.py` and you should be able to use your remote to change the brightness of your OLED TV.

Then, to setup autostart of the mapper, use the script provided in the project:

```bash
cd /var/lib/webosbrew/init.d
wget https://raw.githubusercontent.com/andrewfraley/magic_mapper/main/start_magic_mapper
chmod +x /var/lib/webosbrew/init.d/start_magic_mapper
```

Tip: if you want to change the mapper without installing any editor via SSH, you can always connect via SFTP and edit the files directly - I love [Cyberduck](https://cyberduck.io/) for this.