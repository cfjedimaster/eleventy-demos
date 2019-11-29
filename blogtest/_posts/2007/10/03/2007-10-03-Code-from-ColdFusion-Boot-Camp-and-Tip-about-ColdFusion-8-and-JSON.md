---
layout: post
title: "Code from ColdFusion Boot Camp, and Tip about ColdFusion 8 and JSON"
date: "2007-10-03T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/03/Code-from-ColdFusion-Boot-Camp-and-Tip-about-ColdFusion-8-and-JSON
guid: 2391
---

I just gave a quick CF Boot Camp at MAX on using ColdFusion to send data to Spry. It covers going from static to CF6, CF7, and CF8 dynamic data. I've zipped up the code below. Note that it makes use of a database you won't have (I'll try to use the art gallery from now on) and I've removed the personal pictures of my kids. 

So during the boot camp I talk about how cool it is that you can now call a CFC and ask for JSON back. No need for my toXML .cfc anymore. No need for a 'proxy' CFC. You just call your CFC and get your data back. Sweet.

This is cool but as I've blogged before, there are two ways a query can be represented in JSON:

<ol>
<li>An array of column names and an array of data arrays.
<li>A object with a value for the number of rows, an array of column names, and an object where each key is a column name and the value is an array of data.
</ol>

These two options return different types of data and impact how you would use them in Spry. The <a href="http://www.cfquickdocs.com/cf8/?getDoc=SerializeJSON">SerializeJSON</a> function lets you toggle these two options. However - when using returnFormat="JSON" in a CFC call - I wasn't aware of how to toggle this. Todd Sharp pointed out to me that another new URL parameter you can pass to a cfc is:

queryFormat

This takes two values, row and column. The row version matches option 1 above, and column matches option 2. From the zip, here is how I called my CFC from Spry:

<code>
var mydata = new Spry.Data.JSONDataSet("/presentations/cfspry/product.cfc?method=getProducts&returnFormat=json&queryFormat=column",
{% raw %}{path:"DATA", pathIsObjectOfArrays:true}{% endraw %});
&lt;/script&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive11%{% endraw %}2Ezip'>Download attached file.</a></p>