---
layout: post
title: "Ask a Jedi: Impact of whitespace and script based CFCs"
date: "2009-08-26T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/26/Ask-a-Jedi-Impact-of-whitespace-and-script-based-CFCs
guid: 3501
---

Henry asks:

<blockquote>
Does CF9 script style CFC still needs to set attribute output=false for component and function?
</blockquote>

In my - admittedly - very limited testing, the answer appears to be no. I created a component with a large amount of white space in both the function and around it as well:
<!--more-->
<code>
component {


public string function sayHello() {











	return "Hello World!";

}


}
</code>

I duplicated this component but added output="false" to both the component and method:

<code>
component output="false" {


public string function sayHello() output="false" {











	return "Hello World!";

}


}
</code>

To test then I created an instance of both and wrapped the sayHello call:

<code>
&lt;cfset badWS = new testws()&gt;
&lt;cfset goodWS = new testws2()&gt;

&lt;cfoutput&gt;
Testing bad: -#badWS.sayHello()#-&lt;br/&gt;
Testing good: -#goodWS.sayHello()#-&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

The result was the exact same. No additional white space from the creation of the CFC or the call either. I even tested making an instance of the first CFC with createObject, just to see if it made a difference, and it did not. Of course, it isn't like the output="false" argument is ignored. If you write a CFC method that outputs <i>directly</i> to the screen, then it does matter. Consider:

<code>
public function sayHello2() {% raw %}{ writeOutput("hello2!"); }{% endraw %}
</code>

That function will work just fine, but if you modify it a bit...

<code>
public function sayHello2() output="false" {% raw %}{ writeOutput("hello2!"); }{% endraw %}
</code>

Now you have a useless function. The output="false" will suppress the writeOutput>