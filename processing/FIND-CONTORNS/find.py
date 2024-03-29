from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse


def subContourns(src):
    width, height = src.shape[:2]

    src = cv.resize(src, (int(height * 150 / 100), int(width * 150 / 100)))

    cinza = cv.cvtColor(src, cv.COLOR_BGR2GRAY)

    # Pega mais forma com 200
    # canny_output = cv.Canny(cinza, 200, 200 * 2)

    _, canny_output = cv.threshold(cinza, 127, 255, cv.THRESH_BINARY)

    contours, _ = cv.findContours(canny_output, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    return len(contours)


def filter(src):
    width, height = src.shape[:2]

    # src = cv.resize(src, (int(height * 90 / 100), int(width * 90 / 100)))

    src = cv.resize(src, (int(height * 150 / 100), int(width * 150 / 100)))

    cinza = cv.cvtColor(src, cv.COLOR_BGR2GRAY)

    # Pega mais forma com 200
    canny_output = cv.Canny(cinza, 200, 200 * 2)

    cv.imshow("Contours", canny_output)
    cv.waitKey(0)

    contours, _ = cv.findContours(canny_output, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    contours_poly = [None] * len(contours)
    boundRect = [None] * len(contours)

    for i, c in enumerate(contours):
        contours_poly[i] = cv.approxPolyDP(c, 3, True)
        boundRect[i] = cv.boundingRect(contours_poly[i])

    # Binariza a imagem
    # drawing = np.zeros((canny_output.shape[0], canny_output.shape[1], 3), dtype=np.uint8)

    i = 0
    for c in contours:
        # perimetro do contorno, verifica se o contorno é fechado
        perimetro = cv.arcLength(c, True)
        if perimetro > 200:
            # aproxima os contornos da forma correspondente
            (x, y, alt, lar) = cv.boundingRect(c)
            crop = src[y : y + lar, x : x + alt]
            cv.rectangle(src, (x, y), (x + alt, y + lar), (0, 255, 0), 2)
            scale = crop.shape[1] / float(crop.shape[0])
            if round(scale) == 3:
                subContorn = subContourns(crop)
                if subContorn > 10 and subContorn < 50:
                    print(scale)
                    cv.imshow("Contours", crop)
                    cv.waitKey(0)

            i += 1

    cv.imshow("Contours", src)
    cv.waitKey(0)


# cv.destroyAllWindows()


if __name__ == "__main__":
    src = cv.imread("img6.png")
    filter(src)
