---
layout: post
title: "Introducing Snap.svg"
date: "2013-10-23T11:10:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/10/23/Introducing-Snapsvg
guid: 5066
---

<p>
<img src="https://static.raymondcamden.com/images/snaplogo.gif" title="Snap logo" style="float:left;margin-right:10px;margin-bottom:10px;width:120px" />

Today at the HTML5Dev Conference (http://html5devconf.com/) we announced the availability of Snap.svg. Snap.svg is the successor to <a href="http://raphaeljs.com/">Raphael</a> . It is an open source JavaScript library that enables you to easily work with SVG graphics and animations. The library targets modern browsers (IE9, Safari, Chrome, Firefox, Opera) and provides support for making, clipping, gradients, animation, and more. Even cooler, it does so in a jQuery-ish familiar format.
</p>
<!--more-->
<p>
You can find out more about Snap.svg at the web site: <a href="http://snapsvg.io">snapsvg.io</a>. I'd start off with the awesome <a href="http://snapsvg.io/start/">Getting Started</a> tutorial.  The tutorial gives a live code/output example of the library in action and is the best way to get a feel for how Snap does things.
</p>

<p>
<img src="https://static.raymondcamden.com/images/snaptut.jpg" />
</p>

<p>
For the details, you can hit up the <a href="http://snapsvg.io/docs/">docs</a> and play around with the <a href="http://snapsvg.io/demos/">demos</a>. Definitely check them out because the demo I built is ugly as heck, but I just wanted to give it a whirl myself.
</p>

<p>
I whipped up this beauty in Adobe Illustrator and saved it as a SVG file.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ai.jpg" />
</p>

<p>
Once I had that, I wrote up a quick script to load this via Snap.svg.
</p>

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;Ray1&lt;&#x2F;title&gt;
        &lt;script src=&quot;..&#x2F;..&#x2F;dist&#x2F;snap.svg.js&quot;&gt;&lt;&#x2F;script&gt;
          &lt;script&gt;
               window.onload = function () {
                 var s = Snap(&quot;100%&quot;, 600);
                    Snap.load(&quot;first.svg&quot;, function(f) {
                         s.append(f);
                    });
                   
               };
         
          &lt;&#x2F;script&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;
         
          &lt;div id=&quot;graphic&quot;&gt;&lt;&#x2F;div&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>  

<p>
All this did was handle loading my SVG file and dropping it into the DOM for me. I knew I wanted to try manipulating the SVG itself, so I opened it up (remember, it is just XML) and added an ID to the red and blue blocks. Here's the definition for that wonderful piece of art.
</p>

<pre><code class="language-markup">
&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;
&lt;!-- Generator: Adobe Illustrator 17.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --&gt;
&lt;!DOCTYPE svg PUBLIC &quot;-&#x2F;&#x2F;W3C&#x2F;&#x2F;DTD SVG 1.1&#x2F;&#x2F;EN&quot; &quot;http:&#x2F;&#x2F;www.w3.org&#x2F;Graphics&#x2F;SVG&#x2F;1.1&#x2F;DTD&#x2F;svg11.dtd&quot;&gt;
&lt;svg version=&quot;1.1&quot; id=&quot;Layer_1&quot; xmlns=&quot;http:&#x2F;&#x2F;www.w3.org&#x2F;2000&#x2F;svg&quot; xmlns:xlink=&quot;http:&#x2F;&#x2F;www.w3.org&#x2F;1999&#x2F;xlink&quot; x=&quot;0px&quot; y=&quot;0px&quot;
      width=&quot;400px&quot; height=&quot;400px&quot; viewBox=&quot;0 0 400 400&quot; enable-background=&quot;new 0 0 400 400&quot; xml:space=&quot;preserve&quot;&gt;
&lt;rect x=&quot;99.5&quot; y=&quot;71.5&quot; fill=&quot;#E21B1B&quot; stroke=&quot;#000000&quot; stroke-miterlimit=&quot;10&quot; width=&quot;105&quot; height=&quot;52&quot; id=&quot;red&quot; &#x2F;&gt;
&lt;rect x=&quot;99.5&quot; y=&quot;141.5&quot; fill=&quot;#404AD3&quot; stroke=&quot;#000000&quot; stroke-miterlimit=&quot;10&quot; width=&quot;110&quot; height=&quot;165&quot; id=&quot;blue&quot; &#x2F;&gt;
&lt;&#x2F;svg&gt;
</code></pre> 

<p>
With IDs, I then added a bit of animation to my SVG:
</p>

<pre><code class="language-javascript">
               window.onload = function () {
                 var s = Snap(&quot;100%&quot;, 600);
                    Snap.load(&quot;first.svg&quot;, function(f) {
                         something = f.select(&quot;#red&quot;);
                         something.attr({% raw %}{fill:&quot;#000&quot;}{% endraw %});
                         something.animate({% raw %}{fill:&quot;#ff0000&quot;}{% endraw %},1000);
                         s.append(f);
                    });
                   
               };
</code></pre>

<p>
Not terribly exciting, but darn easy to use. If you are so inclined you can run a demo of this yourself here: <a href="http://www.raymondcamden.com/demos/2013/oct/22/test1.html">http://www.raymondcamden.com/demos/2013/oct/22/test1.html</a> The animation is pretty fast so pay attention. 
</p>

<p>
Give it a try yourself and let me know what you think.
</p>  

<p>
Just found this - a nice video introduction:
</p>

<iframe width="600" height="450" src="//www.youtube.com/embed/hyaiFapVOek" frameborder="0" allowfullscreen></iframe>