---
layout: page
permalink: /category/
title: 카테고리
sitemap: false
published: true
---

<div id="archives">
  {% for category in site.category %}
    {% assign category_name = category.name %}
    <div class="archive-group">
      <h3 class="category-head">{{ category.title }} <small><a href="/{{category_name}}/">{{ site.categories[category_name].size }}</a></small></h3> 
      <ul class="posts-list">
        {% for post in site.categories[category_name] limit: 5 %}
        <li>
          <h4>
            <a href="{{ site.baseurl }}{{ post.url }}">
              {{ post.title }}
            </a>
            <small>{{ post.date | date_to_string }}</small>
          </h4>
        </li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>
