# Make the IKEA VARMBLIXT Donut lamp work compatible with Zigbee

![IKEA VARMBLIXT donut lamp](/media/ikea-varmblixt-donut-lamp-zigbee-cover-2.jpg)

I wanted to keep the IKEA VARMBLIXT donut lamp, but I did not want to keep IKEA's original driver and control path. The working setup ended up being much simpler than I expected: replace the low-voltage side with a 24V DC Zigbee LED controller, then expose it through Zigbee2MQTT, Home Assistant, and finally HomeKit.

The final wiring is:

```text
230V AC -> 24V DC power supply -> Zigbee LED controller -> lamp
```

## Hardware

The only thing you need is a generic 24V Zigbee LED controller from AliExpress, something like <https://www.aliexpress.com/item/1005007469988139.html>.

The only important bit is to make sure you search for 24V DC controllers, as the lamp is designed to run at 24V. 
The controller I got supports dimming, which is a nice bonus.

On the controller side, the wiring is straightforward:

- Power supply to controller input: `24V DC`
- Controller output to lamp: `V+` and `V-`

This is what the internal wiring looked like once I had the replacement controller in place:

![Internal wiring of the IKEA VARMBLIXT lamp with the Zigbee controller](/media/ikea-varmblixt-donut-lamp-zigbee-01-2.jpg)

Before powering it on, verify the polarity with a multimeter. 

## Pairing

Once you power on the Zigbee adapter, it should automatically be in pairing mode. At that point, enable permit join on your Zigbee setup and the controller should show up for pairing.

## Result

After pairing the controller, the lamp shows up correctly in Zigbee2MQTT:

![The lamp in Zigbee2MQTT](/media/ikea-varmblixt-donut-lamp-zigbee-01.jpg)

From there I exposed it to Home Assistant, and then to HomeKit through the Home Assistant HomeKit Bridge:

![The lamp in Home Assistant](/media/ikea-varmblixt-donut-lamp-zigbee-02.jpg)

And that was it. The setup is stable, works at `24V`, and now the donut lamp behaves like the rest of my Zigbee lights.
