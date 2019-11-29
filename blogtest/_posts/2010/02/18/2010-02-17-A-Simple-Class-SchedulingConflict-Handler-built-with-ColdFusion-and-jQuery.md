---
layout: post
title: "A Simple Class Scheduling/Conflict Handler built with ColdFusion and jQuery"
date: "2010-02-18T07:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/02/18/A-Simple-Class-SchedulingConflict-Handler-built-with-ColdFusion-and-jQuery
guid: 3723
---

Reader X emailed me earlier this week with an interesting problem. He was looking into building a class scheduling system but wanted a way to hande time conflicts on the client. He was currently making use of Flash Forms (which I strongly urge everyone to avoid) but wanted to switch to a pure HTML/JavaScript solution instead. I built up the following demo as one possible way to solve the problem. As always, comments and suggestions are welcome, but remember that this is mainly a proof of concept.
<!--more-->
<p/> 
To begin, I'm going to create an Application.cfc file that will create a static list of classes. I've intentionally creates a set of classes that are one hour long as well as another list of two hour classes. This will create two simulateneous set of classes and force a situation where we need to check for conflicts.
<p/> 
<code>
component {

        this.name = "classes test";
        this.sessionManagement = true;
        
        public boolean function onApplicationStart(){
                //hard coded static data
                var data = [];
                data[1] = {% raw %}{ id=1, name="Class A", start="2/14/2009 8:00 AM", end="2/14/2009 9:00 AM" }{% endraw %};
                data[2] = {% raw %}{ id=2, name="Class B", start="2/14/2009 9:15 AM", end="2/14/2009 10:15 AM" }{% endraw %};
                data[3] = {% raw %}{ id=3, name="Class C", start="2/14/2009 10:30 AM", end="2/14/2009 11:30 AM" }{% endraw %};
                data[4] = {% raw %}{ id=4, name="Class D", start="2/14/2009 11:45 AM", end="2/14/2009 12:45 PM" }{% endraw %};
                data[5] = {% raw %}{ id=5, name="Class E", start="2/14/2009 1:00 PM", end="2/14/2009 2:00 PM" }{% endraw %};
                data[6] = {% raw %}{ id=6, name="Class F", start="2/14/2009 2:15 PM", end="2/14/2009 3:15 PM" }{% endraw %};
                data[7] = {% raw %}{ id=7, name="Class G", start="2/14/2009 3:30 PM", end="2/14/2009 4:30 PM" }{% endraw %};

                data[8] = {% raw %}{ id=8, name="Class AA", start="2/14/2009 8:00 AM", end="2/14/2009 10:00 AM" }{% endraw %};
                data[9] = {% raw %}{ id=9, name="Class BB", start="2/14/2009 10:15 AM", end="2/14/2009 12:15 PM" }{% endraw %};
                data[10] = {% raw %}{ id=10, name="Class CC", start="2/14/2009 12:30 PM", end="2/14/2009 2:30 PM" }{% endraw %};
                data[11] = {% raw %}{ id=11, name="Class DD", start="2/14/2009 2:45 PM", end="2/14/2009 4:45 PM" }{% endraw %};
        
                application.classes = data;
                return true;
        }

        public boolean function onRequestStart(string req) {
                if(structKeyExists(url, "init")) {% raw %}{ onApplicationStart(); onSessionStart(); }{% endraw %}
                return true;
        }
        
        public boolean function onSessionStart() {
                session.classes = [];
                return true;
        }
                
}
</code>
<p/>
Notice that I've also used the onSessionStart method to initialize an array for the user's selected classes. Now let's move to the front end. I began with a simple design that contained a drop down of classes a user could add, a list of currently selected users, and a third block that was used for debugging purposes.
<p/> 
<code>
&lt;h2&gt;Add Class&lt;/h2&gt;
&lt;form id="addclass"&gt;
&lt;select id="classlistSelector"&gt;
&lt;cfloop index="c" array="#application.classes#"&gt;
        &lt;cfoutput&gt;&lt;option value="#c.id#"&gt;#c.name# (#c.start# - #c.end#)&lt;/option&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/select&gt; &lt;input type="button" id="addButton" value="Add Class"&gt;
&lt;/form&gt;

&lt;h2&gt;Your Classes&lt;/h2&gt;
&lt;div id="classlist"&gt;&lt;/div&gt;

&lt;p&gt;
&lt;a href="index.cfm?init=true"&gt;Restart&lt;/a&gt;
&lt;/p&gt;
&lt;cfdump var="#application#" label="Application" expand="false"&gt;
&lt;cfdump var="#session#" label="Session" expand="false"&gt;
</code>
 <p/>
For the most part this should be pretty vanilla. You see me making use of the class list on top. I've got a blank div for my class list. We're going to take care of that next. All the bits are here - so now it's time to look at some jQuery that will handle making this work.
 <p/>
<code>
&lt;script&gt;
function displayMyClasses() {
        var myclasses = $.getJSON("classes.cfc?method=getmyclasses&returnformat=json", {}, function(data) {
                var s = ""
                for(var i=0; i &lt; data.length; i++) {$
                        s += "&lt;p&gt;&lt;b&gt;" + data[i].NAME + "&lt;/b&gt;&lt;br/&gt;"
                        s += data[i].START + " to " + data[i].END
                        s += "&lt;/p&gt;"
                }
                $("#classlist").html(s)
        })
}

