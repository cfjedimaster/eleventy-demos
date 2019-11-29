---
layout: post
title: "Remember this special little rule about ColdFusion Components"
date: "2013-04-02T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/04/02/Remember-this-special-little-rule-about-ColdFusion-Components
guid: 4898
---

I just spent some time helping a person debug an issue that turned out to be one small little problem. He had a form that posted to a CFM page. On that CFM page he had quite a bit of processing going on, but the result was always the same - a blank white page.
<!--more-->
I walked him through my normal debug process. Lots and lots of messages. I know that sounds lame, but I approach templates like this with a top-down process. So for example, imagine the following pseudo-code:

<blockquote>
if something<br/>
do this<br/>
end if<br/>

if something<br/>
do this<br/>
end if<br/>

do crap<br/>
do some more crap<br/>

if something<br/>
do this<br/>
end if
</blockquote>

I'll start putting messages before each portion of the code. Simple stuff like: 

"Before first condition." "After second condition." "Before I do crap" 

You get the idea. The further I go, the more I cuss. It helps. Honest.

So while working through this process with the guy, we got down to the final code block that caused the abort. In this case, it was a call to a CFC using cfinvoke.

My first thought was something funky with his exception handling. I had him wrap the cfinvoke code with a try/catch/dump, but it didn't report anything.

So I opened up the CFC. The method didn't use a cfabort. Heck, it was a two line query. Very simple. 

It was then that I began to scan upwards and saw....

&lt;cfabort&gt;

This wasn't inside a method. It was just sitting there. Sneaky little bastard.

People new to CFC development often forget a very critical rule: Every line of CFML that is <b>not</b> inside a cffunction block will execute whenever you create an instance of a CFC. In this case, the cfabort was in the middle of the file in an easy to miss position, and the user wasn't even aware of this particular feature. 

So... yeah. Keep that in mind. :)