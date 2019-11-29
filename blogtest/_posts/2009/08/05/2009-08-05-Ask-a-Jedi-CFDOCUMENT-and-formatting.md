---
layout: post
title: "Ask a Jedi: CFDOCUMENT and formatting"
date: "2009-08-05T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/05/Ask-a-Jedi-CFDOCUMENT-and-formatting
guid: 3474
---

Saul contacted me with an interesting little problem. He was using a simple textarea form field as a way to generate PDFs. So a user could enter some text, hit a button, and generate a PDF. For example:
<!--more-->
<code>
&lt;cfparam name="form.text" default=""&gt;

&lt;cfif trim(form.text) is ""&gt;

	&lt;form method="post"&gt;
	&lt;b&gt;Text for PDF&lt;/b&gt;&lt;br/&gt;
	&lt;textarea cols="50" rows="10" name="text"&gt;&lt;/textarea&gt;&lt;br/&gt;
	&lt;input type="submit" value="Generate PDF"&gt;

&lt;cfelse&gt;

	&lt;cfheader name="Content-Disposition" value="inline; filename=print.pdf"&gt;&lt;cfdocument format="pdf"&gt;&lt;cfoutput&gt;#form.text#&lt;/cfoutput&gt;&lt;/cfdocument&gt;

&lt;/cfif&gt;
</code>

This code uses a simple form that passes the field value to the cfdocument tag. Here is an example with some text typed in...

<img src="https://static.raymondcamden.com/images/Picture 252.png" />

But when the PDF was generated, the text came out like so:

this is a test this is a second test and this is my last test

Not quite desirable, is it? Turns out that it was really just a simple matter. Saul forgot that CFDOCUMENT expects <b>HTML</b>, not plain text. If you had used the same text in a HTML page you would get the same result. I recommended Saul try the <a href="http://www.cflib.org/udf/paragraphformat2">ParagraphFormat2</a> UDF from CFLib. It takes "plain" text and adds support for tabs and new lines automatically. Here is the modified version with the UDF included:

<code>
&lt;cfscript&gt;
/**
* An "enhanced" version of ParagraphFormat.
* Added replacement of tab with nonbreaking space char, idea by Mark R Andrachek.
* Rewrite and multiOS support by Nathan Dintenfas.
*
* @param string      The string to format. (Required)
* @return Returns a string.
* @author Ben Forta (ben@forta.com)
* @version 3, June 26, 2002
*/
function ParagraphFormat2(str) {
    //first make Windows style into Unix style
    str = replace(str,chr(13)&chr(10),chr(10),"ALL");
    //now make Macintosh style into Unix style
    str = replace(str,chr(13),chr(10),"ALL");
    //now fix tabs
    str = replace(str,chr(9),"   ","ALL");
    //now return the text formatted in HTML
    return replace(str,chr(10),"&lt;br /&gt;","ALL");
}
&lt;/cfscript&gt;

&lt;cfparam name="form.text" default=""&gt;

&lt;cfif trim(form.text) is ""&gt;

	&lt;form method="post"&gt;
	&lt;b&gt;Text for PDF&lt;/b&gt;&lt;br/&gt;
	&lt;textarea cols="50" rows="10" name="text"&gt;&lt;/textarea&gt;&lt;br/&gt;
	&lt;input type="submit" value="Generate PDF"&gt;

&lt;cfelse&gt;

	&lt;cfheader name="Content-Disposition" value="inline; filename=print.pdf"&gt;&lt;cfdocument format="pdf"&gt;&lt;cfoutput&gt;#paragraphFormat2(form.text)#&lt;/cfoutput&gt;&lt;/cfdocument&gt;

&lt;/cfif&gt;
</code>

Notice how I wrap the output of the form data with the call. This will take in the plain text and add the HTML that CFDOCUMENT will be happy with (and that's whats important - making our little CF tags happy, right?).