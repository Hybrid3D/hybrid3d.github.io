---
layout: page
title: 난이도
published: true
---

난이도는 표시는 아래와 같은 규칙으로 표시하고 있다. 객관적으로 분류할 수 있는 난이도 보다는 글에서 다루는 전문 용어를 얼마나 설명하는지로 구분했다.

{%assign low_posts = site.posts | where:"difficulty", "low"%}
{%assign middle_posts = site.posts | where:"difficulty", "middle"%}
{%assign high_posts = site.posts | where:"difficulty", "high"%}
{%assign none_posts = site.posts | where:"difficulty", "none"%}

---

### 난이도 낮음 <small>[{{low_posts.size}}](/difficulty/low/)</small>
블로그의 대상을 중심으로 어느정도의 수학, 물리, 프로그래밍 기초 사전 지식은 기반으로 하되, 깊은 사전 지식을 필요로 하지는 않는다.
글에서 다루는 분야의 전문 용어들은 대부분 설명 하여 사전 지식 없이도 읽을 수 있다.

### 난이도 중간 <small>[{{middle_posts.size}}](/difficulty/middle/)</small>
어느정도의 사전 지식을 기반으로 한다. 몇몇 용어들이 설명되지 않은 채로 다뤄질 수 있다.

### 난이도 높음 <small>[{{high_posts.size}}](/difficulty/high/)</small>
해당 분야의 깊은 이해를 기반으로 한다. 많은 용어들이 설명되지 않은 채로 다뤄질 수 있다.

### 난이도 없음 <small>[{{none_posts.size}}](/difficulty/none/)</small>
동영상이나 알림성 글 같은 경우 난이도를 표시하지 않는다.

---

단,여기서 `사전 지식`이라는 것은 아무래도 주관적일 수 밖에 없다. 예를 들어 어떤 사람들에게는 행렬, 미적분이 기본 지식이지만 어떤 사람에게는 그렇지 않다.
수학과 물리는 고등학교 수준(보다 약간 아래)를 기준으로 생각하고 있고, 어떤 분야를 설명할 때는 해당 분야에 대한 아주 기본적인 것은 전제하고 있다. 예를 들어 그래픽스 분야에서는 렌더링, 쉐이더라는 단어를 굳이 설명하지 않는다.

이렇게 해당 분야의 기본적인 것은 기반으로 하되, 내용이 다소 어렵더라도 모든 단어를 다 설명한다면, `쉬움`으로 표시하고 있고, 단어 설명을 이미 알고 있거나 단어 검색으로 충분히 익힐 수 있을 경우는 `중간` 혹은 `높음`으로 적는다.
