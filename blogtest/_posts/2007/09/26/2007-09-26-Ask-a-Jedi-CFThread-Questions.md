---
layout: post
title: "Ask a Jedi: CFThread Questions"
date: "2007-09-26T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/26/Ask-a-Jedi-CFThread-Questions
guid: 2372
---

Nathan Smith sent me some good questions on CFThread. I've broken up his email and bit and have commented with my opinions. I'd like to know what others think as well. CFThread is brand new to the language. Just like we are <i>still</i> debating the best way to use CFCs, I think we have a long road ahead of us deciding what is 'best practices' for this feature. Anyway - Nathan's email:

<blockquote>
In your blog posts, you mostly are using it to send some time-intensive tasks away from the page thread(user).  This is
done to return "control" to the user faster and make the application appear to run faster. 
</blockquote>

Actually that isn't always true. You <i>can</i> fire off threads and not wait for them to return. This does then result in the user getting a result a lot quicker. (Which you can kind of do in older versions of ColdFusion with the CFFLUSH tag.) You may choose though to wait for your threads to finish. This is done with the JOIN action:

<code>
&lt;cfthread join="list of threads" action="join"&gt;
</code>


<blockquote>
Most of the examples I have seen so far use cfthread to enclose some simple, operation or a single tag.  Is it safe to enclose large blocks of code inside a thread?
</blockquote>

Well I think the answer here is "it depends." I don't think there is any simple answer as to how much code should be inside a cfthread. I'd probably try to keep it small just because there is less chance to screw up (more on that later). 

<blockquote>
I have an application that is basically two parts -
interface and core.  At one point I do a cfexecute on the core, while the user waits.  could I put a cfthread around this type of thing to protect the user from breaking their core-requests and processes?  How do I know if all the stuff
happening in the core will be "thread-safe"?
</blockquote>

Ah and here is where things can get nasty. Let's assume that when a user requests foo.cfm, you fire off a thread and then tell the user 'your process is running.' If the user reloads, what should happen? Should the process run again? If not - then you need some way to track the thread. You can use the Application scope. Before the process runs, check for Application.ImDoingX. If true, then don't run the thread again. Inside your thread you need to set ImDoingX back to false when done. Problem is though - what happens if the process dies and never sets it to false? You may want to also record <i>when</i> the process began and do some kind of sanity check. If it has been running for 30 minutes then you may want to just assume it died. 

This kind of goes back to what I alluded to earlier about less of a chance of screw up. It is <i>very</i> easy to "miss" errors in threads. If you wait for threads to join, you can check the status to see if something went wrong. If you don't wait for the threads to end, then you need another method. Again - the application scope may help you here. You can wrap the code in the thread with a try/catch, and have the catch set a "status" message saying that the process died. 

<blockquote>
I have coldfusion standard which
limits the number of threads to 10.  If I have a process that can run from n-100 threads but usually averages 7-10 is it still beneficial to put the threads in?
</blockquote>

Sure. If your code needs more than 10, than the other ones will just wait. You probably want to monitor/log your code a bit and see how well it runs. See for example how often you go over 10.

<blockquote>
How about inter-thread communication.  Can I have a page show the status of other threads by having them send info back to the page thread.  Say the % of completion for 3 different queues or something like that?
</blockquote>

Yes you can - again though you need to use the Application scope (or session/server) to store the status messages. I can probably whip up a small demo of this later today.

If I can leave off with a few bits of advice (and probably repeating myself a bit here):


<ul>
<li>Definitely be sure you notice errors in the threads. If you don't join, then be sure to log/update Application scope so that you know an exception occurred in thread. This has bitten me in the rear before.
<li>Definitely monitor how often your threads fire, how many, etc. Because things get "hidden" with threads, it's easy to overload/abuse/go crazy with how many are running. The server does put a limit on the total # of threads, but try to keep a handle on what you are doing. 
<li>All in all - just tread carefully.
</ul>