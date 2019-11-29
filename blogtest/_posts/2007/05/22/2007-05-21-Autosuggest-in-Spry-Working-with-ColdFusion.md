---
layout: post
title: "Autosuggest in Spry - Working with ColdFusion"
date: "2007-05-22T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/22/Autosuggest-in-Spry-Working-with-ColdFusion
guid: 2055
---

A few days ago I <a href="http://ray.camdenfamily.com/index.cfm/2007/5/18/Autosuggest-in-Spry">blogged</a> about how to do autosuggest in Spry. In that example, the autosuggest data was based on an XML file loaded as a Spry dataset. While this worked, it was pretty static. What would be more useful is if we could integrate with a database. There are a few options we can pass to the Spry Autosuggest feature to enable this.
<!--more-->
Our last example created the widget with this line:

<code>
&lt;script type="text/javascript"&gt;
var theSuggest = new Spry.Widget.AutoSuggest("mySuggest","resultsDIV", "dsCharacters","name", {% raw %}{hoverSuggestClass:'highlight'}{% endraw %});
&lt;/script&gt;
</code>

The options (or in this case, option) at the end simply specified the CSS class to use when hovering over the list of suggested items. As I had mentioned, there are more options you can use. 

For my next demo, I'm going to add the following options:

<ul>
<li>minCharsType: As you can guess, this is the minimum number of characters you need to type before the autosuggest feature fires.
<li>containsString: Normally autosuggest will only match when the search string and the suggestion start with the same letters. If you set containsString to true, then the match can be anywhere. 
<li>loadFromServer: This is the important one for this demo. It tells Spry that for every attempt at an autosuggest, Spry should reload the dataset from the server. This is what will make our autosuggest more dynamic.
<li>urlParam: When Spry talks to the server, it will create a URL variable with this name.
</ul>

So lets focus on the last two as they are them most critical. The first thing I will do is switch my dataset from a simple XML file to a ColdFusion file.

<code>
&lt;script&gt;
var dsCharacters = new Spry.Data.XMLDataSet("data.cfm","authors/author");
&lt;/script&gt;
</code>

I then update my autosuggest widget code to contain the new options I listed above:

<code>
&lt;script type="text/javascript"&gt;
var theSuggest = new Spry.Widget.AutoSuggest("mySuggest","resultsDIV", "dsCharacters","NAME", 
{% raw %}{hoverSuggestClass:'highlight',minCharsType:3,loadFromServer:true,urlParam:'search',containsString:true}{% endraw %});
&lt;/script&gt;
</code>

Note that I used urlParam:'search'. Spry will add ?search=X to the URL, where X is the value in the text field. In case you are wondering - if my original URL already had a URL param in it, Spry is smart enough to add &search=X instead. (Nice!) 

So at this point - let me describe what happens. As you type in the box, when you get to 3 characters, Spry will fire off a HTTP request to get the data. When you change the text, Spry will fire off again. Pretty simple, eh? The ColdFusion behind this is nothing more than a simple SQL statement. For the demo, this is the code I used:

<code>
&lt;!---
Ensure we have both the value and at least 3 chars.
---&gt;
&lt;cfif not structKeyExists(url, "search") or len(trim(url.search)) lte 2&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfquery name="getauthors" datasource="camden_blog" maxrows="250"&gt;
select	distinct name
from	tblblogcomments
where	name like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#url.search#%{% endraw %}" maxlength="255"&gt;
&lt;/cfquery&gt;

&lt;cfif not structKeyExists(application, "toxml")&gt;
	&lt;cfset application.toxml = createObject("component", "toxml")&gt;
&lt;/cfif&gt;

&lt;cfset result = application.toxml.queryToXml(getauthors,"authors","author")&gt;
&lt;cfcontent type="text/xml"&gt;&lt;cfoutput&gt;#result#&lt;/cfoutput&gt;
</code>

Note that I check for the existence of the the URL param, and I ensure it is 3 characters long. Why do I bother? Didn't I tell Spry to not fire unless there are 3 characters? Don't forget that your AJAX files need to be secure just like any other file. Someone could easily dig into my code and start trying to hack around with data.cfm.

So to see this in action, go here:

<a href="http://ray.camdenfamily.com/sprysuggest/index2.html">http://ray.camdenfamily.com/sprysuggest/index2.html</a>

Search for 'cam' to get some results. Or just try anything. The data is based on the names of people who post comments here so there should be a very wide variety. View source on the page to see the complete HTML/JS.

And yes - it would work faster if I switched to JSON. (Although I'm not 100% sure if autosuggest works with JSON datasets. If it does not, it is a bug!)