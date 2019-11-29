---
layout: post
title: "Status of Disqus updates, and a tool for URL migration"
date: "2014-11-23T10:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2014/11/23/Status-of-Disqus-updates-and-a-tool-for-URL-migration
guid: 5357
---

<p>
Well, I'm disappointed to say the least. I've had good luck with Disqus pretty much everywhere I've used it, but my attempts to migrate my 50K+ comments over have been met with a great amount of difficulty. I'm not giving up, but hopefully my notes here will help others.
</p>
<!--more-->
<p>
I created a tool that read my database and exported comments in the XML format described by Disqus. I built it so it could do a "slice" of blog entries. My first test covered the first three blog entries ever posted and the second test covered the fourth entry plus a thousand more.
</p>

<p>
When I had these imported, and Disqus got them in pretty darn quickly (they warn you it can take 24 hours, but for me it was no more than 5 minutes), I ran into two issues.
</p>

<p>
The first thing I noticed was that comments on my very first blog post did not show up. I looked in the Disqus admin and they were there. Clicking to go to that thread from the admin worked. But they didn't actually load on the page.
</p>

<p>
The second thing I noticed was that my order was wrong on a particular thread. I discovered that my export script had screwed up the time output. Totally my fault. I fixed it and resubmitted the XML. I noticed though that it wasn't updating.
</p>

<p>
So Thursday night I submitted both issues as support problems via the Disqus site. I got a reply around noon on Friday. For the "missing comments" issue I sent them the URL. For the "replacing" issue, their email seemed to imply that you couldn't replace comments. I asked for clarification.
</p>

<p>
In both cases, I replied within minutes of getting their email. I've heard nothing back since then. 
</p>

<p>
So I thought - screw it. I went into the admin and began deleting comments. You can sort by oldest so I knew I was safe to just mass delete the old ones. You can delete 25 at a time. I did this for 6000+ comments. 
</p>

<p>
I resubmitted and... nothing. I seem to be unable to get these comments back in - even though they don't exist. I submitted <i>another</i> help request, but I guess they don't work the weekends. 
</p>

<p>
Ok - so how about another issue? I found that some of my discussion threads had the wrong URL in them. This is because by default, Disqus uses window.location.href for the identifier. Their docs say you should <i>not</i> allow this default to happen, but if you don't know that, don't read carefully, etc, you miss that. I guess that's my fault too, but I really think Disqus should call this out. Heck, you only see this if you go into the JavaScript configuration variables page which is <strong>not</strong> the default. Disqus should really do a better job of pushing this on end users.
</p>

<p>
So luckily they have a URL migration tool. You can submit a CSV file of old URLs to new URLs so they can be migrated. Their docs suggest using their export tool to get the old URLs. That's fine and all but I've got almost 2000 old URLs in the system and guess what? The export can't be used for the import because it is only an old URL. You would have to copy and paste <strong>every URL</strong> so you have a valid CSV file. 
</p>

<p>
Fine. So - I wrote a ColdFusion script to let me do this. You point it to an input file, tell it what to export, and modify a UDF that maps old URLs to new.
</p>

<pre><code class="language-javascript">//change to the file disqus gave you
input = "raymondcamden-2014-11-23T15_12_05.133412-links.csv";
//change to the name you want to use for the new file
output = "new.csv";

//Will be passed the URL. Mod it as you see fit.
function map(s) {
	//fix 2015.raymondcamden etc
	s = replace(s, "2015.raymondcamden.com", "www.raymondcamden.com");
	s = replace(s, "dev2013.raymondcamden.com", "www.raymondcamden.com");
	//change mode=entry
	//this requires a db call
	if(findNoCase("mode=entry", s)) {
		var id = listLast(s, "=");
		var q = queryExecute("select posted from tblblogentries where id = :id", {% raw %}{id:id}{% endraw %}, {% raw %}{datasource:"myblog"}{% endraw %});
		//technically this doesn't take into account date offset, but screw it
		var newurl = "http://www.raymondcamden.com/#year(q.posted)#/#month(q.posted)#/#day(q.posted)#/#id#";
		return newurl;
	}
	//wordpress adds / at the very end
	if(right(s,1) == "/") s = mid(s, 1, len(s)-1);
	return s;
}

myData = fileOpen(expandPath("./#input#"),"read");
myOutput = fileOpen(expandPath("./#output#"),"write");

while(not fileisEOF(myData)) {
	line = fileReadLine(myData);
	newURL = map(line);
	newLine = line & "," & newURL;	
	fileWriteLine(myOutput, newLine);
}
fileClose(myData);
fileClose(myOutput);
writeoutput("Done processing.");
</code></pre>

<p>
I've done this - and submitted the CSV - but while comment imports worked pretty quickly, this seems to be taking longer. Also, Disqus doesn't provide a status for this feature. (They do for importing.)
</p>

<p>
I know I'm a free user, but I'm really disappointed by the support from Disqus. At this point I'd pay to get technical support. I know once the import is done - and now that I've fixed the URL issue - I'll be good - but this delay is very frustrating. 
</p>

<p>
Finally, and I don't think this is really impacting anyone, but I am sorry for regular readers of this blog who may be having issues now!
</p>