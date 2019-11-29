---
layout: post
title: "Eventbrite API Demos"
date: "2014-08-15T07:08:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/08/15/Eventbrite-API-Demos
guid: 5287
---

<p>
A few days ago a client of mine, Rich Swier of <a href="http://hubsarasota.com/">HuB</a>, asked if I could build him two quick demos that made use of the <a href="http://developer.eventbrite.com/">Eventbrite API</a>. I whipped up the two demos for him and once done, he graciously allowed me to share it on my blog. (Thank you Rich!) I will warn you that this code was written for ColdFusion 8 so it is entirely tag based. At the very end a mod was made for ColdFusion 9. Obviously it could be converted to script and perhaps improved in other ways as well, but I hope this is useful for folks who want to play with the Eventbrite API in the future.
</p>
<!--more-->
<p>
Before making use of these demos yourself, you will want to get yourself an authorization token for your account. After going to developer.eventbrite.com, click Get Started. Note the green button on the right.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s118.png" />
</p>

<p>
When I tested this a few days ago, it worked fine for me, but failed for Rich as he wasn't the primary account owner for his organization. Unfortunately the "failure" was a blank white screen. I got a response from Eventbrite on their forums (<a href="https://groups.google.com/forum/#!forum/eventbrite-api">https://groups.google.com/forum/#!forum/eventbrite-api</a>) about this within a day, but I'm not sure if it is fixed yet. If you do get a "white screen of death" error though check to see if there are other people in your group using Eventbrite.
</p>

<p>
Once logged in, add a new app, and when done, make note of the OAuth token. My API makes use of this to make authenticated calls for your organization. Finding the ID of your organization can be a bit weird too. Unfortunately I can't find the tip that helped me with this before (I believe it was an Eventbrite staff member), but in order to get your organization ID, login, go to your profile page, and find your organizer page URL:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s215.png" />
</p>

<p>
The organizer ID is the numeric part at the end of your URL. I've highlighted it in the screen shot above. It is a bit silly that the value isn't called out specifically either on the developer page or on your profile, but, there it is. 
</p>

<p>
Ok, so finally, with your token and organizer ID, you can perform some basic searches against the API. For Rich, I only needed Search, but their API supports pretty much everything imaginable as far as I can tell. I created a simple CFC that is initialized with the auth token. First, the Application.cfc used to set up the CFC.
</p>

<pre><code class="language-markup">&lt;cfcomponent output=&quot;false&quot;&gt;
	
	&lt;cfset this.name = &quot;RichSwierEventBrite&quot;&gt;
	
	&lt;cffunction name=&quot;onApplicationStart&quot; access=&quot;public&quot; returntype=&quot;boolean&quot; output=&quot;false&quot;&gt;
	
		&lt;cfset application.eventBrite = {}&gt;
		&lt;cfset application.eventBrite.token = &quot;secret&quot;&gt;
		&lt;cfset application.eventBrite.orgid = &quot;3983270067&quot;&gt;
		
		&lt;cfset application.eventBriteApi = createObject(&quot;component&quot;, &quot;eventbrite&quot;).init(application.eventBrite.token)&gt;
		
		&lt;cfreturn true&gt;
	&lt;&#x2F;cffunction&gt;
	
	&lt;cffunction name=&quot;onRequestStart&quot; access=&quot;public&quot; returntype=&quot;boolean&quot; output=&quot;false&quot;&gt;

		&lt;!--- TODO: remove 1 ---&gt;
		&lt;cfif structKeyExists(url, &quot;init&quot;) or 1&gt;
			&lt;cfset onApplicationStart()&gt;	
		&lt;&#x2F;cfif&gt;
		
		&lt;cfreturn true&gt;
	&lt;&#x2F;cffunction&gt;
	
&lt;&#x2F;cfcomponent&gt;</code></pre>

