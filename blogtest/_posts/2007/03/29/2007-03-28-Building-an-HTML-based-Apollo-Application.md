---
layout: post
title: "Building an HTML based Apollo Application"
date: "2007-03-29T10:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/29/Building-an-HTML-based-Apollo-Application
guid: 1930
---

So after seeing just how darn good an <a href="http://ray.camdenfamily.com/index.cfm/2007/3/23/Apollo-isnt-just-FlashFlex">HTML based Apollo application</a> could be done, I wanted to see how I could build one as well.
<!--more-->
Now I may be dumb - but I was surprised to find I couldn't use Flex Builder (by itself) to build an HTML based Apollo application. Flex Builder will only let you work with a Flex based Apollo application. You can't point the project to an HTML file.

On reflection I figure that is pretty obvious. I mean, it <i>is</i> Flex Builder, not HTML Builder, but I was still a bit surprised. 

Luckily it isn't too hard. I had help from the Apollo Coders list. I don't know the guys name, but brodnack was his ID and I thank him for the help.

Let me be clear - I could be doing this completely wrong. But it worked for me. 

So first off I created a super simple HTML file:

<code>
Hi, this is Raymond's first HTML apollo app.
</code>

And saved this to index.html in a new folder. Next I needed  the XML file that Apollo uses to help define the application. I followed the format FlexBuilder used and named my index-app.xml. I got the XML from another FlexBuilder project. (I will probably make a simple snippet out of this for CFEclipse.) I edited a few of the entries in the XML:

appID - I set this to ApolloHTML<br />
name - Ditto<br />
description and publisher - I just typed something relevant for both

Lastly, I changed 


<code>
&lt;rootContent systemChrome="standard" transparent="false" visible="true"&gt;[SWF reference is generated]&lt;/rootContent&gt;
</code>

to

<code>
&lt;rootContent systemChrome="standard" transparent="false" visible="true"&gt;index.html&lt;/rootContent&gt;
</code>

As you can see, I changed the value to point to my main application file.

So far so good. Now it's time for the command line tools. The first one I used was adl. This function lets you run your code as an Apollo app. All you have to do is point it at your XML file:

<code>
adl index-app.xml
</code>

So that was easy enough. I can now develop and just quickly run this command then to view the results. (And if I remember right, I can do this directly in Eclipse.)

Next - how do you build the AIR file so you can package your application up? One more command like - adt:

<code>
adt -package index.air index-app.xml index.html
</code>

The last argument can be a directory instead, which would have made sense if I had more files. This generated an AIR file I was then able to test with. I included the AIR on this post, but it's incredibly boring so don't bother downloading.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Findex%{% endraw %}2Eair%2Ezip'>Download attached file.</a></p>