$(document).ready(function() {

        displayMyClasses()

        $("#addButton").click(function() {
                //get the value of the class
                var classid = $("#classlistSelector option:selected").val()
                //now try to add it
                $.getJSON("classes.cfc?method=addclass&returnformat=json", {% raw %}{classid:classid}{% endraw %}, function(data) {
                        if(data == true) displayMyClasses()
                        else alert("Sorry, there is a time conflict with that class!")
                })
        })
})
&lt;/script&gt;
</code>
<p/> 
There are two main functions here. First, my document.ready block (I tend to assume my readers all use jQuery, which isn't fair, so just consider that block as a 'When I'm done, do this' block) and a displayMyClasses function. Let's focus on the document.ready area first. It begins by calling displayMyClasses. We will discuss that next. It then adds a listener for the button we had in our form. This will handle getting the selected item from the select tag and passing it to a CFC. This CFC will return true or false depending on if we were able to add the class. On a successful add, we just redraw the selected classes. On a failure we use an alert. (Let me just add - I freaking hate alerts. But for now it is a quick and dirty way to handle it.)
 <p/>
Going up a bit to displayMyClasses, you can see it calling the CFC again (which we will show next). It asks for the user's classes and simply displays it in HTML.
 <p/>
So far so good. For the final bit, let's open the CFC. This CFC is <b>one big mess of bad</b> - specifically I've got Application and Session variables in there. In a "properly architected application" this wouldn't be there, but I'd still be writing. Since the focus of this entry was on the front end, I felt it was good decision to make. That being said - here is the component:
 <p/>
<code>
component {

        remote boolean function addClass(numeric classid) {
                //only add if I don't have it - return true just means ignore the re-add
                if(hasClass(arguments.classid)) return true;

                if(!hasConflict(arguments.classid)) {
                        arrayAppend(session.classes, arguments.classid);
                        return true;
                } else {
                        return false;
                }
                
        }
        
        public struct function getTheClass(numeric id) {
                var classes = getClasses();
                for(var i=1; i &lt;= arrayLen(classes); i++) {
                        if(classes[i].id == arguments.id) return classes[i];
                }
        }
        
        public array function getClasses() {
                return application.classes;
        }

        remote array function getMyClasses() {
                var result = [];
                for(var i=1; i &lt;= arrayLen(application.classes); i++) {
                        if(hasClass(application.classes[i].id)) arrayAppend(result, application.classes[i]);
                }
                return result;
        }
        
        public boolean function hasClass(numeric id) {
                for(var i=1; i &lt;= arrayLen(session.classes); i++) {
                        if(session.classes[i] == arguments.id) return true;
                }
                return false;
        }
        
        public boolean function hasConflict(numeric id) {
                var theclass = getTheClass(arguments.id);

                var myclasses = getMyClasses();
                for(var i=1; i &lt;= arrayLen(myclasses); i++) {
                        //same start time?
                        if(dateCompare(myclasses[i].start, theclass.start) == 0) return true;
                        //is the start time before my start and end after my start?
                        if(dateCompare(myclasses[i].start, theclass.start) == -1 && dateCompare(myclasses[i].end, theclass.start) == 1) return true;
                        //does my new class end after the start of my class and also begin before the end?
                        if(dateCompare(myclasses[i].start, theclass.start) == 1 && dateCompare(myclasses[i].start, theclass.end) == -1) return true;                                    
                }
                return false;
        }

}
</code>
 <p/>
There's a bunch of functions here - but most are pretty trivial, like getClasses and getTheClass. Both of these would use SQL/ORM instead of what I have here, but again, it's just a demo. The critical function is addClass. The logic is relatively simply - if we have the class already, silently fail. If we don't have a conflict, add it. I migrated the 'conflict' logic to it's own method in order to keep the logic simple.
 <p/>
hasConflict() uses 3 rules to determine if there is a conflict:
 <p/>
1) Do I have a class that starts at the same time as the one I want to add?
 <p/>
2) Do I have a class that starts before the one I want to add and ends after it begins?
 <p/>
3) Do I have a class that starts after the new one begins and ends before the new one ends?
 <p/>
There is a chance I may be missing something there. The good thing though is that if I do find a logic mistake, I can correct it here and keep addClass relatively simple.
<p/>
You can play with a demo of this here: <a href="http://www.raymondcamden.com/demos/feb172010/">http://www.coldfusionjedi.com/demos/feb172010/</a>
 <p/>
So all in all - it works (until someone finds a bug :) but it's missing a few things that would make it nicer. First - the drop down should remove classes after you've added them. Sure the application just ignores a re-add, but it would be nice to make the list smaller. It would also be nice to default the list to classes you haven't added. If I reload the page then the drop down should only contain classes I haven't added. We can even go further - why not display a list of classes we <i>can't</i> add anymore because of conflicts? I'll explore these options and more in the next version.
<p/>
p.s. I wrote this entry in Evernote, and when I pasted it in, my code blocks got a bit fubared. First I lost all my line breaks. I fixed that by emailing myself the note. However, when I pasted in from the email I seemed to have lost my tabbing. Please forgive the format of the samples above.