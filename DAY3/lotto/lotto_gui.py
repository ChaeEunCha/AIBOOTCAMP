#!/usr/bin/env python3
"""로또 번호 생성기 - GUI 버전 (tkinter)"""

import tkinter as tk
from tkinter import font, messagebox

from lotto import generate_game

BG = "#1b1f2a"
PANEL = "#242a3a"
ACCENT = "#ffb703"
ACCENT_DARK = "#e29e00"
TEXT_LIGHT = "#f4f4f6"
TEXT_MUTED = "#a0a6b8"
CANVAS_BG = "#10131a"


def ball_color(n):
    if n <= 10:
        return "#fbc400"
    if n <= 20:
        return "#69c8f2"
    if n <= 30:
        return "#ff7272"
    if n <= 40:
        return "#aaaaaa"
    return "#b0d840"


def draw_ball(canvas, x, y, n, r=16):
    color = ball_color(n)
    canvas.create_oval(x - r, y - r + 2, x + r, y + r + 2, fill="#000000", outline="", stipple="gray50")
    canvas.create_oval(x - r, y - r, x + r, y + r, fill=color, outline="#ffffff", width=1)
    canvas.create_text(x, y, text=str(n), fill="#1b1f2a", font=("Helvetica", 12, "bold"))


def on_generate():
    try:
        count = int(count_var.get())
        if count < 1:
            raise ValueError
    except ValueError:
        messagebox.showerror("입력 오류", "게임 수는 1 이상의 정수여야 합니다.")
        return

    exclude_text = exclude_var.get().strip()
    exclude = set()
    if exclude_text:
        try:
            exclude = {int(n.strip()) for n in exclude_text.split(",") if n.strip()}
        except ValueError:
            messagebox.showerror("입력 오류", "제외 번호는 쉼표로 구분된 숫자여야 합니다. 예: 1,7,23")
            return

    for child in result_frame.winfo_children():
        child.destroy()

    for i in range(1, count + 1):
        numbers = generate_game(exclude)

        row = tk.Frame(result_frame, bg=PANEL)
        row.pack(fill=tk.X, pady=4, padx=4)

        tk.Label(
            row, text=f"{i}", bg=PANEL, fg=ACCENT,
            font=("Helvetica", 12, "bold"), width=3,
        ).pack(side=tk.LEFT, padx=(4, 6))

        canvas = tk.Canvas(row, width=42 * 6, height=40, bg=PANEL, highlightthickness=0)
        canvas.pack(side=tk.LEFT)
        for idx, n in enumerate(numbers):
            draw_ball(canvas, 20 + idx * 42, 20, n)


root = tk.Tk()
root.title("로또 번호 생성기")
root.geometry("420x520")
root.configure(bg=BG)
root.resizable(False, False)

title_font = font.Font(family="Helvetica", size=20, weight="bold")
label_font = font.Font(family="Helvetica", size=11)

tk.Label(
    root, text="🍀 로또 번호 생성기", bg=BG, fg=ACCENT, font=title_font,
).pack(pady=(20, 4))
tk.Label(
    root, text="행운의 번호를 뽑아보세요", bg=BG, fg=TEXT_MUTED, font=label_font,
).pack(pady=(0, 16))

form = tk.Frame(root, bg=BG)
form.pack(padx=24, fill=tk.X)

tk.Label(form, text="생성할 게임 수", bg=BG, fg=TEXT_LIGHT, font=label_font).grid(
    row=0, column=0, sticky="w", pady=6
)
count_var = tk.StringVar(value="1")
tk.Entry(
    form, textvariable=count_var, width=8, font=label_font,
    bg=PANEL, fg=TEXT_LIGHT, insertbackground=TEXT_LIGHT,
    relief=tk.FLAT, highlightthickness=1, highlightbackground=PANEL, highlightcolor=ACCENT,
).grid(row=0, column=1, sticky="w", padx=(12, 0), pady=6)

tk.Label(form, text="제외 번호 (쉼표 구분)", bg=BG, fg=TEXT_LIGHT, font=label_font).grid(
    row=1, column=0, sticky="w", pady=6
)
exclude_var = tk.StringVar(value="")
tk.Entry(
    form, textvariable=exclude_var, width=16, font=label_font,
    bg=PANEL, fg=TEXT_LIGHT, insertbackground=TEXT_LIGHT,
    relief=tk.FLAT, highlightthickness=1, highlightbackground=PANEL, highlightcolor=ACCENT,
).grid(row=1, column=1, sticky="w", padx=(12, 0), pady=6)

generate_btn = tk.Button(
    root, text="번호 생성", command=on_generate,
    bg=ACCENT, fg="#1b1f2a", activebackground=ACCENT_DARK, activeforeground="#1b1f2a",
    font=("Helvetica", 12, "bold"), relief=tk.FLAT, cursor="hand2",
    padx=16, pady=8,
)
generate_btn.pack(pady=18)
generate_btn.bind("<Enter>", lambda e: generate_btn.configure(bg=ACCENT_DARK))
generate_btn.bind("<Leave>", lambda e: generate_btn.configure(bg=ACCENT))

result_container = tk.Frame(root, bg=CANVAS_BG, highlightthickness=1, highlightbackground=PANEL)
result_container.pack(padx=24, pady=(0, 20), fill=tk.BOTH, expand=True)

result_frame = tk.Frame(result_container, bg=PANEL)
result_frame.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)

root.mainloop()
