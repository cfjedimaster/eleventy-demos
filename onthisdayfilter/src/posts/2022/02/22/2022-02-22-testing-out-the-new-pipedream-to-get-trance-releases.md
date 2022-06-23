---
layout: post
title: "Testing out the new Pipedream to Get Trance Releases"
date: "2022-02-22T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/dance_music.jpg
permalink: /2022/02/22/testing-out-the-new-pipedream-to-get-trance-releases.html
description: How I built a workflow in Pipedream to alert me of new Spotify releases
---

Readers of my blog will know I'm a huge [Pipedream](https://pipedream.com) fan. I've been [blogging](https://www.raymondcamden.com/tags/pipedream) about them since I discovered them and find a way to use them for so many things now it's my natural "first stop" when I want to build a new service. 

Recently, Pipedream released a *major* overhaul to their workflow editor. This is not quite 100% complete yet, and still not the default (you can choose to edit in "v1" or "v2" versions), but it's *damn* impressive. 

The updates include

* Multi-language support, including.... PYTHON! (Yes, I love Node still but Python makes me incredibly happy.)
* Multiple triggers for a workflow
* New editing experience

That last bullet point is a bit vague, but basically, the experience of editing a workflow is incredibly enhanced in v2. My favorite change is that you can now run an individual step by itself, using previous results. What does that mean?

Imagine a workflow with a few steps:

* Hit an API and get crap
* Take the result and filter it
* Take the new result and generate a nice string
* Email that crap

You can now execute the call to the API and work on step two by itself, using the previous results again and again. I'm still learning Python and still make dumb mistakes (like forgetting to use bracket notation for dicts) so this has been *super* useful for me. 

That being said, there's still some things you can't do in the new version. For example, there's features missing from Python like the ability to end a workflow early. For me, I got around that by just plopping a Node step between two Python ones. You also can't currently share a v2 workflow. That's kind of a bummer now because I always like to share my workflows in posts like this, but I'm sure it will be around soon.

For those of you who did play with Pipedream, you can find a detailed [migration guide](https://pipedream.com/docs/migrate-from-v1/#new-builder-overview) on their docs. You can also get a better look at the updates below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/BGKuPYMNKGg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;margin:auto;margin-bottom:25px"></iframe>

Ok, so what's this about trance?

I'm a big fan of [Above &amp; Beyond](https://www.aboveandbeyond.nu/), producers of dance/trance music for over two decades. Specifically, I'm a fan of the "Group Therapy" show. While I like other productions from them (especially their acoustic stuff, yes, acoustic trance is incredibly chill), my main jam is "Group Therapy". I listen to them on Spotify and wanted a way to know when new music came out.

Spotify supports alerts for bands if you follow them, but as much as I use Spotify, I don't really use the "Follow" mechanism. Also, I specifically only care about the "Group Therapy" releases. I knew that Spotify had a really good [developer API](https://developer.spotify.com/) and I figured it would be easy to build something with Pipedream, I also thought it would be a good use-case to kick the tires a bit on their new workflow editor. Here's what I built. 

## Step One - The Schedule

I don't know exactly when they put out their release - it feels like every few weeks - so I decided on a weekly schedule. I figured Monday morning would be a good time to check as it would give me a way to help kick start my week. Here's how CRON triggers look in v2. The important thing is that they're still easy to set up - now need to learn CRON's crazy (and powerful) syntax.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/gt1.jpg" alt="Screen shot of UI for editing the schedule for a trigger" class="lazyload imgborder imgcenter">
</p>

## Step Two - Spotify Search

For the second step, I added a generic Spotify step. Remember that Pipedream will handle all the authentication for you. I signed in once, added the step, and modified their code. Spotify's developer platform was _incredibly_ helpful for this. I used their console to test the Search API to craft what I needed. Specifically, search for the artist "Above and Beyond", the album "Group Therapy", and the "new" tag, which filters results to the last two weeks. "Group Therapy" releases always start with that name and end with a number. 

In the code editor, I used the following:

```js
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    spotify: {
      type: "app",
      app: "spotify",
    }
  },
  async run({steps, $}) {
    return await axios($, {
      url: `https://api.spotify.com/v1/search?q=artist%3AAbove%20%26%20Beyond%20album%3AGroup%20Therapy%20tag%3Anew&type=album&market=us`,
      headers: {
        Authorization: `Bearer ${this.spotify.$auth.oauth_access_token}`,
      },
    })
  },
})
```

Most of that code came out of the box from the Spotify action, and again, notice the `Authorization` header. Pipedream did that for me. I tested that step and then inspected the results:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/gt2.jpg" alt="Results of searching for albums on Spotify" class="lazyload imgborder imgcenter">
</p>

## Step Three - Filter the Results

The previous step will return any possible matches of "Group Therapy" from the last two weeks. I then needed a step to filter them down to items in the last week. That may be possible via the Spotify API directly, but I built a new step using Python as the SDK. As I said above, you can't end early year (as you'll see in a comment) so my workflow is a bit brittle here, but I'm ok with that.

```python
from pipedream.script_helpers import (steps, export)
from datetime import datetime

