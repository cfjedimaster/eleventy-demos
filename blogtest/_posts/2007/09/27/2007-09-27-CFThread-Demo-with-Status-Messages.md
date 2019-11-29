---
layout: post
title: "CFThread Demo with Status Messages"
date: "2007-09-27T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/27/CFThread-Demo-with-Status-Messages
guid: 2374
---

Yesterday I wrote a <a href="http://www.raymondcamden.com/index.cfm/2007/9/26/Ask-a-Jedi-CFThread-Questions">blog entry</a> where I answered various questions about threading. One of the topics I touched on was how you could monitor the status of threads that you aren't waiting around for. I promised a small demo - and at lunch today I whipped one up. It isn't the most elegant example, but hopefully it will help demonstrate the concept. I'll discuss bits of the code, and at the end of the entry will present the entire template for those who want to cut/paste.
<!--more-->
My template begins with a simple 'hook' to let me nuke my data and reset my status:

<code>
&lt;cfif isDefined("url.id")&gt;
	&lt;cfset structClear(application)&gt;
&lt;/cfif&gt;
</code>

Next I set up how many tasks I'll be running, and create some variables to store my information:

<code>
&lt;cfset totalTasks = 4&gt;
&lt;cfparam name="application.tasksRunning" default="#structNew()#"&gt;
&lt;cfparam name="application.tasksDone" default="0"&gt;
</code>

The tasksRunning structure is meant to store what threads are running. This way I don't rerun the same thread. The tasksDone value simply records how many tasks are done.

Now I'm going to loop and create 4 tasks (4 being the value of totalTasks):

<code>
&lt;cfloop index="x" from="1" to="#totalTasks#"&gt;
	&lt;!--- name the task ---&gt;
	&lt;cfset taskName = "Task #x#"&gt;
</code>

I set a name for the task based on the number. Next I'm going to see if I should bother running the task:

<code>
	&lt;cfset needRun = false&gt;
	
	&lt;!--- determine if we need to run ---&gt;
	&lt;cflock scope="application" type="readOnly" timeout="30"&gt;
		&lt;cfif not structKeyExists(application.tasksRunning, taskName)&gt;
			&lt;cfset needRun=true&gt;
		&lt;/cfif&gt;
	&lt;/cflocK&gt;
</code>

I lock the access since it is possible this template may be reloaded multiple times (you will see why later). Now for the actual task:

<code>
	&lt;cfif needRun&gt;
		&lt;cfoutput&gt;&lt;p&gt;I'm starting #taskName#&lt;/p&gt;&lt;/cfoutput&gt;
		&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
			&lt;!--- it's possible someone else started ---&gt;
			&lt;cfif not structKeyExists(application.tasksRunning, taskName)&gt;
				&lt;cfthread name="#taskName#"&gt;
					&lt;!--- sleep 5-15 seconds ---&gt;
					&lt;cfset sleep(randRange(5,15) * 1000)&gt;
					&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
						&lt;cfset application.tasksDone++&gt;
					&lt;/cflock&gt;
				&lt;/cfthread&gt;
				&lt;cfset application.tasksRunning[taskName] = 1&gt;
			&lt;/cfif&gt;
		&lt;/cflock&gt;
	&lt;/cfif&gt;
</code>

Ok a lot here. The first thing I do is output a simple message to screen. This was purely for my debugging. I lock the application scope again and check again. Why? I had checked to see if I needed to run the code in a read lock. It is possible that the value will be true because an earlier request hasn't completed yet. So I check again in the exclusive lock to be <b>extra</b> sure I need to run. 

Next I create my thread. Inside my thread I'll sleep for a random amount of seconds. When the sleep is done, I increment my counter of tasksDone.

Lastly, I set a marker for the task so I know it is running. You will note that I don't remove this marker ever. I didn't want reloads of the script to keep restarting the tasks. The idea is that these tasks run once - period. (Unless I pass url.id, and then we start from nothing.)

Outside of the loop I display my status:

<code>
&lt;cfoutput&gt;
&lt;p&gt;
There are #application.tasksDone# out of #totalTasks#.
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

And then I offer some simple links to make testing easier:

<code>
&lt;cfif application.tasksDone is totalTasks&gt;
&lt;p&gt;
&lt;a href="testi.cfm?id=1"&gt;Start over.&lt;/a&gt;
&lt;/p&gt;
&lt;cfelse&gt;
&lt;p&gt;
&lt;a href="testi.cfm"&gt;Reload.&lt;/a&gt;
&lt;/p&gt;
&lt;/cfif&gt;
</code>

If you run this template, you can reload again and again and watch while the tasks done slowly increase. If you wanted to get Paris-Hiltony, you can do the same checks via Ajax and a progress meter. (I'd promise a demo, but with MAX next week my free time is a bit too tight.)

Here is the complete script:

<code>

&lt;cfif isDefined("url.id")&gt;
	&lt;cfset structClear(application)&gt;
&lt;/cfif&gt;

&lt;cfset totalTasks = 4&gt;
&lt;cfparam name="application.tasksRunning" default="#structNew()#"&gt;
&lt;cfparam name="application.tasksDone" default="0"&gt;

&lt;cfloop index="x" from="1" to="#totalTasks#"&gt;
	&lt;!--- name the task ---&gt;
	&lt;cfset taskName = "Task #x#"&gt;
	&lt;cfset needRun = false&gt;
	
	&lt;!--- determine if we need to run ---&gt;
	&lt;cflock scope="application" type="readOnly" timeout="30"&gt;
		&lt;cfif not structKeyExists(application.tasksRunning, taskName)&gt;
			&lt;cfset needRun=true&gt;
		&lt;/cfif&gt;
	&lt;/cflocK&gt;
	
	&lt;cfif needRun&gt;
		&lt;cfoutput&gt;&lt;p&gt;I'm starting #taskName#&lt;/p&gt;&lt;/cfoutput&gt;
		&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
			&lt;!--- it's possible someone else started ---&gt;
			&lt;cfif not structKeyExists(application.tasksRunning, taskName)&gt;
				&lt;cfthread name="#taskName#"&gt;
					&lt;!--- sleep 5-15 seconds ---&gt;
					&lt;cfset sleep(randRange(5,15) * 1000)&gt;
					&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
						&lt;cfset application.tasksDone++&gt;
					&lt;/cflock&gt;
				&lt;/cfthread&gt;
				&lt;cfset application.tasksRunning[taskName] = 1&gt;
			&lt;/cfif&gt;
		&lt;/cflock&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;	
	
&lt;cfoutput&gt;
&lt;p&gt;
There are #application.tasksDone# out of #totalTasks#.
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;cfif application.tasksDone is totalTasks&gt;
&lt;p&gt;
&lt;a href="testi.cfm?id=1"&gt;Start over.&lt;/a&gt;
&lt;/p&gt;
&lt;cfelse&gt;
&lt;p&gt;
&lt;a href="testi.cfm"&gt;Reload.&lt;/a&gt;
&lt;/p&gt;
&lt;/cfif&gt;
</code>