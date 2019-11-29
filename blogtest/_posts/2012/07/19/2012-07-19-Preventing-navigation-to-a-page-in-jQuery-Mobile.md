---
layout: post
title: "Preventing navigation to a page in jQuery Mobile"
date: "2012-07-19T20:07:00+06:00"
categories: [jquery,mobile]
tags: []
banner_image: 
permalink: /2012/07/19/Preventing-navigation-to-a-page-in-jQuery-Mobile
guid: 4682
---

Here's an interesting situation I ran into recently. Consider a simple web site that begins with a login page. After you successfully login, you proceed to a 'home' page with links to sub pages. But you want to prevent users from using their back button to return all the way to the login page. It isn't a security issue per se, but it is confusing. The user should only be able to go back to the post-login home page.
<!--more-->
In theory - this should be simple. jQuery Mobile exposes a pagebeforechange event. As you can guess, it is fired before you change to a page. According to the <a href="http://jquerymobile.com/demos/1.1.1/docs/api/events.html">docs</a>, using preventDefault effectively blocks the loading of the page.

Easy then, right? The docs state that you are passed a data object that contains a "toPage" key. This is either a simple value (url) or a jQuery DOM item for the page. In theory, I can use this to detect someone loading the initial page and simply block it. Here's a snippet of the code I tried:

<script src="https://gist.github.com/3147547.js?file=gistfile1.js"></script>

You can demo this yourself here (opens in new window): <a href="http://raymondcamden.com/demos/2012/jul/17/index.html" target="_new">http://raymondcamden.com/demos/2012/jul/17/index.html</a>

Now, if you try this, something interesting happens. When you click to visit page 2, and then click back in your browser, you will see that the page does not change, <i>but the url does!</i>. So jQuery Mobile kinda "half way" worked but not completely. In testing I saw various problems with this. Just now, I wasn't able to go back anymore, but in other testing I would go back after a second click. It was a bit inconsistent for me. 

I posted this to the <a href="http://forum.jquery.com/jquery-mobile">jQuery Mobile forums</a> and user <a href="http://forum.jquery.com/user/kevin-b">Kevin B</a> had a great solution. He correctly pointed out that I was preventing jQuery Mobile from navigating but not preventing the browser itself from doing so. He suggested modifying the history directly to correct it. This could be done with a simple history.go(1) statement.

You can see a full example of his solution <a href="http://forum.jquery.com/topic/pagebeforechange-working-halfway#14737000003502579">here</a>. I tried this back in the application I was building and it worked fine. I noticed that in my PhoneGap application that I received a jQuery object instead, but that simply required me doing a quick check on toPage.attr("id"). 

Hopefully this makes sense and helps others.