---
layout: post
title: "Indexing PDFs with Solr? Read this tip."
date: "2011-08-22T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/22/Indexing-PDFs-with-Solr-Read-this-tip
guid: 4334
---

Have you noticed that indexed PDFs don't seem to contain all the content they should? Turns out this is a performance setting in Solr. The tip below is credit Uday Ogra of Adobe:

Solr has a default upper limit of 10000 on max number of words which can be indexed in documents which approximately defaults to 20-40 pages.

We can change this default value for each collection. Suppose collection's name is newcollection.

Open file COLDFUSION_COLLECTIONS_PATH/newcollection/conf/solrconfig.xml

Here COLDFUSION_COLLECTIONS_PATH is the path you would have configured while creating the collection.

Here search &lt;mainindex&gt; tag. Inside this tag there would be a sub-tag &lt;maxFieldLength&gt; which has a default value of 10000.

You can change it to a value which will suit your indexing.

(There is one more &lt;maxFieldLength&gt;  tag directly under &lt;indexDefaults&gt; tag, do not change it)

In your case I would recommend to change it to 100000.

By the way on an average a single pdf page has around 200-500 words. So for a pdf with 100 pages setting this value to 100000 should be safe enough.