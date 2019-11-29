---
layout: post
title: "Script based query issue to watch out for (and a fix!)"
date: "2011-08-12T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/12/Script-based-query-issue-to-watch-out-for-and-a-fix
guid: 4324
---

Credit for this find goes to Andrew Scott and his blog entry <a href="http://www.andyscott.id.au/2011/8/11/Tip-using-ColdFusion-query-in-cfscript-and-something-to-watch-out-for">here</a>. Essentially, he noticed that when using line breaks in a script based query along with bound parameters, he would get an error. Like so:

<p>

<code>
queryService = new query(); 
queryService.setDatasource("cfartgallery");
queryService.setSQL("
	select artid, artname
	from art
 	where mediaid =:mediaid
	order by artid
");
queryService.addParam(name="mediaid", value=1, cfsqltype="CF_SQL_BIT");
result = queryService.execute();
&lt;/cfscript&gt;
</code>

<p>

I wasn't able to replicate this until he pointed out that my test version had spaces in front of each line, not tabs. As soon as I switched to tabs, I got the error as well.

<p>

I reminded Andrew that the script based components are <b>not</b> encrypted. That means you can dig into the code and see what's going on. Out of all the script based components, the query one is probably the most complex. It does a lot of parsing on the SQL string. In there I found the bug. Part of the code that parses the string didn't check for tabs along with other white space.

<p>

I've written a fix for this and sent it along to ColdFusion Engineering. I've attached the CFC to this blog entry, <b>but I'd recommend simply using spaces instead of tabs</b>. No need to patch your server to be different from release for something so small.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fquery1%{% endraw %}2Ezip'>Download attached file.</a></p>