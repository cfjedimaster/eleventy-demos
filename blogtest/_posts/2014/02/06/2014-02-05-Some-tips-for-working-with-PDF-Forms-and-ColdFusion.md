---
layout: post
title: "Some tips for working with PDF Forms and ColdFusion"
date: "2014-02-06T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/02/06/Some-tips-for-working-with-PDF-Forms-and-ColdFusion
guid: 5146
---

<p>
ColdFusion has had the ability to work with PDF forms for a while, but I never got a chance to actually play with it till last night. A client needed me to build a simple POC that used an HTML form to accept user input. This user needed the input to be passed to the PDF and saved there. For the most part the process was painless, but there were a few gotchas I wanted to share with folks.
</p>
<!--more-->
<p>
The first thing I ran into was that the initial PDF was not compliant with ColdFusion's PDF form handling. The PDF certainly <i>looked</i> normal. I could open it in Acrobat. I could see and modify form fields. But in ColdFusion something odd happened when I tried to get data out of it.
</p>

<pre><code class="language-markup">
&lt;cfpdfform action=&quot;read&quot; source=&quot;#expandPath(&#x27;.&#x2F;cms116.pdf&#x27;)#&quot; xmldata=&quot;x&quot; result=&quot;r&quot;&gt;
&lt;&#x2F;cfpdfform&gt;
&lt;cfdump var=&quot;#x#&quot; label=&quot;XMLData&quot;&gt;
&lt;cfdump var=&quot;#r#&quot; label=&quot;Result&quot;&gt;
</code></pre>

<p>
The code above should have retrieved the form data as both a struct and XML. When I ran it I got: Either datafile XML or data XML contained in the PDF document is invalid.
</p>

<p>
On a whim I got rid of the result attribute. Then it worked. But if I tried to parse the XML variable (X), I got an error stating the XML was invalid. At this point I had no idea what to do so I asked around. All around smart guy Dave Watts suggested that the PDF I had was probably using an older style of form called "AcroForm". I needed a PDF using the newer style called a LiveCycle form. He went on to say:
</p>

<blockquote>
It has to be a LiveCycle form. LiveCycle forms are created using
LiveCycle Designer, which ships with Acrobat Pro (and is available
separately). LC forms are basically a PDF container for an XFA payload
- the form itself is represented as an XML document conforming to the
XFA schema. Forms created directly in Acrobat are not LC forms -
they're generally called "AcroForms". Third-party PDF form creation
tools generally create AcroForms rather than LC forms, but there may
be third-party tools available that create LC forms that I don't know
about.
<br/><br/>
<a href="http://en.wikipedia.org/wiki/XFA">http://en.wikipedia.org/wiki/XFA</a>
</blockquote>

<p>
Luckily the client had a newer form of the PDF and as soon as I changed to that, it worked. So cool. I still think ColdFusion should be able to sniff that form type and throw an exception (one that is helpful), but, now you know, and knowing is you know what.
</p>

<p>
Now that my script worked, I could use the struct as a way of seeing the names of the form fields. This is important because you probably can't guess them just by looking. Some fields did have obvious names but many did not. I ended up using this script as a guide for building my code that would then set the fields.
</p>

<p>
Here is where things got weird though. For text fields, you could easily set them by just supplying a value:
</p>

<pre><code class="language-markup">&lt;cfpdfformparam name=&quot;FACILITy NAME&quot; value=&quot;#form.facilityname#&quot;&gt;</code></pre>

<p>
That just worked. But checkboxes were a bit weird. I tried setting them by using true, 1, and "checked" as values, but nothing worked. So then I went back to my original PDF form and did the obvious - I checked the checkbox. I then saved it, reran my "get the fields and dump them" script, and I saw that when I checked a checkbox, the value was On. Setting it to Off would turn it off. 
</p>

<p>
To make it even more interesting, not all checkboxes act the same. Another field on the form had something like this:  "Is Ray Cool  [ ]No [ ]Yes". I assumed there would be two fields for this representing each checkbox. Instead there was only one. And get this. The no value was only true when the value was No and yes was only true when the value was yes. Both of these were case sensitive. Again - I had to use my original form quite a bit here to see what values were being persisted when I entered data.
</p>

<p>
Hope this helps! Here is the complete POC I built. I can't share the original PDF, but hopefully it gives you an idea of how such an app could be built. Note that normally I'd use a dynamic name for the PDF as the code right now would not work with multiple users.
</p>

<pre><code class="language-markup">
&lt;cfif structKeyExists(form, &quot;submit&quot;)&gt;

	&lt;cfpdfform action=&quot;populate&quot; source=&quot;#expandPath(&#x27;.&#x2F;cms116_2.pdf&#x27;)#&quot; destination=&quot;#expandPath(&#x27;.&#x2F;test.pdf&#x27;)#&quot; overwrite=true&gt;
		&lt;!--- text field ---&gt;
		&lt;cfpdfformparam name=&quot;FACILITy NAME&quot; value=&quot;#form.facilityname#&quot;&gt;
		&lt;!--- checkbox it MUST be &quot;On&quot;, not &quot;on&quot; ---&gt;
		&lt;cfif structKeyExists(form, &quot;initialapp&quot;)&gt;
			&lt;cfpdfformparam name=&quot;Initial Application&quot; value=&quot;On&quot;&gt;
		&lt;cfelse&gt;
			&lt;cfpdfformparam name=&quot;Initial Application&quot; value=&quot;Off&quot;&gt;
		&lt;&#x2F;cfif&gt;
		&lt;!--- testing yes no ---&gt;
		&lt;cfpdfformparam name=&quot;Is this a shared lab&quot; value=&quot;#form.sharedlab#&quot;&gt;
	&lt;&#x2F;cfpdfform&gt;

	&lt;p&gt;
		PDF saved: &lt;a href=&quot;test.pdf&quot;&gt;test.pdf&lt;&#x2F;a&gt;
	&lt;&#x2F;p&gt;

&lt;&#x2F;cfif&gt;

&lt;form method=&quot;post&quot;&gt;
	facility name: &lt;input type=&quot;text&quot; name=&quot;facilityname&quot;&gt;&lt;br&#x2F;&gt;
	initial application? &lt;input type=&quot;checkbox&quot; name=&quot;initialapp&quot;&gt;&lt;br&#x2F;&gt;
	shared lab? &lt;select name=&quot;sharedlab&quot;&gt;
	&lt;option&gt;yes&lt;&#x2F;option&gt;
	&lt;option&gt;No&lt;&#x2F;option&gt;
	&lt;&#x2F;select&gt;&lt;br&#x2F;&gt;
	&lt;input type=&quot;submit&quot; name=&quot;submit&quot;&gt;
&lt;&#x2F;form&gt;

</code></pre>