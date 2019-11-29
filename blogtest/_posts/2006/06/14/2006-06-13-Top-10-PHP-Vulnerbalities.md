---
layout: post
title: "Top 10 PHP Vulnerbalities (and why ColdFusion developers need to care)"
date: "2006-06-14T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/14/Top-10-PHP-Vulnerbalities
guid: 1332
---

I found an interesting article today via Digg:

<blockquote>
<a href="http://www.sklar.com/page/article/owasp-top-ten">PHP and the OWASP Top Ten Security Vulnerabilities</a>
</blockquote>

So why am I writing about PHP on a ColdFusion blog? Check the link out. It is amazing how similar the issues are to things that I, and others, have tried to teach ColdFusion developers as well. I especially like their top tip, which has been my primary recommendation for years - Unvalidated Parameters. I know I've said this before, but validating input parameters is something that is a) easy and b) done far too less. Go to a few random web sites with parameters in the URL, change them, and see how quickly the site throws an error.
<!--more-->
Tip four talks about escaping HTML input. ColdFusion users can do this with either htmlEditFormat() or htmlCodeFormat(). The author then mentions two other functions. One replaces an array of characters with an array of replacements. You can do that in ColdFusion with replaceList(). The author then mentions a function that removes, not escapes, the html tags. You can do this in ColdFusion with a UDF like <a href="http://www.cflib.org/udf.cfm?ID=12">StripHTML</a>.

Another item I like is 7 - Error Handling Problems. I see <i>far</i> too many ColdFusion web sites where errors are not handled. Folks (and forgive me getting preachy!), it takes 5 seconds to hide errors in ColdFusion. 5 seconds! Note that this isn't the same as <i>handling</i> the error by making it log to a file or send you an email. That takes around 60 seconds. But at a bare minimum you should do what you can to prevent errors from showing on screen. You especially want to ensure that you do <b>not</b> have robust exception information turned on a production machine. This shows enough information in the exception to be of use to a hacker. 

Tip 6 talks about command injection flaws. I really like how the author says that if you are passing user input to the OS, you should ask yourself if this is really necessary. I agree. The cfexecute tag is something you should be very careful with. Also in the tip the author talks about data passed to queries. Obviously in ColdFusion you want to <b>always</b> use <cfqueryparam>.

Anyway - check the <a href="http://www.sklar.com/page/article/owasp-top-ten">article</a> out. It is definitely worth your time. And on a side note - I do kind of like PHP. I think that is the language I'd probably use if not for ColdFusion. If you are bored one day and have never looked at PHP, you should give it a try.