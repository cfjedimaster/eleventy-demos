---
layout: post
title: "Building a Choose Your Own Adventure site with Eleventy"
date: "2021-05-16T18:00:00"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/cyoa2.jpg
permalink: /2021/05/16/building-a-choose-your-own-adventure-site-with-eleventy
description: How I built a "Choose Your Own Adventure" style site with Eleventy
---

Growing up (a long, long time ago), I was a huge fan of the "Choose Your Own Advenure" line of books. These books all followed a basic idea. You would begin reading and quickly be given a choice. If you pick one option, you turn to a page, if you pick another you go there. You could typically do an entire read through quickly an then just back in and make different choices. There were a [huge amount](https://en.wikipedia.org/wiki/List_of_Choose_Your_Own_Adventure_books) of these published and they were known for having some pretty bizzare subjects. One even included a path that was [impossible to reach](https://io9.gizmodo.com/remember-inside-ufo-54-40-the-unwinnable-choose-your-o-1552187271) unless you cheated. (And yes, I remember doing exactly that.) These books were pretty popular years ago and in fact led to folks building [maps](https://samplereality.com/2009/11/11/a-history-of-choose-your-own-adventure-visualizations/) for the story lines and the various paths. 

Being that it was the weekend and I felt like coding something completely pointless, I thought it would be fun to build a Choose Your Own Adventue (CYOA) style Eleventy site. Now to be clear, there's nothing special in this at all. Any HTML page can link to any other, so I could simply build a bunch of pages and ensure I handle the links correctly. But I was curious if I could simplify the writing process a bit to make it easier.

I've been a gamer all my life and one thing I've done throughout my programming career is work on systems that make it easier to build games. I'm not talking about UI systems per se but more shorthands that let you focus on the creative aspect of the game. So you get an idea for your story, game, and you can quickly add it with little to no "programming" involved. (In fact, if you want to read about the code that I'm most proud of, you can take a look at this post from a decade ago: [Share Your (Code) Pride](https://www.raymondcamden.com/2010/08/13/Share-Your-Code-Pride))

Before I show the code, you can take a look at the demo here: <https://cyoa.vercel.app/>. The repo for the code is here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/cyoa>. Honestly the demo is pretty shallow so it won't take you long to explore all the 'branches' of the story.

Here's an example page from the demo:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/05/cyoa.jpg" alt="Demo page from CYOA site" class="lazyload imgborder imgcenter">
</p>

In the screen shot above, the choices presented to the user are all driven by front matter. Here's that particular page:

```html
---
title: Choice One
choices:
  - text: Eat the pie
    path: pie
  - text: Eat the apple
    path: apple
---

You picked choice one. What a great choice! You see a piece of pie and an apple in front of you. You realize
now you're kinda hungry!
```

And here's another example:

```html
---
title: Start of the Story
choices:
  - text: This is choice one
    path: one
  - text: This is choice two
    path: two
---

This is the start of the story. You've got some choices to make now!
```

The basic idea is that you create a new Markdown file (in the `pages` directory) and define an array of choice options in your front matter. I'm not a big fan of YAML, but it is simple once you learn the syntax. In this case I had to search how to define an array of objects and you can see the basic syntax above. 

With this front matter, the display is handled by a layout file. I used a directory file (`pages.json`) to save myself from having to type it in each page.

```json
{
	"layout": "page"
}
```

Finally, here's the `page.liquid` layout file.

```html
---
layout: layout
---
{% raw %}
{{ content }}

{% if choices %}

<h3>What do you choose?</h3>
<ul>
	{% for choice in choices %}
	<li><a href="/pages/{{ choice.path | slugify }}">{{ choice.text }}</a></li>
	{% endfor %}
</ul>

{% else %}

<h3>The End</h3>
<p>
Thank you for playing! 
</p>

{% endif %}
{% endraw %}
```

Notice how the `path` value from the front matter is assumed to be the URL/path of another path. Again, my thinking here was to require less typing for the writer. (I don't think the `slugify` call is necessary there but it doesn't hurt.) If no choices are provided then it's the end of the story.

And that's it. Probably not worthwhile to anyone but fun to build. Also, it got me thinking more about offloading work to Eleventy layouts and that could (hopefully) be useful in the future! 