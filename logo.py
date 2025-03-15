import matplotlib.pyplot as plt
import matplotlib.patches as patches

# 그림 설정
fig, ax = plt.subplots(figsize=(4, 4))

# 원형 배경 (메인 심볼)
circle = patches.Circle((0.5, 0.5), 0.4, facecolor='#1f77b4', alpha=0.7)
ax.add_patch(circle)

# 중앙 모노그램 텍스트 ("JW")
ax.text(0.5, 0.5, "JW", fontsize=30, fontweight='bold', color='white',
        ha='center', va='center')

# 디지털/네트워크 느낌의 선들 (회로 또는 연결선)
lines = [
    [(0.5, 0.5), (0.15, 0.85)],
    [(0.5, 0.5), (0.85, 0.85)],
    [(0.5, 0.5), (0.15, 0.15)],
    [(0.5, 0.5), (0.85, 0.15)]
]

for line in lines:
    (x0, y0), (x1, y1) = line
    ax.plot([x0, x1], [y0, y1], color='white', lw=2)

# 불필요한 축 제거
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')

# 이미지 파일로 저장 (300 dpi 해상도)
plt.savefig('logo.png', dpi=300)

plt.show()
