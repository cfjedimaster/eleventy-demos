---
layout: post
title: "AngularJS Tip - Avoid Multiple Variables in ng-src"
date: "2014-03-29T12:03:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/03/29/AngularJS-Tip-Avoid-Multiple-Variables-in-ngsrc
guid: 5187
---

<p>
Before I start, let me be clear I'm still learning AngularJS and this "tip" may be 100% wrong. I just ran into this with an application and most likely there is a better way to address what I did.
</p>
<!--more-->
<p>
In the application I'm building, I've got a detail page that displays an image. The site uses an image folder that uses a subdirectory for the size of the image, so for example, the base image folder is: foo.com/products/images. For the thumbnail of product X, the image would be: foo.com/products/images/thumbs/x.jpg. For the larger size, it would be: foo.com/products/images/large/x.jpg.
</p>

<p>
To make things simpler, I used a partial that looked like this.
</p>

<pre><code class="language-markup">&lt;img ng-src="{% raw %}{{imageroot}}{% endraw %}/{% raw %}{{product.image}}{% endraw %}"&gt;
</code></pre>

<p>
For folks who <i>don't</i> know Angular, the ng-src directive ensures that when the partial is loaded, the browser doesn't try to load an invalid image. If I had used src="...", there would be two network requests - first for the tokenized version of the URL and then for the real value. 
</p>

<p>
I thought this was working fine, but I then noticed something odd in my network tools - a request for foo.com/products/images/thumbs. From what I can see, it looks like Angular sets the src of the image element as soon as it is able to replace one of the tokens. 
</p>

<p>
To fix this, I simply edited the template to use one variable and I set that value properly in my controller. 
</p>

<pre><code class="language-markup">&lt;img ng-src="{% raw %}{{image}}{% endraw %}"&gt;
</code></pre>

<p>
The controller code:
</p>


<pre><code class="language-javascript">$scope.product = data;
$scope.image = IMG_URL + "thumbs/" + data.image;
</code></pre>