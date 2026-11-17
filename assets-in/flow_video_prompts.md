# فيديو فلو — طريقة العمل: صورة أولاً (Frame 1) ثم تحريك

لكل مقطع خطوتان:
1. **FRAME**: ولّد صورة 16:9 تمثل الإطار الأول بالضبط (برومبت الصورة).
2. **ANIMATE**: حرّك هذه الصورة (Image-to-Video، 8 ثوانٍ، 10 للخاتمة) ببرومبت حركة قصير يصف الحركة فقط، لأن شكل المشهد جاهز في الصورة.

الإخراج: MP4 باسم المقطع في `public/video/` (مثل `intro1.mp4`)، ثم `enabled: true` في `VIDEO_CLIPS` داخل `src/data/content.ts`.
قواعد عامة: بدون أشخاص ولا شخصيات تاريخية ولا نساء، بدون نص على الشاشة، بدون موسيقى، حركة كاميرا هادئة. أسلوب: Pixar-style 3D cartoon، مناسب للأطفال.

---

## intro1 — اكتشف وطنك (خريطة قطر)
FRAME | 16:9 | Top-down 3D cartoon view of the Qatar peninsula on a bright turquoise Arabian Gulf, golden sandy land, tiny cute landmarks (a tower, a dhow, a fort) scattered on the land, soft white waves around the coast, light clouds at the edges, sunny warm light. Clear uncluttered composition. Pixar-style 3D cartoon render, rich saturated colors, child-friendly. No text, no letters, no people.
ANIMATE | Slow gentle camera glide forward and slightly down over the map. Waves roll softly along the coast, clouds drift slowly, the tiny landmarks glow one after another. Calm, smooth, no cuts.

## intro2 — رحلة إلى الماضي (قرية الأجداد)
FRAME | 16:9 | Old Qatari fishing and pearl-diving village at sunset: mud-and-stone houses with palm-leaf roofs, a wooden dhow on calm water, a camel resting on the sand, fishing nets drying, warm orange-pink sky, golden reflections on the sea. Pixar-style 3D cartoon render, rich colors, child-friendly. No text, no people.
ANIMATE | Slow gentle push-in. The dhow rocks softly on the water, palm leaves sway in the breeze, nets move slightly, golden light shimmers on the waves. Calm, no cuts.

## intro3 — أبطال التاريخ (القلعة)
FRAME | 16:9 | Historic Qatari sand-colored fort with towers and crenellated walls under a bright blue sky, a courtyard with a palm tree and traditional lanterns, golden sunlight, a few white birds in the sky. Pixar-style 3D cartoon render, rich colors, child-friendly. No text, no people.
ANIMATE | Slow upward camera tilt revealing the tall fort walls. The palm tree sways gently, lantern flames flicker warmly, birds glide across the sky. Smooth, no cuts.

## intro4 — كنوز هويتنا (المتحف)
FRAME | 16:9 | Interior of a cozy Qatari heritage museum hall: warm sand-colored walls with maroon geometric patterns, arched windows with soft sunbeams, empty glowing display pedestals and glass cases arranged in a semicircle, wooden floor. Pixar-style 3D cartoon render, rich colors, child-friendly. No text, no people.
ANIMATE | Slow dolly forward through the hall. The pedestals light up softly one after another, sunbeams from the arched windows shimmer with floating dust sparkles. Smooth, no cuts.

## intro5 — قطر المستقبل
FRAME | 16:9 | Modern futuristic Doha at dawn: sleek glass towers, green parks, solar panels, a clean waterfront with sailing boats, a tram on tidy palm-lined avenues, bright optimistic sky with soft pink and gold light. Pixar-style 3D cartoon render, rich colors, child-friendly. No text, no people.
ANIMATE | Camera rises gently while moving forward. The tram glides along the waterfront, sailing boats drift on the water, trees sway, solar panels glint in the sunrise light. Smooth, no cuts.

## finale — الخاتمة (احتفال)
FRAME | 16:9 | Joyful celebration scene: a large maroon-and-white Qatar flag on a pole in the center against a warm golden morning sky, golden confetti and sparkles floating in the air, soft glowing light, Doha skyline faint in the background. Pixar-style 3D cartoon render, rich colors, child-friendly. No text, no people.
ANIMATE | The flag waves proudly in the wind, golden confetti and sparkles fall softly, the camera slowly pushes in toward the flag, light rays shimmer. Joyful, smooth, no cuts. 10 seconds.

---
## تقليل الحجم (اختياري)
ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4
