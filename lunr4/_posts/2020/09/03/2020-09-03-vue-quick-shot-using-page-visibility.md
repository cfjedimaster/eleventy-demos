---
layout: post
title: "Vue Quick Shot - Using Page Visibility"
date: "2020-09-03"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/09/03/vue-quick-shot-using-page-visibility
description: How to use Vue and detect when your web page is visible.
---

Back in March I did a week of quick Vue tips (you can see them all [here](https://www.raymondcamden.com/tags/vue+quick+shot/)). I really enjoyed that set of blog posts as it let me show some quick and simple "X with Vue.js" examples. To be honest, I haven't really thought about them for a while, but earlier this week a reader posted a comment on one of them and for some reason, that got the creative juices flowing again. With that in mind - I'm happy to share another Vue Quick Shot - using the Page Visibility API.

The [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) is a way to determine when a page becomes hidden based on user interaction. You can then use as a way to tell your code to stop any logic that may be particularly intensive or battery draining. Or heck, even if it's not intensive, if there's no need for it run while the user isn't looking, you should probably pause it anyway. [Browser support](https://caniuse.com/#feat=pagevisibility) is *really* good with near 100% coverage, and of course, this is yet another thing that you can add to your site without impacting any browser that doesn't support it. (And yes, even Safari supports it - thank you New IE6!) 

While the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) on the API go really deep, at a simple level you can start using it by listening for the `visibilitychange` event:

```js
document.addEventListener('visibilitychange', e => {
	// cool logic here
}, false);
```

Inside your event, you can check for `document.hidden`, which will be true if - wait for it - the content is hidden. 

Before we continue - a very important note. This API will notice when you minimize your browser or change tabs. It will *not* notice when you take another application and "cover" the web page. It would be cool if it did, but there's probably good reasons for it not supporting that. Ok, so how can we use it in Vue? First, you can add a listener when the Vue application starts:

```js
created() {
	document.addEventListener('visibilitychange', this.visibilityChange, false);
},
```

In this case, I'm running a method named `visibilityChange`:

```js
methods: {
    visibilityChange(e) {
      console.log('vis change',document.hidden);
	}
}
```

You can see a somewhat boring example of this here:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="ExKbZyy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Visibility Change 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ExKbZyy">
  Vue Visibility Change 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

To test, switch to another tab and then come back, and you'll see a text message in the output above. Two actually - one when you hid the tab and one when you came back. (Please come back.) So how about a slightly more realistic example?

I built a Vue application that makes use of an `audio` tag and an MP3 file. I added a button to control it myself:

```html
<audio src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" loop ref="audio"></audio>
<button @click="play">Play</button>
```

To control playback, I made it such that when you click play, it starts the audio. Notice it uses the `loop` attribute, that will make it last forever. To pause, you click the button again. Here's that logic:

```js
data:{
	isplaying:false
},
methods: {
	play() {
		if(this.isplaying) {
			this.$refs.audio.pause();
			this.isplaying = false;
		} else{
			this.$refs.audio.play();
			this.isplaying = true;
		}
	},
}
```

If I wanted to, I could switch the text on the button to make it more obvious, but as it stands it's workable. If you click play, the MP3 will start and keep playing. (And I apologize, it's kind of an annoying sound.) Now let's add logic to notice when the page is hidden. First, a listener in `created`:

```js
created() {
  document.addEventListener('visibilitychange', this.visibilityChange, false);
},
```

Then the method:

```js
visibilityChange(e) {
  console.log('vis change ',document.hidden);
  if(document.hidden && this.isplaying) {
    this.$refs.audio.pause();
    this.isplaying = false;
  }
}
```

Notice I'm only pausing, not playing. I could start it up again, I'd need another variable to remember that the audio was playing, but I kinda figure the user can decide if they want the music to return hen they tab back in. (But if folks want to see that, let me know!) Here's a complete CodePen:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="YzqEpoQ" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Visibility Change 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/YzqEpoQ">
  Vue Visibility Change 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

I hope you found this useful. If you did, or have any questions, leave me a comment below!
