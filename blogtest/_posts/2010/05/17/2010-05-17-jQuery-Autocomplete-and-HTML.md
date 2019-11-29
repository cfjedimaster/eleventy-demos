---
layout: post
title: "jQuery Autocomplete and HTML"
date: "2010-05-17T14:05:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/05/17/jQuery-Autocomplete-and-HTML
guid: 3818
---

I've blogged recently (see related entries below) on <a href="http://jqueryui.com/demos/autocomplete/">jQuery UI's Autocomplete</a> control. It's a cool control and has something inherit that I really wish ColdFusion's built in control had - the ability to return complex data back to the form. As an example, this lets us return a label and an ID value. You can store the ID in a hidden field and display a name to the user. Even better, you can also a label value. This means you can have both a unique display in the drop down of suggestions that is different from what actually gets shown in the text field. This label can include HTML, which means you can do all kinds of cool stuff. You could - for example, have an autocomplete that uses colors to convey information (perhaps highlighting results that other customers have selected). I whipped up a quick example that shows a cool example of this.
<p>
<!--more-->
For my new demo I created a search form for my blog comments. The idea would be that you can begin typing a name and see suggestions from the folks who have commented on my blog. The front end code for this is a very slightly modified version of the final example in <a href="http://www.raymondcamden.com/index.cfm/2010/4/12/Playing-with-jQuery-UIs-Autocomplete-Control">this blog post</a>. 

<p>

<code>
&lt;script src="jqueryui/js/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
&lt;script src="jqueryui/js/jquery-ui-1.8.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.custom.css" type="text/css" /&gt;

&lt;script type="text/javascript"&gt;
$(function() {
	$("#name").autocomplete({
		source: "blogservice.cfc?method=searchpeople&returnformat=json",
		select:function(event,ui) {
			$("#email").val(ui.item.email)
		}
	});
});
&lt;/script&gt;

&lt;form action="test4.cfm" method="post"&gt;	
name: &lt;input name="name" id="name" /&gt;
&lt;input name="email" id="email" type="hidden"&gt;
&lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;

&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#" label="Form"&gt;
&lt;/cfif&gt;
</code>

<p>

The only thing different here from the earlier blog entry is that I'm pointing to a new service now and I'm using email as the field I'll be storing behind the scenes. Again - if any of this is weird to you, please reread the <a href="http://www.coldfusionjedi.com/index.cfm/2010/4/12/Playing-with-jQuery-UIs-Autocomplete-Control">earlier</a> entry. Now let's look at the service.

<p>

<code>
component {

	remote function searchPeople(string term) {
		var q = new com.adobe.coldfusion.query();
		q.setDatasource("myblog");
		q.setSQL("select distinct name, email from tblblogcomments where name like :search limit 0,15");
		q.addParam(name="search",value="{% raw %}%#arguments.term#%{% endraw %}",cfsqltype="cf_sql_varchar");
		var query = q.execute().getResult();
		var result = [];
		for(var i=1; i&lt;=query.recordCount; i++) {
			result[arrayLen(result)+1] = {};
			result[arrayLen(result)]["email"] = query.email[i];
			var gimage = "http://www.gravatar.com/avatar/#lcase(hash(query.email[i]))#?s=20&r=pg";
			result[arrayLen(result)]["label"] = "&lt;img src='#gimage#' align='left'&gt;" & query.name[i];			
			result[arrayLen(result)]["value"] = query.name[i];			
		}
		return result;
	}

}
</code>

<p>

Again - this is pretty similar to the previous entry, but notice that I've added a new label field to my result. Because the label allows for generic HTML, I've prefixed the name value with the Gravatar for their email. I wasn't sure how well this would work, but wow, it worked like a charm.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-17 at 12.22.57 PM.png" title="HTML-ified auto suggest" />

<p>

<b>Edit: I modified the service code to always return my email address. I didn't mean to expose my commenter's email addresses like that. I apologize, and thank you to Todd Rafferty for pointing it out!</b>

<p>

<a href="http://www.coldfusionjedi.com/demos/autocompletedemo/test4.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo" border="0"></a>