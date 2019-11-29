---
layout: post
title: "Playing with jQuery UI's Autocomplete Control"
date: "2010-04-12T10:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/04/12/Playing-with-jQuery-UIs-Autocomplete-Control
guid: 3779
---

<img src="https://static.raymondcamden.com/images/cfjedi/jqueryui.png" style="margin-right:5px" title="jQuery UI" align="left" /> jQuery UI 1.8 has been out for a while now (see details on their <a href="http://blog.jqueryui.com/2010/03/jquery-ui-18/">blog</a>) but I've yet to really find the time to play around with it. This weekend I finally took a look at it, specifically the new autocomplete widget, and I thought I'd whip up a few quick examples showing the control being used with ColdFusion.
<br clear="left">
<!--more-->
<p>
To begin, I recommend taking a look at, and reading some of the docs, for the <a href="http://jqueryui.com/demos/autocomplete/">autocomplete</a> widget. I'm only going to demonstrate a few aspects of it and the docs will give you the whole story. As with most things jQueryUIish (not a word, I know), you use the widget by simply pointing the library at a DOM item and "enabling" it. So for example, once I've got my libraries loaded, I can turn an input control into an autosuggest with one line of code. Obviously I can, and probably will, use more code to get fine grained control over the widget, but it really is pretty simple to use.
<p>
Let's start with a super simple example. This one is taken directly from the docs. The only thing I'll point out is - and this bugs me about all the jQuery UI demos, I'm going to show you the <i>full</i> source behind the code. It really bugs me that their View Source content never shows the included JavaScript and CSS commands. Yes, it is implied, but I know I had a hard time with this when I first began to use jQuery UI. When it comes to docs, I think it's always safe to assume less. Ok, mini rant aside. Here is a simple example of a static autocomplete. jQuery UI's autocomplete widget allows for both static, inline auto suggests as well as Ajax loaded content. We'll be looking at an example of that later on.
<p>
<code>
&lt;script src="jqueryui/js/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
&lt;script src="jqueryui/js/jquery-ui-1.8.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.custom.css" type="text/css" /&gt;

&lt;script type="text/javascript"&gt;
$(function() {
	var availableTags = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl"];
	$("#tags").autocomplete({
		source: availableTags
	});
});
&lt;/script&gt;
	
&lt;input id="tags" /&gt;
</code>
<p>
As you can see, we begin with our includes. We grab the core jQuery library, the jQuery UI library, and the style sheet. For my demos, I've chosen the <a href="http://jqueryui.com/themeroller/#tr&ffDefault=Helvetica,+Arial,+sans-serif&fwDefault=normal&fsDefault=1.1&fsDefaultUnit=em&cornerRadius=5&cornerRadiusUnit=px&bgColorHeader=888888&bgTextureHeader=04_highlight_hard.png&bgImgOpacityHeader=15&borderColorHeader=404040&fcHeader=ffffff&iconColorHeader=cccccc&bgColorContent=121212&bgTextureContent=12_gloss_wave.png&bgImgOpacityContent=16&borderColorContent=404040&fcContent=eeeeee&iconColorContent=bbbbbb&bgColorDefault=adadad&bgTextureDefault=03_highlight_soft.png&bgImgOpacityDefault=35&borderColorDefault=cccccc&fcDefault=333333&iconColorDefault=666666&bgColorHover=dddddd&bgTextureHover=03_highlight_soft.png&bgImgOpacityHover=60&borderColorHover=dddddd&fcHover=000000&iconColorHover=c98000&bgColorActive=121212&bgTextureActive=05_inset_soft.png&bgImgOpacityActive=15&borderColorActive=000000&fcActive=ffffff&iconColorActive=f29a00&bgColorHighlight=555555&bgTextureHighlight=04_highlight_hard.png&bgImgOpacityHighlight=55&borderColorHighlight=404040&fcHighlight=cccccc&iconColorHighlight=aaaaaa&bgColorError=fef1ec&bgTextureError=02_glass.png&bgImgOpacityError=95&borderColorError=cd0a0a&fcError=cd0a0a&iconColorError=cd0a0a">Vader</a> theme for obvious reasons. 
<p>
My JavaScript consists of only two real parts. I've got a hard coded list of values in an array. Next, I "enable" the autocomplete on a input control (identified by the ID tags) and tell it to source by my array. And that's it. I <i>really</i> love how easy jQuery UI makes things sometimes. You can test this online <ah ref="http://www.raymondcamden.com/demos/autocompletedemo/test1.html">here</a>.
<p>
Now let's make this a tiny bit dynamic. In my first ColdFusion version, I'll switch my categories to a ColdFusion variable. (And yes, this is still a static variable, but you can easily imagine it being sourced by the database.)
<p>
<code>

&lt;cfset cats = "Adobe,Adoption,AIR,Books,ColdFusion,Flash,Flex,Groovy,Hardware,JavaScript,jQuery,Lost,MAX,Movies,Music,ORM,Politics,Television"&gt;

&lt;script src="jqueryui/js/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
&lt;script src="jqueryui/js/jquery-ui-1.8.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.custom.css" type="text/css" /&gt;

&lt;script type="text/javascript"&gt;
$(function() {
	&lt;cfoutput&gt;
	var #toScript(listToArray(cats),"availableCats")#;
	&lt;/cfoutput&gt;
	$("#category").autocomplete({
		source: availableCats
	});
});
&lt;/script&gt;
	
