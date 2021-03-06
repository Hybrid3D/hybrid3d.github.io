---
layout: post
title:  "거울의 BRDF - 파트 2"
date:   2019-05-06 01:00:00 +0900
categories: computer-graphics
tags: [brdf]
difficulty: high
image: /images/unsplash/marc-olivier-jodoin--TQUERQGUZ8-unsplash.jpg
redirect_from: /525
---
* [거울의 BRDF - 파트 1]({% post_url 2019-05-02-mirror-brdf-part1 %})
* 거울의 BRDF - 파트 2 (현재 글)

---

[이전 글]({% post_url 2019-05-02-mirror-brdf-part1 %})에서는 **이상적인 거울의 BRDF**를 다뤄봤다. 이상적인 상황에서는 무한대 값을 나타내는 **디락 델타 함수(dirac delta fuction)**로 거울을 나타냈다. 이 글에서는 Cook-Torrance 모델을 기준으로 거울의 BRDF가 어떻게 되는지를 알아본다. Cook-Torrance 모델에서 다루는건 그냥 대입만으로는 쉽게 설명이 되지 않기 때문에 약간 복잡할 수 있다(그래서 글을 둘로 나눴다).

결론부터 미리 말하자면 Cook-Torrance 모델로는 이전에 말한 이상적인 거울을 표현할 수 없다.

## Cook-Torrance 모델의 거울 BRDF
일반적인 PBR 게임의 스페큘러는 **Cook-Torrance 모델**로 표현하는 경우가 많다. Cook-Torrance 모델가 무엇인지는 이글에서는 넘어가도록 하지만, 이건 **F**(fresnel function), **G**(geometry function), **D**(distribution function) 세 함수로 표현한다고만 알아도 된다.

이때 각 함수는 물리적, 에너지 보존적 특성만 맞으면 각각 다른 함수를 조합해서 사용할 수 있다. 가령 언리얼 엔진 4 등 실시간 렌더링에서는 흔히 **GGX**를 D 함수로 사용하고, **Smith**(혹은 그의 근사)를 G함수로 사용한다[^1].

먼저 Cook-Torrance 모델의 공식을 보자. 이때 이전 글에서 빛의 입력으로 표기했던 i는 여기서 L에 해당하고, 빛이 나가는 방향(빛이 눈으로 들어오는 방향)인 o는  V로 표현했다. 편의상 위치를 뜻하는 x는 제외하였다.

$$
\begin{aligned}
 \textrm{Microfacet BRDF} &= \frac{F(L, V)D(L, V)G(L, V)}{4(N\cdot L)(N\cdot V)} \\
D(\vec{m}) &= \frac{\alpha^2}{\pi \cos^4\theta_m (\alpha^2+tan^2\theta_m)^2} \space \textrm{(D 함수)} \\
G_1(\vec{v},\vec{m}) &= \frac{2}{1+\sqrt{1+\alpha^2tan^2\theta_v}} \\
G &\approx G_1(\vec{v},\vec{m})\cdot G_1(\vec{l},\vec{m}) \space \textrm{(G 함수)}
\end{aligned}
$$

위 공식에서 부호 같은건 제외했다. 제대로 된 공식은 [참고 문헌 2번][2]에 있다. 주의할 것이 있다. 여기서 D(m)과 같이 m을 사용하는 공식은 microfacet BRDF 이다. Microfacet BRDF을 dm 으로 적분하면 일반 BRDF가 된다. 이 경우 microfacet BRDF을 적분할 때 m이 H (하프 벡터, half vector)와 같은 경우만 살아남기 때문에 실제로는 D(H), G(v, H)의 공식을 사용하면 된다. Microfacet BRDF와 일반 BRDF의 차이는 [참고 문헌 3번][3]에 잘 나와있다.

결국 BRDF 로 바꾼 후의 D 함수와 G 함수에 러프니스를 0으로 넣고, 거울이니까 NoH에 1을 넣으면 이 모델이 나타내는 거울의 BRDF가 된다. 이때  NoH 은 dot(N, H) 를 의미하고 N은 노말을 의미한다. 이렇게 두고 공식을 풀면 D(H)에서는 0으로 나누기 때문에 무한대가 된다. 참고로 D 함수 자체는 무한대가 되어도 괜찮다(아래의 참고 1 확인).

D 함수는 디락 델타 함수로 치환한다고 생각을 하고(실제로는 치환 가능한게 아니다) G는 1로 계산하면 분모의 $$4(N\cdot L)(N\cdot V)$$가 남아서 같지 않다는건 알 수 있다. 이 분모의 값은 Cook-Torrance 모델의 정규화(normalization)을 위한 값이다. 이 값의 유도 과정은 [참고 문헌 3번][3]에 잘 나타나있다. 이걸 렌더링 공식에 넣어보자.

$$F\frac{\delta(dot(H, N) - 1)}{4(N\cdot L)(N\cdot V)}$$

이전 글에서 봤던 이상적인 BRDF 다음과 같다.

$$f(x, w_i, w_o)=F\frac{\delta(w_i - R(w_o, n))}{cos\theta}$$

