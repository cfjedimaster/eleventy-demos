---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 7)"
date: "2007-07-24T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/24/ColdFusion-8-Working-with-PDFs-Part-7
guid: 2217
---

In today's entry I'll be discussing the processDDX action of the CFPDF tag. I have to admit that I wasn't looking forward to this entry. Every time I had looked at the documentation, it just didn't make sense. I didn't see the point. But now that I've looked at it again more in depth, I'm almost in awe at how cool this feature is. I'm definitely just scratching the surface in this blog post, but hopefully it will encourage others to look into DDX and how it works with ColdFusion.
<!--more-->
So as you can probably guess, CFPDF's processDDX action lets ColdFusion work with DDX. Ok, so what in the heck is DDX? DDX stands for Document Description XML. You can think of it like a template for a PDF file. At a basic level, it lets you lay out PDF files (like the Merge option does) and add special commands (generate a table of contents for example). DDX is used by Adobe's LiveCycle Assembler product. ColdFusion ships with a stripped down version of this product. The exact XML tags <i>not</i> allowed in ColdFusion are listed in the documentation. As far as I can see, there is no way to enter a serial and enable the full power of LiveCycle Assembler. But even with the restrictions there is an incredible amount of power that you have built in. As I mentioned above, this entry is only going to talk at a high level about DDX. You can find the DDX reference <a href="http://livedocs.adobe.com/livecycle/es/sdkHelp/programmer/sdkHelp/ddxRefMain.150.1.html">here</a>. Also as Charlie Arehart has mentioned in a comment in my PDF series, the ColdFusion documentation is <i>excellent</i>. I want to credit them for my examples below as all are either direct copies or modified versions of their examples. Also note that this is a very complex topic. There is a good chance I will screw something up so please let me know if I do. 

Let's begin by talking about how you use DDX in ColdFusion. ColdFusion 8 adds an isDDX() function. This function takes either a relative/absolute path to a filename or an actual string of DDX tags. Don't worry too much about the XML just yet, but here is a simple example of checking a string to see if it is valid DDX:

<code>
&lt;cfsavecontent variable="myddx"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1"&gt;
&lt;PDF source="Title"/&gt;
&lt;TableOfContents/&gt;
&lt;PDF source="Doc1"/&gt;
&lt;PDF source="Doc2"/&gt;
&lt;/PDF&gt;
&lt;/DDX&gt;
&lt;/cfsavecontent&gt;
&lt;cfset myddx = trim(myddx)&gt;

&lt;cfif isDDX(myddx)&gt;
yes, its ddx
&lt;cfelse&gt;
no its not
&lt;/cfif&gt;
</code>

In this example I've just used the CFSAVECONTENT tag to wrap my DDX XML. I trim it and then check to see if it is DDX. Now that I've shown you a bit of DDX, let me talk a bit about what that example does. Ignoring the DDX tag, there are 2 XML tags in use here, PDF and TableOfContents. The first PDF tag uses result="Out1" and wraps the other tags. This basically says the result of everything on the inside should be put into a result named Out1. On the inside there are 3 PDF tags with a source. You can think of this like a merge. The tags specify an order based on names: Title, Doc1, and Doc2. So far so good. But then note that a TableOfContents tag exists right after the Title PDF. This particular tag can do a lot - but at a basic level, it just says, "Create a table of contents using the PDFs following me."

So let me repeat what I said above. This is partially for my sake to ensure I'm describing it right (remember what I said, I'm new to this!). What we have is a template that takes 3 PDFs. It puts the Title PDF first. It defines a page as a Table of Contents. It then lays down two more PDFs. Let's take a look at how ColdFusion can work with this DDX.

First note that the DDX worked with PDF names. Notice I don't have any real file names. Nor do I have ColdFusion variables. Instead I have labels like Out1, Title, Doc1, and Doc2. So we need a way to pass real values so that LiveCycle Assembler can use them when processing the DDX. The CFPDF tag takes two related attributes, inputFiles and outputFiles. Each of these are a structure of names to file names. So using our sample DDX above, I can define my 3 input PDFs like so:

<code>
&lt;cfset inputStruct=StructNew()&gt;
&lt;cfset inputStruct.Title="title.pdf"&gt;
&lt;cfset inputStruct.Doc1="paris.pdf"&gt;
&lt;cfset inputStruct.Doc2="booger.pdf"&gt;
</code>

Defining the output file is also struct based:

<code>
&lt;cfset outputStruct=StructNew()&gt;
&lt;cfset outputStruct.Out1="output1.pdf"&gt;
</code>

Ok so at this point I've detailed all the various variables used in the DDX file. Now lets use CFPDF to run the process:

<code>
&lt;cfpdf action="processddx" ddxfile="#myddx#" inputfiles="#inputStruct#" outputfiles="#outputStruct#" name="ddxVar"&gt;
</code>

Pretty trivial I think. I passed in my structs and DDX. At this point I now have a result. If I dump ddxVar, I will see a structure. Each key of the structure maps to the output key from my DDX. I had used this tag:

<code>
&lt;PDF result="Out1"&gt;
</code>

So ddxVar.out1 will contain a status message for my result. It will either be "successful" or "failed" followed by a reason. One quick note. You will notice I used paths for my PDFs. In order to use DDX, you have to work with real files. You can't pass in a PDF created in memory. Obviously you can make the PDF on the fly and save it in the same request. 