albums = steps["spotify"]["$return_value"]["albums"]["items"]

if len(albums) == 0:
  print("Ending early")
  # can't end early yet :) 

result = []

for album in albums:
    rd = datetime.strptime(album["release_date"], '%Y-%m-%d')
    now = datetime.now()
    delta = now - rd
    if delta.days <= 7:
        result.append({"name":album["name"], "image":album["images"][0]["url"], "url":album["external_urls"]["spotify"], "date":album["release_date"]})

export('result',result)
```

Basically, loop, convert the release date into a proper date object, and check the difference. For each result that's not too old, I get out the values I care about. Finally, I export the result. 

So while this is basic Python, I'm still learning, and I ended up running this step maybe 10 or so times before I got it right, but again, in the new version of the Pipedream editor, this didn't result in more calls to Spotify. It simple reused the existing results. That gave me nice consistent sample data to work with!

## Step Four - A Hack

Now - while I was ok with the brittleness above, I still wanted to actually end the workflow if I didn't have any results. It's perfectly fine to mix multiple languages in a workflow, so I added a Node.js step:

```js
export default defineComponent({
  async run({ steps, $ }) {

      // I'm just here because Python can't exit yet :) 
      if(steps.get_new_albums.result.length === 0) return $.flow.exit('No new albums.')

  },
})
```

By the way, even when Pipedream adds Python support for that, I'd still love to see a step that lets you do this without code. Not that the code is difficult, but from an architecture perspective, I think it would be nice to have a formal "flow" type step for things like this. 

## Step Five - Format Email

For my next step, I simply used a bit of Python to generate a string. This will be used for my email later:

```python
from pipedream.script_helpers import (steps, export)

msg = """
<h2>New Group Therapy Release!</h2>

<p>
Here's recent Group Therapy releases:
</p>

"""

for release in steps["get_new_albums"]["result"]:
  msg += f"""
  <p>
    <a href="{release["url"]}"><img src="{release["image"]}"></a><br/>
    <a href="{release["url"]}">{release["name"]} ({release["date"]})</a>
  </p>
  """
  
export("msg",msg)
```

## Step Six - Email

The final step just handles the email. The V1 workflow editor had an action you could add that handled this nicely, but for v2, we have to write code, and again, Node.js only, but it's fairly simple:

```js
// To use any npm package, just import it
// import axios from "axios"

export default defineComponent({
  async run({ steps, $ }) {
    $.send.email({
      subject: "New Group Therapy",
      html: steps.format_mail.msg
    });
  },
})
```

By the way, their email service supports plain text too, but as I know I'm the one getting the email, I'm fine with HTML only. And here's the result:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/gt3.jpg" alt="Sample email result from the workflow" class="lazyload imgborder imgcenter">
</p>

All in all, fairly simple, although I'm still getting used to the new editor. Also, as soon as I blog this, someone will tell me how to do this in Spotify itself without any code, but I'm fine with that. Pretty much everything I build I build for the joy of writing code! Either way, let me know what you think!

Photo by <a href="https://unsplash.com/@noiseporn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Noiseporn</a> on <a href="https://unsplash.com/s/photos/dance-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  