---
layout: post
title: "Building a Contact Form with Parse and Mailgun"
date: "2013-11-12T16:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2013/11/12/Building-a-Contact-Form-with-Parse-and-Mailgun
guid: 5086
---

<p>
I'm currently working on an article that discusses various third party services that can help flesh out a static web site. While researching that article, I got to thinking about contact forms and how (or if) I could use <a href="http://www.parse.com">Parse</a> to power them. Parse is built for ad hoc data storage of - well - anything. I wouldn't typically think of contact forms as being something I'd want to save, but the more I thought about it, the more I thought that in some organizations this could be a powerful feature. You can track communication over time as well as use the email addresses as a list to contact in the future. There are probably multiple ways of doing this, but here is what I came up with.
</p>
<!--more-->
<p>
I began with - of course - the contact form. I built something short and sweet that I thought would be fairly typical. It asks for a name, email address, an "area" (i.e., why are you contacting us), and has a box for the comment.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;
		
		&lt;h2&gt;Contact Form&lt;&#x2F;h2&gt;
		
		&lt;form id=&quot;commentForm&quot;&gt;
			
			&lt;p&gt;
			&lt;label for=&quot;name&quot;&gt;Your Name&lt;&#x2F;label&gt;
			&lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;name&quot; required&gt;
			&lt;&#x2F;p&gt;

			&lt;p&gt;
			&lt;label for=&quot;email&quot;&gt;Your Email&lt;&#x2F;label&gt;
			&lt;input type=&quot;email&quot; name=&quot;email&quot; id=&quot;email&quot; required&gt;
			&lt;&#x2F;p&gt;

			&lt;p&gt;
			&lt;label for=&quot;area&quot;&gt;Your question involves:&lt;&#x2F;label&gt;
			&lt;select name=&quot;area&quot; id=&quot;area&quot;&gt;
			&lt;option value=&quot;stuff&quot;&gt;Stuff&lt;&#x2F;option&gt;	
			&lt;option value=&quot;otherstuff&quot;&gt;Other Stuff&lt;&#x2F;option&gt;	
			&lt;option value=&quot;starwars&quot;&gt;Star Wars&lt;&#x2F;option&gt;	
			&lt;option value=&quot;startrek&quot;&gt;Star Trek&lt;&#x2F;option&gt;	
			&lt;&#x2F;select&gt;
			&lt;&#x2F;p&gt;

			&lt;p&gt;
			&lt;label for=&quot;comments&quot;&gt;Your Comments&lt;br&#x2F;&gt;&lt;&#x2F;label&gt;
			&lt;textarea name=&quot;comments&quot; id=&quot;comments&quot; required&gt;&lt;&#x2F;textarea&gt;
			&lt;&#x2F;p&gt;
			
			&lt;p&gt;
			&lt;input type=&quot;submit&quot; value=&quot;Send Comments&quot;&gt;
			&lt;&#x2F;p&gt;
		&lt;&#x2F;form&gt;
		
		&lt;script src=&quot;http:&#x2F;&#x2F;www.parsecdn.com&#x2F;js&#x2F;parse-1.2.12.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;1&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
I assume none of this needs to be explained, but I will point out I'm using HTML5 form validation here. At the bottom I'm loading jQuery, Parse's library, and my own JavaScript file app.js. I began by building a simple shell of a form handler.
</p>


