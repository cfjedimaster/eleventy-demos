---
layout: post
title: "onServerStart and handling a bad startup"
date: "2009-08-19T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/19/onServerStart-and-handling-a-bad-startup
guid: 3495
---

I spoke with Hemant at CFUNITED about onServerStart and what should happen if something goes wrong in the method. Currently if an error occurs, it gets logged, but the server just carries on. I made the argument that the server should stop loading as something has gone wrong. I also made the argument that it should act like onApplicationStart - where if you intentionally return false, the application will not load. 

After speaking with Adam Lehman though, I think he had a good counterpoint. (Oh, and my idea was shut down, so it's not changing in the final release. ;) First, Adam made the point that ColdFusion should always try to start. Fair point. He then made another suggestion which I thought was good. If we check something, like a datasource, and are unable to connect, then it may make more sense to simply use a server variable as a flag. Our applications could then check that flag in onApplicationStart and react accordingly. 

I have to say - I didn't really think I'd make much use of onServerStart, but I think I came up with a pretty good use case. If you host your ColdFusion site on a VPS and want to get a notice when the service restarts (in case you aren't the one doing it!) then this simple example will handle that:

<code>
component {

	public function onServerStart() {
	
		writeLog(file="myserver",text="Server starting up.");
		myMail = new mail(to="ray@camdenfamily.com", from="ray@camdenfamily.com", subject="Server started", body="The server has started. Woot");
		myMail.send();
		
	}

}
</code>

Normally I check the server.log file when I'm worried about my ColdFusion service restarting, but this would be a more in your face type approach.

Does anyone else have any plans for this feature?