---
layout: post
title: "Galleon ColdFusion 9 fix, and pagination UI update"
date: "2009-07-23T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/23/Galleon-ColdFusion-9-fix-and-pagination-UI-update
guid: 3461
---

<p>
I got my <a href="http://www.raymondcamden.com/forums">forums</a> back up and in the process of doing so - found two interesting issues. 
</p>
<p>
First - Image.cfc (which is from the open source <a href="http://www.opensourcecf.com/imagecfc/">ImageCFC</a> project) made use of a CFC method called Throw. This allowed code in the CFC to do:
</p>

<p>
<code>
&lt;cfset throw("Paris Hilton recommend some awesome new shoes. Shaweet!")&gt;
</code>
</p>

<p>
Unfortunately this conflicts with ColdFusion 9's built in support for throwing via script. My "fix" was to simply rename all the throw calls to xc989082903480983894840894328093289042389. Now the code does:
</p>

<code>
&lt;cfset xc989082903480983894840894328093289042389("code readability ftw!")&gt;
</code>

<p>
Ok... I lie. I just renamed it mythrow, and updated the method definition as well. 
</p>

<p>
Now for the UI issue. The ColdFusion/General <a href="http://www.coldfusionjedi.com/forums/threads.cfm?forumid=55295D16-0237-9D67-543513A1C4C22E25">forum</a> has a ginormous number of threads. This created the following "interesting" UI:
</p>

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 249.png" />
</p>

<p>
That's awesome, isn't it? All it needs is a unicorn or two to spruce it up.
</p>

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/image_1248387116520.jpg" />
</p>

<p>
So I thought that wouldn't fly. What I ended up doing is simply adding some logic to say - if there are so many pages, switch to a drop down:
</p>

<code>
&lt;p&gt;Page:
	&lt;cfif attributes.pages gt 10&gt;
		&lt;select onChange="document.location.href=this.options[this.selectedIndex].value"&gt;
			&lt;cfloop index="x" from=1 to="#attributes.pages#"&gt;
				&lt;option value="#cgi.script_name#?#qs#&page=#x#" &lt;cfif url.page is x&gt;selected&lt;/cfif&gt;&gt;Page #x#&lt;/option&gt;
			&lt;/cfloop&gt;
		&lt;/select&gt;
	&lt;cfelse&gt;
	&lt;cfloop index="x" from=1 to="#attributes.pages#"&gt;
		&lt;cfif url.page is not x&gt;&lt;a href="#cgi.script_name#?#qs#&page=#x#"&gt;#x#&lt;/a&gt;&lt;cfelse&gt;#x#&lt;/cfif&gt;
	&lt;/cfloop&gt;
	&lt;/cfif&gt;
&lt;/p&gt;	
</code>

<p>
Which results in:
</p>

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 333.png" />
</p>

<p>
Somewhat better I think. <a href="http://www.fullcitymedia.com">Full City Media</a>, who did the original skin for Galleon 2, is sending me over a small CSS tweak for it that I'll include in the new version shipping tomorrow morning.
</p>