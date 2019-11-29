---
layout: post
title: "Check out CodeSchool's Angular course"
date: "2014-07-29T15:07:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/07/29/Check-out-CodeSchools-Angular-course
guid: 5277
---

<p>
I've raved about CodeSchool before so I thought folks might be interested in knowing they have a really cool new course for AngularJS: <a href="https://www.codeschool.com/courses/shaping-up-with-angular-js">Shaping Up with AngularJS</a>. Best of all - the course is free. I didn't learn a lot from it as I think I've got the basics covered well, but I enjoyed going through the lessons to help reinforce my existing knowledge. As with other courses, they do a real good job of building lessons that let you code without being particular about things like tabs, spaces, whatever. 
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/sua.jpg" />
</p>

<p>
There were a couple of issues I had with the course however. The smallest one was, and this may sound petty, but the "cutsey" song before each lesson almost made me jump off a cliff. I like the fact that CodeSchool creates these cute little musical intros, but if you are doing an entire course in one afternoon, it gets old <i>extremely</i> quickly. In my opinion they should <i>really</i> consider skipping the intros after the first lesson. On the flip side, I liked that they include outtakes at the end of each video.
</p>

<p>
The other issue I ran into was with the lessons. So I know I just praised how they let you answer solutions without being picky about how you write your code, but sometimes it was picky in ways that could be confusing to users. Here is a great example. You are asked to modify an HTML template to add a value. So basically going from this: <code>&lt;span&gt;-- &lt;/span&gt;</code> to this: <code>&lt;span&gt;-- {% raw %}{{author}}{% endraw %}&lt;/span&gt;</code>. Notice how the author token comes after the two dashes with a space? If you didn't edit the template to match that exactly, you were told you had not completed the task correctly. To me, this is something that could have been handled much easier. I don't know how they do their validation, but if they were checking for the exact string "-- {% raw %}{{author}}{% endraw %}" they could have switched to something more generic. I know this probably sounds a bit petty too, but I worry about it confusing/blocking students.
</p>

<p>
The most surprising issue, and one that will probably cause Angular folks to scratch their heads, is that none of the examples makes use of $scope. Now... as a technical blogger, I know for a fact I've sometimes skipped best practices when teaching some particular concept. I'll make that call when I think it makes sense. But for the life of me I can't imagine why they would skip showing $scope when it seems like such an important facet of Angular development. I'm still a newbie of course so maybe I'm overstating it, but it seems truly odd. I think it will trip people up who go from this course to another one.
</p>

<p>
Finally, I wish the course's code was available for download. When you do the lessons, you only have to write a few lines at a time. So for example, they may have you modify a JavaScript file but you only need to worry about three lines. I liked the examples (despite the issue above) and I wish I could have had them locally to play with later. Yes, I could cut and paste, but it seems like an obvious thing they could do to improve the course.
</p>

<p>
So, all in all, I definitely recommend it, and heck, you can't beat the price. CodeSchool will be offering a commercial course later on and I plan on taking that too.
</p>

<p>
p.s. I'm currently taking the <a href="https://www.codeschool.com/courses/javascript-best-practices">JavaScript Best Practices</a> course. I'll review it here when I'm done.
</p>