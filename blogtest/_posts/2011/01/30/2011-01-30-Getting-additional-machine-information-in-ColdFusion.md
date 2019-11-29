---
layout: post
title: "Getting additional machine information in ColdFusion"
date: "2011-01-30T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/30/Getting-additional-machine-information-in-ColdFusion
guid: 4100
---

Rey asks:

<p/>

<blockquote>
Hey do you know how I can get the SERVER details information where coldfusion8 is running or any server within our network. I looked at the Server.Variables but that stuff is very basic. I need to get things like CPU type, RAM, Virtual Memory etc...Please help.
</blockquote>
<!--more-->
<p/>

Now in general your code should be as portable as possible and shouldn't care about the machine it's running on. But there are definitely times when you need to know more about the environment your code is running in. Rey is correct that the Server scope provides a bit of this. You can see the operating system name and version along with other tidbits. You can also go down to Java if you want even more data. The java.lang.System object can reveal a <i>lot</i> of data about your system.

<p/>

<code>
&lt;cfset runtime = createObject("java", "java.lang.System")&gt;
&lt;cfset props = runtime.getProperties()&gt;
&lt;cfdump var="#props#"&gt;
&lt;cfset env = runtime.getenv()&gt;
&lt;cfdump var="#env#"&gt;
</code>

<p/>

Run this on your own machine to see what's represented. Most of it should mimic what you see if you click the blue system info link in your ColdFusion admin. What's missing is the amount of RAM. I did some googling but everything I found reflected the amount of total/available RAM for the JVM, not the box itself. Luckily a follower on Twitter, appleseedexm, pointed out another Java interface, <a href="http://download.oracle.com/javase/6/docs/jre/api/management/extension/com/sun/management/OperatingSystemMXBean.html">OperatingSystemMXBean</a>. He pointed out that this doesn't work everywhere, but it worked for me. In order to get an instance of this interface you have to make an instance of a management factory:

<p/>

<code>
&lt;cfset mf = createObject("java", "java.lang.management.ManagementFactory")&gt;
&lt;cfset osbean = mf.getOperatingSystemMXBean()&gt;
&lt;cfoutput&gt;
free physical mem = #osbean.getFreePhysicalMemorySize()#&lt;br/&gt;
total physical mem = #osbean.getTotalPhysicalMemorySize()#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

For my laptop this returned:

<p/>

<blockquote>
free physical mem = 4512501760<br/>
total physical mem = 8519028736
</blockquote>

Hope this helps!