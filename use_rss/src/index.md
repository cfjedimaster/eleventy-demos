<!--
I just do the basics. :)
-->

<h3>Recent Articles on Medium</h3>

Here is my most recent set of articles on Medium. For a full list, 
see my [profile](https://medium.com/@cfjedimaster).

<ul>
{% for article in medium %}
<li><a href="{{ article.link }}">{{ article.title }}</a></li>
{% endfor %}
</ul>