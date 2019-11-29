---
layout: post
title: "Database Explorer - ColdFusion 8 Sample Application"
date: "2007-08-14T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/14/Database-Explorer-ColdFusion-8-Sample-Application
guid: 2279
---

The Database Explorer is a simple application that allows you to browse databases and write SQL. You can select a datasource, browse the tables (and columns), and then write simple SQL statements and see what they return. You can also export the results into an Excel file. Now let me go into detail on how the application works. 

<a href="http://www.raymondcamden.com/images/de.png"><img src="https://static.raymondcamden.com/images/cfjedi/de_thumb.png" alt="Click for bigger picture."></a>

The application starts off by asking you to authenticate to your local ColdFusion server. The application supports both 'simple' CF Administrators protected by one password or systems that require a username and a password. The login template makes use of two &lt;CFWINDOW&gt; tags. The first one is used to host the main login form. The second one is used to display an error in case authentication fails. Authentication is provided by the Admin API. 


Once logged in, index.cfm creates a simple layout using the new &lt;CFLAYOUT&gt; and &lt;CFLAYOUTAREA&gt; tags. The initial layout consists of a thin top bar and a main page underneath it. The top bar is used to display the datasources. The Admin API provides this list. The "Hide System Tables" option does just that – let you hide system tables. I'll explain that a bit more later on in the document.

Once you select a datasource, the bottom page is "pushed" to main.cfm. This is done using the ColdFusion.navigate function. Note that if you reload the entire application and your session is still active, this will happen automatically. The file main.cfm also makes use of &lt;CFLAYOUT&gt; and &lt;CFLAYOUTAREA&gt; to create a layout with three sections. Please note that I originally let you close the left pane. There was a bug with this, so I removed that functionality. You can resize it though.

The first section is the table list. This table list is created from the new &lt;CFDBINFO&gt; tag. I first get a list of tables, and then for each table I get a list of columns. This is all fed into the new HTML/AJAX version of CFTREE. For database columns I list the name as well as the type and note if the column is the primary key. When displaying tables, I check and see if you wanted to hide system tables. I hide these tables by checking if the table_type value is "System Table." While this works fine for MySQL, it does not work well for SQL Server.

The second pane is the SQL Editor. I'm using a third party JavaScript library named CodePress to provide SQL syntax highlighting. 

Underneath the textarea used for SQL are three buttons. I used the new &lt;CFTOOLTIP&gt; to provide tool tips for these buttons. One is used to execute the SQL. The next one is used to execute the SQL and export to Excel. I ran into a bug using &lt;CFCONTENT&gt; inside a &lt;CFLAYOUTAREA&gt;, therefore the JavaScript is a bit different when exporting versus just executing. The last button is used to generate CF code that you can cut and paste into a template.

If you do just execute the code, the results pane is loaded with the SQL using ColdFusion.navigate again. The results pane simply executes your SQL. This SQL is wrapped in a CFTRY to catch any bad SQL statements. If your SQL returned data and you aren't exporting, I use the new HTML/AJAX &lt;CFGRID&gt; to display the results. If you are exporting, I generate a simple HTML table and use &lt;CFCONTENT&gt; to serve it up to Excel.

Credits:

The icons I used come from <a href="http://www.famfamfam.com/lab/icons/silk/">famfamfam.com</a>

The syntax highlighter comes from <a href="http://codepress.org/">CodePress</a><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdb%{% endraw %}2Ezip'>Download attached file.</a></p>