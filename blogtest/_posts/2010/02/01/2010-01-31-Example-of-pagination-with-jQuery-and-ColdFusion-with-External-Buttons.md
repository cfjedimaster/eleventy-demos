---
layout: post
title: "Example of pagination with jQuery and ColdFusion with \"External Buttons\""
date: "2010-02-01T09:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/02/01/Example-of-pagination-with-jQuery-and-ColdFusion-with-External-Buttons
guid: 3705
---

That title really isn't very clear, so let me explain a bit more about what this blog entry is about. A reader asked if it was possible to do pagination via Ajax (ie, each page of content is loaded via Ajax), but have the controls (the previous and next buttons) exist <i>outside</i> of the Ajax-loaded content. This is an interesting question. It is <b>incredibly</b> trivial to load content via Ajax with jQuery. My seven year old could do it in his sleep. But we need to find a way to handle showing, and hiding, the navigation controls. We also need to ensure those controls can correctly "drive" the content to handle paging. Like ColdFusion, jQuery provides many ways to solve a problem. This is just one example.
<!--more-->
<p>

Let's begin by creating the template that will serve our paged data. I'm calling this displayart.cfm. It will use the cfartgallery datasource installed with the ColdFusion examples.

<p>

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset perPage = 10&gt;

&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select	art.artname, art.description, art.price
from	art
order by art.artname asc
&lt;/cfquery&gt;

&lt;cfoutput query="getart" startrow="#url.start#" maxrows="#perpage#"&gt;
&lt;p&gt;
&lt;b&gt;#artname#&lt;/b&gt; #dollarFormat(price)#&lt;br/&gt;
#description#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

Nothing too fancy here. Notice I use url.start to drive where the pagination begins. Also note I'm doing "sloppy" paging with cfoutput startrow and maxrows. This isn't efficient, but it gets the job done. Now let's switch to the front end:

