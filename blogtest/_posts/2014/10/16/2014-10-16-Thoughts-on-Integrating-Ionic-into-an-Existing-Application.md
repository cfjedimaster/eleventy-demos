---
layout: post
title: "Thoughts on Integrating Ionic into an Existing Application"
date: "2014-10-16T11:10:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2014/10/16/Thoughts-on-Integrating-Ionic-into-an-Existing-Application
guid: 5335
---

<p>
Earlier this week a user asked me a question about integrating <a href="http://www.ionicframework.com">Ionic</a> into an <strong>existing</strong> application.
</p>
<!--more-->
<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> - Do you have a resource which documents how to integrate ionic into a current Cordova/PG project ?</p>&mdash; Brian Hamana (@MobileWebApp) <a href="https://twitter.com/MobileWebApp/status/522477370369114112">October 15, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<p>
I had some thoughts on this and spent some time talking to <a href="http://devgirl.org/">Holly Schinsky</a> as well about the topic. Here are some things to consider in no particular order.
</p>

<p>
First, remember that Ionic is, at the simplest level, an Angular application with CSS and directives. These directives both simplify the use of the CSS and provide various UX features like "Pull to Refresh." The Ionic "family" (not really a term they use) contains more than that, stuff like the CLI improvements and their visual creator, etc., but we're focusing this discussion on just the end result - the application.
</p>

<p>
One option would be to just use the CSS. That would allow you to keep your current application as is and just update styling where appropriate - changing classes to ULs and DIVs etc to match the Ionic way of doing things. That won't give you any of the directives or UX stuff, but it is an option.
</p>

<p>
Another option would be to migrate your code completely. This <i>could</i> be a huge undertaking. If your current application isn't using an MVC framework of any sort then you're going to have to do a lot of breaking stuff up. I think that's an improvement in general so it is time well spent, but you should be prepared to spend that time. 
</p>

<p>
And obviously if you don't know Angular going into it, you <strong>must</strong> spend some time getting familiar with it. I am very much an Angular Newbie. I can build... things... but I have lot to learn. With that being said, I feel like I know enough to do cool stuff with Ionic. But I would not recommend trying to use Ionic with no existing Angular skills. I think one day spent doing Angular's <a href="https://docs.angularjs.org/tutorial">tutorial</a> and perusing the docs will give you at least enough context to look at Ionic, but you will want to plan time to get up to speed with Angular in general.
</p>

<p>
So what if you <i>are</i> using an existing MVC framework, like Backbone? I'm a bit rusty with Backbone but I had thought that this could perhaps make things a bit easier. You have code split into controllers and services anyway, right? But this is where Holly set me straight. She reminded me that Backbone is <i>very</i> different from Angular. I'm going to quote her here:
</p>

<blockquote>
<p>
angular is DOM extension
</p>
<p>
backbone is less rigid
</p>
<p>
angular, you have to follow certain patterns and ways of doing things, backbone you can use loosely
</p>
</blockquote>

<p>
So it may not be easier at all if you are switching from Backbone. It may be worthwhile to google "Backbone to Angular" or Ember, etc. That particular part of the process will apply to Ionic.
</p>

<p>
Do folks have any opinions on this? Please share below.
</p>