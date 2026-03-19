# My Sage Barista espresso machine is now smart

![Final wiring with WAGO connectors and Zigbee module attached](./media/top_module_wago_plus_zigbee.jpeg)

The goal is simple: having my Sage Barista already warm when I wake up.

The boiler on this machine heats up quite quickly, but the rest of the machine really needs another 15 to 20 minutes before it is properly ready. If you want a good first espresso, that extra warm-up time matters.

This project was inspired by this Home Assistant Community thread:

<https://community.home-assistant.io/t/modifying-a-breville-sage-barista-express-coffee-machine-to-integrate-with-home-assistant/487575>

The idea is the same, but what follows is the exact process I used on my own machine.

## Why turn it on about 20 minutes early

Sage does not give a hard `20 minute` number for the Barista Express, but the official manual is very clear about the reason: *espresso quality suffers when the parts touching the coffee are still cold.*

I’ve personally verified this myself, the result of the espresso is night and day if you just shoot it right away.

From the Sage Barista Express manual:

> "A cold portafilter and filter basket can reduce the extraction temperature enough to significantly affect the quality of your espresso."

> "A warm cup will help maintain the coffee's optimal temperature."

> "This will stabilise the temperature prior to extraction."

So the practical reason to wake the machine ~20m before making coffee is that the heating system may be ready quickly, while the group head, portafilter, filter basket, and surrounding metal still need time to absorb heat. 

That extra time makes the first shot more temperature-stable and helps avoid a sour, under-heated first espresso.

- [Sage Barista Express instruction manual, pages 18-19 and 30](https://www.sageappliances.com/content/dam/sage/ie/en/assets/miscellaneous/instruction-manual/espresso/BES875-instruction-manual.pdf)

The setup I ended up with is pretty simple:

- keep a Zigbee relay module permanently powered from the machine mains
- connect the relay output across the same two low-voltage wires used by the original power button
- configure the relay as a momentary switch so it behaves like a quick press

In practice, the relay does not power the machine itself. It just "presses" the original power button for me.

Before doing this, I had a much more improvised setup: a small servo taped on top of the front panel, positioned over the power button so it could physically press and release it.

It actually worked, but it was clumsy. Every now and then the tape would give up, the servo would move out of place, and the whole thing looked exactly as elegant as it sounds. That was the point where I decided I wanted to do this properly from the inside.

This is how is going to look like: simple and elegant.

<video controls src="./media/pres.mov"></video>

## How it works

In plain English, this is the full chain:

- you tap a switch in Home Assistant, or in HomeKit if you expose it through Home Assistant
- Home Assistant sends the command to the Zigbee relay
- the relay briefly closes the same two contacts used by the original power button
- the coffee machine behaves exactly as if you pressed that button by hand

We are just simulating a quick button press on the low-voltage control side.

Two important thing here regarding the “switch” we’re going to use - it has to be:

- `Momentary`: the relay closes for a short time, then opens again automatically, like a quick press and release
- `Dry Contact`: the relay behaves like an isolated switch and does not inject voltage into the coffee machine button circuit.

## What you need

This is what you need for this mod:

- a Sage Barista, or the equivalent Breville model :)
- a Zigbee switch module that accepts `100-240V AC` input and exposes `COM` and `NO` dry-contact terminals
- a Zigbee network with a coordinator
- Home Assistant with either ZHA or Zigbee2MQTT
- a multimeter with continuity mode
- mains-rated wire for 220V
- connectors such as WAGO blocks
- connectors for the 5V (or use the WAGO connectors as I did)
- zip ties or another way to secure the added wiring

In my case, the relay paired with ZHA, but I could not configure it as `momentary` there. 

I actually ended up migrating to Zigbee2MQTT for this setup, just because I wanted to have all the features exposed and controllable.

## Final wiring

This is the final wiring in plain terms:

- machine mains `live` (brown/black wire) -> Zigbee module `L`
- machine mains `neutral` (blue wire) -> Zigbee module `N`
- power button signal wire -> Zigbee module `NO`
- board ground wire -> Zigbee module `COM`

The only important bit here is that `COM` and `NO` must behave like a dry contact. The relay should only close the original button circuit, not send power into it.
## Hardware

