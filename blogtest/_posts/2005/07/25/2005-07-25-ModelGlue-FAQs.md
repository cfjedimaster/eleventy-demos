---
layout: post
title: "Model-Glue FAQs"
date: "2005-07-25T16:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/07/25/ModelGlue-FAQs
guid: 645
---

As I work my way through rebuilding CFLib (and yes, I still plan on deploying it live so people can see the progress) I ran into a few issues that I needed help. I'll make the assumption that my questions aren't stupid and share them here...

1) Inside a controller I want to make an instance of a CFC. No big deal, but I needed the full path to the CFC. This was: cflib2005.model.library. As you can probably guess though, "cflib2005" was the root mapping for my site. I didn't want to hard code that in. Turns out you have a few options. The first is to simply use the &lt;setting&gt; tag in your ModelGlue.xml file. Then you can use this code:

getModelGlue().getConfigSetting("applicationMapping")

Thanks go to Sean for pointing this out. The other option is to use a <a href="http://www.model-glue.com/quickstart/index.html#configbeans">ConfigBean</a>. Personally this is the option I prefer. This way I can keep my ModelGlue.xml file focused on the events, and put my setting in a separate XML file. 

2) How do you pass arguments to a view? In the past, I've code layout like so:

<div class="code"><FONT COLOR=MAROON>&lt;cf_layout title=<FONT COLOR=BLUE>"CF Rocks"</FONT>&gt;</FONT><br>
Content<br>
<FONT COLOR=MAROON>&lt;/cf_layout&gt;</FONT></div>

I wasn't sure how I would do the same thing in MG. Turns out, you can pass an argument to a view very simply:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"main"</FONT> template=<FONT COLOR=BLUE>"layout.main.cfm"</FONT>&gt;</FONT></FONT><br>
<FONT COLOR=NAVY>&lt;value name=<FONT COLOR=BLUE>"title"</FONT> value=<FONT COLOR=BLUE>"Welcome to CFLib.org"</FONT> /&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/include&gt;</FONT></FONT></div>

Once you do that, the variable "title" is available in the view state. Of course, my next question was, how do I make it dynamic? You simply use the view state again: 

<div class="code"><FONT COLOR=MAROON>&lt;cfset viewState.setValue(<FONT COLOR=BLUE>"title"</FONT>, library.getName())&gt;</FONT></div>

What's cool then is that my view works just fine with either methods, since they both write to the same view state collection.

I have to say - for no real reason I can think - I'm really enjoying the rewrite of <a href="http://www.cflib.org">CFLib</a> into Model-Glue. I actually tried this once before, with MachII, and I just didn't like it as much. In fact I gave up after a while. I'm not dissing MachII though - I'm just saying that Model-Glue seems to be "sticking" with me a lot better.