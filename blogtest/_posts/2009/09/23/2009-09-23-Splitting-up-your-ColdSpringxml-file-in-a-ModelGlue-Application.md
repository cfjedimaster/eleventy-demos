---
layout: post
title: "Splitting up your ColdSpring.xml file in a Model-Glue Application"
date: "2009-09-23T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/23/Splitting-up-your-ColdSpringxml-file-in-a-ModelGlue-Application
guid: 3538
---

While I've used <a href="http://www.model-glue.com">Model-Glue</a> for many years now, I've only recently begun to seriously drink the <a href="http://www.coldspringframework.org">ColdSpring</a> kool-aid. The more I use ColdSpring, the more I appreciate how well it works with Model-Glue. I'm writing up some recommendations for Model-Glue application design, and one of the things that occurred to me is that while I typically recommend breaking up the ModelGlue.xml file into multiple files, it might also make sense to break up the ColdSpring.xml file. Right now this file contains the settings for your Model-Glue application (reload, debug, etc) <b>and</b> any custom beans you want defined. 

So I spoke with <a href="http://www.boyzoid.com">Scott Stroz</a> about this and he clued me in to the fact that this is actually already possible! So big thanks to him for teaching me this tip, and hopefully it will help others as well.
<!--more-->
To begin, create your custom beans.xml file. I'd keep it in config with the rest of the config files. Remember, this is the file that will store all the beans for your application. Your ColdSpring.xml file will only be used to configure the Model-Glue settings for the application.

Next, you create a new instance of ColdSpring and store it within the Application scope. I modified the Model-Glue default Application.cfc like so:

<code>
&lt;cffunction name="onApplicationStart" output="false"&gt;
	&lt;cfset application.cs = createObject("component", "coldspring.beans.DefaultXmlBeanFactory").init()&gt;
	&lt;cfset application.cs.loadBeansFromXmlFile("/mgtest/config/beans.xml", true)&gt;
&lt;/cffunction&gt;
</code>

Ok, one last step. When it comes to working with ColdSpring, there is a setting you can override in the main index.cfm file:

<code>
&lt;!---
	**HIERARCHIAL BEAN FACTORY SUPPORT**

	If you'd like to designate a parent bean factory for the one that powers Model-Glue,
	simply do whatever you need to do to set the following value to the parent bean factory 
	instance:
	
	&lt;cfset ModelGlue_PARENT_BEAN_FACTORY = ??? /&gt;
---&gt;
</code>

I never really paid attention to this before, but this is what we need to change. Simply add:

<code>
&lt;cfset ModelGlue_PARENT_BEAN_FACTORY = application.cs /&gt;
</code>

And bam - you're done. My biggest concern was that this wouldn't be as "tied" as when you just use ColdSpring.xml. However, that proved to be completely incorrect. I was able to define beans within my controller just fine:

<code>
&lt;cfcomponent output="false" hint="I am a Model-Glue controller." extends="ModelGlue.gesture.controller.Controller" beans="userService"&gt;
</code>

And then use it within a controller mehtod:

<code>
&lt;cfset event.setValue("message", beans.userService.helloWorld())&gt;
</code>

Woot. Thanks Scott, thanks Model-Glue, and thanks ColdSpring.