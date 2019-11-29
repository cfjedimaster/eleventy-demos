---
layout: post
title: "Ask a Jedi: Documentation on VFS Support"
date: "2009-10-12T09:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/12/Ask-a-Jedi-Documentation-on-VFS-Support
guid: 3561
---

Steve asks:

<blockquote>
Regarding the Virtual File System in CF 9: does not appear it's supported in all tags. My attempt to do: <cfpdfform action="populate" source="somefile.pdf" destination="ram:///vfsfile.pdf"> results in: The ram:///vfsfile.pdf specified in the cfpdfform tag either does not exist or is not accessible by this tag.
<br/><br/>
Is there documentation on what is/isn't supported?
</blockquote>

Absolutely - but it is a bit hard to find if you don't know where to search. The core documentation may be found online here: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a0-70e2363b121825b20e7-8000.html">Working with in-memory files</a>

Within this documentation you will find a section on functions and tags that work with VFS. The functions are:

FileIsEOF<br/>
FileReadBinary<br/>
Filemove<br/>
Filecopy<br/>
FileReadLine<br/>
FileExists<br/>
FileOpen<br/>
FileWriteln<br/>
FileClose<br/>
FileRead<br/>
FileDelete<br/>
DirectoryExists<br/>
FileSetLastModified<br/>
GetFileInfo<br/>
GetDirectoryFromPath<br/>
GetFileFromPath<br/>
ImageNew<br/>
ImageRead<br/>
ImageWrite<br/>
ImageWriteBase64<br/>
IsImageFile<br/>
IsPDFFile<br/>
FileSetLastModified<br/>

The docs seem to be missing the new directory functions, like directoryList, which should work just fine with VFS. Those functions were a late addition to ColdFusion 9 so I assume this is just an oversight. Tags supported with VFS are:

cfcontent<br/>
cfdocument<br/>
cfdump<br/>
cfexchange<br/>
cfexecute<br/>
cffeed<br/>
cfhttp<br/>
cfftp<br/>
cfimage<br/>
cfloop<br/>
cfpresentation<br/>
cfprint<br/>
cfreport<br/>
cfzip<br/>

As you can see, cfpdfform isn't listed there, nor is cfpdf. My guess here is that the PDF support in ColdFusion relies on libraries that can't grok non-physical files.