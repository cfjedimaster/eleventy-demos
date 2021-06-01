---
layout: post
title: "Tracking Posts by Week in Eleventy"
date: "2020-09-30"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/cal_socks.jpg
permalink: /2020/09/30/tracking-posts-by-week-in-eleventy
description: A quick hack to get the number of posts written per week in Eleventy
---

I've been running a "successful" blog for about seventeen years now. I say "successful" as the measure of success has certainly changed over the years. My posts used to get near five hundred page views each, and that's even with me blogging quite a bit more than I do now. Of course, I started blogging before Twitter existed and a lot of my posts were merely short informational notices for my readers. Nowadays the traffic isn't nearly as good and comments are way down. Some days I even want to quit. But I enjoy building things and writing about them so I'm not going to stop yet.

One of the ways I try to make my blog successful is by having a consistent schedule. I used to blog every week day. That's not really doable these days so instead I try to do at least one blog post a week. I wanted an easy way to see how well I was doing with that schedule so I decided to hack up a quick addition to my [stats](/stats) page. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/ppw.jpg" alt="Posts poer weeks stat" class="lazyload imgborder imgcenter">
</p>

This new information looks at the last eight weeks and reports on how many total posts I wrote. As of the day I'm writing this, it looks like I've got two weeks where I "failed" but honestly I'm fine with that. So, how did I build it?

Let me start off by saying that I built my [stats](/stats) page based on what I thought was important. With that being said, it's an incredibly messy bit of EJS-driven JSON (you can see the [raw code](https://github.com/cfjedimaster/raymondcamden2020/blob/master/stats.ejs) and the [output](https://www.raymondcamden.com/stats.json)) and an [HTML page](https://github.com/cfjedimaster/raymondcamden2020/blob/master/stats.html) that uses Vue.js to render the stats.

To build this new stat, I used the following logic. First, create an array of 8 "weeks" which are objects containing the Sunday and Saturday of the week:

```js
/*
I just create an array where [0].start is the Sunday of last week, [0].end is the Saturday.
I generate 8 of these with 0 being last week, 1 the week before, and so forth. 
My solution uses code from: https://stackoverflow.com/a/13682133/52160
Also https://stackoverflow.com/a/13682065/52160
*/
function generateWeekData() {
    let weeks = [];
    for(let i=0;i<8;i++) {

        let d = new Date();

        // set to Monday of this week
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);

        // set to previous Monday
        d.setDate(d.getDate() - (7*(i+1)));

        // create new date of day before
        let sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
        let saturday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()+6);

        weeks.push({sunday, saturday, hits:0});
    }
    return weeks;
}
```

As you can see, I store the two date values along with a `hits` variable set to 0. 

The next part is where it gets messy. My EJS stats file creates an array of dates for every single blog post I've created. For my blog this is a rather large array but when I tested the size in the resulting JSON file, it seemed acceptable. (And again, my stats page is mainly for me!) So given that I have an array of dates, this is what I did.

```js
//generate 8 weeks of weeks
let weekData = generateWeekData();
// get the earliest day
let earliest = weekData[weekData.length-1].sunday;
// loop from last date until a post is before earliest
let curr = dates.length-1;
let thisDate = new Date(dates[curr]);
console.log('earliest is '+earliest+' and thisDate is '+thisDate);
while(thisDate && thisDate.getTime() > earliest.getTime()) {
	console.log('thisDate',thisDate);
	// loop over our weeks and if im inside, hits++
	weekData.forEach(w => {
		if(w.sunday.getTime() < thisDate.getTime() && thisDate.getTime() < w.saturday.getTime()) w.hits++;
	});

	thisDate = new Date(dates[--curr]);
}
//copy it over now that we're done with it, don't like this I think
this.weekData = weekData;
```

Essentially - loop from the end of the date array and continue down until we start seeing dates before the earliest of my week ranges. For each date, I see if it falls inside one of the week ranges and if so, I increment hits. 

The last part is simply outputting the array in my DOM and the only thing I do special there is format it with [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). 

As always, my entire blog is up on GitHub (<https://github.com/cfjedimaster/raymondcamden2020>) and folks are free to take from it what they need!

<span>Photo by <a href="https://unsplash.com/@andrewtneel?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Andrew Neel</a> on <a href="https://unsplash.com/s/photos/week?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>