I used this [Tuya Zigbee relay module](https://www.aliexpress.com/item/1005007913776935.html?spm=a2g0o.order_list.order_list_main.89.11cb1802DIYa2W), but you do not need this exact module.

In general, any switch module should work as long as:

- it accepts `100-240V AC` input so it can stay powered from the machine mains
- it exposes `COM` and `NO` terminals
- those `COM` and `NO` terminals behave like a dry contact


![Zigbee switch module](./media/zigbee_module.png)

This Tuya module was cheap and it worked fine for me, but I have also read reports from other people having problems with it, so I would not treat this exact model as special or required.

## Open the machine

Alright, time to start!

I first removed all the possible screws (watch out, there is a screw hidden below a circled plastic tap below the water tank - I spent half hour trying to understand why the back panel was not falling off) and opened the back of the machine so I could see how everything was laid out.

![Back of the machine fully opened](./media/back_machine.jpeg)

In the white box you’re going to find the motherboard. You don’t 100% need to open this, but it’s easier to do it so you can probe the PINS instead of the wires later. If you manage to probe the wired of the top module directly, you can skip this step.

![Main control board exposed](./media/back_machine_with_chip_exposed.jpeg)

As you can see, there are two connectors, one for each front panel section. The one we cared about was the connector for the side where the power button sits.

On my machine, the first wire had a different color and that was `GND`.

## My first attempt did not work

Before cutting anything, I tried to avoid soldering and avoid touching the original wiring too much.

I inserted a couple of wires directly into the jumper connector and fixed them in place with hot glue. In theory that sounded fine. In practice it was not reliable at all. After about two hours I had to open the machine again because the contact had come loose.

*That was enough to convince me to do it properly.*

![First failed attempt using inserted wires without soldering](./media/first_attempt_wires_not_soldered.jpeg)

## Power the Zigbee module from the machine mains

We are going to power the ZigBee module directly from the AC feed that enters the machine, instead of having an extra external power supply.

Inside the machine there is already a brown live wire and a blue neutral wire coming from the main cable. Those were the easiest points to tap into for the relay `L` and `N`.

![Original AC wiring before splicing](./media/ac_before_splicing.jpeg)

I spliced into those two wires and added a WAGO connector that would expose an additional pair of L+N wires.

This is the part where you need to be careful: these are 220V wires. Make sure everything is properly insulated, mechanically secure, and not routed near anything hot or moving.

*Make sure you use wire rated for mains voltage.*

The new wires will be routed and secure via zip ties toward the top of the machine.

![AC wires spliced to feed the relay module](./media/ac_connectors_spliced.jpeg)

I noticed too late that this photo was not great, and I really did not want to open the machine again just to retake it.

Once you have these wires up, connect them:

- brown live wire -> `L`
- blue neutral wire -> `N`

At that point the relay stays powered all the time and is reachable from Zigbee whenever needed.

If you want, this is the time you can carefully connect the power cable to 220V so that the ZigBee module turns on - then you can pair it.

It’s better doing it now before connecting the power button because of some quirks on how these modules behave.
## Configure the module correctly

Out of the box, the module behaves like a normal on/off relay. That is not what we want here. The machine power button needs a short pulse, not a relay that stays closed.

You could solve this in Home Assistant with an automation that turns the relay back off after one second. I did not like that approach. If the automation breaks, the relay could stay closed and keep "holding" the button.

The better solution is to configure the module itself as a momentary switch, so it automatically goes back to off after each trigger.

Also, you need to make sure that the module does not restore to `on` after a power outage. In my case, that was the default - meaning that whenever I gave power, the module was constantly pressing the power button - that’s not what we want!

![Zigbee2MQTT settings showing momentary mode](./media/zigbee_zigbee2mqtt_screen.png)

So - mandatory settings:

- `Switch type`: `momentary`
- `Power outage memory`: `off`

## Find the power button wire

You need to identify which wire becomes connected to ground when the power button is pressed. 

The method I used was:

1. Hold the power button
2. Put the multimeter in continuity mode.
3. Keep one probe on the GND pin or wire (which is usually the black wire coming from the connector)
4. Probe all the pins on the motherboard one by one (or every wire coming from that connector)
5. Find the pin that starts beeping, then trace that wire back to the harness so you know which wire to cut higher up

Once you find it, the rest is straightforward. But this is also the point where you need to be sure of what you are doing, because the next step is cutting into that wire.

I did make the mistake of cutting the wrong wire myself - No big deal, you can just reconnect it back with some tape or shrinking tube - but that’s not what we want, right?

## Break out the button wires

After identifying the correct wire, cut it and rejoined it using a simple connector, and expose  a third branch that goes to the ZigBee relay. That extra lead goes to `NO`.

This way, the original circuit remains intact, but the relay can also close the same contact when triggered.

Then, do the same with the GND wire. Cut it, rejoin it with another connector, add a third lead going to `COM` on the ZigBee module.

At that point the relay is sitting across the exact same two points used by the physical power button.

![Relay mounted in the upper section with mains wiring nearby](./media/top_module_wago.jpeg)

Now, go test it! It’s done!

## Morning automation in Home Assistant

Once the relay is exposed in Home Assistant, this can also be automated.

For example, you can warm up the machine automatically in the morning, about 20 minutes before waking up, but only if someone is home:

```yaml
alias: Warm up Sage Barista in the morning
description: ""
triggers:
  - trigger: time
    at: input_datetime.wake_up_time
conditions:
  - condition: zone
    entity_id: person.flavio
    zone: zone.home
actions:
  - action: switch.turn_on
    metadata: {}
    target:
      entity_id: switch.sage_barista
    data: {}
mode: single
```

In my case, `input_datetime.wake_up_time` represents the time when I want the machine to start warming up, not the actual alarm time.

One subtle detail is that the Zigbee module does not really know whether the coffee machine is currently on or off. It only knows that it was told to simulate a button press.

In practice, that is not a big problem. On the EU model, the machine powers itself off automatically after 30 minutes, so Home Assistant can mirror that behavior and reset the exposed switch state with another automation:

```yaml
alias: Sage Barista Momentary Switch
description: ""
triggers:
  - type: turned_on
    device_id: 8282842a6b808a83e5628093782164e7
    entity_id: 2361376bf5817f191f97086fa825313f
    domain: switch
    trigger: device
conditions: []
actions:
  - delay:
      hours: 0
      minutes: 30
      seconds: 0
      milliseconds: 0
  - action: switch.turn_off
    metadata: {}
    target:
      entity_id: switch.sage_barista
    data: {}
mode: single
```

## Safety notes

This machine contains mains voltage, heaters, pumps, and a lot of conductive metal. Treat it like mains electrical work, because that is what it is.

- unplug the machine before opening it, probing it, cutting wires, or moving the board
- verify that the relay output is actually isolated before connecting it to the button lines
- keep mains wiring insulated, secure, and away from hot or moving parts
- if you are not sure about the board ground or the relay isolation, stop there and verify before powering anything