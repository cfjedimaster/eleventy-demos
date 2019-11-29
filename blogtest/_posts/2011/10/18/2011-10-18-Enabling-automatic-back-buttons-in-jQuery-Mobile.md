---
layout: post
title: "Enabling automatic back buttons in jQuery Mobile"
date: "2011-10-18T13:10:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/10/18/Enabling-automatic-back-buttons-in-jQuery-Mobile
guid: 4397
---

In earlier versions of jQuery Mobile, your page headers automatically had a back button added to them. This was removed during the development cycle but you can add them back in a <a href="http://jquerymobile.com/demos/1.0rc1/docs/toolbars/docs-headers.html">variety</a> of ways. However, one method, turning it on at a global level, wasn't very clear to me. If you read the docs, you see this:

<p/>
<!--more-->
<blockquote>
The framework automatically generates a "back" button on a header when the page plugin's addBackBtn option is true.
</blockquote>

<p>

I had no idea what the page plugin even was. I assumed it was part of the jQuery Mobile framework specifically designed for page support, but I didn't know how to translate that to something you can configure at startup. If you look at the jQuery Mobile docs for <a href="http://jquerymobile.com/demos/1.0rc1/docs/api/globalconfig.html">configuring defaults</a>, you see it mention how you can define a JavaScript file and load it <i>before</i> jQuery Mobile. They provide an example of setting values and even provide a list of things you can configure.

<p>

But none of these cover what I was looking for. So I went <i>back</i> to the page headers docs and noticed that further down in the documentation it talks about configuring the text for back buttons. It uses this syntax:

<p>

<code>
$.mobile.page.prototype.options.backBtnText = "previous";
</code>

<p>

With that in mind, I then tried the following:

<p>

<code>
$(document).bind("mobileinit", function(){
  $.mobile.page.prototype.options.addBackBtn=true;
});
</code>

<p>

And voila - automatic back buttons. Unfortunately this doesn't seem to be documented anywhere. I took a quick look at the uncompressed, unmimified JavaScript and found...

<p>

<code>
$.mobile.page.prototype.options.backBtnText		= "Back";
$.mobile.page.prototype.options.addBackBtn		= false;
$.mobile.page.prototype.options.backBtnTheme	= null;
$.mobile.page.prototype.options.headerTheme		= "a";
$.mobile.page.prototype.options.footerTheme		= "a";
$.mobile.page.prototype.options.contentTheme	= null;
</code>

<p>

Hopefully the docs will soon have reference guides that list things like this in a more direct manner. (Or even better, maybe my book will have it! ;)