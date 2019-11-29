---
layout: post
title: "Working with RARs in ColdFusion"
date: "2011-02-21T16:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/21/Working-with-RARs-in-ColdFusion
guid: 4131
---

I've been meaning to look at RAR files and ColdFusion for some time, mainly as a way to work with CBR files (these are digital comic books stored in RAR format). Unfortunately, ColdFusion's built in Zip functionality only works with Zip and JAR files. After some Googling for a Java based solution, I was only available to find a good RAR list program. I was not able to find anything that would actually list as well as extract files from a RAR file. I decided to tackle the solution via another route - cfexecute. Here is what I came up with.
<!--more-->
<p>

If you've never used cfexecute before, you can think of it as a way for ColdFusion to work with other programs on your server. cfexecute will run any command line program that the service has access to. There are a few important things to keep in mind though:

<p>

First - cfexecute does not execute programs on the <i>user's</i> machine. That is impossible. 

<p>

Secondly - while you can run any program via cfexecute, only command line programs make sense. So for example, I can start Firefox at the command line, but it will pop open a window on my machine. ColdFusion can do the same, but if you want to actually run a program and do something with the result, the program must return something to the command line itself. 

<p>

I decided to make use of <a href="http://www.7-zip.org/">7-zip</a>. 7-zip is free, open source software that works with a variety of compression formats, including RAR. It includes both visual as well as command line interfaces. Making use of 7-zip via cfexecute simply comes down to figuring out the proper way to execute the program and dealing with the responses. I began by working on a list interface. To list files in an archive, you can use this set of arguments at the command line:

<p>

<code>
C:\Program Files\7-Zip\7z.exe l somefile.rar
</code>

<p>

The "l" argument means list. So now let's look at the cfexecute version of this:

<p>

<code>
&lt;cfset sevenZipexe = "C:\Program Files\7-Zip\7z.exe"&gt;
&lt;cfset theFile = "H:\comics\Guardians of the Galaxy\Guardians of the Galaxy v2 013.cbr"&gt;

&lt;cfset args = []&gt;
&lt;cfset args[1] = "l"&gt;
&lt;cfset args[2] = theFile&gt;
&lt;cfexecute name="#sevenZipExe#" arguments="#args#" variable="result" errorvariable="errorresult" timeout="99" /&gt;
</code>

<p>

In the example above I've created a variable for the 7-Zip command line program and the archive file I want to work with. I've then passed the arguments into an array. Finally I run cfexecute. Make note of a few things. First, I can ask for ColdFusion to gather any result, or error, into two variables: result and errorresult. Secondly, the default mode of operation for cfexecute is "fire and forget" - i.e., don't wait for a response. By adding in a specific timeout value I can ensure ColdFusion will wait (for a while anyway) and get the response.

<p>

Now for the hard part. Some command line programs (like SVN and Git) will actually allow you to get a formatted response. 7-zip does not. It returns a nicely formatted table that looks like this:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip26.png" />

<p>

