# Python 基礎入門

Python 是一個簡單易學、功能強大的程式語言。它有高效的高階資料結構，也有簡單而有效的物件導向程式設計方法。

## 為什麼選擇 Python？

Python 有許多優點讓它成為初學者的首選：

- **語法簡潔**：Python 的語法接近自然語言，容易理解
- **功能強大**：從網頁開發到資料科學，Python 都能勝任
- **社群活躍**：有豐富的套件和完善的文件支援
- **跨平台**：可在 Windows、Mac、Linux 上執行

## 安裝 Python

### Windows
1. 前往 [Python 官網](https://www.python.org/downloads/)
2. 下載最新版本的 Python
3. 執行安裝程式，**記得勾選 "Add Python to PATH"**

### Mac
```bash
# 使用 Homebrew 安裝
brew install python3
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3

# CentOS/RHEL
sudo yum install python3
```

## 第一個 Python 程式

讓我們從經典的 "Hello, World!" 開始：

```python
print("Hello, World!")
```

執行這段程式碼：
```bash
python3 hello.py
```

## 基本語法

### 變數與資料型態

Python 是動態型別語言，不需要事先宣告變數型別：

```python
# 數字
age = 25
height = 175.5

# 字串
name = "Alice"
message = 'Hello, Python!'

# 布林值
is_student = True
has_job = False

# 查看變數型別
print(type(age))      # <class 'int'>
print(type(height))   # <class 'float'>
print(type(name))     # <class 'str'>
```

### 基本運算

```python
# 算術運算
a = 10
b = 3

print(a + b)   # 13 (加法)
print(a - b)   # 7  (減法)
print(a * b)   # 30 (乘法)
print(a / b)   # 3.333... (除法)
print(a // b)  # 3  (整數除法)
print(a % b)   # 1  (餘數)
print(a ** b)  # 1000 (次方)

# 字串運算
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name  # 字串連接
print(full_name)  # John Doe

# 字串格式化
age = 25
print(f"我今年 {age} 歲")  # f-string (Python 3.6+)
```

### 資料結構

#### 列表 (List)
```python
# 創建列表
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# 存取元素
print(fruits[0])    # apple (第一個元素)
print(fruits[-1])   # orange (最後一個元素)

# 修改元素
fruits[1] = "grape"

# 列表方法
fruits.append("mango")     # 新增元素
fruits.remove("apple")     # 移除元素
print(len(fruits))         # 列表長度
```

#### 字典 (Dictionary)
```python
# 創建字典
person = {
    "name": "Alice",
    "age": 25,
    "city": "Taipei"
}

# 存取值
print(person["name"])     # Alice
print(person.get("age"))  # 25

# 修改值
person["age"] = 26

# 新增鍵值對
person["job"] = "Engineer"

# 遍歷字典
for key, value in person.items():
    print(f"{key}: {value}")
```

### 流程控制

#### if-elif-else 條件判斷
```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"你的成績是：{grade}")
```

#### for 迴圈
```python
# 遍歷列表
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"我喜歡 {fruit}")

# 使用 range
for i in range(5):
    print(i)  # 印出 0, 1, 2, 3, 4

# 遍歷字典
person = {"name": "Alice", "age": 25}
for key, value in person.items():
    print(f"{key}: {value}")
```

#### while 迴圈
```python
count = 0
while count < 5:
    print(f"計數：{count}")
    count += 1
```

### 函式定義

```python
# 基本函式
def greet(name):
    return f"你好，{name}！"

message = greet("Alice")
print(message)  # 你好，Alice！

# 預設參數
def introduce(name, age=20):
    return f"我是 {name}，今年 {age} 歲"

print(introduce("Bob"))        # 我是 Bob，今年 20 歲
print(introduce("Carol", 25))  # 我是 Carol，今年 25 歲

# 多個回傳值
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([1, 5, 3, 9, 2])
print(f"最小值：{minimum}，最大值：{maximum}")
```

## 實用範例

### 簡單的待辦事項程式

```python
# 待辦事項清單
todos = []

def add_todo(task):
    """新增待辦事項"""
    todos.append({"task": task, "done": False})
    print(f"已新增：{task}")

def list_todos():
    """列出所有待辦事項"""
    if not todos:
        print("沒有待辦事項")
        return
    
    for i, todo in enumerate(todos, 1):
        status = "✓" if todo["done"] else "○"
        print(f"{i}. [{status}] {todo['task']}")

def mark_done(index):
    """標記完成"""
    if 0 <= index < len(todos):
        todos[index]["done"] = True
        print(f"已完成：{todos[index]['task']}")
    else:
        print("無效的編號")

# 使用範例
add_todo("學習 Python")
add_todo("寫作業")
add_todo("運動 30 分鐘")

list_todos()
mark_done(0)
list_todos()
```

## 常見錯誤與解決方法

### 1. 縮排錯誤
```python
# 錯誤
if True:
print("Hello")  # IndentationError

# 正確
if True:
    print("Hello")
```

### 2. 型別錯誤
```python
# 錯誤
age = "25"
next_age = age + 1  # TypeError

# 正確
age = "25"
next_age = int(age) + 1
```

### 3. 索引錯誤
```python
# 錯誤
fruits = ["apple", "banana"]
print(fruits[2])  # IndexError

# 正確
if len(fruits) > 2:
    print(fruits[2])
else:
    print("索引超出範圍")
```

## 學習資源

1. **官方文件**
   - [Python 官方教學](https://docs.python.org/zh-tw/3/tutorial/)
   - [Python 標準函式庫](https://docs.python.org/zh-tw/3/library/)

2. **線上課程**
   - [Codecademy Python Course](https://www.codecademy.com/learn/learn-python-3)
   - [Python for Everybody](https://www.py4e.com/)

3. **練習網站**
   - [LeetCode](https://leetcode.com/)
   - [HackerRank](https://www.hackerrank.com/domains/python)

## 下一步

恭喜你完成了 Python 基礎學習！接下來可以：

- 學習更進階的概念（類別、例外處理、模組）
- 探索 Python 的應用領域（網頁開發、資料分析、機器學習）
- 開始你的第一個 Python 專案

> 💡 **記住**：程式設計就像學習語言，需要大量練習。每天寫一點程式碼，持續進步！

---

*最後更新：2024-01-25*