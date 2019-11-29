---
layout: post
title: "Ask a Jedi: ColdFusion Ajax example of retrieving fields of data"
date: "2009-10-18T12:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/10/18/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data
guid: 3565
---

I have to apologize for the title of this blog entry. I can't honestly think of a nicer way to say it. But enough of that, let me just get to the question.

<blockquote>
I have searched all over the web and read countless articles and documentation, tried different examples but i just cant seem to figure out what i first thought was a relatively simple request and solution, maybe it is but i cant seem to figure it out, anyway enough of my waffling here's the scenario:
<br/><br/>
What i have is a very straight forward form with say 5 different text inputs.
What i would like to do is on the first input box, which say is an invoice number, is for the user to enter the invoice number and then hit a button next to the input box and with the power of Coldfusion's built in AJAX stuff go to a cfc which has a query in it which searches for the invoice number, if one is found return the invoice number plus its details back to the form via AJAX, so all of the 5 text boxes would have returned data in them and the form isnt refreshed.
</blockquote>

As with most things in ColdFusion, there are a couple ways of doing this. Let's start with one example and then I'll show a way to simplify it. First though, we need a simple form. I'll use the cfartgallery sample database for my example.

```markup
<cfform>
id: <cfinput type="text" name="artid" id="artid"><br/> 
name: <cfinput type="text" name="artname" id="artname"><br/> 
description: <cftextarea name="description" id="description"></cftextarea><br/> 
price: <cfinput type="text" name="price" id="price"><br/> 
</cfform> 
```

I've got a form with 4 inputs. The first one is our primary ID field. When the user enters data there, we then want to load the 3 other fields with the corresponding data. One way to do that would be with binding. 

```markup
<cfform> 
id: <cfinput type="text" name="artid" id="artid"><br/> 
name: <cfinput type="text" name="artname" id="artname" bind="cfc:test.getName({artid@keyup})" readonly="true"><br/>
description: <cftextarea name="description" id="description" bind="cfc:test.getDescription({artid@keyup})" readonly="true"></cftextarea><br/> 
price: <cfinput type="text" name="price" id="price" bind="cfc:test.getPrice({artid@keyup})" readonly="true"><br/> 
</cfform> 
```

I've modified the 3 form fields now so that each of them is bound to the ID field. (I also added a readonly flag just to make it clear to the user that these fields are bound to the back end data.) For each field we run a differnent method: getName, getDescription, and getPrice. These are all bound to one CFC:

```markup
<cfcomponent>

<cffunction name=”getData” access=”remote”> <cfargument name=”artid” required=”true”> <cfset var q = ““>

<cfquery name="q" datasource="cfartgallery">
select	*
from	art
where	artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.artid#"&gt;
</cfquery>

<cfreturn q>
</cffunction>

<cfcomponent>

<cffunction name=”getDescription” access=”remote”> 
	<cfargument name=”id” type=”any”> 
	<cfif not isNumeric(arguments.id) or arguments.id lte 0> 
		<cfreturn ““> 
	</cfif> 
	<cfreturn getData(arguments.id).description> 
</cffunction>

<cffunction name=”getName” access=”remote”>
<cfargument name=”id” type=”any”> 
	<cfif not isNumeric(arguments.id) or arguments.id lte 0> 
	<cfreturn ““> 
	</cfif> 
	<cfreturn getData(arguments.id).artname> 
</cffunction>

<cffunction name=”getPrice” access=”remote” returntype=”string”>
<cfargument name=”id” type=”any”> 
	<cfif not isNumeric(arguments.id) or arguments.id lte 0> 
	<cfreturn ““> 
	</cfif> 
	<cfreturn getData(arguments.id).price> 
</cffunction>

</cfcomponent>
```

As you can see, the 3 methods all make use of a central getData() method. That method runs the query and then the individual queries all just return one field. (<b>ColdFusion 9 users - please read my PS at the end.</b>) This works, but as you can guess, each time we type into the ID field we perform 3 Ajax requests. This isn't horrible - and the data being returned is rather small, but multiple network requests for the same row of data could probably be done better. Let's look at a modified version.

```markup
<cfajaxproxy bind="cfc:test.getData({artid@keyup})" onsuccess="showData">

<script>
function showData(d) { 
	//convert into a struct 
	var data = {} 
	for(var i=0; i < d.COLUMNS.length; i++) { 
		data[d.COLUMNS[i]] = d.DATA[0][i] 
		} 
	document.getElementById(‘artname’).value = data[“ARTNAME”] 
	document.getElementById(‘description’).value = data[“DESCRIPTION”] 
	document.getElementById(‘price’).value = data[“PRICE”]

} 
</script>

<cfform>
id: <cfinput type=”text” name=”artid” id=”artid”><br/> 
name: <cfinput type=”text” name=”artname” id=”artname” readonly=”true”><br/> 
description: <cftextarea name=”description” id=”description” readonly=”true”></cftextarea><br/> 
price: <cfinput type=”text” name=”price” id=”price” readonly=”true”><br/> 
</cfform>
```

This code removes all the bindings from the fields. Instead we use cfajaxproxy to create a binding between the ID field, a CFC, and a JavaScript function. Whenever the ID field is changed, we run the getData method from the CFC and pass the results to our JavaScript function. Then the function just has to parse the result and set the form fields. Much easier, right? Now we have one Ajax request that fetches all the data. Technically we are passing back the same amount of data, but with only network request we will be less prone to suffer from congestion over the intertubes. 

Oh, and because I couldn't help myself, I whipped up a quick jQuery version. I'll just paste the script blocks as that's the only thing that changed.

```markup
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script>
$(document).ready(function() {

	$("#artid").keyup(function() {
		var artid = $(this).val()
		if(isNaN(artid)) return
		
		$.getJSON("test.cfc?method=getdata&artid=" + artid + "&returnformat=json", {}, function(d,status) {
			var data = {}
			for(var i=0; i &lt; d.COLUMNS.length; i++) {
				data[d.COLUMNS[i]] = d.DATA[0][i]
			}
			$("#artname").val(data["ARTNAME"])
			$("#description").val(data["DESCRIPTION"])
			$("#price").val(data["PRICE"])
		})

	})
})
</script>
```

Enjoy!

PS: There is a fairly serious bug with ColdFusion 9 and returning JSON from CFCs. Before I post details though I'm waiting for the guy who found it to let me know if he has blogged it already. For now though note that the returnType="string" on getPrice is required in ColdFusion 9.