If we are going to work with this we will need to parse that string into something more readable. (I found out later that there is an argument you can pass to make for a slightly more parsed format. I'm going to skip mentioning that for now, but do know that a slightly better option exists and I may switch to it in the future.) I whipped up the following code to strip out the header and footer.

<p>

<code>
&lt;!--- remove header ---&gt;
&lt;cfset result = trim(rereplace(result, ".*?------------------- ----- ------------ ------------  ------------------------", ""))&gt;
&lt;!--- remove footer ---&gt;
&lt;cfset result = trim(rereplace(result, "------------------- ----- ------------ ------------  ------------------------.*", ""))&gt;
</code>

<p>

This left me with N lines of text delimited by a space. The final part of the line, the file, could have spaces in it, but everything before that should be safe to treat as space delimited. Here is what I used:

<p>

<code>
&lt;cfset files = queryNew("compressed,name,size,date,time,attr","double,varchar,double,date,time,varchar")&gt;
	
&lt;cfloop index="line" list="#result#" delimiters="#chr(13)##chr(10)#"&gt;
	&lt;cfset queryAddRow(files)&gt;
	&lt;cfset line = trim(line)&gt;
		
	&lt;cfset date = listFirst(line, " ")&gt;
	&lt;cfset line = listRest(line, " ")&gt;
	&lt;cfset querySetCell(files, "date", date)&gt;

	&lt;cfset time = listFirst(line, " ")&gt;
	&lt;cfset line = listRest(line, " ")&gt;
	&lt;cfset querySetCell(files, "time", time)&gt;

	&lt;cfset attr = listFirst(line, " ")&gt;
	&lt;cfset line = listRest(line, " ")&gt;
	&lt;cfset querySetCell(files, "attr", attr)&gt;

	&lt;cfset size = listFirst(line, " ")&gt;
	&lt;cfset line = listRest(line, " ")&gt;
	&lt;cfset querySetCell(files, "size", size)&gt;

	&lt;cfset compressed = listFirst(line, " ")&gt;
	&lt;cfset line = listRest(line, " ")&gt;
	&lt;cfset querySetCell(files, "compressed", compressed)&gt;

	&lt;cfset name = trim(line)&gt;
	&lt;cfset querySetCell(files, "name", name)&gt;
		
&lt;/cfloop&gt;
</code>

<p>

Not rocket science but it works ok. So - what about extraction? I was concerned with extracting one file at a time, so I first figured out that syntax:

<p>

<code>
C:\Program Files\7-Zip\7z.exe e -aoa -oc:\loc somefile.rar somefile.txt
</code>

<p>

In this example, e stands for extra. -aoa stands for overwrite. -o is the output directory. The next argument is the archive. And the final argument is the specific file you want to extract. With this syntax in place, it was then easy to call it via cfexecute:

<p>

<code>
&lt;cfset args = []&gt;
&lt;cfset args[1] = "e"&gt;
&lt;cfset args[2] = "-aoa"&gt;
&lt;cfset args[3] = "-oc:\Users\Raymond\Desktop\"&gt;

&lt;cfset args[4] = theFile&gt;
&lt;cfset args[5] = "1602 001 001.jpg"&gt;

&lt;cfexecute name="#sevenZip#" arguments="#args#" variable="result" errorvariable="errorresult" timeout="99" /&gt;
</code>

<p>

The next logical step was to wrap this up into a nice CFC. Here is my first version of a 7-zip wrapper. It isn't the most stable wrapper, but it fits my needs. I'll post my use case for this in the next blog entry.

<p>

<code>
&lt;cfcomponent output="false"&gt;
	
	&lt;cffunction name="init" access="public" output="false"&gt;
		&lt;cfargument name="sevenZipExe" type="string" required="true"&gt;
		
		&lt;cfif not fileExists(arguments.sevenZipExe)&gt;
			&lt;cfthrow message="Invalid 7Zip executable path: #arguments.sevenZipExe#"&gt;
		&lt;/cfif&gt;
		
		&lt;cfset variables.sevenzipexe = arguments.sevenzipexe&gt;
		&lt;cfreturn this&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="extract" access="public" returnType="boolean" output="false"&gt;
		&lt;cfargument name="archivefile" type="string" required="true"&gt;
		&lt;cfargument name="file" type="string" required="true"&gt;
		&lt;cfargument name="destination" type="string" required="true"&gt;
		&lt;cfset var result = ""&gt;
		&lt;cfset var errorresult = ""&gt;
		
		&lt;cfif not fileExists(arguments.archivefile)&gt;
			&lt;cfthrow message="Unable to work with #arguments.arvhiefile#, it does not exist."&gt;
		&lt;/cfif&gt;

		&lt;cfset var args = []&gt;
		&lt;cfset args[1] = "e"&gt;
		&lt;cfset args[2] = "-aoa"&gt;
		&lt;cfset args[3] = "-o#arguments.destination#"&gt;
		&lt;cfset args[4] = arguments.archivefile&gt;
		&lt;cfset args[5] = arguments.file&gt;
		
		&lt;cfexecute name="#variables.sevenZipexe#" arguments="#args#" variable="result" errorvariable="errorresult" timeout="99" /&gt;
		
		&lt;cfif findNoCase("Everything is ok", result)&gt;
			&lt;cfreturn true&gt;
		&lt;cfelse&gt;
			&lt;cfreturn false&gt;
		&lt;/cfif&gt;
		
	&lt;/cffunction&gt;
	
	&lt;cffunction name="list" access="public" returnType="query" output="false"&gt;
		&lt;cfargument name="file" type="string" required="true"&gt;
		&lt;cfset var result = ""&gt;
		&lt;cfset var errorresult = ""&gt;
		&lt;cfset files = queryNew("compressed,name,size,date,time,attr","double,varchar,double,date,time,varchar")&gt;
		&lt;cfset var line = ""&gt;
				
		&lt;cfif not fileExists(arguments.file)&gt;
			&lt;cfthrow message="Unable to work with #arguments.file#, it does not exist."&gt;
		&lt;/cfif&gt;
	
		&lt;cflog file="application" text="Working with #arguments.file#"&gt;
		&lt;cfset var args = []&gt;
		&lt;cfset args[1] = "l"&gt;
		&lt;cfset args[2] = arguments.file&gt;
		&lt;cfexecute name="#variables.sevenzipexe#" arguments="#args#" variable="result" errorvariable="errorresult" timeout="99" /&gt;

		&lt;cfif len(errorresult)&gt;
			&lt;cfthrow message="Error from SevenZip: #errorresult#"&gt;
		&lt;/cfif&gt;

		&lt;cfif find("is not supported archive", result)&gt;
			&lt;cfthrow message="#arguments.file# was not a supported archive."&gt;
		&lt;/cfif&gt;
		
		&lt;!--- remove header ---&gt;
		&lt;cfset result = trim(rereplace(result, ".*?------------------- ----- ------------ ------------  ------------------------", ""))&gt;
		&lt;!--- remove footer ---&gt;
		&lt;cfset result = trim(rereplace(result, "------------------- ----- ------------ ------------  ------------------------.*", ""))&gt;
		
		&lt;cfloop index="line" list="#result#" delimiters="#chr(13)##chr(10)#"&gt;
			&lt;cfset queryAddRow(files)&gt;
			&lt;cfset line = trim(line)&gt;
			&lt;cfset date = listFirst(line, " ")&gt;
			&lt;cfset line = listRest(line, " ")&gt;
			&lt;cfset querySetCell(files, "date", date)&gt;
	
			&lt;cfset time = listFirst(line, " ")&gt;
			&lt;cfset line = listRest(line, " ")&gt;
			&lt;cfset querySetCell(files, "time", time)&gt;
	
			&lt;cfset attr = listFirst(line, " ")&gt;
			&lt;cfset line = listRest(line, " ")&gt;
			&lt;cfset querySetCell(files, "attr", attr)&gt;
	
			&lt;cfset size = listFirst(line, " ")&gt;
			&lt;cfset line = listRest(line, " ")&gt;
			&lt;cfset querySetCell(files, "size", size)&gt;
	
			&lt;cfset compressed = listFirst(line, " ")&gt;
			&lt;cfset line = listRest(line, " ")&gt;
			&lt;cfset querySetCell(files, "compressed", compressed)&gt;
	
			&lt;cfset name = trim(line)&gt;
			&lt;cfset querySetCell(files, "name", name)&gt;
			
		&lt;/cfloop&gt;
			
		&lt;cfreturn files&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

<p>

Finally, here is a quick example of using the zip:

<p>

<code>
&lt;cfset sevenZipexe = "C:\Program Files\7-Zip\7z.exe"&gt;
&lt;cfset sevenzipcfc = new sevenzip(sevenzipexe)&gt;
&lt;cfset files = sevenzipcfc.list(theFile)&gt; 
&lt;cfdump var="#files#"&gt;

&lt;cfset sevenzipcfc.extract(thefile,files.name[1],"c:\Users\Raymond\Desktop")&gt;
</code>