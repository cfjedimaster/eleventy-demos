---
layout: post
title: "Working with a ColdFusion Query in jQuery"
date: "2010-11-09T08:11:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/11/09/Working-with-a-ColdFusion-Query-in-jQuery
guid: 4008
---

This morning one of the ColdFusion support forums I subscribe to asked about how one could work with a ColdFusion query sent over Ajax to jQuery. I whipped up a quick example of one way (remember - like ColdFusion - there are many ways to do things in jQuery) you could do it. To start off, I'll show the CFC I'll be using to feed data to the Ajax-based front end. Notice how nothing in it is Ajax-specific. Outside of the fact that it has remote access, this is just a vanilla script-based CFC.
<!--more-->
<p>

<code>
component {

	remote query function getArt(string search="") {
	
		var q = new com.adobe.coldfusion.query();
	    q.setDatasource("cfartgallery");
	    q.setSQL("select artid, artname, price, description from art where description like :search or artname like :search");
	    q.addParam(name="search",value="{% raw %}%#arguments.search#%{% endraw %}",cfsqltype="cf_sql_varchar");
	    return q.execute().getResult();
		    
	}

}
</code>

<p>

The component has one method, getArt. It allows for an optional search search. When run we query against the art table that ships with the ColdFusion samples and returns the id, name, price, and description of each piece of art. Now let's look at the front end.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

	$("#searchbtn").click(function(e) {
		var search = $.trim($("#search").val());
		
		$.post("test.cfc?method=getArt&returnFormat=json&queryFormat=column", {% raw %}{"search":search}{% endraw %}, function(res,code) {
			if(res.ROWCOUNT &gt; 0) {
				var s = "&lt;table border='1'&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;/tr&gt;";
				for(var i=0; i&lt;res.ROWCOUNT; i++) {
					s += "&lt;tr&gt;&lt;td&gt;" + res.DATA.ARTNAME[i] + "&lt;/td&gt;";
					s += "&lt;td&gt;" + res.DATA.PRICE[i] + "&lt;/td&gt;";
					s += "&lt;td&gt;" + res.DATA.DESCRIPTION[i] + "&lt;/td&gt;";
					s += "&lt;/tr&gt;";
				}
				s += "&lt;/table&gt;";
			} else {
				var s = "Sorry, nothing matched your search.";
			}
			$("#results").html(s);
				
		},"json");
		
		e.preventDefault();
	});
});

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
&lt;input type="text" id="search"&gt; &lt;input type="submit" id="searchbtn" value="Search"&gt;
&lt;/form&gt;
&lt;div id="results"&gt;&lt;/div&gt;

&lt;/body&gt;

&lt;/html&gt;
</code>

<p>

Before we go up to the JavaScript, let's take a quick look at the layout on the bottom. I've got a search text field, a button, and a blank div. Obviously the text field is where you will enter search terms. The button will fire off the event. And lastly, the blank div will be used to draw out the results.

<p>

Now let's go back to the code. The first thing we do is grab (and trim) the search text. We want to allow you to get data even if you don't enter anything so we don't leave the method if the value is empty. Next we do the actual POST operation. I could have used a GET here since the amount of text you end up sending will be small, but POST just seems safer to me. 

<p>

Now - I want to point out something interesting about the URL. First - we use returnFormat=json to tell ColdFusion to automatically convert the result into JSON. The second argument is a bit different. When ColdFusion serializes queries it can do so in two ways. The queryformat attribute let's us pick one. The default value is row. When you row, the result looks like this:

<p>

<img src="https://static.raymondcamden.com/images/screenrow.png" />

<p>

Notice that the result contains a COLUMNS array and a DATA array. The DATA array is setup so that the Nth item in the array relates to the Nth COLUMNS value. So to get the ARTNAME for example, you have to know that ARTNAME is array item 1. Totally workable - you can translate the COLUMNS array into a structure. But I thought it might be easier if we switched to the column format. Check out how that looks:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screencol.png" />

<p>

This structure is a a bit simpler. Now our DATA value is a struct where each key is a column that is an array of values. Notice how in the JavaScript I can simply loop from 1 to the included ROWCOUNT value. 

<p>

If you want to see this in action, hit the big Demo button below. As always, I recommend using a tool like Firebug, Charles, or Chrome's Dev Tools, so you can see the data flowing in the background.

<p>

<a href="http://www.coldfusionjedi.com/demos/nov92010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>