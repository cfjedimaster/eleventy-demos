---
layout: post
title: "Ask a Jedi: Warning about the End of a Session"
date: "2005-09-30T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/30/Ask-a-Jedi-Warning-about-the-End-of-a-Session
guid: 823
---

Joerg asks:

<blockquote>
I'm working on an app where the users have to login (wow!).
We usually just displayed the login page when a session has ended.
Now I would like to inform the user about his ended session, 
so that he doesn't get just a login page without any information 
although he clicked on a link to a list or something.
I read about onSessionEnd() etc. but I'm still stuck.
</blockquote>

I love questions that have multiple answers, as this one does. So let's talk bout it. First off, the thing to remember about onSessionEnd is that it is CFML code that runs completely behind the scenes. There is no output. The user will never see it occur. So while you can use this event to do various things at the end of the session, you can't use it to alert the user. 

There are a few ways you can handle this. One simple way is to use JavaScript. In JavaScript, it is possible to run a function after a certain time period. This could be done to show an Alert message to the user warning them about their session timing out, and then it could auto-reload the current page which will show the login form. Obviously this only works if you have JavaScript enabled, but since this is merely a convenience for the user, it's not a big huge deal.

The other option is to use some kind of marker on the user. This marker would let you know that the user <i>had</i> been logged in, and then logged out. Obviously you can't use a session variable. You could use a cookie. If you set a cookie with no expiration date, it will last as long as the browser is open. On your logon form, if you see this cookie, you could then present a nice message to the user. This solution isn't perfect either. In theory, the user could hit your site in April, keep his browser open for 20 months, and then hit your site again. One thing you want to remember to do, however, is remove the cookie if you have a Logout type function on your site.