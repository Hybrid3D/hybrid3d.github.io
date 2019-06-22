---
layout: post
title:  "PBR에 대한 흔한 오해 - 사실적인 렌더링"
date:   2018-04-12 01:00:00 +0900
categories: computer-graphics
tags: [pbr, ibl]
difficulty: low
redirect_from: /279
---
## 수정
### [2019-04-10]
1. "PBR 에서는 디퓨즈는 아래에서 설명할 IBL로 표현하고"를 "디퓨즈는 램버트(Labertian) 등의 공식을 사용하고"로 정정하였다. IBL은 스페큘러 담당이라 디퓨즈와 무관하다. 잘못 쓴 것은 예전에 발견했는데 수정을 깜빡했다.
2. 이 글에서는 디퓨즈를 시선 독립적인 것으로 적었다. 크게 다르진 않지만, 100% 정확한 표현은 아니다. 관련 참고 사항을 추가하였다.

---

**PBR(Physically-based Rendering)**은 요즘 게임 렌더링에서 가장 핫한 주제 중 하나다. 널리 알려졌지만, 종종 이에 대해 오해하여 단순히 PBR을 사실적인 걸로만 단순하게 생각하는 경우가 있다.

PBR에 대해서 흔히 할 수 있는 오해할 수 있는 것은 두가지다

1. PBR의 결과물은 무조건 사실적이다
2. 사실적인 렌더링은 곧 PBR이다.

PBR의 결과물은 항상 사실적인가? 라는 질문으로 바꿔보면 이 대답은 반은 맞고 반을 틀렸다. PBR의 결과물은 대체적으로 사실적이지만 반드시 실사풍은 아니다.

이 글은 프로그래머 수준은 아니지만, 퐁 쉐이딩 같은 기본적인 쉐이딩 및 라이팅과 PBR의 기본적인 파라미터 흐름은 어느정도 알고있다고 가정한다. 단, 이 글은 PBR에 대한 오해를 풀고 핵심적인 내용이 뭔지를 살펴보는 것이지, PBR 자체를 깊게 설명하는데 그 목적을 두진 않는다.

# PBR 이전의 쉐이딩
PBR 이전에는 디퓨즈(diffuse)와 스페큘러(specular)의 조절을 아티스트가 직접 비직관적으로 했다.

보는 방향은 무관한 시선 독립적(view-independent)인 부분을 표현하는 디퓨즈 영역과 시선 방향을 고려한 시선 의존적(view-dependent)인 부분을 표현하는 스페큘러로 나눈다. 이전 쉐이딩의 문제는 디퓨즈와 스페큘러의 컬러와 세기라는 비직관적인 파라미터를 아티스트가 직접 조절해야한다는 것이었다.

> **참고**
> 정확히 말하면 디퓨즈가 항상 시선 방향과 독립적인 것은 아니다. 흔히 쓰는 램버트 디퓨즈의 경우는 확실히 그렇지만 다른 디퓨즈 모델들은 시선 방향을 사용하기도 한다. 다만, 대체적으로 디퓨즈는 난반사로 시선에 크게 영향 받지 않고 고르게 보이는 것이 특징이다.

