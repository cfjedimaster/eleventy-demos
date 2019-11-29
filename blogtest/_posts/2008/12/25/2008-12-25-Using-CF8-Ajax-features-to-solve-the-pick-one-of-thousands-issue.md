---
layout: post
title: "Using CF8 Ajax features to solve the 'pick one of thousands' issue"
date: "2008-12-25T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/25/Using-CF8-Ajax-features-to-solve-the-pick-one-of-thousands-issue
guid: 3162
---

Let me apologize for the title. I tried like heck but I couldn't find a better title for the issue I'm talking about. Personally I blame the apple pie. Let me describe the problem and how I used ColdFusion 8 Ajax features to solve it. If folks have a better title for the blog entry, I'll be sure to use it in the Spry/jQuery and maybe Ext versions I have planned.

Ok, so what in the heck am I talking about? Imagine a simple form that represents an entity in your database. For example, one project at <a href="http://www.riaforge.org">RIAForge</a> (Yes, it's still up). Projects have many different fields, most of which are simple text based fields like name and description. Some fields are pointers to other database tables. Projects can exist in categories so my form has an HTML select field for choosing related categories. Projects also have owners and this is where my main problem comes in. RIAForge currently has over 4,500 users. If I want to build a 'typical' way to edit the owner for a project I'd have a select drop down with 4,500 options. That probably <i>would</i> work since most of us have cable modems, but it's going to be a bit insane to actually use. That's why I actually don't change owners at RIAForge. I don't think anyone has ever asked and I realized early on that this would be a problem. So what could I do if I actually <i>did</i> want to let people change owners for a project?
<!--more-->
I decided my first solution to this problem would use ColdFusion 8's built-in Ajax features only. I decided one simple way to handle it would be to display the current owner as plain text, but to then let you click a link to launch a browser of users. This would make use of cfwindow and have built-in pagination. Here is a screen shot of the final product. This is the form as it initially loads:

<img src="https://static.raymondcamden.com/images//Picture 129.png">

When you click Select User, the window control is activated:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 313.png">

And because I love me some gratuitous Flash, here is a screencast of the solution in action:

<i>Note - the embed below is working oddly. I haven't used Jing in a while. Click in the triangle in the upper left hand corner to start the movie.</i>

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="467" height="352"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/FirstFrame.jpg&width=467&height=352&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/00000001.swf"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <param name="base" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="467" height="352" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/FirstFrame.jpg&width=467&height=352&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/00000001.swf" allowFullScreen="true" base="http://content.screencast.com/users/jedimaster/folders/Jing/media/9253c6ea-bf96-4cde-ae62-20243cd73f17/" scale="showall"></embed> </object>

Ok, so whats going on here? The main page, test_largeds.cfm, is a faked out form. I wanted something folks could download and play with (download link at the bottom) so I didn't use a real database. Most of the code is vanilla form, so I'll dump it here and explain the interesting parts.

<code>
&lt;cfparam name="form.name" default="Some Value"&gt;
&lt;cfparam name="form.foo" default="Some Other Value"&gt;
&lt;cfparam name="form.useridfk" default="1"&gt;
&lt;cfdump var="#form#" label="Form" /&gt;
&lt;cfoutput&gt;
&lt;form action="#cgi.script_name#" method="post"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="name" value="#form.name#" /&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr valign="top"&gt;
		&lt;td&gt;Owner:&lt;/td&gt;
		&lt;td&gt;
		&lt;input type="hidden" id="useridfk" name="useridfk" value="#form.useridfk#" /&gt;
		&lt;span id="ownerspan"&gt;User 1&lt;/span&gt;&lt;br/&gt;
		&lt;a href="" onClick="ColdFusion.Window.show('userlist');return false"&gt;Select Owner&lt;/a&gt;
		&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Foo:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="foo" value="#form.foo#" /&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="save" value="Save" /&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfwindow center="true" draggable="true" modal="true" name="userlist" source="test_userlist.cfm" title="Select Owner" width="250" height="280" /&gt;
</code>

The name, foo, and useridfk values are all hard coded. Name and foo are simple text fields just for comparison. The owner field is a bit different. I used a hidden form field for the owner's ID value. Below it I output his name (again, it's only hard coded here because this is a demo). Next is a link that is used to activate the cfwindow defined at the very bottom of the page. The window points to test_userlist.cfm. Let's take a look at that now:

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset total = 92&gt;
&lt;cfset perpage = 10&gt;

&lt;script&gt;
selectUser = function(id,label) {
	document.getElementById('ownerspan').innerHTML = label;
	document.getElementById('useridfk').value = id;
	ColdFusion.Window.hide('userlist');
}
&lt;/script&gt;

&lt;cfloop index="x" from="#url.start#" to="#min(url.start+perpage-1, total)#"&gt;
   &lt;cfoutput&gt;
   &lt;a href="" onClick="selectUser(#x#,'Record #x#');return false;"&gt;Record #x#&lt;/a&gt;&lt;br /&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;cfif url.start gt 1&gt;
   &lt;a href="#ajaxLink('#cgi.script_name#?start=#url.start-perpage#')#"&gt;Previous&lt;/a&gt;
&lt;cfelse&gt;
   Previous
&lt;/cfif&gt;
/
&lt;cfif (url.start+perpage-1) lt total&gt;
   &lt;a href="#ajaxLink('#cgi.script_name#?start=#url.start+perpage#')#"&gt;Next&lt;/a&gt;
&lt;cfelse&gt;
   Next
&lt;/cfif&gt;
&lt;/cfoutput&gt;
</code>

Most of the code was <a href="http://www.coldfusionjedi.com/index.cfm/2008/12/14/Ask-a-Jedi-Simple-ColdFusion-8-Ajax-Pagination">ripped</a> from an earlier blog entry and takes care of outputting a page of hard coded data. There are a few critical things to note here. First, the pagination makes use of ajaxLink. This keeps the linked content within the cfwindow container. Next, notice how each person's record is a link to a function named selectUser. 

The selectUser function takes an ID and a label. I then use getElementById to grab the span defined in the previous template as well as the hidden form field. Once the values are updated I simply hide the window.

This is a simple demo and could be improved with a bit more functionality. Using RIAForge as the example, I probably would not want to "Next" through more than 4500 records. Adding a simple name filter on top would help reduce the amount of pages I'd have to flip through.

Thoughts? As I mentioned at the beginning of this post I plan on discussing similar solutions in jQuery and Spry as well.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Farchive21%{% endraw %}2Ezip'>Download attached file.</a></p>