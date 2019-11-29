---
layout: post
title: "How I added search to my static blog"
date: "2016-03-07T14:01:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/03/07/how-i-added-search-to-my-static-blog
---

I was talking with fellow coder [Nic Raboy](https://www.thepolyglotdeveloper.com/) about static sites, and specifically [Hugo](https://gohugo.io/), and he asked me how I built the search form here. This is something I've written about before (see my article over on Modern Web from a few years back: [Moving to Static and Keeping Your Toys](http://modernweb.com/2013/12/16/moving-to-static-and-keeping-your-toys/)), but I thought it would be worthwhile to discuss my specific implementation on raymondcamden.com

<!--more-->

At a high level, I'm using a [Google Custom Search Engine](https://cse.google.com/cse). This is a free tool by Google that lets you create a client-side widget to add a search engine for a particular domain, or set of domains. You have control over a number of features, like the CSS and specific paths under a domain you want to include, and for the most part it just simply works as you expect. This is what the administrator looks like. Notice the preview on the right hand side. It is "live" and you can see how I've entered a text string for testing.

<img src="https://static.raymondcamden.com/images/2016/03/cse1.png" class="imgborder" alt="CSE">

I didn't customize much. Under look and feel, I switched to "Full Width" so it would look good under my blog theme.

<img src="https://static.raymondcamden.com/images/2016/03/cse2.png" class="imgborder" alt="CSE">

For some reason, they don't make it easy to get the code you need to put on your site. You won't find it under `Setup`, the default page you land on when working on your CSE. But you will find it under `Look & Feel`. I cropped it out of the screen shot above but there is a `Save & Get Code` button. 

That would be it, but I needed to make two more modifications. While you can "land" on my [search](/search) page as is, most folks
will probably enter a term in the box on top and submit. In order for the Google CSE to recognize that you're loading the page
with a term already, you need to tell it what to look for - in this case a query string variable named `q`. Secondly, the CSE
opens up search results in a new tab. I don't like that. So I had to tell it to use `_parent` for the target in results. Both
of these can be done by modifying the HTML code Google gives you.

This is how your code will look when you grab it from the admin:

<pre><code class="language-javascript">
&lt;script&gt;
  (function() {
    var cx = '013262903309526573707:i2otogiya2g';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
&lt;/script&gt;
&lt;gcse:search&gt;&lt;/gcse:search&gt;
</code></pre>

Notice the `gcse` tag at the bottom? You can customize the heck out of it as documented [here](https://developers.google.com/custom-search/docs/element). For me, my modifications were trivial:

<pre><code class="language-markup">
&lt;gcse:search queryParameterName="q" linktarget="_parent"&gt;&lt;/gcse:search&gt;
</code></pre>

And that's it. Remember, if you want more tips on "bringing dynamic back" to your static site, see my [article](http://modernweb.com/2013/12/16/moving-to-static-and-keeping-your-toys/) and feel free to drop me a comment here with any questions.