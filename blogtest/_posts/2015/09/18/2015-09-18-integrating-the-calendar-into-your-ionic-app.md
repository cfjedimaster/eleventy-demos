---
layout: post
title: "Integrating the Calendar into your Ionic App"
date: "2015-09-18T11:50:48+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/18/integrating-the-calendar-into-your-ionic-app
guid: 6783
---

For today's demo, I decided to try something I've been meaning to make time for - integrating with the calendar on the mobile device. Luckily there is a great plugin for this - <a href="https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin">Calendar-PhoneGap-Plugin</a>. This plugin provides all types of hooks into the local calendar including the ability to search and add events. With that plugin in place, I whipped up a quick demo.

<!--more-->

I began by building an application that simply returned events from a list and displayed them as is. Here is the view:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/Simulator-Screen-Shot-Sep-18-2015-11.32.58-AM.png" alt="Simulator Screen Shot Sep 18, 2015, 11.32.58 AM" width="422" height="750" class="aligncenter size-full wp-image-6784 imgborder" />

Let's look at the code behind this. First, the HTML. Since this application is so simple, I'm not using routes and templates.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    &lt;link href=&quot;css/ionic.app.css&quot; rel=&quot;stylesheet&quot;&gt;
    --&gt;

    &lt;!-- ionic/angularjs js --&gt;
    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;!-- cordova script (this will be a 404 during development) --&gt;
    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;!-- your app's js --&gt;
    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/controllers.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/services.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane ng-controller=&quot;MainCtrl&quot;&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Ionic Calendar Demo&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content&gt;
				
				&lt;div class=&quot;card&quot; ng-repeat=&quot;event in events&quot;&gt;
					&lt;div class=&quot;item item-divider&quot;&gt;
						{% raw %}{{event.title}}{% endraw %}
					&lt;/div&gt;					
					&lt;div class=&quot;item item-text-wrap&quot;&gt;
						{% raw %}{{ event.description }}{% endraw %}
						&lt;p/&gt;
						&lt;strong&gt;When: {% raw %}{{ event.date | date:'short' }}{% endraw %}&lt;/strong&gt;
					&lt;/div&gt;
				&lt;/div&gt;
				
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

This should all be fairly boiler plate. I simply loop over the events and create a card UI for each. Now let's look into the controller code.

<pre><code class="language-javascript">angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, Events) {
	
	Events.get().then(function(events) {
		console.log("events", events);	
		$scope.events = events;
	});
	
});</code></pre>

Yep, just call the service and render the events. Trivial. Now let's look at the service.

<pre><code class="language-javascript">angular.module('starter.services', [])

.factory('Events', function($q) {

	var incrementDate = function (date, amount) {
			var tmpDate = new Date(date);
			tmpDate.setDate(tmpDate.getDate() + amount)
			return tmpDate;
	};

	//create fake events, but make it dynamic so they are in the next week
	var fakeEvents = [];
	fakeEvents.push(
		{
			&quot;title&quot;:&quot;Meetup on Ionic&quot;,
			&quot;description&quot;:&quot;We'll talk about beer, not Ionic.&quot;,
			&quot;date&quot;:incrementDate(new Date(), 1)
		}	
	);
	fakeEvents.push(
		{
			&quot;title&quot;:&quot;Meetup on Beer&quot;,
			&quot;description&quot;:&quot;We'll talk about Ionic, not Beer.&quot;,
			&quot;date&quot;:incrementDate(new Date(), 2)
		}	
	);
	fakeEvents.push(
		{
			&quot;title&quot;:&quot;Ray's Birthday Bash&quot;,
			&quot;description&quot;:&quot;Celebrate the awesomeness of Ray&quot;,
			&quot;date&quot;:incrementDate(new Date(), 4)
		}	
	);
	fakeEvents.push(
		{
			&quot;title&quot;:&quot;Code Review&quot;,
			&quot;description&quot;:&quot;Let's tear apart Ray's code.&quot;,
			&quot;date&quot;:incrementDate(new Date(), 5)
		}	
	);
	
	var getEvents = function() {
			var deferred = $q.defer();
			deferred.resolve(fakeEvents);
			return deferred.promise;
	}
	
  return {
		get:getEvents
  };

});</code></pre>

Ok, so this is a bit more complex. I've got a set of fake data that creates four events in the future. The service then returns those fake events. Ok, so let's kick it up a notch. Given that our Calendar plugin can check for events, I'm going to update my code to display if an event has been added to the calendar or not. Here is an example.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/Simulator-Screen-Shot-Sep-18-2015-11.41.36-AM.png" alt="Simulator Screen Shot Sep 18, 2015, 11.41.36 AM" width="422" height="750" class="aligncenter size-full wp-image-6786 imgborder" />

In this screen shot, you can see buttons to add the event to your calendar. Notice that the third event though is recognized as being in the calendar. To make this work, I updated the service call for events to handle checking the calendar. It was a bit complex since each call is asynch, but $q makes it easy to handle that.

<pre><code class="language-javascript">var getEvents = function() {
		var deferred = $q.defer();

		/*
		Logic is:
		For each, see if it exists an event.
		*/
		var promises = [];
		fakeEvents.forEach(function(ev) {
			//add enddate as 1 hour plus
			ev.enddate = incrementHour(ev.date, 1);
			console.log('try to find '+JSON.stringify(ev));
			promises.push($cordovaCalendar.findEvent({
				title:ev.title,
				startDate:ev.date
			}));
		});
		
		$q.all(promises).then(function(results) {
			console.log(&quot;in the all done&quot;);	
			//should be the same len as events
			for(var i=0;i&lt;results.length;i++) {
				fakeEvents[i].status = results[i].length === 1;
			}
			deferred.resolve(fakeEvents);
		});
		
		return deferred.promise;
}</code></pre>

I set a status value on events to represent whether or not the event exists. Back on the display side, I handle this like so:

<pre><code class="language-markup">&lt;p ng-if=&quot;event.status&quot;&gt;This event is added to your calendar already!&lt;/p&gt;
&lt;button ng-if=&quot;!event.status&quot; ng-click=&quot;addEvent(event,$index)&quot; class=&quot;button button-block button-balanced&quot;&gt;Add to Calendar&lt;/button&gt;</code></pre>

Fairly simple, right? Now let's look at the add code. I'll skip the controller code as all it does is call the service and update the scope.

<pre><code class="language-javascript">var addEvent = function(event) {
	var deferred = $q.defer();

	$cordovaCalendar.createEvent({
		title: event.title,
		notes: event.description,
		startDate: event.date,
		endDate:event.enddate
	}).then(function (result) {
		console.log('success');console.dir(result);
		deferred.resolve(1);
	}, function (err) {
		console.log('error');console.dir(err);
		deferred.resolve(0);
	});	
	
	return deferred.promise;

}</code></pre>

And just to prove it works - here is the event I just added:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/Simulator-Screen-Shot-Sep-18-2015-11.46.06-AM.png" alt="Simulator Screen Shot Sep 18, 2015, 11.46.06 AM" width="422" height="750" class="aligncenter size-full wp-image-6787 imgborder" />

I've put the full source code for this demo up on GitHub: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/calendarionic">https://github.com/cfjedimaster/Cordova-Examples/tree/master/calendarionic</a>. I want to give big thanks to Eddy Verbruggen for helping me use his plugin, and for fixing a bug I encountered!