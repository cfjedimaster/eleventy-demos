---
layout: layout
title: Advanced Calendar
---

## Upcoming Events

Here's our upcoming events:

<ul>
{% for event in events %}
<li>{{ event.summary }} at {{ event.startValue }}
{% if event.location %}<br/>Located at {{ event.location }}{% endif %}
{% endfor %}

</ul>