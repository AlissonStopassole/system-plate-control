import cv2
import numpy as np
import webcolors
import time

# Corta a imagem da placa
def cropImage(image, rect):
    x, y, w, h = computeSafeRegion(image.shape, rect)
    return image[y : y + h, x : x + w]


# Localiza a imagem da placa
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
    image_color_cropped = image[padding : resize_h - padding, 0 : image.shape[1]]
    image = cv2.cvtColor(image_color_cropped, cv2.COLOR_RGB2GRAY)
    cv2.imshow("GRAY", image)
    cv2.waitKey(0)
    watches = watch_cascade.detectMultiScale(
        image, en_scale, 2, minSize=(36, 9), maxSize=(36 * 40, 9 * 40)
    )

    for (x, y, w, h) in watches:

        x -= w * 0.14
        w += w * 0.28
        y -= h * 0.15
        h += h * 0.3

        cropped = cropImage(image_color_cropped, (int(x), int(y), int(w), int(h)))
        return cropped


# Pesquisa por tons de azul na placa
def findCorBlueInPlate(cropedImage):
    width, height = cropedImage.shape[:2]
    # Caso a imagem seja muito pequena aumenta o tamanho e ajusta o histograma de cores
    if width < 50 and height < 150:
        cropedImage = cv2.resize(cropedImage, (200, 65))
        img_to_yuv = cv2.cvtColor(cropedImage, cv2.COLOR_BGR2YUV)
        img_to_yuv[:, :, 0] = cv2.equalizeHist(img_to_yuv[:, :, 0])
        cropedImage = cv2.cvtColor(img_to_yuv, cv2.COLOR_YUV2BGR)

    # Matiz (tonalidade), Saturação, Valor (brilho) de 0 a 100%;
    hsv = cv2.cvtColor(cropedImage, cv2.COLOR_BGR2HSV)
    cv2.imshow("HSV", hsv)
    cv2.waitKey(0)
    # define range of blue color in HSV
    lower_blue = np.array([50, 50, 50])
    upper_blue = np.array([130, 255, 255])
    # Threshold the HSV image to get only blue colors
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    # Bitwise-AND mask and original image
    res = cv2.bitwise_and(cropedImage, cropedImage, mask=mask)
    # obtem uma lista de RBG da imagem
    cv2.imshow("AZUL", res)
    cv2.waitKey(0)
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


if __name__ == "__main__":
    originalImg = cv2.imread("teste3.png")

    cv2.imshow("ORIGINAL", originalImg)
    cv2.waitKey(0)

    t1 = time.time()
    try:
        cropedImage = cropImageContorn(
            originalImg, originalImg.shape[0], top_bottom_padding_rate=0.1
        )

        cv2.imshow("corte", cropedImage)
        cv2.waitKey(0)
        contAzul = findCorBlueInPlate(cropedImage)

        if contAzul:
            print("Placa Nova")
        else:
            print("Placa Antiga")

    except:
        print("Não Reconhecido")
    finally:
        t2 = time.time()
        print(t2 - t1)

