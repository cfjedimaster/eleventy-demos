
<h3>Recent Articles from My Friends</h3>

<ul>
{% for article in multi %}
<li><a href="{{ article.link }}">{{ article.title }}</a> <i>(published on {{ article.blog.title}} at {{ article.niceDate }})</i></li>
{% endfor %}
</ul>