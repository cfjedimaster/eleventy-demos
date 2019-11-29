---
layout: post
title: "Nested Layouts in HarpJS"
date: "2014-02-27T10:02:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2014/02/27/Nested-Layouts-in-HarpJS
guid: 5167
---

<p>
Currently it isn't possible to use nested layouts in <a href="http://harpjs.com">HarpJS</a>. But with a little work you can support it easily enough. Here is a solution (with an alternative) that you can use until (if) HarpJS supports it natively in the future.
</p>
<!--more-->
<p>
First, a reminder. By default, if you have a _layout.ejs (or .md, or that other template engine) in your folder, Harp will take the content of your current page and send it to the layout script as a variable, yield. So a simple layout could look like this:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

	&lt;{% raw %}%- yield %{% endraw %}&gt; 
	
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
If you have a subdirectory, it can also specify a _layout.ejs file. When Harp encounters this file, it runs that layout instead of one higher in the directory structure. While you have the option to select a different layout template (in data.json) or ask for no layout, you can't have <i>wrapped</i> layout - i.e., use the current layout and then send the result to the parent layout.
</p>

<p>
This can solved by simply using partials in your layout file. These partials can then be loaded by other layout scripts. So imagine this as your main site layout.
</p>

<pre><code class="language-markup">&lt;{% raw %}%- partial(&quot;_main_header&quot;) %{% endraw %}&gt;

&lt;{% raw %}%- yield %{% endraw %}&gt;

&lt;{% raw %}%- partial(&quot;_main_footer&quot;) %{% endraw %}&gt;</code></pre>

<p>
All I've done is taken the code that would have normally been above and below the yield statement and moved them into a partial. Now imagine I've got an articles folder with its own layout. I want to include the main site layout as well. This is all I do:
</p>

<pre><code class="language-markup">&lt;{% raw %}%- partial(&quot;..&#x2F;_main_header&quot;) %{% endraw %}&gt;

&lt;h3&gt;Article Header&lt;&#x2F;h3&gt;

&lt;{% raw %}%- yield %{% endraw %}&gt;

&lt;h3&gt;Article Footer&lt;&#x2F;h3&gt;

&lt;{% raw %}%- partial(&quot;..&#x2F;_main_footer&quot;) %{% endraw %}&gt;</code></pre>

<p>
Boom. That's it. This works, but the more I use Harp, the more I become concerned with creating nice, <i>maintainable</i> scripts. I've noticed that many themes (including the one on my blog), suffer from "Div-Itis". You all know what Div-Itis is. You view source on a page and see approximately 30 different layers of div tags. I cant tell you how many times I've accidentally broken a layout because I screwed this up. I also can't tell you how many times I've said, "Screw it, let me add a closing div tag" in an attempt to fix something.
</p>

<p>
The solution above works, but separates my layout into two files (ok, technically three, but I'd never update the main layout again), so I wondered if it could be done better. I came up with another solution that uses the ability to pass variables to partials. Remember, partials in Harp are more than just include. You can pass data to them and they can react accordingly. I'm going to use a trick I've used for over a decade now when building ColdFusion templates.
</p>

<pre><code class="language-markup">&lt;{% raw %}%- partial(&quot;_main&quot;, {mode:&quot;header&quot;}{% endraw %}) %&gt;

&lt;{% raw %}%- yield %{% endraw %}&gt;

&lt;{% raw %}%- partial(&quot;_main&quot;, {mode:&quot;footer&quot;}{% endraw %}) %&gt;</code></pre>

<p>
I've made a new partial, called main, and I pass a mode value to it. Now let's look at main.ejs.
</p>

<pre><code class="language-markup">&lt;{% raw %}% if(mode === &quot;header&quot;) { %{% endraw %}&gt;

&lt;h1&gt;MAIN HEADER&lt;&#x2F;h1&gt;

&lt;{% raw %}% }{% endraw %} else {% raw %}{ %{% endraw %}&gt;

&lt;h2&gt;MAIN FOOTER&lt;&#x2F;h2&gt;

&lt;{% raw %}% }{% endraw %} %&gt;
</code></pre>

<p>
As you can see, I've simply added an IF clause that selects which branch of my layout to render. I've got some code intertwined in there, but at least I can look at the entirety of the template all at once. 
</p>

<p>
I've included both demos as an attachment. 
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive35%{% endraw %}2Ezip'>Download attached file.</a></p>