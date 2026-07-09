import json
import os
import urllib.parse
import urllib.request
import tkinter as tk
from tkinter import ttk, messagebox

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


_env = load_env(ENV_PATH)
WEATHER_API_KEY = _env.get("weather_api", "")
AIRKOREA_API_KEY = _env.get("airkorea_api", "")

SIDO_TO_CITY = {
    "서울": "Seoul", "부산": "Busan", "대구": "Daegu", "인천": "Incheon",
    "광주": "Gwangju", "대전": "Daejeon", "울산": "Ulsan", "세종": "Sejong",
    "경기": "Suwon", "강원": "Chuncheon", "충북": "Cheongju", "충남": "Cheonan",
    "전북": "Jeonju", "전남": "Mokpo", "경북": "Pohang", "경남": "Changwon",
    "제주": "Jeju",
}
SIDO_LIST = list(SIDO_TO_CITY.keys())

PM_GRADE_TEXT = {"1": "좋음", "2": "보통", "3": "나쁨", "4": "매우나쁨"}
PM_GRADE_COLOR = {"1": "#3498DB", "2": "#58D68D", "3": "#F5B041", "4": "#E74C3C"}

BAD_WEATHER_CONDITIONS = {"Rain", "Drizzle", "Thunderstorm", "Snow"}


def get_weather(city):
    query = urllib.parse.urlencode({
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric",
        "lang": "kr",
    })
    url = f"https://api.openweathermap.org/data/2.5/weather?{query}"
    with urllib.request.urlopen(url, timeout=5) as response:
        data = json.loads(response.read().decode("utf-8"))

    return {
        "temp": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "description": data["weather"][0]["description"],
        "main": data["weather"][0]["main"],
    }


def get_air_quality(sido_name):
    query = urllib.parse.urlencode({
        "serviceKey": AIRKOREA_API_KEY,
        "returnType": "json",
        "numOfRows": "10",
        "pageNo": "1",
        "sidoName": sido_name,
        "ver": "1.3",
    })
    url = f"http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?{query}"
    with urllib.request.urlopen(url, timeout=5) as response:
        data = json.loads(response.read().decode("utf-8"))

    items = data.get("response", {}).get("body", {}).get("items", [])
    for item in items:
        if item.get("pm10Value") not in (None, "-") and item.get("pm25Value") not in (None, "-"):
            return {
                "station": item.get("stationName"),
                "pm10_value": item.get("pm10Value"),
                "pm10_grade": item.get("pm10Grade"),
                "pm25_value": item.get("pm25Value"),
                "pm25_grade": item.get("pm25Grade"),
            }
    return None


def evaluate_condition(weather, air):
    reasons = []
    level = 0  # 0=추천, 1=주의, 2=비추천

    if weather["main"] in BAD_WEATHER_CONDITIONS:
        level = max(level, 2)
        reasons.append(f"날씨: {weather['description']}")

    temp = weather["temp"]
    if temp <= 0 or temp >= 33:
        level = max(level, 2)
        reasons.append(f"기온 {temp:.1f}℃ (한파/폭염 주의)")
    elif temp <= 5 or temp >= 30:
        level = max(level, 1)
        reasons.append(f"기온 {temp:.1f}℃ (다소 덥거나 추움)")

    if air:
        pm10_grade = air["pm10_grade"]
        pm25_grade = air["pm25_grade"]
        worst_grade = max(pm10_grade or "1", pm25_grade or "1")
        if worst_grade == "4":
            level = max(level, 2)
            reasons.append(f"미세먼지 매우나쁨 (PM10 {air['pm10_value']} / PM2.5 {air['pm25_value']})")
        elif worst_grade == "3":
            level = max(level, 1)
            reasons.append(f"미세먼지 나쁨 (PM10 {air['pm10_value']} / PM2.5 {air['pm25_value']})")
    else:
        reasons.append("미세먼지 정보를 가져오지 못했습니다.")

    if not reasons:
        reasons.append("날씨와 대기질 모두 양호합니다.")

    verdict = {0: ("외출 추천", "#58D68D"), 1: ("외출 주의", "#F5B041"), 2: ("외출 비추천", "#E74C3C")}[level]
    return verdict, reasons


