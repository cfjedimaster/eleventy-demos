---
layout: post
title: "Broken (cf)windows?"
date: "2009-10-27T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/27/Broken-cfwindows
guid: 3579
---

A reader wrote in to say that this code, which worked fine in ColdFusion 8, now refuses to center in ColdFusion 9:

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt; 

&lt;cfajaximport tags="cfwindow,cfform" /&gt;

&lt;html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"&gt;
&lt;head&gt;
&lt;title&gt;My Test Window&lt;/title&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
&lt;meta http-equiv="Content-Style-Type" content="text/css" /&gt;

&lt;script language="JavaScript"&gt;

loginwin = function(){

      ColdFusion.Window.create('login', 'Account Login', 'login.cfm', {
            modal: true,
            closable: true,
            draggable: true,
            resizable: true,
            center: true,
            initshow: true,
            width: 300,
            height: 150
      })
}

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;a onclick="loginwin();"&gt;Open the window&lt;/a&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I thought perhaps it was the fancy DOCTYPE but removing that didn't help. The most I could guess at was some bug in the code used by the ColdFusion implementation. On a whim, I took a look at the Window object natively:

<code>
ob = ColdFusion.Window.getWindowObject('login')
console.dir(ob)
</code>

Lo and behold, there was a center function. So to correct this issue, you can just do:

<code>
ob = ColdFusion.Window.getWindowObject('login')
ob.center()
</code>