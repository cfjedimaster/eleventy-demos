---
layout: post
title: "My perspective of working with the Ionic Framework"
date: "2014-07-28T13:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/07/28/my-perspective-of-working-with-the-ionic-framework
guid: 5276
---

<p>
For a while now I've been praising the the <a href="http://ionicframework.com/">Ionic</a> framework as one of the coolest things to happen to Cordova/PhoneGap development. I kept promising to talk about it a bit more deeply on the blog and today I've finally gotten around to it. This will be somewhat long, and rambling, but I hope it will give readers an idea of why Ionic <i>is</i> so cool and why they should consider giving it a try.
</p>
<!--more-->
<p>
Let's begin by talking about what the framework actually is. I'll steal their marketing tagline as a jumping off point:
</p>

<blockquote>
Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps. Built with Sass and optimized for AngularJS.
</blockquote>

<p>
Ok, cool, so let's break that down a bit.
</p>

<p>
First and foremost, Ionic is <strong>not just another UI framework</strong>. Not that there is anything particularly wrong with that; I love UI frameworks as they are a simple way to make my demos look nicer, but Ionic is much more than this. To be clear, there <i>is</i> a UI part to the framework and in <i>theory</i> you could use just that aspect, but you would be missing out on a significant part of what makes Ionic great. You can see plenty of examples on the site itself, but here are a few samples I stole from the docs. First, a Card view:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ionic1.png" />
</p>

And here is a list view:

<p>
<img src="https://static.raymondcamden.com/images/ionic2.png" />
</p>

<p>
You can see more examples on their <a href="http://ionicframework.com/docs/components/">components</a> page. Basically - a nice clean, perhaps Bootstrap-ish, look to it. 
</p>

