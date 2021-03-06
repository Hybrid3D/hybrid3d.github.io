---
layout: post
title:  "SSPM 커스틱 영상"
date:   2019-05-12 01:00:00 +0900
categories: computer-graphics
tags: [raytracing, rtg, sspm, photon_mapping]
redirect_from: /596
---
**레이트레이싱 젬스(Ray Tracing Gems)**에서 기고하면서 구현했던 **SSPM(Screen-Space Photon Mapping)**이다. NDC 발표에서는 이 영상을 빨리감기로 편집해서 보여줬었다.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/T_b6StxmMfQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

사실 이 영상은 제작 초기 영상으로 완벽한 세팅 버전의 동영상이 아니다. 제대로 튜닝한 버전에서는 커스틱이 좀 더 부드럽다.

새 버전의 영상을 못 만들고 있는 이유가 있는데, 저 작업물이 윈도우 RS4 버전의 영상이라 지금 RS5 버전인 윈도우에서는 돌릴 수 없다. 윈도우를 RS4 로 내리긴 귀찮고, 구현을 RS5 버전으로 이전하면 되는데 다른 일로 아직 진행을 못하고 있다.

현재는 틈틈히 Falcor 엔진에 포팅하고 있다. 이건 원래 1월달에 끝났어야 할 일인데, 여러가지 일로 바쁘다보니 많이 미뤄졌다. 리소스와 씬 세팅이 제일 귀찮고 고된 일이었다.

소스 공개는 언젠가는 분명 할 것이고, 구현하다만 커스텀 디노이저도 구현 할 것이다. 그 내용들은 나중에 다시 다루겠다.
