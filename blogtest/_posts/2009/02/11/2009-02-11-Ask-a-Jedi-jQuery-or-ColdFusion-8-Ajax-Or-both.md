---
layout: post
title: "Ask a Jedi: jQuery or ColdFusion 8 Ajax? Or both?"
date: "2009-02-11T15:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/11/Ask-a-Jedi-jQuery-or-ColdFusion-8-Ajax-Or-both
guid: 3233
---

Andy asks:

<blockquote>
<p>
Ray, Don't take this wrong as I know that you're a very big fan of jQuery. I'll preface this question by stating that it truly is a question and not an argument.  As someone who has pretty much mastered the ColdFusion AJAX stuff I am compelled to ask - What is the draw of jQuery and what does it do that CF8 out of the box cannot do?.  What is the advantage of using jQuery over CF8's AJAX tools?
</p>
</blockquote>

Good question, and let me say, I don't mind a good argument. While in some ways I can be as sensitive as my 7 year old daughter, I don't mind arguing about this, so let's start a little <strike>argument</strike>discussion, shall we?
<!--more-->
First and foremost, let me repeat something that I've said in comments here before and I've said both in context of server side languages as well as JavaScript frameworks. The &quot;best&quot; one is the best that allows you to be the most productive and produce the best quality output for your client. End of story. 

That being said, let's first talk a bit about what we mean when we say 'CF8 Ajax' (and to make it simpler, I'll simply use 'CFAjax' to refer to Ajax support in ColdFusion 8). I look at CFAjax as four main areas of support:

<ul>
<li>Plumbing
<li>Widgets
<li>Debugging
<li>Security
</ul>

I don't talk much about debugging because, well, Firebug won the war a long time ago. I have <a href="http://www.adobe.com/devnet/coldfusion/articles/ajax_security.html">written</a> about ColdFusion 8's security support in terms of Ajax control before. It's ok, but really meant to be used within the context of a full suite of security rules and settings. Most people focus on the plumbing and UI widgets.

By plumbing I mean the low level things ColdFusion 8 does to support Ajax. This includes things like JSON support, cfajaxproxy, and probably the most useful change of all - the simple returnFormat argument. These additions are <b>very</b> helpful and you should not ignore them if you are using another framework. They are - for all intents and purposes - framework agnostic and will work with CFAjax, jQuery, Spry, Ext, etc.

What does that leave? Well, widgets for one, but we also have a whole other area that CFAjax doesn't really cover - manipulation. jQuery is definitely the winner here. Period. If you want to work with the DOM in any way, then jQuery has you covered.  

UI widgets... well, that's another matter. You most likely read my blog entries on jQuery and UI widgets (<a href="http://www.raymondcamden.com/index.cfm/2009/2/2/Creating-a-Dialog-with-jQuery-UI-2">my last entry on jQuery dialog</a>). If I remember right, there are about 5-6 jQuery widgets now. ColdFusion has a window, a pod, a grid, a slider, a tree, and I am probably forgetting one, but, about the same number of components. When it comes to ease of use, I think CFAjax is the clear winner. Don't get me wrong, jQuery makes it easy, but if you don't know JavaScript, you can't beat this:

<code>
&lt;cfwindow source="some.cfm" /&gt;
</code>

The flip side of this is customization. I haven't always had luck with customizing the look and feel, or behavior, of the CFAjax widgets, while there seems to be a much greater level of support on the jQuery side, both in the 'official' widget side and in the plugins. 

I think what it comes down to is ease of use. I blogged a lot about CFAjax when ColdFusion 8 came out. I was getting used to JavaScript and Ajax again (Spry had been a big help) and ColdFusion 8 made it <i>incredibly</i> easy. Now that I'm more comfortable though I find the power of jQuery more to my liking. 

What other comparisons can we make? CFAjax has no native animation support... but to be honest, I find most animations incredibly annoying. I'm willing to admit that I'm in the minority though and jQuery's support of this is rather nice. I like how they recognized that for common UI features like show, hide, that it made sense to easily tie these to animations. CF has forms validation built in... but... well... most people I know don't use it. I know I don't. jQuery gets the point here even though it's not native but available via a plugin. 

Another facet of CFAjax is the binding support. Borrowing from Forta's <a href="http://www.forta.com/blog/index.cfm/2007/5/31/ColdFusion-Ajax-Tutorial-2-Related-Selects">post</a>, consider this:

<code>
&lt;cfselect name="mediaid"
            bind="cfc:art.getMedia()"
            bindonload="true" /&gt;
&lt;cfselect name="artid"
            bind="cfc:art.getArt({% raw %}{mediaid}{% endraw %})" /&gt;
</code>

While I can certainly do this in jQuery and other frameworks, you have to admit that that syntax is pretty darn powerful, especially when you consider the developer who has 0 JS experience. (Note to self - how would one even do bindings in jQuery?)

So I rambled on a bit. Let me try to come to some sort of conclusion here that makes a bit of sense. 

You always want to use the tools that make you the most productive. Using myself as an example, I was most productive with <i>just</i> the CFAjax stuff at first. It took me a while, but now I'm more productive with jQuery. If I were to join some new team of developers, I'd have to work with them to find the best tool we can use together. Using jQuery though (or Spry, or Ext) doesn't mean you can't use the other facets of ColdFusion 8's Ajax support.

Make sense? Discuss please.