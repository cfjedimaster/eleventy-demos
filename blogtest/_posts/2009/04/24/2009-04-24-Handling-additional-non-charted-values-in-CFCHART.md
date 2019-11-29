---
layout: post
title: "Handling additional (non charted) values in CFCHART?"
date: "2009-04-24T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/24/Handling-additional-non-charted-values-in-CFCHART
guid: 3327
---

Here is an interesting scenario that a reader (Mike) and I talked about earlier in the week. He had a query of car data that included make, VIN, and miles. Here is some sample data to give you an idea:
<!--more-->
<code>
&lt;cfset q3 = queryNew("car_make, car_vin, car_miles","varchar, varchar, integer")&gt;
&lt;cfset newrow = queryaddrow(q3, 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_make", "FORD", 1)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10001", 1)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles", 88, 1)&gt;

&lt;cfset temp=querysetcell(q3, "car_make", "CHEVROLET", 2)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10002", 2)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles",32, 2)&gt;

&lt;cfset temp=querysetcell(q3, "car_make", "CRYSLER", 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10003", 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles", 56, 3)&gt;
</code>

He then wanted to chart the data so that the model was used for labels, and miles was used for data.

<code>
&lt;cfchart&gt;
	&lt;cfchartseries query="q3" itemColumn="car_make" valueColumn="car_miles" type="bar"&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

The problem he had was with links. He wanted the user to click on a column and be taken to a page that passed the VIN number, not the make. Unfortunately, even though you can pass in an entire query to the chart engine, it seems as if the only data you really have available for links is the item label (Make), value (miles) and series label (only one series here so no label). It would be nice to be able to create a URL that used any column from the data.

I did a bit of digging with the chart editor and was not able to find out if this was possible. I think it might actually be doable, but, I didn't have time to really dig deep.

I came up with another solution. Mike said that the Model name was just as unique as the VIN. That being said, we can convert the query to JavaScript, and use a JavaScript handler for the chart link. Consider this complete template:

<code>
&lt;html&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfset q3 = queryNew("car_make, car_vin, car_miles","varchar, varchar, integer")&gt;
&lt;cfset newrow = queryaddrow(q3, 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_make", "FORD", 1)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10001", 1)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles", 88, 1)&gt;

&lt;cfset temp=querysetcell(q3, "car_make", "CHEVROLET", 2)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10002", 2)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles",32, 2)&gt;

&lt;cfset temp=querysetcell(q3, "car_make", "CRYSLER", 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_vin", "10003", 3)&gt;
&lt;cfset temp=querysetcell(q3, "car_miles", 56, 3)&gt;

&lt;cfdump var="#q3#"&gt;

&lt;script&gt;
&lt;cfoutput&gt;var #toScript(q3,'mydata',false)#&lt;/cfoutput&gt;

function translateToVin(make) {
	for(var i=0;i&lt;mydata.length;i++) {
		if(mydata[i]['car_make']==make) {
			var vin = mydata[i]['car_vin']
			console.log(vin)
			//document.location.href='test.cfm?vin='+vin
		}
	}
}
&lt;/script&gt;

&lt;!---
&lt;cfchart url="test.cfm?P_CAR_VIN=$ITEMLABEL$&val=$VALUE$&sl=$SERIESLABEL$"&gt;
---&gt;
&lt;cfchart url="javascript:translateToVin('$ITEMLABEL$')"&gt;

		&lt;cfchartseries query="q3" itemColumn="car_make" valueColumn="car_miles" type="bar"&gt;
		&lt;/cfchartseries&gt;
&lt;/cfchart&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

After the first set of lines that just set the data up, notice my use of "toScript". This lets you convert any CFML data into JavaScript statements. That one function will essentially just change my query into a set of JavaScript data.

Skip down a bit to the chart, and notice I'm now calling translateToVin, and passing in my car model. 

Go back up to the JavaScript, and you can see the code. It basically loops over the query data, looks for a match, and when it finds it, it uses the Firebug console to report it. The actual "movement" to the new page is right after, but commented out since I didn't have a detail page locally.

Of course, if car makes are unique, I could have just passed that and let the server do the lookup instead.

Anyway, hope this helps other.