---
layout: post
title: "Working with Ionic Native - Shake, Rattle, and Roll"
date: "2016-07-07T10:41:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: /images/banners/shakerattle.jpg
permalink: /2016/07/07/working-with-ionic-native-shake-rattle-and-roll
---

Forgive the slightly dramatic title of the blog post - I just get a bit excited when I test something new and it actually works well! For today's post, I'm looking at something new with Ionic - [Ionic Native](http://ionicframework.com/docs/v2/native/).

Ionic Native is the spiritual successor to the older [ngCordova](http://ngcordova.com/) project. Basically - it provides an Ionic/Angular friendly interface to many common Apache Cordova plugins. To be clear, this isn't something you *have* to use in your Ionic application, but it can make using plugins a bit simpler. For today's demo, I thought I'd work with the [Device Motion](http://ionicframework.com/docs/v2/native/device-motion/) plugin. This plugin lets monitor the device accelerometer and do... well whatever based on the motion of the hardware. For my demo (link at the end) I decided on a simple idea - I'd build an app that loads data and then lets you shake the device to update.

I began by building a new Ionic 2 application based on the blank template. For the initial version, I'd build out all the code to load data, display it in a list, and I'd include a button that could be used to refresh the data. (While "shake to update" is cool, you probably want to provide a simple UI element to click as well.) 

The first thing I did was create a provider. I made it use hard coded data and set up a simple routine so it could easily add more data to the list. I assume this is self-explanatory, but let me know if you have any questions.

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the CatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CatProvider {
  data: any;

  constructor() {
    // hard coded initial data
    this.data = [];
    
    for(var i=0;i&lt;3;i++) {
      this.data.push(this.makeCat());
    }
  }

  makeCat() {
    return {
      &quot;name&quot;:&quot;Cat &quot;+(this.data.length+1),
      &quot;id&quot;:+(this.data.length+1)
    }
  }

  load() {
      //add a cat
      this.data.push(this.makeCat());
      return Promise.resolve(this.data);
  }

}
</code></pre>

In my view's logic, I then added in the provider and had it set a local variable, <code>cats</code>, to the result of provider's <code>load</code> method.

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{NavController}{% endraw %} from 'ionic-angular';
import {% raw %}{CatProvider}{% endraw %} from '../../providers/cat-provider/cat-provider';

@Component({
  providers: [CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array&lt;Object&gt;;

  constructor(public catProvider:CatProvider, private navController: NavController) {
    this.loadCats();
  }

  loadMore() {
    console.log('load more cats');
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result =&gt; {
      this.cats = result;
    });
  }

}
</code></pre>

Again - I'm kinda assuming this is all relatively simple, but just let me know if it doesn't make sense. Finally, I built out my view.

<pre><code class="language-javascript">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Shake Demo
    &lt;/ion-title&gt;
  &lt;/ion-navbar&gt;
&lt;/ion-header&gt;

&lt;ion-content class=&quot;home&quot; padding&gt;
  &lt;ion-list inset&gt;
    &lt;ion-item *ngFor=&quot;let cat of cats&quot;&gt; {% raw %}{{ cat.name }}{% endraw %} &lt;/ion-item&gt;
  &lt;/ion-list&gt;

  &lt;button danger (click)=&quot;loadMore()&quot;&gt;Load More&lt;/button&gt;

&lt;/ion-content&gt;
</code></pre>

Here it is running in the browser:

<img src="https://static.raymondcamden.com/images/2016/07/shakeA.jpg" class="imgborder">

Woot. Ok - now for the fun part. First, I have to add in the plugin. The Ionic Native docs remind you of this both on the introductory page of the feature and for each individual plugin. For me, this was done via: <code>ionic plugin add cordova-plugin-device-motion</code>

Ok, easy enough. Next, I needed to add support to my logic. First, I imported it:

<pre><code class="language-javascript">
import {% raw %}{DeviceMotion}{% endraw %} from 'ionic-native';
</code></pre>

Cool. Then I tried the sample code... and it crapped the bed in the browser. Because - of course - this is a device specific thing. Oops. So the first thing I did was add in support for listening for the platform ready event. Remember - your controller may actually fire before Cordova is ready to let you use hardware features. You can easily listen for this by adding in the Platform object:

<pre><code class="language-javascript">
import {% raw %}{NavController,Platform}{% endraw %} from 'ionic-angular';
</code></pre>

And then listen for <code>ready</code>:

<pre><code class="language-javascript">
constructor(public catProvider:CatProvider, private navController: NavController, platform:Platform) {
  this.loadCats();

  platform.ready().then(() =&gt; {

</code></pre>

That was step one. Step two was to switch to using the *incredibly cool* [Cordova Tools](https://marketplace.visualstudio.com/items?itemName=vsmobile.cordova-tools) extension for Visual Studio Code. This is an extension created by Microsoft that provides a whole set of awesomeness for folks doing Cordova/Ionic apps with Code. Most recently, they [added](https://blogs.msdn.microsoft.com/visualstudio/2016/06/16/apache-cordova-the-browser-based-workflow/) support for using Ripple within the editor. I haven't talked about Ripple in a long time, but for folks who don't remember, it was a browser based testing system for Cordova apps that included some cool extras - like being able to fake GPS and accelerometer data. 

So I set up my project for debugging (see the [earlier link on Microsoft's blog](https://blogs.msdn.microsoft.com/visualstudio/2016/06/16/apache-cordova-the-browser-based-workflow/) for more information) and then fired it off. Now - it is a bit difficult to use this on a laptop as it is a bit cramped, but I was able to debug my application and 'shake' it via Code:

![Screen shot](https://static.raymondcamden.com/images/2016/07/shake1.jpg)

Nice. So at this point, I needed to do two things - monitor the device motion and then determine when a 'shake' happens. The first one is easy:

<pre><code class="language-javascript">
var subscription = DeviceMotion.watchAcceleration({% raw %}{frequency:200}{% endraw %}).subscribe(acc =&gt; {
</code></pre>

The second one... not so much. Luckily, I've done this before in a demo. Basically - I remember the device's previous values for acceleration, compare it to the current set of values, and if it is "enough", consider it a "movement". I can then keep track of movements and when enough has happened, I can consider it a shake. Obviously this can be tweaked. You would need to test on a real device and see what "feels" right. Here is the updated code with that logic in place:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{NavController,Platform}{% endraw %} from 'ionic-angular';
import {% raw %}{CatProvider}{% endraw %} from '../../providers/cat-provider/cat-provider';
import {% raw %}{DeviceMotion}{% endraw %} from 'ionic-native';

@Component({
  providers: [CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array&lt;Object&gt;;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;

  constructor(public catProvider:CatProvider, private navController: NavController, platform:Platform) {
    this.loadCats();

    platform.ready().then(() =&gt; {
      var subscription = DeviceMotion.watchAcceleration({% raw %}{frequency:200}{% endraw %}).subscribe(acc =&gt; {
        //console.log(acc);

        if(!this.lastX) {
          this.lastX = acc.x;
          this.lastY = acc.y;
          this.lastZ = acc.z;
          return;
        }

        let deltaX:number, deltaY:number, deltaZ:number;
        deltaX = Math.abs(acc.x-this.lastX);
        deltaY = Math.abs(acc.y-this.lastY);
        deltaZ = Math.abs(acc.z-this.lastZ);

        if(deltaX + deltaY + deltaZ &gt; 3) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }

        if(this.moveCounter &gt; 2) { 
          console.log('SHAKE');
          this.loadCats(); 
          this.moveCounter=0; 
        }

        this.lastX = acc.x;
        this.lastY = acc.y;
        this.lastZ = acc.z;

      });
    });

  }

  loadMore() {
    console.log('load more cats');
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result =&gt; {
      this.cats = result;
    });
  }

}
</code></pre>

You can find the complete source code for this up on GitHub: [https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicnative_shake](https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicnative_shake). Let me know if you have any questions by leaving me a comment below!