<p>
And here is the CFC itself. Again, this was written for ColdFusion 8, so pardon all the darn tags. I could have used script I suppose, but I ran into some issues with even script-based UDFs on his server so I went the safe route. Also note I ran into cfhttp issues with the https server Eventbrite used. This is why I used a <a href="http://www.raymondcamden.com/2011/1/12/Diagnosing-a-CFHTTP-issue--peer-not-authenticated">workaround</a> described a few years ago on my blog. On ColdFusion 10 I didn't have the issue at all.
</p>

<pre><code class="language-markup">&lt;cfcomponent output=&quot;false&quot;&gt;

	&lt;cffunction name=&quot;init&quot; access=&quot;public&quot; returnType=&quot;eventbrite&quot; output=&quot;false&quot;&gt;
		&lt;cfargument name=&quot;token&quot; type=&quot;string&quot; required=&quot;true&quot;&gt;
		&lt;cfset variables.token = arguments.token&gt;		
		&lt;cfreturn this&gt;
	&lt;&#x2F;cffunction&gt;
	
	&lt;cffunction name=&quot;getEvents&quot; access=&quot;public&quot; returnType=&quot;struct&quot; output=&quot;false&quot;&gt;
		&lt;cfargument name=&quot;organizationid&quot; type=&quot;string&quot; required=&quot;true&quot;&gt;
		&lt;cfargument name=&quot;startdate&quot; type=&quot;date&quot; required=&quot;false&quot;&gt;
		&lt;cfargument name=&quot;enddate&quot; type=&quot;date&quot; required=&quot;false&quot;&gt;

		&lt;cfset var result = &quot;&quot;&gt;
		&lt;cfset var content = &quot;&quot;&gt;
		&lt;cfset var apiurl = &quot;https:&#x2F;&#x2F;www.eventbriteapi.com&#x2F;v3&#x2F;events&#x2F;search?organizer.id=#arguments.organizationid#&quot;&gt;
		&lt;cfset var startUTC = &quot;&quot;&gt;
		&lt;cfset var endUTC = &quot;&quot;&gt;
		&lt;cfset var objSecurity = &quot;&quot;&gt;
		&lt;cfset var storeProvider = &quot;&quot;&gt;
		
		&lt;cfif structKeyexists(arguments, &quot;startdate&quot;)&gt;
			&lt;cfset startUTC = getIsoTimeString(arguments.startdate, true)&gt;
			&lt;cfset apiurl &amp;= &quot;&amp;start_date.range_start=#startUTC#&quot;&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyexists(arguments, &quot;enddate&quot;)&gt;
			&lt;cfset endUTC = getIsoTimeString(arguments.enddate, true)&gt;
			&lt;cfset apiurl &amp;= &quot;&amp;start_date.range_end=#endUTC#&quot;&gt;
		&lt;&#x2F;cfif&gt;
		
		&lt;cfset apiurl &amp;= &quot;&amp;token=#variables.token#&quot;&gt;

		&lt;cfset objSecurity = createObject(&quot;java&quot;, &quot;java.security.Security&quot;) &#x2F;&gt;
		&lt;cfset storeProvider = objSecurity.getProvider(&quot;JsafeJCE&quot;) &#x2F;&gt;
		&lt;cfset objSecurity.removeProvider(&quot;JsafeJCE&quot;) &#x2F;&gt;
		
		&lt;cfhttp url=&quot;#apiurl#&quot; result=&quot;result&quot;&gt;

		&lt;cfset objSecurity.insertProviderAt(storeProvider, 1) &#x2F;&gt;
		
		&lt;cfset content = deserializeJSON(result.filecontent)&gt;
		&lt;cfreturn content&gt;

	&lt;&#x2F;cffunction&gt;
	
	&lt;cfscript&gt; 
	&#x2F;&#x2F; I take the given date&#x2F;time object and return the string that
	&#x2F;&#x2F; reprsents the date&#x2F;time using the ISO 8601 format standard.
	&#x2F;&#x2F; The returned value is always in the context of UTC and therefore
	&#x2F;&#x2F; uses the special UTC designator (&quot;Z&quot;). The function will
	&#x2F;&#x2F; implicitly convert your date&#x2F;time object to UTC (as part of
	&#x2F;&#x2F; the formatting) unless you explicitly ask it not to.
	function getIsoTimeString(datetime) {
	 
	 	if(!structKeyExists(arguments, &quot;convertToUTC&quot;)) {
	 		convertToUTC = true;	
	 	}
	 	
	    if ( convertToUTC ) {
	        datetime = dateConvert( &quot;local2utc&quot;, datetime );
	    }
	 
		&#x2F;&#x2F; When formatting the time, make sure to use &quot;HH&quot; so that the
		&#x2F;&#x2F; time is formatted using 24-hour time.
		return(dateFormat( datetime, &quot;yyyy-mm-dd&quot; ) &amp;
		    &quot;T&quot; &amp;
	    	timeFormat( datetime, &quot;HH:mm:ss&quot; ) &amp;
		    &quot;Z&quot;
	        );
	 
	}
	&lt;&#x2F;cfscript&gt;
	
