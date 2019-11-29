---
layout: post
title: "Building an AJAX-based form for Formspree"
date: "2016-05-24T18:50:00-07:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2016/05/24/building-an-ajax-based-form-for-formspree
---

Back when I converted my site from WordPress to Hugo, one of the issues I had to take care of was setting up a processor for my contact form. I decided to go with [Formspree](https://formspree.io) as their free tier easily handled the amount of form submissions I got per month. While most folks will use Formspree with a "regular" old form post, you can also use a fancy-pants Ajax submission as well. The Formspree folks document this, but their example is rather short, and when I was asked by someone on the Surge Slack about a full example, I decided to whip something up.

<!--more-->

To be clear, and more on this at the end, this was a quick bit of code just to give that user a "real" example they could take and modify. There's many different ways of doing this and what I've built here was done in about five minutes.

My example consists of two files - an HTML file and a JavaScript file. There's no styling involved but I assume folks can handle that on their own. First, the HTML.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
  &lt;head&gt;
	&lt;meta charset=&quot;utf-8&quot;&gt;
	&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;&gt;
	&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
	&lt;title&gt;Test FormSpree.io&lt;&#x2F;title&gt;
  &lt;&#x2F;head&gt;
  &lt;body&gt;
	  
	&lt;div id=&quot;formBlock&quot;&gt;
		&lt;form id=&quot;someForm&quot;&gt;
			&lt;label for=&quot;name&quot;&gt;Name:&lt;&#x2F;label&gt; &lt;input type=&quot;text&quot; id=&quot;name&quot;&gt;&lt;br&#x2F;&gt;
			&lt;label for=&quot;email&quot;&gt;Email:&lt;&#x2F;label&gt; &lt;input type=&quot;email&quot; id=&quot;email&quot;&gt;&lt;br&#x2F;&gt;
			&lt;label for=&quot;comments&quot;&gt;Comments:&lt;&#x2F;label&gt; &lt;br&#x2F;&gt;
			&lt;textarea id=&quot;comments&quot;&gt;&lt;&#x2F;textarea&gt;&lt;br&#x2F;&gt;
		&lt;input type=&quot;submit&quot;&gt;
		&lt;&#x2F;form&gt;
	&lt;&#x2F;div&gt;
	&lt;div id=&quot;thankyouBlock&quot; style=&quot;display:none&quot;&gt;
		&lt;p&gt;
			Thank you for filling out the form. I care a lot about it.
		&lt;&#x2F;p&gt;
	&lt;&#x2F;div&gt;
	
	&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.4&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;test.js&quot;&gt;&lt;&#x2F;script&gt;
	
  &lt;&#x2F;body&gt;
</code></pre>

The only thing particularly interesting here is a hidden div used for the "thank you" message. Formspree supports sending you to a "thank you" page when you send a regular form POST to it, but when working with the Ajax version we need to handle this ourselves. I could have also just changed the HTML on the fly and injected a message, but this seemed simplest. My form has 3 fields arbitrarily chosen for the demo. 

Now for the JavaScript:

<pre><code class="language-javascript">
$(document).ready(function() {

	$('#someForm').on('submit', function(e) {
		e.preventDefault();
		
		//get the name field value
		var name = $('#name').val();
		//get the name field value
		var email = $('#email').val();
		//get the comments
		var comments = $('#comments').val();
					
		//pretend we don't need validation
		
		//send to formspree
		$.ajax({
			url:'https://formspree.io/raymondcamden@gmail.com',
			method:'POST',
			data:{
				name:name,
				_replyto:email,
				 email:email,
				comments:comments,
				_subject:'My Form Submission',
			},
			dataType:"json",
			success:function() {
				console.log('success');	
				$('#formBlock').hide();
				$('#thankyouBlock').show();
			}	

		});		
		
	});

});	
</code></pre>

So I assume this is pretty vanilla jQuery, and of course, you don't have to use jQuery. I get my data, validate it (well, I wrote a comment saying I would), and then simply POST to Formspree. I do manipulate the data a bit. First, I pass the email value twice. Why? By passing it as `_replyto`, I can actually reply to the email Formspree sends me with the form contents. <strong>(As an FYI, I completely missed the fact that Formspree will treat a field named "email" as the replyto as well. So my code there was unnecessary. This is definitely documented, but I missed it.)</strong> I still want to see the address so I include it again. `_subject` doesn't come from the form at all, but is used by Formspree to set the subject line of the email sent.

While that's it - let's quickly look at what happens when you use this code. First off, don't forget the Formspree requires you to validate a form before it will email you. If you actually look at the result of the POST in your form tools, you'll see this the first time you run it.

<img src="https://static.raymondcamden.com/images/2016/05/forms_conf.jpg" class="imgborder" alt="Requires confirmation">

The good news is that Formspree still sends the email, but it only does so once and you *must* confirm it. When you deploy this code to your production site, be sure to quickly confirm it. Their email does a good job of making it *real* clear you darn well better do so:

<img src="https://static.raymondcamden.com/images/2016/05/forms3.jpg" class="imgborder" alt="Confirm or die!">

When you do confirm, this is the response JSON you get:

<img src="https://static.raymondcamden.com/images/2016/05/forms_good.jpg" class="imgborder" alt="Happy form submission">

The Formspree docs don't really describe in what situations you would get an error. You could, I suppose, notice when `success` isn't there and handle it by telling the user that your forms are currently broken and they should simply email you instead. And of course, it just plain works:

<img src="https://static.raymondcamden.com/images/2016/05/forms5.jpg" class="imgborder" alt="Email of the form">

So since this discussion came up on the Surge Slack, I went ahead and Surged it. Because why not? You can run this demo here: [http://hospitable-cushion.surge.sh/test.html](http://hospitable-cushion.surge.sh/test.html). I can't promise it will be up forever, but I'll run it for now.

I hope this helps, and definitely check out [Formspree](https://formspree.io) - it is a *great* service. If you want, you can stop reading now, in fact, I encourage it. What follows is 100% off topic for the rest of the post.  Seriously - I don't mind if you stop.

<img src="https://static.raymondcamden.com/images/2016/05/sadkitten.jpg" class="imgborder" alt="Sad kitten is sad.">

In a recent blog post, I got called out about the quality of code I used in an example. Many of the points made were absolutely true, but frankly, it was incredibly insulting and literally had me close to simply not blogging again. (To be clear, I'd still write, just not on my personal blog.) Because I feel it needs to be said, here are some things to keep in mind when reading this blog.

* The code I write here is part of how I learn. That means, many times, you're seeing code from the beginning of my process of learning a particular language or technique. I think that has merit. I wish more beginners would share this part of the process. It helps flesh out issues with documentation and process that you don't get when only the experts are speaking.
* When I'm explaining something, I absolutely do *not* go for the most tight, or short, code and will often break things that could be written on one line into many. I want my code to be readable, and approachable, and that is not always the same as production code.
* Do I worry about misleading people? No. Frankly, there is a group of developers who cut and paste. You can call them StackOverflow developers if you want. You know them because as soon as they need to do something beyond the code they copied, they have no idea how to do it. I'm not going to belittle them because I've done it myself. Now - I think a good developer needs to recognize when they're doing that and take responsibility to actually *learn* what they are doing, but I flat out refuse to censor myself because someone may use my code incorrectly. Heck, I've been writing this blog for 15 years. I'm sure I've got some quite horrid little nasty gems in my past. Screw it. I'm proud of my mistakes. 

So with that being said - as I said from the very beginning on this blog - I hope folks can learn from this blog (and laugh a bit) and if I've done that, then I'm not going to worry about writing the absolute best production quality minified work around.

Oh - but I will use semicolons. Because not using semicolons is like murdering kittens.