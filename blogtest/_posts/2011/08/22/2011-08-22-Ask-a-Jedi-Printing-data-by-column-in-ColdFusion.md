---
layout: post
title: "Ask a Jedi: Printing data by column in ColdFusion"
date: "2011-08-22T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/22/Ask-a-Jedi-Printing-data-by-column-in-ColdFusion
guid: 4335
---

David asked: 
<p/>
<blockquote>
In using this code "How do I display query results in an N-column table layout?" for the coldfusioncookbook site, I was wondering how one could modify it so that it also uses up a specific number of rows as well.
<br/><br/>
Meaning I want all of column one (10 rows) filled in first before creating column two and so on.  Any ideas?
<br/><br/>
Right now I have only 6 records to display and they are using up 3 columns
and two rows, I would want 1 column and 6 rows and then when it hits say 10,
then start next column.  Hope that's clear.  That's for the great work!!
</blockquote>
<!--more-->
<p/>

This was one of those weird questions that seemed so simple but took a while for me to wrap my brain around it. I decided to draw out a solution first:

<p/>

<img src="https://static.raymondcamden.com/images/IMAG0375.jpg" />

<p/>

If you can actually read my horrible writing there, you can see I've got a table where each column is 3 cells high. I counted down 10 array elements and moved over one column when I got to the end. Looking at this it occured to me that I was probably looping over my array and incrementing by the size of the column. With that in mind, I first wrote a quick test.

<p/>

<code>
&lt;cfscript&gt;
data = ["apple","cherry","moon","zoo","poo","doo","roo","merry","christmas","dude"];
colSize=3;

//First
for(x=1; x&lt;=colSize; x++) {
	writeOutput("x = #x#&lt;br&gt;");
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		writeOutput("&nbsp;&nbsp;y = #y#&lt;br&gt;");
	}		
}
&lt;/cfscript&gt;
</code>

<p/>

My outer loop goes from one to colSize whereas the inner loop will loop over the array of data. It should "jump" like my hand written example did. Here's what I got:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip157.png" />

<p/>

It looked ok to me, so I then worked up this version that made a table.

<p/>

<code>
//Second
result = "&lt;table border=""1""&gt;";
for(x=1; x&lt;=colSize; x++) {
	result &= "&lt;tr&gt;";	
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		result &= "&lt;td&gt;#data[y]#&lt;/td&gt;";
	}		
	result &= "&lt;/tr&gt;";
}
result &= "&lt;/table&gt;";
writeOutput(result);
</code>

<p/>

This version pretty much follows the last version, but now generates a table instead. It creates this:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip158.png" />

<p/>

Woot. But now those empty table cells are kind of bugging me. Let's try this one more time...

<p/>

<code>
//Third
result = "&lt;table border=""1""&gt;";
for(x=1; x&lt;=min(arrayLen(data),colSize); x++) {
	result &= "&lt;tr&gt;";	
	thisPad = 0;
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		result &= "&lt;td&gt;#data[y]#&lt;/td&gt;";
		thisPad++;
	}	
	if(x==1) {
		pad = thisPad;	
	} else {
		if(pad &gt; thisPad) result &= repeatString("&lt;td&gt;&nbsp;&lt;/td&gt;", pad-thisPad);
	}
	result &= "&lt;/tr&gt;";
}
result &= "&lt;/table&gt;";
writeOutput(result);
</code>

<p/>

The main difference now is a pad and thisPad variable. Pad is used to remember the width of the table and thisPad the size of each individual row. If I'm working on row 2-N I simply have to pad the string with empty cells. And the result...

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip159.png" />

<p/>

I don't know if this code will ever actually be useful, but it was fun to write. Here's the entire template.

<p/>

<code>
&lt;cfscript&gt;
data = ["apple","cherry","moon","zoo","poo","doo","roo","merry","christmas","dude"];
colSize=3;

//First
for(x=1; x&lt;=colSize; x++) {
	writeOutput("x = #x#&lt;br&gt;");
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		writeOutput("&nbsp;&nbsp;y = #y#&lt;br&gt;");
	}		
}

writeoutput("&lt;p/&gt;&lt;hr/&gt;&lt;p/&gt;");

//Second
result = "&lt;table border=""1""&gt;";
for(x=1; x&lt;=colSize; x++) {
	result &= "&lt;tr&gt;";	
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		result &= "&lt;td&gt;#data[y]#&lt;/td&gt;";
	}		
	result &= "&lt;/tr&gt;";
}
result &= "&lt;/table&gt;";
writeOutput(result);

writeoutput("&lt;p/&gt;&lt;hr/&gt;&lt;p/&gt;");

//Third
result = "&lt;table border=""1""&gt;";
for(x=1; x&lt;=min(arrayLen(data),colSize); x++) {
	result &= "&lt;tr&gt;";	
	thisPad = 0;
	for(y=x; y&lt;=arrayLen(data); y+=colsize) {
		result &= "&lt;td&gt;#data[y]#&lt;/td&gt;";
		thisPad++;
	}	
	if(x==1) {
		pad = thisPad;	
	} else {
		if(pad &gt; thisPad) result &= repeatString("&lt;td&gt;&nbsp;&lt;/td&gt;", pad-thisPad);
	}
	result &= "&lt;/tr&gt;";
}
result &= "&lt;/table&gt;";
writeOutput(result);

&lt;/cfscript&gt;
</code>