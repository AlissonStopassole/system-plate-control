from PIL import Image
import cv2
import pytesseract
import numpy as np
import urllib.request
import re


def show_image(name, img):
    cv2.imshow(name, img)
    cv2.waitKey(0)


def segmentar(placaNova):
    img = cv2.imread("grayCrop.png")
    copia = img.copy()
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(img_gray, 127, 255, cv2.THRESH_BINARY)

    conts, _ = cv2.findContours(thresh, cv2.RETR_CCOMP, 2)
    conts.reverse()

    i = 0
    placa = ""
    listChar = []
    for cnt in conts:
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)
        if area >= 350 and w < 50 and h < 60:
            try:
                cv2.rectangle(copia, (x, y), (x + w, y + h), (0, 0, 255), 3)
                roi = thresh[y - 2:y + h + 2, x - 2:x + w + 2]
                txt = pytesseract.image_to_string(Image.fromarray(roi),
                                                  config='--psm 10')
                placa += txt
                listChar.append({'x': x, 'image': roi})
            except:
                print(placa)
    show_image('Contornos', copia)
    cv2.waitKey(0)

    listChar = sorted(listChar, key=lambda k: k['x'])

    for img in listChar:
        print(img['x'])
        print(placaNova)
        show_image("image", img['image'])