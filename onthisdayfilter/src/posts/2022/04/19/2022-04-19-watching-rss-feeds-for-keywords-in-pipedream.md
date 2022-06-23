---
layout: post
title: "Watching RSS Feeds for Keywords in Pipedream"
date: "2022-04-19T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/birdfeed.jpg
permalink: /2022/04/19/watching-rss-feeds-for-keywords-in-pipedream.html
description: Using the Pipedream service to check RSS feeds for matching keywords
---

Back in the day, I used to run a website called rssWatcher. (If you want, you can read the [original launch announcement](https://www.raymondcamden.com/2004/08/24/92BEC44C-EA53-0E16-020AB91C2FD36FB7) from 2004.) The idea was simple. You would sign up, then create a list of RSS feeds and corresponding keywords. The service would check this on a schedule and let you know when a match was found. I built this in ColdFusion and I honestly don't remember when I shut it down, but it was in my mind recently and thought I'd take a stab at building a simple version of this on my favorite service, [Pipedream](https://pipedream.com). Here's how I did it.

## Step One - The Schedule

The first part to my workflow was the trigger which was a simple schedule. This defaults to once an hour, but when it comes to *most* RSS feeds, that's way overkill so I switched it to 6 hours.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss1.jpg" alt="Picture of scheduled trigger" class="lazyload imgborder imgcenter">
</p>

Honestly, once a day would probably be best for this.

## Step Two - RSS Feeds

In the next step, I need to actually gather the RSS data. Luckily, Pipedream has a built-in action for it. In fact, it's one I wrote and contributed to them: [Merge RSS Feeds](https://pipedream.com/apps/rss/actions/merge-rss-feeds). This action lets you specify any number of RSS feeds. The action will parse them all and either return a date sorted merge list of items, or return them separated by RSS feed. The default is to merge them together but I knew I'd need them separated so I set that option to false. But to be clear, this entire step was done for me. I literally just configured it!

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss2.jpg" alt="RSS Merge step" class="lazyload imgborder imgcenter">
</p>

In the example above, I merged my RSS feed, [Todd Sharp's blog](https://recursive.codes/), and [Scott Stroz](https://scottstroz.com/). I recommend subscribing and reading to *both* of their blogs - they're incredibly smart and cool developers. 

Ok, before we get into step three, just keep in mind. I've got a serverless workflow deployed that merges a dynamic list of RSS feeds on a schedule and I haven't written one line of code yet. 

## Step Three - Define the Keywords

For this step, I'm simply defining the keywords that I want to use in my search. Pipedream doesn't support the idea of workflow level properties, if it did, this would be a great place to use them. I added a code step for the express purpose of providing a UI to enter keywords and then have those values exposed later. I've also floated the idea to Pipedream of having a simpler action for this - ie, let me use the user interface to enter values and have it returned from the step. 

I added a code step and used the `props` portion to define how and I want to want to enter - an array of strings.

```js
export default defineComponent({
  props: {
    keywords: {
      type:'string[]',
      label:'Terms to search for',
      optional: false
    }
  },
  async run({ steps, $ }) {
    // Reference previous step data using the steps object and return data to use it in future steps
    return this.keywords;
  },
})
```

When editing the step, I entered 'dog' and 'cat'. You can see this both when editing (it's in the configuration) and when just viewing the step:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss3.jpg" alt="Keyword step configuration" class="lazyload imgborder imgcenter">
</p>

## Step Four - Removing Old Entries

Ok, now we get into some real code. We don't want to search against RSS items that have already been scanned once. Therefore we need a caching system. Pipedream previously shipped with a "checkpoint" system (I [blogged](https://www.raymondcamden.com/2020/04/04/using-state-in-pipedream-workflows) about this a little over two years ago!) but has recently shipped a more powerful version of state, [Data Stores](https://pipedream.com/docs/data-stores/). Data Stores are a key-value persistence system available across your entire Pipedream organization, not just one workflow, and they've got a pretty simple `get`,`set` API. 

For my workflow, I used a data store that would cache when RSS feed X was last scanned. If this cache exists, I use it as a way to filter out previous feed items. This is why I did *not* merge my RSS items above as I thought it would make it easier to handle. I created a new code step named `check_last_hit`:

```js
export default defineComponent({
   props: {
    // Define that the "db" variable in our component is a data store
    rsscache: { type: "data_store" }
  },
  async run({ steps, $ }) {

    /*
    Given my result data from parsing N rss feeds, for each one I remove items I've seen before. 
    In ds, I have a feeds object, keyed by url with a value of a date. 
    if it exists and if you have feed items PRIOR to the date, I filter em out
    */
    // Make a copy as I'm going to edit them
    let feedData = steps.rss_merge_rss_feeds.$return_value;
    for(let i=0; i<feedData.length;i++) {
      let thisFeed = feedData[i];
      let thisUrl = thisFeed.feed.feedUrl;
      let lastHit = this.rsscache.get(thisUrl);
      console.log('working on ',thisFeed.feed, 'lastHit', lastHit)
      if(lastHit) {
        let lastHitDate = new Date(lastHit);
        for(let x=feedData[i].items.length-1; x >= 0; x--) {
          let d = new Date(feedData[i].items[x].pubDate);
          console.log('compare d',d,' to ',lastHitDate)
          if(d < lastHitDate) {
            console.log('remove old item', d);
            feedData[i].items.splice(x, 1);
          }
        }
      }
    }

    return feedData;

  },
})
```

The first important part of this step is in the props. By defining a prop of type `data_store`, this will tell the Pipedream UI to ask me to specify a name of a data store to associate with the step. I named this feedCheckCache, and in code, it will be available as `rsscache`. 

Given that I have access to this now, I can loop over my feeds, see if I have ever hit it before, and use that as a way to remove items. You can see that in the `run` portion. 

Note that it makes use of the result from the 'get rss' feeds step, and step results are read only, so I make a copy of it so I can remove items from the array. 

## Step Five - Update the Cache

Ok, this could have been in the last code step, but in Pipedream I try my best to make steps as atomic and simple as possible. This makes it much easier to test (especially in their new UI which lets you test individual steps). So I added yet another code step that just sets a last cache check date of today for my feeds:

```js
export default defineComponent({
  props: {
    // Define that the "db" variable in our component is a data store
    rsscache: { type: "data_store" }
  },
  async run({ steps, $ }) {
    for(let i=0; i<steps.rss_merge_rss_feeds.$return_value.length;i++) {
      let thisFeed = steps.rss_merge_rss_feeds.$return_value[i];
      let thisUrl = thisFeed.feed.feedUrl;
      this.rsscache.set(thisUrl, new Date());
    }

  },
})
```

## Step Six - Search!

Ok, at this point, we have a date filtered set of items. Our data is an array of RSS feeds, each with a set of items. We need to search against the feeds and items for matches. Our code will search for matches in any keywords but reports every one. So if you are searching for 2 keywords and both exist, you'll get two results. That felt like a good idea to me at the time, but I could see condensing them as well. Honestly my assumption is that *usually* only one will match. Feel free to disagee. :) Here's the code:

```js
export default defineComponent({
  async run({ steps, $ }) {
    let keywords = steps.define_keywords.$return_value;
    let result = [];
    steps.check_last_hit.$return_value.forEach(feed => {
      feed.items.forEach(item => {
        // check title and content only
        keywords.forEach(k => {
          // bad to do this all the time
          k = k.toLowerCase();
          if(item.title.toLowerCase().indexOf(k) >= 0 || item.content.toLowerCase().indexOf(k) >= 0) {
                console.log('match for ',k, ' on ',item.title);
                result.push({
                  feed: feed.feed,
                  item: item, 
                  keyword: k
                });
              }
        });
      });
    });
    return result;
  },
})
```

The end result is an array of matching items. It includes the feed, the item, and the matched keyword.

## Step Seven - Mail Preparation

The last code step will simply see if it a) needs to continue (we may have no match matches) and if so, b) format text for email.

```js
export default defineComponent({
  async run({ steps, $ }) {

    // First, figure out if we need to end
    if(steps.search_for_matches.$return_value.length === 0) return $.flow.exit('No matches');
    let html = `
    <h2>RSS Watcher Search Results</h2>

    <p>The following feed items matched your search terms:</p>
    `;

    steps.search_for_matches.$return_value.forEach(match => {
      html += `
      <p>
      <strong>Title:</strong> <a href="${match.item.link}">${match.item.title}</a><br/>
      <strong>Published:</strong> ${match.item.pubDate}<br/>
      <strong>Blog:</strong> ${match.feed.title}<br/>
      <strong>Match:</strong> ${match.keyword}<br/>
      <strong>Snippet:</strong><br/>
      ${match.item.contentSnippet}
      </p>
      `
    });

    return html;
  },
})
```

For the email I used the item title, when it was published (could be formatted better), the blog, the matched keyword, and a content snippet. 

## Step Eight - Email!

For the last step I just want to send it to me via email, and luckily Pipedream has an "email me" step built in. I added it and literally just set the subject and HTML. Note that the step requires both a plain text and HTML string, and I used the same for both. That's bad, but I honestly I'm fine with it. Just keep in kind for a production workflow you would want to handle both cases.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss4.jpg" alt="Email step" class="lazyload imgborder imgcenter">
</p>

## The Result

And here's how it looks when it finds results:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss5.jpg" alt="Email result" class="lazyload imgborder imgcenter">
</p>

So - I'd love to share this workflow with you, but right now, Pipedream doesn't support sharing of V2 workflows. If anyone wants to see more details, let me know, and if you are reading this in the future (how's the jetpacks???), please let me know and I can make the workflow public. Enjoy!

Photo by <a href="https://unsplash.com/@bonniekdesign?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Bonnie Kittle</a> on <a href="https://unsplash.com/s/photos/feed?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  