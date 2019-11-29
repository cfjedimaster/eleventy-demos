---
layout: post
title: "Ask a Jedi: Admin Interface for XML Docs"
date: "2006-01-05T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/05/Ask-a-Jedi-Admin-Interface-for-XML-Docs
guid: 1010
---

A reader asks:

<blockquote>
I love using XML for reading application variables, and other bits of stored data. But I'd like to be able to update setting via an admin tool, rather than hand editing. With XML, is this possible? If so, how?
</blockquote>

The <i>simplest</i> answer is to just use cffile. You could use cffile to read in the XML file - display it in a textarea, and then cffile again to save the file. However, this can be dangerous. First off - the person editing may not know XML. Secondly - even if you do know XML you can always make a mistake. (Um, not that I ever do.) You can do an isXML() on the string before saving it. That would ensure that the string was valid. 

So as I said - this solution is the quickest - but probably not the nicest. What you probably want to do is read in the XML and provide a nice form. So if your XML packet had 2 fields, you would provide two simple text fields for them. 

This requires you to both parse the XML when reading it in - and updating the XML object with the form data. This is rather simple in ColdFusion. (So simple I'm not showing examples. Do folks think we need a full set of code to show with this?) When you want to save the XML back, do not forget that you can use ToString() on the XML object to translate it back into a simple string. You need to pass a string to cffile, not an XML object.