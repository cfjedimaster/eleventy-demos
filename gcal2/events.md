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


<!--
	if(e.start.date) event.start = e.start.date;
	if(e.start.dateTime) event.start = e.start.dateTime;
	if(e.end.date) event.end = e.end.date;
	if(e.end.dateTime) event.end = e.end.dateTime;
-->