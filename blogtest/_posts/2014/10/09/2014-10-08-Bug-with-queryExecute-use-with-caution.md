---
layout: post
title: "Bug with queryExecute - use with caution"
date: "2014-10-09T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/10/09/Bug-with-queryExecute-use-with-caution
guid: 5329
---

<p>
One of the nicer features in ColdFusion 11 was the addition of <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/QueryExecute">queryExecute</a>. It lets you run a query from cfscript easier than using the component based system that was added in the past. However, a StackOverflow user discovered an interesting bug with it.
</p>
<!--more-->
<p>
Scott J. posted <a href="http://stackoverflow.com/questions/26254498/how-to-set-debug-output-query-name-using-queryexecute">a question</a> to StackOverflow about something odd he saw in ColdFusion's debugging output when he used queryExecute. Imagine the following simple call:
</p>

<code>data = queryExecute("select * from tblblogentries limit 0,1", {% raw %}{}, {datasource:"myblog"}{% endraw %});</code>

<p>
If you turn on ColdFusion Debugging, you would expect to see "data" as a query. Instead he saw this:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot114.png" />
</p>

<p>
It looks like ColdFusion is assigning a temporary variable to the query before returning it to the variable you specify. If you run multiple queryExecute calls they use the same variable. If you use a tag-based query it works correctly. If you remember, the debug templates are simply ColdFusion files. I checked in there to ensure there wasn't a bug, but as far as I can see, it is working right.
</p>

<p>
Also, for fun, I did: <code>_queryname_var0 = 9;</code> and yep - it gets overwritten. Oddly it won't exist in the Variables scope, but if you use it as a variable and then run queryExecute, it gets removed completely. I wouldn't go so far as to say queryExecute is unsafe to use, but, you may want to ensure you are not using a variable with the same name. It also makes debugging a bit more difficult as you will have multiple items in the report with the same name. 
</p>

<p>
I've filed a bug report: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3836702">https://bugbase.adobe.com/index.cfm?event=bug&id=3836702</a>
</p>