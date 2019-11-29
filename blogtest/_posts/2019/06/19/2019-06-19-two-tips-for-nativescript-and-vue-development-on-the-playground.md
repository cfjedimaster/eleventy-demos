---
layout: post
title: "Two Tips for NativeScript and Vue Development on the Playground"
date: "2019-06-19"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/swings.jpg
permalink: /2019/06/19/two-tips-for-nativescript-and-vue-development-on-the-playground
description: In where I share two tips for working with the NativeScript Playground
---

Alright folks, as the title says, here's two tips to keep in mind when using the [NativeScript Playground](https://play.nativescript.org). One will be kind of ranty/angry (sorry!) and one will, I hope, really save you sometime in the future. Let's get the angry one out of the way at first!

### Save, then Save, then Save Again

One of the things I quickly discovered about the Playground is that it's possible to "lose" your projects if you don't save correctly. I filed an [issue](https://github.com/NativeScript/playground-feedback/issues/133) on this back in March when I first encountered it. Recently though I ran into a new version of this that really, really ticked me off. The bug works like this:

* Work on a project while *not* logged in
* Save the project
* Realize you didn't log in first (oops!) and log in
* Notice that the Save UI is disabled because you just saved it.
* Close tab

Guess what? The project *was* saved, but it wasn't associated with your user. You just lost your project. The simplest solution is to just ensure you always login first. If you forget though, be sure to change *something* about the project to re-enable the Save UI and then save it again. I'd recommend going into the code and adding this:

```js
// Hey Progress, fix this damn issue!
```

Heh, I did say I was a bit angry, right? To be clear, this doesn't stop me from loving the Playground. I used it for an article I just wrapped up and it was perfect for it. I just hope they (Progress) can address the issue soon.


### Errors and Damn Errors

This one really drove me batty for a while and I can't blame anyone but myself. The article I mentioned above concerns Vue, NativeScript, and navigation. I think you're going to love it when it comes out. Truly, it will change your life. But while working on it I ran into a weird issue. My demo had two pages. The first page linked to the second via the [manual routing](https://nativescript-vue.org/en/docs/routing/manual-routing) API. 

The API is super simple to use. But when I'd click to start the navigation, nothing would happen. I didn't get an error anywhere it just didn't... well navigate. 

I was basically stuck when I noticed this in the logs:

	NativeScript-Vue has "Vue.config.silent" set to true, to see output logs set it to false.

My first thought was that changing this wouldn't help. I didn't have an error it just didn't do squat. But I figured it couldn't hurt so I went ahead and uncommented this line:

```js
// Vue.config.silent = false;
```

And... voila:


	[Pixel 3 XL]: [Vue warn]: Unknown custom element: <StackView> - did you register the component correctly? For recursive components, make sure to provide the "name" option.

`StackView`? What the hell is `StackView`? Oh yeah, it was this:

```html
<template>
    <Page class="page">
		<ActionBar :title="film.title" class="action-bar" />
		<StackView height="100%">
		 <!-- stuff here -->
        </StackView>
    </Page>
</template>
```

And guess what? That's supposed to be `StackLayout`. So why didn't I get an error? Honestly I don't know. As the message above states, it would be possible for me to define my own component called `StackView` and that would be valid. However the fact that navigation failed seems like more than a warning to me. 

That being said, I'm going to (hopefully) remember to try changing the logging value in the future if I encounter weird errors like that. My "regular" errors show up just fine so I won't change it by default, but I'm definitely going try this first next time.

<i>Header photo by <a href="https://unsplash.com/@aaronburden?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Aaron Burden</a> on Unsplash</i>