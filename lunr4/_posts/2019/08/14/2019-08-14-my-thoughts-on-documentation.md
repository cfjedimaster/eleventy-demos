---
layout: post
title: "My Thoughts on Documentation"
date: "2019-08-14"
categories: ["development"]
tags: []
banner_image: /images/banners/books.jpg
permalink: /2019/08/14/my-thoughts-on-documentation
description: 
---

I am *incredibly* opinionated about technical documentation. While my degree was in English, my focus in college was technical writing. I've written over six thousand blog posts and worked on around fifteen books. I am not trying to brag about my ability (which, trust me, can always use the skill of an editor), but rather to provide some context as to why, when I'm testing a cool new utility or API, I judge it based on the level of documentation and how much care (or how little) is put into it.

With that in mind, I thought I'd share some opinions and suggestions I have in regards to developer focused documentation. I don't pretend to know everything and I'd highly encourage you to share your opinions below.

## Documentation is a Required Feature

I feel silly leading with this, but experience has shown me that developers are often fine shipping code and simply skipping the documentation. You (or your company) must develop a mindset that the feature is simply not complete until the documentation is written. You wouldn't (hopefully) ship something without a security review. Or tests. But for some reason documentation is often considered an afterthought or simply something that can be done at the last minute. 

In order to address this, make documentation part of the process. Have it reviewed just like you have code reviewed. Even better, have it reviewed by someone who didn't work on the feature. When the developer writes the docs it's far too easy for them to make assumptions about what the reader knows. You get so close to the code you don't properly understand what it may be like for a new developer just coming in.

## Balance What You Include (and When)

At one of my more recent jobs, one of the things I did while reviewing the documentation was find a lot of things to remove. The documentation for this product had stuff towards the beginning that covered the history and theory of what the product covered. It was all... factual information but also completely unnecessary and distracting from actually *learning* how to use the product. 

My goal when I'm just learning a product is to focus on the basics of how it works and what I can do with it. I don't need to know everything at once. Give me the basics, walk me through building something simple, and give me an early success to get me motivated. After that introduction it's time to get deeper.

So in abstract, this is what I like to see in the docs:

* An introduction, light weight, and a quick read.
* Installation, walk me through getting the product installed and ready to use. It is *completely* ok to focus on the simplest path and cover other methods later.
* Getting Started, a quick demo where I can see the thing in action, and as I said, get excited/motivated to do more
* Everything Else

Ok, so that last bullet is a bit broad, but in general, the topics after installation and getting started are things I may not need to read immediately or even in order. 

