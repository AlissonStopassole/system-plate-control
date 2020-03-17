import cv2
import numpy as np
from matplotlib import pyplot as plt

watch_cascade = cv2.CascadeClassifier("melhordetodos.xml")
image = cv2.imread("img1.png")


# def subContourns(src):
#     width, height = src.shape[:2]

#     src = cv2.resize(src, (int(height * 150 / 100), int(width * 150 / 100)))

#     cinza = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

#     _, canny_output = cv2.threshold(cinza, 127, 255, cv2.THRESH_BINARY)

#     contours, _ = cv2.findContours(
#         canny_output, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

#     return len(contours)


# def filter(src):
#     width, height = src.shape[:2]
#     src = cv2.resize(src, (int(400), int(130)))

#     cinza = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

#     canny_output = cv2.Canny(cinza, 130, 0 * 2)

#     contours, _ = cv2.findContours(
#         canny_output, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

#     contours_poly = [None] * len(contours)
#     boundRect = [None] * len(contours)

#     for i, c in enumerate(contours):
#         contours_poly[i] = cv2.approxPolyDP(c, 3, True)
#         boundRect[i] = cv2.boundingRect(contours_poly[i])

#     i = 0
#     for c in contours:
#         # perimetro do contorno, verifica se o contorno é fechado
#         perimetro = cv2.arcLength(c, True)
#         if perimetro > 80:
#             # aproxima os contornos da forma correspondente
#             (x, y, alt, lar) = cv2.boundingRect(c)
#             crop = src[y: y + lar, x: x + alt]
#             cv2.rectangle(src, (x, y), (x + alt, y + lar), (0, 255, 0), 2)
#             scale = crop.shape[1] / float(crop.shape[0])
#             print(scale)
#             # if round(scale) == 3:
#             # subContorn = subContourns(crop)
#             # if subContorn > 10 and subContorn < 50:
#             #     print(scale)
#             #     cv2.imshow("Contours", crop)
#             #     cv2.waitKey(0)

#             i += 1
#     cv2.imshow("Contours", src)
#     cv2.waitKey(0)


def detectPlateRough(
    image_gray, resize_h=720, en_scale=1.08, top_bottom_padding_rate=0.05
):
    if top_bottom_padding_rate > 0.2:
        exit(1)

    height = image_gray.shape[0]
    padding = int(height * top_bottom_padding_rate)

    scale = image_gray.shape[1] / float(image_gray.shape[0])

    image = cv2.resize(image_gray, (int(scale * resize_h), resize_h))

    image_color_cropped = image[padding: resize_h -
                                padding, 0: image_gray.shape[1]]

    image_gray = cv2.cvtColor(image_color_cropped, cv2.COLOR_RGB2GRAY)

    watches = watch_cascade.detectMultiScale(
        image_gray, en_scale, 2, minSize=(36, 9), maxSize=(36 * 40, 9 * 40)
    )
    # cropped_images = []
    for (x, y, w, h) in watches:

        x -= w * 0.14
        w += w * 0.28
        y -= h * 0.15
        h += h * 0.3

        cropped = cropImage(image_color_cropped,
                            (int(x), int(y), int(w), int(h)))
        cropped = cv2.resize(cropped, (int(400), int(130)))
        filter(cropped)


def cropImage(image, rect):
    x, y, w, h = computeSafeRegion(image.shape, rect)
    return image[y: y + h, x: x + w]


def computeSafeRegion(shape, bounding_rect):
    top = bounding_rect[1]  # y
    bottom = bounding_rect[1] + bounding_rect[3]  # y +  h
    left = bounding_rect[0]  # x
    right = bounding_rect[0] + bounding_rect[2]  # x +  w
    min_top = 0
    max_bottom = shape[0]
    min_left = 0
    max_right = shape[1]

    if top < min_top:
        top = min_top
    if left < min_left:
        left = min_left
    if bottom > max_bottom:
        bottom = max_bottom
    if right > max_right:
        right = max_right
    return [left, top, right - left, bottom - top]


images = detectPlateRough(image, image.shape[0], top_bottom_padding_rate=0.1)
