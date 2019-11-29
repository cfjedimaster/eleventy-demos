---
layout: post
title: "How to remove a password from a PDF using ColdFusion"
date: "2009-01-23T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/23/How-to-remove-a-password-from-a-PDF-using-ColdFusion
guid: 3206
---

ColdFusion makes it relatively trivial to create a PDF and password protect it. But how do you edit a PDF to remove that password? Let me begin this blog entry by saying that I am <b>convinced</b> that the solution I am about to provide is the <b>wrong</b> way to solve the problem. I truly can't believe that the awesome CFPDF tag, which does so much, doesn't provide for this simple functionality. I'll be happy to be proved right when someone posts the one line solution. Until then, here is how I solved it using DDX and the power of magical unicorns.
<!--more-->
Let's begin with a simple example of creating a PDF with password protection. This is documented of course, but I just wanted to show a quick reminder of how easy ColdFusion makes it.

<code>
&lt;cfdocument format="pdf" name="secret" userpassword="paris" encryption="128-bit"&gt;
&lt;img src="http://www.magicunicorns.us/Index3/aunirainbow.jpg" align="left"&gt;
This is the PDF that I'll protect. My bank atm is 5318008.
&lt;/cfdocument&gt;

&lt;cfheader name="Content-Disposition" value="inline; filename=foo.pdf"&gt;
&lt;cfcontent type="application/pdf" variable="#toBinary(secret)#"&gt;
</code>

This code makes a simple one line PDF, adds the password 'paris', and encrypts the document. I then serve it up witha filename of foo. Here is a quick screen shot of how it comes out in Preview (btw Mac users, you definitely want to assign Preview for PDF files and not Acrobat):

<b>Before the password...</b><br/>
<img src="https://static.raymondcamden.com/images//Picture 133.png">

<b>After the password...</b><br/>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 219.png">

Alright, so that's how we can create the password protected PDF, but how do we remove the password? Well I began by trying to use various combinations of cfpdf attributes. I tried to set newUserPassword to a blank string, but that returned an error. I tried setting encrypt to None, which is documented, but was told I didn't have permission. (This was after opening the PDF using the password option which worked just fine.) I spent a good hour just playing around and no combination worked for me. 

I was about to give up when I looked to DDX. I've blogged on DDX a few times now (my first entry may be found <a href="http://www.coldfusionjedi.com/index.cfm/2007/7/24/ColdFusion-8-Working-with-PDFs-Part-7">here</a>) and it is truly a very powerful tool. It can be a bit hard to use at times though. You have to be sure you read the docs carefully and make use of isDDX() to verify your XML is valid. Using DDX to solve this problem involves two steps really. 

The first thing we need to do is find out how to simply even work with a password protected PDF. Who cares about removing a password - we just want to be sure we can even use a password protected document to do other tasks. I did some searching in the DDX Reference and discovered that you can provide a PasswordAccessProfile element. This element lets you do a few things, one of which is a password for opening the document. Consider:

<code>
&lt;!--- Make and save the pdf ---&gt;
&lt;cfdocument format="pdf" name="secret" userpassword="paris" encryption="128-bit"&gt;
&lt;img src="http://www.magicunicorns.us/Index3/aunirainbow.jpg" align="left"&gt;
This is the PDF that I'll protect. My bank atm is 5318008.
&lt;/cfdocument&gt;

&lt;cfset fileWrite(expandPath('private.pdf'),secret)&gt;

&lt;cfset pdfpath = expandPath('./private.pdf')&gt;
&lt;cfset outfile = expandPath('./notprivate.pdf')&gt;

&lt;cfsavecontent variable="myddx"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1"&gt;
	&lt;PDF source="In1" access="mainP"/&gt;
&lt;/PDF&gt;
&lt;PasswordAccessProfile name="mainP"&gt;
	&lt;Password&gt;paris&lt;/Password&gt;
&lt;/PasswordAccessProfile&gt;
&lt;/DDX&gt;
&lt;/cfsavecontent&gt;
&lt;cfset myddx = trim(myddx)&gt;

&lt;cfset inputStruct = {% raw %}{In1="#pdfpath#"}{% endraw %}&gt;
&lt;cfset outputStruct = {% raw %}{Out1="#outfile#"}{% endraw %}&gt;

&lt;cfpdf action="processddx" ddxfile="#myddx#" inputfiles="#inputStruct#" outputfiles="#outputStruct#" name="ddxVar"&gt;
&lt;cfdump var="#ddxVar#"&gt;	
</code>

This script recreates the PDF from the previous version and saves it to the file system. DDX requires all actions to be performed at the file system and can't work with PDFs in ColdFusion variables. The DDX I created makes use of PasswordAccessProfile. It has a name for the profile, mainP, and a Password element with the password I supplied when creating the PDF. Notice than that my PDF source uses access="mainP" to say, "When accessing this PDF, use this profile." That's it really - I don't actually perform any actions on the PDF, I just open it and return it. It's the BAT file equivalent of reading a file and saving it to a new file name. 

The next step is to remove the password. That turns out to be rather simple as well. All we need to do is modify the PDF result tag and supply an encryption value:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1" encryption="None"&gt;
	&lt;PDF source="In1" access="mainP"/&gt;
&lt;/PDF&gt;
&lt;PasswordAccessProfile name="mainP"&gt;
	&lt;Password&gt;paris&lt;/Password&gt;
&lt;/PasswordAccessProfile&gt;
&lt;/DDX&gt;
</code>

I've supplied the None value which basically just strips out the encryption. Note - remember how I said DDX was a bit anal? If you use "none", as I did at first, it will not work. But it <i>will</i> actually pass the isDDX test, so you have to be careful.

So that's it. If I'm wrong and this is the only way to remove passwords from PDF, I'll make this a bit cleaner and add it to my <a href="http://pdfutils.riaforge.org">pdfUtils</a> utility CFC.

Comments? I've included the test code to this blog entry.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fpdfplay%{% endraw %}2Ezip'>Download attached file.</a></p>