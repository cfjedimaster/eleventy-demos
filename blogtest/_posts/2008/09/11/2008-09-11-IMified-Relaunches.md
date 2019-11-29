---
layout: post
title: "IMified Relaunches"
date: "2008-09-11T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/11/IMified-Relaunches
guid: 3010
---

Via <a href="http://www.corfield.org/blog">Sean</a>, IMified has relaunched their IM integration service as a web based application. More information can be found here: <a href="http://blog.imified.com/index.php/2008/09/11/reintroducing-imified/">(Re)introducing IMified</a>
<!--more-->
Folks may not remember them, but they used to have an event gateway for ColdFusion to handle doing instance messaging work. Their new service is <i>incredibly</i> easier to use now. You simply sign up and then define an IM bot. You can use a bot on their Jabber network (I did cfjeditest@bot.im) as well as working with accounts from AIM, MSN, Yahoo, and GTalk). When you register your bot/application, you define a URL end point. This is a file that will be called whenever someone IMs the account. So let's say you wanted to build an IM bot that returns the current time. How hard is it?

<code>
&lt;cfoutput&gt;#now()#&lt;/cfoutput&gt;
</code>

Yeah, that's real difficult, isn't it? ;) So obviously you can do a bit more. Read the <a href="http://new.imified.com/developers/api">docs</a> for a full explanation, but here are the basics.

Whenever someone IMs your bot, IMified will send to your script a set of values including a unique user key, their message (duh!), and session info including how many times they pinged you and a history of their messages. This allows you to easily do stuff like showing a menu and responding to particular commands.

On the flip side, your server side code can hit IMified for 2 API calls. The first is the ability to get info about the user. This seems to be the same info you get when you right click, get info, on a contact in your favorite IM program. (Adium, right?) The second API call lets you send a message from your bot to a user. You probably wouldn't do that in the script itself, but in a scheduled task or some other file. 

Both of these API calls use a simple POST API. But that wasn't simple enough for me. Here are two UDFs I'm using in my test bot.

<code>
&lt;cffunction name="getUserDetails" output="false" returnType="struct"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfargument name="password" type="string" required="true"&gt;
	&lt;cfargument name="botkey" type="string" required="true"&gt;
	&lt;cfargument name="userkey" type="string" required="true"&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var packet = ""&gt;
	&lt;cfset var s = structNew()&gt;
		
	&lt;cfhttp url="https://www.imified.com/api/bot/" method="post" result="result" username="#arguments.username#" password="#arguments.password#"&gt;

		&lt;cfhttpparam type="formfield" name="botkey" value="#arguments.botkey#"&gt;
		&lt;cfhttpparam type="formfield" name="apimethod" value="getuser"&gt;
		&lt;cfhttpparam type="formfield" name="userkey" value="#arguments.userkey#"&gt;
	&lt;/cfhttp&gt;

	&lt;cfset packet = xmlParse(result.fileContent)&gt;
	
	&lt;cfif structKeyExists(packet, "rsp") and packet.rsp.xmlAttributes.stat is "ok"&gt;
		&lt;cfset s.status = packet.rsp.user.status.xmltext&gt;
		&lt;cfset s.screenname = packet.rsp.user.screenname.xmltext&gt;
		&lt;cfset s.network = packet.rsp.user.network.xmltext&gt;
		&lt;cfset s.created = packet.rsp.user.created.xmltext&gt;
		&lt;cfset s.lastonline = packet.rsp.user.lastonline.xmltext&gt;
		&lt;cfset s.lastcall = packet.rsp.user.lastcall.xmltext&gt;
		&lt;cfreturn s&gt;
	&lt;cfelse&gt;
		&lt;cfthrow message="#packet.rsp.err.xmlAttributes.msg#"&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;cffunction name="sendMessage" output="false" returnType="void"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfargument name="password" type="string" required="true"&gt;
	&lt;cfargument name="botkey" type="string" required="true"&gt;
	&lt;cfargument name="userkey" type="string" required="true"&gt;
	&lt;cfargument name="message" type="string" required="true"&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var packet = ""&gt;

	&lt;cfhttp url="https://www.imified.com/api/bot/" method="post" result="result" username="#arguments.username#" password="#arguments.password#"&gt;

		&lt;cfhttpparam type="formfield" name="botkey" value="#arguments.botkey#"&gt;
		&lt;cfhttpparam type="formfield" name="apimethod" value="send"&gt;
		&lt;cfhttpparam type="formfield" name="userkey" value="#arguments.userkey#"&gt;
		&lt;cfhttpparam type="formfield" name="msg" value="#arguments.message#"&gt;
	&lt;/cfhttp&gt;

	&lt;cfset packet = xmlParse(result.fileContent)&gt;
	
	&lt;cfif packet.rsp.xmlAttributes.stat is "fail"&gt;
		&lt;cfthrow message="#packet.rsp.err.xmlAttributes.msg#"&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

And here is how my bot uses it: (Note I've masked my password and botkey)

<code>
&lt;cftry&gt;
	&lt;cfset info = getUserDetails("ray@camdenfamily.com","isecretelyusephp","xxx", form.userkey)&gt;
	&lt;cfoutput&gt;Hello, #info.screenname#. I see you came from #info.network#. Your last call was #info.lastcall#&lt;/cfoutput&gt;
	&lt;cfset sendMessage("ray@camdenfamily.com","dotnetmakesmeahem", "xxx", form.userkey, "Why did you say #form.msg# to me?")&gt;
	&lt;cfcatch&gt;
		&lt;cfoutput&gt;oops! #cfcatch.message#&lt;/cfoutput&gt;
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

The service is currently in beta, and free. The blog entry says it will be a pay service soon, but a free version will still be offered. I've got to say - Kudos to these guys. They made a system that is so easy even a PHP coder can use it!