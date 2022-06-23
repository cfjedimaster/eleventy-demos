---
layout: post
title: "Kicking Off a Pipedream Workflow on a Full Moon (Because Why Not?)"
date: "2022-05-16T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/moon.jpg
permalink: /2022/05/16/kicking-off-a-pipedream-workflow-on-a-full-moon-because-why-not.html
description: An example of how flexible Pipedream is - you can tie workflows to astronomical events!
---

File this under "You probably will never need it but...", did you know that [Pipedream](https://pipedream.com) is flexible to the point of allowing you to define *truly* customized ways to kick off workflows? How flexible? What about the ability to fire workflows on a full moon?

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/moon1.jpg" alt="Email about a full moon" class="lazyload imgborder imgcenter">
</p>

This is the email I got yesterday, and yep, I can confirm this happened:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/moon2.jpg" alt="Picture of the full moon" class="lazyload imgborder imgcenter">
</p>

[Sources](https://pipedream.com/docs/sources/) in Pipedream are anything that can start a workflow. So for example:

* "On a new file added in Google Drive..." 
* "On a new Tweet from a user..."
* "On a particular schedule"

What's cool though is that this system is open to customized sources as well. Pipedream's [docs](https://pipedream.com/docs/sources/#creating-event-sources) describe how to create custom sources from either the UI or CLI. A few months ago I was bored and thinking about the problems werewolves may have on the dating scene and it occurred to me - a simple notification system for the full moon would probably be helpful! 

Following the directions on building from the CLI, I built a CRON-based source that made use of the excellent API from [visualcrossing](https://www.visualcrossing.com/). Their [Timeline](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/) includes a lot of information but more importantly returns a `moonphase` value that goes from 0 (new moon), to 0.5 (full moon), and finally to 1 (the next new moon). 

Here's the endpoint I ended up using - I had to ask for the moon phase and also asked it to filter the result set to just the moon phase (to make it a bit speedier): 

```
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/70508/today?key=${this.visualCrossingKey}&include=moonphase&elements=moonphase
```

So how does this look inside a Pipedream source? Here's the complete code:

```js
import fetch from "node-fetch";

export default {
  name: "Full Moon",
  description: "I check the moon phase daily and emit on a full moon.",
  props: {
    timer: {
        type:"$.interface.timer",
        default: {
            cron: "0 0 * * *"
        }
    },
    visualCrossingKey:{
        type:"string",
        label:"Visual Crossing API Key",
        description:"Get your key from visualcrossing.com"
    }
  },
  async run() {
    const endpoint = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/70508/today?key=${this.visualCrossingKey}&include=moonphase&elements=moonphase`;
    let resp = await fetch(endpoint);
    let data = await resp.json();
    let moonphase = data.days[0].moonphase;
    // only emit on the full moon
    if(moonphase === 0.5) this.$emit({ fullmoon:true });
  },
};
```

The code begins with the metadata related to the source, including the name, and importantly, a `props` block where I can specify both how it works (a timer) and that it requires a key from visualcrossing. This lets me deploy the source and share it with others as my key isn't embedded in the code. 

Once deployed, I made a new workflow, configured the source with my key, and ended it with an "email" me action built by Pipedream:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/moon3.jpg" alt="Full workflow" class="lazyload imgborder imgcenter">
</p>

This is an older V1 workflow on Pipedream so I can share it here: <https://pipedream.com/@raymondcamden/email-on-full-moon-p_V9CaRmP>. While my specific example here isn't terribly useful, I hope it's a good demonstration of what's possible. Let me know what you think.