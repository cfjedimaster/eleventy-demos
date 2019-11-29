---
layout: post
title: "Artificially Delaying Providers with Observable.Delay"
date: "2017-04-19T16:44:00-07:00"
categories: [javascript]
tags: [ionic]
banner_image: 
permalink: /2017/04/19/artificially-delaying-providers-with-observabledelay
---

I'm still - grudgingly - making use of Observables in Ionic 2. As I've said before, I don't see anything wrong with Observables, I just find them overly complex and a pain to use. Half the time I get them working right it's because I've copied and pasted another example. I would say - easily - that out of all the changes with Ionic and Angular 2 (sorry, 4, um, whatever) it's Observables that I've had the hardest time adopting.

But while I'm griping about them, I do know they are hella powerful. Here is a great example. I was testing an Ionic demo that showed off the [Loading](http://ionicframework.com/docs/components/#loading) widget. While it worked great, the API I was hitting returned so fast I didn't feel like I could get a good grip on how it would work in the real world.

Chrome has a very cool widget in DevTools that can slow your network requests down:

![Network Throttle](https://static.raymondcamden.com/images/2017/4/delay1.png)

It's a cool little addition to the dev tool suite, but there's one problem with this approach. When enabled for an Ionic app running via the `serve` command, *everything* will be delayed, even the 'local' files that would load instantly on a device. (Minus the time it takes for the web view to process the code of course.) Because of that, it isn't necessarily a realistic test. Also, it can get quite annoying if you are reloading a lot while working on the app. 

So - on a whim - I did some searching, and discovered that Observables support a `delay` operation. It just delays the output from the observable. Yeah, that's it. Certainly not rocket science or anything, but it's also super easy to use. Consider this provider:

<pre><code class="language-javascript">import {% raw %}{ Injectable }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Http }{% endraw %} from &#x27;@angular&#x2F;http&#x27;;
import {% raw %}{ Observable }{% endraw %} from &#x27;rxjs&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;map&#x27;;

@Injectable()
export class Data {

 public cats:Array&lt;Object&gt; = [
   {% raw %}{name:&#x27;Luna&#x27;, lastRating:new Date(2016, 11, 2 ,9, 30)}{% endraw %},
   {% raw %}{name:&#x27;Pig&#x27;, lastRating:new Date(2016, 11, 12, 16,57)}{% endraw %},
   {% raw %}{name:&#x27;Cracker&#x27;, lastRating:new Date(2016, 10, 29, 13, 1)}{% endraw %},
   {% raw %}{name:&#x27;Robin&#x27;, lastRating:new Date(2016, 11, 19, 5, 42)}{% endraw %},
   {% raw %}{name:&#x27;Simba&#x27;, lastRating:new Date(2016, 11, 18, 18, 18)}{% endraw %}
   ];

  constructor() {
  }

  load() {
    return Observable.from(this.cats).delay(2000);
  }

}
</code></pre>

I've got a static list of data I'm converting into an Observable and then delaying by two seconds. So now when I run my app in the browser, the main app loads, my loading widget shows up, and then 2ish seconds later my data shows up. 

In general, I try to avoid testing that involves modifying my code as it is *exactly* the kind of thing you forget and leave in place, but it worked so well for testing the loading widget I figured I'd make an exception in this case.

Here is a super-advanced animated GIF showing this in action:

![omg animated gif](https://static.raymondcamden.com/images/2017/4/licecap1.gif)