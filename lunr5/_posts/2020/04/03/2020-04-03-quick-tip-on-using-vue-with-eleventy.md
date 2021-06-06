---
layout: post
title: "Quick Tip on Using Vue with Eleventy"
date: "2020-04-03"
categories: ["javascript","static sites"]
tags: ["vuejs","eleventy"]
banner_image: /images/banners/tip.jpg
permalink: /2020/04/03/quick-tip-on-using-vue-with-eleventy
description: Avoid issues with Vue code being confused for Liquid
---

Ok, so this falls into the "too obvious to blog" category, but as I've made this mistake twice now I figured I'd share. Let's say your happily working on your Eleventy site and using Liquid as your template language. Your site is done and you realize you need to add some Vue.js to a page to enhance it. That's great because Vue is *awesome* for stuff like that. In my opinion, one of the reasons it's the best client-side framework out there is because it works great both for single page applications as well as simple page enhancement tasks. Anyway, you take an existing Eleventy template and begin to enhance it:

```html
---
layout: main
---

<h1>Vue Demo</h1>

<div id="app">
	The time is {% raw %}{{ time }}{% endraw %}
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="/app.js"></script>
```

Then you write your code.

```js
const app = new Vue({
	el:'#app',
	data: {
		time:'to rock'
	}
});
```

Easy-peasy lemon squeezy. Should just work, right? So you fire up your browser and see...

<img data-src="https://static.raymondcamden.com/images/2020/04/vd1.png" alt="Browser screenshot, code isn't working" class="lazyload imgborder imgcenter">

Oh crap - where's the dynamic data? If you're like me you immediately open up devtools and if you do, you won't find an error. So what could it be?

Well, if you view source on the page, you'll see this (I removed the layout code for brevity):

```html

<h1>Vue Demo</h1>

<div id="app">
	The time is 
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="/app.js"></script>
```

Woah wait - where's the template tokens for Vue? It's at this point you (hopefully) remember that LiquidJS and Vue use *the exact same token syntax*, i.e. {% raw %}{{ and }}{% endraw %}.

Luckily, there's a few quick options. 

1) Wrap the code you want to be available in your built site with the raw and endraw tags. 

<script src="https://gist.github.com/cfjedimaster/ea6006f41307b8450ea3cde3b1223d0f.js"></script>

Yes, I switched to a Gist for this because I gave up trying to double escape the code on my own Eleventy blog. ;)

2) Given the nature of how much other code you have in your template, don't forget that Eleventy lets you use one of *many* template languages. You could switch to EJS for example. That's what I did on my blog for a template where Liquid would have been difficult to use. Or heck, if you hate yourself you could also use Pug! (Sorry, but Jade/Pug just annoys me at a deep level.)

Anyway, I hope this helps and I also *sincerely* hope I'm not the only one to have made this mistake!