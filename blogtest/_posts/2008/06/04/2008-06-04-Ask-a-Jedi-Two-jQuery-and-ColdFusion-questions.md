---
layout: post
title: "Ask a Jedi: Two jQuery and ColdFusion questions"
date: "2008-06-04T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/04/Ask-a-Jedi-Two-jQuery-and-ColdFusion-questions
guid: 2858
---

Syed sent some interesting questions regarding jQuery and ColdFusion. I will attempt to answer them, but I will remind people that I've only begun to play with jQuery. I'm far from being an expert. Anyway, his questions:
<!--more-->
<blockquote>
<p>
Hi Reymond, I've been trying to make cfform work with jquery, i think you were able to with the code below:<br/>
$.post("sendcontact.cfm",{dname:$("#dname").val(),demail:$("#demail").val(),comm
ents:$("#comments").val()},formDone);

For some reason, i cant get it to work. I actually have the cfform under jquery Tabs, which should submit the form without loading, like it was doing under cf ajax feature. 
</p>
</blockquote>

So this isn't much of an answer, but I'd be willing to bet the JavaScript that cfform is spitting out is conflicting with jQuery. I would not mix the two. I'm not saying they can't be mixed, but I just wouldn't do it. 

<blockquote>
<p>
I'm trying to convert from cf ajax to jquery. The only problems i'm having is with the link within the tabs and forms. 

How did you replace ajaxlink() in jquery?
</p>
</blockquote>

Ah, now thats an interesting one. The ajaxLink() function in ColdFusion basically says, "Load URL X into the current container." So to do a basic "Load X into container Y" in jQuery, you can just do:

<code>
$("##content").load(someurl);
</code>

Nice and simple, but note that I had to specify a 'block' to load the content into. You could simply write a helper function. I haven't tested this, so forgive any typos:

<code>
function go(container,url) {
$(container).load(url);
}

&lt;div id="content"&gt;
&lt;a href="javascript:go('content','someurl.cfm')&gt;Load it like you mean it&lt;/a&gt;
&lt;/div&gt;
</code>

I'm sure a simpler solution exists. You could probably do it inline as well, but I find that a bit nicer to read myself. I'm not a big fan of making things shorter just to save typing. That's one of my complaints about jQuery. I like the power of it - but sometimes I almost wish it had a bit more code to it to make it readable. (Blasphemy, I know.)