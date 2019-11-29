---
layout: post
title: "Dynamic Subjects with Formspree"
date: "2016-01-22T08:29:46-06:00"
categories: [javascript]
tags: []
banner_image: /images/2016/01/formspree_big.jpg
permalink: /2016/01/22/dynamic-subjects-with-formspree
---

Whenever I present on static site generators, I spend some time discussing how to get "dynamic" features back into the site. One of the most important things people lose when switching to flat files is the ability to process forms. Luckily, there are a variety of different ways to get that feature back (I'll share some alternatives at the end). For my blog, I've gone with [Formspree](http://formspree.io/).

<!--more-->

Formspree is a simple to use service where you simply point your form at their servers and they handle the rest. They have a free tier that supports up to 1000 emails a month which is more than enough for me. Here is a simple example of how you can make use of the service.

<pre><code class="language-markup">
&lt;form action=&quot;//formspree.io/raymondcamden@gmail.com&quot; method=&quot;POST&quot;&gt;
	&lt;input type=&quot;hidden&quot; name=&quot;_next&quot; value=&quot;http://www.raymondcamden.com/thankyou&quot;&gt;
	&lt;input type=&quot;hidden&quot; name=&quot;_subject&quot; id=&quot;_subject&quot; value=&quot;Blog Contact Form&quot;&gt;
	&lt;input type=&quot;text&quot; name=&quot;_gotcha&quot; style=&quot;display:none&quot; /&gt;
	
	&lt;label for=&quot;contact_name&quot;&gt;Name: &lt;/label&gt;
	&lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;contact_name&quot; required&gt;&lt;br/&gt;
	
	&lt;label for=&quot;email&quot;&gt;Email: &lt;/label&gt;
	&lt;input type=&quot;email&quot; name=&quot;_replyto&quot; id=&quot;email&quot; required&gt;&lt;br/&gt;
	
	&lt;label for=&quot;contact_comments&quot;&gt;Comments: &lt;/label&gt;&lt;br/&gt;
	&lt;textarea name=&quot;comments&quot; id=&quot;contact_comments&quot; required&gt;&lt;/textarea&gt;&lt;br/&gt;
	&lt;p&gt;
	&lt;input type=&quot;submit&quot; value=&quot;Send&quot;&gt;
	&lt;/p&gt;
&lt;/form&gt;
</code></pre>

To have Formspree send you an email when a form is filled out, you simply set the action of the form to include your email address. The first time someone uses the form, Formspree will ask you to confirm it, but once you do, the emails will be sent to you automatically.

Formspree also supports a few special field names that change how the form behaves. Notice the _subject field. This will set the subject of the email you get. Notice _reply to on the email field. This will let you hit reply in your email program to respond to the person who filled out the form. You can find out more if you read the docs on their site, but in general, it is an *incredibly* simple service to use and you can have it up and running in minutes.

One issue bugged me though. Notice how my subject is, "Blog Contact Form." When I would get multiple emails from my blog, GMail would thread them all into one thread. This is expected I suppose, but it made it a bit more difficult for me to respond to form submissions. It occurred to me that I could easily use JavaScript to modify the form while it was being filled out. I decided to include the email address in the subject itself. Here is a sample of how you could do that.

<pre><code class="language-markup">
&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	var $sub = $(&quot;#_subject&quot;);
	$(&quot;#email&quot;).on(&quot;input&quot;, function() {
		$sub.val(&quot;Blog Contact Form (&quot; + $(this).val() + &quot;)&quot;);
	});
});
&lt;/script&gt;
&lt;style&gt;
#contactform label {
	display: inline-block;
	width: 80px;
	height:25px;
}

#contactform textarea {
	width: 100%;
	height: 150px;
}			
&lt;/style&gt;
	
&lt;form action=&quot;//formspree.io/raymondcamden@gmail.com&quot; method=&quot;POST&quot; id=&quot;contactform&quot;&gt;
	&lt;input type=&quot;hidden&quot; name=&quot;_next&quot; value=&quot;{% raw %}{{%{% endraw %} siteurl {% raw %}%}}{% endraw %}/thankyou&quot;&gt;
	&lt;input type=&quot;hidden&quot; name=&quot;_subject&quot; id=&quot;_subject&quot; value=&quot;Blog Contact Form&quot;&gt;
	&lt;input type=&quot;text&quot; name=&quot;_gotcha&quot; style=&quot;display:none&quot; /&gt;
	
	&lt;label for=&quot;contact_name&quot;&gt;Name: &lt;/label&gt;
	&lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;contact_name&quot; required&gt;&lt;br/&gt;
	
	&lt;label for=&quot;email&quot;&gt;Email: &lt;/label&gt;
	&lt;input type=&quot;email&quot; name=&quot;_replyto&quot; id=&quot;email&quot; required&gt;&lt;br/&gt;
	
	&lt;label for=&quot;contact_comments&quot;&gt;Comments: &lt;/label&gt;&lt;br/&gt;
	&lt;textarea name=&quot;comments&quot; id=&quot;contact_comments&quot; required&gt;&lt;/textarea&gt;&lt;br/&gt;
	&lt;p&gt;
	&lt;input type=&quot;submit&quot; value=&quot;Send&quot;&gt;
	&lt;/p&gt;
&lt;/form&gt;
</code></pre>

Pretty vanilla jQuery code here and it could probably be done nicer, but it works just fine:

![Screenshot](https://static.raymondcamden.com/images/2016/01/formspree1.png)

As an FYI, I emailed Formspree asking for a feature like this before I figured it out it would be easy in JavaScript. The folks at Formspree replied really quick, and while I didn't end up needing their help, it was great to see how quickly they responded to a support request. (Also note that they said they kinda liked the idea of a dynamic subject like I described and it may end up becoming a feature in the future!)

Alternatives
--

So while I'm perfectly happy with Formspree, here are a few other alternatives you may consider:

* [Wufoo](http://www.wufoo.com/)
* [FormKeep](https://formkeep.com/)
* Google Docs (you can embed a form)
* And hell, a mailto: link works too!