category: &lt;input id="category" /&gt;
</code>
<p>
The first difference here is the cats variable. Again, this would normally come from the database but for now it's just a hard coded set of strings. Going down a bit, take a look at how I translate it to JavaScript. I make use of toScript, a ColdFusion function that translates variables into their relevant JavaScript versions. I first turn the list into an array however. After that, everything else is pretty much the same. You can take a look at this <a href="http://www.coldfusionjedi.com/demos/autocompletedemo/test1.cfm">here</a>. (And while there, do a View Source to see how the toScript generated my JavaScript.)
<p>
Ok, so while hard coded (or static) variables work, and are ok for small lists, most of the time you will want to load in the data via an Ajax call. The autosuggest widget makes that darn easy. If the value of the source attribute is a string, then jQuery treats it like a URL. In this example, I've pointed my source to a CFC:
<p>
<code>


&lt;script src="jqueryui/js/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
&lt;script src="jqueryui/js/jquery-ui-1.8.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.custom.css" type="text/css" /&gt;

&lt;script type="text/javascript"&gt;
$(function() {
	$("#category").autocomplete({
		source: "service.cfc?method=searchcategories&returnformat=json"
	});
});
&lt;/script&gt;
	
category: &lt;input id="category" /&gt;
</code>
<p>
Notice that I pass in my method and returnformat. You need to remember that CFCs, by default, return WDDX. Luckily it is easy to get around that (in ColdFusion 8 and higher). The docs did not make it clear, but the name of the argument sent to your server is <b>term</b>. Here is the simple CFC I used.
<p>
<code>
component {

	remote function searchCategories(string term) {
		var q = new com.adobe.coldfusion.query();
		q.setDatasource("cfartgallery");
		q.setSQL("select mediatype from media where mediatype like :search");
		q.addParam(name="search",value="{% raw %}%#arguments.term#%{% endraw %}",cfsqltype="cf_sql_varchar");
		var result = q.execute().getResult();
		return listToArray(valueList(result.mediatype));
	}

}
</code>
<p>
As you can see, this is nothing more than a simple query. Notice my search string is dynamic on <i>both</i> sides of the term value. This allows me to handle partial matches, so a search for Cold would match both ColdFusion and Ice Cold Baby. If you want to match only results that begin with a term, you simply change how your server side logic works. You can demo this <a href="http://www.coldfusionjedi.com/demos/autocompletedemo/test2.cfm">here</a>. The search is against the media table of the cfartgallery demo, so try terms like "Pa" to see a few results. 
<p>
Ok, so the final demo is pretty cool I think. One of the issues most autocomplete widgets suffer from is that while humans like to work with strings (like "Beer"), the database prefers unique identifiers (like 13). So given that you may return a string, again, "Beer", when you post your form to the server, how do you handle knowing that the value "Beer" referred to row 13 in your database? Typically you need to do another database query. Not a big huge deal, but wouldn't it be nice if your autocomplete could work with both strings <i>and</i> numbers? jQuery UI's autocomplete does this and does it well! Let's begin by modifying our CFC.
<p>
<code>
component {

	remote function searchCategories(string term) {
		var q = new com.adobe.coldfusion.query();
		q.setDatasource("cfartgallery");
		q.setSQL("select mediaid as id, mediatype as value from media where mediatype like :search");
		q.addParam(name="search",value="{% raw %}%#arguments.term#%{% endraw %}",cfsqltype="cf_sql_varchar");
		var query = q.execute().getResult();
		var result = [];
		for(var i=1; i&lt;=query.recordCount; i++) {
			result[arrayLen(result)+1] = {};
			result[arrayLen(result)]["id"] = query.id[i];
			result[arrayLen(result)]["value"] = query.value[i];			
		}
		return result;
	}

}
</code>
<p>
In this example I've changed from returning an array of strings to returning an array of structs. Notice that I've got an ID and VALUE key being returned. (*) These values will be recognized by the widget, specifically the value attribute. By itself this won't solve our problem, but we can use the "select" option to handle the user selection event:
<p>
<code>
select:function(event,ui) {
	$("#catid").val(ui.item.id)
}
</code>
<p>
This code says - when the user selects an item, grab the ID value and set it to the catid DOM  item's value. Let's look at the complete page so it makes more sense.
<p>

<code>
&lt;script src="jqueryui/js/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
&lt;script src="jqueryui/js/jquery-ui-1.8.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.custom.css" type="text/css" /&gt;

&lt;script type="text/javascript"&gt;
$(function() {
	$("#category").autocomplete({
		source: "service2.cfc?method=searchcategories&returnformat=json",
		select:function(event,ui) {
			$("#catid").val(ui.item.id)
		}
	});
});
&lt;/script&gt;

&lt;form action="test3.cfm" method="post"&gt;	
category: &lt;input name="category" id="category" /&gt;
&lt;input name="catid" id="catid" type="hidden"&gt;
&lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;

&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#" label="Form"&gt;
&lt;/cfif&gt;
</code>
<p>
As you can see, I've added the select handler to my widget constructor. I've also added the hidden form field catid. Finally I added a real submit button and a cfdump so I can see the result. Now when I select a media type, the user will see the nice string, and the hidden form field gets the proper primary key. You can see this for yourself <a href="http://www.coldfusionjedi.com/demos/autocompletedemo/test3.cfm">here</a>. All in all I think it works really nicely.
<p>
Again - please note there is more to this control then what I've shown here. Check the <a href="http://jqueryui.com/demos/autocomplete/">docs</a> and have fun with it! (And if you are using it in production, please feel free to share the URL here.)
<p>
* Did you notice I used struct notation ["id"] instead of dot notation? Dot notation creates JSON with upper case keys. jQuery UI won't pick up on that automatically. By using bracket notation I ensure my JSON maintains the same case.