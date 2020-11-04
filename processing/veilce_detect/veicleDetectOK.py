import cv2
import numpy as np
from time import sleep
import webcolors
import time
from matplotlib import pyplot as plt
from PIL import Image
import segment_image
from urllib.request import urlopen

# Plate detect
# --------------------------------------------------------------------


def cropImage(image, rect):
    x, y, w, h = computeSafeRegion(image.shape, rect)
    return image[y:y + h, x:x + w]


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


def cropImageContorn(image,
                     resize_h=720,
                     en_scale=1.08,
                     top_bottom_padding_rate=0.05):
    if top_bottom_padding_rate > 0.2:
        exit(1)

    # Arquivo treiando
    watch_cascade = cv2.CascadeClassifier("melhordetodos.xml")

    height = image.shape[0]
    padding = int(height * top_bottom_padding_rate)

    scale = image.shape[1] / float(image.shape[0])

    image = cv2.resize(image, (int(scale * resize_h), resize_h))

    image_color_cropped = image[padding:resize_h - padding, 0:image.shape[1]]

    image = cv2.cvtColor(image_color_cropped, cv2.COLOR_RGB2GRAY)

    watches = watch_cascade.detectMultiScale(image,
                                             en_scale,
                                             2,
                                             minSize=(36, 9),
                                             maxSize=(36 * 40, 9 * 40))
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
    # define range of blue color in HSV
    lower_blue = np.array([50, 50, 50])
    upper_blue = np.array([130, 255, 255])
    # Threshold the HSV image to get only blue colors
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    # Bitwise-AND mask and original image
    res = cv2.bitwise_and(cropedImage, cropedImage, mask=mask)
    # Plot image mostrando soment o azul

    # obtem uma lista de RBG da imagem
    b, g, r = cv2.split(res)
    rgb = cv2.merge([r, g, b])

    # Percorre os rgb pra verificar a ocorrrencia de azul
    azul = 0
    for i in range(len(rgb)):
        for k in range(len(rgb[0])):
            corAtual = webcolors.rgb_to_hex(
                (((rgb[i])[k][0]), ((rgb[i])[k][1]), ((rgb[i])[k][2])))
            # invalida cor preta e busca por ocorrencia de azul = "#00"
            # invalida cor contorno do recorte 00ff00
            if (corAtual != "#000000" and corAtual != "#00ff00"
                    and corAtual[:3] == "#00"):
                azul += 1
                if azul > 1:
                    return True
    return False


# Tons de Preto
# ------------------------------------------------


def grayscalePlate():
    cropedImage = cv2.imread("cropImage.png", 0)
    cropedImage = cv2.resize(cropedImage, (420, 130))
    # cropedImage = cv2.medianBlur(cropedImage, 5)
    ret, th1 = cv2.threshold(cropedImage, 127, 255, cv2.THRESH_BINARY)
    th2 = cv2.adaptiveThreshold(cropedImage, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                cv2.THRESH_BINARY, 11, 2)
    th3 = cv2.adaptiveThreshold(cropedImage, 255,
                                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv2.THRESH_BINARY, 11, 2)
    # retorna 4 tipos de Threshold
    images = [cropedImage, th1, th2, th3]
    return images


# Inicio
# ------------------------------------


def getPlate(frame):
    t1 = time.time()

    cropedImage = cropImageContorn(frame,
                                   frame.shape[0],
                                   top_bottom_padding_rate=0.1)

    if cropedImage is None:
        return

    contAzul = findCorBlueInPlate(cropedImage)

    norm_img = np.zeros((800, 800))
    cropedImage = cv2.normalize(cropedImage, norm_img, 0, 255, cv2.NORM_MINMAX)

    cv2.imwrite("cropImage.png", cropedImage)
    images = grayscalePlate()
    # # Pega a posição do list
    # images[2]
    cv2.imwrite("grayCrop.png", images[2])
    placaNova = False

    if contAzul:
        print("Placa Nova")
        placaNova = True
    else:
        placaNova = False
        print("Placa Antiga")

    t2 = time.time()
    print("Tempo", t2 - t1)

    segment_image.segmentar(placaNova)

    try:
        urlopen("http://localhost:3000/new-veicle/AIK1466/{contAzul}").read()
    except:
        print("Erro")


# Veicle detect
# ----------------------------------------------------------------
largura_min = 160  # Largura minima do retangulo
altura_min = 70  # Altura minima do retangulo

offset = 6  # Erro permitido entre pixel

# pos_linha = 320  # Posição da linha de contagem
pos_linha = 185  # Posição da linha de contagem

delay = 60  # FPS do vídeo

detec = []
carros = 0


def pega_centro(x, y, w, h):
    x1 = int(w / 2)
    y1 = int(h / 2)
    cx = x + x1
    cy = y + y1
    return cx, cy


# cap = cv2.VideoCapture('video_brasa_garagem.mp4')
cap = cv2.VideoCapture('video_palca_nova.mp4')
subtracao = cv2.bgsegm.createBackgroundSubtractorMOG()
ok = True
while True:
    ret, frame1 = cap.read()
    frame1 = cv2.rotate(frame1, cv2.ROTATE_90_COUNTERCLOCKWISE)
    frame1 = cv2.rotate(frame1, cv2.ROTATE_90_COUNTERCLOCKWISE)
    frame1 = cv2.rotate(frame1, cv2.ROTATE_90_COUNTERCLOCKWISE)
    ret2, frameaux = cap.read()
    frameaux = cv2.rotate(frameaux, cv2.ROTATE_90_COUNTERCLOCKWISE)
    frameaux = cv2.rotate(frameaux, cv2.ROTATE_90_COUNTERCLOCKWISE)
    frameaux = cv2.rotate(frameaux, cv2.ROTATE_90_COUNTERCLOCKWISE)
    tempo = float(1 / delay)
    # sleep(tempo)
    if frame1 is None:
        break
    grey = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(grey, (3, 3), 5)
    img_sub = subtracao.apply(blur)
    dilat = cv2.dilate(img_sub, np.ones((5, 5)))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilatada = cv2.morphologyEx(dilat, cv2.MORPH_CLOSE, kernel)
    dilatada = cv2.morphologyEx(dilatada, cv2.MORPH_CLOSE, kernel)

    contorno, h = cv2.findContours(dilatada, cv2.RETR_TREE,
                                   cv2.CHAIN_APPROX_SIMPLE)

    cv2.line(frame1, (10, pos_linha), (320, pos_linha), (255, 127, 0), 3)

    for (i, c) in enumerate(contorno):
        (x, y, w, h) = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        # validar_contorno = (w >=
        #                     largura_min) and (w <= largura_min * 1.2) and (
        #                         h >= altura_min) and (h <= altura_min * 1.2)
        validar_contorno = (w >= largura_min) and (h >= altura_min)
        if not validar_contorno:
            continue

        cv2.rectangle(frame1, (x, y), (x + w, y + h), (0, 255, 0), 2)
        centro = pega_centro(x, y, w, h)
        detec.append(centro)
        cv2.circle(frame1, centro, 4, (0, 0, 255), -1)

        for (x, y) in detec:
            if (ok):
                if y < (pos_linha + offset) and y > (pos_linha - offset):
                    carros += 1
                    cv2.line(frame1, (10, pos_linha), (320, pos_linha),
                             (0, 127, 255), 3)
                    detec.remove((x, y))
                    cv2.imshow("Achoiu", frameaux)
                    getPlate(frameaux)
                    ok = False

    cv2.imshow("Video Original", frameaux)
    if cv2.waitKey(1) == 27:
        break

ok = True
cv2.destroyAllWindows()
cap.release()
