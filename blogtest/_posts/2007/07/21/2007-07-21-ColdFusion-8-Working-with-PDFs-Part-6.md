---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 6)"
date: "2007-07-21T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/21/ColdFusion-8-Working-with-PDFs-Part-6
guid: 2210
---

Welcome to another installment in my series covering changes to PDF management in ColdFusion 8. If you haven't read the earlier stories, please see the links below in the Related Entries section. Todays entry is about security. This will just be a high level overview of what you can do. Check the documents for more specific information.

At a basic level, there are three basic things we can do with CFPDF:

<ol>
<li>Set a password for opening the PDF
<li>Set restrictions on the document
<li>Set the encryption style for the document
</ol>

All of these feature uses the Protect value for the action attribute of cfpdf. Let's start with the first one. Now you have always been able to set a password for a PDF when using cfdocument. But if you want to <i>add</i> a password to a document than you would need to use cfpdf. Here is a very simple example:

<code>
&lt;cfdocument format="pdf" name="mydoc"&gt;

&lt;h2&gt;Wit and Wisdom of Paris Hilton&lt;/h2&gt;

&lt;p&gt;
This space left intentionally blank.
&lt;/p&gt;

&lt;/cfdocument&gt;

&lt;cfpdf action="protect" source="mydoc" newUserPassword="password" destination="test.pdf" overwrite="true"&gt;
</code>

Remember what I said above - you can set a password directly in the cfdocument tag. I'm just using this so folks can cut and paste directly into their editor. So as you can see - I create a simple PDF with cfdocument. Next I use cfpdf with the protection action. I specified a password and a destination to save the file. If I try to open this PDF I'll get prompted to enter a password. 

Next lets look at a simple permissions example. Let's say we want to make a PDF, but we don't want people to copy from the document or print it. (And let's pretend we don't know what a screen capture program is.) All I have to do is specify an owner password and a set of permissions. The owner password allows an owner to modify the security of the PDF and the permissions detail what is allowed. Unfortunately you cannot specify what isn't allowed, you can only specify what is allowed. So in order to block printing and copying, I have to pass everything else. 

<code>
&lt;cfdocument format="pdf" name="mydoc"&gt;

&lt;h2&gt;Wit and Wisdom of Paris Hilton&lt;/h2&gt;

&lt;p&gt;
This space left intentionally blank.
&lt;/p&gt;

&lt;/cfdocument&gt;

&lt;cfpdf action="protect" source="mydoc" newOwnerPassword="opassword" destination="test2.pdf" overwrite="true"
		permissions="AllowAssembly,AllowFillIn,AllowModifyAnnotations,AllowModifyContents,AllowScreenReaders,AllowSecure"	
			&gt;
</code>

The permissions I left out were: AllowCopy,AllowDegradedPrinting,AllowPrinting. If I open this PDF and try to copy text, I'll get a warning beep. The print option is grayed out. 

Now for the final example. When you secure PDF documents, ColdFusion will encrypt them using RC4 128-bit encryption. Frankly that could have been BattleStar Galatica encryption as I know next to nothing about the various types of encryption. But if you <i>are</i> concerned about the level of encryption, you can specify it using the encrypt attribute. Valid values are: AES_128, RC4_128M, RC4_128, RC4_40, and None. 

What are some practical examples of this feature? Well obviously it is a good way to secure normally open PDF documents. You can image your source PDFs being 100% open, and then creating secured PDFs for download. Something else you could do is modify the encryption level if your web site user is outside the US. (Again, I know next to nothing about encryption, but I seem to remember that some levels of protection can't be exported. So you could have a lesser secure version for international visitors.)