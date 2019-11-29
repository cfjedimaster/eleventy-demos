---
layout: post
title: "An example of application specific scheduled tasks in ColdFusion"
date: "2015-01-27T16:11:19+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/01/27/an-example-of-application-specific-scheduled-tasks-in-coldfusion
guid: 5593
---

Yesterday I <a href="http://www.raymondcamden.com/2015/01/26/coldfusion-bloggers-migrated-to-node-js">blogged</a> about my migration of <a href="http://www.coldfusionbloggers.org">ColdFusion Bloggers</a> from ColdFusion to Node. During that conversion, I was impressed by how easy it was to set up a scheduled task. (Once I got past the vagaries of the CRON syntax.) I remembered that ColdFusion 10 had added some dramatic improvements to scheduled tasks. You can read a high level review of that here: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/Using+Scheduler">Using Scheduler</a>. While I knew about these improvements, I never actually got around to playing with them. Last night I did - and here's what I found.

<!--more-->

I decided that I would play with two features that were new to scheduled tasks in ColdFusion 10:

<ul>
<li>Application-specific tasks
<li>CFC based tasks (instead of URLs)
</ul>

I built the following Application.cfc as a demo:

<pre><code class="language-javascript">
component {

	this.name = &quot;scheduletests.one&quot;;
	
	public boolean function onApplicationStart() {
		//register my tasks
		cfschedule(action=&quot;update&quot;, task=&quot;FirstTask&quot;, mode=&quot;application&quot;,
		interval=&quot;daily&quot;, eventHandler=&quot;tests.scheduletests.one.taskrunner&quot;,
		startDate=&quot;1/1/1900&quot;, starttime=&quot;13:00&quot; );
		return true; 
	}	

	public boolean function onRequestStart() {
		if(structKeyExists(url, &quot;reinit&quot;)) {
			applicationStop();
			location(url=&quot;./&quot;);	
		}	
		return true;
	}

}
</code></pre>

I used onApplicationStart as my event registration place. Technically it doesn't need to be there, but that made the most sense. I just had to add a quick url "hack" in onRequestStart to give me a quick way to rerun it properly.

Setting the task as application specific was as simple as <code>mode="application"</code>. When you do this, the task still shows up in the ColdFusion Administrator, but if another application uses the <code>LIST</code> feature of cfschedule, it won't see your task. And obviously - two different applications can have the same task name. Here is a screen shot showing how the CF Admin differentiates between the different types of tasks.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/shot1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/shot1.png" alt="shot1" width="800" height="281" class="alignnone size-full wp-image-5594" /></a>

That part was rather simple, but then I found myself fighting the somewhat poorly documented rules for creating tasks. So I wanted a daily task. I forgot, though, that ColdFusion requires a start date for such a task. In my mind it should just start tomorrow if not specified. What's weird is that if you leave off startdate, you don't get an error. Instead, the task was registered as a chained task. I <strong>highly</strong> recommend keeping the CF Admin open as you test creating scheduled tasks from code. If it looks funky in the Admin then you've done something wrong. 

I then tried using a CFC for my scheduled task. At the time I played with it, the docs were very unclear about how to use it. They simply said that the CFC must implement ITaskEventHandler. I did some digging and discovered that this is actually in the CFIDE/scheduler folder. I edited the official docs wiki to include the full path. Here is a bare bones CFC that uses the interface:

<pre><code class="language-javascript">component implements=&quot;CFIDE.scheduler.ITaskEventHandler&quot;  {
	
	public boolean function onTaskStart(Struct context) {
	};
	
    	public void function onTaskEnd(Struct context) {
    	};

	public void function onMisfire(Struct context) {
		
	};
	
	public void function onError(Struct context) {
	};

	public void function execute(Struct context) {
		writelog(&quot;executed #serializejson(context)#&quot;);
	};
	
}</code></pre>

That argument, context, is not documented for the execute method, but is documented for the others. It contains the group (another new feature in ColdFusion 10), the task name, and the mode. As you can guess, this means you could do some code sharing between similar tasks. So you could have tasks like so: petCat, petDog, petDragon, etc, all using the same CFC and simply inspect the name value to determine what to do. That's similar I suppose to using one CFM for N tasks and passing different URL arguments. 

All in all - outside of the weirdness of arguments for defining tasks - I really like this improvement. Anyone using them?