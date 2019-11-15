---
layout: post
title:  "레이트레이싱, 패스 트레이싱, 디노이징"
date:   2019-11-15 09:00:00 +0900
categories: computer-grahics
tags: [raytracing, path tracing, denoising]
difficulty: middle
---
**레이트레이싱(ray tracing)** 시대가 오면서 **패스 트레이싱(path tracing)**이 더 자주 언급 되고 있다[^1].

오프라인 렌더링(비실시간 렌더링) 세계에서는 익숙한 용어들이지만 실시간 게임 렌더링에서는 이제 막 레이트레이싱이라는게 등장했는데 갑자기 패스 트레이싱이라는게 같이 등장해버린다. 패스 트레이싱은 레이트레이싱을 포함하기 때문에 실시간 렌더링에 조예가 깊더라도 오프라인 렌더링에 익숙하지 않은 사람들에게는 다소 혼란스러울 수 있다.

이 글에서는 둘의 차이를 알아보고 게임 렌더링에서는 어떤 의미가 있는지를 살펴본다. 그리고 그 와중에 반드시 언급되어야 하는 **디노이징(denosing)**까지 같이 알아보도록 하겠다.

## 래스터라이제이션과 레이트레이싱
레이트레이싱과 비교해서 **래스터라이제이션**의 가장 큰 특장을 하나만 말하라고 하면 래스터라이제이션은 반드시 카메라가 필요하다는 점을 들 수 있겠다.
래스터라이제이션에서는 렌더링에 필요한 삼각형을 카메라 앞에 두고 투영 행렬을 이용해서 화면에 맞게 변환하고 2D로 눌러서 화면의 픽셀 하나하나를 렌더링 한다.

{% include figure.html url="images/cg/raytracing-raster2.png" caption="그림 출처: [Rasterization: a Practical Implementation](https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation)" %}

반면 레이트레이싱은 카메라와 무관하게 렌더링에 필요한 계산을 할 수 있고 이것이 레이트레이싱이 반사에 강한 이유이다. 래스터라이제이션에서는 (물론 여러 트릭도 있지만) 거울과 같이 별도의 카메라를 설치할 수 있는 상황에서만 반사를 제대로 계산할 수 있는 반면 레이트레이싱에서는 어디서나 레이를 쏠 수 있기 때문에 어느 지점에서도 원하는대로 반사 계산을 할 수 있다.

## 레이트레이싱과 패스 트레이싱
레이트레이싱(ray tracing)과 패스 트레이싱(path tracing)은 결과적으로는 비슷해보이는데 패스 트레이싱이 좀 더 오래 걸리고 정확한 기법이다. 가령 일반적인 레이트레이싱 알고리즘에서는 픽셀당 광선을 하나씩 쏜다. 하나씩 쏜 후 거울 등을 표현하기 위해 재귀적으로 두 세번 더 트레이싱한다. 일반적으로는 여기까지가 일반적인 레이트레이싱 알고리즘이다.

