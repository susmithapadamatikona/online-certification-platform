from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math

OUT = Path(r"c:\Online_Certification\assets\intro.webp")

W, H = 1600, 900
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

def lerp(a, b, t):
    return int(a + (b - a) * t)

def blend(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(4))

def draw_linear_gradient(target, c1, c2, horizontal=False):
    px = target.load()
    w, h = target.size
    for y in range(h):
      for x in range(w):
        t = x / max(w - 1, 1) if horizontal else y / max(h - 1, 1)
        px[x, y] = blend(c1, c2, t)

def add_radial_glow(base, center, radius, color, alpha=180):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for r in range(radius, 0, -8):
        a = int(alpha * (r / radius) ** 2)
        fill = color[:3] + (a,)
        d.ellipse((center[0]-r, center[1]-r, center[0]+r, center[1]+r), fill=fill)
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 12))
    base.alpha_composite(layer)

def round_rect(d, box, r, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def font(path, size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size=size)
        except Exception:
            pass
    return ImageFont.load_default()

base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_linear_gradient(base, (247, 242, 235, 255), (185, 219, 247, 255), horizontal=False)
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(overlay)

# Top pink band and general atmosphere
round_rect(d, (0, 0, W, 120), 0, (245, 205, 224, 140))
round_rect(d, (0, 120, W, H), 0, (255, 255, 255, 0))
add_radial_glow(base, (240, 220), 180, (255, 255, 255, 255), 160)
add_radial_glow(base, (1330, 200), 260, (255, 255, 255, 255), 90)
add_radial_glow(base, (1160, 620), 280, (255, 255, 255, 255), 80)
add_radial_glow(base, (220, 760), 260, (255, 255, 255, 255), 70)

# grid / wireframe
for y in range(120, H, 140):
    d.line((0, y, W, y), fill=(255, 255, 255, 75), width=2)
for x in range(120, W, 260):
    d.line((x, 0, x, H), fill=(255, 255, 255, 60), width=2)
for p in [(130, 700, 600, 220), (40, 590, 1200, 260), (250, 140, 1360, 350)]:
    d.line(p, fill=(255, 255, 255, 60), width=2)

f_title = font("", 28, True)
f_big = font("", 38, True)
f_med = font("", 25, True)
f_small = font("", 20, False)

# top app bar
round_rect(d, (510, 22, 1110, 118), 10, (32, 50, 79, 255), outline=(18, 32, 58, 255), width=4)
d.text((548, 42), "SKILL VALIDATION ROADMAP", fill=(255, 255, 255, 255), font=f_big)
d.rounded_rectangle((560, 84, 1040, 98), 7, fill=(93, 196, 234, 255))
d.text((560, 102), "PROGRESS: 75%  |  SKILLS VALIDATED: 75/100", fill=(225, 237, 255, 255), font=f_small)
for i, cx in enumerate([1035, 1075, 1115]):
    d.ellipse((cx, 36, cx+42, 78), fill=[(171,210,250), (255,206,175), (173,233,206)][i], outline=(255,255,255,200), width=2)

# main curved roadmap line
nodes = [
    (115, 580), (225, 575), (340, 490), (460, 585), (620, 580),
    (760, 500), (880, 400), (1060, 470), (1215, 315)
]
for i in range(len(nodes) - 1):
    x1, y1 = nodes[i]
    x2, y2 = nodes[i + 1]
    d.line((x1, y1, x2, y2), fill=(39, 211, 255, 255), width=18)
    d.line((x1 + 6, y1 + 4, x2 + 6, y2 + 4), fill=(45, 124, 255, 140), width=8)

labels = [
    ("Begin\nJourney", (70, 635)),
    ("Module 1", (160, 630)),
    ("Practice", (315, 430)),
    ("Module 2", (410, 655)),
    ("Module 3", (585, 650)),
    ("Module 4", (720, 370)),
    ("Certification\n& Verified\nSkills", (865, 265)),
    ("Visible\nProgress", (1290, 120)),
]
for text, pos in labels:
    d.multiline_text(pos, text, fill=(29, 47, 77, 255), font=f_med, spacing=1)

def node(cx, cy, r, accent=(105, 217, 255, 255), inner=None):
    d.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(255, 255, 255, 245), outline=(215, 240, 250, 255), width=5)
    d.ellipse((cx-12, cy-12, cx+12, cy+12), fill=accent)
    if inner == "check":
        d.line((cx-10, cy+2, cx-2, cy+10), fill=(29, 47, 77, 255), width=5)
        d.line((cx-2, cy+10, cx+12, cy-12), fill=(29, 47, 77, 255), width=5)
    elif inner == "code":
        d.text((cx-18, cy-18), "</>", fill=(29, 47, 77, 255), font=f_small)
    elif inner == "gear":
        d.text((cx-16, cy-18), "⚙", fill=(29, 47, 77, 255), font=f_med)
    elif inner == "clock":
        d.text((cx-10, cy-16), "◔", fill=(29, 47, 77, 255), font=f_med)
    elif inner == "badge":
        d.text((cx-12, cy-18), "🎓", fill=(29, 47, 77, 255), font=f_med)

node(115, 580, 34, (111, 226, 255, 255))
node(225, 575, 38, (111, 226, 255, 255), "check")
node(340, 490, 40, (111, 226, 255, 255), "code")
node(460, 585, 38, (111, 226, 255, 255))
node(620, 580, 40, (111, 226, 255, 255), "gear")
node(760, 500, 42, (111, 226, 255, 255), "clock")
node(880, 400, 46, (111, 226, 255, 255), "badge")
node(1060, 470, 40, (111, 226, 255, 255), "clock")
node(1215, 315, 40, (255, 145, 72, 255), "badge")

