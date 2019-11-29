---
layout: post
title: "Building a Parse.com Enabled PhoneGap App - Part 4"
date: "2012-10-04T11:10:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/10/04/Building-a-Parsecom-Enabled-PhoneGap-App-Part-4
guid: 4751
---

Welcome to the fourth part of my blog series on building a <a href="http://www.parse.com">Parse.com</a> enabled <a href="http://www.phonegap.com">PhoneGap</a> application. If you haven't yet read the earlier entries in this series, please see the links at the bottom for background and the story so far. In today's entry we're going to add geolocation to the application. This will be supported both in the tip reporting mechanism as well as in the page that fetches tips.
<!--more-->
Luckily, Parse.com makes building location-aware applications very easy. In fact the code for these features are so simple you can add them within five minutes. Unfortunately, what isn't so easy is deciding <i>how</i> to use these features. I'm finding that more and more it isn't so much a problem of "How do I do X" but more "How do I X in a way that best works for my users." Consider the simple fact that geolocation can - and does - fail. What do I do? Do I let users enter an address? Do I display a small map so they can touch to select their location? What if they lie? Or what if they are just wrong? 

At the end of the day - I don't think I'm a UX (User Experience) expert. Like most folks I recognize good UX versus bad UX, but it is much harder to decide what the best choice is when building your own apps. Hopefully a year or two from now I can say, confidently, that I'm making the right decisions. For now though I'm going to struggle through it (and - of course - share these struggles with you guys). 

For now I've decided to make geolocation required. For adding a tip you will be prevented from saving the data if the geolocation check fails. For displaying tips, if we can't get your location, we don't bother getting any of the stored data. 

Let's begin by looking at the changes to the tip form page. The first thing I did was add "disabled" as an attribute to the submit button. This means the page loads with the form immediately disabled. Next, I wrote the following snippet that will execute when the Add page loads. 

<script src="https://gist.github.com/3834116.js?file=gistfile1.js"></script>

currentLocation is defined in the root of my JavaScript file so it is a global variable. If everything works well, then we simply enable the form button. Otherwise, the user gets an error.

Once we have the user's location, how do we store it? Parse.com supports what are known as <a href="https://parse.com/docs/js_guide#geo">GeoPoints</a>. Any Parse.com data type can support a geopoint, but only one geopoint. A geopoint is simply a longitude/latitude data pair. Using it is quite simple though. Consider this code taken from the form submission handler.

<script src="https://gist.github.com/3834204.js?file=gistfile1.js"></script>

Compared to our previous example, there are only two changes. First, I make an actual Geopoint with my location data. Then I simply add this value to the tip object. Remember that I said that we can - if we want - change the structure of our data at any time. After the application is released this is probably a bad idea (and I'll talk about how you can avoid that in the next entry), but for now it is pretty helpful. 

That's it for the storage aspect. Any records created with this geopoint can now be searched in new and interesting ways. If you remember, our previous code for the "get" page grabbed <i>everything</i> from the database. This was as simple as creating a query and just running find on it. I wish it were more complex. 

Here is where the beauty of Parse.com's Query system comes to play. If we want to filter the results, we can simply add more options to the object. For example, assuming I have your location, it takes <b>one line</b> to find data near you:

query.near("location", myLocation);

Seriously - that's it. In my tests this seemed to be within 50 miles or so. Oddly the <a href="https://parse.com/docs/js/symbols/Parse.Query.html#near">docs</a> for "near" do not specify exactly what near is. Near like the Sun? Near like Starbucks? I'm just not sure. However, they do provide a few alternatives. These are much more complex though. Instead of typing near, I have to type "withinMiles":

query.withinMiles("location", myLocation, 30);

Yes - I'm being a bit of an ass - but I can't stress enough how darn cool this is. (In case you don't live in a proper country with Imperial units, they also support withinKilometers.) I decided that for my application I wanted to return tips within 30 miles and reports that were no older than 7 days. Adding the date filter was three lines of code that I could have written as one:

var lastWeek = new Date();<br/>
lastWeek.setDate(lastWeek.getDate()-7);<br/>
query.greaterThan("createdAt", lastWeek);

Here's the entire logic for retrieving data on the Get page.

<script src="https://gist.github.com/3834291.js?file=gistfile1.js"></script>

You may notice that I've moved the render portion into its own function. For the mapping portion of this application I decided to try the free mapping service <a href="http://leaflet.cloudmade.com/">Leaflet</a>. Leaflet is not only free, but really easy to use too. Here's the function I use to render out to the map:

<script src="https://gist.github.com/3834305.js?file=gistfile1.js"></script>

Even if you've never seen Leaflet before, you can probably read that easily enough and see what it is doing. For each result I add a marker along with a little info window you can click to get the details. You can see an example of this below:

<img src="https://static.raymondcamden.com/images/myshot.png" />

All in all - I've now got a complete, if basic, application. Don't forget you can see the complete source code for the application at the <a href="https://github.com/cfjedimaster/CowTipLine">GitHub Repo</a> and you can download builds of the application on the <a href="https://build.phonegap.com/apps/215210/share">public PhoneGap Build</a> site.

In the next, and final, part to this series, I'm going to discuss what can, and should, be done both on the PhoneGap side as well as the Parse.com side.