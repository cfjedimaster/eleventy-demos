---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 4)"
date: "2007-07-13T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/13/ColdFusion-8-Working-with-PDFs-Part-4
guid: 2195
---

So far I've covered getting info with PDFs and adding watermarks. In this entry I'll talk about removing pages from a PDF. It will be a short entry as the syntax is rather simple. Why would you want to remove pages? You may want to remove legal junk or other fluff. You may want to take a source PDF and delete most of the PDF to create a preview. Whatever you have in mind, ColdFusion makes it simple to do. Let's take a look at an example.
<!--more-->
I'm going to use the same PDF generator I used in the previous entry:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;
&lt;cfloop index="x" from="1" to="40"&gt;
&lt;p&gt;
doloras lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
&lt;/p&gt;
&lt;/cfloop&gt;
&lt;/cfdocument&gt;
</code>

I've increased the size a bit. Now let's see how big the PDF is:

<code>
&lt;cfpdf action="getinfo" source="mydocument" name="data"&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Total pages: #data.totalpages#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

Because the PDF has a bit of randomness in it, the total you see here will vary. For my last test the number was 5.

Now lets delete some pages. As you can guess, the action provided to CFPDF is deletePages. To determine what pages are removed, you use the pages attribute. This can be:

<ul>
<li>A page number (2 for example)
<li>A page range (6-10 for exsample)
<li>Any combination of the above (2,4,9-12)
</ul>

For my example I'll delete pages one through three:

<code>
&lt;cfpdf action="deletepages" source="mydocument" pages="1-3" overwrite="true" name="mydocument"&gt;
</code>

And then display information about the PDF again:

<code>
&lt;cfpdf action="getinfo" source="mydocument" name="data"&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Total pages now: #data.totalpages#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

All together here is the demo I wrote:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;
&lt;cfloop index="x" from="1" to="40"&gt;
&lt;p&gt;
doloras lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
&lt;/p&gt;
&lt;/cfloop&gt;
&lt;/cfdocument&gt;

&lt;cfpdf action="getinfo" source="mydocument" name="data"&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Total pages: #data.totalpages#
&lt;/p&gt;
&lt;/cfoutput&gt;


&lt;cfpdf action="deletepages" source="mydocument" pages="1-3" overwrite="true" name="mydocument"&gt;

&lt;cfpdf action="getinfo" source="mydocument" name="data"&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Total pages now: #data.totalpages#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

As an interesting aside, I plan on sharing a demo at the end of this series that demonstrates a lot of these methods rolled together into one application. One of the features my application has is a page viewer. It lets you view one page from a PDF. How did I do this? I simply used deletePages to remove every page <i>but</i> the one you want to see. So while CFPDF doesn't have a getPage action, it is easy enough to build one yourself.