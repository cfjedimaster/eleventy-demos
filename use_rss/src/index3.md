<!--
Nicer date!
-->

<h3>Recent Articles on Medium</h3>

Here is my most recent set of articles on Medium. For a full list, 
see my [profile](https://medium.com/@cfjedimaster).

<ul>
{% for article in medium2 %}
<li><a href="/syndicated-articles/{{ article.title | slug }}/index.html">{{ article.title }}</a> <i>(published {{ article.niceDate }})</i>
</li>
{% endfor %}
</ul>