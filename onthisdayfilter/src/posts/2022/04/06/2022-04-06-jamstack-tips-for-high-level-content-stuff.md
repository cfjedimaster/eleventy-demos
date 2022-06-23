---
layout: post
title: "Thoughts on the Jamstack and Content Metrics"
date: "2022-04-06T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/writing.jpg
permalink: /2022/04/06/thoughts-on-jamstack-and-content-metrics.html
description: Tips for getting an understanding of your site's content
---

Please forgive the (possibly) unclear title! Let me try to explain what I mean and you can then decide on whether or not you keep reading. As I was walking my dog yesterday (typically the best way to get ideas for my blog), I started thinking about the ways I keep tabs on my blog, specifically my content. This involves both the nature of my content as well as things like my publishing cadence. I've developed tools over time to help me check the status of this and I thought it might make sense to share some thoughts in this area with others. While the technical aspects of this post will use [Eleventy](https://www.11ty.dev/), it's really meant to be more generic for the Jamstack. (Although honestly, this would probably apply to *any* content site.) Hopefully, this clears things up a bit and hopefully, you're sticking around for the rest of the post!

## Understanding the Nature of Your Content - Categorization

This may seem a bit silly, especially for folks who are just starting and have a small pool of content, but after you've been around for a while and have a large set of content, it helps to understand what your content covers. There are a couple of stats you can check to help in this area.

Jamstack sites typically support a way to categorize your content, and typically via front matter. For my site, I use categories and tags. Now, Eleventy treats `tags` as a way to organize content into collections. I basically skipped this entire feature for my site as I already used tags in a descriptive way for my blog posts. So for example, here's the categorization for this post:

```html
categories: ["jamstack"]
tags: ["eleventy"]
```

One of the first tools I built for my own [stats](/stats) was to list out every category and every tag. I do this in a bit of EJS code:

```js
totalCategories = 0;
totalTags = 0;
cats = {};
tags = {};

for(post of collections.posts) {
    for(let cat of post.data.categories) {
        cat = cat.toLowerCase();
        if(!cats[cat]) cats[cat] = 0;
        cats[cat]++;
    }
    for(let tag of post.data.tags) {
        tag = tag.toLowerCase();
        if(!tags[tag]) tags[tag] = 0;
        tags[tag]++;
    }

}
```

This gives me an object containing the name of a category/tag, the count of posts. I also keep track of the total number of each. That count can be important for helping you focus I think. Now, to be fair, my blog here has been around nearly twenty years and the focus has changed. But *typically* I'd imagine a content site would try for a focused approach on some topic or general area, and therefore the total number of unique categories and tags should be kept to a "reasonable" limit. I put that in quotes because no one number will work for everyone, but I think it's an important thing to keep in mind as your content grows.

When you have a list of categories and tags with counts, you can then get a good idea of what you're covering, which again, for a brand new site is something you can do without the 'work' of gathering stats, but later on will be more difficult. It also makes it easier to find places where it may make sense to update your organization. Here's my current set of categories:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/org1.jpg" alt="List of categories and number of posts per each" class="lazyload imgborder imgcenter">
</p>

Right away I notice something interesting. While I try to keep my categories generic and my tags specific, I see I've got a `jquery` category. Most likely the posts in that category should be using `javascript` and `jquery` should be a tag. At the same time, when I first started blogging, I was almost entirely writing about ColdFusion, so I'm not sure I'd move `coldfusion` to a tag. 

As you can see, the rules here need to be flexible, but in just writing this post I've identified an optimization I can do. ([Issue filed!](https://github.com/cfjedimaster/raymondcamden2020/issues/11))