NoL은 이전 공식의 $$\cos\theta_i$$와 대응 되므로 결과적으로  4와 NoV 가 남는다. 이 차이때문에 Cook-Torrance 모델은 이상적인 거울 BRDF와 차이가 난다. 어차피 이상적인 거울이란 존재하지 않기 때문에 Cook-Torrance 모델이 틀렸다고 할 수도 없고 근사적으로는 거의 같은 값을 나타낸다. 4와 NoV가 남는 이유는 Cook-Torrance 모델의 이상적인 거울 반사 방향 근처로도 약간의 다른 값을 가지고 있기 때문이라고 보면 된다. 즉, 러프니스를 0으로 두고 NoH 를 1보다 아주 작은 값을 두고 계산하면 이상적으로는 0이어야하지만 Cook-Torrance 모델에서는 0이 아닌 계산 값을 얻게 된다. 이 때문에 $$4\|NoV\|$$의 차이가 생기는 것이다.

> **참고 1.** 그래도 D(H)값이 무한대가 되는 것이 찝찝할 수 있겠다. 이론적으로 렌더링 공식의 적분 결과는 무한대가 아닌 값을 가지기만 하면 그 안에 있는 함수는 무한대가 되어도 된다. 때문에 D(m) 함수는 dm으로 적분하면 1이 되어야하지만 그 함수 자체는 0부터 무한대까지 될 수 있다 [2][2], [3][3].

> **참고 2.** 최종 계산에서 D(H)를 계산해서 무한대가 나오는 경우가 있다. 가령 실제로 언리얼 엔진 4엔진만 해도 이 부분에 대한 처리가 없어서 러프니스 0, NoH 가 1일 경우 무한대가 계산 되는 문제가 있다. 아마도 NoH가 정확하게 1로 떨어지는 경우는 거의 없기 때문에 그냥 둔 듯 싶은데 상황에 따라 이게 부적합할 때가 있다.

## 레이트레이싱에서의 거울 BRDF
레이트레이싱이나 패스 트레이싱에서 거울을 표현하기 위해서 굳이 Cook-Torrance 모델을 쓰지 않아도 된다. 결과적으로 간단해진다. 러프니스가 0일 경우 그냥 이상적인 거울의 BRDF를 사용하면 된다. 굳이 디락 델타 함수를 생각할 필요 없이 이상적으로 반사 방향을 얻어서 처리하면 된다. 현재 버전의 언리얼 엔진 4의 경우 러프니스가 0.001 보다 작을 경우를 별도로 처리해서 간단하게 처리하고 있다 [4][4].

```cpp
float3 RayDirection;
if (Roughness < 0.001)
{
	RayDirection = reflect(IncidentDirection, WorldNormal);
}
else
// ...
```

else 부분은 글로시가 되는 부분으로 **임포턴스 샘플링**(importance sampling)으로 처리한다. 임포턴스 샘플링은 이 글에서는 자세히 다루지 않는다.

## 정리
굳이 렌더링이 아니더라도 0으로 나눠야하는 상황은 언제가 신경 써서 다뤄야한다. 렌더링 공식은 적분을 다루기 때문에 이번 상황처럼 무한대가 이론적으로 틀리지 않은 상황이 있을 수 있다. 하지만 컴퓨터 세계에서 적분은 근사적으로 다루기 때문에 무한대를 다시한번 신경 써야 하는 상황이 오고 결과적으로 러프니스 0을 다루는 것은 신경 써서 다뤄야한다는 결론에 도다른다. 가장 간단하게 해결하자면 러프니스 0인 이상적인 물체는 없기 때문에 특수한 경우가 아니라면 0.005~0.01 같이 작은 값을 러프니스의 최소값으로 두고 사용하는 것도 방법이겠다.

## 출처
1. [A Reflectance Model Graphics for Computer Graphics, Robert L. Cook and KennethE. Torrance (1982)][1]
2. [Microfacet Models for Refraction through Rough Surfaces, Bruce Walter et al. (2007)][2]
3. [PBR Diffuse Lighting for GGX+Smith Microsurfaces (2017)][3]
4. [Unreal Engine 4,  BRDF.ush][4]

[1]: http://inst.cs.berkeley.edu/~cs294-13/fa09/lectures/cookpaper.pdf "A Reflectance Model Graphics for Computer Graphics, Robert L. Cook and KennethE. Torrance (1982)"
[2]: https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf "Microfacet Models for Refraction through Rough Surfaces, Bruce Walter et al. (2007)"
[3]: https://twvideo01.ubm-us.net/o1/vault/gdc2017/Presentations/Hammon_Earl_PBR_Diffuse_Lighting.pdf "PBR Diffuse Lighting for GGX+Smith Microsurfaces (2017)"
[4]: https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Shaders/Private/BRDF.ush "Unreal Engine 4,  BRDF.ush"

---

[^1]: 물론 그렇다고 아무 함수나 막 조합 가능한건 아니다. 잘 맞는 함수들이 따로 존재하기도 하고 잘 맞도록 수정하기도 한다.