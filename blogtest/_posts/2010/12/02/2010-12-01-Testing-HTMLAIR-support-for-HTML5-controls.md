---
layout: post
title: "Testing HTML/AIR support for HTML5 controls"
date: "2010-12-02T09:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/12/02/Testing-HTMLAIR-support-for-HTML5-controls
guid: 4036
---

There has been some discussion on the <a href="http://groups.google.com/group/air-html-js/topics">HTML/AIR listserv</a> recently about the webkit rendering engine used within AIR, especially in regards to HTML5. There is a great article on the topic at the Adobe Developer Center: <a href="http://www.adobe.com/devnet/air/ajax/articles/air_and_webkit.html">What's new about HTML, HTML5, CSS, and JavaScript in AIR 2.5?</a>. As an experiment, I decided to create a quick HTML/AIR application that would go through all of the HTML5 items related to form fields. For my documentation I used <a href="http://diveintohtml5.org/forms.html">A Form Of Madness</a> (great title!) from the Dive into HTML5 site. I simply went through his examples and created an HTML page with every one.
<!--more-->
<p/>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        
    &lt;/head&gt;
    &lt;body&gt;
	
	&lt;!-- Sample code thanks to: http://diveintohtml5.org/forms.html --&gt;
	&lt;form&gt;
	
	&lt;p&gt;
	&lt;b&gt;Placeholder test (should see text in field):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" name="placeholder" placeholder="Placeholder FTW"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;b&gt;Autofocus (if you can type in here w/o clicking, it is working):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" name="autofocus" autofocus&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;b&gt;Type="email" (on mobile it would use a keyboard optimized for email):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="email" name="email"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="url" (on mobile it would use a keyboard optimized for urls):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="url" name="url"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="number" (creates a 'spinbox'):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="number" name="number" min="0" max="10" step="2" value="6"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="range" (creates a 'slider'):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="range" name="range" min="0" max="10" step="2" value="6"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="date" (creates a calendar):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="date" name="date"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="month" (creates a calendar):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="month" name="month"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="week" (creates a calendar):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="week" name="week"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="time" (creates a time picker):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="time" name="time"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="datetime" (creates a calendar + time picker):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="datetime" name="datetime"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="datetime-local" (creates a calendar + time picker):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="datetime-local" name="datetime-local"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="search" (rounded corners):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="search" name="search"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Type="color" (creates a color picker):&lt;/b&gt;&lt;br/&gt;
	&lt;input type="color" name="color"&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;b&gt;Required (would color the field if not filled in:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" name="required" required&gt;
	&lt;/p&gt;

	&lt;p&gt;
	&lt;input type="submit" value="Submit"&gt;
	&lt;/p&gt;
	
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

If you read the "Form of Madness" article than you will quickly see that - like most of HTML5 - support is a bit... varied. So I didn't expect much of the above to work within AIR just yet. From my testing I found the following:

<p>

<ul>
<li>Both autofocus and placeholder work just fine. Those are two darn handy features so I'm glad to see that. 
<li>Everything else (except range) simply defaulted to a normal text field. Cool. We've got alternatives like <a href="http://ui.jquery.com">jQuery UI</a> so I'm not too concerned.
<li>The range field - oddly - didn't render at all. That was surprising. It should have simply defaulted to a text field.
</ul>

Anyway, I don't know if this is useful for anyone but you can download the .AIR file below if you want to run this yourself.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FHTML5Forms%{% endraw %}2Eair'>Download attached file.</a></p>