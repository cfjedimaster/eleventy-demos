---
layout: post
title: "Quick example of jQuery Templates"
date: "2010-07-09T14:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/07/09/Quick-example-of-jQuery-Templates
guid: 3873
---

Earlier today Rey Bango posted an excellent article about jQuery Templates (<a href="http://blog.reybango.com/2010/07/09/not-using-jquery-javascript-templates-youre-really-missing-out/">Not Using jQuery JavaScript Templates? You're Really Missing Out.</a>) This was something I had meant to look at before but just never got around to it. If you haven't looked at this feature, please stop reading and catch up on <a href="Not Using jQuery JavaScript Templates? You're Really Missing Out.">Rey's post</a>. After reading it, I thought it would be cool to employ the technique to update the demo I posted earlier today (<a href="http://www.raymondcamden.com/index.cfm/2010/7/9/Another-simple-jQueryColdFusion-example">Another simple jQuery/ColdFusion example</a>). It took me a grand total of five minutes. Here is the original code used to render categories:
<!--more-->
<p>
<code>
$.getJSON("data.cfc?method=getcategories&returnformat=json&queryformat=column", {}, function(res,code) {
	//create a string for our result
	var s = ""
	for(var i=0; i&lt;res.DATA.ID.length; i++) {
		s += "&lt;a href='' class='navLink' id='nav_" + res.DATA.ID[i]+ "'&gt;"+res.DATA.NAME[i]+"&lt;/a&gt;&lt;br/&gt;"
	}

	//"draw" s onto the screen
	$("#nav").html(s)
})
</code>

<p>

Compare that with the template version:

<p>

<code>
&lt;script id="categoryTemplate" type="text/html"&gt;
&lt;a href="" class="navLink" id="nav_${% raw %}{ID}{% endraw %}"&gt;${% raw %}{NAME}{% endraw %}&lt;/a&gt;&lt;br/&gt;
&lt;/script&gt;
(more stuff here cut out...)
//Call the CFC to get queries
$.getJSON("data.cfc?method=getcategories&returnformat=json&queryformat=column", {}, function(res,code) {
	var newData = []
	for(var i=0; i&lt;res.DATA.ID.length; i++) {
		newData[newData.length] = {% raw %}{ "ID":res.DATA.ID[i], "NAME":res.DATA.NAME[i]}{% endraw %}
	}
	$("#categoryTemplate").tmpl(newData).appendTo("#nav")
})
</code>

<p>

As you see - I had to reform the data returned by ColdFusion to make it work with the template engine. I could do this at the CFC, but I like my CFC being abstract and not tied to any implementation. So I didn't trim many lines of code here (I may have actually went up by one or two), but the <i>way</i> it works is much cleaner now. I'm reminded of Adobe Spry, which to me has always shined in the area of actually <i>displaying</i> Ajax content. 

<p>

Next up I rewrote the detail portion:

<p>

<code>
&lt;script id="detailTemplate" type="text/html"&gt;
&lt;h2&gt;${% raw %}{NAME}{% endraw %}&lt;/h2&gt;
This person is ${% raw %}{AGE}{% endraw %} years old.
&lt;/script&gt;
(more stuff here....)

//listen for clicks on navLink
$(".navLink").live("click", function(e) {
	var clickedId = $(this).attr("id")
	var id = clickedId.split("_")[1]
		
	//load the detail
	$.getJSON("data.cfc?method=getdetail&returnformat=json", {% raw %}{"id":id}{% endraw %}, function(res,code) {
		$("#content").html($("#detailTemplate").tmpl(res))
	})
		
	e.preventDefault()
})
</code>

<p>

This modification was even simpler. My simple CFML struct worked just fine for the template engine. All in all a very painless modification, but I <b>really</b> dig it. You can find out more about the Template plugin here: <a href="http://github.com/nje/jquery-tmpl">http://github.com/nje/jquery-tmpl</a>

<p>

Here is the entire page for the new version:

<p>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery.tmpl.js"&gt;&lt;/script&gt;

&lt;script id="categoryTemplate" type="text/html"&gt;
&lt;a href="" class="navLink" id="nav_${% raw %}{ID}{% endraw %}"&gt;${% raw %}{NAME}{% endraw %}&lt;/a&gt;&lt;br/&gt;
&lt;/script&gt;

&lt;script id="detailTemplate" type="text/html"&gt;
&lt;h2&gt;${% raw %}{NAME}{% endraw %}&lt;/h2&gt;
This person is ${% raw %}{AGE}{% endraw %} years old.
&lt;/script&gt;

&lt;script&gt;
$(document).ready(function() {

	//Call the CFC to get queries
	$.getJSON("data.cfc?method=getcategories&returnformat=json&queryformat=column", {}, function(res,code) {
		var newData = []
		for(var i=0; i&lt;res.DATA.ID.length; i++) {
			newData[newData.length] = {% raw %}{ "ID":res.DATA.ID[i], "NAME":res.DATA.NAME[i]}{% endraw %}
		}
		$("#categoryTemplate").tmpl(newData).appendTo("#nav")
	})
	
	//listen for clicks on navLink
	$(".navLink").live("click", function(e) {
		var clickedId = $(this).attr("id")
		var id = clickedId.split("_")[1]
		
		//load the detail
		$.getJSON("data.cfc?method=getdetail&returnformat=json", {% raw %}{"id":id}{% endraw %}, function(res,code) {
			$("#content").html($("#detailTemplate").tmpl(res))
		})
		
		e.preventDefault()
	})
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="nav"&gt;&lt;/div&gt;

&lt;div id="content"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>