<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(function() {
	$("#content").load("displayart.cfm")
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Art&lt;/h2&gt;

&lt;div id="content"&gt;&lt;/div&gt;

&lt;div id="nav"&gt;
	&lt;input type="button" id="prev" value="Previous"&gt;
	&lt;input type="button" id="next" value="Next"&gt;	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I've got a super simple page here with one div to hold my content and another div to hold my pagination controls. When the document loads, I immediately load in the my art content. So this works easily enough, but now we need to address our first issue - how do I get the controls to show or hide? I edited displayart.cfm and added the following:

<p>

<code>
&lt;script&gt;
$(function() {
	&lt;!--- Show Prev if start gt 1 ---&gt;
	&lt;cfif url.start gt 1&gt;
	&lt;cfoutput&gt;
	showPrev()
	&lt;/cfoutput&gt;
	&lt;cfelse&gt;
	hidePrev()
	&lt;/cfif&gt;
	&lt;!--- Show next if we need to ---&gt;
	&lt;cfif (url.start + perPage - 1) lt getart.recordCount&gt;
	&lt;cfoutput&gt;
	showNext()
	&lt;/cfoutput&gt;
	&lt;cfelse&gt;
	hideNext()
	&lt;/cfif&gt;
})
&lt;/script&gt;
</code>

<p>

This code will execute when the content is loaded into the page via our main "controller" page. It checks to see if we are at the beginning of our pagination or not at the end, and either outputs a show or hide version for Prev and Next. So if we have more than one page of content, the net result on the first load should be:

<p>

hidePrev()<br/>
showNext()<br/>

<p>

Which reflects the fact that we don't need a Previous button, but we do need a next button. So I went back to my controller page (can't think of a better term for that - hopefully it makes sense) and added the following:

<p>

<code>
function showPrev(){
	$("#prev").show()
}

function hidePrev(){
	$("#prev").hide()
}

function showNext(){
	$("#next").show()
}

function hideNext(){
	$("#next").hide()
}
</code>

<p>

As you can see, I simply use jQuery's show and hide commands to set the visibility of each button. I ran my code and confirmed it worked. On the first load, the previous button was hidden and the next button showed up. Note that this runs <i>after</i> the first bit of content was loaded. That means the Previous button could be visible for a second or two. I don't think this is bad but if it bugs you, you can use CSS to hide the button initially, or simply add: $("#prev").hide() to the $(function() block.

<p>

Ok, so that's one problem solved. The next problem is - how do I get the buttons to actually work. It's easy enough to add an event handler for their click events, but they need to know how to update the page in the content div. I decided on the following modification. When I make the call to show the previous or next button, I pass along the proper starting index:

<p>

<code>
&lt;!--- Show Prev if start gt 1 ---&gt;
&lt;cfif url.start gt 1&gt;
&lt;cfoutput&gt;
showPrev(#url.start-perpage#)
&lt;/cfoutput&gt;
&lt;cfelse&gt;
hidePrev()
&lt;/cfif&gt;
&lt;!--- Show next if we need to ---&gt;
&lt;cfif (url.start + perPage - 1) lt getart.recordCount&gt;
&lt;cfoutput&gt;
showNext(#url.start+perpage#)
&lt;/cfoutput&gt;
&lt;cfelse&gt;
hideNext()
&lt;/cfif&gt;
</code>

<p>

Back in the main template, I updated showPrev and showNext to store these values:

<p>

<code>
var prevstart = 1
var nextstart = 1

function showPrev(newprevstart){
	prevstart = newprevstart
	$("#prev").show()
}

...

function showNext(newnextstart){
	nextstart = newnextstart
	$("#next").show()
}
</code>

<p>

And finally, I added my event listeners:

<p>

<code>
$("#next").click(function() {
	$("#content").load("displayart.cfm?start="+nextstart);
})

$("#prev").click(function() {
	$("#content").load("displayart.cfm?start="+prevstart);
})
</code>

<p>

So basically we ended up with our Ajax loaded content telling the parent when to show or hide the navigation and also how to form the new URL to load the previous or next page of data. As I said earlier, I'm sure this could be done a thousand other ways! I'll end with the complete listings for both, starting with the main template:

<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(function() {
	$("#content").load("displayart.cfm")

	$("#next").click(function() {
		$("#content").load("displayart.cfm?start="+nextstart);
	})

	$("#prev").click(function() {
		$("#content").load("displayart.cfm?start="+prevstart);
	})

})

var prevstart = 1
var nextstart = 1

function showPrev(newprevstart){
	prevstart = newprevstart
	$("#prev").show()
}

function hidePrev(){
	$("#prev").hide()
}

function showNext(newnextstart){
	nextstart = newnextstart
	$("#next").show()
}

function hideNext(){
	$("#next").hide()
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Art&lt;/h2&gt;

&lt;div id="content"&gt;&lt;/div&gt;

&lt;div id="nav"&gt;
	&lt;input type="button" id="prev" value="Previous"&gt;
	&lt;input type="button" id="next" value="Next"&gt;	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And here is displayart.cfm:

<p>

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset perPage = 10&gt;

&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select	art.artname, art.description, art.price
from	art
order by art.artname asc
&lt;/cfquery&gt;

&lt;script&gt;
$(function() {
	&lt;!--- Show Prev if start gt 1 ---&gt;
	&lt;cfif url.start gt 1&gt;
	&lt;cfoutput&gt;
	showPrev(#url.start-perpage#)
	&lt;/cfoutput&gt;
	&lt;cfelse&gt;
	hidePrev()
	&lt;/cfif&gt;
	&lt;!--- Show next if we need to ---&gt;
	&lt;cfif (url.start + perPage - 1) lt getart.recordCount&gt;
	&lt;cfoutput&gt;
	showNext(#url.start+perpage#)
	&lt;/cfoutput&gt;
	&lt;cfelse&gt;
	hideNext()
	&lt;/cfif&gt;
})
&lt;/script&gt;

&lt;cfoutput query="getart" startrow="#url.start#" maxrows="#perpage#"&gt;
&lt;p&gt;
&lt;b&gt;#artname#&lt;/b&gt; #dollarFormat(price)#&lt;br/&gt;
#description#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>