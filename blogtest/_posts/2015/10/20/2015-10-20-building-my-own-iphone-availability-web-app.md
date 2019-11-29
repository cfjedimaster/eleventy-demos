---
layout: post
title: "Building my own iPhone Availability Web App"
date: "2015-10-20T11:16:06+06:00"
categories: [development,javascript,jquery,mobile]
tags: [bluemix]
banner_image: 
permalink: /2015/10/20/building-my-own-iphone-availability-web-app
guid: 6960
---

<strong>Before I begin, a quick disclaimer. What I'm building here is completely for fun and because I thought it might be interesting. I'm critiquing and improving a form that was built by people smarter than me and more than adequate for 99.99% of users. Basically, I saw something I wanted to build and I did it.</strong>

I'm currently the owner of an HTC M8 phone - my foray back into Android after using an iPhone for a couple of versions. I like the HTC UI, and in general, the phone was pretty incredible, but after the most recent Android OS update, my phone began to get more and more sluggish. It got to a point where just opening up the phone to take a picture would take 30-60 seconds for it to respond. Phone calls, which I don't get many of, were even worse. When I missed a call because my phone's basic UI wouldn't respond I nearly threw the thing in the pool. I tried many things but eventually wiped the phone and restored from a back up. It "helped", but the phone is still chunky. I decided it was time to switch back to iOS and I figured the iPhone 6S+ would be a great phone to pick up. I also decided that the new <a href="http://www.apple.com/shop/iphone/iphone-upgrade-program">iPhone upgrade program</a> would be a good fit. From what I've read it is better than ATT's Next program. The only problem is that you must go to an Apple store to sign up for the program. My nearest Apple store is in Baton Rouge, about an hour away. Worth a drive, but only if I know I'll have a device there to pick up.

<!--more-->

Luckily, Apple has a cool <a href="https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/availability?returnURL=http{% raw %}%3A%{% endraw %}2F{% raw %}%2Fwww.apple.com%{% endraw %}2Fshop{% raw %}%2Fbuy-iphone%{% endraw %}2Fiphone6s&channel=1&iPP=Y">form</a> you can use to see if your desired phone is available. You select your state, your store, your model, and then your carrier:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot16.png" alt="shot1" width="750" height="708" class="aligncenter size-full wp-image-6961 imgborder" />

As you can see, none are available. (Sigh.) You can switch to SIM-free of course (and I checked, my HTC and the 6S+ use the same type of SIM). What bothered me about this form were a couple of issues.

<ul>
<li>First off - you can't use it before 8AM. No, wait, stop laughing, I'm serious. It's a web based system with "open" hours like a retail store. There's probably a data reason for that. I spoke with an Apple rep last week and they mentioned they get new inventory data at 8. I'd like to imagine that Apple stores have some sophisticated real time hook into inventory but that's probably not the case. Still, it is kind of shocking to see a "closed" sign at a web site.
<li>When I was in CA last week, I tried to search around me. Every time you switch stores, the form rebuilds. So if I've selected 6S+ and ATT, I lose those selections. Now, the reason for this makes sense. It is possible that the other store doesn't have 6S+ or ATT available, but it still annoying. That's the kind of problem that intelligent front-end code could handle gracefully. There were 5-6 stores around me in South San Francisco and I checked every day there and those damn drop downs annoyed me every day. (As I said on top though, I'm probably not the target user here.)
<li>Finally, it would have been <i>really</i> nice if I could have simply said, "Tell me when a 6S+ for ATT or SIM-free is available in gray or silver that has 64 GB since 16 is just plain stupid." But apparently Apple isn't having any difficulty selling iPhones so such a system probably isn't a high priority for them. (And to be clear, this is <strong>just</strong> for the upgrade program. Obviously the 'regular' store lets you buy right now.)
</ul>

So - bored this weekend - I did what any self-respecting web dev does - I opened up dev tools while using the form. First thing I noticed was that the app was hitting JSON files to drive the drop downs:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot26.png" alt="shot2" width="750" height="264" class="aligncenter size-full wp-image-6962 imgborder" />

I then opened each of those files and took a look at the JSON. <code>stores.json</code> was a literal listing of all the stores with availability. Here is a snippet:

