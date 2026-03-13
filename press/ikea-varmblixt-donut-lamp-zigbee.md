# How I made the IKEA VARMBLIXT donut lamp work with Zigbee

![IKEA VARMBLIXT donut lamp](/media/ikea-varmblixt-donut-lamp-zigbee-cover-2.jpg)

I wanted to keep the IKEA VARMBLIXT donut lamp, but I did not want to keep IKEA's original driver and control path. The working setup ended up being much simpler than I expected: replace the low-voltage side with a 24V DC Zigbee LED controller, then expose it through Zigbee2MQTT, Home Assistant, and finally HomeKit.

The lamp in this project is the IKEA VARMBLIXT LED table/wall lamp.

The final wiring is:

```text
230V AC -> 24V DC power supply -> Zigbee LED controller -> lamp
```

The important bit is that the Zigbee controller replaces the IKEA driver in the low-voltage path. I am not switching mains directly with the Zigbee module.

## Hardware

What I used:

- IKEA VARMBLIXT lamp
- A 24V DC power supply
- A generic 24V Zigbee LED controller from AliExpress: <https://www.aliexpress.com/item/1005007469988139.html>

On the controller side, the wiring is straightforward:

- Power supply to controller input: `24V DC`
- Controller output to lamp: `V+` and `V-`

This is what the internal wiring looked like once I had the replacement controller in place:

![Internal wiring of the IKEA VARMBLIXT lamp with the Zigbee controller](/media/ikea-varmblixt-donut-lamp-zigbee-01-2.jpg)

Before powering it on, verify the polarity with a multimeter. I tested plain on/off first, then dimming.

## Pairing

Once you power on the Zigbee adapter, it should automatically be in pairing mode. At that point, enable permit join on your Zigbee setup and the controller should show up for pairing.

## Result

After pairing the controller, the lamp shows up correctly in Zigbee2MQTT:

![The lamp in Zigbee2MQTT](/media/ikea-varmblixt-donut-lamp-zigbee-01.jpg)

From there I exposed it to Home Assistant, and then to HomeKit through the Home Assistant HomeKit Bridge:

![The lamp in Home Assistant](/media/ikea-varmblixt-donut-lamp-zigbee-02.jpg)

And that was it. The setup is stable, works at `24V`, and now the donut lamp behaves like the rest of my Zigbee lights.
