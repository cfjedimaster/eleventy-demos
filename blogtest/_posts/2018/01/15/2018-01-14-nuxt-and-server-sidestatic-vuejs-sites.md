---
layout: post
title: "Nuxt and Server-Side/Static Vue.js Sites"
date: "2018-01-15"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2018/01/15/nuxt-and-server-sidestatic-vuejs-sites
---

This isn't going to be a terribly deep post, more a general FYI for those of you smart enough to stay off Twitter, but I've been looking at [Nuxt](https://nuxtjs.org/) quite a bit over the past few days and I have to say I find it really interesting. 

Nuxt describes it self with the following tag line: "Universal Vue.js Applications" Raise your hand if you read that and aren't sure what it means.

![Yep, that's me.](https://static.raymondcamden.com/images/2018/1/confusedray.jpg)

Basically, it means rendering Vue apps on the server. Now, I read that, and the first thing I think is... why? I mean I love Vue (in case it [wasn't obvious yet](https://www.raymondcamden.com/tags/vuejs)), but I wasn't convinced that I'd actually *want* to use Vue on the server. I started going through the [guide](https://nuxtjs.org/guide) and things began to click for me.

The first thing I found with Nuxt is that it generated a Node.js application for me, and in some ways, was like an alternative to [Express](https://expressjs.com/). Express has been my Node framework of choice ever since I really started using Node. Heck, Express was the main reason I actually gave Node a chance. I've seen other frameworks out there and none of them clicked with me. Using Nuxt though was an entirely different experience. Maybe it's just that I'm in a Vue state of mind now, but I found working with it enjoyable. 

One simple example of this is that I like that I don't have to build an explicit route to add a page to my application. So for example, if I want `/about` to work in Express, I'll first add the route to my JavaScript file, do some logic perhaps, and then tell it to render a file, probably using Handlebars on the server. In Nuxt, I can literally just make a page called about.vue and the route is made for me automatically. I love that. I mean, don't get me wrong, I greatly appreciate having fine grained control over routing. That's one of things I thought was cool when moving from ColdFusion, but having the simplicity back again, with Node and Vue, is compelling. 

I also like using .vue files, or as Vue calls them, [single file components](https://vuejs.org/v2/guide/single-file-components.html). Here is a rather ugly, poor example, I modified from the default source you get from the Nuxt starter template.

```markup
<template>
  <section class="container">
    <div>
      <h1 class="title">
        nuxt1 {% raw %}{{name}}{% endraw %}
      </h1>
      <h2 class="subtitle">
         <a href="/about">About</a>
      </h2>
      <ul>
        <li v-for="cat in cats"><a :href="'/cats/'+cat">{% raw %}{{cat}}{% endraw %}</a></li>
      </ul>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      name: 'Ray! ' + new Date(),
      cats:[
        'alpha',
        'beta',
        'gamma'
      ]
    }
  }
}
</script>
<style>

</style>
```

I've got my template, my page component logic, and even custom CSS (that I didn't used) all easily used. 

Nuxt also makes use of the Vue Router and Vuex all, and not just as "it's here if you want it", but "I'll make it even easier to make use of them", which I can definitely appreciate. 

You can see a stupid small demo I made with routing up on Now: https://nuxt1-xccfuoonle.now.sh/. You can view the source code (but seriously, don't, I just screwed around) here: https://nuxt1-xccfuoonle.now.sh/_src.

To make things even cooler, while Nuxt generates a Node.js application, it can *also* generate static files! Now, it isn't necessarily a "one step" process. If you use dynamic routing of any sort, you have to do a bit of work to make the static aspect work correctly, but it isn't too bad from what I can see. I plan on covering an example of this later in my blog. I went ahead and threw the static version of the previous Node app up here: https://dist-unvgubjctc.now.sh/

You can also generate a SPA (single page application) if you want. 

All in all... I'm pretty fascinated by Nuxt. As I said earlier, this is the first time since picking up Express that I've considered any other framework for my Node apps. And heck, this is the first JavaScript-based static site generator that has interested me as well. I'm going to do a few blog posts on this over the next few weeks, but as always, I'd love to hear from people already using it. Tell me your thoughts, good or bad, in the comments below. 

I'll leave you with a few links for further reading:

* [The Nuxt web site](https://nuxtjs.org/)
* [Examples of Nuxt](https://nuxtjs.org/examples)
* [Nuxt on Twitter](https://twitter.com/nuxt_js)
* [Sarah Drasner on Nuxt](https://css-tricks.com/simple-server-side-rendering-routing-page-transitions-nuxt-js/)
* [Some more links shared to me by Brian Kimball on Twitter](https://twitter.com/_BrianKimball/status/951930415555760128)