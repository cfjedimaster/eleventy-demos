---
layout: post
title: "ColdFusion Logs to RSS (with a quick sidetrack into zombies)"
date: "2009-03-28T19:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/28/ColdFusion-Logs-to-RSS-with-a-quick-sidetrack-into-zombies
guid: 3295
---

A reader on Friday asked a pretty cool question:

<blockquote>
<p>
I really haven't looked into this, but was hoping that someone had already thought of it: I'd like to take a ColdFusion log file (like app.log) and transform to an RSS feed. Any kind of weird parsing that goes on there? I would assume you'd have to convert the log file to some sort of structure... Text Transformation is certainly not my strong suit, maybe one of the reasons I failed that perl class in college.
</p>
</blockquote>

Didn't the designers of Perl <i>want</i> folks to fail? No? Ok, moving on. So I thought this was a great idea. RSS is a great way to receive updates, and monitoring a log file via RSS could be an awesome way to keep up on things... just as long as the log file isn't going crazy with updates.
<!--more-->
So let's take a quick look at how you can accomplish this. The task really isn't that difficult. We need to:

a) Read the log file (easy!)<br/>
b) Parse the string (kinda easy!)<br/ >
c) Convert the string into a query object (not so tough!)<br/>
d) Convert the query into RSS (simple with CFFEED!)<br/>

One at a time, here we go.

<code>
&lt;cfinclude template="udf.cfm"&gt;

&lt;!--- log file ---&gt;
&lt;cfset logfile = "/Applications/ColdFusion8/logs/application.log"&gt;

&lt;cfif not fileExists(logfile)&gt;
	&lt;cfoutput&gt;Log file "#logfile#" does not exist.&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

I begin by including a UDF library, which in this case is one UDF, <a href="http://www.cflib.org/udf/CSVtoArray">CSVtoArray</a>. I define my log file with a hard coded pointer to the file I want to parse and my local CF install. (Yes, there is a <a href="http://www.raymondcamden.com/index.cfm/2009/2/11/Determining-the-location-of-ColdFusions-log-files">way</a> to find that path dynamically.) I then do a quick sanity check to ensure the file actually exists. Moving on...

<code>
&lt;!--- our data, in line form ---&gt;
&lt;cfset lines = []&gt;

&lt;!--- flag to let us ignore the first line ---&gt;
&lt;cfset doneOne = false&gt;
&lt;cfloop index="l" file="#logfile#"&gt;
	&lt;cfif doneOne&gt;
		&lt;cfset arrayAppend(lines, l)&gt;
	&lt;cfelse&gt;
		&lt;cfset doneOne = true&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;!--- reverse it. This code is the suck. Please be aware it is the suck. ---&gt;
&lt;cfset latestLines = []&gt;
&lt;cfloop index="x" from="#arrayLen(lines)#" to="#max(1,arrayLen(lines)-20)#" step="-1"&gt;
	&lt;cfset arrayAppend(latestLines, lines[x])&gt;
&lt;/cfloop&gt;
</code>

Ok, now before going on, I know some of you are screaming at your monitor now. This is <b>not a good way</b> to get the end of the file. Remember we want to show the latest updates in our RSS feed. My code loops through the file, adding each line to an array. I then reverse it by grabbing the last 20 lines. This works, but let me stress. It sucks. It can be done better. I'm going to leave that for tomorrow. For now though, just remember that this is not the most efficient way to get the end of a file. 

I now have an array of 20 lines (at most) of text. These are in the format of:

"Severity","ThreadID","Date","Time","Application","Message"<br/>
"Information","jrpp-18","12/23/08","15:21:20",,"/Applications/ColdFusion8/logs/application.log initialized"<br/>
"Error","jrpp-26","12/23/08","17:02:44","ApplicationName","Variable X is undefined. The specific sequence of files included or processed is: /Library/WebServer/Documents/test4.cfm, line: 6 "<br/>

The first line is a header of columns (which I skipped when reading in the file) and each line is comma delimited and wrapped in quotes. Luckily I can parse this format using the csvToArray UDF mentioned earlier. The only issue I have with the UDF is that it expects a file, not one line. You will see how I handle that in the code below.

