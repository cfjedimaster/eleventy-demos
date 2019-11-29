---
layout: post
title: "Creating Next/Previous Links in HarpJS"
date: "2014-02-26T09:02:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2014/02/26/Creating-NextPrevious-Links-in-HarpJS
guid: 5166
---

<p>
Before I start - a quick apology. I know that this particular topic has been covered before, but I'm having a heck of a time finding the article. I wanted to build a quick example for a friend anyway so I thought I'd share. In this example, I've got a HarpJS site with a list of articles. For fun I also added a main image for each article. Here is the data source.
</p>
<!--more-->
<pre><code class="language-javascript">{
	"article1":{
		"title":"Article One",
		"img":"/img/k1.jpg"
	},
	"article2":{
		"title":"Article Two",
		"img":"/img/k2.jpg"
	},
	"article3":{
		"title":"Article Three",
		"img":"/img/k3.jpg"
	}
}
</code></pre>

<p>
Next I whipped up a quick index page to list my articles. Notice that I'm also including a thumbnail (via CSS) version of the image in the list as well. This is me being fancy - I hope you are impressed.
</p>

<pre><code class="language-markup">&lt;h2&gt;Articles&lt;&#x2F;h2&gt;

&lt;% 
	for(articleKey in public.articles._data) {
		article = public.articles._data[articleKey];
%&gt;
	&lt;p&gt;
	&lt;img src=&quot;&lt;{% raw %}%- article.img %{% endraw %}&gt;&quot; class=&quot;articleImageList&quot;&gt; 
	&lt;a href=&quot;&#x2F;articles&#x2F;&lt;{% raw %}%- articleKey %{% endraw %}&gt;.html&quot;&gt;&lt;{% raw %}%- article.title %{% endraw %}&gt;&lt;&#x2F;a&gt;
	&lt;&#x2F;p&gt;
	&lt;br clear=&quot;left&quot;&gt;
&lt;{% raw %}% }{% endraw %} %&gt;

</code></pre>

<p>
A screen shot - I didn't include the source of the CSS but the entire application is posted as an attachment to this entry.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_26_14__8_57_AM.png" />
</p>

<p>
Ok, now lets talk Next/Previous links. I created three article files and pasted in some random text (thank you <a href="http://cajunipsum.com/">Cajun Ipsum</a>). In order to simplify article display, I put a header and footer partial in each file. (Note - this is because HarpJS does not support nested layouts. There is a workaround for this that I'll show later.) Here is a sample article, minus some of the boilerplate text.
</p>

<pre><code class="language-markup">
&lt;{% raw %}%- partial(&quot;_articleheader&quot;) %{% endraw %}&gt;

&lt;p&gt;
Boiled crawfish pecan pie food etoufee andouille football. Envie levee andouille bisque couillon beignet envie yams. Praline jambalaya tasso sa fait chaud sugar cane hot sauce remoulade po-boy boiled crawfish. Boudreaux pirogue sa fait chaud boucherie smoked sausage Boudreaux interstate bourre andouille. Sa fait chaud bourre trail ride viens ci mirliton. Turducken fais do do bread pudding coffee bisque Acadiana turducken coffee pirogue alligator. Viens ci boudin bourre sa fait chaud praline canaille levee macque choux gumbo bonjour. Couillon fried catfish bisque canaille bbq. 
&lt;&#x2F;p&gt;

&lt;{% raw %}%- partial(&quot;_articlefooter&quot;) %{% endraw %}&gt;

</code></pre>

<p>
Don't worry about the article header. All it does is output the title and the image. The footer is where the magic is. For my example, I decided to <i>always</i> include text for previous and next links, but to simply disable the link when you were at the beginning or end of the list. It would take a few seconds to modify the code to not display anything instead in those situations. Here is my partial.
</p>

<pre><code class="language-javascript">
&lt;%
var pos, prevLink, nextLink;
var articles = Object.keys(public.articles._data);

if(articles[0] != current.source) {
	pos = articles.indexOf(current.source);
	prevLink = &quot;&lt;a href=&#x27;&#x2F;articles&#x2F;&quot; + articles[pos-1] + &quot;.html&#x27;&gt;Previous Article&lt;&#x2F;a&gt;&quot;;
} else prevLink = &quot;Previous Article&quot;;

if(articles[articles.length-1] != current.source) {
	pos = articles.indexOf(current.source);
	nextLink = &quot;&lt;a href=&#x27;&#x2F;articles&#x2F;&quot; + articles[pos+1] + &quot;.html&#x27;&gt;Next Article&lt;&#x2F;a&gt;&quot;;
} else nextLink = &quot;Next Article&quot;;

%&gt;

&lt;{% raw %}%- prevLink %{% endraw %}&gt; &#x2F; &lt;{% raw %}%- nextLink %{% endraw %}&gt;

&lt;br clear=&quot;left&quot;&#x2F;&gt;</code></pre>

<p>
Not exactly rocket science, right? I simply get the keys from the data and see if I'm currently at the start or end. (Remember HarpJS supports <a href="http://harpjs.com/docs/development/current">passing data</a> about where you are currently.) And that's it. Here is a screen shot from the first article as an example.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_26_14__9_04_AM.png" />
</p>

<p>
You can download the source for this demo below.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fprevnextexample%{% endraw %}2Ezip'>Download attached file.</a></p>