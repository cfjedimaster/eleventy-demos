---
layout: post
title: "Warning a user before they leave a form"
date: "2015-03-06T10:01:23+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/03/06/warning-a-user-before-they-leave-a-form
guid: 5784
---

A reader asked me this today and I thought it would be a good topic for discussion. 

<blockquote>
I have a form and notice that not a lot of people complete it. Can you think of any way to catch those people that leave the page without filling out the form and direct them to a page that could get them to fill out something answering why they didn't fill out the form?
</blockquote>

<!--more-->

So, before getting into the technicalities, I think this touches on an incredibly important topic, one I actually raised way back in 2006, <a href="http://www.raymondcamden.com/2006/10/20/How-ColdFusion-can-save-you-business">"How ColdFusion can save your business!"</a> While that blog post was focused on ColdFusion, the point it raised was how you could use server-side technology to track when a user leaves the site. Or to be more precise, what the <i>last</i> URL was for a particular user. The example raised in the blog post was a multi-step form that may cause many users to abandon the site part way through. I asked the question - how would you determine that people were having an issue with one particular step? 

In the blog post I used server-side tracking, but as folks brought up in the comments, Google Analytics (or any analytic program), could be used to help track this as well. At the end of the day, you as the owner of your site need to be proactive in looking for this type of information.

Now - let's discuss the user's particular question. You can detect, with JavaScript, when a user leaves a page. This fires an event on the Window object called <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload">onbeforeunload</a>. As far as I can tell, you can only allow or prevent the navigation. So the user's particular request to go to another page wouldn't be possible client-side. In theory you could use a cookie (or Session value) when the user loaded the form page and on his or her next hit, see if that variable is there and then redirect the user. But sticking to JavaScript, we can only warn the user, not redirect them. Here's a simple example.

<pre><code class="language-markup">&lt;html&gt;
	&lt;head&gt;
	&lt;&#x2F;head&gt;
	
	&lt;body&gt;
		
		&lt;form id=&quot;myForm&quot;&gt;
		
			&lt;p&gt;
			&lt;label for=&quot;field1&quot;&gt;field1&lt;&#x2F;label&gt;
			&lt;input type=&quot;text&quot; name=&quot;field1&quot; id=&quot;field1&quot;&gt;
			&lt;&#x2F;p&gt;
			&lt;p&gt;
			&lt;label for=&quot;field2&quot;&gt;field2&lt;&#x2F;label&gt;
			&lt;input type=&quot;text&quot; name=&quot;field2&quot; id=&quot;field2&quot;&gt;
			&lt;&#x2F;p&gt;
			
			&lt;p&gt;
				&lt;input type=&quot;submit&quot; value=&quot;Send Form&quot;&gt;
			&lt;&#x2F;p&gt;
		&lt;&#x2F;form&gt;
		
		&lt;p&gt;
		&lt;a href=&quot;test2.html?x=1&quot;&gt;Reload this page.
		&lt;&#x2F;p&gt;
		
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		
		$(window).on(&quot;beforeunload&quot;, function() {
			return &quot;Are you sure? You didn&#x27;t finish the form!&quot;;
		});
		
		$(document).ready(function() {
			$(&quot;#myForm&quot;).on(&quot;submit&quot;, function(e) {
				&#x2F;&#x2F;check form to make sure it is kosher
				&#x2F;&#x2F;remove the ev
				$(window).off(&quot;beforeunload&quot;);
				return true;
			});
		});
		&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

An event handler is added to the Window object to listen for the user leaving and warn them beforehand. Then we can use the form submission handler to just remove the event.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/leave.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/leave.png" alt="leave" width="1184" height="966" class="alignnone size-full wp-image-5785" /></a>

This works, but is pretty annoying, so I'd say use sparingly. Then again, it isn't as evil as those darn modal windows asking you to "Like" the site - but that's a rant for later.