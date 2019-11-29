---
layout: post
title: "Very odd CFDOCUMENT Bug"
date: "2014-03-16T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/03/16/Very-off-CFDOCUMENT-Bug
guid: 5176
---

<p>
Every now and then I can't find a good solution for a reader so I take to the "airways" and ask my good readers for help. This is one of those days. Rick emailed me a few days ago with an interesting issue.
</p>
<!--more-->
<p>
He had a query that he used to create a set of PDFs. In each PDF, he included a bit of dynamic data, like name, age, etc. It worked, but something odd happened. Consider the following sample code.
</p>

<pre><code class="language-markup">&lt;cfset getStudents = queryNew(&quot;fname,lname,email&quot;, &quot;cf_sql_varchar,cf_sql_varchar,cf_sql_varchar&quot;, [
	{% raw %}{fname:&quot;Ray&quot;,lname:&quot;Camden&quot;,email:&quot;raymondcamden@gmail.com&quot;}{% endraw %},
	{% raw %}{fname:&quot;Joe&quot;,lname:&quot;Blow&quot;,email:&quot;jblow@gmail.com&quot;}{% endraw %},
	{% raw %}{fname:&quot;Scott&quot;,lname:&quot;Stroz&quot;,email:&quot;boyzoid@gmail.com&quot;}{% endraw %}]
	)&gt;


&lt;cfoutput&gt;
 
    &lt;cfloop query=&quot;getStudents&quot;&gt;
   
        &lt;cfdocument format=&quot;pdf&quot; orientation=&quot;landscape&quot; name=&quot;certificate&quot;&gt;

        	&lt;p style=&quot;background-image:url(cert.jpg);background-repeat:no-repeat;height:680px;width:900px&quot;&gt;
			&lt;font size=&quot;+2&quot;&gt;#fname# #lname#&lt;/font&gt;
			&lt;/p&gt;
			
        &lt;/cfdocument&gt;
       
        &lt;cfmail from=&quot;no_reply@monoc.org&quot; to=&quot;#email#&quot; subject=&quot;Your Course Completion Certificate&quot; type=&quot;html&quot;&gt;
       
	        &lt;cfmailparam file=&quot;certificate.pdf&quot; type=&quot;application/pdf&quot; content=&quot;#certificate#&quot; /&gt;
        &lt;/cfmail&gt;
       
    &lt;/cfloop&gt;
   
&lt;/cfoutput&gt;
</code></pre>

<p>
Pretty straightforward, right? Each PDF is stored in memory and then attached to an email. When executed, emails go out, the text is dynamic per the code specified, <i>but</i> only the first PDF has the background attachment as defined in CSS. 
</p>

<p>
As an FYI, when you create emails with attachments, you can find the attachments pretty easily. Open the mail file first, and then make note of the file line. Here is a sample from one of my tests: <code>file:  /Applications/ColdFusion10/cfusion/runtime/work/Catalina/localhost/tmp/cftmp1249913661563960132.tmp</code>
</p>

<p>
The file is named .tmp, but I found the file, renamed it .pdf, and was able to view it just fine.
</p>

<p>
Anyway, I did some digging into this and immediately found some interesting tips:
</p>

<ul>
<li>Use localurl="true"</li>
<li>Use a file:/// path</li>
</ul>

<p>
But none of these worked. I also tried adding a bit of randomness to the URL, thinking it was something in ColdFusion's request handling, but that didn't work either. I then made the variable used for PDF data dynamic. Why? Who the heck knows. I was trying everything. Here is the final version of the script, and one you can run yourself, to see the bug in action.
</p>

<pre><code class="language-markup">&lt;cfset getStudents = queryNew(&quot;fname,lname,email&quot;, &quot;cf_sql_varchar,cf_sql_varchar,cf_sql_varchar&quot;, [
	{% raw %}{fname:&quot;Ray&quot;,lname:&quot;Camden&quot;,email:&quot;raymondcamden@gmail.com&quot;}{% endraw %},
	{% raw %}{fname:&quot;Joe&quot;,lname:&quot;Blow&quot;,email:&quot;jblow@gmail.com&quot;}{% endraw %},
	{% raw %}{fname:&quot;Scott&quot;,lname:&quot;Stroz&quot;,email:&quot;boyzoid@gmail.com&quot;}{% endraw %}]
	)&gt;


&lt;cfoutput&gt;
 
    &lt;cfloop query=&quot;getStudents&quot;&gt;
   
        &lt;cfdocument format=&quot;pdf&quot; orientation=&quot;landscape&quot; name=&quot;certificate#currentRow#&quot; localurl=&quot;true&quot;&gt;

        	&lt;p style=&quot;background-image:url(cert.jpg);background-repeat:no-repeat;height:680px;width:900px&quot;&gt;
			&lt;font size=&quot;+2&quot;&gt;#fname# #lname#&lt;/font&gt;
			&lt;/p&gt;
			&lt;hr/&gt;
			&lt;p style=&quot;background-image:url(file:///Users/ray/Dropbox/websites/testingzone/cert.jpg);background-repeat:no-repeat;height:680px;width:900px&quot;&gt;
			&lt;font size=&quot;+2&quot;&gt;#fname# #lname#&lt;/font&gt;
			&lt;/p&gt;
			&lt;hr/&gt;
			&lt;p style=&quot;background-image:url(cert.jpg?x=#createUUID()#);background-repeat:no-repeat;height:680px;width:900px&quot;&gt;
			&lt;font size=&quot;+2&quot;&gt;#fname# #lname#&lt;/font&gt;
			&lt;/p&gt;
			
        &lt;/cfdocument&gt;
       
       &lt;cfset content = variables[&quot;certificate#currentRow#&quot;]&gt;
        &lt;cfmail from=&quot;no_reply@monoc.org&quot; to=&quot;#email#&quot; subject=&quot;Your Course Completion Certificate&quot; type=&quot;html&quot;&gt;
       
	        &lt;cfmailparam file=&quot;certificate.pdf&quot; type=&quot;application/pdf&quot; content=&quot;#content#&quot; /&gt;
        &lt;/cfmail&gt;
       
    &lt;/cfloop&gt;
   
&lt;/cfoutput&gt;</code></pre>

<p>
So... any ideas? 
</p>