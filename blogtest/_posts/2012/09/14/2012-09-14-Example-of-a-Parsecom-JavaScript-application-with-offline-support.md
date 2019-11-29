---
layout: post
title: "Example of a Parse.com JavaScript application with offline support"
date: "2012-09-14T12:09:00+06:00"
categories: [development,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/09/14/Example-of-a-Parsecom-JavaScript-application-with-offline-support
guid: 4732
---

This morning I got a seemingly innocent question from a reader:

<blockquote>
Came across your blog post on Parse + PhoneGap and wanted to get your opinion on the following use-case for that combo...

I've been exploring the possibilities of an app that essentially has a web form (similar to the contact form you've got right here, actually) that would store the resulting data via Parse. The reason being...it would be important that the app would allow a form to submit, even if there wasn't an active Internet connection available.

So, just wanted your thoughts on whether I am looking in the right direction to accomplish this. Don't have much experience in the way of iOS apps, but have to start somewhere, right?
</blockquote>
<!--more-->
I replied to him with a basic outline:

<ul>
<li>When you submit the form, hit Parse if you are online, hit WebSQL if not.
<li>When the application starts, see if you have data in WebSQL, and if you are online, push it to parse.
</ul>

That seemed simple enough, but I figured I might as well build a real demo just to prove it can be done. This is what I came up with. It's got some issues (don't we all?) but it covers the basics. As always though I'm open to suggestions for how this could be done better.

I began by creating the layout for an application. Since the reader just mentioned a form, I built the entire application around one form. I decided to build a simple UFO Report Form. It has a field for the number of UFOs, your name, and the description. I didn't make use of any UI framework but instead directed my incredible design skills at the task.

<img src="https://static.raymondcamden.com/images/ScreenClip121.png" />

Here's the HTML behind the form, just in case your curious:

<script src="https://gist.github.com/3722917.js?file=gistfile1.html"></script>

Fancy, eh? Ok, now it's time to get into the code. I'm going to tackle this piece by piece, and it may get a bit confusing, but I'll post the entire file in one chunk at the end for your perusal. 

Whether or not we are online, we need to set up the database. This is done via the WebSQL API. While this API is deprecated, it is fully supported in PhoneGap and works great in Chrome, the main browser I use for testing.

<script src="https://gist.github.com/3722935.js?file=gistfile1.js"></script>

I'm not going to detail how this works as I've covered it before (<a href="http://www.raymondcamden.com/index.cfm/2011/10/20/Example-of-PhoneGaps-Database-Support">Example of PhoneGap's Database Support</a>), but even if this is brand new to you I think you can get the idea.

After the database is set up, our application needs to upload any existing data to Parse. We're going to skip that now though and look at the basic form handling aspects of the code. 

I wrote a function to wrap my check for online/offline support. Why? I wrote this demo <i>without</i> actually building it as a PhoneGap application. It should work fine when converting into a mobile application, and at that point my wrapper function can be modified to use PhoneGap's API, but for my initial testing I just wanted to use the navigator.onLine property. Having a wrapper also let me easily add in a hack (see the commented out line) to test being offline.

<script src="https://gist.github.com/3722958.js?file=gistfile1.js"></script>

If we are online, I need to initialize Parse support. I won't repeat what is already covered in the <a href="https://parse.com/docs/js_guide">Parse JavaScript Guide</a>. Instead, this is just an example of how I initialize Parse.com with my API keys and define an object type I'm calling SightingObject (as in UFO sighting).

<script src="https://gist.github.com/3722975.js?file=gistfile1.js"></script>

Now let's look at the form handler. Remember, this needs to either save to Parse or to the database.

<script src="https://gist.github.com/3722987.js?file=gistfile1.js"></script>

This code block is a bit large, so let's break it down. The first thing I do is grab the values from the form. As mentioned in the comments, it would probably make sense to do some basic validation. Screw validation - this is a demo. Next I do some basic UI stuff to let the user know that exciting things are happening in the background (although in theory, not as exciting as the UFO in front of them). Then we have the online/offline block. I've taken the Parse logic out into another function that I'll show in a moment. The other part of the conditional simply writes it out to the database. In both cases we run a function, resetForm, that handles resetting my UI. 

Here is saveToParse. Notice how darn easy this is. Just in case it isn't obvious - this is all the code I need to store my data, permanently, in the cloud. It would only be easier if the Parse.com engineers fed me grapes and lime jello shots while I wrote the code.

<script src="https://gist.github.com/3723019.js?file=gistfile1.js"></script>

Before we get into the synchronization aspect, here is resetForm. Again, it just handles updating the UI and letting the user know something happened with their important data.

<script src="https://gist.github.com/3723031.js?file=gistfile1.js"></script>

I did some quick testing and confirmed it was working. I used Parse.com's online data browser first:

<img src="https://static.raymondcamden.com/images/ScreenClip122.png" />

I then tested offline storage. Chrome makes it easy to check since it has a database viewer built in:

<img src="https://static.raymondcamden.com/images/ScreenClip123.png" />

That's almost it. The final piece of the puzzle is handling uploading the database data. This turned out to be simple too. If we are online, we can run a SQL against the table. If anything exists, we upload it and remove it.

<script src="https://gist.github.com/3723060.js?file=gistfile1.js"></script>

That's basically it. The biggest issue with this code is that it doesn't handle a <i>change</i> to your online/offline status, specifically, if you start the application offline, save some sightings, and then become online, it won't upload the old rows. That wouldn't be too hard to fix, but I was trying to keep it simple. At minimum, the next time you run the application it will upload those old records. For folks who want to see the entire code base, simply view the gist here: <a href="https://gist.github.com/3723074">https://gist.github.com/3723074</a>

I've also included a zip attached to this blog entry. (Note that the animated gif is courtesy of jQuery Mobile.)<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fparseofflinedemo%{% endraw %}2Ezip'>Download attached file.</a></p>