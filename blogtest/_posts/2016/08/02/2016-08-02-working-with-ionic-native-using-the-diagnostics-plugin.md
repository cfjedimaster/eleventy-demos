---
layout: post
title: "Working with Ionic Native - Using the Diagnostics Plugin"
date: "2016-08-02T13:42:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2016/08/02/working-with-ionic-native-using-the-diagnostics-plugin
---

Ionic Native is a set of wrappers for various Cordova plugins that make them easier to work with in Ionic 2 applications. These wrappers cover the core plugins (Camera, File, etc) but also a subset of other popular plugins. One of the cool things I found while going through the [docs](http://ionicframework.com/docs/v2/native/) was that they supported plugins I had never even heard of. (And you should keep that in mind - even if you have no plans on using Ionic 2 or heck, even Ionic, these plugins that Ionic Native wrap are available for *any* Cordova application.)

One of the more interesting ones I discovered recently was the [Diagnostic](https://github.com/dpa99c/cordova-diagnostic-plugin) plugin. Initially I assumed this was some weird testing framework for hardware or something that worked with various internal settings. Instead it works with device *settings* and permissions and can be incredibly useful for providing information about what your app can do on the device. So for example, this plugin can:

* Tell you if GPS, Wifi, a camera, or bluetooth is available on the device
* Switch to device settings, so for example, to help a user enable GPS, Wifi, etc
* Enable or disable Wifi and Bluetooth
* Check to see if the app has permissions for various things, and even ask for permission explicitly. These settings are more than just hardware items like the camera, but also things like contacts and the device calendar

Basically - this plugin can help your app figure out exactly what it is allowed to do and even automate the request for having more access. It is incredibly cool, and frankly, I just wish it had a different name. Maybe something like "AwesomeAppPermissionCheckerUtilityOfAwesomeness." I think I'll fire a PR right now for that name change!

For my demo of this plugin, I decided to build something relatively simple. For a long time now I've been building Camera demos. I've done this for Flex Mobile, PhoneGap, jQuery Mobile, Ionic, and NativeScript. It's simple and fun and demos well. 

One issue I run into though is that when using the iOS simulator, there's no camera available. (Which is pretty silly if you ask me. Android simply 'fakes' the camera which is what iOS should do as well.) This isn't a big deal as I just use the "select existing photo" option in the Camera plugin, but I've always wished that the Camera plugin itself would have an option to check for the existence of a camera. It's rather trivial Objective-C code (and NativeScript makes it easy to call, see [my post](https://www.raymondcamden.com/2016/05/16/thoughts-on-nativescript-20/) on it from a few weeks ago), but we've never had a nice way of doing it in Cordova. Turns out we can do this quickly with the Diagnostics plugin.

The plugin supports working with the camera in three different methods:

* <code>isCameraEnabled</code> checks if the device has a camera, and on iOS also sees if the application has permission.
* <code>isCameraPresent</code> checks to see if the device has a camera.
* <code>isCameraAuthorized</code> checks if the application has permission to use the camera.

I created a super simple Ionic V2 application to work with the camera and photo gallery. I began with a simple view consisting of two buttons and a space for the image.

<pre><code class="language-markup">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Camera/Diagnostics
    &lt;/ion-title&gt;
  &lt;/ion-navbar&gt;
&lt;/ion-header&gt;

&lt;ion-content padding&gt;


  &lt;img src=&quot;{% raw %}{{img}}{% endraw %}&quot; *ngIf=&quot;img !== ''&quot;&gt;

  &lt;button block primary (click)=&quot;getPic('take')&quot;&gt;Take Picture&lt;/button&gt;
  &lt;button block primary (click)=&quot;getPic('select')&quot;&gt;Select Picture&lt;/button&gt;

&lt;/ion-content&gt;
</code></pre>

On the back end, I've got a simple method that makes use of Ionic Native wrapper for Camera:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{NavController}{% endraw %} from 'ionic-angular';
import {% raw %}{Camera}{% endraw %} from 'ionic-native';
import {% raw %}{CameraOptions}{% endraw %} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  public img:String;

  constructor(private navCtrl: NavController) {
    this.img = &quot;&quot;;
  }

  getPic(type:String) {

    let options:CameraOptions = {
      targetWidth:400,
      targetHeight:400
    }

    if(type === 'select') {
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    } else {
      options.sourceType = Camera.PictureSourceType.CAMERA;
    }

    Camera.getPicture(options).then((url) =&gt; {
      this.img = url;
    });

  }

}
</code></pre>

I've said this before but I'll say it again. I love working with Ionic 2 (and Angular 2). I'm still fumbling my way through stuff, but the code just *feels* better. Ok, back on topic, Ray. So in this version, the user can click either button and either take a new picture or select an existing one. I won't share a screen shot of this as it just plain works as expected. You can find the source code for this version here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/cameradiagnostics/app_v1

Alright - so now let's modify it to hide the button that uses the camera when it isn't present. Don't forget to actually add the Diagnostics plugin (<code>ionic plugin add cordova.plugins.diagnostic</code>). Every single time I've used Ionic Native I've forgotten to add the plugin. I'm kinda slow sometimes. 

The first thing I did was modify the button itself:

<pre><code class="language-javascript">
&lt;button block primary (click)="getPic('take')" *ngIf="cameraSupported"&gt;Take Picture&lt;/button&gt;
</code></pre>

And here is the updated code:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{NavController,Platform}{% endraw %} from 'ionic-angular';
import {% raw %}{Camera}{% endraw %} from 'ionic-native';
import {% raw %}{CameraOptions}{% endraw %} from 'ionic-native';
import {% raw %}{Diagnostic}{% endraw %} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  public img:string;
  public cameraSupported:boolean;

  constructor(private navCtrl: NavController, platform:Platform) {
    this.img = '';
    platform.ready().then(() =&gt; {
     
      Diagnostic.isCameraPresent().then((res) =&gt; {
        console.log('diagnostic result', res);
        this.cameraSupported = res;
      }).catch((err) =&gt;  {
        console.log('got an error using diagnostic');
        console.dir(err);
      });

    });
  }

  getPic(type:string) {

    let options:CameraOptions = {
      targetWidth:400,
      targetHeight:400
    }

    if(type === 'select') {
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    } else {
      options.sourceType = Camera.PictureSourceType.CAMERA;
    }

    Camera.getPicture(options).then((url) =&gt; {
      this.img = url;
    });

  }

}
</code></pre>

The changes include:

* Importing Diagnostic from the Ionic Native library. The docs do not tell you to do this (but they do for other plugins) and I've filed a bug report to get this added. It's pretty easy to guess of course, but the docs should be consistent. 
* Then I simply use <code>Diagnostic.isCameraPresent()</code> to check the hardware. I can then simply use the result boolean to show/hide the button.

So here's the code running in the iOS Simulator:

<img src="https://static.raymondcamden.com/images/2016/08/diag1.png" class="imgborder">

And here it is running on the device:

<img src="https://static.raymondcamden.com/images/2016/08/diag2.jpg" class="imgborder">

Not terribly exciting in a visual sense, but as a developer, I think this is incredibly cool, and I wish I had known about this plugin earlier. (Note to self - maybe consider a weekly series where I find a random plugin and just build a cool demo of it.)

The complete source code (including the release + initial version) may be found here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/cameradiagnostics/app_v1