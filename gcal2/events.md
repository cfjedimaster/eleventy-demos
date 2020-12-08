---
layout: layout
title: Advanced Calendar
---

## Upcoming Events

Here's our upcoming events:

<ul>
{% for event in events %}
<li>{{ event.title }} at {{ event.start | dtFormat }}
{% if event.description %}<br/>{{ event.description }}{% endif %}
{% if event.location %}<br/>Located at {{ event.location }}{% endif %}
{% endfor %}
</ul>
