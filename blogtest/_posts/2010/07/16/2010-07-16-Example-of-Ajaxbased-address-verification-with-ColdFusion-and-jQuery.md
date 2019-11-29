---
layout: post
title: "Example of Ajax-based address verification with ColdFusion and jQuery"
date: "2010-07-16T18:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/07/16/Example-of-Ajaxbased-address-verification-with-ColdFusion-and-jQuery
guid: 3880
---

Earlier this month a reader asked about AJAX-based validation of addresses. I was able to find a few services, but none that were free. Turned out that my own CFUPS package (<a href="http://cfups.riaforge.org">riaforge link</a>) actually supported address verification. Unfortunately it was only at the city level. I discovered that UPS does support street level verification as well, but had a heck of a time getting it to work. Luckily <i>another</i> reader (and talk about coincidence), Shane Pitts, figured out the issue and sent in the new code. His modification was released to RIAForge today. At lunch, while trying not to pay attention to the iPhone(y) press conference, I wrote up a quick demo.
<!--more-->
<p>

Before getting into the AJAXy bits, here is a quick example of how the API works. Note that for development, only addresses in New York can be tested. I picked <a href="http://www.epicenterconsulting.com/">Epicenter's</a> address, hope they don't mind.

<p>

<code>
&lt;cfset results = av.streetAddressVerification(address="32 E 31st Street", city="New York", state="NY",postalcode="10016")&gt;
&lt;cfdump var="#results#" label="Results"&gt;
</code>

<p>

This results in a one line response that is - for the most part - the exact same address.

<p>

<img src="https://static.raymondcamden.com/images/av1.png" title="Results from AV" />

<p>

In fact, for the most part I think you can assume if you get one response back, your initial response was ok. If you enter an inaccurate response though you get more responses:

<p>

<code>

&lt;cfset results = av.streetAddressVerification(address="390902 SE 31st Street", city="New York", state="NY",postalcode="10016")&gt;
&lt;cfdump var="#results#" label="Results"&gt;
</code>

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/av2.PNG" title="Results from AV2" />

<p>

So given a simple API where we assume 2-N results means we need to provide correction, here is a quick and ugly demo I created. 

<p>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

function checkAddy(e) {
	console.log('running checkAddy');
	var street = $.trim($("#street").val());
	var city = $.trim($("#city").val());
	var state = $.trim($("#state").val());
	var zip = $.trim($("#zip").val());
	if(street == '' {% raw %}|| city == '' |{% endraw %}{% raw %}| state == '' |{% endraw %}| zip == '') return;
	$("#avResult").html("Checking your address for validity...");
	
	$.getJSON("verificationservice.cfc?method=verifyaddress&returnFormat=json", {% raw %}{"street":street, "city":city, "state":state, "zip":zip}{% endraw %}, function(res) {
		if(res.ERROR) {
			$("#avResult").html("An error occured trying to verify your address: "+res.ERROR);
		} else {
			//Ok, we must have RESULTS. If 1, we say its good. Technically it may 'correct' a bit but we don't care
			//If &gt; 1, we create a list of results so you can pick one to auto correct
			if(res.RESULTS.DATA.length == 1) $("#avResult").html("Your address verified.");
			else {
				var s = "&lt;p&gt;The following addresses were returned as possible corrections. Click the address to correct your form.&lt;/p&gt;";
				$.each(res.RESULTS.DATA, function(idx,val) {
					s += "&lt;div class='addyoption'&gt;&lt;span class='street'&gt;" + val[0] + "&lt;/span&gt;&lt;br/&gt; ";
					s += "&lt;span class='city'&gt;" + val[1] + "&lt;/span&gt;, &lt;span class='state'&gt;" + val[2] + "&lt;/span&gt;&lt;br&gt;" ;
					s += "&lt;span class='zip'&gt;"+val[3]+"-"+val[4] +"&lt;/span&gt;&lt;/div&gt;";

				})

				$("#avResult").html(s);
			}
		}
	})
}

