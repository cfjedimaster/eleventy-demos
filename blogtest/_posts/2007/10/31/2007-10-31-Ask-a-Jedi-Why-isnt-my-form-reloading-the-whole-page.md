---
layout: post
title: "Ask a Jedi: Why isn't my form reloading the whole page?"
date: "2007-10-31T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/31/Ask-a-Jedi-Why-isnt-my-form-reloading-the-whole-page
guid: 2445
---

This blog entry actually covers something I've covered a few times, but as I keep getting questions, I figure it can't hurt to cover it again. Rual asks:

<blockquote>
<p>
I have a simple question about AJAX, CFDIV and links, I have a little page that
uses the CFDIV tag to include a file depending on the selected value in a
combobox, currently works great with the BIND attribute, but when the included
page in the CFDIV have a cfform and a submit button, the page reloads "inside"
the CFDIV and doesnt replace the whole page, how can I make it so it replaces
the page? links on the included page in the CFDIV will in fact replace the whole
page but the submit buttons of the form, it wont.

Is this a bug?
</p>
</blockquote>

No, it's a feature! Seriously. When it comes to CFDIV (and other things you can put content in, like the CFWINDOW, etc), Adobe used the following rules:

<ul>
<li>For forms that use the FORM tag, the post will replace the entire page.
<li>For forms that use the CFFORM tag, the post will replace just the contents of the div/window/etc. 
<li>Normal HTML links will replace the entire page.
<li>Links generated via the AjaxLink function will stay inside the div/window/etc.
</ul>

So the idea is - you have some control over whether or not you want to stay inside the element.