<code>
&lt;!--- query to send to cffeed ---&gt;
&lt;cfset q = queryNew("publisheddate,title,content")&gt;

&lt;!--- for each line, parse it into an array, and add to our query ---&gt;
&lt;cfloop index="l" array="#latestLines#"&gt;
	&lt;cfset data = csvToArray(l)&gt;
	&lt;!--- udf expected N lines, we sent it one, so quickly copy over itself ---&gt;
	&lt;cfset data = data[1]&gt;
	
	&lt;cfset queryAddRow(q)&gt;
	&lt;!--- array pos 3 and 4 is date and time ---&gt;
	&lt;cfset querySetCell(q, "publisheddate", data[3] & " " & data[4])&gt;
	&lt;!--- pos 6 is the full string ---&gt;
	&lt;cfset querySetCell(q, "content", data[6])&gt;
	&lt;!--- make a title from the full string ---&gt;
	&lt;cfset title = left(data[6],100)&gt;
	&lt;cfif len(data[6]) gt 100&gt;
		&lt;cfset title &= "..."&gt;
	&lt;/cfif&gt;
	&lt;cfset querySetCell(q, "title", title)&gt;
&lt;/cfloop&gt;
</code>

The first line above creates the query that I'll give to CFFEED. Well don't forget that when creating RSS feeds with a query, you need to either a) name your columns right or b) use the columnMap feature to tell the feed generator to map certain RSS items to particular query columns. Since I'm building the query from scratch I'll just use the columns that make sense for RSS. I parse the line (and notice how I copy the array over itself, I explained why above), and then I simply copy relevant data items over into my query. 

I made the call that I'd use the date, time, and message values from the ColdFusion log. That made the most sense for this type of log. Other log files would probably warrant different logic. I combine the date and time when adding it to the query. Message comes in as is, and I reuse a portion of the message for my title. 100 characters isn't an RSS requirement - it just felt right for the feed. 

We have our data, but there is one more step before we can create an RSS feed. We have to give some metadata about the feed. The values I chose here were completely arbitrary and really don't matter that much, but they are required by the CFFEED tag.

<code>
&lt;cfset meta = {
	version="rss_2.0",
	title="ColdFusion Application Logs",
	link="http://null",
	description="Latest log items."
}&gt;
</code>

Woot! That's it. Now to just actually convert the query into RSS and serve it up.

<code>
&lt;cffeed action="create" query="#q#" properties="#meta#" xmlVar="rss"&gt;

&lt;cfcontent type="text/xml; chartset=utf-8"&gt;&lt;cfoutput&gt;#rss#&lt;/cfoutput&gt;
</code>

You can see the output here, but note that it is a static export, not a live copy: <a href="http://www.coldfusionjedi.com/demos/cfrss/test.xml">http://www.coldfusionjedi.com/demos/cfrss/test.xml</a>

As I said, woot! Nothing says excitement like ColdFusion log files. Maybe we can kick it up a notch? For fun, I decided to build a simple little zombie infestation simulator. It takes a pool of 100 people. Every 'round' there is a chance the infestation will start. Once it done, every round will end up with either a dead zombie or a dead human and one more zombie. (Guess who tends to win?) I wrote the simulator to not only output to the screen but also log the values as well. Check it out:

<code>
&lt;cffunction name="logit" returnType="void" output="true" hint="Handle cflogging and printing."&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="color" type="string" required="false"&gt;
	
	&lt;cfif structKeyExists(arguments,"color") and len(arguments.color)&gt;
		&lt;cfoutput&gt;&lt;span style="color: #arguments.color#"&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	&lt;cfoutput&gt;#arguments.str# [Humans: #humanpop# / Zombies: #zombiepop#]&lt;/cfoutput&gt;
	&lt;cfif structKeyExists(arguments,"color") and len(arguments.color)&gt;
		&lt;/span&gt;
	&lt;/cfif&gt;
	&lt;br /&gt;
	&lt;cflog file="zombie" text="#arguments.str# [Humans: #humanpop# / Zombies: #zombiepop#]"&gt;
