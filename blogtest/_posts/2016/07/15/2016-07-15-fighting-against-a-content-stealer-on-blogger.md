---
layout: post
title: "Fighting against a content stealer on Blogger"
date: "2016-07-15T07:55:00-07:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2016/07/15/fighting-against-a-content-stealer-on-blogger
---

About two weeks ago a reader sent me a question concerning one of my blogs. While not unusual, the URL was. Apparently, a site on Blogger is automatically copying my content from my site (along with content from <a href="http://www.tricedesigns.com/">Andy Trice</a> and <a href="http://coenraets.org/blog/">Christophe Coenraets</a>). Currently they have 402 copies (I'll explain how I know that in a minute) and of course, they will have a copy of this post too - in about 30 minutes.

The site in question is mr-cordova.blogspot.co.za. I'm not using a 'real' link for that of course as I don't want to give them anymore Google power than they already have. (Since at least one person went to his site thinking it was mine.) At the bottom of each post you can see an attribution: "by via Raymond Camden" but no direct link is provided. Even if they did, I certainly don't approve of them copying my content completely on their site. 

When I first discovered this, I assumed it would be pretty simple to correct. I've been publishing web sites for over twenty years and have had problems with this since nearly day one. (I used to run a pretty popular site, [deathclock.com](http://www.deathclock.com), that was copied all the time.) 

At the top of every site running on Blogger is a link that lets you report issues:

<img src="https://static.raymondcamden.com/images/2016/07/steal1.jpg" class="imgborder">

This leads to a "Choose Your Own Adventure" type interface for trying to report a problem. I ended up in an infinite loop at first but finally ended up on their DCMA removal tool. Their form lets you explain what content was stolen and then asks for the offending URLs. 

Here is where the shit hit the fan. (Pardon the language.)

I explained, very clearly, that the site was stealing content from my blog (and two others). I submitted the request and I assumed it would be fixed rather quickly. Three days later I got a response:

<blockquote>
Hello,

Thanks for reaching out to us.

With regard to the following URLs:

mr-cordova.blogspot.co.za


In order for us to investigate the appropriate content and take further action, please provide us with the specific URLs of the posts where the infringing content is located. You can obtain the post URL by clicking on the title of the post or the timestamp found at the bottom of the allegedly infringing post(s).


Regards,
The Google Team
</blockqoute>

I responded immediately with an explanation about what the site was doing, and also explaining that even if I got every URL, they would just steal new content. 

I got no response.

So I submitted again, one specific URL this time, but with explanatory text about how the site was stealing my content. The good news is that they removed the URL. The one damn URL. And completely ignored everything I said about the rest of the content.

So today I decided - what the hell - let me scrape the site. The site has a sitemap.xml which looks like this:

<pre><code class="language-markup">
&lt;?xml version='1.0' encoding='UTF-8'?&gt;
&lt;sitemapindex xmlns=&quot;http://www.sitemaps.org/schemas/sitemap/0.9&quot;&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=1&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=2&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=3&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;/sitemapindex&gt;
</code></pre>

Which basically leads to 3 "pages" of a site map. Each page is a ginormous XML file of URLs. They look like this:

<pre><code class="language-markup">
&lt;url&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/2015/04/coldfusion-updates-released-today.html&lt;/loc&gt;
&lt;lastmod&gt;2015-04-14T22:22:03Z&lt;/lastmod&gt;
&lt;/url&gt;
</code></pre>

I knew I could use XPath to parse that data, so I Googled for a random online XPath tool and found this one: <a href="http://videlibri.sourceforge.net/cgi-bin/xidelcgi">Template / XPath 3.0 / XQuery 3.0 / CSS 3 Selector / JSONiq Online Tester</a>

I used an XPath of <code>//url/loc</code> to parse each page of the sitemap:

<img src="https://static.raymondcamden.com/images/2016/07/steal2.jpg" class="imgborder">

I did this three times and ended up with 402 URLs. I then filed a new DCMA request, which *again* won't be enough to stop this asshat, and ran into a new problem. Blogger only allows me to file 100 URLs per day. So great. I've got 4 days now of filing requests. And I get to repeat this every month or so assuming Blogger never shuts this guy down. 

Anyway - wish me luck. I'll update this post with a comment if I have any luck.