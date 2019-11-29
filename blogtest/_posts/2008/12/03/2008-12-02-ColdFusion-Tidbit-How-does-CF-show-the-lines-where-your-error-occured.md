---
layout: post
title: "ColdFusion Tidbit - How does CF show the lines where your error occured?"
date: "2008-12-03T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/03/ColdFusion-Tidbit-How-does-CF-show-the-lines-where-your-error-occured
guid: 3130
---

I shared a few emails with a user this week that had an interesting request. He wanted to use try/catch around some problematic code, but want to display detailed information in the cfcatch block that mimicked what he saw when he had a 'naked' error.
<!--more-->
I suggested he simply dump out the CFCATCH structure as it contains just about everything possible. Anything there should match up with what he saw with unhandled errors. 

However, what the user really wanted was the code snippet you get when an error occurs:

<code>
The error occurred in \\code: line 18

16 :                    messages
17 :            WHERE
18 :                    idpk=&lt;cfqueryparam  cfsqltype="CF_SQL_INTEGER" value="#theValue#"&gt;
19 :    &lt;/cfquery&gt;
20 :
</code>

You don't see this if you dump cfcatch, so where does it come from? Well what folks may forget (although I've blogged on it once or twice over the years) is that the error handling built into ColdFusion is a set of unencrypted ColdFusion templates. If you go to /wwwroot/WEB-INF/exception, you will see a set of files that you can open, and if you feel brave, you can edit them. The code in question for the snippet comes from a custom tag named errorcontext.cfm. It uses Java to read in the file and create the snippet. Here is the code in question, copyright Adobe (and I guess if they mind I'll remove it):

<code>
&lt;cfset result = ArrayNew(1)&gt;
&lt;cfscript&gt;
try
{
firstLine = attributes.errorLocation.line - attributes.showcontext;
lastLine  = attributes.errorLocation.line + attributes.showcontext;

//  Wrap a FileReader in a LineNumberReader to read the CFML template as text.
fileReaderClass = createObject("java", "java.io.FileReader");
fileReader = fileReaderClass.init(attributes.errorLocation.Template);

lineReaderClass = createObject("java", "java.io.LineNumberReader" );
lineReader = lineReaderClass.init(fileReader);

currentLine = lineReader.readLine();

while ( isDefined("currentLine") and lineReader.getLineNumber() lte lastLine )
{
	if ( lineReader.getLineNumber() gte firstLine )
	{
	    lineInfoStruct            = structNew();
		lineInfoStruct.line       = currentLine;
		lineInfoStruct.lineNumber = lineReader.getLineNumber();
		ArrayAppend(result, lineInfoStruct);
	}
		currentLine = lineReader.readLine();
	}
	} catch ( "Any" ex) {
	if(isDefined("filereader")){
		fileReader.close();
		}
		lineInfoStruct = structNew();
		lineInfoStruct.line = s_unable;
		lineInfoStruct.lineNumber = -1;
		lineInfoStruct.diagnostic = ex;
				
		ArrayAppend(result, lineInfoStruct);
	}

	try
	{
		if(isDefined("filereader")){
			fileReader.close();
		}
	}
	catch ( "Any" ex){
	}
&lt;/cfscript&gt;
</code>

Forgive the horrible formatting there. I tried to clean it up. What is interesting about this snippet is that it shows a way to read in a file via Java without reading the entire file. This was the only way, pre-ColdFusion 8, to do this. Luckily CF8 gave some love to the file functions so you can now do the same with vanilla ColdFusion.