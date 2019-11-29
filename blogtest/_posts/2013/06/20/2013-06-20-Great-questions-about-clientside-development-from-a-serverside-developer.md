---
layout: post
title: "Great questions about client-side development from a server-side developer"
date: "2013-06-20T18:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/06/20/Great-questions-about-clientside-development-from-a-serverside-developer
guid: 4969
---

This question came in today and I thought it was an excellent one to share with my readers. It is also one of those questions with a <i>lot</i> of different takes so I hope my readers chime in with their own opinions as well. The reader wants to remain anonymous, but I really feel like he is in a similar position as a lot of my other readers as well. So, let's get into it.
<!--more-->
First, some background (that I'm mangling a bit to help keep his anonymity so please excuse any awkwardness).

<blockquote>
12 years in IT.  Started as helpdesk tech, budget cuts inherited systems/server admin, more budget cuts inherited developer position, more budget cuts inherited Adobe Connect Admin and server cluster, even MORE budget cut and absorbed DBA position, but hired helpdesk guy. My organization has around 450 employees spread across the organization and state. So roughly, I'm ...  Systems/Server Admin, Web Developer, DBA and Connect Admin. I consider myself a decent CF and .Net programmer (.net MVC mainly). To clarify I am NOT talking about designing Apps, just websites/web applications.
</blockquote>

While I was in a different role, I was doing roughly the same over the past decade as well. (Although I only used .Net for a little while.) 

Now - the questions:

<blockquote>
The more courses and conferences I go to and the more I learn/read about the need to move my server side websites and applications to more client side with 100% responsiveness  (which to me, means built on a js platform, with a bootstrap framework).  Is this thought process correct?
</blockquote>

Technically you are talking about two very different things. One is about moving to the client side and the second is about responsive design. I'm going to completely ignore the responsive question since it is a bit off topic. Let's carry on though with his next question as it directly relates to the above.

<blockquote>
Is it even possible to 100% replace all the server side CF and .Net code with JS to bring db calls and such client side?  Is it necessary? Or is still having CF/.Net server code ok?  This is my big question....should I start dumping/migrating these technologies and move in a js direction?
</blockquote>

When I began my development career, I was mainly doing simple HTML sites. I started using JavaScript when it was LiveScript. But I quickly discovered that my design skills weren't really up to snuff, and I enjoyed building dynamic sites a lot more. (Back then it was in Perl CGI.) 

I started doing more and more server-side work and leaving the client behind. My only real front-end work was taking a PSD and turning it into a table-based layout. (Yes, I used tables. They worked. Deal with it.) 

It was only a few years back that I turned my attention back to the client-side. If you've followed this blog for many years, then you know what happened next. I spent a <strong>heck</strong> of a lot of time researching and learning about the client-side. When I had left it was an IE6-induced mire of pain and agony. Now it's much better. 

So enough rambling - he asked - is it possible to 100% replace server-side code with client-side code? No. But you can do a <strong>heck</strong> of lot more on the client-side then you could in the past. You still have browser incompatibility issues to be concerned about, but the environment is just so much stronger now. Plus, many of these new sexy tools degrade well. It is no longer a case of, "I can use X if IE6 supports it", but rather, "I can use X because I know that if your browser doesn't support it, I gracefully degrade."

It feels like we went from a dumb-client/smart server playground to a smart(er)-client/smart server system. That's good all around in my opinion. 

You shouldn't be thinking about replacing your server-side code but <i>complementing</i> it. 

<blockquote>
If  js is the way to go (which quoting you and many others it is), what direction do I go? I get overloaded with which structure to use (backbone VS jq mobile VS angular etc).
</blockquote>

JavaScript is one part of the whole. HTML has also come a long way. HTML5 has been hyped out of the yingyang, but it has brought some pretty darn useful, <i>practical</i> features. Finally, CSS is really improving as well. Don't just think of JS, but the whole of client-side development.

So... yeah. You feel overloaded. I do too. I think I've been honest on this blog with my struggles in understanding how to better write JavaScript code. I am a big believer in starting slowly. I really wouldn't be concerned about the JS frameworks out there. They exist. They solve problems. You don't have them yet. You need to learn the syntax. Get the basics under your belt. Trust me - you're going to know when you need something like Backbone or Angular. You're going to run into the same issues you run into the server-side. Where to put your code - how best to reuse code so you aren't violating DRY. You'll (hopefully) have that itch at the back of your brain that says, "I know I can write this code, but something tells me I can do this better."

<blockquote>
I don't know if I am going 100 different directions at once and am being more confusing with each abstract question.
</blockquote>

<img src="https://static.raymondcamden.com/images/mdn-logo-sm1.png" style="float:left;margin-right:10px" /> You aren't alone. There are - currently - more JavaScript libraries than atoms in the universe. (That number may not be 100% accurate - but it probably will be by noon tomorrow.) As I said above - start small and focus in one thing at a time. I'd strongly urge you to consider the <a href="https://developer.mozilla.org/en-US/">Mozilla Developer Network</a>. It covers all aspects of client-side development and is <strong>not</strong> focused on Firefox only (as I thought for a long time). 
 
p.s. Ok, responsive design is important. I feel bad ignoring that aspect of his email, but since it was a bit focused in and his main concerns were at a higher level, I thought it was best to ignore it in the main article. Feel free to chastise me for that in the comments. ;)