---
layout: post
title: "IE issue with AjaxProxy"
date: "2008-07-01T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/01/IE-issue-with-AjaxProxy
guid: 2908
---

IE is the coolest browser on Earth. Really. It's like Vanilla Ice. So incredibly cool that it had to fade away in order to let other feeble browsers like Firefox get some air time. With that being said I ran into a real weird issue with IE that didn't make sense to me. Imagine the following code.
<!--more-->
<code>
&lt;cfajaxproxy cfc="test" jsclassname="mycfc"&gt;
&lt;script&gt;
var mycfc = new mycfc();
alert(mycfc);
&lt;/script&gt;
</code>

All this code does is create a proxy between the client side and a CFC named test. The proxy's class will be called mycfc. Note then that I make an instance of the proxy with a variable called mycfc.

When run, you get the oh-so-helpful "Object expected" error. Luckily I didn't have any tools like Firebug to help me. I was truly confused as this same simple code also worked in Firefox. Obviously this is some flaw in Firefox. 

Turns out the issue was rather simple. The error derived from the fact that I used a variable (mycfc) with the same name as the proxy class. In retrospect, that actually was a bad idea probably. I really should have named it a bit nicer. In fact, consider this code:

<code>
&lt;script&gt;
var mycfc = new mycfc();
alert(mycfc);
var mycfc2 = new mycfc();
alert(mycfc2);
&lt;/script&gt;
</code>

This will break in Firefox as well. It seems like that first line 'breaks' the proxy. For IE it breaks immediately, and for Firefox it breaks after the assignment. (Ok, so all kidding aside - I actually prefer IE noticing the issue sooner.)

Just something to watch out for folks.