<pre><code class="language-javascript">&#x2F;* global $,document,console *&#x2F;
$(document).ready(function() {
		
	$(&quot;#commentForm&quot;).on(&quot;submit&quot;, function(e) {
		e.preventDefault();

		console.log(&quot;Handling the submit&quot;);
		&#x2F;&#x2F;add error handling here
		&#x2F;&#x2F;gather the form data

		var data = {};
		data.name = $(&quot;#name&quot;).val();
		data.email = $(&quot;#email&quot;).val();
		data.area = $(&quot;#area option:selected&quot;).val();
		data.comments = $(&quot;#comments&quot;).val();

	});
	
});</code></pre>

<p>
Again - I assume this is pretty boilerplate. Note that I intentionally skipped doing form validation. As that's been done about eleven billion times or so I wanted to keep this proof of concept as simple as possible. 
</p>

<p>
Ok, so let's talk Parse. I'm going to assume you've read my earlier posts on Parse. I went ahead and set up a new application on Parse and copied down my appropriate keys. My HTML file already had Parse's JavaScript library included so I didn't need to do anything there. I knew I could easily take the comment data and store it in Parse. Here is the updated version with Parse enabled.
</p>

<pre><code class="language-javascript">/* global $,document,console,Parse */
$(document).ready(function() {
	
	var parseAPPID = "1xW2AmMzvU7pukTxmXycGC6zVIsC9llnLesiGvXZ";
	var parseJSID = "k8dOFpCbQcdyaGCDk9jytrlaGezfnGMIKsuy8veX";
	
	Parse.initialize(parseAPPID, parseJSID);
	var CommentObject = Parse.Object.extend("CommentObject");
	
	$("#commentForm").on("submit", function(e) {
		e.preventDefault();

		console.log("Handling the submit");
		//add error handling here
		//gather the form data

		var data = {};
		data.name = $("#name").val();
		data.email = $("#email").val();
		data.area = $("#area option:selected").val();
		data.comments = $("#comments").val();

		var comment = new CommentObject();
		comment.save(data, {
			success:function() {
				console.log("Success");
				//Alerts are lame - but quick and easy
				alert("Thanks for filling the form!");
			},
			error:function(e) {
				console.dir(e);
			}
		});
		
	});
	
});</code></pre>

<p>
Again, I tried to keep it simple so on a successful return I use a lame alert to let you know it went through. I don't even publicly display a message if an error is thrown. Again, bad. But I was trying to make the demo as simple as possible. I ran this and confirmed that I could fill out the form and the results would be stored at Parse.
</p>

<img src="https://static.raymondcamden.com/images/Screenshot_11_12_13__3_28_PM.jpg" />

<p>
While this would work, I'd have to constantly check the Parse dashboard to see when someone filled out my contact form. How can I add email support?
</p>

One of the more interesting features of Parse is Cloud Code. Cloud Code is JavaScript that runs on the server. One of the best examples of it is performing aggregate operations. Imagine you had a million or so "Rating" objects. If you wanted to get an average for all the objects you could download them all to the client and loop. Or you can run code on Parse's server and do it there instead. Guess which one is better?
</p>

<p>
Along with having access to your data on the server itself, Parse has a set of <a href="https://parse.com/docs/cloud_modules_guide#cloud_modules">Cloud Modules</a> that wrap various third-party services. One of them is <a href="https://mailgun.com/">Mailgun</a>. Mailgun is a mail API service that provides <strong>up to 10000</strong> emails on their free tier. That kicks ass. I think my blog here is reasonably successful for a tech site and I get maybe 100 or so emails per month from my contact form. 
</p>

<p>
I followed the <a href="https://parse.com/docs/cloud_code_guide">directions</a> for installing a new Cloud Code directory and it created a new file, main.js, with a sample Cloud Code function. The docs have an example of running code <a href="https://parse.com/docs/cloud_code_guide#functions-onsave">on saving data</a>, so I used that as my basis as well as the docs on using the <a href="https://parse.com/docs/cloud_modules_guide#mailgun">Mailgun module</a>. Here is my final function:
</p>


<pre><code class="language-javascript">/* global Parse,console,require */

var Mailgun = require('mailgun');
Mailgun.initialize('raymondcamden.mailgun.org', 'mykeysmilkshakeisbetterthanyours');

Parse.Cloud.beforeSave("CommentObject", function(request, response) {

	var text = "Comment Email\n" + 
		"From: "+request.object.get("name") + "\n"+
		"Email: "+request.object.get("email") + "\n"+
		"Area: "+request.object.get("area") + "\n\n"+
		"Comments:\n" + request.object.get("comments");
	
	Mailgun.sendEmail({
			to: "raymondcamden@gmail.com",
			from: request.object.get("email"),
			subject: "Comment Form - " + request.object.get("area"),
			text: text
		}, {
		success: function(httpResponse) {
			response.success();
		},
		error: function(httpResponse) {
			console.error(httpResponse);
			response.error("Uh oh, something went wrong");
		}
	});

});</code></pre>

<p>
You can see where I take the data from the Comment object and use that when I speak to Mailgun. I also use the email address on the form as the from value. This makes it easy to reply. I've also taken the "area" field and used that in the subject. That could be useful for filtering emails based on what they concern. And does it work? Yep!
</p>


<img src="https://static.raymondcamden.com/images/Screenshot_11_12_13__3_32_PM.jpg" />

<p>
Want to give it a try yourself? Hit the <a href="http://www.raymondcamden.com/demos/2013/nov/12/">demo</a> and spam me to high heaven.
</p>