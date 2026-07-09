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
    else:
        return "비만"


def main():
    print("=== BMI 계산기 ===")

    while True:
        try:
            weight = float(input("몸무게(kg)를 입력하세요: "))
            height = float(input("키(cm)를 입력하세요: "))
            if weight <= 0 or height <= 0:
                print("몸무게와 키는 0보다 큰 값이어야 합니다. 다시 입력해주세요.\n")
                continue
            break
        except ValueError:
            print("숫자만 입력해주세요.\n")

    bmi = calculate_bmi(weight, height)
    category = classify_bmi(bmi)

    print(f"\n당신의 BMI는 {bmi:.2f}이며, '{category}'입니다.")


if __name__ == "__main__":
    main()
