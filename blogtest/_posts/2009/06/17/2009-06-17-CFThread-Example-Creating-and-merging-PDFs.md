---
layout: post
title: "CFThread Example - Creating and merging PDFs"
date: "2009-06-17T21:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/17/CFThread-Example-Creating-and-merging-PDFs
guid: 3399
---

Josh K. sent in an interesting problem today. He was generating 10 PDFs in a request, all running via cfthread, and he was trying to create one main PDF by merging the 10 he created. This turned out to be a bit difficult at first, but here is the code I ended up with that worked. Let's break it down line by line.
<!--more-->
First, let's create a list to store the names of our threads. Because our final goal is to merge the PDFs, we know that at some point we have to <b>join</b> the threads. To join threads, you have to know their names. So our list variable will remember each thread name.

<code>
&lt;cfset threadList = ""&gt;
</code>

Now let's loop. I set my loop to 5 instead of 10 just to make things a bit quicker:

<code>
&lt;!--- loop pages and create cfdocuments ---&gt;
&lt;cfloop index="x" from="1" to="5"&gt;
	&lt;cfset name = "thread_number_#x#"&gt;
	&lt;cfset threadList = listAppend(threadList,name)&gt;
</code>

For each loop iteration, we create a name for the thread and append it to the list. Now for the actual thread.

<code>
	&lt;cfthread name="#name#"&gt;
	
		&lt;cfdocument name="thread.pdf" format="pdf"&gt;
				
		&lt;!--- output data ---&gt;
		&lt;cfoutput&gt;#randRange(1,10000)#pdf data boo yah #thread.name#&lt;/cfoutput&gt;		
		
		&lt;/cfdocument&gt;

	&lt;/cfthread&gt;
</code>

You can see our dynamic thread name being used there. The cfdocument tag creates the PDF and stores it in a variable called thread.pdf. Normally variables you create in a thread exist in a local scope not available outside the thread. The Thread scope doesn't have this problem. Later on when I join my threads I can reuse this data. By naming my PDF variable thread.pdf, I'm simply storing the data in the thread scope ColdFusion created for me.

Now for the next block:

<code>
&lt;/cfloop&gt;
</code>

Yeah, that ends the loop. Real complex block. ;)

Ok, so now that we've created our threads that generate PDFs, we have to wait for them to complete:

<code>
&lt;cfthread action="join" name="#threadlist#" /&gt;
</code>

That's it. Nice and simple. While my 5 threads operate in parallel, this tag will force ColdFusion to wait for them to finish. Now for the merge:

<code>
&lt;cfpdf action="merge" name="final"&gt;
	&lt;cfloop list="#threadlist#" index="i"&gt;
		&lt;cfset tempCopy = cfthread[i].pdf&gt;
		&lt;cfpdfparam source="tempCopy"&gt;
	&lt;/cfloop&gt;
&lt;/cfpdf&gt;
&lt;cfheader name="Content-Disposition" value="inline; filename=test.pdf"&gt;		
&lt;cfcontent type="application/pdf" variable="#tobinary(final)#" reset="No" &gt;
</code>

I begin with a cfpdf tag, merge action. This will perform the actual merge. The tag allows you to use the child tag, cfpdfparam, to specify PDFs to merge. You can use either a file path or the <i>name</i> of a PDF variable. I tried specifiying source="cfthread[i].pdf", but this confused the tag. It thought it was a file path. The tempCopy variable simply copies out the data and makes cfpdfparam nice and happy. (Let me state - I really dislike it when ColdFusion uses the names of variables as arguments. cfoutput query="name" is a good example of this. I really wish it would allow for cfoutput query="#qry#". This is a perfect example. Adobe had to build code to say - is this string a path or a variable? It would have been far easier to say, if a string, assume a path, otherwise assume it's binary data.)

One done with the merge, a quick cfheader/cfcontent combo will actually serve the PDF up to the user.

As always, hope this is helpful! Complete source code is below.

<code>


&lt;cfset threadList = ""&gt;

&lt;!--- loop pages and create cfdocuments ---&gt;
&lt;cfloop index="x" from="1" to="5"&gt;
	&lt;cfset name = "thread_number_#x#"&gt;
	&lt;cfset threadList = listAppend(threadList,name)&gt;
	&lt;cfthread name="#name#" &gt;
	
		&lt;cfdocument name="thread.pdf" format="pdf"&gt;
				
		&lt;!--- output data ---&gt;
		&lt;cfoutput&gt;#randRange(1,10000)#pdf data boo yah #thread.name#&lt;/cfoutput&gt;		
		
		&lt;/cfdocument&gt;

	&lt;/cfthread&gt;
	
&lt;/cfloop&gt;

&lt;cfthread action="join" name="#threadlist#" /&gt;

&lt;cfpdf action="merge" name="final"&gt;
	&lt;cfloop list="#threadlist#" index="i"&gt;
		&lt;cfset tempCopy = cfthread[i].pdf&gt;
		&lt;cfpdfparam source="tempCopy"&gt;
	&lt;/cfloop&gt;
&lt;/cfpdf&gt;
&lt;cfheader name="Content-Disposition" value="inline; filename=test.pdf"&gt;		
&lt;cfcontent type="application/pdf" variable="#tobinary(final)#" reset="No"&gt;
</code>