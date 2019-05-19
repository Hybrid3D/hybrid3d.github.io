---
layout: post
title:  "거울의 BRDF - 파트 1"
date:   2019-05-02 02:00:00 +0900
categories: computer-graphics
tags: [brdf]
difficulty: middle
redirect_from: /491
---
NDC 발표 후 어떤 분이 질문을 해주셨다. 정신 없는 직후라 발표 직후엔 어떻게 답변을 해드렸는지는 정확히 기억 안나는데, 이후 따로 메일로 답변을 전달해드린 내용을 정리해본다.

$$L_o(x, w_o) = \int_H f(x, w_i, w_o)L_i(x, w_i)cos\theta_i dw_i$$

이렇게 렌더링 공식이 있다. 이때 $$cos\theta_i$$는 표면과 입사각과의 각도 때문에 달라지는 빛의 양이다. 이때 거울을 구현할때 $$cos\theta_i$$를 사용하면 이거 때문에 반사가 어두워지는 현상이 생기는데, 무엇이 잘못된 것인가가 질문의 요지다.

즉, 바꿔말하면 `거울의 BRDF는 무엇인가`이다. 거울은 구현하기는 쉬운데, BRDF 형태로 나타내기는 까다롭다. 디락 델타 함수를 써야하기 때문이다.

## 거울의 BRDF(bidirectional reflectance distribution function)

결과적으로 $$cos\theta_i$$는 사라져야하는게 맞다. 무척 단순하게도, 거울의 BRDF의 분모에는 $$cos\theta_i$$이 들어간다.

제대로 된 BRDF는 이렇다(참고문헌: [1][1]).

$$f(x, w_i, w_o)=F\frac{\delta(w_i - R(w_o, n))}{cos\theta}$$

**F는 반사율**이고, **R은 정반사**를 계산해주는 함수(reflect)다. 이때 $$\delta$$로 표기하는 **디락 델타 함수(dirac delta function)**는 주로 적분 안에서만 쓰이는 특이한 함수다. $$\delta(x)$$에서 x가 0이면, 적분 밖에서 그 값은 무한대인데, 적분 안에서 이 영역에서만 1이 되어 살아남는다. 즉, 이 BRDF를 넣고 렌더링 공식의 적분을 계산하면 다음과 같이 된다.

* \\(L_o(x, w_o) = \int_H f(x, w_i, w_o)L_i(x, w_i)cos\theta_i dw_i\\)
* \\(=\int_H F\frac{\delta(w_i - R(w_o, n))}{cos\theta}L_i(x, w_i)cos\theta_i dw_i\\)
* \\(=\int_H F\delta(w_i - R(w_o, n)) L_i(x, w_i)dw_i\\)
* \\(=F L_i(x, R(w_o, n))\\)

적분 안에서 $$w_i - R(w_o, n)$$가 0인 부분만 살아남기 때문에, 수 많은 $$w_i$$ 중 $$w_i = R(w_o, n)$$ 인 것만 살아남는다. 그래서 $$L_i(x, w_i)$$은 적분 기호가 없어지면서 $$L_i(x, R(w_o, n))$$으로 바뀌어 계산 된다.

## 다음 파트

원래 이어서 Cook-Torrance 스페큘러 모델에서 거울을 어떻게 표현하는지를 다루려 했는데, 생각보다 길어질꺼 같아 파트를 나눠 다음 글에서 다루겠다.

## 참고문헌

1. Physically Based Rendering: From Theory To Implementation, [8.2.2 Specular Reflection][1]

[1]: http://www.pbr-book.org/3ed-2018/Reflection_Models/Specular_Reflection_and_Transmission.html "Physically Based Rendering: From Theory To Implementation, 8.2.2 Specular Reflection"