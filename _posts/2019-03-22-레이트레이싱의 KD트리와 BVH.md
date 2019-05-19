---
layout: post
title:  "레이트레이싱의 KD트리와 BVH"
date:   2019-03-22 01:00:00 +0900
categories: computer-graphics
tags: [raytracing, dxr, bvh, kd-tree]
difficulty: middle
redirect_from: /409
---
**DXR(MicrosoftX Raytracing)**의 활용이 점점 늘어나고 관심도 늘어가고 있다. DXR 자료는 점점 많아 지고 있는데, 그중에 **BVH(Bounding Volume Hierarchy)**라는 단어가 흔하게 등장한다. 레이트레이싱 세계에서는 이미 오래전부터 사용되던 구조인데, 래스터라이제이션 세계에서는 생소한 단어다.

여기서는 BVH를 위해 그 조상이 되는 KD Tree를 알아보고, 이어서 BVH가 무엇인지 간단히 알아본다.

## 가속 구조 (Acceleration Structure)

레이트레이싱의 기본은 광선(레이)이 충돌하는 지점의 삼각형과 삼각형 정보를 알아내는 것이다. 그 다음은 라이팅을 하든 AO를 하든 활용하는 사람 마음이다.

광선과 삼각형이 충돌하는 지점을 알아내는 것 중 가장 간단한 방법은 모든 삼각형을 다 검사해보고 그중 가장 가까운 지점에 대한 정보만을 사용하는 것이다.

