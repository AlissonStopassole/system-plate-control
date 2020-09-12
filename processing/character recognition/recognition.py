from PIL import Image  # Importando o módulo Pillow para abrir a imagem no script
import cv2

import pytesseract  # Módulo para a utilização da tecnologia OCR

pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files (x86)/Tesseract-OCR/tesseract.exe'
img = cv2.imread('pretoebranco.png')
print(pytesseract.image_to_string(img))
