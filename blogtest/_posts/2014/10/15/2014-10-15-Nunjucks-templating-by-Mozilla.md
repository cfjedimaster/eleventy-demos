---
layout: post
title: "Nunjucks templating by Mozilla"
date: "2014-10-15T11:10:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/10/15/Nunjucks-templating-by-Mozilla
guid: 5334
---

<p>
This is mainly just a FYI type post, but earlier this week I discovered <a href="http://mozilla.github.io/nunjucks/">Nunjucks</a>, a client-side templating language by Mozilla. I've been pretty much sold on <a href="http://handlebarsjs.com/">Handlebars</a> as my template language, but Nunjucks has a lot going for it too. Out of the box it seems to support a lot more than Handlebars (<a href="http://mozilla.github.io/nunjucks/templating.html#template-inheritance">inheritance</a> and <a href="http://mozilla.github.io/nunjucks/templating.html#asynceach">asynchronous support</a> for example) and the template synax is as friendly as Handlebars'. 
</p>
<!--more-->
<p>
Of course, my only real requirement for template syntax is to not suck as bad as Jade but that's just me.
</p>

<p>
It supports client-side (obviously) and server-side (for Node) so it's ready to go pretty much anywhere. I'd love to see this supported in <a href="http://harpjs.com/">Harp</a> in the future.
</p>

<p>
If you want to take it for a test drive, I built an online Nunjucks tester here: <a href="http://www.raymondcamden.com/demos/2014/oct/15/test.html">http://www.raymondcamden.com/demos/2014/oct/15/test.html</a>. You can't test everything there of course (inheritance for example), but you can quickly test out some of the syntax and see how it feels.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot10.png" class="bthumb" />
</p>