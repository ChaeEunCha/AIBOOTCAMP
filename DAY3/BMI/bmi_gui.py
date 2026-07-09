import tkinter as tk
from tkinter import messagebox

CATEGORY_STYLE = {
    "저체중":  {"color": "#5DADE2", "width": 40},
    "정상":    {"color": "#58D68D", "width": 55},
    "과체중":  {"color": "#F5B041", "width": 70},
    "비만":    {"color": "#E67E22", "width": 85},
    "고도비만": {"color": "#E74C3C", "width": 100},
}


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


def draw_body(category):
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

    bmi = calculate_bmi(weight, height)
    category = classify_bmi(bmi)
    style = CATEGORY_STYLE[category]

    result_label.config(text=f"BMI {bmi:.2f}", fg=style["color"])
    category_label.config(text=category, fg=style["color"])
    draw_body(category)


root = tk.Tk()
root.title("BMI 계산기")
root.geometry("360x480")
root.resizable(False, False)
root.configure(bg="#F4F6F7")

tk.Label(root, text="BMI 계산기", font=("Helvetica", 20, "bold"), bg="#F4F6F7").pack(pady=(20, 10))

body_canvas = tk.Canvas(root, width=150, height=160, bg="#F4F6F7", highlightthickness=0)
body_canvas.pack(pady=5)
draw_body("정상")

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
