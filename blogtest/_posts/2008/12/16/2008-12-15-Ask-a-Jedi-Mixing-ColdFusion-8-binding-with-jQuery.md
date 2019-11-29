---
layout: post
title: "Ask a Jedi: Mixing ColdFusion 8 binding with jQuery"
date: "2008-12-16T09:12:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2008/12/16/Ask-a-Jedi-Mixing-ColdFusion-8-binding-with-jQuery
guid: 3150
---

Josh asks:

<blockquote>
<p>
I have been trying to do this for a little while and haven't found any good answers online. Is there any way that you know of to use jQuery to prepend an option to the top of a cfselect that has a bind=some cfc?
</p>
</blockquote>

I haven't done a lot of mixing of ColdFusion 8 and jQuery, but let's see what we can do with this. First, let's start with the code he tried to use:
<!--more-->
<code>
var Options = {
        "" : "View All"
        
    }
    
    $("#views").change(
        function(){
            $(this).addOption(Options,true)
        })</code>

</code>

This looked simple enough, but when I tried to turn it into a full demo, the first thing I ran into was an error. Turns out that 'addOption' isn't core jQuery, but rather a plugin. As a gentle nudge to my readers, or to anyone blogging about jQuery, it may be a good idea to mention when a code sample uses a plugin. In this case, he was using this plugin: <a href="http://www.texotela.co.uk/code/jquery/select/">::TexoTela:: jQuery - Select box manipulation</a>. As you can guess, it adds a few new utility methods to drop downs, including the ability to easily add an option. I was then able to generate a complete demo to replicate his issue:

test2.cfm, my main client side file:<br/>
<code>
&lt;script src="jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="jquery/jquery.selectboxes.js"&gt;&lt;/script&gt;
&lt;script&gt;
var Options = {
"" : "View All"
}
$(document).ready(function() {
	$("#views").change(function(){% raw %}{$(this).addOption(Options,true);}{% endraw %});					  
}
);
&lt;/script&gt;


&lt;cfform name="foo"&gt;
&lt;cfselect bind="url:test.cfm" id="views" name="views" bindOnLoad="true" display="state" value="id"&gt;
&lt;/cfselect&gt;
&lt;/cfform&gt;
</code>

Note the use of binding in the select to test.cfm. Above this is his JavaScript code, bound to the change function. test.cfm isn't too important, but here is the code so you get on the same page:

<code>
&lt;cfset q = queryNew("id,state")&gt;
&lt;cfset queryAddRow(q, 2)&gt;
&lt;cfset q["id"][1] = 1&gt;
&lt;cfset q["state"][1] = "Louisiana"&gt;
&lt;cfset q["id"][2] = 2&gt;
&lt;cfset q["state"][2] = "Virginia"&gt;

&lt;cfset d = serializeJSON(q)&gt;
&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#d#&lt;/cfoutput&gt;
</code>

Ok, so what happens when you run this demo? Since his code is bound to the change event, on initial load you see the two states, but if you switch from Louisiana to Virginia, the third option is added. What he really wanted was "When CF8 is done doing it's Ajax crap, run my stuff." Unfortunately, as far as I know, this is not possible. I don't think there is a DOM event for 'something was added to a drop down', and even if there was, we wouldn't want to run on every addition, but only after the <i>last</i> addition. 

I tried the ColdFusion 8 ajaxOnLoad function, but this runs immediately after the page loads and before the Ajax call is made. 

I went with the assumption that you <i>really</i> wanted to use the bind attribute, and with that, the only way I could see getting this to work was to switch to a bind to a javaScript function. This is what I came up with, and it's not too pretty:

<code>
&lt;script src="jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="jquery/jquery.selectboxes.js"&gt;&lt;/script&gt;
&lt;script&gt;
var d = "";
function getData() {
	var result = new Array();
	$.ajaxSetup({% raw %}{async:false}{% endraw %});
	
	$.getJSON('test.cfm',{}, function(d) {
		for(var i=0; i &lt; d.DATA.length; i++) {
			var id = d.DATA[i][0];
			var label = d.DATA[i][1];
			item = new Array();
			item[0] = id;
			item[1] = label;
			result[result.length] = item;
		}
	} );
	//hard coded option 
	var newitem = new Array();
	newitem[0]  = "";
	newitem[1] = "View All";
	result[result.length] = newitem;
	
	return result;	
}
&lt;/script&gt;


&lt;cfform name="foo"&gt;
&lt;cfselect bind="javascript:getData()" id="views" name="views" bindOnLoad="true" display="state" value="id"&gt;
&lt;/cfselect&gt;
&lt;/cfform&gt;
</code>

The bind now runs getData. The problem we have here though is that we <b>must</b> return data from this function. To do this, I had to tell jQuery to use synchronous Ajax calls. This is the ajaxSetup call. (As far as I know, this is the only way to do asynchronous calls with the next line.) Next we run getJSON and call our existing script. ColdFusion returns the data within a DATA key, which is a 2D array of items where element 0 is the ID and element 1 is the name. Finally, I added a hard coded option to the end. I could have added this to the front of the array as well.

I don't know about you, but that is a heck of a lot of code. I went ahead and made another demo. This time the assumption was - continue to use test.cfm for our data provider, but get rid of the bind requirement. Ie, do it all jQuery based. Please keep in mind I'm a jQuery newbie, but I think this is a bit nicer:

<code>
&lt;script src="jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="jquery/jquery.selectboxes.js"&gt;&lt;/script&gt;
&lt;script&gt;
var Options = {
	"" : "View All"        
}

$(document).ready(function() {
		$.getJSON('test.cfm', {}, function(d) {
			for(var i=0; i&lt;d.DATA.length; i++) {
				$("#views").addOption(d.DATA[i][0], d.DATA[i][1]);
			}
		});
		//hard coded option
		$("#views").addOption(Options, true);
	}
)

&lt;/script&gt;

&lt;form name="foo"&gt;
&lt;select id="views"&gt;&lt;/select&gt;
&lt;/form&gt;
</code>

I've switched from cfform to a simple form and now make use of the select plugin to add each option as I loop over my JSON data. It is also now completely asynchronous which makes me all warm and fuzzy inside.