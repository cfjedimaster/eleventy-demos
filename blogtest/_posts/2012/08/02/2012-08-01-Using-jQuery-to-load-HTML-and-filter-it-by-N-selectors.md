---
layout: post
title: "Using jQuery to load HTML and filter it by N selectors"
date: "2012-08-02T10:08:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/08/02/Using-jQuery-to-load-HTML-and-filter-it-by-N-selectors
guid: 4692
---

Forgive the somewhat awkward title. Hopefully an explanation will make things a bit clearer. I was working on an application yesterday that needed to load in a HTML file via AJAX and display it on screen. The HTML happened to be documentation so I was going to simply display it as is on screen. Since I wasn't doing any processing, my code was very simple:
<!--more-->
<script src="https://gist.github.com/3237187.js?file=gistfile1.js"></script>

Easy, right? Well, the first thing I discovered was that the HTML I was loading included things I didn't want - headers, footers, etc. Again though this is easy enough to handle. You can tell jQuery's load() function to filter down to a DOM item. (As a reminder - if you are concerned about performance don't forget that you are still asking jQuery to load N bytes of HTML even though you are using &lt;N bytes in the display.)

<script src="https://gist.github.com/3237210.js?file=gistfile1.js"></script>

Woot. Almost there. This worked great, but the "block" of HTML this rendered was missing a nice header on top. I went back to the original source HTML and discovered that there was another div, header, that contained the title and would be perfect. 

But here was a problem. How do I tell the load() function to select *two* DOM items? Turns out this was easy as well - just provide a list:

<script src="https://gist.github.com/3237220.js?file=gistfile1.js"></script>

This worked fine. But this leads to my question. Is this a good idea? Is there a better way? (Assuming you can't get "pure" data and must work with the HTML files.)