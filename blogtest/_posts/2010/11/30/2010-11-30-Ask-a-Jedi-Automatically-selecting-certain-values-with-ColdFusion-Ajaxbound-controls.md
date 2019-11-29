---
layout: post
title: "Ask a Jedi: Automatically selecting certain values with ColdFusion Ajax-bound controls"
date: "2010-11-30T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/30/Ask-a-Jedi-Automatically-selecting-certain-values-with-ColdFusion-Ajaxbound-controls
guid: 4032
---

Shawn asked:

<p/>

<blockquote>
I am having an issue with a cfselect and I am wondering if you can help.  I have a cfselect that binds to a CFC (to get value list) after another cfselect is changed.  I need to have the cfselect (that is bound) to autoselect a particular value, if it exists in the returned values from the CFC.
I have tried the onChange attribute of the cfselect (to see if it is triggered when the values are updated, but it appears that won't work.  Do you know of any other way to achieve the autoselect?
</blockquote>
<!--more-->
<p/>

I wasn't exactly sure what he meant here, so I countered with: So basically, your CFC may return A,B,C and you want code that says ,"Hey, if you ever return C, default to that being selected." That's what he meant. 

<p/>

So - this is a case where ColdFusion's Ajax makes something that is typically kinda easy a bit awkward. In jQuery I'd have code that binds to the first drop down and manually fires off the request to get the content for the second drop down. In the handler for it I'd notice "C" and select it. While you can do that with cfajaxproxy, I went with a route that may be simpler but... I don't know. It works - but I'd be happier with it
in jQuery. ;)

<p/>

<code>
&lt;cfajaxproxy bind="javascript:mediachange({% raw %}{mediaid}{% endraw %})"&gt;
&lt;cfajaxproxy bind="javascript:artchange({% raw %}{artid}{% endraw %})"&gt;
&lt;head&gt;
&lt;script&gt;
var mediaChanged = false;
function mediachange(x) {
	console.log("media "+x);
	mediaChanged = true;
}
function artchange(x) {
	console.log("art "+x);
	if(mediaChanged) {
		//get my values
		var dd = document.getElementById('artid');
	    for(var i = 0; i &lt; dd.length; i++){
	        if(dd.options[i].text == "Space"){
	            dd.selectedIndex = i;
	        }
	    }
		mediaChanged = false;
	}
}
&lt;/script&gt;
&lt;/head&gt;

&lt;cfform &gt;
&lt;table&gt;
   &lt;tr&gt;
      &lt;td&gt;Select Media Type:&lt;/td&gt;
      &lt;td&gt;&lt;cfselect name="mediaid" id="mediaid"
            bind="cfc:art.getMedia()"
            bindonload="true" value="mediaid" display="mediatype"  /&gt;&lt;/td&gt;
   &lt;/tr&gt;
   &lt;tr&gt;
      &lt;td&gt;Select Art:&lt;/td&gt;
      &lt;td&gt;&lt;cfselect name="artid"
            bind="cfc:art.getArt({% raw %}{mediaid}{% endraw %})" value="artid" display="artname" /&gt;&lt;/td&gt;
   &lt;/tr&gt;
&lt;/table&gt;
&lt;/cfform&gt;
</code>

<p/>

In the example above I've got two related drop downs. Selecting an item in the first drop forces new data to load in the second. In order to handle the new "Look for C and auto select it" logic I used two cfajaxproxy tags. One runs a JavaScript function on changing the first drop down and the second one handles the other one. When a change is made to the first drop down I set a boolean value, mediachanged, to true. When the second one changes, I look for this value. If it is true, I grab the values and look for my special value. In this case I just hard coded the word "Space". That could be dynamic. I could also check the value and not the text. Notice though that I set mediachanged back to false. Why?

<p/>

Well, I needed a way to know when the values in the second drop down were loaded. Whenever ColdFusion loads these values, it will select the first one, automatically 'changing' it and running artchange. I only need to care about this once - right after you change the media drop down. If you change the drop down yourself, I don't want to reset it back to Space. Hence the use of the variable. 

<p/>

So as I said - not terribly elegant - but it works.