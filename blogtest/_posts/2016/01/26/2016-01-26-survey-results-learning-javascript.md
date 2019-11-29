---
layout: post
title: "Survey Results for Rebecca Murphey's Learning JavaScript Survey"
date: "2016-01-26T15:40:46-06:00"
categories: [javascript,development]
tags: []
banner_image: 
permalink: /2016/01/25/survey-results-learning-javascript
---

A few weeks back, [Rebecca Murphey](http://t.co/w58cLHiW3H) tweeted out a link to a survey she was running involving how people learn JavaScript and how it has impacted their careers.

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Have you worked on getting better at JS in the last year? I’d love your input <a href="https://t.co/qEGaIWW6ha">https://t.co/qEGaIWW6ha</a> I’ll share what I’ve learned soon!</p>&mdash; Rebecca Murphey (@rmurphey) <a href="https://twitter.com/rmurphey/status/686970717494104064">January 12, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

More recently she shared the [raw results](https://gist.github.com/rmurphey/9d154a005f46f37d2b91) as a CSV dump and I thought it would be fun to parse the results. I was genuinely interested in the data and I thought it would give me a chance to play with a JavaScript charting engine. I've taken a stab at rendering the data and I thought I'd share the results. I'll link to the demo at the end, and please note that any mistakes are entirely on my end, and not Rebecca's fault.

I began by looking into CSV parsing with JavaScript. A quick search turned up [PapaParse](http://papaparse.com/) which has an incredibly simple API. Here's what I had to do to parse the data.

<pre><code class="language-javascript">
Papa.parse("./learning-js.csv", {
	download:true,
	header:true,
	complete:function(results) {
		allData = results.data;
		doCharts();
	}	
});
</code></pre>

That's pretty darn simple. PapaParse has quite a few options so I definitely recommend checking it out. 

I then looked into charting the results. I began with [Chart.js](http://www.chartjs.org/) which was pretty and easy to use, but I couldn't figure out how to make the pie chart labels show up all the time and not just on mouse over. I found a workaround, but honestly, it just kind of bugged me that I couldn't do it easier so I punted and went over to [Chartist.js](http://gionkunz.github.io/chartist-js/index.html). Personally it was the mascot that sold me.

![Chartist](https://static.raymondcamden.com/images/2016/01/chartist.png)

The API was a bit weird in places, but I was able to get some basic charts written out. I thought the engine made some odd choices for colors. For example, a two-slice pie chart would use a red and then a near-red color. You could distinguish the slices, but they were pretty close. You can tweak the colors of course, but the *defaults* for the pie chart seemed odd in my opinion.

Anyway, here are the questions and results, taken out of my ugly demo app and positioned a bit nicer.

Have you focused specifically on improving your JS skills at any time in the last year?
--

![Chart](https://static.raymondcamden.com/images/2016/01/survey1.png)

Absolutely no surprise here.

Which resources did you use to help you learn?
--
![Chart](https://static.raymondcamden.com/images/2016/01/survey2a.png)

Kinda surprised how high blogs rank here, especially since blogs seem to be better for one offs, like, "How do I do cowbell in X", versus more broad training. Then again, maybe people need more concrete examples versus learning JavaScript at a broad level.


During your learning, which areas have been particularly challenging?
--

Just an FYI, I skipped a few question. Anyway, the chart. And I apologize, this is a big one. 

<img src="https://static.raymondcamden.com/images/2016/01/survey3a.png" target="_new"></a>

The labels are pretty much unreadable there. You can find a larger version [here](https://static.raymondcamden.com/images/2016/01/survey3_big.png). Again, just click for the "full" view. Top three issues were:

* Build tools
* Understanding how to apply things to the real world
* Lack of mentoring/guidance

Number two in that list is a particular pet peeve of mine. I've seen far too many examples that are so far removed from reality that they are near useless. (And to be fair, I've done it myself.)

Which technologies do you use in your current role?
--

![Chart](https://static.raymondcamden.com/images/2016/01/survey4.png)

Again, no real surprises here, although I would have thought Node would have been higher. I apologize for the clunkiness of some of the labels. 

How long have you been working professionally in web development?
--

![Chart](https://static.raymondcamden.com/images/2016/01/survey5.png)

Woot - I'm not the only old person in tech! I'm squarely in the 10+ years bar there. I began working with the web around 1994 or so. 

How would you rate the improvement of your JS skills in the last year?
--

![Chart](https://static.raymondcamden.com/images/2016/01/survey6.png)

This is a good chart. Well, not my design - I don't like the lack of space. What I mean is - it looks like most people are improving, and improving at least a little bit. Hey, you don't have to go from noob to demigod in one year. Baby steps is just fine.

Have you gotten a new job, a promotion, or new responsibilities since improving your JS skills?
--

![Chart](https://static.raymondcamden.com/images/2016/01/survey7.png)

I'd say that's a damn good chart too. 

The full report
--

Ok, I should clarify - this isn't a full report - I didn't chart the questions focused on the *one* resource that was best/worst. But you can view everything here: [https://static.raymondcamden.com/rmurphey/](https://static.raymondcamden.com/rmurphey/)

Please - for the love of God - do not view source. Seriously. I'm not being humble. This is absolute crap code. Thanks again to Rebecca Murphey for creating this survey. I'd strongly recommend checking out her [js-assessment](https://github.com/rmurphey/js-assessment) project as well.