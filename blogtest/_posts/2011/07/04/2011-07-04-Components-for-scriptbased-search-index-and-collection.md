---
layout: post
title: "Components for script-based search, index, and collection"
date: "2011-07-04T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/04/Components-for-scriptbased-search-index-and-collection
guid: 4294
---

Attached to this blog entry are new CFCs that will allow you to perform collection operations (cfcollection, cfindex, and cfsearch) view script based CFCs. From the attached zip, simply store the components in your cfinstall\customtags\com\adobe\coldfusion folder. (<b>Make a backup of base.cfc first!!</b>) The test files are just that - tests. They mainly work with a collection I had called 'test' so you should not expect them to work as is. They are mainly there to provide you with an example. Here are a few examples...
<!--more-->
<p/>

<h2>Collection</h2>

<code>
&lt;cfscript&gt;
c = new com.adobe.coldfusion.collection();

collections = c.list();
writedump(var=collections,label="Collections, no engine");

clist = c.categoryList(collection="test");
writedump(var=clist,label="Category list for collection test");

//random name
newname = "tempcollection_#replace(createUUID(), "-","_","all")#";
c.create(collection=newname,path=server.coldfusion.rootdir & "/collections");

writeoutput("&lt;p&gt;Made #newname#&lt;/p&gt;");

collections = c.list();
writedump(var=collections,label="Collections");

c.delete(collection=newname);

collections = c.list();
writedump(var=collections,label="Collections after I deleted the new one");

c.optimize(collection="test");
writeoutput("Optimized test");
&lt;/cfscript&gt;
</code>

<p>

<h2>Index</h2>

<code>
&lt;cfscript&gt;
//q is a query I made earlier, ditto for q2
idx = new com.adobe.coldfusion.index();
r = idx.refresh(collection="test",key="id",body="body",query=q,status=true);
writeDump(var=r,label="refresh");

writeoutput("size of q2 - adding - #q2.recordCount#&lt;br/&gt;");
r = idx.update(collection="test",key="id",body="body",query=q2,status=true);
writeDump(var=r,label="update");

r = idx.delete(collection="test",key=1,status=true);
writeDump(var=r,label="delete");

r = idx.purge(collection="test",status=true);
writeDump(var=r,label="purge");
&lt;/cfscript&gt;
</code>

<h2>Search</h2>

<code>
&lt;cfscript&gt;
mysearch = new com.adobe.coldfusion.search();
res = mysearch.search(criteria="cfabort",collection="cfdocs",maxrows=5,status="true");

writedump(var=res);
writeoutput("&lt;hr/&gt;Done");
&lt;/cfscript&gt;
</code><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fblogpost%{% endraw %}2Ezip'>Download attached file.</a></p>