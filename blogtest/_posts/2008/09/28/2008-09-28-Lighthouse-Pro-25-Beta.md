---
layout: post
title: "Lighthouse Pro 2.5 (Beta)"
date: "2008-09-29T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/28/Lighthouse-Pro-25-Beta
guid: 3033
---

Tonight I'm happy to release the beta of Lighthouse 2.5. There are a lot of major changes here, so I thought I'd release it as a beta and let folks play with it a bit first. So what's different?
<!--more-->
<ul>
<li>New design by Justin Johnson, designer of the new <a href="http://www.cflib.org">CFLib</a>.</li>
<li>Milestones can be created for projects, along with an optional due date. You can then assign issues to milestones.
<li>There was a major change to the Ajax code behind the project view. In the previous versions, all the data was loaded on the first load. This made sorting/filtering super quick, but when projects got a bit large, it made that first hit really slow. I had a client with 400+ bugs, and it got to be pretty unusable. I switched to using Ajax to load a page of data at a time. So when you sort, or filter, it does a new HTTP request, but since it's just passing JSON around, it should still be pretty zippy. My feeling here was - keep the funcitonality the same - but ensure that larger clients wouldn't be 'punished' speed wise. Hopefully this works out well for folks.
<li>As part of the above change, I switched from Spry to jQuery. This was <b>not</b> done because Spry couldn't handle the functionality. It was done so I could play more with jQuery. 
<li>The application includes some basic documentation in itself now. So for less-technical users who are new to the idea of issue trackers in general, we can provide them with a bit of direction.
<li>ColdSpring. More on that in a sec.
<li>When you edit an issue, the email was always pretty good about detailing the changes (status changed from X to Y), now the history field will do the same thing as well. 
</ul>

Ok, some quick screen shots:


<h2>Login Screen</h2>
<img src="https://static.raymondcamden.com/images/Picture 122.png">

<h2>Home Screen</h2>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 28.png">

<h2>Issue Screen</h2>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 37.png">

You can find the download below. Please note that this is beta, and should be handled with care. The readme tells you what to do on the database side. I'll blog a bit later today about the ColdSpring integration. I may also blog a bit more detail about the Ajax change if folks are interested.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FLighthouseProSVN4%{% endraw %}2Ezip'>Download attached file.</a></p>