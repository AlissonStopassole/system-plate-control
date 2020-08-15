from PIL import Image  # Importando o módulo Pillow para abrir a imagem no script

import pytesseract  # Módulo para a utilização da tecnologia OCR

pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files (x86)/Tesseract-OCR/tesseract.exe'

print(pytesseract.image_to_string(Image.open('teste.png')))
