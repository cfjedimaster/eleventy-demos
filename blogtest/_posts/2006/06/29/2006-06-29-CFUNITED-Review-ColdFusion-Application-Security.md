---
layout: post
title: "CFUNITED Review: ColdFusion Application Security"
date: "2006-06-29T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/29/CFUNITED-Review-ColdFusion-Application-Security
guid: 1364
---

This session was presented by Adam Lehman. This was easily one of the best presentations I've seen in a long time. Forgive the haphazard list of
notes below but I was writing them down pretty quickly. (And assume all the wisdom below is from him, not me. The notes from me will hopefully be obvious.)

Presentation covered the "Top 10 Critical Web Application Security Vulnerabilities" from from <a href="http://www.owasp.org/index.php/Main_Page">OWASP</a> (Open Web Application Security Project). Here are the top
ten items along with Adam's notes.
<!--more-->
10) Insecure configuration management<br>
Few server products are secure out of the box. Securing the OS is critical.
Establish a baseline that determines how you deploy CF. This is an awesome tip for any organization dealing with a large number of servers. It's also a good idea
for contractors who make a large number of installs for various clients

9) Denial of Service attacks<br>
Keep CF/JRun up to date. Minimize resources used per session. Minimize unnecessary access to the database. While these are performance issues, they also help minimize
DOS attacks. There are hardware solutions for blocking DOS attacks.

8) Insecure storage<br>
Storing passwords in clear text in the database is bad. (Yes, I know I do this myself!) Encrypt where possible.
CF has both encrypt and hash functions you can use. Also, ask yourself if you actually <i>need</i> the sensitive data.

7) Improper error handling<br>
Include useful messages for user. Do not include information that may be useful to an attacker, like the ColdFusion version. (I've blogged many times about this. It takes 2 seconds to hide ColdFusion
errors and there is no reason to not do this.) Basically - keep error message text to the minimum. Do not enable robust exception information. Do not enable debugging. Define a site-wide error handler.  Define application-wide error handlers. Thank you Adam for saying this. It needs to be said more often. 

6) Injection Flaws<br>
This is where a user tries to inject their own code into your application. Think SQL injection. By the way - I had four of these attacks today on my blog. Use sandboxes to limit access to cfexecute, cfregistry, and other OS functions. Limit database permissions in the DSN. Adam talked about CFQUERYPARAM, which my readers know I'm rabid about. 

5) Buffer Overflows<br>
Big on the desktop side. Again - need to keep CF/JRun up to date. This is more at the low level than the code level. 

4) Cross Site Scripting Flaws<br>
This is all about protecting and sanitizing user input.  Enable global script protection. (I have a few issues with this, but it is a good quick fix.) There is an IIS level option called URL scan.

3) Broken Authentication and Session management<br>
Enforce password complexity (even if just a minimum number of characters). Limit invalid login attempts. On a bad logon, don't admit when a username is ok but the password is bad. This helps an attacker by verifying a username. Just tell them the authentication failed. When a user logs on, you can tell them their last logon date and any recent failed attempts. This can help the user know if someone was trying to hack their account. Use SSL for logins. Do not pass session IDs in the URL and use J2EE sessions. 

2) Broken access control<br>
Centralize your security system. 

1) Unvalidated Input<br>
(Amen!) See #4 above. Validate the heck out of stuff. Don't rely on JavaScript validation. Validate from the model all the way up to the view. 

Awesome quote: "There is no such thing as too much security." This should be printed, framed, and placed on the wall in your office. Make security a part of your development. Don't just wait till the end.