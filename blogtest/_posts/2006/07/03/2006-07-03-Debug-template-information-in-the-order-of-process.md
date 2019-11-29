---
layout: post
title: "Debug template information in the order of process"
date: "2006-07-03T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/03/Debug-template-information-in-the-order-of-process
guid: 1372
---

Wow, that title is really, really bad. So, my friend Zoid asked me today how to get the ColdFusion debugger to report both a) all the files executed (i.e., report each file each time), and b) the order of execution for the templates.

By default, your debugger will be set to classic.cfm and the "Summary" view for template execution times. This means that the table of templates is both summarized (you see a total for how many times an execution ran) and sorted by slowest template first. 

What I did was modify classic.cfm to show a second table. This table shows every template executed in the current request. So if you have code like this:

<code>
&lt;cfloop index="x" from="1" to="4"&gt;
	&lt;cf_test&gt;
&lt;/cfloop&gt;
</code>

You will see 5 lines (one for the main template, and 4 lines for test.cfm). You will see the execution time for each instance, as well as the "Caller" value, if any. The caller being who executed the custom tag call. 

It is not typically a good idea to "play" with these system files (like the debugger), but Adobe left them unencrypted so that we could. So what I did was copy classic.cfm to zoid.cfm. You can find classic.cfm in cfinstall/wwwroot/WEB-INF/debug. I made my code mods and returned to the ColdFusion administrator, Debugging Settings, and selected zoid.cfm as my debugging template.

Once set up correctly, you will see 2 tables of template information.

As always, let me know if you find this useful. Just to be clear - I copied classic.cfm, which was written by Adobe, so the normal copyright applies, blah blah blah.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fzoid%2Ezip'>Download attached file.</a></p>