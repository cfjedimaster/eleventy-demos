---
layout: post
title: "Eleventy 1.0 - Upgrading Experience"
date: "2021-10-08T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/allthewayto11.jpg
permalink: /2021/10/08/eleventy-10-upgrading-experience.html
description: How upgrading to Eleventy 1.0 worked for my site.
---

With [Eleventy 1.0](https://www.11ty.dev/blog/eleventy-v1-beta/) coming soon, I thought I'd take a look at the experience of upgrading an existing implementation to the latest version. As I've warned, Eleventy 1.0 is still in beta so the details may change, but I figured it was safe to give it a try on my own site (the very place you're reading this post). Eleventy is shipping a [tool](https://github.com/11ty/eleventy-upgrade-help) to help with that process, and I cover that a bit later, but me being who I am I just went ahead and Leroy Jenkins the process.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mLyOj_QD4a4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

After upgrading Eleventy to the 1.0 beta (`npm i @11ty/eleventy@beta`), I fired up my local copy of this site and... bam! It crashed. Luckily though the error was nice and clear:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/upgrade1.jpg" alt="Error about unknown filter" class="lazyload imgborder imgcenter">
</p>

This error makes me very, *very* happy. What is it? The [LiquidJS](https://liquidjs.com/) template language (the primary one I use for this site, but not exclusively) is a great project, but for some reason has a default behavior that I find insane. When using a filter that doesn't exist, the default behaviour is for Liquid to ignore it. So your coworker tells you to use the cat filter in certain blocks, like so:

```html
{% raw %}Hello {{ name | cat }}
{% endraw %}
```

But it turns out you misheard them and they meant to say `kitten` filter. By default, Liquid sees the undefined filter and just does nothing. I am sure there is a valid reason for this, and it absolutely makes sense to make being strict about this an option, but I cannot fathom why it would default to *not* being strict. Turns out, I had about 5-6 cases of a filter that wasn't defined that was just silently ignored. 

So in Eleventy 1.0, they simply set the [default Liquid option](https://github.com/11ty/eleventy/issues/222) to enforce strict filters. I really like this change. It took me maybe five minutes to fix the various filters in my site that weren't working (I literally just got rid of em, I didn't need them). 

Woot! Ok, but then I had another problem: 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/upgrade2.jpg" alt="illegal filename error" class="lazyload imgborder imgcenter">
</p>

The line in question looked like so:

```html
{% raw %}
{% include footer %}
{% endraw %}
```

This issue is covered in the [Eleventy Liquid](https://www.11ty.dev/docs/languages/liquid/) docs here:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/upgrade3.jpg" alt="Warning about includes" class="lazyload imgborder imgcenter">
</p>

The solution was to just add single quotes:

```html
{% raw %}
{% include 'footer' %}
{% endraw %}
```

I had maybe ten of these around my site, but it was also a five minute fix or so.

Ok, so at this point, I was able to get things running locally just fine. As an FYI, and I don't think it would have mattered but it's nice to know, I run Eleventy locally via the Netlify CLI and Netlify Dev, and nothing in that process seemed to intefere with Eleventy 1.0. Again, I didn't *expect* there would be an issue, but it's nice to know. At this point, I decided to look at the [helper plugin](https://github.com/11ty/eleventy-upgrade-help). 

First off, I was a bit surprised the 'helper' was a plugin, as I would have imagined some kind of local script you run that looks at your code, but running in context with your site itself as a plugin makes sense too. As a regular Eleventy plugin, you simply install it and then add support to your `.eleventy.js`. While I don't think it matters if I keep it around forever, I added some helpful comments like so:

```js
// remove me
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");

// later in my file

//remove me
eleventyConfig.addPlugin(UpgradeHelper);
```

I guarantee you I'm going to forget and look into removing it sometime around Eleventy 2.0. The plugin fdocuses on a few particular items. While you can get details at the [docs](https://github.com/11ty/eleventy-upgrade-help), it checks for:

* Use of the slug filter that should now be slugify.
* Warnings about deep data merge not being turned on.
* Liquid changes (would have helped me with the stuff above!)
* And a change to non-root .gitignore stuff (doesn't apply to me)

When I ran Eleventy, I saw this (switching from screenshots to a text copy so it's hopefully easy to read):

```bash
[@11ty/eleventy-upgrade-help] PASSED `slug` to `slugify` filter
[@11ty/eleventy-upgrade-help] WARNING eleventyConfig.setDataDeepMerge(true) is the new 1.0 default. Revert with eleventyConfig.setDataDeepMerge(false);
[@11ty/eleventy-upgrade-help] WARNING The liquidjs `strictFilters` option default (in Eleventy) changed from false to true. Revert with `eleventyConfig.setLiquidOptions({ strictFilters: false })`.
[@11ty/eleventy-upgrade-help] WARNING The liquidjs `dynamicPartials` option default changed from false to true. Functionally this means `include` statements require quotes now. Revert with `eleventyConfig.setLiquidOptions({ dynamicPartials: false })`.
[@11ty/eleventy-upgrade-help] PASSED input directory .gitignore check
```

Nice, simple, and direct. You can tweak what the plugin checks if you want, but I'd probably leave it at the default.

For now, I'm not running the 1.0 changes in production, just locally. As this site is a blog that's pretty easy to do - I only commit my new posts. With me assuming we'll have a formal 1.0 release on the 11th, I'll wait till then, test again, and commit. Enjoy!
