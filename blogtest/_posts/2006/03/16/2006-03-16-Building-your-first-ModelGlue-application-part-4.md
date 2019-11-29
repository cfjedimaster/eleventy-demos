---
layout: post
title: "Building your first Model-Glue application (part 4)"
date: "2006-03-16T22:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/16/Building-your-first-ModelGlue-application-part-4
guid: 1156
---

In the <a href="http://ray.camdenfamily.com/index.cfm/2006/3/16/Building-your-first-ModelGlue-application-part-3">last entry</a>, I spent a lot of time of talking about the User model behind the application. While this was important, it actually didn't have a lot to do with Model-Glue. In fact, our application didn't actually use it. Now it's time to correct that. Let's start by examining what will happen when a user logs on. First, notice the action field from our logon form:
<!--more-->
<code>
&lt;form action="#viewstate.getValue("myself")#logonattempt" method="post"&gt;
</code>

I talked about this in my second entry. The viewstate.getValue("myself") acts like a shorthand way of saying "root". All I needed to do was append the name of the event to run. If you tried to logon in the past few days, you would have seen Model-Glue throw an error stating that the event didn't exist. So let's add this to our ModelGlue.xml file.

<code>
    &lt;event-handler name="LogonAttempt"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="authenticate" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="loggedIn" do="Home" /&gt;
      	&lt;result name="notLoggedIn" do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

So what am I doing here? First I broadcast an authenticate method. This call will either return loggedIn or notLoggedIn as an event result. Notice then I check for those event results and fire the Home event or rerun the Logon event. Make sense? Now I need to add a listener for the event. In the same config file, go up to myController and add this new listener:

<code>
      &lt;message-listener message="authenticate" function="authenticate" /&gt;
</code>

Alright, we are halfway there. Now we need to add the method to the controller. Here is the code I used:

<code>
&lt;cffunction name="authenticate" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var username = arguments.event.getValue("username")&gt;
	&lt;cfset var password = arguments.event.getValue("password")&gt;
		
	&lt;cfif variables.userGateway.authenticate(username,password)&gt;
		&lt;cfset session.loggedIn = true&gt;
		&lt;cfset session.userBean = variables.userDAO.read(username)&gt;
		&lt;cfset arguments.event.addResult("loggedin")&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("badlogin", 1)&gt;
		&lt;cfset arguments.event.addResult("notloggedin")&gt;
	&lt;/cfif&gt;
	
&lt;/cffunction&gt;
</code>

The first thing you want to notice is how I get the username and password. Notice I didn't address the form scope. Instead, since Model-Glue merges all input data for me into the event object, I simply use the event.getValue() function. The cool thing about this function is that it works just fine even if the data doesn't exist. It also works if my form switches from POST to GET method. Basically, it just works. I next talk to the gateway CFC I created in the last entry. If the authentication passes, I set a marker in the session variable (the same one I checked in the getAuthenticated method). I also use the DAO CFC to create an instance of the User bean and store that in my session. This will give me access to all the user's values. Where did I get the userGateway and userDAO from? I modified the init() method to load them on startup:

<code>
&lt;cffunction name="Init" access="Public" returnType="Controller" output="false" hint="I build a new SampleController"&gt;
  &lt;cfargument name="ModelGlue" required="true" type="ModelGlue.ModelGlue" /&gt;
  &lt;cfargument name="InstanceName" required="true" type="string" /&gt;
  &lt;cfset super.Init(arguments.ModelGlue) /&gt;

	&lt;!--- Controllers are in the application scope:  Put any application startup code here. ---&gt;
	&lt;cfset variables.userGateway = createObject("component", "model.userGateway").init(getModelGlue().getConfigSetting("dsn"))&gt;
	&lt;cfset variables.userDAO = createObject("component", "model.userDAO").init(getModelGlue().getConfigSetting("dsn"))&gt;

  &lt;cfreturn this /&gt;
&lt;/cffunction&gt;
</code>

The new lines here are the ones creating variables.userGateway and variables.userDAO. In general these are just simple createObject() calls. But notice how I get the DSN setting:

<code>
getModelGlue().getConfigSetting("dsn")
</code>

Where did this value came from? The ModelGlue.xml file has a config setting on top. Normally you use this to define how ModelGlue will work with your application. You can use it to turn off debugging, define caching, etc. You can also add your own values. I've added this to the config block:

<code>
    &lt;!-- Photo Gallery Settings --&gt;
    &lt;setting name="dsn" value="PhotoGallery" /&gt;
</code>

Once I've done that, my Controller can use it as described above. By the way, I mentioned this code in an earlier entry's summary, but it was never actually in the entry. Sorry for the confusion. 

So everything is ready. If you try to logon, you won't get an error. But of course, since the database is empty, you won't ever be able to logon. I've added a username/password combo for "admin" that will let you logon. You can test this <a href="http://pg1.camdenfamily.com">here</a>.

<b>Summary</b>

<ul>
<li>As mentioned above, the last entry focused on the user model, and this entry focused on the Model-Glue hookup to that model.
<li>I first added an event to respond to the logon attempt.
<li>This event called an authenticate method in the controller file.
<li>If you successfully logon, I create a session variable. This same session variable is picked up by the getAuthenticated method which the Home method, and our later methods, will use. 
<li>I added a DSN setting to the config file. The controller uses this when creating my model CFC instances.
<li>All in all, we have now hooked up the view, controller, and model, and hey, isn't that the point! The rest is just details! 
</ul>

By the way, this time I really did include the SQL file in the zip. Our folks ok so far? Am I going too slow, too fast? Skipping over stuff? Let me know!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot3%2Ezip'>Download attached file.</a></p>