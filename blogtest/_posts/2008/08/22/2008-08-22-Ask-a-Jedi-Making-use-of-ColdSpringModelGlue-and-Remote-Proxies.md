---
layout: post
title: "Ask a Jedi: Making use of ColdSpring/Model-Glue and Remote Proxies"
date: "2008-08-22T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/22/Ask-a-Jedi-Making-use-of-ColdSpringModelGlue-and-Remote-Proxies
guid: 2985
---

Dean asks:

<blockquote>
<p>
I know your big on both Model-Glue and cfajaxproxy, so I thought I would ask for your help using them together. If I have a Model-Glue app that has all of my objects defined and managed using ColdSpring, how would I call one of my service
objects using the cfajaxproxy tag? All of the examples I have seen show calling the CFC's directly, but since my service object requires the injection of my DAO and Gateway objects, the direct call would fail. So I am a little stumped as to what to pass to the cfajaxproxy tag.
</p>
</blockquote>

There are two answers to this (well I'm sure there are more, but two I'll focus on) problem. The simpler way, and the way I've done it in the past, is to not use the CFCs at all. Instead, my AJAX based actions will use normal Model-Glue events. So for example, I may have an event call getBlogEntriesJSON. This event handles broadcasting a message to get the blog entries, and then another method to handle converting the value to JSON. However, I've known for a while that ColdSpring had some support for automatically exposing itself to remote calls so I thought this would be a great opportunity to give it a try.
<!--more-->
I began by creating a vanilla Model-Glue 2 application under webroot. I did this by editing the build.xml file within modelglueapplicationtemplate. This let me simply give the app a name, a base directory, and then right click to run it as an ANT task. I then verified that the application ran correctly. (Yes, even though I had just made a copy of the skeleton application and not touched a lick of code, I always make sure that the basic stuff works first before doing anything else!)

Next I decided on a simple model/service pair that I'd use for the demo. I created a testGateway in my model that had one method:

<code>
&lt;cffunction name="getThings" access="public" returnType="query" output="false"&gt;
	&lt;cfset var q = queryNew("id,name")&gt;
	&lt;cfset var x = ""&gt;

	&lt;cfloop index="x" from="1" to="10"&gt;
		&lt;cfset queryAddRow(q)&gt;
		&lt;cfset querySetCell(q, "id", x)&gt;
		&lt;cfset querySetCell(q, "name", "Name #x#")&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn q&gt;
&lt;/cffunction&gt;
</code>

I then created a service component that would wrap this:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="init" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="gateway" type="any" required="true"&gt;
	&lt;cfset variables.gateway = arguments.gateway&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getThings" access="public" returnType="query" output="false"&gt;
	&lt;cfreturn variables.gateway.getThings()&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

And lastly, I defined them both within my ColdSpring.xml file:

<code>
&lt;bean id="testGateway" class="testcoldspringremote.model.testgateway"&gt;
&lt;/bean&gt;

&lt;bean id="testService" class="testcoldspringremote.model.testservice"&gt;
	&lt;constructor-arg name="gateway"&gt;&lt;ref bean="testGateway"/&gt;&lt;/constructor-arg&gt;		
&lt;/bean&gt;
</code>

This tells ColdSpring about my two components and also tells ColdSpring to create my service by passing in my gateway.

The last step in all of this was to then edit my controller and add a settestService method. Model-Glue supports auto wiring between ColdSpring and the controllers. By simply having setX in my controller, and X as a bean in ColdSpring.xml, I know that on startup, ModelGlue will pass an instance of X to setX. Here is the method in my controller:

<code>
&lt;cffunction name="settestService" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="testService" type="any" required="true"&gt;
	&lt;cfset variables.testService = arguments.testService&gt;
&lt;/cffunction&gt;
</code>

By the way, Model-Glue 3 makes this even easier. You just add beans="..." to your component tag. At this point, I wanted to test my setup. I edited my default home page event to broadcast a call to get things:

<code>
&lt;event-handler name="page.index"&gt;
	&lt;broadcasts&gt;
		&lt;message name="getThings" /&gt;
	&lt;/broadcasts&gt; 
	&lt;results&gt;
		&lt;result do="view.template" /&gt;
	&lt;/results&gt;
	&lt;views&gt;
		&lt;include name="body" template="dspIndex.cfm" /&gt;
	&lt;/views&gt;
&lt;/event-handler&gt;
</code>

And added the proper listener in my controller XML:

<code>
&lt;controller name="MyController" type="testcoldspringremote.controller.Controller"&gt;
	&lt;message-listener message="OnRequestStart" function="OnRequestStart" /&gt;
	&lt;message-listener message="OnQueueComplete" function="OnQueueComplete" /&gt;
	&lt;message-listener message="OnRequestEnd" function="OnRequestEnd" /&gt;
	&lt;message-listener message="getThings" function="getThings" /&gt;
&lt;/controller&gt;
</code>

Next I added the controller method:

<code>
&lt;cffunction name="getThings" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="event" type="any"&gt;
	&lt;cfset arguments.event.setValue("things", variables.testService.getThings())&gt;
&lt;/cffunction&gt;
</code>

The last thing was to edit the view:

<code>
&lt;cfset things = viewState.getValue("things")&gt;
&lt;cfdump var="#things#"&gt;
</code>

Wow, that was a lot of typing. Hopefully you get what I did. Basically, defined my beans in ColdSpring, wrote some dummy logic for them, then had Model-Glue actually make a call to them for my event so I could see, in the browser, the query. Just to prove I'm not crazy, here is the result:

<img src="https://static.raymondcamden.com/images/Picture 119.png">

Alright. My next stop was the <a href="http://www.coldspringframework.org/docs/">ColdSpring docs</a>. From that, it seemed like exposing my beans as remote proxies came down to two basic steps:

