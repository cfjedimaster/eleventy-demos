---
layout: post
title: "Building an offline capable mobile web site with jQuery Mobile"
date: "2011-03-12T14:03:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/03/12/Building-an-offline-capable-mobile-web-site-with-jQuery-Mobile
guid: 4155
---

Earlier this week I decided to try an experiment. Unfortunately it was not a complete success. However, I feel like I got close enough to blog about it. I got to about 90% of where I wanted to be and maybe one of my readers can help me overcome the issues I ran into.

<p>

One of the more interesting features of HTML 5 is offline support. As you can guess, this is the ability to cache and store content for use when offline. On a desktop this isn't terribly useful. Most of us have continuous high speed connections. But on a mobile device it could be incredibly useful. I thought I'd create a simple demo based on the <a href="http://www.raymondcamden.com/index.cfm/2011/3/9/Adding-driving-directions-to-a-jQuery-Mobile-web-site">mobile hotel web site</a> I built a few days ago. That site provided contact information for the hotel as well as a map and driving directions with GPS. If the user is offline, then the site won't work at all. I decided to aim for the following goals:
<!--more-->
<p>

1) At minimum, if I can view the mobile home page, contact page, and map, I could still get to the hotel if need be even if my mobile device is offline. 

<p>

2) At best, it would be cool if I could somehow know I was offline, I could hide the button that provides driving directions, then users who are offline won't be confused when they click the button and nothing happens. 

<p>

I began by doing research at <a href="http://diveintohtml5.org">Dive Into HTML5</a> - one of the best, and simplest, sites for learning about HTML 5. They have a complete section just on <a href="http://diveintohtml5.org/offline.html">offline</a> support. It was pretty helpful and I definitely recommend reading it first as I'm not going to go over every detail. Ben Nadel also has a <a href="http://www.bennadel.com/blog/1944-Experimenting-With-HTML5-s-Cache-Manifest-For-Offline-Web-Applications.htm">great post</a> on the topic. Unfortunately, this feature in general can be <b>very tricky</b>. Some of my friends heard me cursing quite a bit this week. (In fact, I think I even said at one point that if this is the future of the web than we are all doomed!) Expect difficulty debugging and quite a bit of frustration finding firm answers and support for what follows. 

<p>

The concept is simple enough. You create a file called a manifest. This manifest can define 

<p>

<ul>
<li>what is cached
<li>what is never cached
<li>and resource to use if you are offline and request something not cached
</ul>

<p>

The manifest is a simple text file. To load the manifest, you can just add this to your HTML tag.

<p>

<code>
&lt;html manifest="cache.manifest"&gt; 
</code>

<p>

Taking this knowledge, I looked at my hotel web site. It consisted of a few pages and the resources jQuery Mobile itself uses. jQuery Mobile requires two JavaScript files, a CSS file, and a few images. Not much at all. So based on this I created the following manifest file:

<p>

<code>
CACHE MANIFEST

#rev92

NETWORK:
*
CACHE:
contact.html
find.html
jquery.mobile-1.0a3.css
jquery-1.5.1.min.js
jquery.mobile-1.0a3.js
jquery.json-2.2.min.js
images/ajax-loader.png
images/form-check-off.png
images/form-check-on.png
images/form-radio-off.png
images/form-radio-on.png
images/icon-search-black.png
images/icons-18-black.png
images/icons-18-white.png
images/icons-36-black.png
images/icons-36-white.png
logo_apex.png
hotel.png
</code>

<p>

The first line, CACHE MANIFEST, is required to make things work. The NETWORK line, and this is pretty confusing, tells your web page to allow it to load anything not found in the cache. This part is - frankly - weird. Because if you forget it, and you try to load something not in the cache, the resource will <b>not load, even if you are online</b>. That seems very counterintuitive and tripped me up for a while. 

<p>

