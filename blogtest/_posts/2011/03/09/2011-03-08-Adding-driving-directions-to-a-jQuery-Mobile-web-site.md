---
layout: post
title: "Adding driving directions to a jQuery Mobile web site"
date: "2011-03-09T07:03:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/03/09/Adding-driving-directions-to-a-jQuery-Mobile-web-site
guid: 4150
---

My first morning at Scotch on the Rocks was a bit rough. Despite getting to bed at a decent time (10:30 or so) so I could catch up on my sleep, I ended up waking up around 3:30 or so in the morning and tossing and turning till 6. During that time an idea popped in my head for one more demo I could do for my jQuery Mobile presentation. I was thinking about building a simple mobile web site for the hotel. I thought it would be a simple example but also pretty practical. Of course, once I figured out a simple, static plan for the site an idea occurred to me. One of the important details for a hotel - obviously - is where they are. But what if you could not only tell folks where the hotel was but how you could get there? Here's my demo which shows just that. I'll warn you now - it's brittle as heck. It's really just a proof of concept. But it works (mostly) and I think it's pretty cool. Ready?
<!--more-->
<p>

First, I'll begin by showing a few screen shots of the application I built. This is online and I'll share that link at the end, but for now, let's just look at pretty pictures. 

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip36.png" />

<p>

My hotel mobile home page has three links: Contact Us, Find Us, and About. Contact Us has the basics - a phone number and an email address. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip37.png" />

<p>

On a mobile device, clicking that phone number will automatically call the hotel. This is probably the #1 most important "service" a mobile web site can provide. Unfortunately far too few make this as simple. Let's skip the second link now and show the 3rd link:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip38.png" />

<p>

Yeah, nothing important here. This is where you can stick the content the marketing department insists on that is most likely 100% useless to visitors. Let's face it -you know you will need to add it to the site. At least by making it the third link it isn't as distracting and doesn't interfere with the critical information. 

<p>

Now that you've seen those pages - let's look at the code behind it. I'm not going to explain everything here - that's for another blog entry - but check out how simple the code is...

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Apex Hotels&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.5.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Apex Hotels&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;li data-role="list-divider"&gt;Welcome to Apex Hotels&lt;/li&gt;
			&lt;li&gt;&lt;a href="contact.html"&gt;Contact Us&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="find.html"&gt;Find Us&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;This is NOT a real Apex Hotels page.&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;div data-role="page" id="about" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;About&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;
		This is demo content.
		&lt;/p&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

That code covers the home page and the About page. Here is the code behind the Contact Us page.

<p>

<code>
&lt;div data-role="page" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Contact Us&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	&lt;p&gt;
	Reservations: &lt;a href="tel:0845 365 0000"&gt;0845 365 0000&lt;/a&gt;&lt;br/&gt;
	Email: &lt;a href="mailto:reservations@apexhotels.co.uk"&gt;reservations@apexhotels.co.uk&lt;/a&gt;&lt;br/&gt;
	&lt;/p&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

Ok, now let's look at Find Us. This page does two things. First, it shows a simple map to the hotel. For this, I used the address of the hotel hosting the conference. Secondly, it provides a link that will be used for driving directions.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip39.png" />

<p>

And here is the code behind that...

<p>

<code>

&lt;div data-role="page" id="findusPage" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Find Us&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	&lt;p&gt;
Apex International Hotel, Edinburgh&lt;br/&gt;
31-35 Grassmarket&lt;br/&gt;
Edinburgh&lt;br/&gt;
EH1 2HS&lt;br/&gt;
Scotland&lt;br/&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;img src="http://maps.google.com/maps/api/staticmap?center=31-35+Grassmarket+Edinburgh+EH1+2HS+Scotland&zoom=15&size=200x200&maptype=roadmap
&sensor=false"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;a data-role="button" id="drivingButton" data-theme="a"&gt;Get driving directions&lt;/a&gt;
	&lt;/p&gt;
	
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

By the way - notice that map there. It's using the static Google Maps API. Very simple, right? It would be better if I added a marker at the center address for the hotel. That wouldn't take long but for now, I'm skipping it. Ok, so how do we take that button and make it live? I went back to my main home page. This is always loaded first and therefore is a good place to store code like this. You can <b>not</b> - as far as I know, use $(document).ready within the page code above. This seems to work once, but not when the page is loaded again. Therefore we need to use the index page. jQuery Mobile gives us a few new events we can listen one - one of them being pagecreate. I used that and bound to the findUs page div to create the following code block:

<p>

<code>
$('#findusPage').live('pagecreate',function(event){

});
</code>

<p>

Ok - now let's get into the fun part. When I originally conceived of this demo, it occurred to me I couldn't do driving directions to the hotel since I was actually presenting <b>at</b> the hotel. That would be dumb. So while at the conference I decided to provide directions to Glasgow. Now that I'm back  home, I decided on Baton Rouge instead. In order to get the directions though we need to figure out where we are. That's <b>super</b> easy on mobile browsers since you've got pretty universal support for geolocation:

<p>

