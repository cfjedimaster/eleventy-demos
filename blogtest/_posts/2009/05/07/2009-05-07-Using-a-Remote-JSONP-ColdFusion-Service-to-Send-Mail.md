---
layout: post
title: "Using a Remote JSONP ColdFusion Service to Send Mail"
date: "2009-05-07T22:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/05/07/Using-a-Remote-JSONP-ColdFusion-Service-to-Send-Mail
guid: 3347
---

A user had an interesting question regarding jQuery and JSONP. He wanted to know if a file on one server (a server without ColdFusion) could use jQuery and JSONP to run CFML code on another server and send email. The problem with using JSONP in this scenario is that JSONP is a GET request. Emails are - typically - a bit long and could fail to execute if the message was too large. He still wanted to see an example anyway so I whipped up the following demo. The code is based on the <a href="http://www.raymondcamden.com/index.cfm/2009/3/11/Writing-a-JSONP-service-in-ColdFusion">blog entry</a> I wrote two months ago on JSONP services in ColdFusion. 

The front end is incredibly simple. One text area and a button:

<code>
&lt;form id="theform"&gt;
&lt;textarea name="msg" id="msg"&gt;&lt;/textarea&gt;
&lt;input type="submit"&gt;	
&lt;/form&gt;
</code>

I then whipped up some quick jQuery code to process the form:

<code>
&lt;script&gt;
$(document).ready(function() {

	$("#theform").submit(function() {
		var message = $("#msg").val()
		$.getJSON('http://127.0.0.1/test.cfc?method=sendmail&callback=?', {% raw %}{message:message}{% endraw %}, function(d,t) {
			$("#result").html('Mail Sent')
		})
		return false
	})
})
&lt;/script&gt;
</code>

I begin by grabbing the textarea value. Then I run the JSONP request. A JSONP request is no different than a normal JSON request, but you have to include the ? parameter at the end of the URL. This tips off jQuery that we are doing a JSONP request instead of a simple HTTP request to an item on the same server. 

The CFC is a bit simpler than the one I wrote for my <a href="http://www.coldfusionjedi.com/index.cfm/2009/3/11/Writing-a-JSONP-service-in-ColdFusion">previous blog entry</a>. Instead of writing two methods to nicely abstract the service, I just wrote a method to send the mail and return the properly formatted result:

<code>
&lt;cffunction name="sendmail" access="remote" returntype="any" output="false" returnformat="plain"&gt;
	&lt;cfargument name="message" type="string" required="true"&gt;
	&lt;cfargument name="callback" type="string" required="true"&gt;
	&lt;cfset var data = ""&gt;
	
	&lt;cflog file="application" text="Going to send this in email: #arguments.message#"&gt;

	&lt;cfset data = serializeJSON(true)&gt;
   
	&lt;!--- wrap ---&gt;
	&lt;cfset data = arguments.callback & "(" & data & ")"&gt;
	&lt;cfreturn data&gt;
&lt;/cffunction&gt;
</code>

The cflog line is standing in for my cfmail command. I don't really care about the result so I just return true. Note the use of the callback wrapper which fits into the JSONP requirements. 

Once setup, you could put the HTML on any server and then use the form to send your text to the remote CFC. 

Is this a good idea? Probably not. Again, you have to worry about the GET size limits, but you could probably add a size limit to the textarea easily enough.