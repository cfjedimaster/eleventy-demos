---
layout: post
title: "Using CF8 Ajax features to solve the 'pick one of thousands' issue (2)"
date: "2008-12-31T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/31/Using-CF8-Ajax-features-to-solve-the-pick-one-of-thousands-issue-2
guid: 3169
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2008/12/25/Using-CF8-Ajax-features-to-solve-the-pick-one-of-thousands-issue">posted</a> a blog entry discussing a method to allow someone to browse thousands of records within a form. The blog entry made use of ColdFusion 8 built-in Ajax technology. I promised a jQuery version and I finally got around to it. (<b>Reminder</b> - I'm still rather new to jQuery so this code does not represent best practice. Well, probably not. If it does, I'm unexpectedly brilliant.)
<!--more-->
I knew that jQuery doesn't provide UI widgets out of the box. There is a <a href="http://ui.jquery.com/">jQuery UI</a> project (although I'm not sure how far along it is) and about one million UI plugins, but I decided to stick to what came with the default library.

Instead of using a window like I did in the previous demo, I used jQuery's animation support to hide and show a div. This is rather easy. You can use show, hide, and toggle to show or hide any element on the page. So if you remember my form from the previous blog entry, I added a div below it:

<code>
&lt;div id="userlist" style="background-color:##3CF;width:500px;"&gt;&lt;/div&gt;
</code>

The color and width were just random picks and aren't really relevant. Since the div is empty it will not show up on initial page load. Next to my user form field, I added new code to activate my user list:

<code>
&lt;tr valign="top"&gt;
	&lt;td&gt;Owner:&lt;/td&gt;
	&lt;td&gt;
	&lt;input type="hidden" id="useridfk" name="useridfk" value="#form.useridfk#" /&gt;
	&lt;span id="ownerspan"&gt;User 1&lt;/span&gt;&lt;br/&gt;
	&lt;a href="" onClick="toggleSelector();return false"&gt;Select Owner&lt;/a&gt;
	&lt;/td&gt;
&lt;/tr&gt;
</code>

Note the toggleSelector code. This runs:

<code>
function toggleSelector() {
	$("##userlist").toggle("fast",loadUsers);	
}
</code>

This code gets the userlist div (the double # is due to the code being within a cfoutput) and runs toggle on it. Fast is the speed and loadUsers is a function to run when the toggle is done. Let's look at loadUsers:

<code>
function loadUsers() {
	//http://dotnet.org.za/heinrich/archive/2008/09/10/jquery-test-for-visibility.aspx
	if(!$('##userlist').is(':visible')) return;
	console.log('im on, so going to load stuff');
	$('##userlist').load('test_userlist2.cfm');
}
</code>

Now I ran into my first problem. I want to load content into div when it is shown. While jQuery makes it easy to show or hide a div, it does not, as far as I know, provide an easy way to tell if the div is currently visible. That seems a bit silly, but after some Googling, I found the URL referenced in the code above and used that for my check. If we aren't showing the div, we just leave. I could have used a JavaScript variable as well I guess. If the div is visible, then we need to load my list of users. I love how simple jQuery makes it. 

Ok, so this was almost perfect. The next issue I ran into involved the initial state of the div. Remember how I said it was essentially hidden because nothing was in the div? While it may not have shown anything, it was not actually hidden. The first time you click the link and toggle() is run, it will hide the div. I wanted the first click to show the user list. I used the following code to hide the div on page load:

<code>
$(document).ready(function() {
	$("##userlist").hide()
});
</code>

Alright - the next thing I need to do is work on my user list. In the previous example I used ajaxLink for my next/previous links. This kept the content within the cfwindow. Obviously I'm not using a cfwindow now, so what can I do? I decided to simply use the same .load function I demonstrated earlier. Let's look at the complete test_userlist2.cfm:

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset total = 92&gt;
&lt;cfset perpage = 10&gt;

&lt;script&gt;
selectUser = function(id,label) {
	$("#ownerspan").html(label);
	$("#useridfk").val(id);
	$('#userlist').toggle('fast');
}

load = function(url) {
	$('#userlist').load(url);
}
&lt;/script&gt;

&lt;h3&gt;Select User&lt;/h3&gt;

&lt;cfloop index="x" from="#url.start#" to="#min(url.start+perpage-1, total)#"&gt;
   &lt;cfoutput&gt;
   &lt;a href="" onClick="selectUser(#x#,'Record #x#');return false;"&gt;Record #x#&lt;/a&gt;&lt;br /&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;cfif url.start gt 1&gt;
   &lt;a href="" onClick="load('#cgi.script_name#?start=#url.start-perpage#');return false;"&gt;Previous&lt;/a&gt;
&lt;cfelse&gt;
   Previous
&lt;/cfif&gt;
/
&lt;cfif (url.start+perpage-1) lt total&gt;
   &lt;a href="" onClick="load('#cgi.script_name#?start=#url.start+perpage#');return false;"&gt;Next&lt;/a&gt;
&lt;cfelse&gt;
   Next
&lt;/cfif&gt;
&lt;/cfoutput&gt;
</code>

If you scroll to the bottom of the code, you can see I'm calling a new load() function (I used the same name as the jQuery function, which may be bad) with the URL I want to load into div. My load function just runs the jQuery version, and with that, my pagination is complete. 

The code I use when you select a user is a bit simpler than the CF8 version. I use html() to set the user's name in the span. I set val() to set the hidden form field variable, and then I toggle to div to hide it away. 

All in all, I think the CF8 version was a bit simpler to use, especially in the simple 'show/hide' part of the application. I spent 80% of my dev time on this just trying to solve the problem of "is the div showing" which is a bit surprising. I also performed a YSlow comparison. I know folks complain from time to time about the download impact of CF8 Ajax stuff. In my opinion, it really isn't that big of a deal, especially when you consider the ease of use, but I did want to take a look and compare.

The CF8 version, when cached, 12.7K. The jQuery version, when cached, was 10.5K. Not different enough to be significant in my opinion. The non cached version though was hugely different. The jQuery version 66.3K. The CF8 version was 462.5K. As I said - significant. Of course, that's just your first hit, and probably not that much different than a typical Flex application.

The code I used for this demo is attached to the blog entry.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Farchive22%{% endraw %}2Ezip'>Download attached file.</a></p>