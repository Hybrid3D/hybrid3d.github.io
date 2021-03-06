---
layout: post
title:  "깃 비공개 커밋 팁"
date:   2019-06-16 18:00:00 +0900
categories: general
tags: [git, merge]
difficulty: middle
redirect_from: /2019/06/16/깃-비공개-커밋-팁
---
**깃(git**)을 사용할 땐 종종 **비공개(private) 커밋(commit)**을 사용하고 싶어질때가 있다. 작업 중간 과정은 감추면서 원하는 단계에서만 공개가 되었으면 하는 것이다. 푸쉬를 하여 공개하는 것과는 다른데 일반적인 커밋과 푸시로는 모든 커밋이 다 남아 있기 때문이다. 깃을 잘 모를 때는 그런 방법이 없는 줄 알았는데 좀 익숙해지니까 뻔한 방법으로 가능했다. 아마 깃에 익숙한 사람은 첫줄만 보고도 뭔지 눈치채지 않았을까.

방법은 간단하다. 머지할 때 **스쿼시(squash)**를 이용하면 되고 이중으로 **비공개 리모트(remote)**를 따로 관리하면 된다. 비공개 커밋 작업은 비공개 리모트에서 커밋하고 머지 할 때 스쿼시 머지를 하면 된다.

예를 들어서 공개용 origin 리모트가 있으면 추가로 비공개 리파지토리를 만들어서 origin-private 라는 리모트 이름으로 추가한다. 요즘 [bitbucket](https://bitbucket.org/) 이나 [github](https://github.com/)에 비공개 리파지토리를 만들 수 있으니 새로 만들기 편하다.

비공개로 할 작업이 있다면 feature/work 라는 브랜치를 만든다. 이 비공개 브랜치는 origin 에는 올리지 않고 origin-private 에서만 올리면서 작업한다. 그 후 나중에 이 브랜치를 master 에 머지할때 squash merge 로 머지하면 된다.

```bash
(master 브랜치에서)
$ git merge --squash feature/work
```

이때 입력하는 커밋 메세지는 공개용으로 정식으로 작성하고 origin 에 푸쉬한다.

여담으로 이 블로그도 이런 식으로 작업하고 있다. 비공개 브랜치에서 _draft 디렉토리에서 글을 작성하고 공개 할 경우 _posts로 옮긴다[^1]. 글을 _posts 로 옮긴 후 스쿼시 머지를 이용해서 공개 브랜치에 옮긴다.

[^1]: _draft, _posts 는 블로그 프레임워크 jekyll 의 디렉토리 규칙이다. _draft 에 있는 글은 공개 되지 않는 글이고 _posts 의 글이 공개 되는 글이다.