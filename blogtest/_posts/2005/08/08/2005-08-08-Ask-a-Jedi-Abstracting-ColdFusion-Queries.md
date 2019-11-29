---
layout: post
title: "Ask a Jedi: Abstracting ColdFusion Queries"
date: "2005-08-08T21:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/08/Ask-a-Jedi-Abstracting-ColdFusion-Queries
guid: 681
---

Brian asks:

<blockquote>
I have worked with some ASP.NET code where they use the Code Blocks for the data access layer and have seen projects where every query is all located in one .DLL. 

Have seen anything similiar in CF that would perform well?

Particle Tree came up with something for ASP, PHP etc
http://particletree.com/features/database-simplicity-with-class
</blockquote>

If I understand you, you want to know if there is a way to package up your queries. Luckily, there is. ColdFusion MX added ColdFusion Components (CFCs) to the language. These allow you to package up various methods into one file. So assume we have content on our web site related to products. You can image then a CFC containing all the methods necessary to work with the products. For example:

<ul>
<li>addProduct - Allows you to add a product
<li>deleteProduct - Allows you to delete a product
<li>getProduct - Gets a product
<li>getProducts - Gets all products
<li>saveProduct - Allows you to update an existing product
</ul>

Once you have this CFC, a lot of your complexity is now packaged away from the rest of your application. This has all kinds of benefits. Since all your SQL is contained within one file, you can change the database tables all you want without impacting the rest of the application. In fact, when starting development, you can completely ignore the database. You can write getProducts so that it creates a static query when called. Later on when you actually hook up to a database, all you need to do is add in the SQL and remove the temporary code.

So this is just a very, <i>very</i> high level look at code encapsulation with CFCs. Check the documentation for much more information.