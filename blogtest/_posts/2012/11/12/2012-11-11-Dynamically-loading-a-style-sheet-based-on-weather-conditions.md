---
layout: post
title: "Dynamically loading a style sheet based on weather conditions"
date: "2012-11-12T11:11:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/11/12/Dynamically-loading-a-style-sheet-based-on-weather-conditions
guid: 4780
---

I know what you're thinking - thank God Ray is blogging about this topic. I can't tell you the number of times clients have asked for a dynamic web site design based on the user's current weather conditions. Well, today's your lucky day! (Ok, all snark aside - I saw this asked on StackOverflow and thought it would be fun to build.)
<!--more-->
In general, the process is relatively simple:

<ul>
<li>Get the user's location (simple!)
<li>Get the weather (mostly simple, depending on the API)
<li>Load a dynamic style sheet (simple!) 
</ul>

Of course, actually designing a style sheet that adequately conveys a particular weather condition is way beyond my stylistic chops. So if you pretend for a moment that I could actually design worth a damn, then hopefully the rest of the technical bits will be interesting. Ok, let's do it.

Following the order of operations above, I began with a simple geolocation check/call.

<script src="https://gist.github.com/4060339.js?file=gistfile1.js"></script>

Hopefully none of this is too new to my readers. Due to the nature of this "feature", I don't have to worry about fallback of any sort. Users without geolocation support won't get an error nor will the site "break", they just won't get the super fancy cool color scheme that matches their weather.

The second part involves getting the weather. I decided to use <a href="http://www.wunderground.com/">Weather Underground's API</a> for this. Yahoo has a nice API as well, but doesn't support longitute/latitude weather lookups. (They do have a service to do this lookup for you, but I wanted a simpler API.) Weather Underground doesn't support CORS, but does support JSON/P. I'm not using jQuery for this, but the code to do a JSON/P call is incredibly trivial.

<script src="https://gist.github.com/4060359.js?file=gistfile1.js"></script>

Ok, now for the fun part. The Weather Underground API returns a lot of data. All I care about is a key called "weather" that contains a general description. Examples: Mostly Cloudy, Partly Cloudy, Overcast. Unfortunately, they don't bother to actually fraking document the unique values here. I decided to take a tour around the world to find various examples and apparently the entire world now is covered in cloud, much like in Star Trek 4. (Yes, the one with the whales.)

<img src="https://static.raymondcamden.com/images/trek000.jpg" />

So for now, I took a few simple values, a few guesses, and just rolled with it. I figured it would make sense to condense some conditions into each other so I built it up as a simple Switch block.

<script src="https://gist.github.com/4060465.js?file=gistfile1.js"></script>

The final part was rather simple. To load a dynamic style sheet into the browser you follow much the same pattern for doing JSON/P - simply create a new DOM item and inject it.

<script src="https://gist.github.com/4060477.js?file=gistfile1.js"></script>

Notice how each type of weather will match to a "something.css" in my css folder. To keep things simple, I added styles to the H1 and P tags. Here's cloudy.css:

<script src="https://gist.github.com/4060483.js?file=gistfile1.css"></script>

Note the use of the after pseudo-class. I use this to inject the actual weather description (or a similar one) after the h1 tag. Here's an example based on my current location:

<img src="https://static.raymondcamden.com/images/ScreenClip161.png" />

And since I have separate function, I was able to go into console and force it to the rainy version.

<img src="https://static.raymondcamden.com/images/ScreenClip162.png" />

All in all, pretty simple. You can view the complete demo here: <a href="http://www.raymondcamden.com/demos/2012/nov/12/">http://www.raymondcamden.com/demos/2012/nov/12/</a>

I liked that - but - something nagged at me. Every time you load the page the code checks your location <i>and</i> gets the weather. Surely we could cache that, right? I built up a second version that makes use of sessionStorage. I update the setup code first:

<script src="https://gist.github.com/4060519.js?file=gistfile1.js"></script>

And then stored the weatherType variable in the user's session:

<script src="https://gist.github.com/4060525.js?file=gistfile1.js"></script>

You can view this version here: <a href="http://www.raymondcamden.com/demos/2012/nov/12/index2.html">http://www.raymondcamden.com/demos/2012/nov/12/index2.html</a>