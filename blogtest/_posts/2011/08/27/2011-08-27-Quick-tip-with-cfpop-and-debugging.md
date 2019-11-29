---
layout: post
title: "Quick tip with cfpop and debugging"
date: "2011-08-27T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/27/Quick-tip-with-cfpop-and-debugging
guid: 4343
---

I'm working on some code to generate EML files dynamically. My goal is to use cfpop to read messages and provide a quick 'Download' link that will generate an EML file. These files can then be opened in a native desktop client like any other mail. I've got that part working (and will be blogging it soon), but when I went to test against real email, I ran into an interesting issue.

<p/>

For my testing I hit a gmail account. Now - that by itself provides a bit of a problem because cfpop doesn't support SSL. You can get around it with a bit of Java (and forgive me for not citing the person who did this code - when I googled it I found 2-3 solutions from our community).

<p/>

<code>
&lt;cfset javaSystem = createObject("java", "java.lang.System") /&gt;
&lt;cfset jProps = javaSystem.getProperties() /&gt;
&lt;cfset jProps.setProperty("mail.pop3.socketFactory.class", "javax.net.ssl.SSLSocketFactory") /&gt;
&lt;cfset jProps.setproperty("mail.pop3.port",995) /&gt;
&lt;cfset jProps.setProperty("mail.pop3.socketFactory.port", 995) /&gt;
&lt;cfpop action="getAll" name="messages" 
		server="pop.gmail.com" username="bob@camdenfamily.com"
		password="moo"  port="995"&gt;
</code>

<p/>

I ran the code and it worked perfectly. <b>Once.</b> I looked in my browser that had the gmail account open and I could still see the emails there, so I know CF didn't delete anything. I sent the account another email. Ran my CFM - saw it return just the new email - and on a reload the result was blank again. In GMail you have settings for what to do when mail is accessed via POP, but I had configured this to simply leave it as is.

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip164.png" />

<p/>

On a whim, I double checked the docs for cfpop and noticed that it includes a debug attribute. I had a vague recollection of this attribute but never actually used it. I turned it on and noticed something pretty interesting.

<p/>

First off - debug will log all of the POP commands and results. Here is a snippet.

<p/>

<code>
DEBUG: setDebug: JavaMail version 1.4.2
DEBUG: getProvider() returning javax.mail.Provider[STORE,pop3,com.sun.mail.pop3.POP3Store,Sun Microsystems, Inc]
DEBUG POP3: connecting to host "pop.gmail.com", port 995, isSSL false
S: +OK Gpop ready for requests from 76.72.15.75 i1pf10228089yhm.15
C: USER bob@camdenfamily.com
S: +OK send PASS
C: PASS foo
S: +OK Welcome.
C: STAT
S: +OK 1 2108
C: UIDL
</code>

<p>

The STAT command returns the number of messages and the size. I noticed that after I ran cfpop and it read the email, and then I ran it again, I would get:

<p/>

<code>
C: STAT
S: +OK 0 0
C: QUIT
S: +OK Farewell.
</code>

<p/>

This seems to imply that GMail did <i>something</i> to my messages after CFPOP read them. Oddly - in my browser - where I was just looking at the list of messages and not reading anything - still showed all the email as new and unread. When I looked at the commands CFPOP sent in for when it did find a message, all it did was a TOP and a RETR. From my reading of the docs, RETR gets a message, but doesn't do anything else to it. In other words, it's not deleting it for sure.

<p/>

Unfortunately at this point I didn't know what else to do. It was certainly interesting to see all the behind the scenes POP calls with the debug attribute though. I ended up simply signing up for an AOL account. When I tested there (it also needs the SSL hack) it worked perfectly.