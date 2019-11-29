---
layout: post
title: "Ask a Jedi: Accessing Application Variables set in Application.cfc"
date: "2005-08-18T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/18/Ask-a-Jedi-Accessing-Application-Variables-set-in-Applicationcfc
guid: 709
---

Tim asks:

<blockquote>
Question about application.cfc. In my constructor section, I have the standard:

<cfset This.name = "TEST_APP_NAME">
<cfset This.clientmanagement = true>
<cfset This.clientstorage = "TEST_ClientStorage">

My question: How do you reference those variables outside the CFC? Say for example I wanted to refer to the "name" variable set above for some reason. Dumping the Application scope doesnt show those variables. Dumping the "This" scope doesnt work (the This scope doesnt work outside the CFC).
</blockquote>

Turns out Tim had a simple misunderstanding. He followed up his original question saying he was doing this:

<div class="code">This.EmailForErrors = <FONT COLOR=BLUE>"<A HREF="mailto:my@email.com">my@email.com</A>"</FONT>;</div>

His mistake was that he was using the This scope for Application data. The This scope, in terms of Application.cfc, is for Application <i>settings</i>, not data. Basically - remember all the attributes you used to pass to the CFAPPLICATION tag? That's what we're talking about here. The This scope simply turns on or off various features of ColdFusion applications. For Application data, do what you did in the past - use the Application scope.

That being said, how do you go about getting the settings? The name of the application is always available in the application scope using the ApplicationName key:

<div class="code"><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>This app is #application.applicationName#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

The other settins are not <i>directly</i> available. You can, for example, determine if the session scope is turned on using a try/catch statement. There is even a <a href="http://www.cflib.org/udf.cfm?ID=634">UDF</a> for this.

Another thing to remember is - all variables set in the This scope are available from an instance of the component. You can do this:

<div class="code"><FONT COLOR=MAROON>&lt;cfset app = createObject(<FONT COLOR=BLUE>"component"</FONT>, <FONT COLOR=BLUE>"Application"</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#structkeylist(app)#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

The structKeyList will show all members of the This scope. You could then check to see if SessionManagement is turned on, as well as other settings.