So - at this point - believe it or not - we are actually done. Kinda. If you monitor your Apache web logs you can actually see a request for your index page actually performing a HTTP request for <b>all</b> of the things list in the cache part of the manifest file. That's assuming you actually followed the directions on the <a href="http://diveintohtml5.org/offline.html">Dive into HTML5 site</a> and added the proper web server mime type for your manifest file. As a great example of how <b>extremely</b> frustrating this feature is, when I forgot to do this on my IIS server, things obviously broke. I made use of the JavaScript APIs for cache events, but get this. Apparently Firefox will notice an error with your cache manifest, <i>but won't actually report what the error was!</i> I spent about half an hour looking at the exception object because I was certain I was missing something obvious, but I wasn't ever able to determine what was wrong. Then on a whim I ran the app in Chrome. I had been using Firefox since it has a simple way to fake being offline. When I tried Chrome though I noticed it's Console automatically reported on cache events, including the error, and plainly stated that the mime type wasn't right. 

<p>

Alright, so I should now have my "minimal" offline support wanted. But what about the offline/online support? Some browsers support a flag variable <b>navigator.onLine</b>. I decided to make a function then that would hide the Google Static map as well as the button when the user is offline. Here's what I used:

<p>

<code>
function drawOnline(){
	if (navigator.onLine) {
		$("#staticMap").show();
		$("#drivingButton").show();
	} else {
		$("#staticMap").hide();
		$("#drivingButton").hide();		
	}
}
</code>

<p>

I then added code to my document.start block in order to listen for online and offline events.

<p>

<code>
$(window).bind("offline online", function() {
	drawOnline();
});
</code>

<p>

Finally, I added a call to drawOnline as well. My thinking here was that as soon as the page loaded I wanted to double check to see if the user was online. If the page was loaded from cache then I'd be able to hide the map and button right away. Here is a bigger part of my document.start block:

<p>

<code>
$(document).ready(function() {

	$(window).bind("offline online", function() {
		drawOnline();
	});

	drawOnline();	
</code>

<p>

As a reminder, the complete code for the hotel site, the original version, can be found <a href="http://www.coldfusionjedi.com/index.cfm/2011/3/9/Adding-driving-directions-to-a-jQuery-Mobile-web-site">here</a>. 

<p>

So - that's it, right? Err, well, not quite. You can try this yourself here: <a href="http://coldfusionjedi.com/demos/drivingdemo/">http://coldfusionjedi.com/demos/drivingdemo/</a>. 

<p>

In Firefox, it worked. (Again, after spending a few hours tearing my hair out with the cache manifest file.) I could hit the site, click to view the map, and then go into offline mode. Right away the map and button disappeared. Then I switched to a mobile device. This is - after all - a mobile demo. 

<p>

Results here were... disappointing. On both my Android device and my wife's iPhone, I created a shortcut to the device on the desktop. I loaded the site and clicked around a bit. I then went into Airplane mode. When I clicked the shortcut, on both devices I got a warning about being offline. Once past the warning though, it worked! I was able to click around. So that right there is pretty cool. If I was traveling and had data roaming off, I could still use the web app. 

<p>

Unfortunately, the offline/online toggle didn't work at all. My buddy Todd Sharp discovered that this is currently broken in Android. Not much I can do about that. But in theory, it should have worked on the iPhone at least. 

<p>

<b>Sigh....</b> Some days I hate computers. Right before I posted this entry I double checked on the iPhone and Android devices. Both failed to load any sub pages. Home page loaded - but none of the links. No idea why. Clearing the cache <b>and</b> the offline storage on the Android <i>did</i> make it work again. The iPhone doesn't seem to have a way to clear the offline storage and I think that's the issue there. 

<p>

I hope - despite the issues - that this is helpful for folks. I've included a complete zip of this version. If all my issues are the result of something small, and dumb, <b>please</b> call me out on it. I feel like I've got a "perfect" offline jQuery Mobile app <i>so</i> darn close and I'll be happy to do anything to get it working right!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdrivingdemo1%{% endraw %}2Ezip'>Download attached file.</a></p>