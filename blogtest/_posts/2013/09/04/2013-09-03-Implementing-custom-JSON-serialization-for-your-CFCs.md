---
layout: post
title: "Implementing custom JSON serialization for your CFCs"
date: "2013-09-04T07:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/09/04/Implementing-custom-JSON-serialization-for-your-CFCs
guid: 5026
---

A few weeks back Ben Nadel <a href="http://www.bennadel.com/blog/2505-JsonSerializer-cfc-A-Data-Serialization-Utility-For-ColdFusion.htm">released</a> a nice utility that does JSON serialization with ColdFusion data. As you know, ColdFusion has this feature baked in, but it doesn't always serialize your data in the form you need. Ben's library gives you greater control over JSON serialization and can be helpful in cases where the built-in support isn't working right for you. I wanted to share a quick example of how you could possibly use this in a real CFC.
<!--more-->
First, let's consider a simple CFC built to return an array of data in JSON:

<script src="https://gist.github.com/cfjedimaster/6435445.js"></script>

Nothing too fancy here, right? I've got an array of structs where each element in the array is a structure with three keys. There's a name, an age, and a favorite color key. You would typically retrieve this data by calling the CFC and passing the method and returnformat URL keys:

http://localhost/test.cfc?method=demo&returnformat=json

And here is the result:

[{% raw %}{"FAVCOLOR":333333,"NAME":"Ray 1","AGE":29}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 2","AGE":48}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 3","AGE":41}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 4","AGE":68}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 5","AGE":21}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 6","AGE":31}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 7","AGE":32}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 8","AGE":78}{% endraw %}, {% raw %}{"FAVCOLOR":333333,"NAME":"Ray 9","AGE":94}{% endraw %}]

There are two problems with this result. First, the keys are uppercased. That isn't too difficult to fix nor is it too difficult to handle on the client-side. Secondly, the "favcolor" value was transformed into a number. This is definitely not desirable. Unfortunately you can't fix this easily unless you mess with your data a bit. 

So how would you fix this with Ben's utility? Consider this updated version:

<script src="https://gist.github.com/cfjedimaster/6435471.js"></script>

Let's go over the changes here one by one.

<ul>
<li>First, note we have to change the return type of the method from array to string. While we are still working with an array, the actual return now will be a JSON string, not the original array.
<li>The next change isn't necessarily required, but it helps. We override the return format value and set it to plain. The value "plain" tells ColdFusion to <strong>not</strong> do anything with the result. I.e., leave it be and don't touch it. In theory the end user could just pass this in the URL, but we can make things even easier by just setting the format in the CFC. 
<li>After the existing business logic, we then simply instantiate Ben's CFC and serialize the data. We can then return that string.
</ul>

Now we can call our logic like so:

http://localhost/test.cfc?method=demo2

And get this in response:

[{% raw %}{"favcolor":"333333","name":"Ray 1","age":"37"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 2","age":"88"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 3","age":"86"}{% endraw %},{% raw %}{"favcolor":"333333","name":"Ray 4","age":"25"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 5","age":"72"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 6","age":"97"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 7","age":"32"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 8","age":"56"}{% endraw %}, {% raw %}{"favcolor":"333333","name":"Ray 9","age":"57"}{% endraw %}]

Note that by default the keys were lowercased, which is pretty darn cool. Also note that age was transformed into a string. If you don't like this, you can fix it like so:

var serializer = new JsonSerializer().asString("favcolor").asInteger("age");