---
layout: post
title: "Adding a Last Edited Field to Eleventy"
date: "2020-02-06"
categories: ["javascript","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/calendar1.jpg
permalink: /2020/02/06/adding-a-last-edited-field-to-eleventy
description: How to add a "Last Edited" value to Eleventy pages.
---

Let me begin by asking for some patience here as this post may ramble a bit. It certainly ended up going in directions I didn't expect when I built my proof of concept. If anything doesn't make sense, or I may some silly mistake, absolutely leave me a quick comment below and let me know. Alright, so with that out of the way, what in the heck am I writing about today? 

Next week I'm going to be giving a [presentation](https://cfe.dev/events/flashback-conference-2020/) at Flashback Conference in Orlando about the "dynamic" web. As part of my presentation I talk about [Apache Server Side Includes](https://httpd.apache.org/docs/current/howto/ssi.html). This was a *very* early way to add some dynamic capabilities to HTML pages. One of the examples given is to include the date the page was last modified. If you're curious, it looked like so:

```html
This document last modified <!--#flastmod file="index.html" -->
```

It occurred to me that you really don't see this much anymore on the web. Early on though it was pretty common for web pages to document when they last changed. That being said, it actually seems like a *really* good idea for technical documentation. 

I thought I'd check and see how this could be accomplished with Eleventy. I was also curious if this could be automatic. So for example, if I edit `docs/lightsaber.md` then I'd like the published site to be able to access the edit time by looking at the file's metadata.

So, first off, every Eleventy page has [data](https://www.11ty.dev/docs/data/) automatically included in a `page` scope. Included in this is a `date` value you could use: `{% raw %}{{ page.date }}{% endraw %}`

The docs have this to say about it:

<blockquote>
The date associated with the page. Defaults to the content’s file created date but can be overridden. Read more at Content Dates.
</blockquote>

As it defaults to the created date, this wouldn't work for me, but I was curious to see it in action anyway so I built up a quick demo. I made a new site, added a folder called `docs`, and configured it as a new collection:

```js
eleventyConfig.addCollection("docs", function(collection) {
	return collection.getFilteredByGlob("docs/*.md").sort((a,b) => {
		if(a.data.title < b.data.title) return -1;
		if(a.data.title > b.date.title) return 1;
		return 0;
	});
});
```

I then added a few files and used a layout:

```html
---
layout: doc
title: Apple
---

This is about apple.
```

My doc layout has this:

```html
---
layout: layout
---

{% raw %}{{ content }}{% endraw %}

<footer>
This document was last updated {% raw %}{{ page.date }}{% endraw %}.
</footer>
```

I fired up my Eleventy server and hit my doc pages and confirmed they rendered right. I then modified one doc page, reloaded, and noticed something odd. Every single doc page had a new value for their date!

I mentioned this in [Slack](https://join.slack.com/t/thenewdynamic/shared_invite/enQtMjkwNjYwNTY0NjkxLWI1NDhlNjZkZjA5ZGJmODE1OThiMjkwN2ZkMzE1YjEwN2YwNWUxYTNjZTUxMGQ2MzU3NWQ0YmVjNGU1NTkxMDk) (that's a great place to talk JAMStack stuff!) and I was reminded that when you edit content in Eleventy, it will rebuild the entire site on each change. (This [may change](https://github.com/11ty/eleventy/issues/108) with a command line flag.) 

Alright, so now it made sense. Given two doc pages, every time I edited one, then both were recreated. But then I saw something odd.

Imagine two doc pages, `apple.md` and `banana.md`. Both were made at 10AM. I edited `banana.md` sometime later. When I generated my site, I saw that the resultant HTML files appeared to be using the last modified value, not the creation time. In other words, I expected both to have the same date (or within miliseconds), but `banana/index.html` clearly had a later value.

So in theory kind of working like I wanted, but I didn't quite trust it. I quickly looked up how to get information about a file from the operating system and noticed something odd - apparently it had no "creation" value.

<img src="https://static.raymondcamden.com/images/2020/02/date1.png" alt="Output from the CLI showing no birth" class="imgborder imgcenter">

I'm using Ubuntu via WSL on Windows, so I quickly checked what Windows had to say, and it clearly had a value:

<img src="https://static.raymondcamden.com/images/2020/02/date2.png" alt="Windows Explorer file info" class="imgborder imgcenter">

I did some digging and it looks like it might be this: [When is Birth Date for a file actually used?](https://askubuntu.com/questions/918300/when-is-birth-date-for-a-file-actually-used)

So if there is something with the operating system, my next question, does Eleventy try to get the creation date, fail, and then go to the last updated value? I filed an [issue](https://github.com/11ty/eleventy/issues/900) asking about that and I'm waiting to hear back.

Ok, still with me? Keeping in mind that I knew this wasn't the best approach, I did one more test. I put my code in a repository, added it to Netlify, and checked the result. On Netlify, the values for every doc page were the same. If I edited one doc, committed the change, and waited for Netlify to build it, I saw the same thing. Both docs had the same file and as far as I could tell, it was the "created" value after Netlify pulled the files down. To me this felt totally right in terms of how I expected things to work and my local environment was just... wrong. Kinda.

The next step than was to put the onus on the writers to include a date. That isn't horrible at all of course, and can easily be done in frontmatter. So for example:

```html
---
layout: doc
title: Apple
date: 2020-02-03
---
```

and

```html
---
layout: doc
title: Banana
date: 2020-02-04
---
```

When you use `date` in front matter, it overrides `page.date` as documented [here](https://www.11ty.dev/docs/dates/). You could also use your own field, like `lastEdited` or some such, and if you do, then don't forget to address it as that, not `page.whatever`. 

To make it look nicer, I added a filter as well:

```js
eleventyConfig.addFilter("dateFormat", function(value) {
	return `${value.getMonth()+1}/${value.getDate()}/${value.getFullYear()}`;
});
```

And then finally edited my layout:

```html
This document was last updated {% raw %}{{ page.date | dateFormat }}{% endraw %}.
```

You could also extend this idea a bit and support something like this:

```html
---
layout: doc
title: Banana
lastEditDate: 2020-02-04
lastEdit: Added context about how cool are cats are.
```

This example shows both a date for the edit and a message about what changed. Since you've got access to all your data in any place in Eleventy, you could build a page that collected these messages and generated a change log automatically! 

So if for some reason you want to see this in action, you can see a live view here: <https://determined-liskov-3626af.netlify.com/>. And the source may be found here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/datetest>

<i>Header photo by <a href="https://unsplash.com/@charissek?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charisse Kenion</a> on Unsplash</i>