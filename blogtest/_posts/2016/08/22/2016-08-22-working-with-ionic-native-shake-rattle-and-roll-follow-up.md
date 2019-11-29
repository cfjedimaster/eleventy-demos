---
layout: post
title: "Working with Ionic Native - Shake, Rattle, and Roll (Follow Up)"
date: "2016-08-22T11:32:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: /images/banners/shakerattle.jpg
permalink: /2016/08/22/working-with-ionic-native-shake-rattle-and-roll-follow-up
---

Last month I wrote a tutorial on using Ionic Native and the Device Motion plugin ([Working with Ionic Native - Shake, Rattle, and Roll](https://www.raymondcamden.com/2016/07/07/working-with-ionic-native-shake-rattle-and-roll/)). In that post I detailed how to use the device's accelerometer to recognize a "shake" gesture and then reload data from a service. A reader (on the Ionic blog version of my article) had a great question:

<!--more-->

<blockquote>
Thats really useful and it works :-) Can anyone suggest how to implement subscription.unsubscribe(); when the page is navigated away from and then restarted when the user returns to this page?
</blockquote>

My demo was a one page app which isn't very practical, but kept things simple for the demo. However, as soon as you add a new page to the app, you may (or may not!) notice something bad about my code - it continues to listen to the accelerometer after you've left the page. That's going to drain the device battery and make the user angry. You wouldn't like the user when they're angry - trust me.

![Alt text](https://static.raymondcamden.com/images/2016/08/angrycat.jpg)

I began by modifying my previous demo such that the list of cats actually linked to a detail page. In case you don't remember, this is how the list looked:

<img src="https://static.raymondcamden.com/images/2016/07/shakeA.jpg" class="imgborder">

So I simply created a new page (don't forget, the Ionic CLI has a cool ["generate"](http://ionicframework.com/docs/v2/cli/generate/) feature to make that easy!) and then linked my cats to the detail. So first I added a click event to my list item:

<pre><code class="language-javascript">
&lt;ion-item *ngFor="let cat of cats" (click)="loadCat(cat)"&gt; {% raw %}{{ cat.name }}{% endraw %} &lt;/ion-item&gt;
</code></pre>

And then added a handler for it:

<pre><code class="language-javascript">
loadCat(cat) {
    this.navController.push(DetailPage, {% raw %}{cat:cat}{% endraw %});
}
</code></pre>

Ok, so how do we fix our code so we only listen to the accelerometer when the view is visible? Easy - we use a view event! The Ionic docs do *not* do a good job of making it easy to find them, but if you look the [API docs for NavController](http://ionicframework.com/docs/v2/api/components/nav/NavController/), you'll find a list of view-related events you can listen to. For my demo, I just needed `ionViewWillEnter` and `ionViewWillLeave`. So I simply moved my "listen for device motion" code out of the constructor and into the enter event. Here's the complete home.ts code:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{NavController,Platform}{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{CatProvider}{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;cat-provider&#x2F;cat-provider&#x27;;
import {% raw %}{DeviceMotion}{% endraw %} from &#x27;ionic-native&#x27;;
import {% raw %}{DetailPage}{% endraw %} from &#x27;..&#x2F;detail&#x2F;detail&#x27;;

@Component({
  providers: [CatProvider],
  templateUrl: &#x27;build&#x2F;pages&#x2F;home&#x2F;home.html&#x27;
})
export class HomePage {

  public cats:Array&lt;Object&gt;;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  private subscription:any;

  constructor(public catProvider:CatProvider, private navController: NavController, public platform:Platform) {
    this.loadCats();
  }

  loadMore() {
    console.log(&#x27;load more cats&#x27;);
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result =&gt; {
      this.cats = result;
    });
  }

  loadCat(cat) {
    this.navController.push(DetailPage, {% raw %}{cat:cat}{% endraw %});
  }

  ionViewWillEnter() {
    console.log(&#x27;view will enter&#x27;);

    this.platform.ready().then(() =&gt; {
      this.subscription = DeviceMotion.watchAcceleration({% raw %}{frequency:200}{% endraw %}).subscribe(acc =&gt; {
        console.log(acc);

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
          console.log(&#x27;SHAKE&#x27;);
          this.loadCats(); 
          this.moveCounter=0; 
        }

        this.lastX = acc.x;
        this.lastY = acc.y;
        this.lastZ = acc.z;

      });
    });

  }

  ionViewWillLeave() {
    console.log(&#x27;view will leave&#x27;);
    this.subscription.unsubscribe();
  }

}
</code></pre>

So `ionViewWillEnter` simply has the code I used before. No real difference there - but do note I'm storing `subscription` globally to the component. That let's me then use it in `ionViewWillLeave` to handle unsubscribing from the accelerometer.

I created a new folder for this version in my Cordova Demos repository - you can find it here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicnative_shake_2