---
layout: post
title: "Building a Twitter Scheduling System with Pipedream and Google Sheets"
date: "2020-07-28"
categories: ["serverless","javascript"]
tags: ["pipedream"]
banner_image: /images/banners/cells.jpg
permalink: /2020/07/28/building-a-twitter-scheduling-system-with-pipedream-and-google-sheets
description: How I used Pipedream to connect Google Sheets to Pipedream
---

A few months ago, I [blogged](https://www.raymondcamden.com/2020/04/27/building-a-google-sheets-twitter-bot-with-pipedream) about how I used [Pipedream](https://pipedream.com) and Google Sheets to create a Twitter bot. The idea was simple - read a sheet - select a random row - and use that as the source of a new Tweet. I was thinking about this recently and how useful Google Sheets can be as a "light weight CMS" and figured out another interesting use case - Twitter scheduling.

So let me be clear that I know that Twitter already lets you schedule tweets. So does Tweetdeck, my preferred way of using Twitter. But I wanted to investigate how a different workflow could be used. Google Sheets provide a simple Excel-like editing experience that may be more friendly to non-developers. Also, maybe the user wants to work on a Tweet for next week, but edit it before then to make changes. To be honest, I'm not even sure if this makes sense, but I gave it a shot and I can share the results below.

First off though - I can say I spent much more time thinking about the process than I did in implementation. The final workflow is a grand total of six steps. I wrote a little over thirty lines of code total and if we ignore some of the dumb coding mistakes I made, my total development time was probably around ten minutes. That's really bad ass. I did - though - spend a lot of time thinking about how it would work and specifically made choices to simplify the process a bit. My final workflow isn't perfect, but it works. 

Alright, let's start by looking at the Google Sheet:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs1.png" alt="Google Sheet" class="lazyload imgborder imgcenter">
</p>

I've got a simple header and two columns, one for the text and one for the date. For the text, I found a cool [StackOverflow post](https://webapps.stackexchange.com/questions/76174/how-to-limit-the-length-of-data-in-a-cell-in-google-sheets) that described how to limit the size of text in a cell. I used this to prevent the user from typing too much in the text cell.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs2.png" alt="Limited size of cell" class="lazyload imgborder imgcenter">
</p>

What you can't see in the screenshot above is that it actually edited my text after I entered it to reduce the total number of characters. I didn't even know about the "note" feature of cells, but that worked pretty well! 

For the date column I applied date validation. Nice and simple.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs3.png" alt="Date validation on the cell" class="lazyload imgborder imgcenter">
</p>

All in all, I've made the sheet such that the writer should be guided to enter appropriate data. It isn't a web form with fancy hipster JavaScript, but it works. 

Now for the Pipedream part. Here is how my workflow works.

1) First, get the entire sheet. 
2) Filter to tweets in the past, and remember the oldest one.
3) Tweet that one.
4) Delete that one.

So pay attention to step 2. I may have multiple tweets in the past, but I only tweet the oldest one. My thinking was that the user would be scheduling, at most, a few per day, and typically not ones very close to others. Also, I can set up the CRON schedule of the workflow to check more often if I'm worried about having things be late. My assumption is that if the user schedules for 3PM and I'm checking every 10 minutes, that it's ok to be a few minutes late. Obviously that may be a problem and you could increase the the frequency if you wanted. 

Another reason I like this is that I could - if I choose, pause the workflow and enable it later, knowing that it will "catch up" on Tweets it missed. Now for the some details.

The first step in the workflow is the CRON trigger. As all of this is just a test mine is still turned off, but it would be simple to pick a good schedule:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs4.png" alt="CRON trigger" class="lazyload imgborder imgcenter">
</p>

For my second step, I use a trick I learned from Pipedreamer (that's not really a word) [Dylan Sathar](https://twitter.com/DylanSather) - a Node step that sets constants for use later in the workflow. My code is just this:

```js
async (event, steps) => {
	return {
  		google_sheet_id: "1y7sW4Qv9xHIA9tOXhgOtIB6yN1LegSMmf0GrlbHsSRk"
	}
}
```

Because my workflow needs to read and write to the sheet in multiple steps, I wanted to abstract out the ID of my sheet. 

My next sheet reads the data. Since my first row is a header, I skip that in my range:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs5.png" alt="Read Google Sheet step" class="lazyload imgborder imgcenter">
</p>

To be clear, that was zero code on my part. 

My next step is the "find earliest" part. I wrote this code perfectly the first time and absolutely didn't make a bunch of stupid logical issues that would be clear to anyone with average intelligence.

```js
async (event, steps) => {

// loop over all cells, if any, and filter to those before now
let earliest = new Date(3000,1,1);
let now = new Date();

let selected = -1;
let cells = steps.get_values.$return_value.values;
if(!cells) $end('No content from sheet.');

cells.forEach((v,i) => {
  let thisDate = new Date(v[1]);
  
  if(thisDate < now && thisDate < earliest) {
    earliest = thisDate;
    selected = i;
  }
});

if(selected >= 0) {
  // why the plus one? we start reading at the second row
  return {
    index: selected+1, 
    indexPlusOne: selected+2,
    text: cells[selected][0]
  };
} else $end('No values to select.');

```

Notice the two `$end` calls here to possibly end the workflow early. Outside of that it's just a loop over the values. Also note that I remember the row I selected. I need to know this to delete it later. Also note that since my selection of cells began on row 2 (1 on the API side), I need to add one to my value otherwise it will be too low. 

The next step posts the tweet. No code, took two seconds to type in the paramater:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs6.png" alt="Tweet step" class="lazyload imgborder imgcenter">
</p>

The next step removes the row. Again, no code, took four seconds to get it working, much longer than the previous step, because I didn't notice I needed to pass a sheet ID along with the spreadhseet ID.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gs7.png" alt="Remove row from Google Sheets step" class="lazyload imgborder imgcenter">
</p>

And that's it! You can see the entire workflow yourself here: <https://pipedream.com/@raymondcamden/scheduled-tweet-manager-p_jmCyaa/>. Don't forget you can fork this and play with it yourself if you want. Let me know if you've got any questions or suggestions by leaving me a comment below!

<span>Photo by <a href="https://unsplash.com/@arlandscape?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Harald Arlander</a> on <a href="https://unsplash.com/s/photos/cells?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>