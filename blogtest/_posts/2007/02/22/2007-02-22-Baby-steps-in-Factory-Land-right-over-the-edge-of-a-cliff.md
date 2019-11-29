---
layout: post
title: "Baby steps in Factory Land (right over the edge of a cliff...)"
date: "2007-02-22T18:02:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2007/02/22/Baby-steps-in-Factory-Land-right-over-the-edge-of-a-cliff
guid: 1854
---

So I was really enjoying object factories. They seemed so clean. So cool. So... perfect for helping my applications get a bit simpler to manage. I decided as my first trial attempt at using them I'd work with <a href="http://galleon.riaforge.org">Galleon</a>. Rob Gonda had already done the work for me - I just needed to go over it and ensure it worked with my latest build. (Rob had sent me the files eons ago.)
<!--more-->
For those who haven't looked at Galleon, it is a bit complex. The CFCs include: conference, forum, galleon, message, rank, thread, user, utils. To make matters worse, each of these CFCs needed instances of almost every single other one. message.cfc is a good example. It actually used thread, forum, conference, utils, utils, galleon. Messy. But hey it worked.

So I switched to a simple object factory (again, using Rob's code), where each object was created and had the dependent objects passed in to the constructors. (This is called constructor injection.) Everything worked fine until I reloaded and bam.

CPU shot up to 100%.

RAM usage for jrun.exe went up past 500k.

Life as we know it came to an end.

(Ok that last part may not be accurate.)

Turns out constructor injection has an issue with circular dependencies (see <a href="http://www.pbell.com/index.cfm/2006/11/18/Constructor-vs-Setter-Injection-Constructor-is-Better">Peter Bell's good article</a> on constructor/setter injection). 

Now smarter fellows then me made it clear that this wasn't necessarily an issue with factories but in how I implemented it. Turned out I had runtime logic that went like so:

<code>
Make a message CFC. 
Ok, but I need a forum as well.
Make a forum CFC.
Ok, but I need a thread as well.
Make a thread CFC. 
Ok, but I need a message.
</code>

And in each case I kept making new objects. All in all this was a big huge mess. Let me describe one scenario in general - adding a message. The logic went like so: (and this is actually a simpler version of the real thing)

<code>
Add Message

Get a thread record for the thread that owns this forum, see if read only

If not, add to DB.

Now lets send an email.

I want the email to include thread/forum/conference, so ask each of these CFCs for an instance of the right database records so that it can add a nice label to the email.
</code>

There is definitely a need for a rewrite here. So what to do? <a href="http://www.derekperez.com">Derek Perez</a> (and others) suggested moving to a service layer. Instead of my code speaking to Message.cfc for example, it would speak to a MessageService. Let's rewrite the process above using services and see how it could change.

<code>
messageService.addMsg()

First, call the threadService and see if this thread is read only. No? Cool, go on.

Add the record to database. This is done by Message.cfc. The service orders this.

Now I need to send email. I know I need my nice labels. I'll ask my Thread, Forum, and Conference Services to simply return the labels for these values. Each of those services does - does what? I don't care (I being the Message Service) - they just handle it.
</code>

So I went into all of this looking to make it simpler to create CFCs. I had the problem of: CFC A has N arguments, and I make CFC A in multiple places. When the API changes, I'm all of a sudden screwed if I don't fix all the createObjects. 

I think I can still make use of the objectFactory. Perhaps my Services will call the factory. Since I won't have all the circular dependencies anymore, it may not be necessary.

So what's the plan? Right now I screwed up. I updated Galleon, thought I had tested well, but missed it. So I actually removed the download from RIAForge for now. Obviously that isn't great. So I need to rewrite a good chunk of code I believe. If folks want to help, it would be appreciated - but to be honest I want to at least <i>start</i> this myself. I'm the kind of person who doesn't learn if I don't write it myself, and boy was this a big learning experience.

Comments?