---
layout: post
title: "List auto-dividers in Ionic"
date: "2014-11-06T17:11:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/11/06/Autolist-dividers-in-Ionic
guid: 5344
---

<p>
This question came up on StackOverflow recently and I took a stab at answering it. The user had a list of data that included dates. They were looking to see if there was an easy way to add <a href="http://ionicframework.com/docs/components/#item-dividers">dividers</a> to the list automatically. jQuery Mobile actually <a href="http://api.jquerymobile.com/listview/#option-autodividers">supports</a> this out of the box - and supports it well. By default it will use the first letter of your list data as a separator (so "Andy" and "Al" will be prefixed with an "A" divider) but you can also use a function to specify your own logic.
</p>
<!--more-->
<p>
While there is no similar feature in Ionic (I filed <a href="https://github.com/driftyco/ionic/issues/2484">this issue</a> for it) it isn't too difficult to build it manually. The CodePen I built handles it like so.
</p>

<p>
First, the controller code modifies the array to include an item for each necessary divider.
</p>

<pre><code class="language-javascript">.controller('RootCtrl', function($scope) {

  //orig data
  var list = [];
  list.push({% raw %}{name:"Gary"}{% endraw %});
  list.push({% raw %}{name:"Gosh"}{% endraw %});
  list.push({% raw %}{name:"Ray"}{% endraw %});
  list.push({% raw %}{name:"Sam"}{% endraw %});
  list.push({% raw %}{name:"Sandy"}{% endraw %});

  $scope.list = [];
  var lastChar = '';
  for(var i=0,len=list.length; i&lt;len; i++) {
    var item = list[i];

    if(item.name.charAt(0) != lastChar) {
      $scope.list.push({% raw %}{name:item.name.charAt(0),letter:true}{% endraw %});
      lastChar = item.name.charAt(0);
    }
    $scope.list.push(item);
    
  }
})
</code></pre>

<p>
That feels lame - I mean modifying the list - but I'm doing it in my controller and not the back end service so I can still sleep at night. The next change is to the front end. (And the Ionic team deserves credit for this as I modified this from one of their examples.)
</p>

<pre><code class="language-markup">&lt;ion-list type=&quot;list-inset&quot;&gt;
      &lt;ion-item ng-repeat=&quot;person in list&quot; ng-class=&quot;person.letter? &#x27;item-divider&#x27;:&#x27;&#x27;&quot;&gt;
        {% raw %}{{person.name}}{% endraw %}
      &lt;&#x2F;ion-item&gt;
    &lt;&#x2F;ion-list&gt;</code></pre>

<p>
Basically - since a list divider is simply a class change, we can iterate over our array and include the class when the letter property exists in the data. I don't like the fact that I use person.name when I'm doing a letter, but, it works. I <i>really</i> think smarter people than me can do this nicer, so please feel free to fork the CodePen and make it nicer!
</p>

<p>
<a href="http://codepen.io/cfjedimaster/pen/HqrBf">Code Pen: List Test - Autodividers</a>
</p>