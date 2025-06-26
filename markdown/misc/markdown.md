
# 大標題

## 次標題

### 三級標題

### ctrl+shift+v開啟預覽

# 1個id {#ian}

# 2個class {.class1 .class2}

*斜體*
**粗體**ctrl+B
~~橫線劃過~~

- 無
  - 序
    - 標
          - 題

1. 有
   1. 序
      1. 標
         1. 題

[markdown語法](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-tw/math)

```python {.line-numbers}  
import time

seconds = 125  # 設定倒數時間（125 秒 = 2 分 5 秒）

while seconds:
    mins, secs = divmod(seconds, 60)
    timer_format = f"{mins:02d}:{secs:02d}"
    print(timer_format, end="\r")  # 以動態方式顯示時間
    time.sleep(1)  # 等待 1 秒
    seconds -= 1  # 時間減少 1 秒
```

```python {highlight=1}
import time
```

![範例圖片](../images/OIP.jpg)
連結[GitHub](https://github.com/)
>引用
---

分割線

---

`<print("行內代碼")>`

- [x] 任務 alt+c快捷完成
- [x] 完成

| First Header                | Second Header                |
| --------------------------- | ---------------------------- |
| Content from cell 1         | Content from cell 2          |
| Content in the first column | Content in the second column |

alt+shift+f快捷表格

:smile:
:fa-car:
30^th^
H~2~O
Content [^1]

[^1]: Hi! This is a footnote
*[HTML]:Hyper Text Markup Language
*[W3C]: World Wide Web Consortium
The HTML specification
is maintained by the W3C.
==marked==

$$f(x)=sin(u)/2$$

更多詳細到[官網文件](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-tw/markdown-basics)