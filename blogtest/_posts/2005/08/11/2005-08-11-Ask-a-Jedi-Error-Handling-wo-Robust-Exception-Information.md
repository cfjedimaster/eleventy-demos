---
layout: post
title: "Ask a Jedi: Error Handling w/o Robust Exception Information"
date: "2005-08-11T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/11/Ask-a-Jedi-Error-Handling-wo-Robust-Exception-Information
guid: 693
---

Will asks:

<blockquote>
If a ColdFusion hosting service has the "robust error reporting" turned off, is there a way around it?  Without a massive try/catch setup, that is.  Any "cfsetting" or anything?
 
It's tough to debug this message:  Cannot convert "" to a number.     .... when you have NO idea which of 50 function calls it could be!
</blockquote>

Absolutely. The "Enable Robust Exception Information" setting applies to the error you see on the web page itself. This setting should always be turned off on a production server. However, you can still get detailed error information. Simply use the cferror tag in your Application.cfc/cfc file. You can point to a template that simply does: &lt;cfdump var="#error#"&gt;. While it isn't as pretty as the normal exception handler, it does give you all the information you need.