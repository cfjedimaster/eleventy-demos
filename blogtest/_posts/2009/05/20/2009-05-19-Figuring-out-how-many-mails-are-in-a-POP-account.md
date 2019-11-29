---
layout: post
title: "Figuring out how many mails are in a POP account"
date: "2009-05-20T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/20/Figuring-out-how-many-mails-are-in-a-POP-account
guid: 3363
---

<b>Edit 2/20/2013: Be sure to see <a href="http://www.raymondcamden.com/index.cfm/2009/5/20/Figuring-out-how-many-mails-are-in-a-POP-account#c9A1B36D4-F9DF-7D43-03E5BD0F0C755461">Karl's comment!</a></b> I got an interesting question earlier this week. A reader was using cfpop to retrieve email information. They had built a paging system by using getHeadersOnly. This returns a 'slimmer' query where email bodies are not included in the result. He then paged through the query and fetched the bodies 10 at a time. (Do I need to demo that? Let me know and I'll do another blog entry.) This worked fine until the email account got overloaded. Eventually even the "quicker" getHeadersOnly operation was taking forever. He ask - is there some way to get just the total number of messages in a mailbox?
<!--more-->
I double checked the documentation for cfpop and didn't see any particular support for this operation. On a whim I tried the following:

<code>
&lt;cfpop server="Mail.colts.com" action="getHeaderOnly" username="raycamden@colts.com" password="icodephpinthecloset" name="mail"
maxrows=1 startrow=999
&gt;
</code>

This returned:

<b> The start row 999 is greater than the total number of messages 5.</b>

So cfpop definitely was able to get the total number of messages, but I saw no way to get that myself. I could have wrapped the call in a try/catch and parsed the error, but that just felt dirty to me. 

I did some digging into the javax.mail package which ColdFusion uses under the hood for it's mail support. It was a bit confusing at first, but this <a href="http://java.sun.com/developer/JDCTechTips/2002/tt0122.html">article</a> helped a bit and formed the basis for my code. Basically, POP support entails creating a Mail Session (not the same as a ColdFusion session!), a mail store, and finally grabbing the inbox folder. The Folder object contains a method that returns a message count. It took me a good hour or two to figure this out (boy do I appreciate how easy ColdFusion makes things!) but I was able to get it down to a few lines of code:

<code>
&lt;cfset props = createObject("java","java.lang.System").getProperties()&gt;
&lt;cfset msession = createObject("java", "javax.mail.Session")&gt;
&lt;cfset m2 = msession.getDefaultInstance(props)&gt;
&lt;cfset store = m2.getStore("pop3")&gt;
&lt;cfset store.connect("Mail.colts.com","raycamden@colts.com","isecretlywritephp")&gt;
&lt;cfset df = store.getFolder("INBOX")&gt;
&lt;cfset df.open(df.READ_ONLY)&gt;
&lt;cfdump var="#df.getMessageCount()#"&gt;
</code>

The main line you would care about is the connet operation. Note the server, username, and password (yes, it's fake). The df variable is my folder object. You can do more with it then just getting a count obviously, but actually getting mail would be simpler with cfpop. If you actually used this in production you would probably want to turn it into a UDF.