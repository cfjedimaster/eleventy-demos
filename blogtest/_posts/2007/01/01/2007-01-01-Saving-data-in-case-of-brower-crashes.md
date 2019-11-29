---
layout: post
title: "Saving data in case of brower crashes"
date: "2007-01-01T22:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/01/Saving-data-in-case-of-brower-crashes
guid: 1743
---

So a few days ago I posted a <a href="http://www.blogcfc.com/index.cfm/2006/12/31/Save-entry-data">question</a> on the BlogCFC blog about whether I should add "crash protection" to the BlogCFC entry editor. What did I mean by that? As much as I love Firefox, it isn't the most stable beast in the world. That wouldn't matter so much except that I tend to get a bit worried when writing a particularly long blog entry. In the past I've used Word to write long entries since I know Word will automatically save my text even if I forget to. While BlogCFC does support XML-RPC clients, none of them have really caught on with my writing style so I haven't been using them.
<!--more-->
Over on cf-talk, Jacob Munson mentioned that Blogger (I think that's some other blogware product - anyone heard of it? ;) will automatically save a draft of your blog entry every few seconds. I decided to take a look at how hard this would be to add to BlogCFC. Turns out it wasn't hard at all.  I figured other people may benefit from this as a possible feature they could add to their own products. 

So first off - let me talk a bit about the technique. The idea is simple: Every N seconds store the contents of the blog entry to a JavaScript cookie. Add code on the server side to check for this cookie when first displaying the form. Also add code to clean up the cookies when an entry has been stored. 

For BlogCFC I decided to be lazy and only store two things - the title and body of the blog entry. Here is the JavaScript code I ended up using:

<code>
//used to save your form info (title/body) in case your browser crashes
function saveText() {
	var titleField = $("title");
	var bodyField = $("body");
	var expire = new Date();
	expire.setDate(expire.getDate()+7);
			
	//write title to cookie
	var cookieString = 'savedtitle=' + escape(titleField.value)+'; expires=' + expire.toGMTString() + '; path=/';
	document.cookie = cookieString;
	cookieString = 'savedbody=' + escape(bodyField.value) + '; expires=' + expire.toGMTString() + '; path=/';
	document.cookie = cookieString;
	window.setTimeout('saveText()',5000);
}
		
window.setTimeout('saveText()',5000);
</code>

The first thing I want to point out are these two lines:

<code>
var titleField = $("title");
var bodyField = $("body");
</code>

These are Spry (copied from Prototype) shorthands for:

<code>
var titleField = document.getElementById("title");
var bodyField = document.getElementById("body");
</code>

Outside of that - everything else is vanilla JavaScript. JavaScript lets you add cookies by simply setting the document.cookie value. Also note that document.cookie isn't a simple string. If you run <i>document.cookie = something</i> multiple times, you end up with multiple cookies. 

The format for a cookie string is name=value; expires=DATE; path=PATH. In my case I simply used a cookie that expires in 7 days and a path of /. 

Lastly I have a window.setTimeout, both outside of the function and inside, that will run this code every 5 seconds. Any duration is fine really. 

To restore the values, I used this set of code on the server side:

<code>
&lt;cfif not structKeyExists(form, "title") and structKeyExists(cookie, "savedtitle")&gt;
	&lt;cfset form.title = cookie.savedtitle&gt;
&lt;/cfif&gt;
&lt;cfif not structKeyExists(form, "body") and structKeyExists(cookie, "savedbody")&gt;
	&lt;cfset form.body = cookie.savedbody&gt;
&lt;/cfif&gt;
</code>

Basically I simply ensure that I'm not already posting and see if I have anything in the cookie. I clear out the cookies using this code:

<code>
&lt;cfcookie name="savedtitle" value="" expires="now"&gt;
&lt;cfcookie name="savedbody" value="" expires="now"&gt;
</code>

As you can see, this is a pretty trivial implementation. Anyone else using something like this in their applications?