function fixAddy(e) {
	div = $(e.currentTarget);
	var street = $(".street", div).html();
	var city = $(".city", div).html();
	var state = $(".state", div).html();
	var zip = $(".zip", div).html();
	
	$("#street").val(street);
	$("#city").val(city);
	$("#state").val(state);
	$("#zip").val(zip);
	$("#avResult").html("");
}

$(document).ready(function() {

	$("#street, #city, #state, #zip").change(checkAddy);
	$("#saveBtn").click(checkAddy);
	
	$(".addyoption").live("click", fixAddy);
})
&lt;/script&gt;

&lt;style&gt;
.addyoption {
	width: 250px;
	padding: 5px;
	background-color: yellow;
	margin-bottom: 10px;
}
#avResult {
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Shipping Address&lt;/h2&gt;

&lt;form&gt;
Street: &lt;input type="text" name="street" id="street" value="32 E 31st Street"&gt;&lt;br/&gt;
City: &lt;input type="text" name="city" id="city" value="New York"&gt;&lt;br/&gt;
State: &lt;input type="text" name="state" id="state" size="2" maxlength="2" value="NY"&gt;&lt;br/&gt;
Zip: &lt;input type="text" name="zip" id="zip" value="10016"&gt;&lt;br/&gt;
&lt;input type="button" id="saveBtn" value="Save"&gt;
&lt;/form&gt;

&lt;div id="avResult"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Quite a bit going on here. Let's begin at the bottom. I've got a simple form that asks for street, city, state, and zip. I've got an empty div I'll use for handling results. 

<p>

Now move up to the document.ready block. I added an event listener to all my form fields. My thinking here was - I want to do address verification as soon as possible. You may enter your state first, your city next, and so on. So I've bound them all (including the button, which would normally be a submit) to a function called checkAddy. Let's go there next.

<p>

checkAddy begins by getting all the values. If any are blank, we leave. If not, we call our service. Our service is going to handle calling the UPS API and dealing with any error. As you can see, if we get an ERROR key back, we will report it. Otherwise we assume an array of RESULTS. If the length of the array is one, just assume we are good. (And again, I may be wrong on that.) If the length was more than one, here is where we get fancy. I create a div for each one and output them to screen. Like so:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/av3.PNG" title="Another AV Result" />

<p>

Now for the cool part. Back in my document.ready block I had set up a listener for clicks on these results: 	$(".addyoption").live("click", fixAddy). This live call will constantly monitor the DOM so that when the new items are added, the event listener still works. Now you can click on the div and fixAddy will run. This will grab the values from the div and automatically update the form. 

<p>

How about the service I called? Pretty trivial:

<p>

<code>
component {


	remote function verifyAddress(string street, string city, string state, string zip) {
		var result = {};
		try {
			var results = application.addressVerification.streetAddressVerification(address=arguments.street, city=arguments.city, state=arguments.state,postalcode=arguments.zip);
			result.results = results;
		} catch(any e) {
			result.error = e.message;
		}
		
		return result;
	}

}
</code>

<p>

Man, I love writing CFCs in script. It's like moving from Michelob Ultra to a fine Stone IPA. 

<p>

Because UPS tends to be a huge pain in the rear with the API at times, I cannot post a demo. I can however post this cool video of me clicking around the demo. It's better than unicorns farting.

<p>

<a href="http://www.coldfusionjedi.com/images/ups.swf"><img src="https://static.raymondcamden.com/images/cfjedi/av4.PNG" title="Click me for cool video" /></a>

<p>

<b>Edited at 5:18PM:</b> I tend to forget jQuery's $.each function. Rey Bango reminded me of this utility and I updated the code to make use of it.<br/>
<b>Edited on Saturday:</b> I made a few more improvements based on Bango's feedback. Thanks Rey!