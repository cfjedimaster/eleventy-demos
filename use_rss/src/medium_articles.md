---
pagination:
   data: medium2
   size: 1
   alias: article
permalink: "syndicated-articles/{{ article.title | slug }}/index.html"
---

<h2>{{ article.title }}</h2>
<p>
Posted on {{ article.niceDate}}, originally from <a href="{{article.link}}" target="_new">{{article.link}}</a>.
</p>

{{ article.content }}

