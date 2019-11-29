---
layout: post
title: "Building \"Robust\" PhoneGap Applications"
date: "2013-03-18T17:03:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/03/18/building-robust-phonegap-applications
guid: 4883
---

Lately I've been thinking more about how to make my PhoneGap applications more robust. By robust, I'm not necessarily talking about performance. While that is important (see my coworker's excellent blog post on the topic: <a href="http://www.tricedesigns.com/2013/03/11/performance-ux-considerations-for-successful-phonegap-apps/">Performance & UX Considerations For Successful PhoneGap Apps</a>), I'm thinking more about the general stability of the application as a whole. This is especially important for applications that need, or desire, data only available on the network. How you handle network conditions is just as important as how you handle the UX and performance of your application. (Well, that may be up to debate. :) In this blog post I'm going to share some thoughts and examples of what I mean by this and - as always - I look forward to your comments, suggestions, and corrections.

<!--more-->

<h2>Net-Using PhoneGap Apps</h2>

It may seem silly to specify "Net-Using" PhoneGap applications, but to be clear, you are perfectly able to build a PhoneGap application that doesn't require any assets from the Internet. All of your HTML, CSS, and JavaScript can be packaged up with the application and if you have no real need to hit any remote sources, then don't! If you're used to loading the CDN version of JavaScript or CSS libraries, replace them with local copies. 

That being said, if you do need to use the Internet in your application, how can you handle network issues? PhoneGap provides two different ways to handle this.

First is the <a href="http://docs.phonegap.com/en/2.5.0/cordova_connection_connection.md.html#Connection">Connection API</a>. This isn't really an "API", but simply a constant you can check in your code to determine the connection status. There are various results that allow you to not only check for <i>any</i> connection but the relative strength of the connection. This would be useful, for example, to determine what quality of a YouTube video you want to display - standard or HD.

Here are the possible values for this constant:

<ul>
<li>Connection.UNKNOWN
<li>Connection.ETHERNET
<li>Connection.WIFI
<li>Connection.CELL_2G
<li>Connection.CELL_3G
<li>Connection.CELL_4G
<li>Connection.NONE
</ul>

One of the constant values for the Connection object is UNKNOWN. How you handle that is really up to you. In general, I think it is safer to be pessimistic and assume UNKNOWN is the same as OFFLINE, but I go back and forth on that.

The second thing PhoneGap provides is an event system that can recognize network changes. You have both an <a href="http://docs.phonegap.com/en/2.5.0/cordova_events_events.md.html#offline">offline</a> and <a href="http://docs.phonegap.com/en/2.5.0/cordova_events_events.md.html#online">online</a> event your code could listen to. 

In general, I think it makes sense for an application to check network status on startup, <b>and</b> have event listeners for changes. You can't assume that a network connection that exists when the application starts up will be there for as long as the application is alive.

In order to test this, I build an application that supports Twitter searches. If you are online, then you can enter a search term, hit the button, and see the results from the Twitter API. If you are offline, the application responds correctly. The code I used also handles your device going on and offline. Here is a portion of the code.

<script src="https://gist.github.com/cfjedimaster/5190645.js"></script>

For the most part, this should just "make sense", but definitely let me know if you have questions. (I've included the <i>entire</i> application as a zip attached to this blog entry. It really isn't much more than this, but if you want to see it, just download the bits.)

Here's an example of the application running in Ripple. Notice that I've done a search already. 

<img src="https://static.raymondcamden.com/images/screenshot79.png" />

I can now use Ripple to take my device offline. Notice that Ripple fakes an in-device notification with a simple HTML element overlaying the device.

<img src="https://static.raymondcamden.com/images/screenshot80.png" />

It may be a bit hard to see, but the button has been disabled as well. This way the user can't accidentally click it again. When network access is restored, the button will be re-enabled. 

<h2>Error Handling</h2>

Here is something that I've really done a poor job of. Many of PhoneGap's APIs, and most remote APIs, have some way of handling errors. But I'd be willing to bet most of your error handlers look something like this.

<script src="https://gist.github.com/cfjedimaster/5190717.js"></script>

Ignoring for a moment that the message is a bit rude, note that no attempt was made to diagnose the form of the error and make a logical decision as to what should be done. Not every error is a "Throw your hands up in the air and give up" exception. In many cases, it may be something that is purely temporary and you should prompt your user to try again. In other cases it may be so bad you would want your application to shut down. The main point I'd want you to take from this is to consider the types of errors you may be handling and try to react to them as nicely as possible.  If you have error gotten a weird, obtuse error in an application before and wanted to pull your hair out, keep in mind that you're a developer. Imagine what the normal people think.

Remember that JavaScript has full exception handling with <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Statements/try...catch">try/catch</a> support, the ability to <a href="https://developer.mozilla.org/en/JavaScript/Reference/Statements/throw">throw</a> your own exceptions, as well as listening for errors at the <a href="https://developer.mozilla.org/en-US/docs/DOM/window.onerror">window</a> level.

Finally, don't forget you can Lint/JSHint your code. For folks new to JavaScript that can be a bit intimidating, but if you go in with the mindset that you don't necessarily need to agree with everything the Lint/Hint says, then the experience isn't quite as jarring. Of course, if you use <a href="http://brackets.io/">Brackets</a> you get JSLint built in. (You can also find an extension for <a href="https://github.com/cfjedimaster/brackets-jshint">JSHint</a>.)

<h2>Tracking/Reporting Issues</h2>

So here's an interesting one. Imagine you've got your application making use of the CowBell API. You've got nice error handling/connection handling in place. You've made the experience great for the end user. But are you responding to these errors and events? Are you cognizant of just how often the CowBell API goes down? Maybe it isn't so bad. Maybe it is pretty crappy. But until you start getting a bunch of 1-Star reviews you may not necessarily be aware of it. 

Maybe it isn't <i>too</i> bad. For example, only 10{% raw %}% of the calls fail. That isn't terrible, but it is probably enough to warrant looking into app-side caching. You can make use of LocalStorage or the <a href="http://docs.phonegap.com/en/2.5.0/cordova_storage_storage.md.html#Storage">Storage API</a>. Heck you can use the <a href="http://docs.phonegap.com/en/2.5.0/cordova_file_file.md.html#File">File system</a> too. On the flip side, if your API has something like 100%{% endraw %} uptime and your users are in an an area with darn good coverage, it may not be worth your development time to worry about it.

The point is - how do you know?

During internal testing, you could make use of simple code that logs to a local file. You can add a temporary button to upload that file to a central server. While your users are testing, they can make use of that button then to upload their local logs when something is acting up.

Of course, you could do the same thing on a released, production application as well. How much you track and how you upload is more an ethical question than a technical one, but that option exists as well.

You can consider using a third party JavaScript error-handling solution, like <a href="http://errorception.com/">{% raw %}{errorception}{% endraw %}</a>. <b>However - I do not know if they support PhoneGap apps. When I find out, I'll edit this post.</b> I've found their results to be <i>incredibly</i> detailed and useful for my desktop apps.

<h2>What else?</h2>

So I know I'm missing other suggestions. Leave a comment below!<p><a href='/enclosures/connection.zip'>Download attached file.</a></p>