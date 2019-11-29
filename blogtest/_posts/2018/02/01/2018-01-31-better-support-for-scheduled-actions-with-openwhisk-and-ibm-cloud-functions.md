---
layout: post
title: "Better Support for Scheduled Actions with OpenWhisk and IBM Cloud Functions"
date: "2018-02-01"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2018/02/01/better-support-for-scheduled-actions-with-openwhisk-and-ibm-cloud-functions
---

For a while now (certainly for as long as I've been using it), OpenWhisk/IBM Cloud Functions has had one main way to handle "scheduled" action invocations, the [Alarm](https://console.bluemix.net/docs/openwhisk/openwhisk_alarms.html#openwhisk_catalog_alarm) package. In order to this feature you would use the `alarm` feed (part of the alarm package, yes, both share the same name) and specify a CRON string for your schedule. 

That works well. But CRON is... well, CRON is a very powerful and flexible system that looks like it was designed by the same people who created regular expressions. I know I can do anything I want with CRON but I absolutely hate doing everything with it.

The good news is that now there is a better way! The Alarm package has a new feed called `interval`. The `interval` feed takes (among others) a parameter that specifies the number of minutes to wait between calls. So if you want an action to run every hour? 60. Want it to run once a day? 1440. And that's it. The `interval` action also supports an optional `startDate` and `stopDate` parameter to let you specify a particular date range for the trigger. 

So an example, consider this CRON based trigger:

	wsk trigger create periodic \
		--feed /whisk.system/alarms/alarm \
		--param cron "*/2 * * * *" \

The `interval` version of this would be:

	wsk trigger create periodic \
		--feed /whisk.system/alarms/interval \
		--param minutes 2 \

I don't know about you, but that's a heck of a lot easier to understand. Of course, CRON does offer more complex support, so for example, running only on certain days, but frankly I'd rather write a line of JavaScript to exit early than spend an hour trying to get the CRON syntax right and hoping I didn't screw it up.

Also note there is another new feed in this package - `once`. This feed takes an argument named date and will only fire one time. Previously developers used the alarm feed and used the `maxTriggers` parameter with a value of 1. This is now deprecated (and that will be documented shortly) and `once` should be used instead.

I don't think you need to update your existing OpenWhisk actions to change to either of these, but certainly going forward you may want to consider using `interval` instead. 

![Nope](https://static.raymondcamden.com/images/2018/2/cat_regex.jpg)