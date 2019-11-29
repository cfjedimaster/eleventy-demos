---
layout: post
title: "Update to LighthousePro/JSON/Spry Post"
date: "2007-07-03T13:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/03/Update-to-LighthouseProJSONSpry-Post
guid: 2168
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/7/2/Case-Study--Moving-to-Spry-15-and-JSON-for-Lighthouse-Pro">blogged</a> about how I moved <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a> over to JSON using CFJSON and Spry. In general it worked nice and gave me some size savings on the data, but I had run into one problem.

The format of the data returned from CFJSON wasn't working right with Spry. I had to tell CFJSON to return it's data in "array" format. This gave me data that looked like so (and by the way, this is borrowed from the Spry docs that I'll be linking to in a moment):

<code>
{
  "data":
  [
    {% raw %}{ "firstname": "John", "lastname": "Smith", "id": "3001" }{% endraw %},
    {% raw %}{ "firstname": "Jane", "lastname": "Doe",   "id": "4532" }{% endraw %},
    {% raw %}{ "firstname": "Ann",  "lastname": "Hunt",  "id": "5462" }{% endraw %}
  ]
}
</code>

Turns out though - that Spry had built in support for the default way that CFJSON returned cfqueries. Why? The default way CFJSON returns queries is actually even smaller. Consider this version:

<code>
{
  "data":
  {
    "firstname": [ "John",  "Jane", "Ann"  ],
    "lastname":  [ "Smith", "Doe",  "Hunt" ]
    "id":        [ "3001",  "4532", "5462" ]
  }
}
</code>

Notice that the main change is the columns are not repeated.  In order for Spry to work with this form, I simply had to add a new attribute to my JSONDataSet creation:

<code>
var dsIssues = new Spry.Data.JSONDataSet("issuesxml.cfm?id=#p.getID()#&stupid=#rand("SHA1PRNG")#",{% raw %}{path:"data", pathIsObjectOfArrays: true}{% endraw %});
</code>

Note specifically the pathIsObjectOfArray attribute.

Ok - so why is this a big deal? Well as I mentioned in the last post, I had hoped the savings in size would be a bit better. For my 300 issue project I went from 130k to 90k. Guess what the size was for this alternate version? 40k. Now <b>that</b> is a nice savings.

For more information on the options concerning JSON datasets in Spry, see <a href="http://labs.adobe.com/technologies/spry/articles/data_api/apis/json_dataset.html#constructor">this page</a>. Thanks go to Kin Blas of Adobe for pointing this out to me. (And Lighthouse Pro users will see this in the zip later today.)