#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Binarize (make it black and white) an image with Python."""

from PIL import Image
import scipy as imsave
import numpy
from matplotlib import pyplot as plt


def binarize_image(img_path, target_path, threshold):
    """Binarize an image."""
    image_file = Image.open(img_path)
    image = image_file.convert("L")  # convert image to monochrome
    image = numpy.array(image)
    image = binarize_array(image, threshold)
    plt.imshow(image, "gray")
    plt.show()


def binarize_array(numpy_array, threshold=200):
    """Binarize a numpy array."""
    for i in range(len(numpy_array)):
        for j in range(len(numpy_array[0])):
            if numpy_array[i][j] > threshold:
                numpy_array[i][j] = 255
            else:
                numpy_array[i][j] = 0
    return numpy_array


if __name__ == "__main__":
    binarize_image("img9.png", "result.png", 200)
