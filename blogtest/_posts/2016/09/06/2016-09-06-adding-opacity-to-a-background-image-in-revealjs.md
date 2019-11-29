---
layout: post
title: "Adding opacity to a background image in reveal.js"
date: "2016-09-06T14:09:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/09/06/adding-opacity-to-a-background-image-in-revealjs
---

tl;dr - use a slide state of "something" and then `html.something .slide-background {% raw %}{ opacity: 0.1 !important; }{% endraw %}`. 

I used to be a big fan of [reveal.js](https://github.com/hakimel/reveal.js), but stopped using it after a while when I ran across too many instances of having to fight it's built in styling to get what I wanted. Don't get me wrong, I loved it, and thought it was a great tool, but somethings seemed unnecessarily difficult. I switched to Powerpoint and Keynote because, frankly, it was just simpler. 

<!--more-->

For an upcoming talk ([NativeScript Developer Day](http://developerday.nativescript.org/)) I thought I'd give it a try again. Ten minutes in to working on my slide deck I ran into a problem. Reveal makes it easy to add backgrounds to slide - including colors, pictures, and videos. I used the following code to set up a slide with a background image.

<pre><code class="language-javascript">
&lt;section data-background=&quot;programming.jpg&quot;&gt;
	&lt;h1&gt;Programming&lt;&#x2F;h1&gt;
&lt;&#x2F;section&gt;
</code></pre>

And it worked, but the result was a bit hard to read:

![First version](https://static.raymondcamden.com/images/2016/09/reveal1.png)

The obvious (well, to me and my design-challenged brain) solution was to reduce the opacity on the background image. Reveal doesn't have that baked in, and when I first suggested it be added, I was directed to the "states" feature. Basically, you add `data-state="foo"` to a slide and Reveal will apply that as a class to the "document" (more on why that's in quotes in a bit) when it is active.

Ok... so that's easy:

<pre><code class="language-javascript">
&lt;section data-background=&quot;programming.jpg&quot; data-state=&quot;dimbg&quot;&gt;
</code></pre>

But then I needed to figure out how in the heck to set the opacity. As far as I know, Reveal doesn't give you directions on what CSS classes are being used to render your presentation. Certainly you can just use Dev Tools, but yeah, even than you have to dig quite a bit to figure it out. 

After some Googling, I came across the solution in a [StackOverflow post](http://stackoverflow.com/a/15327153/52160). You can address the current background like so:

<pre><code class="language-javascript">
html.something .state-background {
    background-color: rgba(0,0,0, 0.8);
}
</code></pre>

So first off, when the Reveal docs said it applied the custom CSS to the document, I had assumed `body`. I wish it had made it clear they meant the `html` tag. (Is that obvious to everyone else?)

So given that - I tried setting the opacity:

<pre><code class="language-javascript">
html.dimbg .slide-background {
	opacity: 0.2;
}
</code></pre>

And... Reveal said psyche! Yeah, I dug a bit more into Dev Tools and noticed another class applying opacity. Well, I don't know CSS very well, but I know how to make my crap take precedence:

<pre><code class="language-javascript">
html.dimbg .slide-background {
	opacity: 0.2 !important;
}
</code></pre>

Here is the result:

![Second version](https://static.raymondcamden.com/images/2016/09/reveal2.jpg)

Much better. I am a CSS God! (Ok, not really, but I'm going to pretend for a few minutes until I need to center something and begin wishing for the return of &lt;center&gt;.)