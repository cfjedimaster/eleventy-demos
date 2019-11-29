---
layout: post
title: "Time for Ionic 2"
date: "2016-02-11T15:53:00-07:00"
categories: [development,mobile]
tags: [ionic]
banner_image: /images/banners/ionic2beta.png
permalink: /2016/02/11/time-for-ionic-2
---

A few weeks ago I wrote about my experience looking into Angular 2 ([Time for Angular 2?](http://www.raymondcamden.com/2016/01/18/time-for-angular-2/)). I haven't had a chance to dig deeper into Angular 2 since then but it is still high on my list to get more familiar with over the year. About a week and a half ago I had pleasure of meeting [Mike Hartington](http://mhartington.io/) from the Ionic team at PhoneGap Day. I sat in his Ionic 2 workshop and came out convinced it was time to give it a try as well. And of course, just a few days later the Ionic folks released the [beta version of 2.0](http://blog.ionic.io/announcing-ionic-framework-2-beta/). It is definitely beta, but I was able to build an *incredibly* simple app with it (after some help from Mike and others) and I thought I'd share my experience.

<!--more-->

One of the most important things to note is that you can install Ionic V2 *without* screwing up your ability to do Ionic V1 apps or work with existing projects. It may sound silly, but as easy as `npm` can be, I didn't want to have to worry about switching back and forth to work with existing projects. Heck, the CLI even defaults to V1 anyway so in case you forget, are in a rush, or whatever, it will continue to work the way you expect it to.

You'll want to spend some time in the [docs](http://ionicframework.com/docs/v2/) of course, and specifically the [Getting Started](http://ionicframework.com/docs/v2/getting-started/) guide. Note that there are mistakes in the guide (hey, it *is* a beta) that may trip you up. Specifically it seems like some of the code samples are a bit out of date. For the most part I think you can figure it out, but these issues have been reported and may be corrected by the time you get to it.

<img src="https://static.raymondcamden.com/images/2016/02/ionic2-1.gif" class="imgborder" title="Ionic V2 Docs">

Working through the Getting Started guide gets you through a simple application and will give you a *super*
basic idea of what's going on, but I'd strongly urge you to go through the [Angular 2 quickstart](https://angular.io/docs/ts/latest/quickstart.html) first just so things aren't completely alien to you. 

You'll also want to peruse the [components](http://ionicframework.com/docs/v2/components) docs. From my quick look through it, things look quite a bit simpler to use, but again, this is still in development. A notable missing component currently is the loading widget. Be sure to notice that the component examples
give you a quick way to toggle between Android and iOS views, and specifically that Android now has a Material look that is *really* freaking sweet. As an example, here are tabs in iOS:

![iOS Tabs Ionic 2](https://static.raymondcamden.com/images/2016/02/ionic2-2.gif)

Now compare it to the Android version:

![Android Tabs Ionic 2](https://static.raymondcamden.com/images/2016/02/ionic2-3.gif)

That's damn spiffy.

So what's the code like? As I said before, Angular 2 is different. Not bad different, just... *different.*

![Like this...](https://static.raymondcamden.com/images/2016/02/pikacat.jpg)

While working on my first demo, I ran into things I immediately liked. For example, I love that my "page" template and controller are in a folder nicely packaged together. I could have easily done that in Ionic/Angular1 too I guess, but I like the organization. 

I'm also really liking working with ES6. I'm barely scratching the surface of course, and probably doing it wrong, but even stuff I thought was overblown, like fat arrows, are *really* growing on me. 

On the other hand, some things I ran into felt... wrong. I got over it. I also know there were things like that in Angular1 as well. But sometimes I just bit my tongue and went with it. So without further ado, here is an Ionic 2 version of my RSS Reader app. I did not build it out completely like the version I have on the Ionic market ([RSS Reader](https://market.ionic.io/starters/rssviewer)), but I built in basic list/detail support. I'll share the code, but I want to give big thanks to Mike Hartington (again), @adbella on the Ionic slack, and others. 

**Please do not treat this as good code!** Treat this code like a slightly drunk cat walked over your keyboard and then had a little "accident". It works - and the part that @abdella helped me with is elegant, but I'm sure I could have done things better. With that out of the way, let's first look at the home page. It simply lists items from the RSS feed. First I'll show the view:

<pre><code class="language-markup">
&lt;ion-navbar *navbar&gt;
&lt;ion-title&gt;
Home
&lt;&#x2F;ion-title&gt;
&lt;&#x2F;ion-navbar&gt;

&lt;ion-content&gt;
&lt;ion-list inset&gt;
&lt;ion-item *ngFor=&quot;#entry of entries&quot; (click)=&quot;openPage(entry)&quot;&gt;{% raw %}{{entry.title}}{% endraw %}&lt;&#x2F;ion-item&gt;
&lt;&#x2F;ion-list&gt;
&lt;&#x2F;ion-content&gt;
</code></pre>

Nothing really weird here except the new way Angular 2 does attributes/code/etc. But I'm assuming you can figure out what is happening here. Now let's look at the code for this page.

<pre><code class="language-javascript">
import {% raw %}{Page,NavController}{% endraw %} from 'ionic/ionic';
import {% raw %}{RssService}{% endraw %} from '../../providers/rss-service/rss-service';
import {% raw %}{DetailPage}{% endraw %} from '../detail-page/detail-page';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers:[RssService]
})
export class HomePage {
  constructor(public rssService:RssService, nav:NavController) {
	  this.nav = nav;
	  
	  this.entries = [];

	  this.rssService.load().subscribe(
		  data =&gt; {
			  this.entries = data;
		  }
	  );

  }
  
  openPage(entry) {
	  console.log('open page called with '+entry.title);
	  this.nav.push(DetailPage, {% raw %}{selectedEntry:entry}{% endraw %});
  }

}
</code></pre>

So yeah - this is where things got a bit weird. One of the new things in the Angular 2 world is the idea of Observables. These replace (ok, not replace, but my understanding is that they are *preferred*) Promises and are supposed to be quite a bit more powerful. You can't really see the Observable, but see the subscribe() call? That's using it. Part of what makes them powerful is that they would support live updates. That doesn't really come into play with RSS parsing, but if it ever were added to my project, in theory it would just plain work. (Note to self - I'm going to try to make a demo of a live updating Ionic 2 app soon!)

Also note the navigation in openPage. I don't have to build an app router now. I just load the page and pass data. I really, really appreciate that. 

Let's look at the service now. 

<pre><code class="language-javascript">
import {% raw %}{Injectable}{% endraw %} from 'angular2/core';
import {% raw %}{Http}{% endraw %} from 'angular2/http';
import {% raw %}{Observable}{% endraw %} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

/*
  Generated class for the RssService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

//Credit for latest version is @abdella from the Ionic Slack
@Injectable()
export class RssService {

	url = 'https://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20title%{% endraw %}2Clink{% raw %}%2Cdescription%{% endraw %}20from{% raw %}%20rss%{% endraw %}20where{% raw %}%20url%{% endraw %}3D{% raw %}%22http%{% endraw %}3A{% raw %}%2F%{% endraw %}2Ffeeds.feedburner.com{% raw %}%2Fraymondcamdensblog%{% endraw %}3Fformat{% raw %}%3Dxml%{% endraw %}22&amp;format=json&amp;diagnostics=true&amp;callback=';
	
	constructor(http: Http) {
		this.http = http;
	}
	
	load() {
 
		return this.http.get(this.url)
  			.map(res =&gt; res.json())
  			.map(data =&gt; data.query.results.item);
		  
	  /* v2
	  return Observable.create(s =&gt; {

		this.http.get('https://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20title%{% endraw %}2Clink{% raw %}%2Cdescription%{% endraw %}20from{% raw %}%20rss%{% endraw %}20where{% raw %}%20url%{% endraw %}3D{% raw %}%22http%{% endraw %}3A{% raw %}%2F%{% endraw %}2Ffeeds.feedburner.com{% raw %}%2Fraymondcamdensblog%{% endraw %}3Fformat{% raw %}%3Dxml%{% endraw %}22&amp;format=json&amp;diagnostics=true&amp;callback=').subscribe(res =&gt; {
			console.log('in sub');
			console.dir(s);
			var result = res.json().query.results.item;
			result.forEach(i=&gt;s.next(i));
			s.complete();
			
		});

	  });
	*/	

	// Static version	  
	//	  let data = [{% raw %}{title:&quot;do one&quot;}{% endraw %},{% raw %}{title:&quot;do two&quot;}{% endraw %},{% raw %}{title:&quot;three&quot;}{% endraw %}];
	//	  return Observable.from(data);

	
  }
}
</pre></code>

I apologize for the large blocks of commented out code, but I wanted to keep a record of my previous versions for reference later. The slick http.get().map().map() syntax is an example of Oberservables in action and is thanks to @abdella. The basic idea here is we're fetching the remote data, converting it from a JSON string into an object, and then specifying a precise part of the result to work with (data.query.results.item).

The imports on top are a bit weird. Specifically the fact that we have to import specific parts of Observable. It seems to me that if I want to use a library, I don't want to have to worry about parts of it being "optional", and basic functionality like I used doesn't seem like it should be optional. This is one of those parts that bugged me and I just got over for now. 

The detail page is pretty trivial as well. Here is the view:

<pre><code class="language-markup">
&lt;ion-navbar *navbar&gt;
  &lt;ion-title&gt;{% raw %}{{entry.title}}{% endraw %}&lt;/ion-title&gt;
&lt;/ion-navbar&gt;

&lt;ion-content padding class=&quot;detail-page&quot;&gt;
	&lt;div [innerHTML]=&quot;entry.description&quot;&gt;&lt;/div&gt;
&lt;/ion-content&gt;
</code></pre>

That last bit, `[innerHTML]=`, is how you handle rendering HTML in Angular since it is *still* a pain in the rear about it. (Yes, I know there are reasons, and yes, it still bugs me.) The code for the page just picks up the passed in data. Again - this is really super easy I think.

<pre><code class="language-javascript">
import {% raw %}{Page,NavController,NavParams}{% endraw %} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/detail-page/detail-page.html'
})
export class DetailPage {
	constructor(nav: NavController,navParams:NavParams) {
		console.log('run');
		this.nav = nav;
		this.entry = navParams.get('selectedEntry');
		console.log('my entry is '+this.entry.title);
	}
}
</code></pre>

Here is the home page:

<img src="https://static.raymondcamden.com/images/2016/02/ionic2-4.png" class="imgborder" title="Home Page">

And one detail page:

<img src="https://static.raymondcamden.com/images/2016/02/ionic2-5.png" class="imgborder" title="Detail Page">

Not exactly rocket science, but you get the idea. So far, I'm digging it. I've got a lot of research to do, and I'm really looking forward to when things hit a firm release and stop changing, but I'd definitely take some time to look into it. As a reminder, you can, and should, join the [Ionic Slack](http://ionicworldwide.herokuapp.com/) channel. It is the best place to get support and help others. 

If you want a copy of my app, you can find it on my GitHub repo here: [https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic_v2](https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic_v2).