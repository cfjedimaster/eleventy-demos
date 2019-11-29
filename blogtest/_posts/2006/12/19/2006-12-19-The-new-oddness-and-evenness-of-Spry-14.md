---
layout: post
title: "The new oddness (and evenness) of Spry 1.4"
date: "2006-12-19T17:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/19/The-new-oddness-and-evenness-of-Spry-14
guid: 1725
---

Ok, I'm not sure if "evenness" is really a word, but if Steve Colbert can make stuff up - so can I. Before Spry 1.4, Spry supported a simple way to apply different CSS styles to datasets rows to support even/odd colors. It was done using the built in variable ds_EvenOddRow. On execution, this would be replaced with even or odd. So in this example:

<code>
&lt;tr spry:repeat="dsEmployees" class="{% raw %}{ds_EvenOddRow}{% endraw %}"&gt;
</code>

You would end up with this when the dataset was generated:

<code>
&lt;tr class="even"&gt;
...
&lt;tr class="odd"&gt;
</code>

If you wanted different names, you could prepend or append a value to the class like so:

<code>
&lt;tr spry:repeat="dsEmployees" class="myds_{% raw %}{ds_EvenOddRow}{% endraw %}"&gt;
</code>

While this worked, it wasn't the cleanest method. Spry 1.4 introduces a new spry:even and spry:odd tag. This allows you to specify the class to use in each particular case. Consider this example:

<code>
&lt;tr spry:repeat="dsEmployees" spry:even="even" spry:odd="odd"&gt;
</code>

This ends up being the exact same as the first example, but is a bit more clear. 

One more quick example. If you are repeating over multiple datasets, you can tell spry:even and spry:odd what dataset to check for "oddness". Adobe provides an example of that. 

So to see live examples of all of these, visit: 

<a href="http://labs.adobe.com/technologies/spry/samples/data_region/EvenOddRowSample.html">http://labs.adobe.com/technologies/spry/samples/data_region/EvenOddRowSample.html</a>