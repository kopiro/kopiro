# Make the IKEA VARMBLIXT Donut lamp smart with Zigbee

![IKEA VARMBLIXT donut lamp](/press/ikea-varmblixt-donut-lamp-zigbee/media/ikea-varmblixt-donut-lamp-zigbee-cover-2.jpg)

I recently bought the IKEA VARMBLIXT donut lamp, but to my disappointment this light is not smart and not dimmable.

The working setup ended up being much simpler than I expected: replace the low-voltage side with a 24V DC Zigbee LED controller, then expose it through Zigbee to [Home Assistant](https://www.home-assistant.io/), and finally HomeKit.

The final wiring is:

```text
230V AC -> 24V DC power supply -> Zigbee LED controller -> lamp
```

In practice, this means the original mains power is converted from `230V AC` to `24V DC` at the socket, and then the controller handles switching and dimming on the low-voltage side. That is the only part I replaced.

[Zigbee](https://csa-iot.org/all-solutions/zigbee/) is the wireless protocol used by the replacement controller, which makes the lamp show up like any other smart light in my home. [Home Assistant](https://www.home-assistant.io/) is the local automation hub I use to bring devices together and expose them again to HomeKit. In my case I used Zigbee2MQTT, but you do not really need it for this setup, as the integrated ZHA support in Home Assistant works too.

## Hardware

The only thing you need is a generic 24V Zigbee LED controller from AliExpress, something like <https://www.aliexpress.com/item/1005007469988139.html>.

The controller I got supports dimming, which is a nice bonus.

On the controller side, the wiring is straightforward:

- Power supply to controller input: `24V DC`
- Controller output to lamp: `V+` and `V-`

This is what the internal wiring looked like once I had the replacement controller in place:

![Internal wiring of the IKEA VARMBLIXT lamp with the Zigbee controller](/press/ikea-varmblixt-donut-lamp-zigbee/media/ikea-varmblixt-donut-lamp-zigbee-01-2.jpg)

Before powering it on, verify the polarity with a multimeter. 

## Pairing

Once you power on the Zigbee adapter, it should automatically be in pairing mode. At that point, enable permit join on your Zigbee setup and the controller should show up for pairing. I used Zigbee2MQTT, but the built-in ZHA integration in Home Assistant should work just as well if you prefer to keep everything inside Home Assistant.

## Result

After pairing the controller, the lamp shows up correctly in Zigbee2MQTT:

![The lamp in Zigbee2MQTT](/press/ikea-varmblixt-donut-lamp-zigbee/media/ikea-varmblixt-donut-lamp-zigbee-01.jpg)

From there I exposed it to Home Assistant, and then to HomeKit through the Home Assistant HomeKit Bridge:

![The lamp in Home Assistant](/press/ikea-varmblixt-donut-lamp-zigbee/media/ikea-varmblixt-donut-lamp-zigbee-02.jpg)

And that was it. 