&lt;&#x2F;cfcomponent&gt;</code></pre>

<p>
Nothing special really. I just construct the URL and fire off the call. That UDF at the end may be found on CFLib: <a href="http://cflib.org/udf/getIsoTimeString">getIsoTimeString</a>. As I said, I built a grand total of <i>one</i> function for the API because that's all he needed. Now let's look at the actual demos. The first demo makes use of Google Maps. I perform a search for future events, get their locations, and display them on a map.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s3.jpg" />
</p>

<p>
For the most part, this was simple, but the issue I ran into (and this is a reported issue with the API), is the location information for the venue wasn't including the full address. There is a venue API that returns the proper information, but that would mean adding N more calls over http to fetch the data. I simply warned Rich that the address won't be working properly until they fix the API. To be clear, I'm talking about the textual part of the address. The longitude and latitude work just fine. Right now when you click you get some detail and the ability to click for the Eventbrite URL.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s41.jpg" />
</p>

<p>
Now let's look at the code that generates the map.
</p>

<pre><code class="language-markup">&lt;!--- only events today and onwards ---&gt;
&lt;cfset dtNow = now()&gt;

&lt;cfif structKeyExists(url, &quot;clearcache&quot;)&gt;
	&lt;cfset cacheRemove(&quot;eventbrite.futureEvents&quot;)&gt;
&lt;&#x2F;cfif&gt;

&lt;cfset events = cacheGet(&quot;eventbrite.futureEvents&quot;)&gt;
&lt;cfif isNull(events)&gt;
	&lt;cfset eventData = application.eventBriteApi.getEvents(application.eventBrite.orgid,dtNow)&gt;

	&lt;cfset cachePut(&quot;eventbrite.futureEvents&quot;, eventData.events,0.5)&gt;
	&lt;cfset events = eventData.events&gt;
