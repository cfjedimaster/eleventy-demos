---
layout: post
title: "An example of virtualScroll and Infinite Scroll in Ionic 2"
date: "2016-04-25T08:50:00-07:00"
categories: [mobile,javascript]
tags: [ionic,strongloop]
banner_image: /images/banners/infinite.jpg
permalink: /2016/04/25/an-example-of-virtualscroll-and-infinite-scroll-in-ionic-2
---

Before I begin, a warning. At the time I wrote this blog post, Ionic 2 was still in beta. Also, I've barely begun to learn Ionic 2 myself. You should consider this code beta-level quality written by an inexperienced dev. On the other hand, if it still works perfectly, I'm going to pretend I was brilliant all along.

<!--more-->

A few days ago, the [Ionic blog](http://blog.ionic.io) released a great entry on Ionic 2 and APIs: [10 Minutes with Ionic 2: Calling an API](http://blog.ionic.io/10-minutes-with-ionic-2-calling-an-api/). In this post, Andrew describes how you can use the Ionic CLI to generate both an application and a boilerplate HTTP service, or more accurately, a "Provider". 

If you walk through this his tutorial you'll end up with a simple application that drives a list of people via the [Random User Generator](https://randomuser.me/). I was thinking about how you would take this application and convert it to use an infinite (well, *near* infinite) list of people instead. 

To begin, I used the Random User Generator to output a *huge* list of users. I didn't want to abuse their API so I did one big call, saved the JSON, and then imported that data into my LoopBack application running locally. (If anyone wants to see how that's done, just ask. I basically reused some of the logic from my blog post: [Seeding data for a StrongLoop app](https://www.raymondcamden.com/2016/01/06/seeding-data-for-a-strongloop-app/)). The net result was that I had a lot of "People" data that I could use via a REST API - a bit over two thousand.

My first change was to people-service.ts. The original code would cache the result. My modified code removes this cache and supports a parameter telling it what index to begin fetching results. This is all part of the LoopBack API and I'll be talking about that in a blog post over on the [StrongLoop blog](https://strongloop.com/strongblog/) later this week.

<pre><code class="language-javascript">
import {% raw %}{Injectable}{% endraw %} from 'angular2/core';
import {% raw %}{Http}{% endraw %} from 'angular2/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeopleService {

  perpage:number = 50;
  
  constructor(public http: Http) {}

  load(start:number=0) {

    return new Promise(resolve =&gt; {
      
      this.http.get('http://localhost:3000/api/people?filter[limit]='+this.perpage+'&filter[skip]='+start)
        .map(res =&gt; res.json())
        .subscribe(data =&gt; {

          resolve(data);

        });
    });
  }
}
</code></pre>

Note that I'm hard coding a `perpage` value. In theory the service could let me change that, but I wanted to keep things somewhat simple. 

Now let's look at the Home page. First, let's consider the view.

<pre><code class="language-markup">
&lt;ion-navbar *navbar&gt;
	&lt;ion-title&gt;
		Home
	&lt;&#x2F;ion-title&gt;
&lt;&#x2F;ion-navbar&gt;

&lt;ion-content class=&quot;home&quot;&gt;
	
	&lt;ion-list [virtualScroll]=&quot;people&quot; approxItemHeight=&quot;50px&quot;&gt;
		&lt;ion-item *virtualItem=&quot;#person&quot;&gt;
			&lt;ion-avatar item-left&gt;
				&lt;ion-img [src]=&quot;person.picture&quot; width=&quot;48&quot; height=&quot;48&quot;&gt;&lt;&#x2F;ion-img&gt;
			&lt;&#x2F;ion-avatar&gt;
			&lt;h2&gt;{% raw %}{{person.name}}{% endraw %}&lt;&#x2F;h2&gt;
		&lt;&#x2F;ion-item&gt;
	&lt;&#x2F;ion-list&gt;

 &lt;ion-infinite-scroll (infinite)=&quot;doInfinite($event)&quot;&gt;
   &lt;ion-infinite-scroll-content&gt;&lt;&#x2F;ion-infinite-scroll-content&gt;
 &lt;&#x2F;ion-infinite-scroll&gt;
 	
&lt;&#x2F;ion-content&gt;
</code></pre>

The changes here are two-fold. First, I changed the list to support [VirtualScroll](http://ionicframework.com/docs/v2/api/components/virtual-scroll/VirtualScroll/). This is the Ionic V2 version of collectionRepeat, basically a list optimized to handle a butt load of data.

Secondly - I added the [InfiniteScroll](http://ionicframework.com/docs/v2/api/components/infinite-scroll/InfiniteScroll/) directive. This is pretty simple to use (you'll see the code in a moment), but don't forget this little gem in the docs: "When this expression has finished its tasks, it should call the complete() method on the infinite scroll instance." Yeah, that's pretty important. But I'll pretend I didn't miss that. Ok, so let's look at the code behind the view.

<pre><code class="language-javascript">
import {% raw %}{Page}{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{PeopleService}{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;people-service&#x2F;people-service&#x27;;

@Page({
  templateUrl: &#x27;build&#x2F;pages&#x2F;home&#x2F;home.html&#x27;,
  providers:[PeopleService]
  
})
export class HomePage {
  public people:any = [];
  private start:number=0;
  
  constructor(public peopleService:PeopleService) {
    
    this.loadPeople();
  }
  
  loadPeople() {
    
    return new Promise(resolve =&gt; {
      
      this.peopleService.load(this.start)
      .then(data =&gt; {
        
        for(let person of data) {
          this.people.push(person);
        }
        
        resolve(true);
        
      });
            
    });

  }
  
  doInfinite(infiniteScroll:any) {
     console.log(&#x27;doInfinite, start is currently &#x27;+this.start);
     this.start+=50;
     
     this.loadPeople().then(()=&gt;{
       infiniteScroll.complete();
     });
     
  }

}
</code></pre>

Ok, so there's a few important changes here. First, I made `loadPeople` return a promise. I needed this so I could listen for it to complete when running my "get new stuff" code. I'm keeping a variable, `start`, to know where I am in the list of data and you can see `doInfinite` as the handler for fetching more data. Pay special attention to the `infiniteScroll.complete()` call. As the docs say, you need to do this to let the InfiniteScroll control know stuff is done. Also note that `this.start+=50` is problematic since 50 has to match the `perpage` value in the service. I could make it detect how many items were added in the last call, but again, I wanted to keep it simple.

Here is a snazzy animated gif of it in action:

<iframe src='https://gfycat.com/ifr/TediousThoroughGermanwirehairedpointer' frameborder='0' scrolling='no' width='640' height='969.6969696969696' allowfullscreen></iframe>

Unfortunately, the code does not appear to work in iOS. I have no idea why (no error is thrown), but it works fine in Android and via `ionic serve`. 

If you want the complete source code for this, I'm more than happy to share it, but bear in mind this is part of a larger LoopBack app. I'll share a link to the *entire* application, but the Ionic specific stuff may be found in the `app1` folder.

[https://github.com/cfjedimaster/StrongLoopDemos/tree/master/superlongscroll](https://github.com/cfjedimaster/StrongLoopDemos/tree/master/superlongscroll)