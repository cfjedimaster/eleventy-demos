---
layout: post
title: "Ask a Jedi: SQL showing up in Verity indexes"
date: "2011-02-12T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/12/Ask-a-Jedi-SQL-showing-up-in-Verity-indexes
guid: 4120
---

Simon asked:

<p/>

<blockquote>
I've noticed in my search results that my SQL is showing in the results. My collection indexes all my cfm pages. Is there a tag I can add to a page to prevent verity indexing the page or is it just a case of putting those sorts of files in a different directory that doesn't get indexed?
</blockquote>

<p/>
<!--more-->
First - you should know that if you are using ColdFusion 9 you really need to be using Solr instead. If this is legacy code or an older version of ColdFusion, then by all means, keep using Verity, but keep in mind that ColdFusion has moved to Solr for supporting search. That being said, what you describe would have happened in Solr as well. 

<p/>

Basically, you told Verity to index your CFM files. Verity (and again, Solr) has no idea what CFML is. Or SQL. Or any other code really. So it ignores your CFML and SQL and possibly even considers it part of your indexed data. That's why normally you don't use <b>file based</b> indexes of your CFML pages. Instead, you either index the data instead or you use a spider to index you CFML pages. A spider acts like Google's search index and hits your CFM pages via HTTP. That way it gets just the results of your pages and not the code itself. Verity under ColdFusion ships with a spider, Solr unfortunately does not. There are solutions for that (like <a href="http://nutch.apache.org/">Nutch</a>), but I've not gotten into that yet.