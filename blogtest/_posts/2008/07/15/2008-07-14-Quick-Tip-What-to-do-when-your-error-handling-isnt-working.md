---
layout: post
title: "Quick Tip: What to do when your error handling isn't working?"
date: "2008-07-15T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/15/Quick-Tip-What-to-do-when-your-error-handling-isnt-working
guid: 2934
---

Two quick things you should check when your error handling isn't working right.

1) Make sure your error handler doesn't have a bug itself. A good example of this is an error handler that sends a report to application.adminEmail. If your error occurs in application startup, before application.adminEmail is set, then it is no surprise that your error handler would fail as well. <b>Suggestion:</b> Make your error handler as simple as possible. Just a "Something is wrong" text message. If that helps, then the error is in your error handler.

2) ColdFusion's error handler won't handle syntax errors like so: &lt;cfsearch collection="cfdocs" criteria="cfabort and name="res"&gt;. Notice that the criteria attribute doesn't properly end? <b>Suggestion:</b> Look at the error message. It may look something like this: Invalid token " found on line 2 at column 62. The invalid token is a hint. Also try just using your IDE. CFEclipse's synax checker isn't perfect, but many times it does flag a syntax error and I just don't notice it.