<p>
The next major aspect of Ionic is that it is "optimized" for Angular. When you work with projects (and I'll talk a bit more about that experience later), your initial code will be an Angular project, so if you are using Ionic, you can pretty much assume Angular as well. Do <strong>not</strong> let that be a blocker for you. If you read my blog regularly, then you know I've recently started working with Angular again. I'm very much at the newbie level where I can get stuff done, slowly, and the code is ugly, but it works, and that makes me happy. So speaking as an Angular noob, I felt comfortable using Ionic with it. What problems I did have came more from my lack of experience and never actually stopped me from working. Of course, if you know <i>nothing</i> of Angular, you may want to spend a few minutes looking at it before you use Ionic, but you certainly do not need to be an expert. 
</p>

<p>
Ionic provides multiple different directives for your Angular app, making those nice UI things like the cards and lists somewhat easier to use. Oddly, these are found in the <a href="http://ionicframework.com/docs/api/">JavaScript</a> portion of the docs, which doesn't quite make sense to me, but that's where you'll find them. There are also times when the docs about the directives are not quite as clear as the pure CSS side. As an example, when I looked at the documentation for <a href="http://ionicframework.com/docs/api/directive/ionList/">ion-list</a>, it wasn't clear how I was supposed to build an <a href="http://ionicframework.com/docs/components/#list-inset">inset list</a>. The CSS docs made it clear, but I didn't get how to translate that to the directive version. The solution was pretty simple (add class="list list-inset" to the directive), but it seems like that should have been more clear.
</p>

<p>
On top of the UI support, there is also strong UX support as well. By that I mean common UX metaphors like pull to refresh are easy to add (<a href="http://ionicframework.com/docs/api/directive/ionRefresher/">ion-refresher</a>) via directives. Other examples include <a href="http://ionicframework.com/docs/api/directive/ionScroll/">scrollable panes</a> and even my favorite (not), <a href="http://ionicframework.com/docs/api/directive/ionInfiniteScroll/">infinite scroll</a>. Basically, all the "typical" UX things you may need in your app are baked into the framework and are pretty easy to use, again, even with me being new to Angular.
</p>

<p>
The final major aspect of Ionic is its use as a platform to build Cordova (PhoneGap) applications. Again, you don't need to use it for that, but the main Ionic tool (the CLI) is wrapped around working with Cordova projects. You can, of course, skip this and use the UI/UX components in a mobile-optimized web page or in some other hybrid application, but the real treat here is for Cordova developers. When you mix this with the sister project <a href="http://ngcordova.com/">ngCordova</a>, the combination becomes even more powerful.
</p>

<p>
Ionic has a CLI that can be used to create a new project. It also wraps Cordova CLI commands. So for example, I can start a project with the Ionic CLI and work with my platforms and plugins as well. I can also fire off a call to the emulator from it.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ionic3.png" />
</p>

<p>
Now - my first impression of this was that it was nice to have a good way to seed a new Ionic project, but that I probably wouldn't use it much after that. On a whim though I took a look at the <code>ionic serve</code> command. Cordova has a similar command. The idea is that it fires up a HTTP server so you can test your code in a desktop browser. That's handy. But there are a number of problems with this feature. First off - you can't use the "core" www as is. You must do a build first to copy assets into an appropriate platform folder. You can get around this with Grunt of course (see my <a href="http://www.raymondcamden.com/2013/11/7/Using-Grunt-to-automatically-build-your-PhoneGapCordova-projects">example</a>), but it isn't necessarily ideal.
</p>

<p>
Ionic's serve command handles this <i>much</i> better in my opinion. First off - it allows you to edit code in www and see it reflected immediately. And by immediately, I mean immediately. Upon running <code>ionic serve ios</code>, the CLI will actually open a new tab for you, load your app, and constantly monitor your file system for changes. As soon as you edit something, it automatically reloads the tab. Again, this is all stuff you could do with Grunt, but Ionic has it out of the box.
</p>

<p>
So, that's a lot of talk about what Ionic is. Now let me switch gears and talk about the project I built. Please note that I'm attaching the entire project as a zip attachment to this blog entry. But more important than that, <strong>please remember I am new to Angular and Ionic!</strong> What you will see here is most likely <strong>not</strong> optimal code!
</p>

<p>
For my project I decided to rebuild my INeedIt application. This is an application I've built a few times now. First in Flex Mobile. Then Backbone, and most recently in Angular <a href="http://www.raymondcamden.com/2014/1/14/AngularJS-Doesnt-Suck">back in January</a> of this year. The application is rather simple. It figures out your location and then uses the Google Places API to let you know what businesses are nearby. My most recent version used <a href="http://goratchet.com/">Ratchet</a> for a UI framework. Since the previous version was built in Angular, I was curious how much would directly port over and how much I'd need to tweak for Ionic.
</p>

<p>
For the most part, my Controller layer did not change at all. I did switch to using a StateProvider, which isn't an Ionic thing but an Angular thing, and while a bit weird at first, it kind of makes sense now. Smarter folks than me said this is the "right" way to do routing in Angular and I'm fine with that. 
</p>

<p>
The real changes were at the view level. I removed all calls to Ratchet's CSS and began building as much as I could with Ionic. In general, this wasn't a big deal. As I mentioned above, sometimes it was a bit difficult to figure out the right CSS arguments for a directive. Also, Ionic has bugs. Shocking, I know, but for example, my list view needed to include some additional code to work around inset lists being broken. Here is that list. Note the div essentially replicates the ion-list tag.
</p>

<pre><code class="language-markup">&lt;ion-view title=&quot;INeedIt&quot;&gt;
	
	&lt;ion-content&gt;
		&lt;div class=&quot;list list-inset&quot;&gt;
		&lt;ion-list class=&quot;list list-inset&quot;&gt;

			&lt;ion-item ng-repeat=&quot;service in services&quot; href=&quot;#&#x2F;service&#x2F;{% raw %}{{service.id}}{% endraw %}&quot;&gt;
				{% raw %}{{service.label}}{% endraw %}
			&lt;&#x2F;ion-item&gt;

		&lt;&#x2F;ion-list&gt;
		&lt;&#x2F;div&gt;
	&lt;&#x2F;ion-content&gt;	

&lt;&#x2F;ion-view&gt;</code></pre>

<p>
Of course, the nice thing about working within Angular is that as soon as this particular bug is fixed, it will be trivial for me to yank it out. Also, I was able to use the <a href="http://forum.ionicframework.com/">Ionic Support Forum</a> to quickly find the issue and the workaround. I had a few problems while working on my application and the response on the forum was - on average - <strong>very</strong> fast and polite. Heck, even when my issues were Angular-based, not Ionic-based, I got great support. (Not that I'd abuse it, but it is nice to know that the folks there recognize that developers like me may run into issues that subtly cross the line from their responsibility to general Angular issues.)
</p>

<p>
Let's take a look at the screens. The initial screen is temporary while your location is loaded. After that a simple list of services is provided.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-28 at 1.22.28 PM.png" />
</p>

<p>
After selecting the service type, the Places API will then fetch results based on your location. Yes, these are real restaurants located near me.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-28 at 1.23.00 PM.png" />
</p>

<p>
When a business is selected, I show you details of the location. I decided to make use of Ionic's card view here and a cool slider gesture for pictures. Here is an example.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-28 at 1.23.12 PM.png" />
</p>

<p>
If you scroll down a tiny bit, you'll see that you can swipe those pictures left and right to see more of them.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-28 at 1.23.24 PM.png" />
</p>

<p>
How difficult was that part? Check out the code below.
</p>

<pre><code class="language-markup">
&lt;ion-slide-box show-pager=&quot;true&quot;&gt;

    &lt;ion-slide ng-repeat=&quot;photo in place.photos&quot;&gt;
        &lt;img ng-src=&quot;{% raw %}{{photo.url}}{% endraw %}&quot;&gt;
    &lt;&#x2F;ion-slide&gt;

&lt;&#x2F;ion-slide-box&gt;	
</code></pre>

<p>
Yes, <strong>that</strong> simple. I love that!
</p>

<p>
So, long story short, after being impressed with Ionic, I was happy to get a chance to build a "real", if simple, project. And while I definitely ran into hiccups, I'm <i>more</i> impressed now. I strongly urge folks to give it a shot and let me know what you think in the comments below.
</p><p><a href='https://static.raymondcamden.com/enclosures/v7.zip'>Download attached file.</a></p>