&lt;/cffunction&gt;

&lt;!--- initial human pop ---&gt;
&lt;cfset humanpop = 100&gt;

&lt;!--- initial zombie pop ---&gt;
&lt;cfset zombiepop = 0&gt;

&lt;!--- has the infection began? ---&gt;
&lt;cfset infectionOn = false&gt;
	
&lt;!--- sanity check, if we hit this, abort ---&gt;
&lt;cfset y = 1&gt;

&lt;!--- checks to see if we are done ---&gt;
&lt;cfset simDone = false&gt;

&lt;cfloop condition="not simDone && y lt 1000"&gt;

	&lt;!--- ok, if no infection, we have a 5% chance of starting it. ---&gt;
	&lt;cfif not infectionOn&gt;
		&lt;cfif randRange(1,100) lte 5&gt;
			&lt;cfset infectionOn = true&gt;
			&lt;cfset humanpop--&gt;
			&lt;cfset zombiepop++&gt;
			&lt;cfset logit("Zombie infestation begun.")&gt;	
		&lt;cfelse&gt;
			&lt;cfset logit("All good!")&gt;		
		&lt;/cfif&gt;
	&lt;cfelse&gt;
	
		&lt;!--- Ok, we either kill a human or a zombie. 
		The more zombies, the greater chance a human dies.
		Zombies only have a chance to die when the grow in #, since people won't worry about them until they mass up. 
		It is a bit too late when the zombies mass up, but guess what, thats how these things work.
		
		Tweak the +/- to help/hinder the survival rate
		---&gt;
		
		&lt;cfset chanceHumanDied = randRange(1,zombiePop) + 4&gt;
		&lt;cfset chanceZombieDied = randRange(1,zombiePop) - 0&gt;
		
		&lt;cfif randRange(1,100) lte chanceHumanDied&gt;
			&lt;cfset humanpop--&gt;
			&lt;cfset zombiepop++&gt;
			&lt;cfset logit("Zombie killed a human.","red")&gt;
		&lt;cfelseif randRange(1,100) lte chanceZombieDied&gt;
			&lt;cfset zombiepop--&gt;
			&lt;cfset logit("Human killed a zombie.","green")&gt;
		&lt;cfelse&gt;
			&lt;cfset logit("Nothing happend this time.")&gt;
		&lt;/cfif&gt;
		
	&lt;/cfif&gt;	

	&lt;!--- end the sim if humanpop is 0 or infection started and the zombies were slain ---&gt;
	&lt;cfif humanpop is 0&gt;
		&lt;cfset logit("All humans killed. Sim done.")&gt;
		&lt;cfset simDone = true&gt;
	&lt;/cfif&gt;

	&lt;cfif infectionOn and zombiepop is 0&gt;
		&lt;cfset logit("All zombies killed. Sim done.")&gt;
		&lt;cfset simDone = true&gt;
	&lt;/cfif&gt;
	
	&lt;!--- This is my sanity check in case my logic is crap ---&gt;	
	&lt;cfset y++&gt;
&lt;/cfloop&gt;
</code>

You can run this yourself here: <a href="http://www.coldfusionjedi.com/demos/cfrss/sim.cfm">http://www.coldfusionjedi.com/demos/cfrss/sim.cfm</a> Have fun. I know I ran it about a hundred times or so. I then used the same code above (and attached to this entry), with a slight modification to the RSS properties:

<code>
&lt;cfset meta = {
	version="rss_2.0",
	title="FunCo Mall Security Logs",
	link="http://null",
	description="Latest log items."
}&gt;
</code>

You can view that XML here: <a href="http://www.coldfusionjedi.com/demos/cfrss/zombie.xml">http://www.coldfusionjedi.com/demos/cfrss/zombie.xml</a> (Again, not 'live', just a save from my machine.)

Enjoy. I attached all the files to the blog entry.<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fzombie%{% endraw %}2Ezip'>Download attached file.</a></p>