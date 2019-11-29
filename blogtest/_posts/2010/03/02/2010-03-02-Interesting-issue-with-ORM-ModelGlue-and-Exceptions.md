---
layout: post
title: "Interesting issue with ORM, Model-Glue, and Exceptions"
date: "2010-03-02T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/02/Interesting-issue-with-ORM-ModelGlue-and-Exceptions
guid: 3738
---

I'm still digging into this so please forgive me if I completely change my mind later on, but I believe I've found something odd going on with ORM, Model-Glue, and Exceptions. I've noticed this for a little while now but didn't really get a chance to dig until today. I had noticed that when I made a simple mistake while working with ORM (almost always a typo on the column), my Model-Glue application would churn for a while and eventually just return a white screen. Back in my logs I noticed this: 

<blockquote>
GC overhead limit exceeded The specific sequence of files included or processed is: C:\projects\parishilton\siteone\www\index.cfm'' "
java.lang.OutOfMemoryError: GC overhead limit exceeded
</blockquote>

If I checked my hibernate log (which I <a href="http://www.rupeshk.org/blog/index.php/2009/07/coldfusion-orm-how-to-log-sql/">encourage you to do right now</a>) I would see a much more clear error mentioning the mistake in my column. But I was curious - why the GC errors? 

I seem to remember something like this from a few months ago - low and behold - I found this <a href="http://groups.google.com/group/model-glue/browse_thread/thread/d59bbf06b8dc0478/ef651da00092c121?lnk=gst&q=trace">thread</a> I had started on the Model-Glue list. It involved exceptions as well. I ensured I had modified my code to not store the exception in the trace, and then I also modified my site's exception template. This is a site still in construction so it was still set to just do a simple dump. On a whim I added a top to it. This is when I noticed something odd.

The exception object contained 3 keys I had never seen before. First was a NextException key. This seemed to be a completely second copy of the exception. Not only that, but I saw it replicated a few times within itself. Also "new" was a ThrowableCount and Throwables key. The ThrowableCount was a number, but Throwables were other exceptions (also with NextExceptions as well).

All in all - the exception was <i>huge</i> and I could begin to see where perhaps the cfdump had caused the out of memory error. 

For now what I'm doing is simply using a TOP="3" in my Model-Glue exception handler. Another possible idea would be to use cfdump's hide argument and ask it to hide nextexception and throwables.

I've asked some folks at Adobe for more information on these keys and will post an update when I hear more.