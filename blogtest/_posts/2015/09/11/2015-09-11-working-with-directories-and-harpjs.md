---
layout: post
title: "Working with Directories and HarpJS"
date: "2015-09-11T20:22:23+06:00"
categories: [development]
tags: [harpjs]
banner_image: 
permalink: /2015/09/11/working-with-directories-and-harpjs
guid: 6751
---

First off - a quick apology. The blogging here has been <i>extremely</i> slow over the past few weeks. Two weeks ago I was in Australia and New Zealand. This week I've been in Malaysia, Singapore, and Manila. I'm writing this post in Hong Kong as I wait to board my 14 hour flight back to Texas. (Yes, I'm looking forward to Texas, imagine that.) I don't normally travel this much so I've been pretty much exhausted for the past three weeks. It has been an incredible experience, and I got to really work on some presentations too, but I'm definitely ready to go home and stay home for a while. 

Ok, so with that out of the way, let's get to the issue. A HarpJS user asked (<a href="https://github.com/sintaxi/harp/issues/345">List files in directory</a>) about how to work with directories in their static site. Essentially, given that you have subdirectories, how can you access them and do - well - something with them?

Working with files is easy. You get access to a variable, _contents, that includes all of the files in a directory. (You can find the documentation for that here: <a href="http://harpjs.com/docs/development/contents">http://harpjs.com/docs/development/contents</a>.) But what about subdirectories?

In order to create a simple testing environment, I set up the following folder structure in a Harp project:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot1.png" alt="shot1" width="470" height="620" class="aligncenter size-full wp-image-6752 imgborder" />

I want to point out a few things. Note that there is a root level _harp.json file for data. Then notice the articles subdirectory has one as well. Beneath that are three "category" directories each with some random files in it. Ok, so given that, let's look at the data. Your templates have access to a variable, public, that represents pretty much all of the data in the current Harp application. There is a Harp recipe (<a href="http://harpjs.com/recipes/print-debugging">How to print out all available data for debugging</a>) that details how to quickly print out variables to the page and console:

<pre><code class="language-markup">h1 Welcome to Harp.
h3 This is yours to own. Enjoy.

pre #{% raw %}{ JSON.stringify(public, null, '\t') }{% endraw %}</code></pre>

Here is how it looks for my sample structure above:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot2.png" alt="shot2" width="700" height="949" class="aligncenter size-full wp-image-6753 imgborder" />

So let's pick this apart. At the top level is a _contents structure. This contains the files, and only the files, for the root level folder. Then you have _data. This represents - well - data. And then you have one key per subdirectory. You can see the same pattern represented under <code>articles</code> as well.

Therefore, to get access to subdirectories, you work with the keys of the object <i>minus</i> the _contents and _data values. To get the subdirectories of some subdirectory /foo, you would use public.foo. 

In theory, you could write up a simple utility function that would return directories for you, or perhaps even files and subdirectories given a particular root node. Anyway, I hope this is useful!