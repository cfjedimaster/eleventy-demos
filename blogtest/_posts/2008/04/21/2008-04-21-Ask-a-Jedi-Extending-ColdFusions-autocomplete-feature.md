---
layout: post
title: "Ask a Jedi: Extending ColdFusion's auto-complete feature"
date: "2008-04-21T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/21/Ask-a-Jedi-Extending-ColdFusions-autocomplete-feature
guid: 2780
---

David asks what I think is a pretty interesting question concerning ColdFusion, Ajax, and auto-complete style functionality.

<blockquote>
<p>
I know you have covered the CF8 autocomplete tag, but I am looking to take it one step further, but haven't been able to find any good direction.

I have been building an application for our amateur radio emergency services group that allows us to track our weather spotters while they are in the field.  Logging ham operators to the net requires collecting the same information from many time the same people over and over.

I would like to use a form that when the first field is enter (the callsign of the operator) it does a trip to the database and if the ham has checked into a net before, bring back his information and auto complete the remaining form fields.

Example, the first field is Call Sign, I would enter mine, N9CTO and the next three fields would become populated.  Those fields would be First Name, Trained Spotter, and my car information to be verified.

I know this is a very specific example, but with CF8, Autocomplete, AJAX I figure this can problem be completed.  If I knew Javascript more, I could probably do that
as well, just curious to know if the autocomplete can be extended to not only suggest in the first field, but drive answers in the remaining fields. Obviously, if the first field doesn't match in the database, we would enter the
details then in the future, our weather spotter would be in the database.
</p>
</blockquote>
<!--more-->
So this was a pretty interesting question. I decided to start it simply first. Instead of worrying about the auto-complete, how can we use ColdFusion 8 and AJAX to simply say, if I do callsign foo, prepopulate these values?

Let's start with our form:

<code>
&lt;form&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;Call Sign:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="callsign" id="callsign"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;First Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="firstname" id="firstname"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Trained Spotted:&lt;/td&gt;
		&lt;td&gt;&lt;input type="checkbox" name="trainedspotter" id="trainedspotter"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Car License Plate:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="licenseplate" id="licenseplate"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;	
</code>

We have four form fields. Our call sign is first, then we have three related fields. The first thing we want to do is notice a change to our callsign field. This is easily achieved with cfajaxproxy:

<code>
&lt;cfajaxproxy bind="javaScript:loadit({% raw %}{callsign}{% endraw %})"&gt;
</code>

This says - when callsign changes, run a JavaScript function called loatit. We want to talk to the back end - and while we have multiple ways of doing it, I'm just going to use <i>another</i> cfajaxproxy. As I've said before, cfajaxproxy really has two very disparate styles. One acts like a binding (as you see above) and another creates a connection between your JavaScript code and a CFC. Like so:

<code>
&lt;cfajaxproxy cfc="radiopeople" jsclassname="radiopeopleservice"&gt;
</code>

So now that we have a connection, let's look at the JavaScript:

<code>
&lt;script&gt;
var radioPeopleService = new radiopeopleservice();

function loadit(cs) {
	var data = radioPeopleService.getProfile(cs);
	if(data.FIRSTNAME != null) document.getElementById('firstname').value = data.FIRSTNAME;
	if(data.TRAINEDSPOTTER != null) if(data.TRAINEDSPOTTER) document.getElementById('trainedspotter').checked = true;
	if(data.LICENSEPLATE != null) document.getElementById('licenseplate').value = data.LICENSEPLATE;
	console.dir(data);
}
&lt;/script&gt;
</code>

We begin by creating an instance of our proxy. Once we have this proxy, we can run any method on the CFC that has access=remote. Even without looking at the CFC yet you can guess what is going on here. We have a CFC method, getProfile, that will look up a call sign and return a structure of data. The rest of the code is simply JavaScript. 

Now take a look at the CFC method:

<code>
&lt;cffunction name="getProfile" output="false" returnType="struct" hint="I return information based on a call sign" access="remote"&gt;
	&lt;cfargument name="callsign" type="string" required="false" default=""&gt;
	&lt;cfset var result = {}&gt;
	
	&lt;cfswitch expression="#arguments.callsign#"&gt;
		&lt;cfcase value="iceman"&gt;
			&lt;cfset result = {% raw %}{firstname="Raymond",trainedspotter=false,licenseplate="XXX11"}{% endraw %}&gt;
		&lt;/cfcase&gt;
		&lt;cfcase value="maverick"&gt;
			&lt;cfset result = {% raw %}{firstname="Tom",trainedspotter=true,licenseplate="AAA11"}{% endraw %}&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="goose"&gt;
			&lt;cfset result = {% raw %}{firstname="Fred",trainedspotter=false,licenseplate="GGG11"}{% endraw %}&gt;
		&lt;/cfcase&gt;

	&lt;/cfswitch&gt;

	&lt;cfreturn result&gt;	
&lt;/cffunction&gt;
</code>

As you can see, the code recognized 3 call signs: iceman, maverick, and goose. For each it returns a structure of data. So that's it. If you run the form, enter iceman, you will see the form populate. If you change to goose, you will see other values. You can see an online demo of this <a href="http://www.raymondcamden.com/demos/topgundemo/test4.cfm">here</a>.

Ok, so that's halfway there. David had asked about using autocomplete as well. Luckily I don't have to do much more. First off - I just changed my form to a cfform. Then I changed my first form field to be an autosuggest field. Here is the new, complete, form:

<code>
&lt;cfform&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;Call Sign:&lt;/td&gt;
		&lt;td&gt;&lt;cfinput type="text" name="callsign" id="callsign" autosuggest="cfc:radiopeople.getCallSigns({% raw %}{cfautosuggestvalue}{% endraw %})"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;First Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="firstname" id="firstname"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Trained Spotted:&lt;/td&gt;
		&lt;td&gt;&lt;input type="checkbox" name="trainedspotter" id="trainedspotter"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Car License Plate:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="licenseplate" id="licenseplate"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/cfform&gt;
</code>

As you can see, the autosuggest calls the same CFC we used before, now using a method named getCallSigns. This method looks like so:

<code>
&lt;cffunction name="getCallSigns" output="false" returnType="string" hint="I suggest call signs" access="remote"&gt;
	&lt;cfargument name="callsign" type="string" required="false" default=""&gt;
	&lt;!--- create a fake query ---&gt;
	&lt;cfset var q = queryNew("callsign")&gt;
	&lt;cfset var r = ""&gt;
	
	&lt;cfset queryAddRow(q)&gt;
	&lt;cfset querySetCell(q, "callsign", "iceman")&gt;
	&lt;cfset queryAddRow(q)&gt;
	&lt;cfset querySetCell(q, "callsign", "maverick")&gt;
	&lt;cfset queryAddRow(q)&gt;
	&lt;cfset querySetCell(q, "callsign", "goose")&gt;
	
	&lt;cfquery name="r" dbtype="query"&gt;
	select	callsign
	from	q
	where	upper(callsign) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#ucase(arguments.callsign)#%"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfreturn valueList(r.callsign)&gt;
	
&lt;/cffunction&gt;
</code>

Obviously I'd use a real query for this method (and the other one), but you can see that basically I'm creating a query and filtering the results based on the text typed into the autosuggest. You can see an example of this <a href="http://www.coldfusionjedi.com/demos/topgundemo/test3.cfm">here</a>.