If you view your PDF now (remember it was named output1.pdf), you may notice that you don't have a table of contents. Turns out that the TableOfContents tag looks for a bookmark. I had to switch this code:

<code>
&lt;cfdocument format="pdf" filename="paris.pdf" overwrite="true"&gt;
&lt;h2&gt;Paris Hilton&lt;/h2&gt;

&lt;p&gt;
Here is the collected wisdom of Paris Hilton.
&lt;/p&gt;
&lt;/cfdocument&gt;
</code>

To this:

<code>
&lt;cfdocument format="pdf" filename="paris.pdf" overwrite="true" bookmark="true"&gt;
&lt;cfdocumentsection name="Paris Section"&gt;
&lt;h2&gt;Paris Hilton&lt;/h2&gt;

&lt;p&gt;
Here is the collected wisdom of Paris Hilton.
&lt;/p&gt;
&lt;/cfdocumentsection&gt;
&lt;/cfdocument&gt;
</code>

Note the use of bookmark=true and a cfdocumentsection that wraps the entire page. That was slightly confusing at first, but the end result is perfect. What is great is that my <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> site will be able to benefit from this. Right now I have something like 120+ pages in a PDF with no real easy way to navigate. By using DDX I'll be able to add a real table of contents to document!

So what else can you do with DDX? As I mentioned some features were removed from the bundled product, but what is left is still pretty awesome. Charlie Arehart added a comment to another of my blog articles saying that he wished it were simpler to add a watermark to a PDF. I.e., just add "Foo" to the PDF without needing to make a new PDF or an image. Turns out DDX supports that as well. Here is some sample DDX that demonstrates how to apply a watermark. Again - check the <a href="http://livedocs.adobe.com/livecycle/es/sdkHelp/programmer/sdkHelp/ddxRefMain.150.1.html">LiveCycle Assembler DDX documentation</a> for explicit documentation on each tag.

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1"&gt;
&lt;PDF source="Doc1"&gt;
&lt;Watermark rotation="30" opacity="50%"&gt;
&lt;StyledText&gt;&lt;p font-size="85pt" font-weight="bold" color="gray" font="Arial"&gt;FINAL&lt;/p&gt;&lt;/StyledText&gt;
&lt;/Watermark&gt;
&lt;/PDF&gt;
&lt;/PDF&gt;
&lt;/DDX&gt;
</code>

Nothing too terribly complex here. Frankly I find this a bit easier than <a href="http://www.raymondcamden.com/index.cfm/2007/7/13/ColdFusion-8-Working-with-PDFs-Part-3">earlier PDF and watermarks</a> blog article. Maybe not easier per se - but I find it to be more direct. And in case it isn't obvious - since the DDX is completely abstracted, you can pass any PDF in that you want and specify any output. One thing I'm not sure on is if the value of the watermark, the text, can be dynamic as well. Obviously I can generated my DDX in ColdFusion, so yes, it can be dynamic, but I'm curious to know if DDX supports variables for values like the text between the P tags. 

One more example. I always wondering why there wasn't a way to read the text of a PDF. Turns out there is - DDX. Consider this simple DDX example:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;DocumentText result="Out1"&gt;
&lt;PDF source="doc1"/&gt;
&lt;/DocumentText&gt;
&lt;/DDX&gt;
</code>

Here is the source PDF I used:
<code>
&lt;cfdocument format="pdf" filename="paristoberead.pdf" overwrite="true"&gt;
&lt;h2&gt;Paris Hilton&lt;/h2&gt;

&lt;p&gt;
&lt;cfoutput&gt;
This is the text of a PDF. It has a bit of randomness (#randRange(1,100)#) in it.
&lt;/cfoutput&gt;
&lt;/p&gt;

&lt;cfdocumentitem type="pagebreak" /&gt;

&lt;h2&gt;Fetch Adams&lt;/h2&gt;

&lt;p&gt;
&lt;cfoutput&gt;
This is the second page. It has a bit of randomness (#randRange(1,100)#) in it.
&lt;/cfoutput&gt;
&lt;/p&gt;

&lt;/cfdocument&gt;
</code>

When processed, you get an XML file. The result will look something like so:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DocText xmlns="http://ns.adobe.com/DDX/DocText/1.0/"&gt;
&lt;TextPerPage&gt;
&lt;Page pageNumber="1"&gt;Paris Hilton This is the text of a PDF . It has a bit of randomness ( 67 ) in it .&lt;/Page&gt;
&lt;Page pageNumber="2"&gt;Fetch Adams This is the second page . It has a bit of randomness ( 7 ) in it .&lt;/Page&gt;
&lt;/TextPerPage&gt;
&lt;/DocText&gt;
</code>

Notice how the HTML was removed. What's cool about this is that if you ned to index PDF data and you don't want to use Verity, you could use this instead. (I think tonight I'll write a quick UDF just for this.)

That's it for this blog entry. I want to remind folks - DDX is a big topic and I didn't cover much at all. I also used a lot of code in this example so I've taken all my test CFMs and PDFs and packaged them as a zip attached to this article.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fddxpdf%{% endraw %}2Ezip'>Download attached file.</a></p>