<code>
navigator.geolocation.getCurrentPosition(function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
</code>

<p>

As you can see, I simply fire off the geolocation request and grab the latitude and longitude in the response. To get driving directions, we need Google Maps. I added this to the top of my page:

<p>

<code>
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;	
</code>

<p>

And then back in my code I added a new instance of the directions service:

<p>

<code>
var dirApi = new google.maps.DirectionsService();
</code>

<p>

You can find the full API reference for this service here: <a href="http://code.google.com/apis/maps/documentation/javascript/reference.html#DirectionsService">http://code.google.com/apis/maps/documentation/javascript/reference.html#DirectionsService</a>. But for now, we're going to make it simple. We create an object that will be used for our request. 

<p>

<code>
dirReq = {};
dirReq.destination = "Baton Rouge, LA";
dirReq.origin = new google.maps.LatLng(lat,lon);
dirReq.travelMode = google.maps.DirectionsTravelMode.DRIVING;
</code>

<p>

Again - the use of Baton Route here is simply to make the demo work better for me. Ok, now for the fun part. I'm going to ask the direction service to create a route. The result is <b>very</b> complex, but essentially contains routes which contain steps. I'm going to assume we get one route and get the steps from there. I want to work with a much smaller set of data so I basically create my own, smaller and simpler copy:

<p>

<code>
dirApi.route(dirReq,function(dirResult,dirStatus) {
		if (dirStatus != google.maps.DirectionsStatus.OK) {
			alert("Driving API error: "+dirStatus);
		}
		//our steps are dirResult.routes[0].legs[0].steps
		var steps = dirResult.routes[0].legs[0].steps;
		var copy = dirResult.routes[0].copyrights;
		console.dir(steps);
		var niceSteps = [];
		for (var i = 0; i &lt; steps.length; i++) {
			step = {};
			step.text = steps[i].instructions;
			step.distance = steps[i].distance.text;
			step.duration = steps[i].duration.text;
			step.endlat = steps[i].end_location.lat();
			step.endlon = steps[i].end_location.lng();
			niceSteps[niceSteps.length] = step;
		}
</code>

<p>

Ok - so now we have - hopefully - a simple array of steps that include the text of the direction, the duration, the time, and even the longitude and latitude of where you end up. How do we present this to the user? We could simply dump all the steps onto the page. But that may be hard to work with on the device. What if instead we broke it into steps, like so....

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip40.png" />

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip41.png" />

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip42.png" />


<p>

Sweet, right? So how did I do it? The first thing I did was add a jQuery plugin to allow me to serialize data into JSON format. Once I did that, I was able to send the data to ColdFusion and store it:

<p>

<code>
$.post("store.cfm", {% raw %}{data:$.toJSON(niceSteps)}{% endraw %}, function() {
	$.mobile.changePage("driving.cfm");
});
</code>

<p>

All store.cfm does is take the JSON, deserialize that, and store it into the session scope. 

<p>

<code>
&lt;cfparam name="form.data" default=""&gt;
&lt;cfset session.data = deserializeJSON(form.data)&gt;
</code>

<p>

If you notice back in the JavaScript, when the post is done, we use a jQuery Mobile utility to load a new page. driving.cfm will simply paginate over the driving steps:

<p>

<code>

&lt;cfparam name="url.step" default="1"&gt;
&lt;cfset step = session.data[url.step]&gt;

&lt;div data-role="page" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Driving Directions - Step &lt;cfoutput&gt;#url.step# of #arrayLen(session.data)#&lt;/cfoutput&gt;&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;cfoutput&gt;
		&lt;h1&gt;Step #url.step#&lt;/h1&gt;
		&lt;p&gt;
		&lt;b&gt;Duration:&lt;/b&gt; #step.duration#&lt;br/&gt;
		&lt;b&gt;Distance:&lt;/b&gt; #step.distance#&lt;br/&gt;
		&lt;/p&gt;
		&lt;p&gt;
		#step.text#
		&lt;/p&gt;		

		&lt;p&gt;
		&lt;img src="http://maps.google.com/maps/api/staticmap?center=#step.endlat#,#step.endlon#&zoom=14&size=200x200&maptype=roadmap
&sensor=false"&gt;
		&lt;/p&gt;
		
		&lt;div data-inline="true"&gt;
			&lt;cfif url.step is 1&gt;
				&lt;a href="" data-role="button" data-theme="c" data-inline="true"&gt;Previous&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;a href="driving.cfm?step=#url.step-1#" data-role="button" data-inline="true"&gt;Previous&lt;/a&gt;
			&lt;/cfif&gt;
			&lt;cfif url.step is arrayLen(session.data)&gt;
				&lt;a href="" data-role="button" data-theme="c" data-inline="true"&gt;Next&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;a href="driving.cfm?step=#url.step+1#" data-role="button" data-inline="true"&gt;Next&lt;/a&gt;
			&lt;/cfif&gt;
		&lt;/cfoutput&gt;
		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

And that's it! As I said, this code is brittle. You will notice that if geolocation or driving directions fail we just use an Alert. There are <b>much</b> nicer things we could do. For example, we could ask the user where they are. If driving directions fail we could do what most places do and assume you are coming in from the closest major highway. But - hopefully you can see how easy it is to add in complex services like Google's driving directions within a simple jQuery Mobile site. To try this demo, hit the button below. But please - do not stress out if it fails for you. As I said, it is brittle, was built fast, etc, and at least <i>kind</i> of works. 

<p>


<a href="http://www.coldfusionjedi.com/demos/march92011/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

I've included the full code for this demo as an attachment to this blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdrivingdemo%{% endraw %}2Ezip'>Download attached file.</a></p>