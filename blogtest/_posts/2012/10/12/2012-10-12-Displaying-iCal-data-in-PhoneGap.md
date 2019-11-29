---
layout: post
title: "Displaying iCal data in PhoneGap?"
date: "2012-10-12T13:10:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/10/12/Displaying-iCal-data-in-PhoneGap
guid: 4757
---

Yesterday a reader sent the following:

<blockquote>
Hello, my name is Josh and I have a question on a Phonegap app I will be building. They have a calendar on their website right now that has an iCal Feed. I am pretty new to iCal, but is there any tutorials you know of or tips you can give me on retrieving the iCal feed on a phonegap app using jquery mobile?? Is it even possible with javascript?
</blockquote>
<!--more-->
The answer is yes - it is absolutely <i>possible</i> to read iCal feeds with JavaScript. The only question then is how <i>difficult</i> the task is. The iCal format (<a href="http://en.wikipedia.org/wiki/ICalendar">Wikipedia Reference</a>) is a text based format. Here is a sample:

<script src="https://gist.github.com/3880142.js?file=gistfile1.txt"></script>

iCal uses line prefixes and groupings of event data. Getting an iCal file would be as simple as any other Ajax request. In fact, if you wanted to parse an iCal file on the same server you wouldn't need PhoneGap at all. 

So given that it's plain text, you can parse it yourself or look for a library. I spent the last few hours playing around with a few libraries and the results are a bit... rough.

The first I used was <a href="http://code.google.com/p/ijp/">ijp</a>. This library defines an icalParser object you can pass a string to. It sets an object in the main object called ical (which implies that it isn't thread safe, so be careful) that contains events along with other data (todos, journal entries, etc). Given this simple example:

<script src="https://gist.github.com/3880164.js?file=gistfile1.js"></script>

You get the following output (note the sample only had one event):

<img src="https://static.raymondcamden.com/images/ScreenClip141.png" />

I want to point out that the date values are not parsed into date objects. You could do so yourself (here is a good <a href="http://stackoverflow.com/questions/8657958/how-to-parse-calendar-file-dates-with-javascript">StackOverflow example</a>) but you need to decide how to handle timezones. The library does report the timezone - if any - associated with the event so that may be useful. Personally, if I see an event in some far off place and it says 6PM, I assume it's local time. I'd rather the time <i>not</i> be in my time zone.

The next one I looked at was <a href="https://github.com/thybag/JavaScript-Ical-Parser">JavaScript ICal Parser</a>. It's got more of an object-oriented type API to it. 

<script src="https://gist.github.com/3880183.js?file=gistfile1.js"></script>

Unfortunately the library seemed totally confused by the date values in the sample ICS file I had. Here's the output I got:

<img src="https://static.raymondcamden.com/images/ScreenClip142.png" />

Finally, I tried a Node package called <a href="https://npmjs.org/package/ical">ical</a>. It took me a good hour to figure out how to load a Node module as a regular client-side library (not too difficult if you follow <a href="http://requirejs.org/docs/api.html#cjsmodule">this</a> FAQ but I wish it had been a bit more verbose). Unfortunately, its output was even wonkier:

<img src="https://static.raymondcamden.com/images/ScreenClip143.png" />

All things being considered, the first library, ijp, seemed to be the best. You should be able to take that and display it as you wish. As I said, the only aspect of this that would only be possible in PhoneGap as opposed to a "regular" web site loaded on a mobile browser would be loading a remote ICS file.