<pre><code class="language-javascript">"stores" : [ {
    "storeNumber" : "R414",
    "storeName" : "4th Street",
    "storeEnabled" : false,
    "storeState" : "California",
    "sellEdition" : false,
    "storeCity" : "Berkeley"
  }, {
    "storeNumber" : "R177",
    "storeName" : "ABQ Uptown",
    "storeEnabled" : true,
    "storeState" : "New Mexico",
    "sellEdition" : false,
    "storeCity" : "Albuquerque"
  }, {</code></pre>

<code>availability.json</code> was availability data of course. Here is a snippet from it:

<pre><code class="language-javascript">  "R327" : {
    "MKVJ2LL/A" : "NONE",
    "MKQA2LL/A" : "ALL",
    "MKT62LL/A" : "ALL",
    "MKQX2LL/A" : "ALL",
    "MKR92LL/A" : "ALL",
    "MKVV2LL/A" : "NONE",
    "MKW72LL/A" : "NONE",
    "MKRQ2LL/A" : "ALL",
    "MKTM2LL/A" : "NONE",
    "MKQ62LL/A" : "ALL",
    "MKTA2LL/A" : "ALL",
    "MKT72LL/A" : "ALL",
    "MKRR2LL/A" : "ALL",
    "MKV32LL/A" : "NONE",
    "MKVW2LL/A" : "NONE",
    "MKW82LL/A" : "NONE",
    "MKTN2LL/A" : "NONE",
    "MKRE2LL/A" : "ALL",
    "MKR82LL/A" : "ALL",
    "MKWD2LL/A" : "NONE",
    "MKQ72LL/A" : "ALL",
    "MKRC2LL/A" : "ALL",
    "MKVX2LL/A" : "NONE",
    "MKW92LL/A" : "NONE",
    "MKVU2LL/A" : "ALL",
    "MKW62LL/A" : "NONE",
    "MKRF2LL/A" : "ALL",
    "MKUQ2LL/A" : "NONE",
    "MKV22LL/A" : "NONE",
    "MKQY2LL/A" : "ALL",
    "MKTY2LL/A" : "NONE",
    "MKV52LL/A" : "ALL",
    "MKT92LL/A" : "ALL",
    "MKT32LL/A" : "ALL",
    "MKQ82LL/A" : "ALL",
    "timeSlot" : {
      "en_US" : {
        "timeslotTime" : "11:00 AM",
        "contractTimeslotTime" : "11:00 AM"
      }
    },
</code></pre>

The key there is the store and each line item (except for timeSlot) represents a model/color/carrier/size line item. So given that I could get the data (right click in dev tools and open them in a new tab, then save as), I began work on a web app that would let me parse the data my own way. Specifically I wanted a few things:

<ul>
<li>Let me specify a store, and then multiple stores.</li>
<li>Let me specify any model I want.</li>
<li>Let me specify multiple carriers.</li>
</ul>

I also wanted to ignore 16GB, but at the end decided against that. I began working on my own code that would suck in the JSON files (my local copy) and let me parse it myself. I'll show the result first and then talk about the code. And yes - mine is far less pretty than Apple's.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot33.png" alt="shot3" width="750" height="361" class="aligncenter size-full wp-image-6963 imgborder" />

On top you can see a state drop down and store selector. As I said, my initial plan was to provide for adding multiple stores, but I never got around to that. 

Below it you can see the carrier and model selections. Below it is the grid of options. I used CSS (woot) to gray/blur options that weren't available. How did I get the Apple iPhone colors? Did you know Firefox has a color picker builtin to their dev tools?

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot43.png" alt="shot4" width="272" height="73" class="aligncenter size-full wp-image-6964 imgborder" />

The circles on the Apple store actually have nice gradients as you move from the center of the circle to the outside. I just clicked "in the middle-ish" to get a value that looked good to me.

Ok, so let's now get into the code. I began with a simple setup routine:

<pre><code class="language-javascript">$(document).ready(function() {
	console.log("Make it so.");
	
	//load json files
	var storeReq = $.getJSON("data/stores.json");
	var availReq = $.getJSON("data/availability.json");
	$.when(storeReq,availReq).then(function(stores, avail) {
		storeList = stores[0].stores;
		availabilityData = avail[0];
		doStoresForStates();
		doStateDropDowns();
		startUp();		
	});
});</code></pre>

I'll skip <code>doStoresForStates</code>, that simply gives me a root variable keyed by state that includes an array of stores. doStateDropDowns populates the state drop down. As I mentioned, the idea was to make it so you could add multiple stores, but I never got to that.

<pre><code class="language-javascript">function doStateDropDowns() {
	var dds = $(".stateDD");
	//generate the option HTML list, but only once
	if(stateOptionHTML === "") {
		var states = [];
		for(var i=0;i&lt;storeList.length;i++) {
			if(states.indexOf(storeList[i].storeState) === -1) states.push(storeList[i].storeState);
		}
		states.sort();
		var s = "<option value=\"\">-- State --</option>";
		for(var i=0;i&lt;states.length;i++) {
			s += "<option>" + states[i] + "</option>";
		}
		stateOptionHTML = s;
	}
	dds.each(function(index) {
		console.log("doing "+index);
		var options = $("option", this);
		if(options.length === 0) {
			$(this).html(stateOptionHTML);
		}
	});
}</code></pre>

The state drop down has an event listener to respond to changes. The only thing kinda nice here is the use of <code>next("select")</code> to get the drop down next to it.

<pre><code class="language-javascript">function doStores() {
	var selected = $(this).val();
	if(selected === "") return;
	var storeHTML = "<option value=\"\">-- Location --</option>";
	for(var i=0;i<storeData[selected].length;i++) {
		storeHTML += "<option value=\"" + storeData[selected][i].number + "\">" + storeData[selected][i].city + ", " + storeData[selected][i].name + "</option>"; 	
	}
	$(this).next("select").html(storeHTML);
}</code></pre>

Ok, so now came the scary part - building the actual "based on what you select, filter results" stuff. The first issue I ran into was model data. As I said, every model/capacity/color/carrier had a unique ID. I could have typed this all by hand, but instead, I used dev tools:

<pre><code class="language-javascript">var ray = [];$(".form-choice-selector").each(function(idx) {% raw %}{ ray.push($(this).val()); }{% endraw %}); copy(JSON.stringify(ray));</code></pre>

What you are seeing is code I ran in the browser console. It fetched each "cell" of the display, got the value (which was the product id), and then used <code>copy</code> to put it in my clipboard. I could then paste into my code. There are 5 carriers and 2 models, so I had to do this 10 times, but it took all of 1 or 2 minutes so it wasn't a big deal.

The filtering code is a big hot mess. Like, seriously. It seems to work, but I put no warranty on it. Here it is - don't laugh too hard at me.

<pre><code class="language-javascript">function doFilter() {
	//get all locations
	var locations = [];
	var selectedModels = [];
	var selectedCarriers = [];
	
	$(&quot;.locationDD&quot;).each(function(idx) {
		if($(this).val() != '') locations.push($(this).val());
	});
	
	//if no locations, do nothing
	if(locations.length === 0) return;
	
	$(&quot;.modelCB&quot;).each(function(idx) {
		if($(this).is(':checked')) {
			selectedModels.push($(this).val());
		};	
	});

	$(&quot;.carrierCB&quot;).each(function(idx) {
		if($(this).is(':checked')) {
			selectedCarriers.push($(this).val());
		};	
	});
	
	console.log(&quot;Begin to filter. &quot;+JSON.stringify(locations)+&quot; &quot;+JSON.stringify(selectedModels)+&quot; &quot;+JSON.stringify(selectedCarriers));
			
	/*
	logic is: for each color/capacity, determine if ON/OFF
	*/
	for(var i=0;i&lt;capacityData.length;i++) {
		var capacity = capacityData[i];
		for(var j=0;j&lt;colorData.length;j++) {
			var color = colorData[j];
			var models = getModels(capacity, color, selectedCarriers, selectedModels);
			
			console.log(&quot;check &quot;+capacity+&quot; &quot;+color+&quot; models=&quot;+JSON.stringify(models));
			
			var enabled = false;
			
			//did we filter by location?
			if(locations.length &gt; 0) {
				for(var z = 0;z&lt;locations.length;z++) {
					var location = locations[z];
					for(var k=0;k&lt;models.length;k++) {
						//console.log(availabilityData[location][models[k]]);
						if(availabilityData[location][models[k]] === &quot;ALL&quot;) {
							enabled=true;
							break;
						}
					}
				}		
			}
			console.log(&quot;ENABLED&quot;,enabled);
			var cell = $(&quot;.&quot; + color + &quot;.cap&quot; + capacity);
			if(!enabled) {
				cell.addClass(&quot;outofstock&quot;);
			} else {
				cell.removeClass(&quot;outofstock&quot;);				
			}
		}	
	}
}</code></pre>

Basically - I loop over a capacity and color array and then check the availability at each location. (Again, remember I was going to support multiple locations.) <code>getModels</code> is a utility function that parses the model data I gleaned from dev tools. I then simply add in/remove a CSS class to add the nice gray/blur affect. 

That was the front end. In order to keep the application up to date I wrapped the whole thing up in a Node.js app running on <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. All I needed was the ability to suck down the JSON files from Apple on a scheduled basis, and for that I used a cron library I used over at <a href="http://www.coldfusionbloggers.org">ColdFusion Bloggers</a>. Here is the entirety of the app:

<pre><code class="language-javascript">/*eslint-env node*/

var https = require('https');
var fs = require('fs');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


//fire and forget sync method
var sync = function() {
	var writeStream1 = fs.createWriteStream('./public/data/availability.json');
	https.request('https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/availability.json', function(res) {
		res.pipe(writeStream1);
	}).end();

	var writeStream2 = fs.createWriteStream('./public/data/stores.json');
	https.request('https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/stores.json', function(res) {
		res.pipe(writeStream2);
	}).end();
}

var cron = require('cron');
var cronJob = cron.job('* */2 * * *', function() {
	sync();
	console.log('cron job complete');
});
cronJob.start();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});</code></pre>

I don't have any error handling on the sync function so it is brittle as heck, but it gets the job down. I also set it up to hit Apple once ever 2 hours. I figured that was gentle and wouldn't over tax Apple.com. I also built in a route I could use for manual testing, but I removed that when I deployed it up to Bluemix.

You can see it yourself here: <a href="http://applestorechecker.mybluemix.net/">http://applestorechecker.mybluemix.net/</a>. As I said, it is somewhat brittle. I could also add a simple 'data files last updated at X' to the header so you know how fresh the data is. If I weren't being lazy, I could also add the ability for you to register when your desired model/color/carrier/store has product available, but, alas, I'm lazy today. 

Any way, check it out, and let me know if you have any questions!