---
layout: post
title: "Followup to jQuery experiment - autoshortener as a plugin"
date: "2010-10-06T10:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/10/06/Followup-to-jQuery-experiment-autoshortener-as-a-plugin
guid: 3963
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2010/10/5/Simple-jQuery-experiment--automatically-shortening-a-long-list">wrote</a> a quick proof of concept that demonstrated jQuery code that would shorten a list of content to a set max and automatically add a 'Show More' link. The content was output by ColdFusion and could be any size. The JavaScript would check to see if there were more than 10 items and remove the ones <i>after</i> the 10th as well as adding the link to redisplay the content. This morning I quickly rewrote the code into a plugin (and took some of the advice I got on the last blog entry). Here is what I came up with.

<p/>
<!--more-->
First - let me begin by pointing you to the jQuery docs on plugin writing: <a href="http://docs.jquery.com/Plugins/Authoring">Plugins/Authoring</a>. This is a pretty straight forward guide to how plugins should be developed in jQuery. This was only my second plugin so I definitely had to reread this doc. I'll be honest and say that some of what the guide talks about is still a bit confusing to me - but I was able to understand enough to <strike>be dangerous</strike>get by. Here is the plugin code:

</p>

<code>
(function($) { 

	$.fn.autoShortener = function(options) {

		return this.each(
		
			function() {

				var settings = {
					"length":10,
					"message":"Show More"
				};
				
				if(options) $.extend(settings, options);
				
				//get the children
				var item = $(this);
				var kids = item.children();

				if(kids.length &gt; settings.length) {

					kids.slice(settings.length).hide();
					
					$(this).append("&lt;a href='' class='showMoreLink'&gt;" + settings.message + "&lt;/a&gt;");
					
					$(".showMoreLink", item).click(function(e) {
						item.children().show()
						$(this).hide();
						e.preventDefault();
					});

				}
				

			}
		);

	};

})(jQuery);
</code>

<p/>

For the most part this is the same logic as you saw in the blog entry yesterday - I just wrapped it in the proper format for plugins. I did make the length and message as options that you can override at runtime. Where things get real cool is on the front end. Check out the code now:

<p/>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery.autoshortener.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".list").autoShortener();
	
})
&lt;/script&gt;


&lt;ul id="list" class="list"&gt;
&lt;cfloop index="x" from="1" to="25"&gt;
	&lt;cfoutput&gt;
		&lt;li&gt;Item #x#&lt;/li&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/ul&gt;

&lt;div id="list2" class="list"&gt;
&lt;cfloop index="x" from="1" to="25"&gt;
	&lt;cfoutput&gt;
		&lt;div&gt;Item #x#&lt;/div&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/div&gt;
</code>

<p/>

That's a heck of a lot smaller. And if I want to override the options I could do something like this:

<p/>

<code>
$("#list").autoShortener({% raw %}{length:8}{% endraw %});
$("#list2").autoShortener({% raw %}{message:"More"}{% endraw %});
</code>

<p/>

You can see that version at the demo link below. Anyway - that's it. I'd love for this blog entry to be longer, more complex, etc., but jQuery just makes things to darn simple.

<p/>

<a href="http://www.coldfusionjedi.com/demos/oct62010/test3.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>