&lt;&#x2F;cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type=&quot;text&#x2F;css&quot;&gt;
#map_canvas {% raw %}{ width: 500px; height: 500px; }{% endraw %}
&lt;&#x2F;style&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;maps.google.com&#x2F;maps&#x2F;api&#x2F;js?sensor=false&quot;&gt;&lt;&#x2F;script&gt;
&lt;script type=&quot;text&#x2F;javascript&quot;&gt;
function initialize() {
	
    var latlng = new google.maps.LatLng(41.5, -98);
    var myOptions = {
        zoom: 3,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(&quot;map_canvas&quot;),myOptions);

	&lt;cfloop index=&quot;x&quot; from=&quot;1&quot; to=&quot;#arrayLen(events)#&quot;&gt;
		&lt;cfset event = events[x]&gt;
		&lt;!--- conditionally format address ---&gt;
		&lt;cfset address = &quot;&quot;&gt;
		&lt;cfif structKeyExists(event.venue, &quot;name&quot;) and event.venue.name is not &quot;undefined&quot;&gt;
			&lt;cfset address &amp;= event.venue.name&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(event.venue, &quot;address_1&quot;) and event.venue.address_1 is not &quot;undefined&quot;&gt;
			&lt;cfset address &amp;= &quot;&lt;br&#x2F;&gt;&quot; &amp; event.venue.address_1&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(event.venue, &quot;address_2&quot;) and event.venue.address_2 is not &quot;undefined&quot;&gt;
			&lt;cfset address &amp;= &quot;&lt;br&#x2F;&gt;&quot; &amp; event.venue.address_2&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(event.venue, &quot;city&quot;) and event.venue.city is not &quot;undefined&quot;&gt;
			&lt;cfset address &amp;= &quot;&lt;br&#x2F;&gt;&quot; &amp; event.venue.city&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(event.venue, &quot;state&quot;) and event.venue.state is not &quot;undefined&quot;&gt;
			&lt;cfset address &amp;= &quot;, &quot; &amp; event.venue.state&gt;
		&lt;&#x2F;cfif&gt;
		&lt;!--- format times ---&gt;
		&lt;cfset startDate = listFirst(event.start.local, &quot;T&quot;)&gt;
		&lt;cfset startDate = dateFormat(startDate, &quot;mm&#x2F;dd&#x2F;yy&quot;)&gt;
		&lt;cfset startTime = listLast(event.start.local, &quot;T&quot;)&gt;
		&lt;!--- strips off seconds, which is silly ---&gt;
		&lt;cfset startTime = mid(startTime, 1, len(startTime)-3)&gt;
		&lt;cfset startTime = timeFormat(startTime, &quot;h:mm tt&quot;)&gt;
		
		&lt;cfset endDate = listFirst(event.end.local, &quot;T&quot;)&gt;
		&lt;cfset endTime = listLast(event.end.local, &quot;T&quot;)&gt;
		&lt;!--- strips off seconds, which is silly ---&gt;
		&lt;cfset endTime = mid(endTime, 1, len(endTime)-3)&gt;
		&lt;cfset endTime = timeFormat(endTime, &quot;h:mm tt&quot;)&gt;
		
		&lt;!--- currently assumes same date ---&gt;
		&lt;cfset dateStr = startDate &amp; &quot; at &quot; &amp; startTime &amp; &quot; to &quot; &amp; endTime&gt;
		&lt;cfoutput&gt;
		var pos = new google.maps.LatLng(#event.venue.latitude#,#event.venue.longitude#);
	 	var marker#x# = new google.maps.Marker({
	    	map: map, 
	        position: pos,
	        title: &quot;#jsStringFormat(event.name.text)#&quot;
	    });

		var infowindow#x# = new google.maps.InfoWindow({
			content: &#x27;&lt;b&gt;#jsStringFormat(event.name.text)#&lt;&#x2F;b&gt;&lt;p&#x2F;&gt;#jsStringFormat(address)#&lt;br&#x2F;&gt;#jsStringFormat(dateStr)#&lt;br&#x2F;&gt;&lt;a href=&quot;#event.url#&quot;&gt;Details&lt;&#x2F;a&gt;&#x27;,
			maxWidth: 250
		});
		
		google.maps.event.addListener(marker#x#, &#x27;click&#x27;, function() {
			infowindow#x#.open(map,marker#x#);
		});
  	    &lt;&#x2F;cfoutput&gt;
	&lt;&#x2F;cfloop&gt;
}
&lt;&#x2F;script&gt;
&lt;&#x2F;head&gt;

&lt;body onload=&quot;initialize()&quot;&gt;

