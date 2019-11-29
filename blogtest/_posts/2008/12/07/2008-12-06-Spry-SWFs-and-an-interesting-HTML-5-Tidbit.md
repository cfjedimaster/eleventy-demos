---
layout: post
title: "Spry, SWFs, and an interesting HTML 5 Tidbit"
date: "2008-12-07T10:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/07/Spry-SWFs-and-an-interesting-HTML-5-Tidbit
guid: 3137
---

A reader sent me a question last week, and in my attempts to solve it I kind of made a stupid mistake. I solved his problem the long way around instead of trying something a lot simpler. But while doing all of this, I discovered a few interesting tricks. Please be sure to read the entire blog post though and don't take my first solution as the best.

Ok, so with that disclaimer aside, what exactly was the problem? Russel was trying to use Spry to load dynamic SWFs. He had no problem with images, but SWFs didn't work. So for example, consider the basic display below.
<!--more-->
<code>
&lt;span spry:detailregion="mydata"&gt;
&lt;img src="{% raw %}{picture}{% endraw %}" align="left"&gt;
&lt;h2&gt;{% raw %}{name}{% endraw %}&lt;/h2&gt;
{% raw %}{name}{% endraw %} is {% raw %}{age}{% endraw %} years old and is a {% raw %}{gender}{% endraw %}
&lt;/span&gt;
</code>

This is a Spry detail region for a list of people. The XML contained the URL for an image which can then be used in the IMG tag dynamically.

While this worked for him, he wanted a Flash file to be used instead of a simple image. I assumed, erroneously, that the embed tag wasn't working dynamically. 

I knew that SWFObject had a nice JavaScript API to work with Flash content. I thought I'd give that a try as a possible solution to my problem. I took my dynamic region of content and added a quick onClick:

<code>
&lt;span spry:repeat="dsRows" onClick="setSWF({% raw %}{swf}{% endraw %})" spry:setrow="dsRows"&gt;
</code>

The setSWF function uses SWFObject's API to load a Flash file into a div.

<code>
function setSWF(i) {
	console.log('loading '+i);
	swfobject.embedSWF("swfs/"+i+".swf", "flashArea", "200", "200", "9.0.0");
}
</code>

In the code above, flashArea refers to a simple empty div. My XML data used SWF file names without a path or an extension, so that's why I added them to the string above. (Hopefully this is still making sense!)

So I gave this a whirl, and it worked fine. Clicking a dynamic row ran the JS function and the SWF was loaded nicely. But something didn't quite sit right with me. I decided to go ahead and test a simpler approach. I went ahead and put in an embed tag:

<code>
&lt;div spry:detailregion="dsRows"&gt;
Specific: {% raw %}{name}{% endraw %}&lt;p&gt;
&lt;embed width="200" height="200" src="swfs/{% raw %}{swf}{% endraw %}.swf" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"&gt;&lt;/embed&gt;
&lt;/div&gt;
</code>

Surprisingly, this worked perfectly! I know I'm not the only one who goes down a more complex route only to find out that the best solution is something a lot simpler!

Ok, so here is where things get interesting. While the code was working fine for me, I had noticed, in Firebug, that on the initial load, there was a quick 404 for the SWF. I noticed this in a simple image example as well. If you think about it, it makes sense. On initial load, the browser tries to load an image (or swf) named {% raw %}{something}{% endraw %}, which obviously isn't valid. I never see a broken image icon so it wasn't a huge deal, but it bugged me. It seems like this would load our logs with a bunch of invalid 404 entries and that would make finding <i>real</i> 404 problems.

I pinged the Spry team (who luckily survived the layoffs) and Kin Blas shared a cool fix for this.

First, he changed my HTML to use data-src instead of src for the embed tag. 

<code>
&lt;span id="detail" spry:detailregion="dsRows"&gt;
Specific: {% raw %}{name}{% endraw %}&lt;p&gt;
&lt;embed width="200" height="200" data-src="swfs/{% raw %}{swf}{% endraw %}.swf" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"&gt;&lt;/embed&gt;
&lt;/span&gt;
</code>

Apparently this is a HTML5 feature that allows you to embed any random data into an HTML element without breaking validation. (More information <a href="http://ajaxian.com/archives/embed-your-data-in-html-5">here</a>.) Since the src isn't defined in the... well real src, on load you don't get the initial 404.

You can then use a simple Spry region observer:

<code>
Spry.Data.Region.addObserver("detail", { onPostUpdate: function()
{
       Spry.$$("#detail embed").forEach(function(n){% raw %}{ n.src = n.getAttribute("data-src"); }{% endraw %});
}});
</code>

This code finds the embeds within the detail item and updates the src by copying the value from the data-src attribute. 

Pretty cool, eh? I didn't test this in IE, but it certainly works well in Firefox. Of course, if all of this is too complex and the 404 stuff doesn't bug you, then you can just ignore it. (I certainly never noticed it before.) 

I've included a zip with this blog entry so you can see the code. index.html shows both the first two things I tried - the SWFObject way and the simple embed version, so you actually get 2 SWFs displayed instead of one. index2.html shows the method Kin Blas sent me. Note that both Spry and SWFObject JS files are not included in the zip.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fswfspry%{% endraw %}2Ezip'>Download attached file.</a></p>