![](https://lh3.googleusercontent.com/-lJ0BUmU7hho/Ws9gOICFsHI/AAAAAAAASn0/Rq-bdTbH650s7ei3QeLofyQXFisdxRREQCHMYCw/s0/Phong_components_version_4.png)
출처: [https://en.wikipedia.org/wiki/Phong_shading](https://en.wikipedia.org/wiki/Phong_shading)

라이팅을 앰비언트, 디퓨즈, 스페큘러로 나누어 표현했다. PBR에서도 내부적으로는 이 셋을 구분해서 사용하긴 하지만 아티스트가 직접 다루지는 않도록 한다.

# PBR
언리얼 엔진 4에서는 PBR이라고 부르고, 디즈니와 유니티에서는 PBS(Physically-based Shading)라고 부른다. 개인적으로 PBR이 더 입에 붙지만, 퐁 쉐이딩에서 발전된걸 생각하면 PBS도 좋은 표현이다.

PBR 이전 방식의 근본적인 문제점은 디퓨즈의 세기와 스페큘러의 모양과 색을 아티스트가 조절해야한다는 것이다. 예를 들면, 현실 세계에서는 이론적으로는 금속이면 스페큘러 컬러는 베이스 컬러와 같고, 비금속이면 회색(흰색의 최대 8%)이다. 이걸 이전 방식으로 구현하려면, 아티스트가 일일이 수치 설정을 해줘야한다. 현실적으로는 그러기 힘드니까 아티스트의 감에 맞겨온게 사실이다. 바꿔말하자면 딱히 제약이 없이 감에 의존했다.

그렇다면 PBR은 기술적으로 무엇어냐 라고 말하면 사실 딱 짤라서 짧게 표현하기 어렵다. 근본적인 핵심은 **아티스트에게 보다 현실 직관적인 파라미터를 제공하는 것**이다. 

디즈니 BRDF 원칙(Disney “principled” BRDF)은 다음과 같다[[1]](#references).

1. 물리적인 것 보다 직관적인 파라미터를 사용할 것
1. 가급적 적은 파라미터를 사용할 것
1. 0 부터 1 사이의 값을 사용할 것
1. 의미가 있다면, 0과 1 넘어선 값에서도 사용할 수 있어야 할 것
1. 모든 파라미터의 조합은 견고하고 타당할 것

에픽의 브라이언 카리스(Brian Karis)는 UE4의 PBR을 만들면서 원칙을 이렇게 했다[[2]](#references).

1. 실시간 성능
2. 가급적 적은 파라미터
3. 직관적인 인터페이스
4. 선형적 (Perceptually Linear)
5. 마스터하기 쉬울 것
6. 견고함
7. 다양한 표현 (Expressive)
8. 유연함

두 원칙을 보면 약간 다르기도 하지만 비슷하고, 어떤 것을 지향하는지 알 수 있다. 결국은 **파라미터** 얘기다. 그러면 기술적으로는 기존 쉐이딩과 다른 점은 어떤 부분일까. 내 의견으로는, 가장 핵심적인 두가지로 요약할 수 있다.

* **러프니스**와 **메탈릭**의 파라미터화
* 환경맵을 사용한 PBR 기반 **IBL(Image-Based Lighting)**

## 러프니스와 메탈릭
러프니스는 거친 정도를 나타내는 파라미터이다. 반대의미로는 부드러움(smoothness)이 있고, 유니티는 이 파라미터를 사용한다.

퐁 쉐이딩에서는 양의 정수를 지수로 계산해서 스페큘러의 모양을 나타내었다. 물리적으로 올바르다고 할 수 없을 뿐더러 비직관적이다.

디퓨즈는 램버트(Labertian) 등의 공식을 사용하고, 라이트의 스페큘러 모양은 흔히 Cook-Torrance 와 GGX 공식을 이용해서 표현한다. Cook-Torrance 와 GGX 에 대한 자세한 설명은 생략하겠지만, 이들은 러프니스를 입력값으로 받는다고만 알고 있어도 좋다.

![](https://lh3.googleusercontent.com/-vxiTEBCQyZQ/Ws9nUyYY6yI/AAAAAAAASoE/o5aM6fAkc6c0cagOjBVkA3kyVfWfn_vMACHMYCw/s0/image_24769.jpg)
출처: [Real Shading in Unreal Engine 4, Brian Karis (Slides, PDF)](#references)

메탈릭도 아티스트를 편하게 해주는 주요 파라미터다. 비직관적으로 스페큘러 컬러를 복잡하게 쓰기보다는 금속이면 1, 금속이 아니면 0을 설정하면 되는 아주 편리한 파라미터다.

기술적으로 말하자면, 금속일 경우 디퓨즈가 없고 스페큘러 컬러가 베이스 컬러(albedo)와 똑같다. 비금속일 경우는 스페큘러 색깔이 무조건 흰색이면서 일반적으로 4%만 반사한다. 비금속에서의 반사율은 0%부터 8%까지를 조절할 수 있는 스페큘러(혼란스럽지만 퐁 쉐이딩의 스페큘러와 다르다) 파라미터를 이용해서 나머지를 조절한다. 왜 0%~8%로 제한하는지는 이전에 쓴 글을 참고하면 된다. 참고글: [언리얼 엔진의 PBR 스페큘러 기본값 0.5의 의미][4]

## IBL을 이용한 PBR
두번째 핵심이라고 볼 수 있는데, 이것이 없이는 특히 실시간 렌더링에서 PBR이 크게 특징이 나타나지 않는다.

![](https://lh3.googleusercontent.com/-F6Yqut3kMRc/Ws9pEHp8qGI/AAAAAAAASoU/-Uwl6bdFMEEKCMS55ptkeArHwzRZLvmIwCHMYCw/s0/2018-04-12_23-11-22.png)
출처: [Real Shading in Unreal Engine 4, Brian Karis (Slides, PDF)](#references)

쉽게 말하자면 왼쪽 상단의 구와 같은 환경맵을 시작으로, 오른쪽에 나열되어 있는 구와 비슷한 러프니스 환경맵을 미리 만들어둔다. 환경맵은 밉맵에 저장되는데, 일반적인 밉맵 공식이 아닌 렌더링 공식에 따라 (어느정도는 근사가 들어갔지만) 물리적으로 올바른 계산을 통해 미리 구워둔다.

![](https://lh3.googleusercontent.com/-004ANeXC4m0/Ws9p1w3gb0I/AAAAAAAASog/L2aWB_wGex0BSextUfMdzuvFzIleFWsmwCHMYCw/s0/2018-04-12_23-14-45.png)
이 환경맵을 IBL로 러프니스가 0일때는 왼쪽의 구를, 러프니스가 1일때는 오른쪽 구를 사용한다. 아래쪽 검은색 구들은 검은색의 비금속을 나타낸다.

UE4나 유니티처럼 PBR을 사용하는 엔진에서는 항상 기본 환경맵을 제공하는 것을 알 수 있다. 아무것도 안했을때는 기본 환경맵을 이용해서 렌더링하고, 리플렉션 캡쳐 같은 것을 월드에 배치하여 환경과 재질의 러프니스 값에 따라 주변 환경 기반의 렌더링을 제공한다.

# 마무리
> 사실적이면 PBR인가?

위에 기술 했듯이 항상 그런건 아니다. 퐁 쉐이딩에서도 얼마든지 사실적인 표현을 해왔었다. 단지 좀 더 어려울 뿐이다.

> PBR의 결과물은 항상 사실적인가?

PBR의 시초는 픽사/디즈니와 같은 NPR 렌더링이다. 이곳에서는 비사실적인 표현을 최대한 사실적인 기법을 이용해서 이루어냈다. PBR은 시초 부터가 100% 사실적인 렌더링만 지향하지 않았다는 것이다.

> PBR의 핵심은 무엇인가?

아티스트에게 편하고 직관적인 파라미터를 제공하는 것이 원칙이고 핵심이다. 그 외의 기술적인 측면은 사람마다 시각이 다르겠지만, 내가 생각으로는 (1) 러프니스/메탈릭 위주의 파라미터와 (2) IBL 을 이용한 환경 표현이다.

> 사실적인 것과 NPR까지. 그럼 PBR은 만능인가?

PBR은 만능이 아니다. PBR 때문에 오히려 의도한 비사실적인 표현들이 어려워졌다. 때로는 사실적인것보다 과장된 표현이 더 보기 좋다. 특히 실시간을 위해 제한된 파라미터만는 오히려 사실적이어서 표현할 수 있어야 하는 부분도 이전보다 더 표현하기 어려운 경우가 있다. 이런 문제들은 프로그래머와 아티스트 들이 더 고민해야할 부분일 것이고, 앞으로 PBR이 발전해가야 할 방향일 것이다.

# 참고자료
<a name="references"></a>
1. [Physically Based Shading at Disney, Brent Burley (PDF)][1]
1. [Real Shading in Unreal Engine 4, Brian Karis (PDF)][2]
1. [Real Shading in Unreal Engine 4, Brian Karis (Slides, PDF)][3]
1. [언리얼 엔진의 PBR 스페큘러 기본값 0.5의 의미][4]

[1]: http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf
[2]: http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
[3]: http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_slides.pdf
[4]: https://blog.hybrids.kr/224