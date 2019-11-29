---
layout: post
title: "Spry, Apollo, and Remote XML Sources"
date: "2007-05-19T10:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/05/19/Spry-Apollo-and-Remote-XML-Sources
guid: 2051
---

So this is probably a 'Duh' type post, but I was curious how Apollo and it's "open" web browser would handle remote AJAX requests. As you know (or hopefully know), when doing AJAX requests your browser can only request AJAX data from the same server. So consider a typical Spry dataset:

<code>
&lt;script&gt;
var dsCharacters = new Spry.Data.XMLDataSet("data.xml","people/person");
&lt;/script&gt;
</code>

Because of this, you can't use AJAX to request XML from other servers. So if you wanted to do a RSS feed, you need to point to a ColdFusion file that does the remote hit for you. This is what I do on the <a href="http://www.coldfusionportal.org">ColdFusion Portal</a>. 

One thing I've been curious about is how Apollo changes this. I know the embedded web browser isn't locked down like a normal browser, but could it be as simple as providing a full URL to Spry? Yes. This is all I needed to do:

<code>
&lt;script&gt;
var theFeed = "http://weblogs.macromedia.com/mxna/xml/rss.cfm?query=bySmartCategory&languages=1&smartCategoryId=1&smartCategoryKey=D0382F3A-9D2B-69E8-C7BC317066FA1CC2";
var mxnadata = new Spry.Data.XMLDataSet(theFeed,"/rdf:RDF/item", {% raw %}{ useCache:  false, loadInterval: 90000 }{% endraw %}); 
&lt;/script&gt;
</code>

Just so it is clear - I only used 2 lines since the URL I'm testing with is so long. So I copied a bit of code from the Portal, used the <a href="http://ray.camdenfamily.com/index.cfm/2007/3/29/Building-an-HTML-based-Apollo-Application">command line tools</a> I blogged about before, and was able to quickly build the demo. If you want to see it (and it isn't really worth the time probably), you can download both the AIR and my original source files below.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fsprytest%{% endraw %}2Ezip'>Download attached file.</a></p>