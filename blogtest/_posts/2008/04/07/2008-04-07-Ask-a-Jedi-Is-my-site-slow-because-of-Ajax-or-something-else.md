---
layout: post
title: "Ask a Jedi: Is my site slow because of Ajax or something else?"
date: "2008-04-07T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/07/Ask-a-Jedi-Is-my-site-slow-because-of-Ajax-or-something-else
guid: 2755
---

Paul asks:

<blockquote>
<p>
I've been working on a project using Mach-II and Spry, which can be viewed at <a href="http://www.china-buy.com/chinabuy_new_machii/index.cfm?event=showMain">here</a>. I'm using a Spry master-detail layout on each pages. All of the content is stored in xml files. So, I have Spry datasource configured for each page also.

I'm wondering if the slow page loading is related to Mach-II or Spry. The site is running on a shared hosted server (viux.com). If it's related to Spry, then could some of the problem be resolved by pre-loading the data sources somehow.
If so, how would that be done with Mach-II.

I see you've delved into Spry, just not sure how far, or whether my question even makes sense. Anyway, let me
know if you can help. I've trawled through Google and not getting many answers. Other people have complained about the slow loading on the Adobe website, but no answer was furnished to that particular point.

Perhaps if you browse my website as shown above, you can see what I mean. The page initially loads real slow, but after its loaded, it's fine. But customers will be gone before that
happens.
</p>
</blockquote>

When it comes to answering "Why is my page slow", there are a number of things you need to look at. A typical request to a ColdFusion site normally involves these items:

<ul>
<li>User request URL X.
<li>CF works on creating the response to X.
<li>CF returns a response (just a stream of text) to the browser.
<li>The browser renders the response. This may involve more HTTP requests for CSS, images, and Ajax items.
</ul>

So which of the above is the slow portion of your site? It seems like the response from the server is a bit slow. Since you are using Mach-II, one of the first things I'd check into is to see if the framework is reloading. If Mach-II is like Model-Glue, there is a setting that determines if the entire framework should reload on every request. This can <b>really</b> slow down the response and you are recommended to turn this off in production. I'd bet Mach-II is the same, and I'd check there first. 

My gut here says the issue isn't Ajax. Using Firebug (you are using Firebug, right?) I see that your XML being returned is very little (3KB). Your Spry files look fat, so I'd be willing to bet you aren't using the minimized versions. I'd switch to that. 

You also want to get the <a href="http://developer.yahoo.com/yslow/">YSlow</a> plugin to Firebug. As you can guess, it tries to tell you why your site is slow. Your grade was an F, but I'm not sure why. Most of the things it failed you on seemed minimal to me. Your C for JavaScript files doesn't surprise me. 

How good is the connection to your site? It may just be the network between here and there. Since your site involves China goods, I'm guessing it may actually be in China. Is it? If so then you could always consider multiple servers based on the location of the requestor. (I've never done that myself.)

I'll let others chime in as well on things they may see in the request.