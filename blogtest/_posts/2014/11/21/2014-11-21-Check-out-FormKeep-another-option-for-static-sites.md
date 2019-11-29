---
layout: post
title: "Check out FormKeep, another option for static sites"
date: "2014-11-21T14:11:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2014/11/21/Check-out-FormKeep-another-option-for-static-sites
guid: 5356
---

<img src="https://static.raymondcamden.com/images/keep1.png" class="bthumb" align="left" style="margin-right:10px" />
<p>
Over the past year or so I've been playing around with static site generators. After nearly fifteen years spent building dynamic web applications on the server-side, a <i>simple</i> solution involving a static site generator can be pretty darn appealing. Unfortunately, moving to static means you need to find alternatives for things that simply can't be static. Forms, forums, calendars, etc. I discussed options to handle this problem in my article for modernweb, <a href="http://modernweb.com/2013/12/16/moving-to-static-and-keeping-your-toys/">Moving to Static and Keeping Your Toys</a>. Today I'm going to introduce you to another option I discovered yesterday, <a href="http://www.formkeep.com">FormKeep</a>
</p>
<!--more-->
<p>
FormKeep is a service that provides an end point for form submissions. They basically give you a place to point your forms, handle the processing, and then send your users to another page. It is incredibly simple but very useful. Let's look at a simple example. After signing up, you can quickly create your first form:
</p>

<p>
<img src="https://static.raymondcamden.com/images/fk1.png" class="bthumb" />
</p>

<p>
<img src="https://static.raymondcamden.com/images/fk2.png" class="bthumb" />
</p>

<p>
As you can see, you are given a form tag and one hidden form field. That's it. There are some suggestions for other fields, but at minimum, you just need those two. Now - to be clear - there is <strong>not</strong> a "form builder" here. After you copy and paste those two fields you will then need to build the rest of the form yourself. There is also no form checking built into the service. You would handle it client-side. If the end user disables that (and we all know end users can do that, right?) then FormKeep won't be able to prevent invalid submissions. 
</p>

<p>
By default, form submissions will display a FormKeep page as a response:
</p>

<p>
<img src="https://static.raymondcamden.com/images/fk41.png" class="bthumb" />
</p>

<p>
But you can also easily input a return URL. Since their server simply outputs the URL to the browser to handle, you can use localhost as a test or a domain that resolves to 127.0.0.1 while you test. As an example, I used this: <code>http://localhost/testingzone/trash/test2.html?done=1</code>. That's the URL for my local server and the file I was using to test. Now let's look at the code I used.
</p>


<pre><code class="language-markup">&lt;html&gt;
	&lt;head&gt;
	&lt;style&gt;
		input, textarea {% raw %}{ width: 250px; }{% endraw %}
		label {% raw %}{ width: 100px; display:inline-block; }{% endraw %}
		input[type=submit] {
			width: 100px;
		}
		
		#status {
			font-weight: bold;	
		}
	&lt;&#x2F;style&gt;
	&lt;script&gt;
		document.addEventListener(&quot;DOMContentLoaded&quot;, function() {
			if(window.location.search.indexOf(&quot;done=1&quot;) &gt;= 0) {
				document.querySelector(&quot;#status&quot;).innerHTML = &quot;&lt;p&gt;Thank you for your comments. I care about them a lot.&lt;&#x2F;p&gt;&quot;;
			}
		});
	&lt;&#x2F;script&gt;
	&lt;&#x2F;head&gt;
	
	&lt;body&gt;
		
		&lt;div id=&quot;status&quot;&gt;&lt;&#x2F;div&gt;
	
		&lt;form accept-charset=&quot;UTF-8&quot; action=&quot;https:&#x2F;&#x2F;formkeep.com&#x2F;f&#x2F;439b8e051eac&quot; method=&quot;POST&quot;&gt;
			&lt;input type=&quot;hidden&quot; name=&quot;utf8&quot; value=&quot;?&quot;&gt;

			&lt;label for=&quot;email&quot;&gt;Email:&lt;&#x2F;label&gt; &lt;input type=&quot;email&quot; id=&quot;email&quot; name=&quot;email&quot; placeholder=&quot;Your Email&quot;&gt;&lt;br&#x2F;&gt;
			&lt;label for=&quot;name&quot;&gt;Name:&lt;&#x2F;label&gt; &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; placeholder=&quot;Your Name&quot;&gt;&lt;br&#x2F;&gt;
			&lt;label for=&quot;url&quot;&gt;Homepage:&lt;&#x2F;label&gt; &lt;input type=&quot;url&quot; id=&quot;url&quot; name=&quot;url&quot; placeholder=&quot;Your Website&quot;&gt;&lt;br&#x2F;&gt;
			&lt;label for=&quot;comments&quot;&gt;Comments:&lt;&#x2F;label&gt; &lt;textarea id=&quot;comments&quot; name=&quot;comments&quot;&gt;&lt;&#x2F;textarea&gt;&lt;br&#x2F;&gt;
			&lt;input type=&quot;submit&quot; value=&quot;Send Comments&quot;&gt;
		&lt;&#x2F;form&gt;

	&lt;&#x2F;body&gt;

&lt;&#x2F;html&gt;
</code></pre>

<p>
My example just mimics a basic contact form. But since FormKeep is returning with something in the query string, I used a bit of JavaScript to handle displaying a thank you message when it exists. FormKeep's FAQ also links to this <a href="calebthompson.io/fake-it-flash-messages-with-target">cool example</a> that does something similar but with CSS alone. As we know though CSS is the work of the devil so I had to use JavaScript instead.
</p>

<p>
By default form submissions are sent to you via email. This works as you imagine:
</p>

<p>
<img src="https://static.raymondcamden.com/images/fk5.png" class="bthumb" />
</p>

<p>
You also get a decent little online viewer as well:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-11-21 at 14.27.15.png" class="bthumb"/>
</p>

<p>
To be clear - just sending an email is actually just the simplest thing you can do. You can use a webhook URL to send form data to - well - anything really. That includes things like Salesforce, Campaign Monitor, etc. Email is just the default. If you can find a service that lets you ping data to it via a URL, you can set up FormKeep to hit it with your form data.
</p>

<p>
Finally, there are two export options as well. You can dump everything out to CSV or to JSON via their "API." I put API in quotes there because right now the API is just "dump the whole thing to JSON", but I'm assuming we'll see more in the future. At minimum it will need to accept date filters.
</p>

<p>
Payment is kind of interesting. You basically pay what you want and get unlimited usage. Free usage will limit your dashboard view of data to the last ten entries, but that's certainly enough for testing. "Near Free" for personal users sounds like a pretty good deal to me.
</p>

<p>
So, check it out and let me know what you think in the comments below.
</p>