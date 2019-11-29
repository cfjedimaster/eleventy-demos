---
layout: post
title: "Ask a Jedi: Embedding FlashPaper on a page"
date: "2009-05-26T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/26/Ask-a-Jedi-Embedding-FlashPaper-on-a-page
guid: 3370
---

Rob wrote me yesterday asking about cfdocument and FlashPaper. FlashPaper? Yes, <a href="http://www.adobe.com/products/flashpaper/">FlashPaper</a>. FlashPaper was an alternative to PDF created back before Adobe swallowed up Macromedia. I thought the product was dead, but apparently you can still purchase it. As you can guess, it is a "document" type product, much like PDF, but it uses Flash for rendering into of the PDF engine. ColdFusion has supported generating FlashPaper ever since cfdocument was released. Here is a quick example.
<!--more-->
First, use the cfdocument tag with FlashPaper as a format.

<code>
&lt;cfdocument format="flashpaper"&gt;
	&lt;img src="http://www.adobe.com/images/shared/product_logos/159x120/159x120_flashpaper.gif" align="left"&gt;
	&lt;cfloop index="x" from="1" to="10"&gt;
		&lt;p&gt;
		&lt;cfoutput&gt;&lt;h1&gt;Para #x#&lt;/h1&gt;&lt;/cfoutput&gt;
		&lt;/p&gt;
	&lt;/cfloop&gt;
&lt;/cfdocument&gt;
</code>

This outputs Flash on the page with an embedded toolbar on top:

<img src="https://static.raymondcamden.com/images//Picture 159.png">

One of the cool things about FlashPaper is that it can more easily be embedded in a page. As far as I know, PDF can't be. It either takes over the entire web page, or, at least on my machine, it just gets downloaded. However, if you try to use cfdocument/format="flashpaper" with other HTML you will see that the FlashPaper takes over the entire page. 

Here is one workaround. Don't forget that cfdocument can take it's generated binary data and store it to a variable. This is true for both PDF and FlashPaper.

<code>
&lt;cfdocument format="flashpaper" name="f"&gt;
</code>

Once you have this data, you can save it to the file system and include it as you normally would with object/embed tags:

<code>
&lt;h2&gt;Test&lt;/h2&gt;

&lt;cfdocument format="flashpaper" name="f"&gt;
	&lt;cfloop index="x" from="1" to="10"&gt;
		&lt;p&gt;
		&lt;cfoutput&gt;&lt;h1&gt;Para #x#&lt;/h1&gt;&lt;/cfoutput&gt;
		&lt;/p&gt;
	&lt;/cfloop&gt;
&lt;/cfdocument&gt;
&lt;cffile action="write" file="#expandPath('./somefilename.swf')#" output="#f#"&gt;

&lt;object width="550" height="500"&gt;
&lt;param name="movie" value="somefilename.swf"&gt;
&lt;embed src="somefilename.swf" width="550" height="400"&gt;
&lt;/embed&gt;
&lt;/object&gt;

&lt;p&gt;
Footer
&lt;/p&gt;
</code>

Obviously you would probably use SWFObject, or another JavaScript library, to generate the HTML. You would also probably need to use a dynamic filename for the SWF. Here is the result:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 235.png">

After I sent Rob this version, I did a quick Google check and found the Terry Ryan had actually built a nice little CFC to make this even easier: <a href="http://www.numtopia.com/terry/programming/code_flashpaper_embedder.cfm">Flashpaper Embedder</a>