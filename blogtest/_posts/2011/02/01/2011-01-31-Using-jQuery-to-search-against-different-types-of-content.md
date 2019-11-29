---
layout: post
title: "Using jQuery to search against different types of content"
date: "2011-02-01T07:02:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/02/01/Using-jQuery-to-search-against-different-types-of-content
guid: 4102
---

Shane asked an interesting question over email. He wanted to know if it was possible, either via auto suggest or a 'live search' type interface, to search different types of content. For example, maybe searching against people and locations. While each by itself is simple, he wanted to know if it was possible to search both at once and - of course - display them appropriately. Here is an example I came up with.
<!--more-->
<p/>

I began by figuring out <i>what</i> I wanted to search. For my demo I decided on the art table from the ColdFusion cfartgallery demo and the locations within the orders table. I'm going to start off by showing the service so you can get an idea of how the data is returned.

<p/>

<code>
component {

	remote struct function search(string search) {
		var result = {};
		result["art"] = [];
		result["locations"] = [];
		
		//first handle art
		var q = new com.adobe.coldfusion.query();
        q.setDatasource("cfartgallery");
        q.setSQL("select artname, price, largeimage from art where artname like :search");
        q.setMaxRows(7);
        q.addParam(name="search",value="{% raw %}%#arguments.search#%{% endraw %}",cfsqltype="cf_sql_varchar");
        var results = q.execute().getResult();
        
        for(var i=1; i&lt;=results.recordCount; i++) {
        	arrayAppend(result["art"], {% raw %}{ "name"=results.artname[i], "price"=results.price[i], "largeimage"=results.largeimage[i]}{% endraw %});	
        }

		//now handle locations
		var q = new com.adobe.coldfusion.query();
        q.setDatasource("cfartgallery");
        q.setSQL("select address, city, state, postalcode from orders where customerfirstname like :search or customerlastname like :search or address like :search");
        q.setMaxRows(7);
        q.addParam(name="search",value="{% raw %}%#arguments.search#%{% endraw %}",cfsqltype="cf_sql_varchar");
        var results = q.execute().getResult();
        
        for(var i=1; i&lt;=results.recordCount; i++) {
        	arrayAppend(result["locations"], {% raw %}{ "address"=results.address[i], "city"=results.city[i], "state"=results.state[i], "postalcode"=results.postalcode[i]}{% endraw %});	
        }

		return result;		        
	}

}
</code>

<p/>

Ok, so I promised to be a bit more 'gentle' about my use of script based components. This CFC only has one method, search. The method begins with "remote struct" which marks it as a remote callable method and sets a return type of struct. Immediately within the method I create a result structure with two keys: art and location. Why did I make use of bracket notation? Doing so ensures the case is preserved when the results are eventually converted to JSON. One of the things I <i>love</i> about Ajax development with ColdFusion is that I can build methods like this and know they will "just work" when called via jQuery. While I certainly am thinking about the eventual JSON conversion I don't have to actually code anything to support it. And certainly if I forgot the 'trick' of using bracket notation I could still use the code as is. I'd just have to user upper case in my JavaScript. 

<p/>

I've got two blocks of code then in the method. In both cases I'm making use of the Query component. This is how ColdFusion 9 added support for queries within cfscript. I set the max number of rows to 7 in order to make the demo a bit simpler to use but you would probably use a higher number or - even better - do the limit within SQL. Both queries blocks add their results to a simple array of structs and finally return the entire structure. Simple, right? If not - speak up!

<p/>

Now let's move to the front end. Here is my code:

<p/>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//http://stackoverflow.com/questions/217957/how-to-print-debug-messages-in-the-google-chrome-javascript-console/2757552#2757552
	if (!window.console) console = {};
	console.log = console.log {% raw %}|| function(){}{% endraw %};
	console.dir = console.dir {% raw %}|| function(){}{% endraw %};
	

	//listen for keyup on the field
	$("#searchField").keyup(function() {
		//get and trim the value
		var field = $(this).val();
		field = $.trim(field)

		//if blank, nuke results and leave early
		if(field == "") {
			$("#results").html("");
			return;
		}
		
		console.log("searching for "+field);
		$.getJSON("test.cfc?returnformat=json&method=search", {% raw %}{"search":field}{% endraw %}, function(res,code) {
			var s = "";
			s += "&lt;h2&gt;Results&lt;/h2&gt;";
			for(var i=0; i&lt;res.art.length; i++) {
				s += "&lt;p&gt;&lt;b&gt;"+res.art[i].name+"&lt;/b&gt;&lt;br/&gt;Price: "+res.art[i].price + "&lt;br/&gt;";
				s += "&lt;img src=\"/cfdocs/images/artgallery/" + res.art[i].largeimage + "\"&gt;&lt;/p&gt;";
			}

			for(var i=0; i&lt;res.locations.length; i++) {
				s += "&lt;p&gt;&lt;b&gt;Location: &lt;/b&gt;"+res.locations[i].address + "&lt;br/&gt;" + res.locations[i].city + ", " + res.locations[i].state + " " + res.locations[i].postalcode + "&lt;br/&gt;";
				var encAddress = escape(res.locations[i].address + " " + res.locations[i].city + " " + res.locations[i].state + " " + res.locations[i].postalcode);
				s += "&lt;img src=\"http://maps.google.com/maps/api/staticmap?zoom=12&size=400x400&maptype=roadmap&sensor=false&center=" + encAddress + "\"&gt;&lt;/p&gt;";
			}
			
			$("#results").html(s);
		});
	});
})
&lt;/script&gt;


&lt;form&gt;
Search: &lt;input type="text" name="search" id="searchField"&gt;
&lt;/form&gt;

&lt;div id="results"&gt;&lt;/div&gt;
</code>

<p/>

As with most of the demos I build, the actual layout is pretty minimal. If you start at the bottom you'll notice one form and an empty div I'll be using for display of the search results. Let's hop to the top where the interesting stuff is. First off, yes, console haters out there, I finally found a nice solution via StackOverflowL

<p/>

<code>
//http://stackoverflow.com/questions/217957/how-to-print-debug-messages-in-the-google-chrome-javascript-console/2757552#2757552
if (!window.console) console = {};
console.log = console.log {% raw %}|| function(){}{% endraw %};
console.dir = console.dir {% raw %}|| function(){}{% endraw %};
</code>

<p/>

To be honest, I don't think console code should go to production ever, but for now this little hack will handle those of you who hit my demo with a browser lacking proper console support. 

<p/>

Moving down we come to the keyup bind on my search field. This will give the 'search as you type' functionality. I grab and trim the field and if blank, nuke the display. If not blank, we make the Ajax call to the CFC above. Working with the results isn't too difficult. Remember we had an array with two keys. I simply loop over both and display them. Do notice though the I display art and locations slightly different. For art I display the name and title and render the image. For locations I make use of the Google Static Map API to display the location on a map. All in all - not too difficult. Try the demo below. Note - the data really isn't great. I'd suggest searching for "e" to see an example of a search that returns data in both categories.

<p/>


<a href="http://www.raymondcamden.com/demos/feb12011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>


<p/>

In my next blog entry, I'm going to demonstrate how you can work with different types of data when the types are mingled together.