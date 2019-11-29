---
layout: post
title: "Aligning Buttons in CFForm"
date: "2005-03-17T07:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/03/17/Aligning-Buttons-in-CFForm
guid: 496
---

This is probably a no-brainer, but in case it isn't, I thought I'd share. Imagine you are building a simple flash-based cfform. At the end you include a submit button. However, but button comes out aligned to the left, like so:

<img src="https://static.raymondcamden.com/images/button1.jpg" border="1">

Normally buttons are aligned under the form fields. How do we do that? By simply wrapping the button (or buttons) in a form group, it will align properly:

<div class="code"><FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"horizontal"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"submit"</FONT> name=<FONT COLOR=BLUE>"save"</FONT> value=<FONT COLOR=BLUE>"Save"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT></div>

The layout now looks like so:

<img src="https://static.raymondcamden.com/images/cfjedi/button2.jpg" border="1">

Oh, and btw, these screen shots are from my next big software release, and no, I won't (can't) say what it is yet. :)