Consider the [Vue Router docs](https://router.vuejs.org/):

<img src="https://static.raymondcamden.com/images/2019/08/doc1.png" alt="Router doc nav" class="imgborder imgcenter">

When I was learning the Router, I focused on the first three bullet points, and actually stopped after "Dynamic Route Navigation." That literally got me to where I needed and has covered most of my usage since then. I recently needed to learn about guards so I simply skipped ahead to the part of the docs.

Now of course I should have read everything from start to finish, but let's be honest, developers don't do that. 

By focusing on the "let me get you started and running on your own" approach, the docs become so much more useful to me. And as I said, I can come back later for specific topics when the need arises.

## Code Samples

This one's a bit hard to define. Yes, developer documentation should have code samples. But there's a lot to consider when using them.

First, how much code do you include in the sample? So for example, if I wanted to demonstrate a [computed property](https://vuejs.org/v2/guide/computed.html) in Vue, this is what I'd see in the docs:

<img src="https://static.raymondcamden.com/images/2019/08/doc2.png" alt="Computed props docs" class="imgborder imgcenter">

There's the HTML needed to demonstrate the use and the JavaScript. But what's *not* there? In the HTML, we don't include the `<html>` or `<body>` tags. We don't include the script tags used to load Vue or the code.

In the JavaScript, we have the bare minimum Vue.js application in order to make it work. The JavaScript could have been shorter, perhaps just showing this:

```js
computed: {
	// a computed getter
	reverseMessage: function () {
		// stuff
	}
}
```

However by showing it in the scope of a greater application the reader sees it in a context that may be more clear.

The authors here handled this very well. You have enough context for the code to learn the feature and minimal "noise" that distracts from what is being taught. 

Unfortunately there's no magic formula here for how to do this. In general you want to keep your code listings "short" but what that means will depend on what you're trying to show and even the language itself. 

There's also the question of - should the reader be able to literally copy and paste the code? In the Vue example... they actually couldn't do that. If you copied and pasted both into one HTML file the JavaScript wouldn't work. It's missing the `<script>` tag around the JavaScript code and the `<script>` tag to load Vue. I don't think that's a failure at all, as I said I think the Vue docs here are great, but there was a conscious decision here made about what to assume the reader will know.

If you go to the [beginning](https://vuejs.org/v2/guide/index.html) of the Vue docs, they [link out](https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html) to a Gist showing a complete HTML page with all the bits in it. I may have included that on the page itself just so the reader gets one example of everything at once.

Some more nits about code samples:

* Do not use screen shots. Even if I can't copy and paste to run the code, I probably want to copy the code anyway.
* Use a nice code formatter. My favorite is [Prism](https://prismjs.com/).

## Animated Gifs are for Social Media, not Docs

See this cute animated Gif of a cat?

<img src="https://static.raymondcamden.com/images/2019/08/tenor.gif" alt="Animated cute" class="imgborder imgcenter">

Yeah, that's nice. Huge size and all but who cares about performance, right? Now imagine this animation was showing how your API works. The reader comes here, scrolls down, and catches the gif halfway. Or so they think. It's not a video so you can't see how far along they are. Oh, and they can't pause either. So they want the animated gif intently and hopefully it's perfectly clear because, remember, you can't pause or rewind or anything. 

Last week I actually ran across a site that had, I kid you not, a minute long animated gif that showed a ten step process and it was the most distracting, hard to follow flow I've ever tried to follow.

<img src="https://static.raymondcamden.com/images/2019/08/justdont.jpg" alt="Just Don't" class="imgborder imgcenter">

## Save (Most) of the Jokes

And speaking of cute graphics, including the one right above, as much as I go for a "light fun tone" in my blog posts and presentations, I actually think docs should be a bit more serious. That isn't to say they should be boring, or you can't have a humorous example, but I definitely tone things down for documentation. I also avoid pictures like the two above. It's fine for a presentation, but try to avoid it in your docs.

## Do Not Require a Login

That's it. Seriously. I know sites want user signups. It's an important user metric. But if you require me to register for your app/service before I can see the docs, I'll simply go elsewhere if I have a choice in the matter, and I usually do. 

It's fine to *suggest* a login and even better if your code samples dynamically update to reflect your personal information, such as API keys and the such.

## Let Me Help!

The final tip I have is to provide a way to give feedback on the docs. I can't tell you how many times I run across typos or other mistakes. If I see a quick way to shoot you an email on it, I will. If your docs use GitHub, then that's even better. GitHub has an *incredibly* simple UI workflow that walks you through making a fork, writing the doc change, and submitting the PR. I mean it really goes out it's way to make that process easy. Even if your company does nothing else on GitHub, I'd highly suggest using it for your docs, and depending on how you host your docs, you can even set it up such that as soon as a file is edited, or a PR of a fix accepted, it's automatically published live.

The [NativeScript-Vue](https://nativescript-vue.org) docs have an example of this. At the bottom of each page you see:

<img src="https://static.raymondcamden.com/images/2019/08/doc3.png" alt="Improve this Doc button/link" class="imgborder imgcenter">

That button takes you right to the GitHub repository page for that piece of documentation. There a user can then edit the docs to submit a quick fix.

## Hire an Editor

I've been lucky to work with editors on my blog in the past and definitely on my article and book projects. An editor helps you find things you were sure you checked for but somehow missed. Obviously this won't always be an option, especially for open source projects. But if you *can* afford a professional editor then it will *absolutely* be worth the cost.

## What Else?

Before wrapping this post, I want to point out the *excellent* resource, [Write the Docs](https://www.writethedocs.org/). Write the Docs is a site, community, set of conferences, and more all dedicated to, you guessed it, writing the docs. It's a great place to get started and meet other people working in technical documentation.
 
Ok folks, so what else would you recommend? What sites have especially good docs? Have you ever stopped using a product due to bad documentation? Share your experiences below!

p.s. Speaking of editors, my thanks go to [Brian Rinaldi](https://remotesynthesis.com/) for editing this post before I published!

<i>Header photo by <a href="https://unsplash.com/@impatrickt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Patrick Tomasso</a> on Unsplash</i>