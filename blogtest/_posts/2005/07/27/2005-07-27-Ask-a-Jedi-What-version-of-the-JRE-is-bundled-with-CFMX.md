---
layout: post
title: "Ask a Jedi: What version of the JRE is bundled with CFMX?"
date: "2005-07-27T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/27/Ask-a-Jedi-What-version-of-the-JRE-is-bundled-with-CFMX
guid: 648
---

Dutch Rapley asks:

<blockquote>
What version of the JRE is bundled with ColdFusion MX 7?

Let me be a little more precise. I'm running the Standard Edition, which doesn't include drivers for Oracle. No biggie, I can download the JDBC drivers from <a href="http://www.oracle.com/technology/software/tech/java/sqlj_jdbc/htdocs/jdbc9201.html">Oracle's site</a> and use "Other" when I register my datasources in the CF Admin. When you go to the download site, Oracle prives different drivers/classes depending upon which version of the JDK you have installed. Hence, it's good to know the version of the JRE is bundled with ColdFusion MX 7.
</blockquote>

This is rather easy to find out. Go to your CF Admin, click on System Information, and the JRE will be listed under JVM Details. I'm pretty sure this information will exist in CFMX 6 as well.