---
layout: post
title: "Example of jQuery loading form fields"
date: "2010-05-24T10:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/05/24/Example-of-jQuery-loading-form-fields
guid: 3829
---

I've exchanged a few emails lately with a reader, Daniel, who was looking at how he could use AJAX to set the value of a large set of form fields. I whipped up the follow jQuery/ColdFusion demo that I hope others may find useful as well.
<p>
<!--more-->
To begin, I create a very simple form that allows you to select a person in a drop down. When you select the person, we will use AJAX to get details on the user and then fill in the form fields based on that data. Here is the initial version.
<p>
<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#person").change(function () {
		var val = $(this).val()
		if(val == "") return
		$.getJSON("test.cfc?method=getpersondetails&returnformat=json", {% raw %}{"id":val}{% endraw %}, function(res,code) {
			$("#name").val(res.name)
			$("#age").val(res.age)
			$("#codskill").val(res.codskill)
		})
	})

})
&lt;/script&gt;


&lt;form&gt;
&lt;select name="person" id="person"&gt;
	&lt;option value=""&gt;Select a Person&lt;/option&gt;
	&lt;option value="1"&gt;Raymond Camden&lt;/option&gt;
	&lt;option value="2"&gt;Scott Stroz&lt;/option&gt;
	&lt;option value="3"&gt;Todd Sharp&lt;/option&gt;
&lt;/select&gt;
&lt;p/&gt;
Name: &lt;input type="text" name="name" id="name"&gt;&lt;br/&gt;
Age: &lt;input type="text" name="age" id="age"&gt;&lt;br/&gt;
COD Skill: &lt;input type="text" name="codskill" id="codskill"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>
<p>
Working bottom to top - you can see the simple field with the person selector on top. Below it are the three fields I'll be loading. Now scroll on up to the JavaScript. We've bound an event handler to the person drop down that fires off whenever you change it. If you selected a person (and not just the top item), we do a getJSON request to our component. We get a structure of data back that we then just apply to our form fields. The ColdFusion code isn't important to this demo, but in case you are curious, here is the component:
<p>
<code>
component {

	remote struct function getpersondetails(numeric id) {
		var s = {};
		s["name"] = "Person " & arguments.id;
		s["age"] = arguments.id;
		s["codskill"] = arguments.id*2;
		return s;
	}
}
</code>

<p>

As you can see, I'm basically returning static data based on the ID requested. So this works - but Daniel pointed out that he had <b>50</b> form fields. How could you handle that? Well, obviously you can just use 50 .val statements like you see above. However, it may be nicer to do things automatically. If you don't mind tying your service to your view a bit, you can make assumptions that each key of the struct returned will match the ID of a form field. Then your code becomes a bit simpler:

<p>

<code>
$("#person").change(function () {
	var val = $(this).val()
	if(val == "") return
	$.getJSON("test.cfc?method=getpersondetails&returnformat=json", {% raw %}{"id":val}{% endraw %}, function(res,code) {
		for(var key in res) {
			$("#" + key).val(res[key])
		}
	})
})
</code>

<p>

<a href="http://www.raymondcamden.com/demos/may242010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo" border="0"></a>