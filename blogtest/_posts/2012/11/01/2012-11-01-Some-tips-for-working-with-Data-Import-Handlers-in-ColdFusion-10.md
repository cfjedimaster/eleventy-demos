---
layout: post
title: "Some tips for working with Data Import Handlers in ColdFusion 10"
date: "2012-11-01T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/11/01/Some-tips-for-working-with-Data-Import-Handlers-in-ColdFusion-10
guid: 4772
---

While working on the Solr chapter for CFWACK10, I ran into a few interesting quirks that I thought I would document to - hopefully - save others from pulling their hair out. If you aren't aware of what Data Import Handlers (DIH) mean, it is simply a means by which you can tell Solr where your data is and how it should index it. It means you can skip the normal "query and index" process in ColdFusion and basically just tell Solr to get your crap by itself.
<!--more-->
1) The first issue you will run into is with the sample XML provided by the documentation (see <a href="http://help.adobe.com/en_US/ColdFusion/10.0/Developing/WSe61e35da8d318518-1acb57941353e8b4f85-7ffd.html">this page</a>). It shows a dataconfig and datasource xml tag. But you should use dataConfig and dataSource instead. 

2) How did I discover this? That leads to my next tip. To debug issues, you want to check the logs under CFINSTALL/cfusion/jetty/logs. You should see a file named stderr-YYYY_MM_DD.log. I kept this up and running during my testing and it was very helpful in figuring out what went wrong.

3) The docs mention using the JDBC URL for your database. Initially I got this by opening up one of the core neo-xml files, but that was a mistake. In your CF Admin, go into the Server Settings page and scroll down to the datasources. Under each one you will see the JDBC URL used for your connection.

4) Speaking of JDBC, in order for Solr to use a JDBC URL to MySQL, you have to copy ColdFusion's MySQL jar. Mine was named mysql-connector-java-commercial-5.1.17-bin.jar. You copy that from the cfusion\lib folder to the jetty\lib folder. You <i>probably</i> have to restart your Solr service in order for that to work.

5) Speaking of restarts, as you edit your data-config.xml file, remember you can reload just one collection in the ColdFusion Collections page in the CF Admin.

6) As part of the data-config.xml, you create a mapping between database fields and index fields. There are a few things you should know.

First, ColdFusion will throw a fit if you do not provide a field called uid. I mapped the primary key of my data to this field.

Secondly, you can add index fields with any name, but if you do not follow the pattern that ColdFusion likes (title, body, *_s, *_i), etc, it will not work. So consider the following block.

<script src="https://gist.github.com/3996738.js?file=gistfile1.xml"></script>

Note the ID/UID field. You must have this. Now note the last two lines. While I was allowed to index to a field called goober, it was not returned in cfsearch. But the one right after, booger_s, works because cfsearch will look for it. 

Anyway, I hope this helps.