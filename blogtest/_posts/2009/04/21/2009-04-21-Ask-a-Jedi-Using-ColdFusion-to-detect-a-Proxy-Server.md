---
layout: post
title: "Ask a Jedi: Using ColdFusion to detect a Proxy Server"
date: "2009-04-21T23:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/21/Ask-a-Jedi-Using-ColdFusion-to-detect-a-Proxy-Server
guid: 3324
---

This week I had a nice (email) conversation with Dave Dugdale. His question was:

<blockquote>
<p>
I would like to detect if someone is using a proxy server when visiting my site. I found a script in PHP but I couldn't find one written in ColdFusion on Google or your site. Have you ever
done one of these?
</p>
</blockquote>

I certainly had not heard of such a beast, but I asked to see his PHP code. I mean, let's be real, anything written in PHP should be easier in ColdFusion, right?
<!--more-->
Dave sent along the PHP code. I'm not sure if this is "good" code or not, but here it is:

<code>
&lt;?php
if (
   $_SERVER['HTTP_X_FORWARDED_FOR']   ||
   $_SERVER['HTTP_X_FORWARDED']   ||
   $_SERVER['HTTP_FORWARDED_FOR']   ||
   $_SERVER['HTTP_CLIENT_IP']   ||
   $_SERVER['HTTP_VIA']   ||
   in_array($_SERVER['REMOTE_PORT'],
   array(8080,80,6588,8000,3128,553,554))   ||
   @fsockopen($_SERVER['REMOTE_ADDR'],
   80, $errno, $errstr, 30)
)

{
exit('Proxy detected');
}
else
// print the IP address on screen
//echo ( getenv('REMOTE_ADDR') .  ' Welcome 1' );
//echo ( $_SERVER['REMOTE_ADDR'] .  ' Welcome 2' );
//echo ( @$REMOTE_ADDR .  ' Welcome 3' );
//echo ( getenv('REMOTE_ADDR') .  ' Welcome 4' );
echo (  ' Welcome 5' );


// start code

// if getenv results in something, proxy detected

?&gt;
</code>

I looked this over. The first thing I told him was that $_SERVER was most likely just a pointer to ColdFusion's CGI scope. Any place he saw that he could just switch it with CGI. For example:

<code>
&lt;cfif cgi.http_x_forwarded_for neq ""&gt;
</code>

You could then simply add the 4 other CGI variables to the CFIF. 

The inArray looks to be a simple "Does this value exist in the array". For that I suggested just using listFindNoCase.

<code>
&lt;cfif listFindNoCase("8080,80,etc",cgi.remote_port)&gt;
</code>

All together, I wrote this up as:

<code>
&lt;cfif	cgi.http_x_forwarded neq ""
or		cgi.http_x_forwarded neq ""
or 		cgi.http_forwarded_for neq ""
or		cgi.http_client_ip neq ""
or		cgi.http_via neq ""
or		listFind("8080,80,6588,8000,3128,553,554", cgi.remote_port)&gt;
Proxy!
&lt;/cfif&gt;
</code>

This seems to work well. But the last clause makes no sense to me or Dave:

<code>
@fsockopen($_SERVER['REMOTE_ADDR'],
   80, $errno, $errstr, 30)
</code>

I'd guess fsockopen is analogous to CFHTTP, but as to what it is checking here, I have no idea. Anyone want to help complete the puzzle?