import numpy as np, glob, os
from PIL import Image
SRC='assets-in/zip1'; OUT='public/img'
fs=sorted(glob.glob(SRC+'/*.jpg'))
M={0:'bg_map',12:'bg_start',20:'bg_village',24:'bg_castle',22:'bg_museum',21:'bg_future',
 7:'mascot_wave',3:'mascot_cheer',6:'mascot_think',5:'mascot_sad',4:'mascot_point',
 13:'item_falcon',2:'item_dallah',1:'item_finjan',14:'item_sadu',11:'item_majlis',26:'item_thobe',27:'item_dhow',23:'item_pearl',
 8:'obj_camel',9:'obj_diver',10:'obj_fish',25:'obj_house',
 15:'badge_1',19:'badge_2',17:'badge_3',18:'badge_4',16:'badge_5'}
for i,f in enumerate(fs):
    name=M[i]; im=Image.open(f).convert('RGB')
    if name.startswith('bg_'):
        im.thumbnail((1600,1600)); im.save(f'{OUT}/{name}.webp','WEBP',quality=80); continue
    a=np.asarray(im).astype(np.float32); r,g,b=a[...,0],a[...,1],a[...,2]
    d=g-np.maximum(r,b)
    alpha=1-np.clip((d-40)/(110-40),0,1)
    # despill
    lim=np.maximum(r,b)+8
    g2=np.where(d>0,np.minimum(g,lim),g)
    rgba=np.dstack([r,g2,b,alpha*255]).astype(np.uint8)
    img=Image.fromarray(rgba,'RGBA')
    bbox=Image.fromarray((alpha*255).astype(np.uint8)).point(lambda v:255 if v>20 else 0).getbbox()
    img=img.crop(bbox); img.thumbnail((640,640),Image.LANCZOS)
    img.save(f'{OUT}/{name}.webp','WEBP',quality=88,method=6)
    print(name,img.size)
