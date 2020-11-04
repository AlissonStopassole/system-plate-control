num_epoch=200

import time
# from IPython import get_ipython
import os,cv2
import numpy as np
import matplotlib.pyplot as plt
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
from keras import backend as K
K.common.image_dim_ordering()
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.layers.convolutional import Convolution2D, MaxPooling2D

#%%

PATH = os.getcwd()
data_path = PATH + '/data2'
data_dir_list = os.listdir(data_path)

img_rows=128
img_cols=128
num_channel=1

#Alterar-Mudar
num_classes = 26

img_data_list=[]

for dataset in data_dir_list:
    img_list=os.listdir(data_path+'/'+ dataset)
    print ('Loaded the images of dataset-'+'{}\n'.format(dataset))
    for img in img_list:
        input_img=cv2.imread(data_path + '/'+ dataset + '/'+ img )
        input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
        input_img_resize=cv2.resize(input_img,(128,128))
        img_data_list.append(input_img_resize)

img_data = np.array(img_data_list)
img_data = img_data.astype('float32')
img_data /= 255
print (img_data.shape)

if num_channel==1:
    if K.image_data_format()=='th':
        img_data= np.expand_dims(img_data, axis=1) 
        print (img_data.shape)
    else:
        img_data= np.expand_dims(img_data, axis=2) 
        print (img_data.shape)
        
else:
    if K.image_data_format()=='th':
        img_data=np.rollaxis(img_data,3,1)
        print (img_data.shape)
        
#%%
USE_SKLEARN_PREPROCESSING=False

if USE_SKLEARN_PREPROCESSING:
    # using sklearn for preprocessing
    from sklearn import preprocessing
    
    def image_to_feature_vector(image, size=(128, 128)):
        # resize the image to a fixed size, then flatten the image into
        # a list of raw pixel intensities
        return cv2.resize(image, size).flatten()
    
    img_data_list=[]
    for dataset in data_dir_list:
        img_list=os.listdir(data_path+'/'+ dataset)
        print ('Loaded the images of dataset-'+'{}\n'.format(dataset))
        for img in img_list:
            input_img=cv2.imread(data_path + '/'+ dataset + '/'+ img )
            input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
            input_img_flatten=image_to_feature_vector(input_img,(128,128))
            img_data_list.append(input_img_flatten)
    
    img_data = np.array(img_data_list)
    img_data = img_data.astype('float32')
    print (img_data.shape)
    img_data_scaled = preprocessing.scale(img_data)
    print (img_data_scaled.shape)
    
    print (np.std(img_data_scaled))
    
    print (img_data_scaled.mean(axis=0))
    print (img_data_scaled.std(axis=0))
    
    if K.image_data_format()=='th':
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],num_channel,img_rows,img_cols)
        print (img_data_scaled.shape)
        
    else:
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],img_rows,img_cols,num_channel)
        print (img_data_scaled.shape)
    
    
    if K.image_data_format()=='th':
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],num_channel,img_rows,img_cols)
        print (img_data_scaled.shape)
        
    else:
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],img_rows,img_cols,num_channel)
        print (img_data_scaled.shape)

if USE_SKLEARN_PREPROCESSING:
    img_data=img_data_scaled
#%%
# Assigning Labels

num_of_samples = img_data.shape[0]
labels = np.ones((num_of_samples,),dtype='int64')

#Alterar-Mudar
labels[ 0: 3]  =0
labels[ 3: 5]  =1
labels[ 5: 7]  =2
labels[ 7: 10]  =3
labels[ 10: 13]  =4
labels[ 13:15]  =5
labels[15:17]  =6
labels[17:19]  =7
labels[19:22]  =8
labels[22:24]  =9
labels[24:28]  =10
labels[28:30]  =11
labels[30:32]  =12
labels[32:35]  =13
labels[35:37]  =14
labels[37:39]  =15
labels[39:41]  =16
labels[41:43]  =17
labels[43:45]  =18
labels[45:47]  =19
labels[47:49]  =20
labels[49:51]  =21
labels[51:53]  =22
labels[53:56]  =23
labels[56:58]  =24
labels[58:60]  =25
      
names = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      
      
# convert class labels to on-hot encoding
Y = np_utils.to_categorical(labels, num_classes)

#Shuffle the dataset
x,y = shuffle(img_data,Y, random_state=2)
# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.1, random_state=2)

#%%
# Defining the model
input_shape=img_data[0].shape
                    
model = Sequential()


#Original 32,3,3
model.add(Convolution2D(32, strides=5,kernel_size=5, padding='same',input_shape=input_shape))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2), padding='same'))

#Original 32,3,3
model.add(Convolution2D(32, strides=5,kernel_size=5, padding='same',input_shape=input_shape))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2), padding='same'))

#Original 32,3,3
model.add(Convolution2D(16, strides=3,kernel_size=3, padding='same',input_shape=input_shape))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2),padding='same'))


#original 0.5
model.add(Dropout(0.2))


model.add(Flatten())
model.add(Dense(128))
model.add(Activation('relu'))
model.add(Dense(64))
model.add(Activation('relu'))
model.add(Dense(32))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(num_classes))
model.add(Activation('softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam',metrics=["acc"])




# Viewing model_configuration
model.summary()
model.get_config()
model.layers[0].get_config()
model.layers[0].input_shape            
model.layers[0].output_shape            
model.layers[0].get_weights()
np.shape(model.layers[0].get_weights()[0])
model.layers[0].trainable

#%%


#----------------------------------------------------
#                      Treinamento
#----------------------------------------------------


# hist = model.fit(X_train, y_train, batch_size=16, nb_epoch=num_epoch, verbose=1, validation_data=(X_test, y_test))

# # visualizing losses and accuracy
# train_loss=hist.history['loss']
# val_loss=hist.history['val_loss']
# train_acc=hist.history['acc']
# val_acc=hist.history['val_acc']
# xc=range(num_epoch)

# plt.figure(1,figsize=(7,5))
# plt.plot(xc,train_loss)
# plt.plot(xc,val_loss)
# plt.xlabel('num of Epochs')
# plt.ylabel('loss')
# plt.title('train_loss vs val_loss')
# plt.grid(True)
# plt.legend(['train','val'])
# #print plt.style.available # use bmh, classic,ggplot for big pictures
# plt.style.use(['classic'])

# plt.figure(2,figsize=(7,5))
# plt.plot(xc,train_acc)
# plt.plot(xc,val_acc)
# plt.xlabel('num of Epochs')
# plt.ylabel('accuracy')
# plt.title('train_acc vs val_acc')
# plt.grid(True)
# plt.legend(['train','val'],loc=4)
# plt.style.use(['classic'])


#----------------------------------------------------
#                   Fim do Treinamento
#----------------------------------------------------


# Evaluating the model
score = model.evaluate(X_test, y_test, verbose=0)
print('Test Loss:', score[0])
print('Test accuracy:', score[1])
test_image = X_test[0:1]
print (test_image.shape)
print(model.predict(test_image))
print(model.predict_classes(test_image))
print(y_test[0:1])
 

#%%

# Visualizing the intermediate layer

def get_featuremaps(model, layer_idx, X_batch):
    get_activations = K.function([model.layers[0].input, K.learning_phase()],[model.layers[layer_idx].output,])
    activations = get_activations([X_batch,0])
    return activations

layer_num=3
filter_num=0

activations = get_featuremaps(model, int(layer_num),test_image)

print (np.shape(activations))
feature_maps = activations[0][0]      
print (np.shape(feature_maps))

if K.image_data_format()=='th':
    feature_maps=np.rollaxis((np.rollaxis(feature_maps,2,0)),2,0)

fig=plt.figure(figsize=(16,16))
plt.imshow(feature_maps[:,:,filter_num],cmap='gray')

num_of_featuremaps=feature_maps.shape[2]
fig=plt.figure(figsize=(16,16))    
plt.title("featuremaps-layer-{}".format(layer_num))
subplot_num=int(np.ceil(np.sqrt(num_of_featuremaps)))
for i in range(int(num_of_featuremaps)):
    ax = fig.add_subplot(subplot_num, subplot_num, i+1)
    ax.imshow(feature_maps[:,:,i],cmap='gray')
    plt.xticks([])
    plt.yticks([])
    plt.tight_layout()
# plt.show()

#%%
# Printing the confusion matrix
from sklearn.metrics import classification_report,confusion_matrix
import itertools

Y_pred = model.predict(X_test)
print(Y_pred)
y_pred = np.argmax(Y_pred, axis=1)
print(y_pred)

#Alterar-Mudar
target_names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(classification_report(np.argmax(y_test,axis=1), y_pred, labels=target_names))

print(confusion_matrix(np.argmax(y_test,axis=1), y_pred))


# Plotting the confusion matrix
def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, cm[i, j],
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')

# Compute confusion matrix
cnf_matrix = (confusion_matrix(np.argmax(y_test,axis=1), y_pred))

np.set_printoptions(precision=2)

plt.figure()

# Plot non-normalized confusion matrix
plot_confusion_matrix(cnf_matrix, classes=target_names,
                      title='Confusion matrix')
# plt.show()

#%%

from keras.models import load_model
# model.save('modelo.h5')
model=load_model('modeloAZ.h5')

def processImage(test_image):
    # file = 'a.png'    
    # test_image = cv2.imread(file)
    # test_image=cv2.cvtColor(test_image, cv2.COLOR_BGR2GRAY)
    
    test_image=cv2.resize(test_image,(128,128))
    test_image = np.array(test_image)
    test_image = test_image.astype('float32')
    test_image /= 255
       
    if num_channel==1:
        if K.image_data_format()=='th':
            test_image= np.expand_dims(test_image, axis=0)
            test_image= np.expand_dims(test_image, axis=0)
        else:
            test_image= np.expand_dims(test_image, axis=1) 
            test_image= np.expand_dims(test_image, axis=0)         
    else:
        if K.image_data_format()=='th':
            test_image=np.rollaxis(test_image,2,0)
            test_image= np.expand_dims(test_image, axis=0)
        else:
            test_image= np.expand_dims(test_image, axis=0)
            
    # Predicting the test image
    Percentual = model.predict(test_image)
    Posicao    = model.predict_classes(test_image)

    print(Posicao)
    
    layer_num=3
    filter_num=4
    
    activations = get_featuremaps(model, int(layer_num),test_image)
    feature_maps = activations[0][0]      
    
    if K.image_data_format()=='th':
        feature_maps=np.rollaxis((np.rollaxis(feature_maps,2,0)),2,0)
    
    plt.imshow(feature_maps[:,:,filter_num],cmap='gray')
    
    num_of_featuremaps=feature_maps.shape[2]
    subplot_num=int(np.ceil(np.sqrt(num_of_featuremaps)))
    # for i in range(int(num_of_featuremaps)):
        # ax = fig.add_subplot(subplot_num, subplot_num, i+1)
        # ax.imshow(feature_maps[:,:,i],cmap='gray')
        # plt.xticks([])
        # plt.yticks([])
        # plt.tight_layout()
    
    # get_ipython().magic('clear')
    # plt.show()

    print(Posicao)
    if  (Posicao == 0 and Percentual[0][Posicao]> 0.50):
        print(f'Letra A {Percentual[0][Posicao]*100}%')
        return 'A'
    if(Posicao == 1 and Percentual[0][Posicao]> 0.50):
        print(f'Letra B {Percentual[0][Posicao]*100}%')
        return 'B'
    if(Posicao == 2 and Percentual[0][Posicao]> 0.50):
        print(f'Letra C {Percentual[0][Posicao]*100}%')
        return 'C'
    if(Posicao == 3 and Percentual[0][Posicao]> 0.50):
        print(f'Letra D {Percentual[0][Posicao]*100}%')
        return 'D'
    if(Posicao == 4 and Percentual[0][Posicao]> 0.50):
        print(f'Letra E {Percentual[0][Posicao]*100}%')
        return 'E'
    if(Posicao == 5 and Percentual[0][Posicao]> 0.50):
        print(f'Letra F {Percentual[0][Posicao]*100}%')
        return 'F'
    if(Posicao == 6 and Percentual[0][Posicao]> 0.50):
        print(f'Letra G {Percentual[0][Posicao]*100}%')
        return 'G'
    if(Posicao == 7 and Percentual[0][Posicao]> 0.50):
        print(f'Letra H {Percentual[0][Posicao]*100}%')
        return 'H'
    if(Posicao == 8 and Percentual[0][Posicao]> 0.50):
        print(f'Letra I {Percentual[0][Posicao]*100}%')
        return 'I'
    if(Posicao == 9 and Percentual[0][Posicao]> 0.50):
        print(f'Letra J {Percentual[0][Posicao]*100}%')
        return 'J'
    if(Posicao == 10 and Percentual[0][Posicao]> 0.50):
        print(f'Letra K {Percentual[0][Posicao]*100}%')
        return 'K'
    if(Posicao == 11 and Percentual[0][Posicao]> 0.50):
        print(f'Letra L {Percentual[0][Posicao]*100}%')
        return 'L'
    if(Posicao == 12 and Percentual[0][Posicao]> 0.50):
        print(f'Letra M {Percentual[0][Posicao]*100}%')
        return 'M'
    if(Posicao == 13 and Percentual[0][Posicao]> 0.50):
        print(f'Letra N {Percentual[0][Posicao]*100}%')
        return 'N'
    if(Posicao == 14 and Percentual[0][Posicao]> 0.50):
        print(f'Letra O {Percentual[0][Posicao]*100}%')
        return 'O'
    if(Posicao == 15 and Percentual[0][Posicao]> 0.50):
        print(f'Letra P {Percentual[0][Posicao]*100}%')
        return 'P'
    if(Posicao == 16 and Percentual[0][Posicao]> 0.50):
        print(f'Letra Q {Percentual[0][Posicao]*100}%')
        return 'Q'
    if(Posicao == 17 and Percentual[0][Posicao]> 0.50):
        print(f'Letra R {Percentual[0][Posicao]*100}%')
        return 'R'
    if(Posicao == 18 and Percentual[0][Posicao]> 0.50):
        print(f'Letra S {Percentual[0][Posicao]*100}%')
        return 'S'
    if(Posicao == 19 and Percentual[0][Posicao]> 0.50):
        print(f'Letra T {Percentual[0][Posicao]*100}%')
        return 'T'
    if(Posicao == 20 and Percentual[0][Posicao]> 0.50):
        print(f'Letra U {Percentual[0][Posicao]*100}%')
        return 'U'
    if(Posicao == 21 and Percentual[0][Posicao]> 0.50):
        print(f'Letra V {Percentual[0][Posicao]*100}%')
        return 'V'
    if(Posicao == 22 and Percentual[0][Posicao]> 0.50):
        print(f'Letra W {Percentual[0][Posicao]*100}%')
        return 'W'
    if(Posicao == 23 and Percentual[0][Posicao]> 0.50):
        print(f'Letra X {Percentual[0][Posicao]*100}%')
        return 'X'
    if(Posicao == 24 and Percentual[0][Posicao]> 0.50):
        print(f'Letra Y {Percentual[0][Posicao]*100}%')
        return 'Y'
    if(Posicao == 25 and Percentual[0][Posicao]> 0.50):
        print(f'Letra Z {Percentual[0][Posicao]*100}%')
        return 'Z'
        
    time.sleep(1)
