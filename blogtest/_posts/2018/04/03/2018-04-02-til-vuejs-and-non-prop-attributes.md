---
layout: post
title: "TIL - Vue.js and Non-Prop Attributes"
date: "2018-04-03"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/code.jpg
permalink: /2018/04/03/til-vuejs-and-non-prop-attributes
---

This weekend I worked on a PR for a Vue.js component ([vue-static-map](https://github.com/eperedo/vue-static-map)) that ended up being a complete waste of time. Almost. What I mean is - I added support for something that actually ended up being a baked-in feature of Vue. So sure - I wasted a bit of time, but I also learned something and as my readers know, every time I screw up - I blog it.

Ok, so what did I do? The project I filed a PR again, [vue-static-map](https://github.com/eperedo/vue-static-map), is a wrapper for the [Google Static Maps API](https://developers.google.com/maps/documentation/static-maps/). This is one of my favorite APIs as all it consists of is an image URL with specific parameters. If you don't need an interactive Google Map and just need a - you know - a map - then the Static Maps API is perfect.

The Vue component (made by [Eduardo P. Rivero](https://github.com/eperedo)) wraps the API and makes it even simpler. However, I noticed something was missing from it - the ability to specify an `alt` or `title` tag for the image tag. So I modified his component to allow for alt and title:

```js
	props: {
		altText: {
			type: String,
			required: false,
			default: 'Static Google Map',
		},
		titleText: {
			type: String,
			required: false,
			default: 'Static Google Map',
		},
		// and so forth....
```

And that was that, right? Except I didn't realize (but luckily Eduadro did) that Vue <i>already</i> will pass in attributes that are not specifically defined in a component! And this is documented too: [Non-Prop Attributes](https://vuejs.org/v2/guide/components-props.html#Non-Prop-Attributes):

<blockquote>
A non-prop attribute is an attribute that is passed to a component, but does not have a corresponding prop defined.
<br/><br/>
While explicitly defined props are preferred for passing information to a child component, authors of component libraries can’t always foresee the contexts in which their components might be used. That’s why components can accept arbitrary attributes, which are added to the component’s root element.
</blockquote>

Which simply means that as his component uses `img` as the root element, it already supported accepting an `alt` and `title` tag. (His code did have a preset `alt` tag that he removed.) Vue is actually pretty dang smart about this too. So if your component has an existing `class` or `style` value and you pass in custom values, it will merge them instead of replacing them. You can read about this [here](https://vuejs.org/v2/guide/components-props.html#Replacing-Merging-with-Existing-Attributes). Finally, if you don't like this, you can [disable](https://vuejs.org/v2/guide/components-props.html#Disabling-Attribute-Inheritance) the behavior in your component.

All of this was documented, but something I missed, and a pleasant surprise. Want to see an example? For my last Vue.js presentation, I built a simple Nicolas Cage component. (It just wraps [PlaceCage.com](http://www.placecage.com/)). Initially I only built in support for height and width - both of which go into the URL to select the right picture. To support alt/title I don't have to do a thing. In the CodePen below, you can see where I'm using title and if you mouseover the result, it just plain works.

<p data-height="400" data-theme-id="0" data-slug-hash="oqMZQV" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="nicolas cage (testing alt/title)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/oqMZQV/">nicolas cage (testing alt/title)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<i>Header photo by <a href="https://unsplash.com/photos/OqtafYT5kTw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ilya Pavlov</a> on Unsplash</i>