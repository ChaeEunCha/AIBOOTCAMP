import json
import os
import urllib.parse
import urllib.request
import tkinter as tk
from tkinter import messagebox

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")


def load_env(path):
    env = {}
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env


WEATHER_API_KEY = load_env(ENV_PATH).get("weather_api", "")

CATEGORY_STYLE = {
    "저체중":  {"color": "#5DADE2", "width": 40},
    "정상":    {"color": "#58D68D", "width": 55},
    "과체중":  {"color": "#F5B041", "width": 70},
    "비만":    {"color": "#E67E22", "width": 85},
    "고도비만": {"color": "#E74C3C", "width": 100},
}

WEATHER_CONDITION_MAP = {
    "Rain": "rain",
    "Drizzle": "rain",
    "Thunderstorm": "rain",
    "Snow": "snow",
    "Clear": "clear",
    "Clouds": "clouds",
}

WEATHER_EMOJI = {
    "rain": "☂",     # ☂ (우산)
    "snow": "❄",     # ❄
    "clear": "☀",    # ☀
    "clouds": "☁",   # ☁
}

current_category = "정상"
current_weather = None


def calculate_bmi(weight_kg, height_cm):
    height_m = height_cm / 100
    return weight_kg / (height_m ** 2)


def classify_bmi(bmi):
    if bmi < 18.5:
        return "저체중"
    elif bmi < 23:
        return "정상"
    elif bmi < 25:
        return "과체중"
    elif bmi < 30:
        return "비만"
    else:
        return "고도비만"


def draw_body(category, weather=None):
    body_canvas.delete("all")
    style = CATEGORY_STYLE[category]
    color = style["color"]
    half_w = style["width"] / 2
    cx = 75

    # 머리
    body_canvas.create_oval(cx - 18, 10, cx + 18, 46, fill=color, outline="")
    # 몸통 (사다리꼴로 체형 표현)
    body_canvas.create_polygon(
        cx - half_w * 0.55, 55,
        cx + half_w * 0.55, 55,
        cx + half_w, 150,
        cx - half_w, 150,
        fill=color, outline="",
    )

    if weather == "rain":
        # 우산을 들고 있는 손 (오른쪽)
        hand_x, hand_y = cx + half_w + 8, 95
        body_canvas.create_line(cx + half_w * 0.75, 90, hand_x, hand_y, fill=color, width=4)
        body_canvas.create_text(hand_x, hand_y - 22, text=WEATHER_EMOJI["rain"], font=("Helvetica", 26))
    elif weather in ("clear", "clouds", "snow"):
        body_canvas.create_text(128, 22, text=WEATHER_EMOJI[weather], font=("Helvetica", 26))


def get_weather(city):
    if not WEATHER_API_KEY:
        messagebox.showerror("설정 오류", ".env 파일에 weather_api 키가 없습니다.")
        return

    query = urllib.parse.urlencode({
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric",
        "lang": "kr",
    })
    url = f"https://api.openweathermap.org/data/2.5/weather?{query}"

    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            messagebox.showerror("조회 오류", "도시를 찾을 수 없습니다.")
        else:
            messagebox.showerror("조회 오류", f"날씨 정보를 가져오지 못했습니다. ({e.code})")
        return
    except urllib.error.URLError:
        messagebox.showerror("조회 오류", "네트워크 연결을 확인해주세요.")
        return

    global current_weather

    temp = data["main"]["temp"]
    feels_like = data["main"]["feels_like"]
    description = data["weather"][0]["description"]
    main_condition = data["weather"][0]["main"]

    current_weather = WEATHER_CONDITION_MAP.get(main_condition)
    draw_body(current_category, current_weather)

    weather_label.config(
        text=f"{city} 날씨: {description}\n현재 {temp:.1f}℃ (체감 {feels_like:.1f}℃)"
    )


def on_calculate():
    try:
        weight = float(weight_entry.get())
        height = float(height_entry.get())
        if weight <= 0 or height <= 0:
            messagebox.showerror("입력 오류", "몸무게와 키는 0보다 큰 값이어야 합니다.")
            return
    except ValueError:
        messagebox.showerror("입력 오류", "숫자만 입력해주세요.")
        return

    global current_category

    bmi = calculate_bmi(weight, height)
    current_category = classify_bmi(bmi)
    style = CATEGORY_STYLE[current_category]

    result_label.config(text=f"BMI {bmi:.2f}", fg=style["color"])
    category_label.config(text=current_category, fg=style["color"])
    draw_body(current_category, current_weather)


root = tk.Tk()
root.title("BMI 계산기")
root.geometry("360x620")
root.resizable(False, False)
root.configure(bg="#F4F6F7")

tk.Label(root, text="BMI 계산기", font=("Helvetica", 20, "bold"), bg="#F4F6F7").pack(pady=(20, 10))

# 날씨 조회 (상단)
weather_frame = tk.Frame(root, bg="#F4F6F7")
weather_frame.pack(pady=5)

tk.Label(weather_frame, text="도시:", font=("Helvetica", 12), bg="#F4F6F7").grid(row=0, column=0, padx=5)
city_entry = tk.Entry(weather_frame, font=("Helvetica", 12), width=12, justify="center")
city_entry.insert(0, "Seoul")
city_entry.grid(row=0, column=1, padx=5)

tk.Button(
    weather_frame, text="날씨 조회", font=("Helvetica", 11, "bold"),
    bg="#1ABC9C", fg="white", activebackground="#16A085",
    relief="flat", padx=8, pady=4,
    command=lambda: get_weather(city_entry.get().strip() or "Seoul"),
).grid(row=0, column=2, padx=5)

weather_label = tk.Label(
    root, text="", font=("Helvetica", 12), bg="#F4F6F7", justify="center",
)
weather_label.pack(pady=(5, 10))

tk.Frame(root, bg="#D5D8DC", height=1).pack(fill="x", padx=20, pady=5)

# 체형 그림 (BMI 분류 + 날씨 반영)
body_canvas = tk.Canvas(root, width=150, height=160, bg="#F4F6F7", highlightthickness=0)
body_canvas.pack(pady=10)
draw_body(current_category, current_weather)

form_frame = tk.Frame(root, bg="#F4F6F7")
form_frame.pack(pady=10)

tk.Label(form_frame, text="몸무게 (kg):", font=("Helvetica", 12), bg="#F4F6F7").grid(row=0, column=0, padx=5, pady=8, sticky="e")
weight_entry = tk.Entry(form_frame, font=("Helvetica", 12), width=10, justify="center")
weight_entry.grid(row=0, column=1, padx=5, pady=8)

tk.Label(form_frame, text="키 (cm):", font=("Helvetica", 12), bg="#F4F6F7").grid(row=1, column=0, padx=5, pady=8, sticky="e")
height_entry = tk.Entry(form_frame, font=("Helvetica", 12), width=10, justify="center")
height_entry.grid(row=1, column=1, padx=5, pady=8)

tk.Button(
    root, text="계산하기", font=("Helvetica", 12, "bold"),
    bg="#3498DB", fg="white", activebackground="#2980B9",
    relief="flat", padx=10, pady=6, command=on_calculate,
).pack(pady=15)

result_label = tk.Label(root, text="", font=("Helvetica", 22, "bold"), bg="#F4F6F7")
result_label.pack()

category_label = tk.Label(root, text="", font=("Helvetica", 16, "bold"), bg="#F4F6F7")
category_label.pack(pady=(0, 10))

root.mainloop()
