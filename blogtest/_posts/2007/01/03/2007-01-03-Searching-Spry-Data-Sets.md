---
layout: post
title: "Searching Spry Data Sets"
date: "2007-01-03T16:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/01/03/Searching-Spry-Data-Sets
guid: 1747
---

Need to quickly search through a Spry data set? Sam Mitchell shared this little gem with me: findRowsWithColumnValues. It allows you to search a dataset for a matching set of column, or columns. So for example, to return all boys from a set that has a gender column:

<code>
var boyRows = dsKids.findRowsWithColumnValues({% raw %}{"gender":"male"}{% endraw %});
</code>

You can even tell the function to return immediately when it finds a match. This is useful for when you are searching by a primary key. Here is an example:

<code>
var theRow = dsKids.findRowsWithColumnValues({% raw %}{"id":"1"}{% endraw %}, true);
</code>

Lastly, you can search by any number of columns:

<code>
var leftyBoyRows = dsKids.findRowsWithColumnValues({% raw %}{"gender":"male", "handiness":"left"}{% endraw %});
</code>

A full example may be found <a href="http://labs.adobe.com/technologies/spry/samples/data_region/SetCurrentRowByValueSample.html">here</a>.