---
layout: post
title: "Ask a Jedi: Another CFWINDOW Example"
date: "2008-09-26T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/26/Ask-a-Jedi-Another-CFWINDOW-Example
guid: 3032
---

Ron Mouseleggings asks:

<blockquote>
<p>
I am having a little difficulty figuring something out and wanted to see if you have any suggestions.  I have created a result set of multiple phone numbers that I am looping over with each having a unique ID.  Next to each phone number entry I have an EDIT button.  When clicked I want it to pass a variable (ID/value) of that phone number to a single CFWINDOW element so the phone number can be edited and saved back to a database.
</p>
</blockquote>

I thought this was a simple question, but it turned out to be a bit hairy. Let's start by taking a look at the code he tried.
<!--more-->
<code>
&lt;cfform&gt;
&lt;cfloop from="1" to="#arrayLen(phoneArray)#"
index="x"&gt;
   &lt;cfoutput&gt;
       &lt;tr&gt;
           &lt;th
style="white-space:nowrap;"&gt;Phone #x#: &lt;/th&gt;
           &lt;td
style="white-space:nowrap;"&gt;#phoneArray[x].p.phone_number#&lt;/td&gt;
&lt;td&gt;&lt;a href="##"
onclick="javascript:ColdFusion.Window.show('pop_phone_edit')"&gt;EDIT&lt;/a&gt;&lt;/td&gt;
&lt;/tr&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/cfform&gt;

&lt;cfwindow center="true"
modal="true" width="350" height="130"
   name="pop_phone_edit" title="Edit
Phone Number"
   initshow="false" draggable="true" resizable="true"
closable="true" refreshOnShow="true"
source="phone_edit.cfm?varPersonID=#varPersonID#&varPhoneID=???????????" /&gt;
</code>

The code here isn't too complex. He loops over an array of data and for each one, he links to a JavaScript call to show the cfwindow defined at the bottom. As you can see though, he isn't sure how to tie the URL of the window to the item that was clicked. While there are multiple ways of solving this problem, here is how I did it.

First, lets start with the display. I created a hard coded array for my data as well:

<code>
&lt;cfset phoneArray = [9,4,1]&gt;
&lt;table&gt;
&lt;cfloop from="1" to="#arrayLen(phoneArray)#" index="x"&gt;
   &lt;cfoutput&gt;
       &lt;tr&gt;
           &lt;th style="white-space:nowrap;"&gt;Phone #x#: &lt;/th&gt;
           &lt;td style="white-space:nowrap;"&gt;#phoneArray[x]#&lt;/td&gt;
		   &lt;td&gt;&lt;a href="##" onclick="javascript:showWin('#phoneArray[x]#')"&gt;EDIT&lt;/a&gt;&lt;/td&gt;
		&lt;/tr&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
</code>

Note that I've switched from opening the window to calling a new JavaScript function, showWin. I also removed his inline cfwindow. Now lets look at the JavaScript:

<code>
function showWin(id) {
	ColdFusion.Window.create('phoneedit','Edit Phone Number', 'test2.cfm?id='+id,{% raw %}{center:true}{% endraw %});
}
</code>

Nothing too complex here either. Note that I pass in the ID value, and then construct my URL based on the ID. So again, nothing too crazy. I did have to add this to the top of my page since I didn't have an inline cfwindow tag:

<code>
&lt;cfajaximport tags="cfwindow"&gt;
</code>

This creates a new problem though. When you click one link, it works great. When you click another link, the data in the window (I used a simple URL dump) doesn't change. What's happening here is that the same window object is being reused. We need a way to tell ColdFusion to make a new window object. We could name the window based on the ID - but then we could have multiple windows open at one time. I don't want that. So what can we do? Well ColdFusion does let us notice when a window is hidden (which is what happens when you close the window). I can add this:

<code>
ColdFusion.Window.onHide('phoneedit',cleanup);
</code>

This will then run a new function, cleanup, when the window is closed:

<code>
function cleanup() {
	ColdFusion.Window.destroy('phoneedit',true);
}
</code>

Woot! This works perfectly. But lets add another wrinkle to this. What if I click a link, and <i>don't</i> close the window before I click another link? Unfortunately the window won't refresh. This can be a bit confusing. How about modifying showWin to see if the window already exists, and if so, close it? Turns out this isn't easy either! ColdFusion provides us with ColdFusion.Window.getWindowObject, but this will throw an error if the window doesn't exist. I could use a new variable that simply stores a true/fase. If true, it means the window exists, and I can use that to see if I can destroy the window. That's a bit hacky too. Instead I settled on a try/catch:

<code>
function showWin(id) {
	//do we have one?
	try {
		ColdFusion.Window.destroy('phoneedit',true);
	} catch(e) {% raw %}{ }{% endraw %}
	
	ColdFusion.Window.create('phoneedit','Edit Phone Number', 'test2.cfm?id='+id,{% raw %}{center:true}{% endraw %});
	ColdFusion.Window.onHide('phoneedit',cleanup);
}
</code>

This will now attempt to destroy the window on every click. I'll paste the entire script below, but some quick thoughts. I'm really surprised that this is so simple. ColdFusion.Window.create needs an option to recreate the object if it already exists. I suppose we could also have used ColdFusion.navigate, but we would need to see if a Window object exists, and we are back to the problem I mentioned above. This needs to be simpler, I'd say, as the use case of 'popping a window to edit something' is probably one of the biggest uses of cfwindow. Anyway, here is the complete script. Enjoy.

<code>
&lt;cfajaximport tags="cfwindow"&gt;
	
&lt;script&gt;
function cleanup() {
	ColdFusion.Window.destroy('phoneedit',true);
}

function showWin(id) {
	//do we have one?
	try {
		ColdFusion.Window.destroy('phoneedit',true);
	} catch(e) {% raw %}{ }{% endraw %}
	
	ColdFusion.Window.create('phoneedit','Edit Phone Number', 'test2.cfm?id='+id,{% raw %}{center:true}{% endraw %});
	ColdFusion.Window.onHide('phoneedit',cleanup);
}
&lt;/script&gt;

&lt;cfset phoneArray = [9,4,1]&gt;
&lt;table&gt;
&lt;cfloop from="1" to="#arrayLen(phoneArray)#" index="x"&gt;
   &lt;cfoutput&gt;
       &lt;tr&gt;
           &lt;th style="white-space:nowrap;"&gt;Phone #x#: &lt;/th&gt;
           &lt;td style="white-space:nowrap;"&gt;#phoneArray[x]#&lt;/td&gt;
		   &lt;td&gt;&lt;a href="##" onclick="javascript:showWin('#phoneArray[x]#')"&gt;EDIT&lt;/a&gt;&lt;/td&gt;
		&lt;/tr&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
</code>