{% include figure.html url="images/cg/RTinOneWeekend-1024x577.png" caption="거울 표현을 잘하는게 레이트레이싱의 특징이다.\\
그림 출처: [Fast and Fun: My First Real-Time Ray Tracing Demo](https://devblogs.nvidia.com/my-first-ray-tracing-demo/)" %}

기술적으로 본다면 위와 같은 기본적인 레이트레이싱은 주로 반사/스페큘러만 계산 한다. 조명 방향으로 레이를 한번 더 쏴서 그림자 여부를 판단 한 후 직접 조명을 계산한다. 이 때 GI(global illumination)의 스페큘러 영역만 계산하는 것이기 때문에 GI의 디퓨즈 영역은 결여 되어 있다.

**패스 트레이싱**은 쉽게 말하면 레이트레이싱을 이용해서 **GI**를 표현하는 것이다. 스페큘러와 디퓨즈 모두 계산을 하는 것이고 더 정확히 말하면 레이트레이싱을 이용해서 렌더링 공식(rendering equation)을 계산한다고 보면 된다. 주목할만한 특징은 패스 트레이싱에서는 직접 조명을 따로 계산하지 않아도 된다는 것이다.

아래 영상은 패스 트레이싱이 뭔지 쉽게 설명해주는 것으로 그림으로 매우 쉽게 설명을 한다.

<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/frLwRLS_ZR0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

위 영상으로도 알 수 있다시피 패스 트레이싱은 무수히 많은 광선을 쏴야 하기 때문에 실시간으로 계산하기에는 무리가 많다.

## 글로시와 디노이징
여기서 말하는 디노이징(denoising)은 단순히 화면의 노이즈를 줄이는 것이 아니다. 렌더링 공식을 계산하기 위해서는 수십개를 쏘야야 한다고 말했었다. 수백까지 쏘는건 따라갈 수 없겠지만, 현재 계산하고자 하는 픽셀과 주변 픽셀이 레이트레이싱으로 비슷한 곳을 샘플링한다면 그 샘플링한 결과물들을 공유할 수 있을 것이다. 가령 반사 광선을 픽셀당 하나씩 쏜다면 주변 픽셀과 그걸 공유해서 각 픽셀이 여러개를 공유하는 것처럼 만들 수 있다.

패스 트레이싱을 제외하고 실시간 레이트레이싱만 살펴 보자. 단순한 반사는 반사 레이를 한번 더 쏘면 되기 때문에 매우 처리가 간단하다. 하지만 글로시(glossy)의 경우 계산 해야하는 범위가 넓어지기 때문에 수십개에서 수백개의 레이를 쏴야만 만족스러운 결과를 알 수 있다.

{% include figure.html url="images/cg/ndc19-brdf-specular.png" caption="(완벽한) 거울은 추가 레이 하나로 처리가 가능하다. 일반적인 스페큘러는 수십개/수백개를 쏴야한다.\\
그림 출처: [[NDC 2019] 드래곤 하운드의 PBR과 레이트레이싱 렌더링 기법](https://speakerdeck.com/hybrid3d/ndc-2019-deuraegon-haundeuyi-pbrgwa-reiteureising-rendeoring-gibeob)" %}

이 글로시는 흔히 스페큘러의 모양을 만드는 것과 같은 것이다. 반사 되는 영역이 얼마나 퍼지는지를 나타내는 것으로 퐁 모델(phong model)에서는 지수를 가지고 처리했고, PBR 모델에서는 러프니스로 처리하는 영역이다.

{% include figure.html url="images/cg/before-after-denoising.png" caption="그림 출처: [[NDC 2019] 드래곤 하운드의 PBR과 레이트레이싱 렌더링 기법](https://speakerdeck.com/hybrid3d/ndc-2019-deuraegon-haundeuyi-pbrgwa-reiteureising-rendeoring-gibeob)" %}

디노이징은 화면 기준(screen-space)으로 처리 되는데, 가급적 많은 정보를 이용한다. 월드 좌표, 노말, 러프니스 등을 이용해서 주변 픽셀과 데이터를 공유하고 여기에 TAA(temporal anti-aliasing)과 같은 시간 필터(temporal filter)까지 사용한다면 이전 프레임에서 쏜것도 같이 공유할 수 있다.

디노이징의 과정은 Tomasz Stachowiak의 [Stochastic Screen-Space Reflections (SIGGRAPH 2015)][1]에도 잘 나와 있고 좀 더 심도 있는 알고리즘은 [Spatiotemporal variance-guided filtering: Real-time reconstruction for path-traced global illumination][2]을 참고하면 좋다.

## 마무리
이 글에서는 레이트레이싱을 래스터라이제이션과 패스 트레이싱과 간단하게 비교해보았다. 렌더링 공식이나 패스 트레이싱, 디노이저 같은 주제들을 지금 보다는 더 깊게 다루려 했지만 각각의 주제가 워낙 깊은 주제이기 때문에 간략하게만 다뤘다.

래스터라이제이션과 레이트레이싱이 어떻게 다른지, 레이트레이싱과 패스 트레이싱이 어떻게 다른지, 디노이저는 왜 필요한지가 간략하게 전달되었으면 좋겠다.

### 레퍼런스
* [Stochastic Screen-Space Reflections (SIGGRAPH 2015) by Tomasz Stachowiak][1]
* [Spatiotemporal variance-guided filtering: Real-time reconstruction for path-traced global illumination (HPG 2017) by Christoph Schied et al.][2]

[1]: https://www.ea.com/frostbite/news/stochastic-screen-space-reflections "Stochastic Screen-Space Reflections by Tomasz Stachowiak"
[2]: https://research.nvidia.com/publication/2017-07_Spatiotemporal-Variance-Guided-Filtering%3A "Spatiotemporal variance-guided filtering: Real-time reconstruction for path-traced global illumination by Christoph Schied et al."

[^1]: 레이트레이싱은 영문으로도 raytracing과 ray tracing 으로 그때그때 다르게 표현 된다. 워낙 널리 쓰이기 때문에 붙인 채로 고유 명사처럼 사용되기도 한다. 최근 NVIDIA 통해 대두된 레이트레이싱은 ray tracing 처럼 띄어쓰기를 하는 추세이지만, 붙여 쓰기를 한 옛날 문서들도 많을 뿐더러 DXR의 DirectX Raytracing 은 붙여쓰기를 하는 것이 공식 명칭이다. 따라서 영어에서는 붙여쓰기 쓰기에 대한 공식적인 표기법은 없다. 이 블로그에서는 레이트레이싱은 붙여쓰기를 쓰도록 하고, 패스 트레이싱은 띄어 쓰기로 한다.