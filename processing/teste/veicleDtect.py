import cv2
import numpy as np
from time import sleep
import webcolors
import time
from matplotlib import pyplot as plt
from PIL import Image


# Plate detect
# --------------------------------------------------------------------


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


def cropImageContorn(image, resize_h=720, en_scale=1.08, top_bottom_padding_rate=0.05):
    if top_bottom_padding_rate > 0.2:
        exit(1)

    # Arquivo treiando
    watch_cascade = cv2.CascadeClassifier("melhordetodos.xml")

    height = image.shape[0]
    padding = int(height * top_bottom_padding_rate)

    scale = image.shape[1] / float(image.shape[0])

    image = cv2.resize(image, (int(scale * resize_h), resize_h))

    image_color_cropped = image[padding: resize_h - padding, 0: image.shape[1]]

    image = cv2.cvtColor(image_color_cropped, cv2.COLOR_RGB2GRAY)

    watches = watch_cascade.detectMultiScale(
        image, en_scale, 2, minSize=(36, 9), maxSize=(36 * 40, 9 * 40)
    )
    # cropped_images = []
    for (x, y, w, h) in watches:

        x -= w * 0.14
        w += w * 0.28
        y -= h * 0.15
        h += h * 0.3

        cropped = cropImage(image_color_cropped,
                            (int(x), int(y), int(w), int(h)))
        return cropped


def findCorBlueInPlate(cropedImage):
    width, height = cropedImage.shape[:2]
    # Caso a imagem seja muito pequena aumenta o tamanho e ajusta o histograma de cores
    if width < 50 and height < 150:
        cropedImage = cv2.resize(cropedImage, (200, 65))
        img_to_yuv = cv2.cvtColor(cropedImage, cv2.COLOR_BGR2YUV)
        img_to_yuv[:, :, 0] = cv2.equalizeHist(img_to_yuv[:, :, 0])
        cropedImage = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)

    hsv = cv2.cvtColor(cropedImage, cv2.COLOR_BGR2HSV)
    cv2.imwrite("cropImageGray2.png", hsv)
    # define range of blue color in HSV
    lower_blue = np.array([50, 50, 50])
    upper_blue = np.array([130, 255, 255])
    # Threshold the HSV image to get only blue colors
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    # Bitwise-AND mask and original image
    res = cv2.bitwise_and(cropedImage, cropedImage, mask=mask)
    # Plot image mostrando soment o azul
    cv2.imwrite("ImageBlue.png", res)
    cv2.imshow("Image", res)
    cv2.waitKey()

    # obtem uma lista de RBG da imagem
    b, g, r = cv2.split(res)
    rgb = cv2.merge([r, g, b])

    # Percorre os rgb pra verificar a ocorrrencia de azul
    azul = 0
    for i in range(len(rgb)):
        for k in range(len(rgb[0])):
            corAtual = webcolors.rgb_to_hex(
                (((rgb[i])[k][0]), ((rgb[i])[k][1]), ((rgb[i])[k][2]))
            )
            # invalida cor preta e busca por ocorrencia de azul = "#00"
            # invalida cor contorno do recorte 00ff00
            if (
                corAtual != "#000000"
                and corAtual != "#00ff00"
                and corAtual[:3] == "#00"
            ):
                azul += 1
                if azul > 1:
                    return True
    return False


