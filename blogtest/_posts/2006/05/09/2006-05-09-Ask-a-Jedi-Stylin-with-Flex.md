---
layout: post
title: "Ask a Jedi: Stylin' with Flex"
date: "2006-05-09T19:05:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/05/09/Ask-a-Jedi-Stylin-with-Flex
guid: 1258
---

Today is Flex day, can you tell? Jeff asks:

<blockquote>
I have been reading all of your recent posts regarding Flex and I have a question for you.  Everytime I have seen a flex app, it always looks the same ... i.e. the greenish background with the silver boxes.  I would assume the user interface could be designed differently, but I have yet to be able to find an article or any information on &quot;skinning&quot; a Flex app.  Is such a thing possible or am I just looking for the wrong thing?
</blockquote>

I call it the "Flex Look". It's nice... but boy do you see a lot of examples with it. Does that mean Flex can't be customized in terms of look and feel? Heck no. Consider this screen shot: (Click for larger image)

<a href="http://ray.camdenfamily.com/images/imo.gif"><img src="http://ray.camdenfamily.com/images/imo_small.gif"></a>

This is a screen shot from an application my company built using Flex 1.5. I can't share the URL as it is in a private network, but as you can tell, it looks nothing like a "default" Flex skin. (By the way, I did the code for this tab. It was fun and challenging but not nearly as hard as I thought it would be.) 

So keep in mind that I'm still a Flex newbie. It is my understanding that you can customize Flex apps with style sheets and custom components. Components being the UI elements like buttons, etc. So you could build a form control called the Ray if you wanted. I think normally the thing you would tweak the most is the style sheets. 

You can do a lot with the styles as evidenced by the screen shot above. From the livedocs for Flex 1.5 I found:

<a href="http://livedocs.macromedia.com/flex/15/flex_docs_en/00000532.htm#121065">Using Styles and Fonts</a><br>
<a href="http://livedocs.macromedia.com/flex/15/flex_docs_en/00002194.htm#143512">Using Themes and Skins</a>

The docs above are for Flex 1.5, so you would probably be better served downloading the docs for Flex 2 and reading the relevant chapters there. 

You can also play with an online <a href="http://flexapps.macromedia.com/flex2beta3/styleexplorer/Flex2StyleExplorer.html">Flex style explorer</a>. I used this when playing around with ways to improve my <a href="http://www.cflib.org/cflibflex/output/CFLib.html">CFLib demo</a>.

I know I'm just scratching at the surface, but I just want you to be aware that you definitely <i>can</i> get away from the "default" Flex look.