Another useful way to work with this data is by renaming. I recently renamed my "static sites" category to [Jamstack](https://www.raymondcamden.com/categories/jamstack). I used my stats to ensure I didn't miss any edits to my content.


Yet another useful thing to look for is really *low* values in stats. Whenever I look at my stats, the categories/tags with super low numbers stand out to me. Do I need to write more there? Do I need to 'migrate' that category/tag into another more appropriate area? You get the idea. 

Finally, having the stats makes it super easy to find typos:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/org2.jpg" alt="type of vuesjs tag" class="lazyload imgborder imgcenter">
</p>

Oops. 

## Understanding the Nature of Your Content - Size

By size, I mean word count obviously, although images and other media make up part of the size too. I've got a "general" word count target I go for that I think strikes a good balance between depth and simplicity - 1 to 1.5K words. I include code in that count as well because my expectation is that people read the code samples as well, and heck, sometimes that can be much more difficult reading than explanatory text. I track word count in two places.

First, in my stats, I count the words for each post and generate an average. Using the same loop as you saw above, I also count words using a simple, and definitely not 100% perfect, count of words based on spaces.

```js
for(post of collections.posts) {
    let postWords = post.templateContent.split(' ').length;
    totalWords += postWords;
    // previous stuff
}

avgWords = totalWords/collections.posts.length;
```

This currently reports an average of 366, which probably reflects the fact that for a *long* part of my blog's history, I would publish numerous small posts covering things like cool links and event announcements. This was pre-Twitter so I would regularly use my blog for very short notifications. This is most evident in the fact that in 2007, I had 825 blog posts. That's... crazy, I know. I can say that fairly recently I've decided to start doing more shorter posts. Honestly, it's near impossible to keep up on things via Twitter, and while my email audience here isn't big, it's growing. (You can sign up too - look for the form at the bottom of this post.)

Note that I also track word count while I edit using the [Word Count](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount) extension for Visual Studio Code.

## Understanding the Nature of Your Publishing Cadence

Another part of a successful content site is having a regular publishing schedule. Once again, what that means for each site will depend on the site in question, but for me, I've defined a cadence of a post a week. It's a goal and not one I care to be strict about, but I do try to make note of my cadence so I can know when I'm falling a bit too far behind. One way I do that is by checking my posts per week stats over the previous two months. Here you can see the output:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/org3.jpg" alt="List of posts per week over an 8 week period" class="lazyload imgborder imgcenter">
</p>

I also report on posts per year, which only gets interesting after a few years.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/org4.jpg" alt="List of posts per year" class="lazyload imgborder imgcenter">
</p>

The way I handle this is a mixture of build-time code in Eleventy and JavaScript code on the front end. This was *probably* not something I needed to do, but as my solution is working ok for now, I'll leave it be. On the server-side, in that same loop, I have an array of the date of every single post. Yes, all of them.

```js
dateOb = []
for(post of collections.posts) {
    // more stuff
    dateOb.push(post.date);
    // more stuff
}
```

This giant array is available in the resulting JSON as a static value. You can see this here: <https://www.raymondcamden.com/stats.json>. My client-side code creates an array of the last 8 weeks:

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

And then loops from the most current post to one that falls outside the week data:

```js
//generate 8 weeks of weeks
let weekData = generateWeekData();
// get the earliest day
let earliest = weekData[weekData.length-1].sunday;
// loop from last date until a post is before earliest
let curr = dates.length-1;
let thisDate = new Date(dates[curr]);
while(thisDate && thisDate.getTime() > earliest.getTime()) {
    // loop over our weeks and if im inside, hits++
    weekData.forEach(w => {
        if(w.sunday.getTime() < thisDate.getTime() && thisDate.getTime() < w.saturday.getTime()) w.hits++;
    });

    thisDate = new Date(dates[--curr]);
}
```

This is not terribly elegant, so honestly, I'd just say, write your own solution or heck, even hand count for the period you care about and use it as a way of judging how well you're going to your own defined cadence. 

That being said - find a schedule that works for you and try your best to stick to it. It's sets expectations for your audience and helps create regular readers.

## Last Bits...

Ok, so while not really Jamstack related, I do want to point out that your analytics are also going to be important to how you manage your content. I use Netlify Analytics but it caps out at one month of stats. Despite that, it's helped me drive content lately in terms of me updating my popular Vue articles for more vanilla JavaScript content. For tracking long-term stats, unfortunately, I have to rely on Google Analytics, which is a real pain in the rear most of the time. I recently wrote an article on [Google Analytics alternatives](https://verpex.com/blog/website-tips/exploring-alternatives-to-google-analytics) and I'd love to use either [Plausible](https://plausible.io/) or [Fathom](https://usefathom.com/), but as my blog is not 100% ad-free, it would end up being a cost for me. (Not to turn this into a pledge drive, but if anyone were to consider being a [patron](https://www.patreon.com/raymondcamden) for this blog, that is exactly what the money would go to!)

As always - there's probably a lot more I could cover, but I think I got out most of what was on my mind while walking the dog. Let me know what you think!