# central certification success area
round_rect(d, (770, 190, 1040, 520), 42, (255, 255, 255, 220), outline=(215, 238, 249, 255), width=5)
round_rect(d, (810, 230, 1000, 460), 56, (98, 126, 192, 255), outline=(123, 214, 255, 255), width=6)
for rr, a in [(84, 60), (100, 38), (120, 24)]:
    d.ellipse((842-rr, 287-rr, 842+rr, 287+rr), fill=(255, 255, 255, a))
d.ellipse((790, 210, 1015, 515), outline=(147, 228, 255, 100), width=4)
d.text((816, 360), "ACADEMIC\nACHIEVEMENT", fill=(19, 34, 58, 255), font=f_title, spacing=2)
d.text((804, 248), "CERTIFICATION & SUCCESS", fill=(19, 34, 58, 255), font=f_med)
d.text((795, 482), "PROGRESS: 75%   |   SKILLS VALIDATED: 75/100", fill=(19, 34, 58, 255), font=f_small)

def desk(box, col):
    round_rect(d, box, 18, col)
desk((20, 710, 485, 885), (234, 241, 248, 255))
desk((560, 710, 970, 885), (234, 241, 248, 255))
desk((1080, 710, 1580, 885), (234, 241, 248, 255))

def person(cx, cy, scale, shirt, skin, hair):
    # body
    round_rect(d, (cx-42*scale, cy+32*scale, cx+42*scale, cy+132*scale), 22*scale, shirt)
    # head
    d.ellipse((cx-28*scale, cy-2*scale, cx+28*scale, cy+54*scale), fill=skin)
    d.ellipse((cx-34*scale, cy-14*scale, cx+34*scale, cy+20*scale), fill=hair)
    d.line((cx-14*scale, cy+16*scale, cx+14*scale, cy+16*scale), fill=(45,45,45,255), width=max(2, int(2*scale)))

person(135, 610, 0.95, (155, 176, 203, 255), (248, 205, 173, 255), (57, 84, 96, 255))
person(250, 615, 1.00, (130, 148, 88, 255), (115, 69, 46, 255), (36, 48, 52, 255))
person(720, 635, 1.05, (186, 109, 82, 255), (243, 201, 171, 255), (58, 55, 58, 255))
person(890, 645, 0.92, (137, 88, 57, 255), (242, 207, 179, 255), (91, 68, 40, 255))
person(1265, 640, 0.95, (122, 134, 147, 255), (230, 185, 145, 255), (70, 79, 88, 255))
person(1390, 640, 0.92, (209, 163, 44, 255), (245, 210, 183, 255), (68, 46, 41, 255))

# screens and monitors
def monitor(x0, y0, w, h):
    round_rect(d, (x0, y0, x0+w, y0+h), 8, (25, 52, 80, 255))
    round_rect(d, (x0+8, y0+8, x0+w-8, y0+h-8), 6, (10, 18, 36, 255))
    d.line((x0+w/2, y0+h, x0+w/2, y0+h+20), fill=(120,132,147,255), width=6)

monitor(340, 735, 120, 80)
monitor(780, 735, 150, 90)
monitor(1110, 730, 125, 82)
monitor(1230, 730, 125, 82)
d.text((360, 760), "///", fill=(93, 221, 255, 255), font=f_big)
d.text((806, 765), "{ }", fill=(93, 221, 255, 255), font=f_big)
d.text((1128, 760), "charts", fill=(180, 211, 255, 255), font=f_small)
d.text((1242, 760), "cloud", fill=(180, 211, 255, 255), font=f_small)

# side cards and labels
round_rect(d, (1310, 250, 1520, 330), 8, (236, 243, 247, 255), outline=(95, 115, 140, 255), width=4)
round_rect(d, (1310, 360, 1520, 460), 8, (236, 243, 247, 255), outline=(95, 115, 140, 255), width=4)
round_rect(d, (1310, 500, 1520, 600), 8, (236, 243, 247, 255), outline=(95, 115, 140, 255), width=4)
d.text((1326, 276), "Measurable\nProgress", fill=(29, 47, 77, 255), font=f_med)
d.text((1326, 400), "Shareable\nCertificate", fill=(29, 47, 77, 255), font=f_med)
d.text((1326, 542), "Visible\nProgress", fill=(29, 47, 77, 255), font=f_med)

# left booth and labels
round_rect(d, (20, 340, 180, 640), 6, (232, 239, 243, 255), outline=(155, 166, 180, 255), width=4)
d.text((34, 372), "START\nVERIFICATION", fill=(29, 47, 77, 255), font=f_med)
node(100, 490, 38, (171, 255, 102, 255), "badge")
round_rect(d, (40, 640, 300, 800), 20, (233, 241, 247, 255), outline=(155, 166, 180, 255), width=3)
round_rect(d, (280, 780, 480, 880), 16, (233, 241, 247, 255), outline=(155, 166, 180, 255), width=3)

# footer ribbon / desk legs
d.text((20, 320), "LEARNERS\nWORKING\nTOGETHER", fill=(29, 47, 77, 255), font=f_med, spacing=2)
d.text((740, 310), "LEARNING\nIN ACTION", fill=(29, 47, 77, 255), font=f_big, spacing=1)

img = Image.alpha_composite(base, overlay)
img = img.filter(ImageFilter.GaussianBlur(radius=0.2))
rgb = img.convert("RGB")
rgb.save(OUT, "WEBP", quality=82, method=6)
print(OUT)
