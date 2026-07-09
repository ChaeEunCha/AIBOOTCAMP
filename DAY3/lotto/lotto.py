#!/usr/bin/env python3
"""로또 번호 생성기 - 1~45 중 6개의 번호를 무작위로 생성합니다."""

import argparse
import random


def generate_game(exclude=None):
    exclude = exclude or set()
    pool = [n for n in range(1, 46) if n not in exclude]
    return sorted(random.sample(pool, 6))


def main():
    parser = argparse.ArgumentParser(description="로또 번호 생성기")
    parser.add_argument("-n", "--count", type=int, default=1, help="생성할 게임 수 (기본값: 1)")
    parser.add_argument("-e", "--exclude", type=str, default="", help="제외할 번호 (쉼표로 구분, 예: 1,7,23)")
    args = parser.parse_args()

    exclude = set()
    if args.exclude:
        exclude = {int(n.strip()) for n in args.exclude.split(",") if n.strip()}

    for i in range(1, args.count + 1):
        numbers = generate_game(exclude)
        print(f"{i}게임: {numbers}")


if __name__ == "__main__":
    main()