![](https://lh3.googleusercontent.com/FSxQ1H2XF38nLPY_TRitC_Ce-NV-4zzqDOYSXddcU3Vnz4s7FucbHyA2cX5ycCAC5_Mm94bcBesqvxUrIdWz4F_cHHQU4-wgptfkk-o3PxMQkEErhf-dKeN0bHB5wXwYLAin94YfKC3MtRbl7Q_z1Hl3z7YbsGKdVIvbaXu6s1rZqOuZSMD6jB5VnYEsI_XgoSwvMWjU8KaCDii0_Y0-bHbRgs_guqWhA3w-TdvbzuKx-HtmvvqBHREiKj_Q3Ur2L6QX1jChcaWa7hIILUo7ZFLMu6IR_VBd4VmHs9N9JeVHd64_pPSI-NB_FEUndx_O3YGKmTwwLR_J1KoH9mvDZI25tESWggv_dq9bXnsJC6HYyzioTh3uNYYi4moVSudCfQx_wgdpmCnuMLA0NpIrcopHiI2akyXt4wyv02D6CGYTclsTB7nqNDhzSsXzt54yRn7gRSCkLiNOj-DLjQkKw7xxevZp-qc9HgKq8kQc2EtdIBMgqmBEMdJq42KVo4PBsLt6Acddl8LWR5R1c3CXsqNqMMjUP2Rf2RcYjAzsnIzjtTErLT8AN12-C8OtItPUlJ3SPqyZ_IsGFXaNCjYp3DPNMp30YAO1NpiQ-tIadybFEtohYCmW6NVBuyrw79vInS78DB1nKbmFcLfLylPxdkZVn28eDzGF3tHAZledOZXunYoXiafyqB1UtAULr8sEdehzEKbaxU3Ejt6XQCkbNvIEqA=w366-h230-no)

물론 이렇게 하는 것은 느리다. 그렇기 때문에 공간 분할(spatial partitioning)을 이용해서 가속 구조를 만들어 사용한다. 대표적으로 사용하는 것이 KD Tree이다.

## KD-Tree (k-dimensional Tree)

![](https://lh3.googleusercontent.com/fA5sG2QWawfw4axT39kSSErodoooHTdpRCxIo5oxMjtw6GZM3AuintYDdmLJJq9_sZnym39NyE7kHTu9s3wuhHKfwnHywMtHhAYUBBuMYgAHetlOgWBjG9o9MTPvKrct14jwsOdIgLjoIEKKKuMOS5z-kK1zWneZMqZJ2H8kbU32p8mDxZ0-grSTmcj7GgRV4quVn4KCLAKZRdrg-FumzDOd-o-0RzTGOVa703SzahQXButNfRVQUo5c7yAXDhEu4-PIgFQK_w443z_JcKE8j5xxC78mkuPzowwk6PErBriLTirz5zHyNxalvydYJypp8QEkuauS1_3ZQ74_10JvZVBic7kZDlwdsAB95qE_4_gEj0JyZ4fN72Tyld2D0sYjg7k4yvu-hLucBCS8l1fn3FzBOQSJEowme5vgB5c4HZnZCeA-n1gewHHLzGg-sRH9nW5uEWsLAA3s6cCBIjl52J_4aBRBXgBIFnwAXe64mGwQH47Wv3wDScSppsl6r1fyVfrLl8y7AvamK3D9N2axSCt1T4zBiLkLVhRsibEyzCnrSyxMhkGibzDGtU3YAKnI76P_1x0BwX19WJ1fu5mTkzsEza9zktpXWfs4bogESJcwe2ddeA11H-0Kh-NcOhN_8DE1LB_axuCPGWHQUCC9_B1r_pT4PN3aC_MgD3uFQlTK6xJ6PwMs2zlMGdV4lZBpYpAfQl6byb_xBU5SQve8oVmiow=w366-h230-no)

KD트리는 AABB(Axis-Aligned Bounding Box)를 이용해서 계층적으로 이진트리로 공간을 분할 하는 구조다. AABB라 함은, xyz 축에 수직이거나 평행한 면의 박스만 이용하겠다는 것이다. 이렇게 문제를 단순화하면 광선과 박스의 교차 검사를 굉장히 빠르게 할 수 있다.

![](https://lh3.googleusercontent.com/7Yw1xkRMtQtACvnx9uTljll4csQ_vW_Co9rAdwICINT7ZZBqjStYq3s2hsTt3cC95qMm8k-ODDaB0Yro9cd30zQS0oogOyB_tRxcsXKcBXXBX3zyMlKagSknIRzwFds5JjUxZ4uDsv7-qcfN6a9bMOVKMrLkZRg6LA47DEghHwmIs39Y444sCPnTAIZLJswcNyE4J8r7SLaZPXBOdXgQWANh2ch0Ek9nHqqfUOCkSc_YCllaA5amTF15e3VI3KVNOKRVxwKwvXXvtdHtetWl5T4sq3iMGfA9pTN6CVgpAP2eB33G_WbO5OujYLYJO2UjsgYQr6pz-7rAXvfJZqwm7MG4vOkV_6pWvaSuQy0bqeCnrNPg7ClRELA99H1jixqx1z1R37PXH2kkjN5nwkEdWAjhVlLzSLC3rnwt9SbC9CWisGRRMeQtA-fg503qGf_7p-yXGOEdbsFzsFX5RvRIYeFe7_APjXNahhUDxkvNrLrH2bwVrqv78xA_xvM4KCMQeXyt0_jnjlxPoEyohTsJdT9urJPM-FAf3ka2KKAb87dRnNqP23kg0iAO_m9vC5NgLLXgf6N0QwDXxtrVIbuGENE3pcPYCDeHYQxYX7uuJI8xIDQ_DF8k1mqV6CoI_Po24icsDfkvRFwQfQvds6yZMRWPX1ebsxiDsl5JIsR8myyIkI2kjgvPYL4XG0Z5sWucIygW1schA8R-RLP2HHAafAN13Q=w366-h230-no)

위 그림에서는 번호 순서대로 박스와 교차 검사한다. 그리고 박스 안에 삼각형이 있으면 그 삼각형하고 교차 검사를 한다. 이러면 삼각형 교차 검사를 순서대로 할 수 있고, 불필요한 교차 검사는 생략할 수 있다. 이 그림에서는 3번 노란색 박스 안에 있는 삼각형들을 계산한다. 충돌하는 것이 없으므로 트리 탐색을 이어가고, 최종적으로 4번 검은색 박스에서 원하는 결과를 얻는다.

KD-Tree의 장점은 교차 검사 계산이 매우 빠르다는 것이다. 반면, 단점은 생성 시간이 제법 필요하다. 생성 시간은 다른 구조들도 마찬가지이긴 하지만, KD-Tree는 수정도 매우 오래 걸린다. 동적인 물체에 대한 여러 시도가 있었지만 동적인 것들에 대해서는 아래에서 이어서 설명할 BVH를 이용하는 것이 현 추세다.

## BVH (Bounding Volume Hierarchy)

KD트리는 박스를 두 조각으로 나누고 그걸로 이진트리의 자식으로 사용한다. 이 방법으로는 내부 데이터가 변경되었을때 변경이 크다. 거의 전체를 다 재생성하는 만큼의 비용이 들때도 많다.

![](https://lh3.googleusercontent.com/SK05T9QeA0_17Em8ihKHPAS1zPZg5Mq5dPUk4KgBL2emYlwn3aZxI3FWvFz4QyIcw6Iwy92uS9BAsY-xSSPOTu0k30_JfzHReMle47Slc68hnqNjSR2sDx4fONG-dUpT7-vUEDqKu6Mx_e97vyJGeV85L552803A4zR4Bkq6jNSuo2wN5-4F_OBduvYQuf5yagQn1pYRmVQ2gx68cfwP7ar3ATpN-rdNp73Csy8qRUnu6lQ-QF58AbPL8vsWRiETM0L8VGfCvALVgQWREdy9G39F86OsnZQd_YbyRn3ryUL-pItorRTNJwvcp17wcxp9k7wCfIpRrUZTqs1M3eTFAdCr5QAH70VVGsM0e1Zcvg4NXPhC5uTvexCD2y5qhUQcUcd6T3Q2bqwMC5jmqfvIhXKKKZ1XEZri3nWjtlO4evz4e7or1Kq4Ete2XMAs3uDR44IrStdpt7OJBu-vc_jrX5Orf58EYdEOIPcqZcVb3afdtcCPQiTZFgQqq2waVCxI_POC9yOe5kfIgtk7dVGdGhLRetfadyjQDxXBFd-CegIuhXgBN6HWUt-wK1dXPQZOQ-0txOK7SS8RqRUVQZ2HV1f8IGv8KPYZx89N8xzmBJHMdqe_QodeC2JOJV6PX7LuAUJGBq5b5PQDKBMVa0Py5e-ogZr9sWT_EMi_jb_f1TVbd-lZeFTcTssCgjQjDziDNOJDZkTTqlMj0rn5BB7yAirQ_w=w303-h223-no)

원이 위의 그림에서 아래그림처럼 이동했다고 해보자. 이 경우 왼쪽 박스가 수정되었으므로 오른쪽 박스도 수정되었고 이와 연관된 모든 박스가 다 수정되어야 한다. 업데이트를 해야하는 박스가 많아서 비용이 크다.

BVH도 KD트리처럼 자식이 둘인 것은 맞는데 특정 지점으로 가르지 않고 양쪽이 서로 다른 지점으로 나뉠 수 있다.

![](https://lh3.googleusercontent.com/qBsc3ztH75eqMIP873YXTA2XnGI8SED3zBWqWVRydGogv51nhm-s1rv2_xwPEfShGCVOfa5Rfkwk4md_YxjYR5avbF4KVhjOHPiH-KC5g7rfxX2Iq6yYw9Q4YQOaenTjom8x7ayBjrHqLBPnPZozpjQ658BcWNBI-Z9pod3Am049bcD-JdLgHUwGg7XhPW_oEHNSbtjJQcXHyIIglC_h2p0SRXJRkxdrzfm5TmCd3V4z22IkIqhQ-tS1z7Q8Wv1GE4thB8-5My5cu8PLx4-RVOc8J6Zt5pv59CBcgfP5w5MdkGjU67Gwhz1h7DjujPiYf6AWAZevfdY_d9g-wmwlHReAWy0ABqWFqg-EGzWtinvRDK0nthetHxZXPMroWy3uV819mubYWrgQfyKlC-eb_y1qSoTdBoMGRpDUZLeP0dBNEvadIx9gZ4a5EaG05SWUWuG77dZoERGDEOKzSBiCxOkOUj-WKJpeLr-5Ru6YtnHanW2zvfQJVQORdbjd-W_Zc4YkceauBHqO58hRVsYWVDsWIa2rOE_asbvjJs_iQrdRUY9UwiuZAuDElQzJUh3rrJs9LFK_KqNnCsmwxibM5aU5r48b7tbrVjUYHeEfVsNcneP3Mn9mSuvnndsZIJQeRv3wgbnROEDS7e-0bX_Ml-3LV_UNEivNhskFZGJeZMGJsq96N4e5jw9R7E7_9jHgJz4QaziyJVxQ4wUqN-FdpCTxew=w288-h100-no)

위와 같이 빨간색 박스가 수정이 되어도 녹색 박스는 굳이 수정될 필요가 없다.

따라서 어떤 수정사항이 생겨도 최소한으로만 수정을 할 수 있어서 업데이트가 매우 빠르다. 장점이 있으면 단점이 있는 법, KD트리 보다 실시간 성능이 떨어질 수 있다. 자식의 박스가 겹칠 수 있는 만큼 두 박스를 모두 체크해야하는 경우가 생겨서 성능이 떨어진다. 겹치는 박스가 많아지는걸 보고 BVH의 상태가 나빠진다고 하는데, 즉, 동적인 물체의 이동 영역이 넓을 수록 BVH 상태가 나빠질 수 있다. 예를 들어 애니메이션 되는 메시의 경우 사람이 걷거나 뛰는 경우는 크게 나빠지지 않는데, 꼬리나 날개가 달린 캐릭터가 다채로운 움직임을 보여줄 경우 BVH가 쉽게 나빠질 수 있다.

## 마무리

요약을 해보자. 

* KD트리는 렌더링 성능이 가장 좋지만 동적인 물체에 좋지 않다.
* BVH는 성능은 좀 떨어지지만, 동적인 물체에 대응이 가능하다.
* BVH는 KD트리를 포함한다고 볼 수 있다.

일반적으로는 BVH를 쓴다고 말하지만 정적 메시에 대해서는 내부적으로는 KD와 같거나 거의 흡사한 자료구조를 사용할 것이다. DXR에서 BVH를 생성할때는 동적인지 여부를 체크할 수 있다. 즉, 스태틱 메시는 KD트리를 쓸 것이고, 스켈레탈 메시는 BVH를 쓸 것이다. DXR은 이런 오브젝트들을 다시한번 상위로 BVH 트리로 감싸니 계층적으로 효율적으로 처리할 수 있다.

KD트리와  BVH을 이용한 레이트레이싱은 성능 향상을 위해 많은 발전을 이루었다. 여기의 설명이 그렇게 자세하진 않을 수 있는데, 알고리즘 자체가 많이 발전해왔기 때문에 자세하게 설명하자면 제법 길어서 매우 간략하게만 다뤘지만, 간단하게 어떤 방식으로 동작하는지만 알아도 좋을 것이다.

물론 DXR을 직접 구현하기 위해서 BVH를 직접 구현할 필요는 없다. 하지만 GPU가 알아서 다 해주는 래스터라이제이션도 직접 구현해보면 큰 도움이 되듯, 레이트레이싱과 BVH도 직접 구현해보면 큰 도움이 된다. 직접 구현해보지 않더라도 어떻게 동작하는지 알고리즘은 알고 있는 것도 큰 도움이 될 것이다. 좀 더 자세한 알고리즘을 위해서라면 참고문헌에 있는 Ingo Wald의 논문을 참고하면 좋다.

## 참고 문헌

* [A Three-Dimensional Representation for Fast Rendering of Complex Scenes, Steven M. Rubin and Turner Whitted][1], 1980
  \- 최초 BVH 논문이다.
* [Realtime Ray Tracing and Interactive Global Illumination, Ingo Wald][2], 2004
  \- 실시간 레이트레이싱 알고리즘에 큰 공헌을 한 Wald 의 박사 논문이다. 레이트레이싱의 기반이 되는 알고리즘의 모음집이라고 할 수 있어서 전반적인 레이트레이싱 알고리즘을 자세히 공부하기 위해서는 이 논문이면 거의 90% 이상은 된다고 할 수 있을 듯 하다.

[1]: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.133.6937&rep=rep1&type=pdf
[2]: http://www.sci.utah.edu/~wald/PhD/wald_phd.pdf