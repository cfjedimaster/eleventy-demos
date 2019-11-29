---
layout: post
title: "Google Sitemap support for BlogCFC"
date: "2005-09-15T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/15/Google-Sitemap-support-for-BlogCFC
guid: 778
---

This week I added support for <a href="http://www.google.com/webmasters/sitemaps/login?sourceid=gsm&subid=us-et-about2">Google Sitemaps</a> to my blog. While this isn't in the core BlogCFC install yet, I thought I'd share the code in case others wanted to do it. Right now I've just created a new CFM and dropped the code in there. I will most likely move the generation to a CFC method later on. Also note that I was unable to get the sitemap to verify until I "tricked" google. My file name was, let's say, sitemap.cfm. This refused to validate. I saved the output of my file as test.xml, and that validated immidiately. I hunted around and found a few people who asked if the extension would cause problems for Google. On a whim, I resubmitted by sitemap with this url:  http://ray.camdenfamily.com/sitemap.cfm?ext=xml. (Not the real URL.) This was enough to "fool" Google and allow my sitemap to validate. The code is below.

Note - the code belows has MY url in it. You would obviously want to change that. The "real" code in 4.0 won't require that.
<!--more-->
<div class="code"><FONT COLOR=MAROON>&lt;cfsetting enablecfoutputonly=true showdebugoutput=false&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfprocessingdirective pageencoding=<FONT COLOR=BLUE>"utf-8"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset params = structNew()&gt;</FONT><br>
<FONT COLOR=GRAY><I>&lt;!--- Should be good for a while.... ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset params.maxEntries = 99999&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset params.mode = <FONT COLOR=BLUE>"short"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset entries = application.blog.getEntries(params)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset z = getTimeZoneInfo()&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfif not find(<FONT COLOR=BLUE>"-"</FONT>, z.utcHourOffset)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset utcPrefix = <FONT COLOR=BLUE>"-"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset z.utcHourOffset = right(z.utcHourOffset, len(z.utcHourOffset) -1 )&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset utcPrefix = <FONT COLOR=BLUE>"+"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset dateStr = dateFormat(entries.posted[1],<FONT COLOR=BLUE>"yyyy-mm-dd"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset dateStr = dateStr & <FONT COLOR=BLUE>"T"</FONT> & timeFormat(entries.posted[1],<FONT COLOR=BLUE>"HH:mm:ss"</FONT>) & utcPrefix & numberFormat(z.utcHourOffset,<FONT COLOR=BLUE>"00"</FONT>) & <FONT COLOR=BLUE>":00"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfcontent type=<FONT COLOR=BLUE>"text/xml"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>&lt;?xml version=<FONT COLOR=BLUE>"1.0"</FONT> encoding=<FONT COLOR=BLUE>"UTF-8"</FONT>?&gt;<br>
<FONT COLOR=NAVY>&lt;urlset xmlns=<FONT COLOR=BLUE>"<A TARGET="_blank" HREF="http://www.google.com/schemas/sitemap/0.84">http://www.google.com/schemas/sitemap/0.84</A>"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;url&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;loc&gt;</FONT><A TARGET="_blank" HREF="http://ray.camdenfamily.com/">http://ray.camdenfamily.com/</A><FONT COLOR=NAVY>&lt;/loc&gt;</FONT><br>
    &nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;lastmod&gt;</FONT></FONT>#dateStr#<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/lastmod&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;changefreq&gt;hourly&lt;/changefreq&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;priority&gt;</FONT>0.8<FONT COLOR=NAVY>&lt;/priority&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/url&gt;</FONT> <br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT> <br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput query=<FONT COLOR=BLUE>"entries"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset dateStr = dateFormat(posted,<FONT COLOR=BLUE>"yyyy-mm-dd"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset dateStr = dateStr & <FONT COLOR=BLUE>"T"</FONT> & timeFormat(posted,<FONT COLOR=BLUE>"HH:mm:ss"</FONT>) & utcPrefix & numberFormat(z.utcHourOffset,<FONT COLOR=BLUE>"00"</FONT>) & <FONT COLOR=BLUE>":00"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;url&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;loc&gt;</FONT>#xmlFormat(application.blog.makeLink(id))#<FONT COLOR=NAVY>&lt;/loc&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;lastmod&gt;</FONT></FONT>#dateStr#<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/lastmod&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/url&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=NAVY>&lt;/urlset&gt;</FONT> <br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>