---
layout: post
title: "Ask a Jedi: Another CF8 Ajax question - Running code when stuff loads"
date: "2008-01-31T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/31/Ask-a-Jedi-Another-CF8-Ajax-question-Running-code-when-stuff-loads
guid: 2627
---

This is another question that I've covered before, but I think it makes sense to bring it up again. Matt asks:

<blockquote>
<p>
I need some help with a problem that I have run into multiple times. I've looked all over for a solution and wasted countless hours trying to figure this out but just can't seem to get it.

My problem is with the new AJAX containers in CF8 (cfdiv, cflayout, etc.). I need to know when the container has finished loading successfully; That way i can bind javascript functions to some of the html elements that were loaded dynamically. Right now my workaround has been to use setInterval to constantly check if an element has been loaded but that is just an ugly hack I need to get away from. I know that using the "Coldfusion.navigate" function allows me to specify a callback handler which is exactly what I need, but there are instances where I really can't use this. For example using the cflayoutarea "tabs." The tabs already load the new content when you click on them.. no reason for overriding all this just to use "Coldfusion.navigate."
Another example, using the bind attribute on a cfdiv, so the cfdiv updates when a bound ajax grid changes.

I have looked behind the scenes to try and figure out if there was anything I could tie into and found that there is a callback handler coldfusion uses when it does all the
binding/loading... "ColdFusion.Bind.urlBindHandler" i just haven't found a smart way to get at this.
</p>
</blockquote>

I love it when long questions have simple answers. ;) The solution here is the <a href="http://www.cfquickdocs.com/cf8/?getDoc=AjaxOnLoad">ajaxOnLoad</a> function. As you can probably guess, it lets you run a JavaScript function when a page or container is done loading.