1) Define (in XML) where the remote proxy will run and what it will represent<br />
2) Load the bean (ie, make an instance of it) so that a physical file is written out.

If we focus in on the relevant section of the docs (<a href="http://www.coldspringframework.org/docs/Developing_w__ColdSpring.htm#Using_AOP_to_create_remote_proxies">Using AOP to create remote proxies</a>), our first step is to define the remote bean in XML. I won't repeat the docs. Here is what I used:

<code>
&lt;bean id="testServiceRemote" class="coldspring.aop.framework.RemoteFactoryBean"&gt;
	&lt;property name="target"&gt;
		&lt;ref bean="testService" /&gt;
	&lt;/property&gt;
	&lt;property name="serviceName"&gt;
		&lt;value&gt;testService&lt;/value&gt;
	&lt;/property&gt;
	&lt;property name="relativePath"&gt;
		&lt;value&gt;/testcoldspringremote/remote/&lt;/value&gt;
	&lt;/property&gt;
	&lt;property name="remoteMethodNames"&gt;
		&lt;value&gt;get*&lt;/value&gt;
	&lt;/property&gt;
&lt;/bean&gt;
</code>

The only thing that tripped me up was relativePath. ColdSpring will not create the folder for you. I added a remote folder to my application root.

So the second step was to simply create an instance of the bean. So how would I do that? Well Model-Glue controllers can use an init method. You won't see them in the application template, but you can add your own to write application startup code. I added the following to my controller:

<code>
&lt;cffunction name="init" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="ModelGlue" type="any" required="true" hint="I am an instance of ModelGlue."&gt;
	&lt;cfargument name="name" type="string" required="false" default="#createUUID()#" hint="A name for this controller."&gt;
	&lt;cfset var remoteBean = ""&gt;
		
	&lt;cfset super.init(arguments.modelglue,arguments.name)&gt;
	&lt;cfset remoteBean = getModelGlue().getBean("testServiceRemote")&gt;

	&lt;cfreturn this&gt;
&lt;/cffunction&gt;
</code>

There isn't anything too fancy in here really. The getBean method is defined in the Model-Glue docs. It's a pathway to ColdSpring and lets me grab (obviously) my defined beans. I reran my application again, went to the file system, and there it was - a file named testService.cfc.

Ok, so now for the fun part. I immediately tried to run this baby in my browser. I went to:

http://localhost/testcoldspringremote/remote/testService.cfc?method=getThings

and got...

<b>Sorry, a ColdSpring BeanFactory named was not found in application scope. Please make sure your bean factory is properly loaded. Perhapse your main application is not running?</b>

This didn't make sense to me at first, but then it hit me. I wasn't running Model-Glue anymore! I was totally out of the MG context, and since MG had taken care of ColdSpring for me, it wasn't available to this CFC. Luckily this is easily solved. Joe describes the solution in this blog entry: <a href="http://www.firemoss.com/post.cfm/Sharing-MG-ColdSpring-Beans-With-Other-Applications">Sharing MG ColdSpring Beans With Other Applications</a>. You should read the blog entry. Basically, I just need to initialize and setup ColdSpring myself (not a big deal!) and then tell Model-Glue to use the same application variable. I <strike>stole</strike>borrowed the code from Joe's post exactly as he had it, with just the path to the XML file being a bit different.

After all of this, I of course went back to my normal web page, reloaded, and made sure Model-Glue was still cool. It was. (Whew!) I went back to my CFC, reloaded, and got the same error. And then I noticed it...

<b>Sorry, a ColdSpring BeanFactory named was not</b>

Do you see a missing word there? I looked in the error below and saw:

Sorry, a ColdSpring BeanFactory named #variables.beanFactoryName# was not found

So the code was looking for a beanFactoryName. I thought to myself - I bet that's the name of the Application scope variable that contains the factory. But since I didn't generate the service CFC, how do I set it? I couldn't find the solution in the docs, but a Google search found this <a href="http://www.brucephillips.name/blog/index.cfm/2007/12/31/The-Grade-Schoolers-Guide-To-ColdSpring--Part-2-Flex-To-ColdSpring-Connection">blog entry</a> by Bruce Philips. In this blog entry he mentioned a key named, appropriately enough, beanFactoryName. If you add this back in your ColdSpring.xml file, you would then end up with this definition:

<code>
&lt;bean id="testServiceRemote" class="coldspring.aop.framework.RemoteFactoryBean"&gt;
	&lt;property name="target"&gt;
		&lt;ref bean="testService" /&gt;
	&lt;/property&gt;
	&lt;property name="serviceName"&gt;
		&lt;value&gt;testService&lt;/value&gt;
	&lt;/property&gt;
	&lt;property name="relativePath"&gt;
		&lt;value&gt;/testcoldspringremote/remote/&lt;/value&gt;
	&lt;/property&gt;
	&lt;property name="remoteMethodNames"&gt;
		&lt;value&gt;get*&lt;/value&gt;
	&lt;/property&gt;
	&lt;property name="beanFactoryName"&gt;
		&lt;value&gt;sharedBeanFactory&lt;/value&gt;
	&lt;/property&gt;
&lt;/bean&gt;
</code>

I reran everything again, went over to the CFC, and voila - I could hit my CFC! 

Once I got past some of the kinks this worked like a charm, and once again I think we need to give props to both the ColdSpring and Model-Glue team. 

I do have one final note on this. I'm using Model-Glue to init my bean and generate the physical file. I did that because, as I learned about this feature, that was the only way I had of handling "Do this on Application startup." Now that I ended up with actual code in the Application.cfm file, I'd probably move that bean-get call over to that file instead. It's possible that a) the proxy CFC may not exist and b) the first call may be to the remote proxy, not Model-Glue.