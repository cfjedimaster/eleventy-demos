---
layout: post
title: "Providing context help for drop downs with jQuery"
date: "2010-12-28T12:12:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/12/28/Providing-context-help-for-drop-downs-with-jQuery
guid: 4065
---

I'm working on updating the UI to <a href="http://groups.adobe.com">Adobe Gorups</a> (don't worry - it's not my design) and I came across an interesting issue. I've got a simple drop down of options the user can chose from but I want to provide some contextual help as well. So if you select an option I want to describe the option in greater detail. Here is a quick solution I came up with that makes use of custom data attributes and jQuery.
<!--more-->
<p>

For my option I decided to make use of custom data attributes. This is a <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/dom.html#embedding-custom-non-visible-data">HTML5</a> spec that describes the ability to add any additional attribute to an HTML attribute by simply prefixing it with data-. So for example:

<p>

<code>
&lt;b data-coolness="verycool"&gt;Raymond&lt;/b&gt;
</code>

<p>

What's cool is that jQuery provides support for reading and writing these values using the <a href="http://api.jquery.com/jQuery.data/">data()</a> function. Oddly (and maybe I just misread the doc), you use data() as the root of the jQuery library and not in a selector. So this is <b>not</b> allowed:

<p>

<code>
$("some item").data(....);
</code>

<p>

Instead, you do:

<p>

<code>
$.data(somedom, "somekey", "option value to set");
</code>

<p>

I suppose since $(..) returns an array another way of working with data was necessary. <b>EDIT: Ignore the last two sentences. I <i>initially</i> had this misconception when I was writing my tests, then quickly realized I was wrong. However, when it came time to write the blog entry, I had a brain fart. Sorry!</b>

<p>

Anyway - here is what I did for my first draft:

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#features").change(function() {
		$("#description").text("");
		var option = $("option:selected",this);		
		var desc = $(option).data("description");
		$("#description").text(desc);
	});
})
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
Select an option for your new car:
&lt;select name="features" id="features"&gt;
&lt;option value=""&gt;&lt;/option&gt;
&lt;option value="1" data-description="Turns on your wipers automatically when it rains."&gt;Automatic Wipers&lt;/option&gt;
&lt;option value="2" data-description="Helps ensure you get the best parking spot."&gt;Machine Guns&lt;/option&gt;
&lt;option value="3" data-description="Clears messy traffic jams."&gt;Sidewinder Missiles&lt;/option&gt;
&lt;/select&gt;
&lt;/form&gt;
&lt;div id="description"&gt;&lt;/div&gt;
&lt;/body&gt;

&lt;/html&gt;
</code>

<p>

Let's start at the bottom. Notice my drop down has additional attributes in the data scope called description. This will be completely ignored by the rendering of your browser. Now head up to the code. I've bound a change handler to the drop down that notices changes. I get the select option and then fetch the description data property. I then use this text within my div. You can test this code here: <a href="http://www.raymondcamden.com/demos/dec282010/test.cfm">http://www.coldfusionjedi.com/demos/dec282010/test.cfm</a>

<p>

So while that worked, it occurred to me that for a set of options, you most likely wanted to allow a person to select any number of options. How would we handle it if the select item allowed for multiple selections? Here is the code I came up with. Unfortunately, this code is a complete fail in Internet Explorer. It should run fine but it won't provide the help we want. I'll talk about what I tried after I show the code that worked in every other fracking browser. 

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#features option").click(function() {
		$("#description").text("");
		if($(this).attr("selected")) {
			var desc = $(this).data("description");
			$("#description").text(desc);
		}
	});

})
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
Select an option for your new car:&lt;br/&gt;
&lt;select name="features" id="features" multiple size="5"&gt;
&lt;option value="1" data-description="Turns on your wipers automatically when it rains."&gt;Automatic Wipers&lt;/option&gt;
&lt;option value="2" data-description="Helps ensure you get the best parking spot."&gt;Machine Guns&lt;/option&gt;
&lt;option value="3" data-description="Clears messy traffic jams."&gt;Sidewinder Missiles&lt;/option&gt;
&lt;/select&gt;
&lt;/form&gt;
&lt;div id="description"&gt;&lt;/div&gt;
&lt;/body&gt;

&lt;/html&gt;
</code>

<p>

So HTML wise the only change was the addition of multiple and size to the drop down. The JavaScript code is a bit different though. First - I changed my selector to include option. This ensures that if I click in the blank spaces after my option I won't have anything occur. Next - I need to see if the option was selected. If you ctrl-click on a selected item than it's going to disable the option. There is no point in describing the feature in that case. If it is selected then the rest of the code is the same. You can see this here: <a href="http://www.coldfusionjedi.com/demos/dec282010/test2.cfm">http://www.coldfusionjedi.com/demos/dec282010/test2.cfm</a>

<p>

So - what about IE? First - IE never noticed the click event. Ok - so I switched to a click on the drop down, not the option. I then thought - I can look at the Event object and see if the target was on the select or the option. I found that this code worked great:

<p>

<code>
if(e.srcElement.tagName == "OPTION") {
</code>

<p>

Accept... once again... fracking iE just returned SELECT. I tried e.target, e.currentTarget, e.srcElement, and in all cases, IE wasn't able to detect that an option had been clicked on versus the select itself. In theory, one could keep a list of items clicked. You would then be able to check that list and if an item is gone now it meas a deselect. Screw that. This feature is meant to provide help to the end user but is not mission critical. Therefore I'm skipping over IE. If someone has a fix though I'd love to hear it.