def on_check():
    if not WEATHER_API_KEY:
        messagebox.showerror("설정 오류", ".env 파일에 weather_api 키가 없습니다.")
        return
    if not AIRKOREA_API_KEY:
        messagebox.showerror("설정 오류", ".env 파일에 airkorea_api 키가 없습니다.")
        return

    sido = sido_var.get()
    city = SIDO_TO_CITY[sido]

    try:
        weather = get_weather(city)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            messagebox.showerror("조회 오류", "도시를 찾을 수 없습니다.")
        else:
            messagebox.showerror("조회 오류", f"날씨 정보를 가져오지 못했습니다. ({e.code})")
        return
    except urllib.error.URLError:
        messagebox.showerror("조회 오류", "네트워크 연결을 확인해주세요.")
        return

    try:
        air = get_air_quality(sido)
    except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError):
        air = None

    (verdict_text, verdict_color), reasons = evaluate_condition(weather, air)

    weather_label.config(
        text=f"{sido} 날씨: {weather['description']}\n"
             f"현재 {weather['temp']:.1f}℃ (체감 {weather['feels_like']:.1f}℃)"
    )

    if air:
        air_label.config(
            text=f"{sido} 대기질 ({air['station']})\n"
                 f"PM10 {air['pm10_value']} ({PM_GRADE_TEXT.get(air['pm10_grade'], '?')})  "
                 f"PM2.5 {air['pm25_value']} ({PM_GRADE_TEXT.get(air['pm25_grade'], '?')})",
            fg=PM_GRADE_COLOR.get(max(air["pm10_grade"] or "1", air["pm25_grade"] or "1"), "#2C3E50"),
        )
    else:
        air_label.config(text=f"{sido} 대기질 정보를 가져오지 못했습니다.", fg="#7F8C8D")

    verdict_label.config(text=verdict_text, fg=verdict_color)
    reason_label.config(text="\n".join(f"· {r}" for r in reasons))


root = tk.Tk()
root.title("오늘 외출 컨디션 알리미")
root.geometry("380x560")
root.resizable(False, False)
root.configure(bg="#F4F6F7")

tk.Label(root, text="오늘 외출 컨디션 알리미", font=("Helvetica", 18, "bold"), bg="#F4F6F7").pack(pady=(20, 15))

input_frame = tk.Frame(root, bg="#F4F6F7")
input_frame.pack(pady=5)

tk.Label(input_frame, text="지역(시/도):", font=("Helvetica", 12), bg="#F4F6F7").grid(row=0, column=0, padx=5, pady=6, sticky="e")
sido_var = tk.StringVar(value="서울")
sido_combo = ttk.Combobox(input_frame, textvariable=sido_var, values=SIDO_LIST, width=10, state="readonly", justify="center")
sido_combo.grid(row=0, column=1, padx=5, pady=6)

BUTTON_BG = "#2C3E50"
BUTTON_BG_HOVER = "#1B2631"

check_button = tk.Label(
    root, text="오늘 컨디션 확인", font=("Helvetica", 13, "bold"),
    bg=BUTTON_BG, fg="white", padx=16, pady=8, cursor="pointinghand",
)
check_button.pack(pady=10)
check_button.bind("<Button-1>", lambda e: on_check())
check_button.bind("<Enter>", lambda e: check_button.config(bg=BUTTON_BG_HOVER))
check_button.bind("<Leave>", lambda e: check_button.config(bg=BUTTON_BG))

tk.Frame(root, bg="#D5D8DC", height=1).pack(fill="x", padx=20, pady=10)

weather_label = tk.Label(root, text="", font=("Helvetica", 12), bg="#F4F6F7", justify="center")
weather_label.pack(pady=5)

air_label = tk.Label(root, text="", font=("Helvetica", 12), bg="#F4F6F7", justify="center")
air_label.pack(pady=5)

tk.Frame(root, bg="#D5D8DC", height=1).pack(fill="x", padx=20, pady=10)

verdict_label = tk.Label(root, text="", font=("Helvetica", 24, "bold"), bg="#F4F6F7")
verdict_label.pack(pady=(5, 10))

reason_label = tk.Label(root, text="", font=("Helvetica", 11), bg="#F4F6F7", justify="left", fg="#5D6D7E")
reason_label.pack(pady=(0, 10))

root.mainloop()
