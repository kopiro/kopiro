# Reverse engineer Spotify and Chromecast protocols to let my vocal assistant play music

I recently tried a Google Home Mini and the most interesting feature is the ability to play music by Spotify directly on a Chromecast.

> Ok Google, play Arcade Fire on Chromecast!

From my point of view, this is the most interesting feature simply because I couldn’t instantly replicate it on my personal assistant.

*Yes, I’m building a personal vocal assistant just for fun, and most probably that’s what I’ll talk about in my next posts. Check it out [preview code on Github](https://github.com/kopiro/otto-ai) or [if you’re interested about its hardware](https://dev.to/kopiro/the-hardware-behind-otto-a-monkey-plush-which-became-my-vocal-assistant-1gaa).

Why couldn’t I replicate it? It’s simple, there’s no public Spotify API to stream music without a browser, and the CastV2 protocol to play music on Chromecast is private too.

But let’s do a step back.

### A little bit of history

Originally, you could use **LibSpotify SDK**, a C library to build your own personal streaming application.

There are a lot of great projects using this SDK: [Mopidy](https://github.com/mopidy/mopidy-spotify), [Sconsify](https://github.com/fabiofalci/sconsify) and many others that work like a charm.

The problem is that LibSpotify was deprecated two years ago, in fact, if you visit the [official page](https://developer.spotify.com/technologies/libspotify/), a warning informs you that:

> LibSpotify and CocoaLibSpotify are no longer under active development on any platform and are considered deprecated. […] Please note that we have removed the LibSpotify binaries from our website in an effort to phase out the usage of this deprecated library. LibSpotify has been considered deprecated since 2015 and will be shut down in 2017, so we want to ensure that all developers’ efforts and attention are focused on newer and better APIs that we actively support and maintain. […]

You could say that the deprecation and the shutdown of a library is in flavor of a modern library. But this is not exactly the case.

The Web API doesn’t support the playback of full tracks, as quoted in [this memorable issue](https://github.com/spotify/web-api/issues/57) that [escalated quickly](https://twitter.com/SpotifyCares/status/798181185943781376).

Spotify team suggests to use the [iOS/Android SDK](https://developer.spotify.com/technologies/spotify-ios-sdk/) to get the streaming of tracks, but another brilliant warning informs you that:

> The iOS SDK is explicitly prohibited from use for in-car apps, re-streaming aka “listen together” apps, alarm tones, ring-tones, voice-assistants, and offline experiences for wearable or other devices.

**Ok, but what if my application is not iOS/Android based?**

On Dec 11 2017, [Spotify team announced the release of the Web Playback SDK](https://beta.developer.spotify.com/documentation/web-playback-sdk/):

> The Web Playback SDK is a client-side JavaScript library which allows you to create a new player in [Spotify Connect](https://www.spotify.com/connect/) and play any audio track from Spotify in the browser via [Encrypted Media Extensions](https://developers.google.com/web/fundamentals/media/eme).

**Ok, but what if my application is not web based?**

Well, you can clearly read [here](https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/) that t*he Web Playback SDK only works in client-side JavaScript.*

*Node.JS is not supported.*

Thank you Spotify.

### So, what now?

Appreciating that Spotify doesn’t want my personal assistant capable of playing songs for me, let’s do it anyway with reverse engineering.

*Please note that this is only a proof-of-concept hack, don’t use in your commercial applications.*

I didn’t want to listen to music directly via my personal assistant speaker, I only wanted to listen on Chromecast and control by voice.

So the first thing to do is understanding how Spotify communicates with a Chromecast.

![Spotify Web Player: Google Cast](https://cdn-images-1.medium.com/max/2000/1*c5FGV8sSGrr-zKpRAIkOmg.png)*Spotify Web Player: Google Cast*

You are capable to use this feature from [Spotify Web Player](https://open.spotify.com/browse); you have to simply click on the bottom-right corner and select Google Cast:

Once the transmission is established, you’ll notice the Spotify black screen that is waiting for you.

![Spotify on a Chromecast waiting for control](https://cdn-images-1.medium.com/max/3140/1*VwLSv8KOMu6ODIYg9MHAXA.png)*Spotify on a Chromecast waiting for control*

And, of course, you can **control** music from all of your devices. Spotify will always play music from the current device, that is now available in the devices list.

![Spotify on a Chromecast playing music](https://cdn-images-1.medium.com/max/3068/1*jlh9ELmIT_9lTQ75vjd60A.png)*Spotify on a Chromecast playing music*

Pretty awesome right? Perfect, let’s inspect how it works.

To understand the protocol, I tried to debug the Chromecast itself, but it turns out that you can only debug your own applications.

Remember that browser is the easiest platform where hacks can occur, because all Javascript code is always in clear.
> You can obfuscate your code, minify it, do some magic with it, but for an expert Javascript developer will always be in clear.

Let’s open Chrome Developers Tools, go to Sources and after some rrsearches with the simplest keyword: *“chromecast”* I ended up with this part of the code found in the main script (Check out the original script: [https://open.scdn.co/static/web-player.acc65e1b.js](https://open.scdn.co/static/web-player.acc65e1b.js))

![](https://cdn-images-1.medium.com/max/4840/1*OvPWrkcBq0y3teTmNLvdxg.png)

```js
n.addMessageListener(t, function(r, i) {
   var a = JSON.parse(i);
   switch (a.type) {
      case "setCredentialsResponse":
      n.sendMessage(t, { type: "getInfo", payload: {} })
      break;
      case "getInfoResponse":
      e.dispatch((0, o.setActiveDecide)(a.payload.deviceID))
      }
   })
   n.sendMessage(t, {
      type: "setCredentials",
      credentials: e.getState().session.accessToken
   })
   ...
```

After the insertion of some breakpoints inserted and a 5-minute debugging session, it turns out that when you request to cast, the Web player sends one simple message:

```js
{ "type": "setCredentials", "credentials": {ACCESSTOKEN} }
```

After that, it listens for an incoming message from the Chromecast likesetCredentialsResponse, and pong with another getInfo message.

Once received the latest getInfoResponse message, it calls the API to set the active device.

Perfecto, so let’s build a CastV2 Client and replicate this communication.

## Build a CastV2 Spotify Client

We know how Spotify protocol works with the Chromecast, so we have all information to replicate in a standalone project.

I used this awesome Node.js library that encapsulates the CASTV2 Protocol: [https://github.com/thibauts/node-castv2#protocol-description](https://github.com/thibauts/node-castv2#protocol-description)

To create a custom receiver you basically extends the base **DefaultMediaReceiver** to provide custom features. In this case, we abstract from **RequestResponseController.**

The URN is obviously copied from the *web-player.js** ***file and is ‘*urn:x-cast:com.spotify.chromecast.secure.v1*’.

```js
    function SpotifyController(client, sourceId, destinationId) {
       RequestResponseController.call(this, client, sourceId, destinationId, ‘urn:x-cast:com.spotify.chromecast.secure.v1’);
    }
```

We’ll provide an authentication function that should be called a-priori:

```js
SpotifyController.prototype.authenticate = function ({ accesss_token, device_name }) {
   this.send({
      type: ‘setCredentials’,
      credentials: access_token
   });
}
```

Furthermore, to cast correctly you have to use the original Spotify AppID for Chromecast. You can just find it in the same main javascript file (*web-player.js): CC32E753.*

We can now wrap our *SpotifyController* in a *Spotify Receiver *(complete code [here](https://github.com/kopiro/spotify-castv2-client/blob/master/Spotify.js#L18))

```js
function Spotify(client, session) { 
   Application.apply(this, arguments); 
   this.media = this.createController(MediaController); 
   this.spotify = this.createController(SpotifyController);
   this.media.on(‘status’, (status) => { 
   this.emit(‘status’, status); 
   });
}

Spotify.APP_ID = ‘CC32E753’;
util.inherits(Spotify, Application);

Spotify.prototype.authenticate = function() { 
   return this.spotify.authenticate.apply(this.spotify, arguments);
};
```

Question. Where can we find an access token? By copying my access token in the Javascript console with the debugger, it works like a charm.

I tried to implement the OAuth flow described [here](https://developer.spotify.com/web-api/authorization-guide/) with a registered Spotify applications, using all kind of [scopes](https://developer.spotify.com/web-api/authorization-guide/#scopes) (*streaming** ***included), but when I tried to use this fresh access token in this CastV2 client, Spotify simply replies with this beautiful error message.

![Spotify on Chromecast with a non-valid access token](https://cdn-images-1.medium.com/max/2128/1*Y4tEkGW0gK8YxIrI22hkLg.png)*Spotify on Chromecast with a non-valid access token*

I think that my access token doesn’t have enough permission to run on a external Spotify device, even if it has *streaming* permissions. So, the unique access token I can use is the one provided by the Web Player.

## Grab a valid access token from Spotify Web Player

I notice that Spotify Web Player send a Bearer access token to its API to authenticate them. Further investigations find out that Web players receive this access token in a Cookie named wp_access_token

![Cookie storage for Spotify web Player](https://cdn-images-1.medium.com/max/2006/1*nuQGCDDiT_VAU7xJn2uo-A.png)*Cookie storage for Spotify web Player*

To grab this “extended” access token, we have to mimic the entire login flow into the Spotify Web Player and then inspect where is it stored.

Using with my favorite tool: [Charles](https://www.charlesproxy.com/), I inspected every HTTPs request to the Spotify website and replicated the entire login flow in a Node.js library.

You can view the full code here: [https://github.com/kopiro/node-spotify-webplayer-accesstoken](https://github.com/kopiro/node-spotify-webplayer-accesstoken)

The login flow consists of three parts:

- Grab CSRF token from login page
- Do a POST to the login API
- Navigate to the Web Player page and grab the magic access token

One interesting thing is that the website checks if the User-Agent is compatible, [so you have to spoof with a valid one](https://github.com/kopiro/node-spotify-webplayer-accesstoken/blob/master/index.js#L4).

The other one is that the login API simply says incorrectCredentials if you don’t pass a valid __bon Cookie in the request.
As you can notice [here](https://github.com/kopiro/node-spotify-webplayer-accesstoken/blob/master/index.js#L56), I simply put a static value that the API accept. By inspecting the code, it turns out the is base64 encoded string with some configurations values.

## Put things together

Now we have a valid access token that works with the CastV2 Client.

This solution obviously is not valid for production applications, because you have to provide your Spotify credentials to your app and I think that this violates Spotify terms (OAuth exists for a reason).
But, I think that for an internal project could work.

Let’s complete the flow by using the previous package:

```js
this.device_name = device_name;
this.access_token = await SpotifyWPAT.getAccessToken(username, password);

// Instantiate Spotify Web API
this.api = new SpotifyWebApi({
   accessToken: this.access_token
});

// Send setCredentials request using web AT
this.send({
   type: 'setCredentials',
   credentials: access_token
});
```

Perfecto! Now that our Chromecast is connected, our Spotify account has a new device in our playable device list, and we call the Web API to grab its ID by its device name:

```js
this.on('message', async(message) => {
   if (message.type === 'setCredentialsResponse') {
      const devices = (await this.api.getMyDevices()).body.devices;
      this.device = devices.find(e => e.name === this.device_name);
   }
});
```

Let’s complete the flow by adding the code to play some music.

*I did a pull request to support the deviceId option in the Spotify Web API library for Node.js: [https://github.com/thelinmichael/spotify-web-api-node/pull/183](https://github.com/thelinmichael/spotify-web-api-node/pull/183)*

You can find the full code of *SpotifyController* [here](https://github.com/kopiro/spotify-castv2-client/blob/master/SpotifyController.js).

## Conclusions

You can now finally control your Spotify over a Chromecast from your Node.js application.

The Spotify CastV2 Client is available on [Github](https://github.com/kopiro/spotify-castv2-client) and on NPM with the spotify-castv2-client package name.

Build great stuffs!
