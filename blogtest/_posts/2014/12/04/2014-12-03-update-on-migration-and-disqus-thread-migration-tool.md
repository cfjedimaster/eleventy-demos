---
layout: post
title: "Update on migration and Disqus Thread Migration tool"
date: "2014-12-04T08:43:43+06:00"
categories: [uncategorized]
tags: []
banner_image: 
permalink: /2014/12/04/update-on-migration-and-disqus-thread-migration-tool
guid: 5383
---

Just a quick note on the migration process. I'm still planning on talking about the migration in detail, but I want to wait till I feel confident that most of the bugs are gone and the server is stable. Yesterday my blog crashed pretty quickly after launch with a database connection error. I added the <a href="https://wordpress.org/plugins/wp-super-cache/">SuperCache</a> plugin (which multiple people had recommended) and it seemed to work well, but sometime around 3AM this morning it went down again. Right now I'm thinking that maybe a micro instance (0.6 gig ram) is a bit too small and I should maybe jump up to the next higher level. I'm researching that now. 

Also - I made a small tweak to the script I wrote (and blogged about <a href="http://www.raymondcamden.com/2014/11/23/Status-of-Disqus-updates-and-a-tool-for-URL-migration">here</a>) that helps with Disqus migration issues. My previous script would return one row for every row in the input CSV. Now the code only writes to the new CSV when an actual change has happened. This makes the new CSV quite a bit smaller. I've pasted the code below, but don't forget the map UDF needs to be customized for your needs. Enjoy.

<pre><code class="language-javascript">&lt;cfscript&gt;
//change to the file disqus gave you
input = &quot;dec4.csv&quot;;
//change to the name you want to use for the new file
output = &quot;new4.csv&quot;;

//Will be passed the URL. Mod it as you see fit.
function map(s) {
	//fix 2015.raymondcamden etc
	s = replace(s, &quot;2015.raymondcamden.com&quot;, &quot;www.raymondcamden.com&quot;);
	s = replace(s, &quot;dev2013.raymondcamden.com&quot;, &quot;www.raymondcamden.com&quot;);
	s = replace(s, &quot;ray.camdenfamily.com&quot;, &quot;www.raymondcamden.com&quot;);
	//change mode=entry
	//this requires a db call
	if(findNoCase(&quot;mode=entry&quot;, s)) {
		var id = listLast(s, &quot;=&quot;);
		var q = queryExecute(&quot;select posted from tblblogentries where id = :id&quot;, {% raw %}{id:id}{% endraw %}, {% raw %}{datasource:&quot;myblog&quot;}{% endraw %});
		//technically this doesn't take into account date offset, but screw it
		var newurl = &quot;http://www.raymondcamden.com/#year(q.posted)#/#month(q.posted)#/#day(q.posted)#/#id#&quot;;
		return newurl;
	}
	//wordpress adds / at the very end
	if(right(s,1) == &quot;/&quot;) s = mid(s, 1, len(s)-1);
	//change -- to -
	s = replace(s, &quot;--&quot;, &quot;-&quot;, &quot;all&quot;);
	return s;
}

myData = fileOpen(expandPath(&quot;./#input#&quot;),&quot;read&quot;);
myOutput = fileOpen(expandPath(&quot;./#output#&quot;),&quot;write&quot;);

while(not fileisEOF(myData)) {
	line = fileReadLine(myData);
	newURL = map(line);
	if(newURL != line) {
		newLine = line &amp; &quot;,&quot; &amp; newURL;	
		fileWriteLine(myOutput, newLine);
	}
}
fileClose(myData);
fileClose(myOutput);
writeoutput(&quot;Done processing.&quot;);
&lt;/cfscript&gt;</code></pre>