def grayscalePlate():
    cropedImage = cv2.imread("cropImage.png", 0)
    # cropedImage = cv2.medianBlur(cropedImage, 5)
    ret, th1 = cv2.threshold(cropedImage, 127, 255, cv2.THRESH_BINARY)
    th2 = cv2.adaptiveThreshold(
        cropedImage, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
    )
    th3 = cv2.adaptiveThreshold(
        cropedImage, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    # retorna 4 tipos de Threshold
    images = [cropedImage, th1, th2, th3]
    return images


def filter(src):
    # src = cv2.resize(src, (400, 130))

    # cv2.imshow("Contours", src)
    # cv2.waitKey(0)

    # cinza = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

    # # Pega mais forma com 200
    # canny_output = cv2.Canny(cinza, 200, 200 * 2)

    # cv2.imshow("Contours", canny_output)
    # cv2.waitKey(0)

    contours, _ = cv2.findContours(src, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    contours_poly = [None] * len(contours)
    boundRect = [None] * len(contours)

    for i, c in enumerate(contours):
        contours_poly[i] = cv2.approxPolyDP(c, 3, True)
        boundRect[i] = cv2.boundingRect(contours_poly[i])

    i = 0
    for c in contours:
        # perimetro do contorno, verifica se o contorno é fechado
        perimetro = cv2.arcLength(c, True)
        if perimetro > 50:
            # aproxima os contornos da forma correspondente
            (x, y, alt, lar) = cv2.boundingRect(c)
            crop = src[y: y + lar, x: x + alt]
            cv2.rectangle(src, (x, y), (x + alt, y + lar), (0, 255, 0), 2)
            scale = crop.shape[1] / float(crop.shape[0])
            if round(scale) == 0 or round(scale) == 1:
                print(perimetro, scale)
                cv2.imshow("Contours", crop)
                # cv2.imwrite("cortes/" + str(perimetro) + ".png", crop)
                cv2.waitKey(0)

            i += 1

    cv2.imshow("Contours", src)
    cv2.waitKey(0)


def getPlate(frame):
    t1 = time.time()

    cropedImage = cropImageContorn(
        frame, frame.shape[0], top_bottom_padding_rate=0.1
    )

    if cropedImage is None:
        return

    contAzul = findCorBlueInPlate(cropedImage)

    images = grayscalePlate()
    # # Pega a posição do list
    # images[2]
    plt.imshow(images[1], "gray")
    plt.show()

    # filter(images[2])

    if contAzul:
        print("Placa Nova")
    else:
        print("Placa Antiga")

    t2 = time.time()
    print("Tempo", t2 - t1)


# Veicle detect
# ----------------------------------------------------------------
largura_min = 10  # Largura minima do retangulo
altura_min = 10  # Altura minima do retangulo

offset = 6  # Erro permitido entre pixel

pos_linha = 280  # Posição da linha de contagem

delay = 60  # FPS do vídeo

detec = []
carros = 0


def pega_centro(x, y, w, h):
    x1 = int(w / 2)
    y1 = int(h / 2)
    cx = x + x1
    cy = y + y1
    return cx, cy


cap = cv2.VideoCapture('Freewa.mp4')
subtracao = cv2.bgsegm.createBackgroundSubtractorMOG()

while True:
    ret, frame1 = cap.read()
    tempo = float(1/delay)
    sleep(tempo)
    if frame1 is None:
        break
    grey = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(grey, (3, 3), 5)
    img_sub = subtracao.apply(blur)
    dilat = cv2.dilate(img_sub, np.ones((5, 5)))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilatada = cv2.morphologyEx(dilat, cv2. MORPH_CLOSE, kernel)
    dilatada = cv2.morphologyEx(dilatada, cv2. MORPH_CLOSE, kernel)

    contorno, h = cv2.findContours(
        dilatada, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    cv2.line(frame1, (25, pos_linha), (1200, pos_linha), (255, 127, 0), 3)

    for(i, c) in enumerate(contorno):
        (x, y, w, h) = cv2.boundingRect(c)
        validar_contorno = (w >= largura_min) and (h >= altura_min)
        if not validar_contorno:
            continue

        cv2.rectangle(frame1, (x, y), (x+w, y+h), (0, 255, 0), 2)
        centro = pega_centro(x, y, w, h)
        detec.append(centro)
        cv2.circle(frame1, centro, 4, (0, 0, 255), -1)

        for (x, y) in detec:
            if y < (pos_linha+offset) and y > (pos_linha-offset):
                carros += 1
                cv2.line(frame1, (25, pos_linha),
                         (1200, pos_linha), (0, 127, 255), 3)
                detec.remove((x, y))
                getPlate(frame1)

    cv2.putText(frame1, "VEICULOS: "+str(carros), (0, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 5)
    cv2.imshow("Video Original", frame1)

    if cv2.waitKey(1) == 27:
        break

cv2.destroyAllWindows()
cap.release()