&lt;div id=&quot;map_canvas&quot;&gt;&lt;&#x2F;div&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
Again - pretty simple. Get the events and then just iterate over them to create map markers using the Google API. I don't like the ColdFusion code inside the JavaScript block there and I'd probably consider moving that outside. That way when I create the markers the code would be simpler. (And obviously, if this were a production application I'd use something like FW/1 and do most of that work in the controller/service layer anyway.)
</p>

<p>
So that's maps. The next demo he requested was a calendar. I decided to use the <a href="http://arshaw.com/fullcalendar/">FullCalendar</a> jQuery plugin as it worked well for me before. (See my <a href="http://www.raymondcamden.com/2011/6/17/FullCalendar-jQuery-Plugin">blog post</a> from a few years back.) In order to work with the client-side code, I wrote a quick CFC to handle calls to my application scoped Eventbrite API. It also handles shaping the data so it makes the FullCalendar happy. I could have added some RAM-based caching here, but I found that the API was fast enough for month based searches where it didn't feel necessary. Then again - I'd probably consider adding it anyway just to ensure you don't hit any rate limits.
</p>

<pre><code class="language-markup">&lt;!---
Main wrapper to calls to the EB api. Handles the caching so EB can be a bit simpler.
Also handles converting EB events for FullCalendar
---&gt;
&lt;cfcomponent output=&quot;false&quot;&gt;
	
	&lt;cffunction name=&quot;getEvents&quot; access=&quot;remote&quot; output=&quot;false&quot; returnformat=&quot;json&quot;&gt;
		&lt;cfargument name=&quot;start&quot; type=&quot;string&quot; required=&quot;true&quot;&gt;
		&lt;cfargument name=&quot;end&quot; type=&quot;string&quot; required=&quot;true&quot;&gt;
		
		&lt;cfset var eventData = application.eventBriteApi.getEvents(application.eventbrite.orgid,parseDateTime(arguments.start), parseDateTime(arguments.end))&gt;
		&lt;cfset var result = []&gt;
		&lt;cfset var x = &quot;&quot;&gt;
		&lt;cfset var event = &quot;&quot;&gt;
		
		&lt;cfloop index=&quot;x&quot; from=&quot;1&quot; to=&quot;#arrayLen(eventData.events)#&quot;&gt;
			&lt;cfset event = {}&gt;
			&lt;cfset event[&quot;title&quot;] = eventData.events[x].name.text&gt;
			&lt;cfset event[&quot;start&quot;] = eventData.events[x].start.local&gt;
			&lt;cfset event[&quot;end&quot;] = eventData.events[x].end.local&gt;
			&lt;cfset event[&quot;url&quot;] = eventData.events[x].url&gt;
			&lt;cfset arrayAppend(result, event)&gt;	
		&lt;&#x2F;cfloop&gt;
		
		&lt;cfreturn result&gt;
	&lt;&#x2F;cffunction&gt;
	
&lt;&#x2F;cfcomponent&gt;</code></pre>

<p>
Finally, here is the front end using FullCalendar. It is a page with just the calendar and a DOM element used to handle the loading of remote data. I could have designed that a bit better but I assumed the client would have their own ideas about that.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;&#x2F;title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link rel=&#x27;stylesheet&#x27; href=&#x27;fullcalendar&#x2F;fullcalendar.css&#x27; &#x2F;&gt;
		&lt;script src=&#x27;fullcalendar&#x2F;lib&#x2F;jquery.min.js&#x27;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&#x27;fullcalendar&#x2F;lib&#x2F;moment.min.js&#x27;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&#x27;fullcalendar&#x2F;fullcalendar.min.js&#x27;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		$(document).ready(function() {

		    $(&#x27;#calendar&#x27;).fullCalendar({
		    	eventSources: [
		    		{
			    		url:&#x27;api.cfc?method=getevents&#x27;
			    	}
		    	],
		    	loading:function(isLoading, view) {
		    		if(isLoading) {
			    		$(&quot;#loading&quot;).html(&quot;&lt;i&gt;Loading data...&lt;&#x2F;i&gt;&quot;);
			    	} else {
			    		$(&quot;#loading&quot;).html(&quot;&quot;);
			    	}
		    	}
		    });

		});		
		&lt;&#x2F;script&gt;

    &lt;&#x2F;head&gt;
    &lt;body&gt;
    	
		&lt;div id=&quot;loading&quot;&gt;&lt;&#x2F;div&gt;
		&lt;div id=&#x27;calendar&#x27;&gt;&lt;&#x2F;div&gt;

    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
I have attached the code as a zip to this blog entry. Note that the token and organization ID are not in the Application.cfc file so you will need to set them yourself. 
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Feb%{% endraw %}2Ezip'>Download attached file.</a></p>