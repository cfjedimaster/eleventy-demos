---
layout: post
title: "INeedIt - Simple Flex Mobile example"
date: "2011-05-15T00:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/14/INeedIt-Simple-Flex-Mobile-example
guid: 4231
---

I've been wanting to get back into Flex Mobile ever since the release of Flash Builder 4.5. Now that it's out - and now that I'm past cfObjective, I thought I'd whip up a quick demo. I still need to - you know - actually read up the docs a bit. What follows is... rough... but when it works it's kinda cool and I think it's a cool idea. Flex users please feel free to rip me a new one and help me improve the code.
<!--more-->
<p/>

A few days ago Google released an official public API for <a href="http://code.google.com/apis/maps/documentation/places/">Places</a>. The API allows you to get information about certain types of businesses based on location. So you could say, find me all the banks next to long/lat and within so many meters. Once you got the results, you could then get details. I noticed that quite a few <a href="http://code.google.com/apis/maps/documentation/places/supported_types.html">types</a> were supported by the API. I thought it might be cool to create a simple application that...

<p/>

1) Finds out where you are using Geolocation

<p/>

2) Provides a list of everything Places supports

<p/>

3) Let's you pick one and then load the results

<p/>

4) Let you pick a place to get details and call them.

<p/>

Simple enough, right? Here's what I came up with. Note that I'm using screen shots from the emulator which does not support GPS. That's kind of silly I think. I'd love to see it updated to simply mock GPS info.

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip90.png" />

<p/>

Once you select  a category, like bar, you get a list of results:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip91.png" />

<p/>

And once you click a record, I can show the address, phone number, and a map.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip93.png" />
<p/>

So - here's some issues I'd love some help with:

<p/>

<ul>
<li>The list view on my phone is too small. In the simulator it looks perfect. How can I make my list items fatter?
<li>GPS is ... weird. The Geolocation API is an event handler. Every time the GPS updates it can fire a function. I only need one GPS reading though. But get this. It always reads Lafayette even though I'm in Minneapolis. If I let it run 2 or more times it correctly updates. But when I run the app again it goes right back to Lafayette. It's like it considers Lafayette as home and doesn't refresh it. 
<li>The Google Map, as you can see above, is a bit ugly. I'm not sure why. It should be higher quality. I assume I'm using the Image component poorly.
</ul>

<p/>

And with that, some random other notes:

<p/>

<ul>
<li>The phone number is clickable. Try it. How could I style that to make it more obvious? Perhaps make it a button with the label being the number?
<li>I'm supposed to add a credit logo for Google. I'll add that before I send this to the market. There's also random items for each place you are supposed to add for attributions. I'll need to add that too to be 'legit' with the API.
</ul>

Ok - so I've attached one zip to this blog entry. The zip has 3 things in it. First is the FXP. If you have Flash Builder, you can import it. I also included a general zip of the project. That's for those of you without Flash Builder, or those who just want to use a text editor to look at the code. Finally, I included the APK you could - in theory - use to install on your phone. My app isn't signed so you will need to allow for that.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fforblogpost2%{% endraw %}2Ezip'>Download attached file.</a></p>