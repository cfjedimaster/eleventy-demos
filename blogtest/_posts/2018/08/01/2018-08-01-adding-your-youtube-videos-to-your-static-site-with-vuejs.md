---
layout: post
title: "Adding Your YouTube Videos to Your Static Site with Vue.js"
date: "2018-08-01"
categories: ["javascript"]
tags: ["vuejs","javascript"]
banner_image: /images/banners/yt-video-list.jpg
permalink: /2018/08/01/adding-your-youtube-videos-to-your-static-site-with-vuejs
---

Credit for this post goes to a discussion my buddy [Todd Sharp](https://recursive.codes/) and I were having. He's adding his YouTube videos to his site via server side code, and I thought it would be interesting to write up a quick JavaScript-only version of the code as well. While there are probably a bazallion libraries out there for this, I wanted to quickly mock up the idea with [Vue.js](https://vuejs.org/) for my own benefit. Also - while the JavaScript is pretty trivial, I've got a great follow-up to this post coming later in the week that shows a completely static (kinda!) way of doing this.

## Getting Your RSS URL

So the first step is getting your RSS url. My first attempt at Googling for the solution led to an older solution that was still helpful. If you go to your channel, for example, <https://www.youtube.com/user/TheRaymondCamden>, and then view source, just ctrl-f (Find) for `rssUrl`. You'll see something like this:

	"rssUrl":"https://www.youtube.com/feeds/videos.xml?channel_id=UC8KROrnEHSnnV3z5J_FoSIg"

And there's your URL. I would 100% bet that there is a simpler way of doing this, but this is what worked for me.

## Parsing the RSS

So way back in 2015 (a long time ago...), I wrote up an article on parsing RSS with JavaScript: [Parsing RSS Feeds in JavaScript - Options](https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options). My favorite option for this is still [YQL](https://developer.yahoo.com/yql/). I'm shocked it is still around considering Yahoo seems to be - I don't know - not necessarily growing - but yep, it still works. *However*, the YQL I used for parsing RSS did not work for this RSS feed. Specifically:

	select * from rss where url="https://www.youtube.com/feeds/videos.xml?channel_id=UC8KROrnEHSnnV3z5J_FoSIg"

I thought perhaps it was the equals sign, but escaping it didn't help. I tested quickly with my RSS to ensure the feature still worked in general, and it did, so I punted to just using simple XML instead. I don't mean XML parsing ala the first option in my earlier blog post, but grabbing the XML from YQL instead, which nicely parses the XML for you. The YQL for that is:

	select * from xml where url = "https://www.youtube.com/feeds/videos.xml?channel_id=UC8KROrnEHSnnV3z5J_FoSIg"

## Working with Vue.js

Ok, so now I know how to get and parse the XML from my video feed. For my first draft, I simply wanted to dump out each video as a raw object. I began with this layout:

{% raw %}
```markup
<div id="app" v-cloak>
  <div v-for="video in videos">
    {{video}}
    <hr/>
  </div>
</div>
```
{% endraw %}

Basically this will print out a JSON version of each object. Now for the JavaScript:

```js
let feed = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KROrnEHSnnV3z5J_FoSIg';

let yql = `https://query.yahooapis.com/v1/public/yql?q=select%20entry%20from%20xml%20where%20url%20%3D%20'${feed}'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
	
const app = new Vue({
  el:'#app',
  data:{
    videos:[]
  },
  created:function() {
    fetch(yql)
    .then(res => res.json())
    .then(res => {
      res.query.results.feed.forEach(o => {
        this.videos.push(o.entry);        
      });
      console.log(res.query.results.feed);
    })
  }
})
```

I've got a variable for my RSS feed and then one for the YQL URL. You can, in theory, simply change that first line to use your feed. I then do a quick `fetch` call to get the parsed XML. The result was slightly complex as you can see: `res.query.results.feed`. That was an array of objects with a key called `entry`. So to make my use a bit simpler, I make a new array of just that `entry` value. You can see the result below:

<p data-height="500" data-theme-id="0" data-slug-hash="djmvPo" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="Youtube video to HTML" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/djmvPo/">Youtube video to HTML</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Sweet!

## Adding the Pretty

Ok, so at this point, you have many options for how to display the videos. The result set includes thumbnails and links, so a non-interactive list of pictures would be fine. You could also embed a YouTube player for each video. The [docs](https://developers.google.com/youtube/player_parameters) provide guidance on this, but the basic form is:

```markup
<iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"></iframe>
```

Do note that they use `autoplay=1` which you *absolutely want to switch to 0 because autoplay is the devil, especially when displaying a bunch of videos!* This is what I came up with to display the videos. It could definitely be better:

{% raw %}
```markup
<div id="app" v-cloak>
  <h2>My Videos</h2>
  <div v-for="video in videos">
    <iframe id="ytplayer" type="text/html" width="640" height="360"
    :src="'https://www.youtube.com/embed/'+video.videoId+'?autoplay=0&origin=http://example.com'"
  frameborder="0"></iframe>
    <hr/>
  </div>
</div>
```
{% endraw %}

Note that `origin` should change to your URL for additional security, but it worked fine as is on CodePen:

<p data-height="500" data-theme-id="0" data-slug-hash="QBmpJJ" data-default-tab="result" data-user="cfjedimaster" data-pen-title="Youtube video to HTML v2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/QBmpJJ/">Youtube video to HTML v2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Let me know what you think by leaving a comment below. As I said, I've got an interesting twist on this hopefully coming up later in the week!

<i>Header photo by <a href="https://unsplash.com/photos/2uwFEAGUm6E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Noom Peerapong</a> on Unsplash</i>