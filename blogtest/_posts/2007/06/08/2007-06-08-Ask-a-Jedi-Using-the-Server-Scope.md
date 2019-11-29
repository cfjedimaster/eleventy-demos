---
layout: post
title: "Ask a Jedi: Using the Server Scope"
date: "2007-06-08T19:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/08/Ask-a-Jedi-Using-the-Server-Scope
guid: 2107
---

Todd had an interesting question regarding the user of the server scope:

<blockquote>
I was thinking that rather than invoking a common employee information cfc object into the application scope (with multiple other applications doing the same thing), it seemed like a good idea to just invoke it into the server scope.

Follow-up question: If this were done and an update was made to the employee.cfc, would that change get overwritten in server memory?
</blockquote>
<!--more-->
Interestingly enough - I can't honestly remember the last time I used the server scope. Maybe because a lot of (almost all of) my development is for applications, and not a complete "dot com", I tend to shy away from the scope as I never know who else may be rummaging around in there. Even if you plan on developing on your own box and serving on a box you own, I'd still be concerned about the possibility of having to share a box with others. (Of course, if the box uses multiple instances of ColdFusion, then it isn't really an issue.)

So at a basic level - I guess this makes sense. Again - if you are sure you are the only one on the box. CFC creation can be a bit slow, so if the multiple applications could all share the same resource, I could see that being helpful. Of course, you want to watch out for possible race conditions.

With this said though - I still feel uneasy about recommending this. Am I an old fuddy duddy or do others agree?

As for his follow up question, if server.foo was an instance of foo.cfc, and you edited foo.cfc, the server instance would <b>not</b> be updated. You would need to create a routine to create it again. Typically I add url "hooks" to my applications that force the recreation of Application-scoped CFCs. There is nothing preventing you from doing the same with server scoped variables.