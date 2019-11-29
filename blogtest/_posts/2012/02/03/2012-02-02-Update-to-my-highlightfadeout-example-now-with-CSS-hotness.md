---
layout: post
title: "Update to my highlight/fadeout example - now with CSS hotness"
date: "2012-02-03T10:02:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2012/02/03/Update-to-my-highlightfadeout-example-now-with-CSS-hotness
guid: 4517
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2012/2/2/Creating-a-highlightfadeout-text-effect-on-a-tag-cloud">posted</a> an example of highlight/fadeout effects done with jQuery. It wasn't necessarily that exciting, but it's not something I've done before so it was fun to build. Fellow evangelist (and my boss, so yeah, his comments get special attention) Kevin Hoyt <a href="http://www.raymondcamden.com/index.cfm/2012/2/2/Creating-a-highlightfadeout-text-effect-on-a-tag-cloud#c83DEA5A5-0E00-001F-606D0CD5790170A1">commented</a> that what I had achieved would be possible with CSS and transitions.
<!--more-->
<p>

Now - I will admit to being a bit codependent on jQuery. It's not like I'm addicted. I can stop using jQuery whenever I want to. In fact, I went out of my way to in <a href="http://www.raymondcamden.com/index.cfm/2012/1/27/A-look-at-JavaScript-Form-Validation">this post</a>. I love jQuery, but I can definitely recognize that I'm almost depending on it like a crutch, so I thought I'd take the opportunity to try it with pure CSS.

<p>

Before even approaching the idea of an animation, I thought I'd try a simple hover. That turned out to be trivial:

<p>

<code>
.tagcloudword {% raw %}{ opacity: 0.5; }{% endraw %}

.tagcloudword:hover {
     opacity:1;
     font-weight: bold;
}
</code>

<p>

That worked well enough where even if everything else I did failed, I'd be ok. Notice I also added the bold there to make it a bit more fancy. You can try this here: <a href="http://www.raymondcamden.com/demos/2012/feb/3/take2.html">http://www.raymondcamden.com/demos/2012/feb/3/take2.html</a>

<p>

I knew next to nothing about animation and transitions in CSS, but quickly found the docs at MDN to be incredibly useful. Begin with their CSS page: <a href="https://developer.mozilla.org/en/CSS">https://developer.mozilla.org/en/CSS</a>. They've got a page on <a href="https://developer.mozilla.org/en/CSS/CSS_animations">animations</a> and <a href="https://developer.mozilla.org/en/CSS/CSS_transitions">transitions</a>. Obviously transitions are what we want here. 

<p>

I won't try to replicate the excellent docs over at MDN, but the basic gist of it seems to be this:

<p>

<ul>
<li>Define your CSS for the item.
<li>Define your CSS for the hover.
<li>Then tell the CSS what properties are changing, how it changes (from a list of options like ease-in), and the duration.
</ul>

<p>

The only thing missing from the docs that may trip you up is the use of vendor prefixes. MDN focuses on what works for them - the moz prefix. For Chrome, I had to add webkit as well. This means you have to duplicate your code, which is kinda sucky, but passable. So here was my first update:

<p>

<code>
	.tagcloudword {
        opacity: 0.1;
        -webkit-transition: opacity;
        -webkit-transition-timing-function: ease-out;
        -webkit-transition-duration: 2000ms;
        -moz-transition: opacity;
        -moz-transition-timing-function: ease-out;
        -moz-transition-duration: 2000ms;
    }

    .tagcloudword:hover {
        opacity: 1;
        -webkit-transition: opacity;
        -webkit-transition-timing-function: ease-out;
        -webkit-transition-duration: 2000ms;
        -moz-transition: opacity;
        -moz-transition-timing-function: ease-out;
        -moz-transition-duration: 2000ms;
    }
</code>

<p>

That's a lot of code, but if you ignore the moz lines it's really just 3 lines per state. Something else not immediately obvious to me was that if you define the transitions on hover and <b>not</b> on the core style block, you won't get an animation backwards from your hover state. You can demo this here: <a href="http://www.raymondcamden.com/demos/2012/feb/3/test3.html">http://www.raymondcamden.com/demos/2012/feb/3/test3.html</a> Be sure to notice that I slowed the transition down quite a bit to make it more obvious. I'd probably use 500ms instead. 

<p>

Ok - finally. So how about multiple changes? Just add additional properties. Here's how I added some color too. In Chrome it seems to work really well. It goes from black to blood red to a pure red. (Don't hate me for color choices.)

<p>

<code>
	.tagcloudword {
        opacity: 0.1;
        color: black;
        -webkit-transition: opacity,color;
        -webkit-transition-timing-function: ease-out;
        -webkit-transition-duration: 2000ms;
        -moz-transition: opacity,color;
        -moz-transition-timing-function: ease-out;
        -moz-transition-duration: 2000ms;
    }

    .tagcloudword:hover {
        opacity: 1;
        color: red;
        -webkit-transition: opacity,color;
        -webkit-transition-timing-function: ease-out;
        -webkit-transition-duration: 2000ms;
        -moz-transition: opacity,color;
        -moz-transition-timing-function: ease-out;
        -moz-transition-duration: 2000ms;
    }
</code>

<p>

You can view this one here: <a href="http://www.raymondcamden.com/demos/2012/feb/3/test4.html">http://www.raymondcamden.com/demos/2012/feb/3/test4.html</a>

<p>

It works in Chrome and Firefox. In IE9 it is <i>not</i> supported, but it fails ok. You still get a hover effect.