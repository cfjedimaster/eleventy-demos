---
layout: post
title: "Reminder on duping CFCs..."
date: "2006-03-08T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/08/Reminder-on-duping-CFCs
guid: 1141
---

No, I'm not talking stealing from innocent CFCs, but rather about the use of duplicate() on CFC instances. I know I've blogged about it before (although I didn't find it in a quick search), but you must remember to not call duplicate() on a CFC. Here is a Ask a Jedi question I got earlier in the week:
<!--more-->
<blockquote>
It's long and confusing, but have you observed a condition in which you the variable scope inside a component seems to collapse into the callers variable scope...To wit:  (i've been following some of your examples, so bear with me):
I have a StudentDAO, StudentBean, and StudentManager

StudentDAO only has create, read and update

StudentBean establishes the variables.instance scope
via the init() function, and hass all the getters and setters that interact with variables.instance

StudentManager did this:

established an array<br>
populated the array with Duplicate(Beans) from mutiple reads to StudentDAO.
</blockquote>

There was more after this but I stopped reading at the duplicate. Prior to  CFMX 7.01 (it may have been CFMX7), you could duplicate a CFC. What you got, however, was a pale shadow of a real CFC. It may have acted, a bit, like a CFC, but it wasn't. Luckily (and again, I can't remember if it was 7.01 or 7) this has been fixed. By "fixed" I mean you will now get an error if you try to duplicate a CFC. That isn't great, but it is a heck of a lot better than silently failing.

So again - forgive me for repeating myself (hey, just get me started on var scoping!) but I wanted to ensure this was on everyone's radar.

I'll be presenting on CFCs at CFUnited, and this is one of the topics I plan on covering. I have a good 3 hours to kill so I will doing both basic syntax (for those who haven't written any CFCs), and more advanced topics on organization, and tips and tricks. (So for example, if you wanted to duplicate a CFC, what are some ways of doing it.)

That's it for me folks. It's off to the airport in lovely Aspen and time to return to a place where the air isn't quite as thin!