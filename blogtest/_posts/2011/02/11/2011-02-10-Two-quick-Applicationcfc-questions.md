---
layout: post
title: "Two quick Application.cfc questions"
date: "2011-02-11T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/11/Two-quick-Applicationcfc-questions
guid: 4118
---

This week I got two simple Application.cfc questions that I thought would be interesting to write up. The first one is from Gary and asks:
<p/>

<blockquote>
In Application.cfc<br/>
&lt;cfset this.name = "MyFancyName" /&gt;<br/>
 <br/>
There is also:<br/>
&lt;cfset application.name = "MyFancyName" /&gt;<br/>
 <br/>
What is the difference?
</blockquote>
<!--more-->
<p>

Inside the Application.cfc there is a difference between what you set in the This scope versus what you set in the Application scope. The This scope, within Application.cfc, is used to setup and configure the application. Therefore, when you set this.name = "whatever", you are naming the Application globally across the server. Application.name, however, is nothing special. It is simply a value within the Application scope and does not have any impact on the <i>behavior</i> of the application itself.

<p>

Not to make things confusing - but when you name your application, ColdFusion copies the name to the Application scope in a key called applicationname. So given the pseudo-code above, if you dump the Application scope you would see name and applicationname as values.  

<p>

Now for the second question. Ken asked:

<p>

<blockquote>
I'm calling an application via cfmodule but I can't get it to use the application.cfc page.
The structure is as follows:<br/>
<br/>
webroot  (folder)<br/>
index.cfm<br/>
<br/>
myapp  (folder {% raw %}{under web root folder}{% endraw %})<br/>
application.cfc<br/>
default.cfm<br/>
<br/>
index.cfm code as follows<br/>
cfmodule template="myapp/default.cfm" lhn="1"<br/>
<br/>
In the application.cfc file I have session variables, one of which is lhn which I want to assign the value passed in the cfmodule tag.<br/>
<br/>
But it does not seem to use the application.cfc file and thus no session exists.
</blockquote>

<p>

Good question. It all comes down to the question of - when is Application.cfc/cfm run? The answer is only for <b>network</b> requests. In order for an Application.cfc to fire there must have been a network request to a resource. cfmodule (or cfinclude) will not execute a network request and therefore not execute the Application.cfc file. I hate to say it - and as soon as I type it I'm going to regret it - but you may consider using a cfhttp call to your other application to fetch the data you need. Or - update your custom tag to support running in a "non-initialized" form. Ie, the custom tag could handle noticing it doesn't have Application variables it needs and can handle setting it up itself - possibly within a subkey so as to not overwrite things in the <i>current</i> application. It could possibly also make use of the Server scope, which could be a handy way to handle App to App communication on a box.