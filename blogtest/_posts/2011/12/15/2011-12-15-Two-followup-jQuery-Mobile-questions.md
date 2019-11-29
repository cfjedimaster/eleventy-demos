---
layout: post
title: "Two followup jQuery Mobile questions"
date: "2011-12-15T12:12:00+06:00"
categories: [jquery,mobile]
tags: []
banner_image: 
permalink: /2011/12/15/Two-followup-jQuery-Mobile-questions
guid: 4463
---

An attendee from my <a href="http://www.raymondcamden.com/index.cfm/2011/12/15/Recording-and-Slides-from-jQuery-Mobile-presentation">jQuery Mobile presentation</a> yesterday had some followup questions that I thought would be good to share with everyone. These kind of fall into the part tech/part opinion area so please feel free to argue with me.

Her first question is:

<blockquote>
When developing a mobile website where the user submits data to the server, is it good practice to incorporate a "local storage" capabilities within the code in case the user's connection to the internet is temporarily lost?
</blockquote>

I think the answer is - mostly yes. If you are building a jQuery Mobile web site that will be used via the mobile browser, then chances are the user is online already and will probably stay online. Having the form submit notice the user being offline on submission would be handy. Since the interruption is probably temporary thought I don't know if you need to store it. You could just handle it nicely and tell the user to try submitting again.

I think that's different than building an <i>entire</i> site that has some form off offline support. If you go that route, than you would definitely want to handle that for most forms. (Again, I won't say all forms. You wouldn't bother doing it for a search form for example.)

A simple solution may be to simply copy <i>all</i> form data to localStorage on form submit. If the form goes through, clear it out, if not, it stays in there and you can prefill the values on next visit.

Now for her next question:

<blockquote>
 I'm a .NET Developer and alot of the HTML elements require runat="server". I noticed you use ColdFusion. Can jquery mobile pages be created to work within the .NET framework, Ruby, and other programming languages?
</blockquote>

Absolutely. At the end of the day, you are outputting HTML. Whether you use ColdFusion, PHP, or whatever, if you output HTML to the browser, then jQuery Mobile is going to be able to work with it. Now - I don't personally know a lot about .Net's runat stuff. It may be difficult to get that to output in the right format for jQuery Mobile, but at a high level, how you create your HTML should not matter. (So get those old Perl CGIs out if you want! :)