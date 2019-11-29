---
layout: post
title: "Getting URL parameters in a jQuery Mobile page"
date: "2012-02-24T16:02:00+06:00"
categories: [development,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/02/24/Getting-URL-parameters-in-a-jQuery-Mobile-page
guid: 4536
---

While I could have sworn I blogged this before (in fact, Chrome popped autosuggested the title), I can't find the post and as I ran into this issue again today, I figured I'd better blog it before I forget again. So - the question is simple. Given that you can use the powerful <a href="http://www.jquerymobile.com">jQuery Mobile</a> framework to create dynamic applications, how can you create single pages that act differently depending on the URL parameters sent to them. So for example, you may have a list of art pieces that all link to artdisplay.html. You want to pass an art ID value in the URL so your location may look like so:
<!--more-->
<p>

artdisplay.html?id=2

<p>

You can bind to the "pageshow" event easily enough and then fetch the URL parameter, but here is where things get tricky. Or at least they did for me. I was making use of window.location.href like so:

<p>

<pre><code class="language-javascript">
<code>
$("#artdetailpage").live("pageshow", function(e) {
  var query = window.location.search;
  query = query.replace("?id=","");
  //query is now an ID, do stuff with it...
});
</code></pre>

<p>

window.location.search returns just the query string portion of the URL. If I only have one parameter, then I can simply strip it out. (Note that it also returns the ?, which seems silly.) 

<p>

This worked fine until I put the code onto a device via <a href="http://www.phonegap.com">PhoneGap</a>. All of a sudden window.location.search was empty. Given than this was a slightly different way of running the application versus just hitting in my browser, I searched for another solution.

<p>

Turns out that jQuery Mobile stores the URL of the page in a data-page parameter. This is documented <a href="http://jquerymobile.com/demos/1.0.1/docs/pages/page-navmodel.html">here</a>. If you switch to using $(this).data("url"), you will get the full URL, which means slightly more string parsing, but it seems to work in every situation, desktop or mobile. The pseudo-code above could then look like so:

<p>

<pre><code class="language-javascript">
$("#artdetailpage").live("pageshow", function(e) {
  var query = $(this).data("url").split("?")[1];;
  query = query.replace("id=","");
  //query is now an ID, do stuff with it...
});
</code></pre>