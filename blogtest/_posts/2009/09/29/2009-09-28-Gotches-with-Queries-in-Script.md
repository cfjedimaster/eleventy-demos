---
layout: post
title: "Gotches with Queries in Script"
date: "2009-09-29T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/29/Gotches-with-Queries-in-Script
guid: 3545
---

One of the features of ColdFusion 9 that I've haven't used quite a lot yet is the ability to write queries in script. It seems like everything I've done in CF9 database related used ORM. So when I finally had to revert to using a real query (ok, I know Hibernate uses real queries, but you get my meaning here) I ran into a few interesting issues right away. I've hit two issues I think people should be aware of - one serious - one a bit more subtle. First off, a quick shout out to Ben for his <a href="http://www.bennadel.com/index.cfm?dax=blog:1678.view">excellent blog article</a> on the feature in general. I found that quicker than I found any documentation in the "official" docs.
<!--more-->
<h1>Issue One</h1>

The first issue I ran into was a bit surprising. Surprising in that no one else had run into it and reported it yet. When using bound parameters you can either use positional or named parameters in your query. Positional parameters I find to be a bit hard to read. Any complex query with more than a few of these will be difficult to work with (imho), so I almost always use named parameters (well when I say almost always, I mean when I've used script based queries in other languages, like AIR). It also saves you some typing. If you want to search against multiple columns for example, using a named parameter means you only have to specify the parameter once:

<code>
&lt;cfscript&gt;
q = new com.adobe.coldfusion.query();
q.setDatasource("cfartgallery");
q.setSQL("select * from art where artname like :search or description like :search");
q.addParam(name="search",value="{% raw %}%e%{% endraw %}",cfsqltype="cf_sql_varchar");

r = q.execute();

writeDump(r); 
&lt;/cfscript&gt;
</code>

As you can see, I'm searching against both the artname and the description column. This should run fine, right? Unfortunately it doesn't. When executed you get:

<blockquote>
<b>Named Sql parameter 'search' used in the query not found in the queryparams</b>
<br><br>
The SQL specified in the query<br><br>
select * from art where artname like :search or description like :search.
<br><br>
You can use addParam() on the query object to add a queryparams (params by name and/or params by position)
</blockquote>

Well, when I see that, my first reaction is, um, I <i>am</i> using addParam. I did some digging to see if I could find out why this error was thrown. Don't forget that the script support for stuff like query (and mail, etc) is built with simple CFCs. You can find these in the com/adobe/coldfusion folder under your main customtags folder. (Which, by the way, means you shouldn't remove that default custom tag folder!) Luckily Adobe kept these CFCs unencrypted. Turns out that Adobe's code parses the SQL based on your params passed in. These params end up becoming child tags. The arguments used in addParam get passed to cfqueryparam as a structure. Since "name" is not a valid attribute, Adobe "cleaned" the values you passed by removing the name value. My query used the same name twice, so when it tried to replace the second bound parameter, it failed to link it up with the named parameter I sent in. Confusing? Well, I was able to fix it by simply delaying the cleaning until the bound parameters had all been replaced. I shared this with Adobe, but most likely this won't make it into the final release. I've been given permission to share the CFC which I've attached to this blog entry. If you use it, please make a backup of Adobe's code first. As always, I warrant nothing but my ability to get down and boogies hard.

If you feel skittish replacing core Adobe code with mine, you would fix the above query by duplicating the addParam.

<code>
&lt;cfscript&gt;
q = new com.adobe.coldfusion.query();
q.setDatasource("cfartgallery");
q.setSQL("select * from art where artname like :search or description like :search");
q.addParam(name="search",value="{% raw %}%e%{% endraw %}",cfsqltype="cf_sql_varchar");
q.addParam(name="search",value="{% raw %}%e%{% endraw %}",cfsqltype="cf_sql_varchar");

r = q.execute();

writeDump(r); 
&lt;/cfscript&gt;
</code>

<h1>Issue Two</h1>

This one was a doozy. Adobe's code makes use of string parsing to replace your bound parameters with tokens. Unfortunately the parsing can be broken if you use single quotes in your query. Here is an example:

<code>
&lt;cfscript&gt;
q = new com.adobe.coldfusion.query();
q.setDatasource("cfartgallery");
q.setSQL("select * from art where artname = '' or description like :search");
q.addParam(name="search",value="{% raw %}%e%{% endraw %}",cfsqltype="cf_sql_varchar");

r = q.execute();

writeDump(r); 
&lt;/cfscript&gt;
</code>

See the first part of the where clause? The combination of this plus the bound parameter after it trips up the components and throws an error. The issue only seems to occur if you combine the single quote clause with a bound parameter. I didn't have time to try to fix the code here as the workaround is pretty easy:

<code>
q.setSQL("select * from art where artname = :blank or description like :search");
q.addParam(name="blank",value="",cfsqltype="cf_sql_varchar");
q.addParam(name="search",value="{% raw %}%e%{% endraw %}",cfsqltype="cf_sql_varchar");
</code>

Anyway, watch out folks. If people continue to run into issues, please work with me and we can keep the modified query.cfc updated. I'm sure Adobe would appreciate that!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fquery%{% endraw %}2Ezip'>Download attached file.</a></p>