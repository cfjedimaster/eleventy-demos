---
layout: post
title: "A Great Tutorial for Webpack"
date: "2017-11-07T04:11:00-07:00"
categories: [javascript]
tags: [webpack]
banner_image: 
permalink: /2017/11/07/a-great-tutorial-for-webpack
---

Every now and then I'll blog something that I've been discussing on Twitter as a way to help those who have somehow managed to avoid becoming a Twitter user. (And trust me, you're probably better off for it.) For some time now I've been hearing about [Webpack](https://webpack.js.org/), and I've had the opportunity to meet the creator ([Sean Larkin](https://twitter.com/thelarkinn)) at a few events. However, I've not had much luck actually learning it. I tried reading the official docs once or twice and gave up quickly. To be clear, there wasn't anything wrong with the docs, they just didn't quite click for me, and I was having trouble seeing how Webpack would be useful for me.

One thing I like to make clear to people is that I don't do a lot of production work. I create content, both written and for conferences, and in general, my code is focused on illustrating how things work, explaining pain points, and the like. But I rarely do "client work" where I have to worry about process and the like. It's hard to admit all this at times but it's absolutely true as well. 

I'm in the process of learning Vue, and one of the topics I'm trying to wrap my head around is [single file components](https://vuejs.org/v2/guide/single-file-components.html). Part of the process for using these type of components is a build system of some sort. The recommended one is a webpack template and while it worked rather well for me, it bugged me that I had *zero* idea what was actually going on.

By random luck, I came across this excellent article by Joseph Zimmerman on Smashing Magazine: [Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/) For whatever reason, this article *really* made sense to me and helped clear up why (and how) I could use Webpack in my development. If you've been meaning to learn Webpack, this is where I'd start. 

I do have one warning - this code sample early in the article will no longer work:

<pre><code class="language-javascript">module.exports = {
    entry: './src/main.js',
    output: {
        path: './dist',
        filename: 'bundle.js'
    }
};
</code></pre>

Instead, change it to 

<pre><code class="language-javascript">const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
</code></pre>

As always - I hope this helps!