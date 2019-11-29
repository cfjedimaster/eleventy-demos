---
layout: post
title: "Having issues with your BlazeDS/Flex app? Try changing the display-name"
date: "2009-01-05T17:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2009/01/05/Having-issues-with-your-BlazeDSFlex-app-Try-changing-the-displayname
guid: 3177
---

For days now (well, days in man hours, today is my first day back from vacation), I've been struggling with an issue concerning Flex and BlazeDS. Specifically an issue with the Flex front end receiving messages being sent by BlazeDS. I finally found the answer today, but before I go on, please note I'm a bit fuzzy on the details here - all I know is that it worked and I'm about as freaking relieved as a developer can get.
<!--more-->
Ok, so I as said, the issue involved the use of BlazeDS and an Flex based AIR application. This is for <a href="http://www.broadchoice.com">work</a> obviously so you also know that JBoss is running on the back end. For some reason, JBoss has refused to log any errors for me. I can get all kinds of nice console messages, but stack traces and other errors simply go into the void. So while I was sure there was a server side error, I was never ever to actually see it.

I then found this <a href="http://www.adobeforums.com/webx/.59b6c1a9">post</a>, and Alex Glosband's suggestion for adding Service.Message.JMS to my services-config.xml file. This helped in that I could now see that when Flex tries to listen to BlazeDS, it was getting an error from the server. Unfortunately, the error was an NPE with no detail as to what was actually wrong. It did confirm though that the error was server side.

After getting a bit desperate, I tried a new search, this time including some of the result I was seeing in my console. My full search term was: jms destination null flex blazeds "There was an unhandled failure on the server. java.lang.NullPointerException"

This returned exactly two results, both on the Adobe forums. Unfortunately, when I clicked on one, I got a JavaScript alert:

<blockquote>
<p>
ERROR: Sorry, you do not have permissions to access the requested object.
</p>
</blockquote>

I was then pushed away from the thread. On a whim I thought - let me just disable JavaScript. There is no way that will work. Surprisingly, it does. (<b>Folks, using JavaScript for security is not security.</b>) I don't know if that is considered a hack or not, but the message post revealed something interesting. It mentioned the display-name value in web.xml. It suggested that if something else was using the same name, you could have a conflict. On a whim I edited the name, restarted, and <b>bam</b>, things began to work!

Long story short: If you are working with BlazeDS and finding that things don't seem to work, ensure you have a unique name in your web.xml file. I have <i>zero</i> idea what else is running on my box that could be using that value, but, I don't care. It works!