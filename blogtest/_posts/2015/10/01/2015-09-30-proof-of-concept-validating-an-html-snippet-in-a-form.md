---
layout: post
title: "Proof of Concept: Validating an HTML Snippet in a Form"
date: "2015-10-01T09:18:07+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/10/01/proof-of-concept-validating-an-html-snippet-in-a-form
guid: 6849
---

On my blog, I write my entries in pure HTML. WordPress supports a Visual editor too, but I like to write my HTML tags by hand. That's how I've done it for the past twenty years and that's how God intended me to write HTML. (Joking, honestly.) What's nice is that I can leave out some tags, like paragraph markers, and WordPress will handle that for me. I typically just worry about italics, bold, and links.

Despite having worked with web pages since dinosaurs used FrontPage, I still screw up from time to time. My typical mistake is either not closing a tag: <code>&lt;i&gt;Foo&lt;i&gt;</code> or closing the wrong tag: <code>&lt;i&gt;Foo&lt;/b&gt;</code> 

I've often wondered - is there some way to test for this type of mistake on the client side?

<!--more-->

Obviously you could use regex to check for the cases I described above, but regex can get messy. That and as much as I appreciate the power of regex I'd rather avoid it. Also, it wouldn't handle a case like this: <code>&lt;stron&gt;Bold!&lt;/stron&gt;</code>. 

Someone on Twitter (I forget who and I'm being too lazy to scroll through my Notifications panel) suggested <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMParser">DOMParser</a>, but when I tried that I could find no way to detect invalid/broken HTML when passed to the API. It is entirely possible I was doing it wrong, but nothing really stood out.

I then had an idea - what if I tried the <a href="https://validator.w3.org/">W3C Validator</a> service? I use it for my Brackets extension (which I'll be rewriting to Visual Studio Code the second they release extension support) and it works well enough there, maybe I could use it in code? Here is what I came up with as a proof of concept.

<pre><code class="language-javascript">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Proper Title&lt;/title&gt;
&lt;style&gt;
&lt;/style&gt;
&lt;/head&gt;
    
&lt;body&gt;
	
	&lt;form id=&quot;myForm&quot; method=&quot;post&quot;&gt;
		&lt;textarea id=&quot;content&quot; cols=&quot;50&quot; rows=&quot;20&quot;&gt;&lt;/textarea&gt;
		&lt;p/&gt;

        &lt;input type=&quot;submit&quot;&gt;
	&lt;/form&gt;

	&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js&quot;&gt;&lt;/script&gt;
	
	&lt;script&gt;
	var W3CURL = &quot;https://validator.w3.org/nu/?out=json&amp;level=error&quot;;

	$(document).ready(function() {
		
		$(&quot;#myForm&quot;).on(&quot;submit&quot;, function(e) {
			e.preventDefault();
			var html = $(&quot;#content&quot;).val();
			if(html === '') return;
			//wrap html into a proper body
			html = &quot;&lt;!DOCTYPE html&gt;\n&lt;html&gt;&lt;head&gt;&lt;title&gt;Test&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&quot; + html + &quot;&lt;/body&gt;&lt;/html&gt;&quot;;
      
			$.ajax({
				url:W3CURL,
				data:html,
				cache:false,
				contentType:"text/html; charset=utf-8",
				processData:false,
				type:"POST",
				success:function(data) {
					console.dir(data);
					if(data.messages.length === 0) {
						//All good, submit the form
						console.log("all good");	
					} else {
						//Don't submit, show the user
						console.log("you failed...");	
					}
				}
			});
			
		});
	});
		
	&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

The form is pretty simple - just a textarea. Obviously a real form would have more values. Since the assumption here is that I'm validating a "snippet" of HTML, I create a 'full' doc by wrapping the form value with a doctype, html, head, and body tags. I then simply pass this to the W3C validation API. Finally, I check the results. I don't have any nice UI here, just a console dump, but let's look at some tests.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot1.png" alt="shot1" width="566" height="655" class="aligncenter size-full wp-image-6850 imgborder" />

In the first test, I didn't close the italics tag correctly, and the service caught it. It reports it twice, which may be confusing, but I'd be fine with it.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot2.png" alt="shot2" width="559" height="547" class="aligncenter size-full wp-image-6851 imgborder" />

In my second test, I just left it off completely, and it was also caught.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot3.png" alt="shot3" width="608" height="488" class="aligncenter size-full wp-image-6852 imgborder" />

For my final test, I used proper wrapping with an unknown tag, and it also worked. Obviously this could be an issue if I'm embedding a Polymer example. (Actually, no, since it would have been escaped.)

So, what do you think? You can try a live version of this here: <a href="https://static.raymondcamden.com/demos/2015/oct/1/testjqm.html">https://static.raymondcamden.com/demos/2015/oct/1/testjqm.html</a>. Don't forget to open your browser developer tools of course.