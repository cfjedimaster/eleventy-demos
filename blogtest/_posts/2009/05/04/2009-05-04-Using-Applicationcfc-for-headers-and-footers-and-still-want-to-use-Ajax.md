---
layout: post
title: "Using Application.cfc for headers and footers and still want to use Ajax?"
date: "2009-05-04T22:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/05/04/Using-Applicationcfc-for-headers-and-footers-and-still-want-to-use-Ajax
guid: 3341
---

It must be something in the water. While I do not recommend using Application.cfc for header and footer layout, I've had two people in the last week ask me about this in terms of using Ajax. What they both found was that when they used Application.cfc to include a header and footer, this messed up their Ajax calls. Let's look at an example and show how we can quickly work around it.
<!--more-->
First, here is a simple Application.cfc file that uses onRequestStart and onRequestEnd to output a header and footer:

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cfset this.name = "ApplicationName"&gt;
	
	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onRequestStart" returnType="boolean" output="true"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
	
		&lt;cfinclude template="header.cfm"&gt;
	&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onRequestEnd" returnType="void" output="true"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
		
		&lt;cfinclude template="footer.cfm"&gt;
		
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Here is my header.cfm and footer.cfm files respectively:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;&lt;/title&gt;
&lt;/head&gt;
&lt;!-- yes, pink, got a problem with that? --&gt;
&lt;body bgcolor="pink"&gt;
</code>

<code>
&lt;p&gt;
Copyright &lt;cfoutput&gt;#year(now())#&lt;/cfoutput&gt;
&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

Ok, so now for the interesting part - the Ajax application. This is a rather contrived example, but the code here will take a number and generate an array with that many elements. Each array item will have a random number in it. The code uses jQuery, but obviously the issue relates to Ajax in general.

<code>
&lt;script src="jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	
	$.ajaxSetup({
		error:function(req,textstatus,error) {
			alert('e')
		}
	})
	
	$("#submitBtn").click(function() {
		var value = $("#number").val()
		console.log('About to run my request...')
		$.getJSON("test.cfc?method=makearr&returnFormat=json",{% raw %}{number:value}{% endraw %},function(d) {
			var res = ""
			for(var i=0; i&lt;d.length;i++) {
				res += "item "+(i+1)+" is "+d[i]+"&lt;br/&gt;"
			}
			$("#result").html(res)
			console.log('Done with request')
		})
	})
	
})
&lt;/script&gt;

&lt;input type="text" id="number"&gt; &lt;input type="submit" id="submitBtn" value="Double"&gt;	
&lt;div id="result"&gt;&lt;/div&gt;
</code>

And finally, the last piece, the CFC:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="makearr" access="remote" returnType="array" output="false" secureJSON="false"&gt;
	&lt;cfargument name="number" required="true" type="any"&gt;
	&lt;cfset var arr = []&gt;
	&lt;cfset var x = ""&gt;
	
	&lt;cfloop index="x" from="1" to="#arguments.number#"&gt;
		&lt;cfset arr[x] = randRange(1,100)&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn arr&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Ok, so hopefully I haven't lost you yet. If you run this, the result will be... nothing. Why? If you use Firebug to examine the result (and you would, right?), you can see the following:

<img src="https://static.raymondcamden.com/images//Picture 154.png">

Notice the JSON in the middle, wrapped by HTML? That HTML breaks the JSON format and prevents the front end code from correctly parsing it. 

The best fix, in my opinion, is to get rid of the includes in Application.cfc. I'd use custom tag wrappers instead. But if you really want to keep them in, you can simply examine the requested template. Don't forget ColdFusion passes it to both the onRequestStart and End methods. Consider these new versions:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="true"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	
	&lt;cfif listLast(arguments.thePage,".") neq "cfc"&gt;
		&lt;cfinclude template="header.cfm"&gt;
	&lt;/cfif&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
	
&lt;cffunction name="onRequestEnd" returnType="void" output="true"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
		
	&lt;cfif listLast(arguments.thePage,".") neq "cfc"&gt;
		&lt;cfinclude template="footer.cfm"&gt;
	&lt;/cfif&gt;
		
&lt;/cffunction&gt;
</code>

In each method, I've wrapped the include with a simple check to see if the requested page ends with cfc. Hope this helps.