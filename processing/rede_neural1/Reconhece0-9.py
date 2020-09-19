num_epoch=200

import time
# from IPython import get_ipython
import os,cv2
import numpy as np
import matplotlib.pyplot as plt
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
from keras import backend as K
K.set_image_data_format('channels_first')
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.layers.convolutional import Convolution2D, MaxPooling2D

#%%

PATH = os.getcwd()
data_path = PATH + '/data'
data_dir_list = os.listdir(data_path)

img_rows=128
img_cols=128
num_channel=1

#Alterar-Mudar
num_classes = 10

img_data_list=[]

for dataset in data_dir_list:
    img_list=os.listdir(data_path+'/'+ dataset)
    # print ('Loaded the images of dataset-'+'{}\n'.format(dataset))
    for img in img_list:
        input_img=cv2.imread(data_path + '/'+ dataset + '/'+ img )
        input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
        input_img_resize=cv2.resize(input_img,(128,128))
        img_data_list.append(input_img_resize)

img_data = np.array(img_data_list)
img_data = img_data.astype('float32')
img_data /= 255
# print (img_data.shape)

if num_channel==1:
    if K.image_data_format()=='channels_first':
        img_data= np.expand_dims(img_data, axis=1) 
        # print (img_data.shape)
    else:
        img_data= np.expand_dims(img_data, axis=4) 
        # print (img_data.shape)
        
else:
    if K.image_dim_ordering()=='channels_first':
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
        # print ('Loaded the images of dataset-'+'{}\n'.format(dataset))
        for img in img_list:
            input_img=cv2.imread(data_path + '/'+ dataset + '/'+ img )
            input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
            input_img_flatten=image_to_feature_vector(input_img,(128,128))
            img_data_list.append(input_img_flatten)
    
    img_data = np.array(img_data_list)
    img_data = img_data.astype('float32')
    # print (img_data.shape)
    img_data_scaled = preprocessing.scale(img_data)
    # print (img_data_scaled.shape)
    
    # print (np.std(img_data_scaled))
    
    # print (img_data_scaled.mean(axis=0))
    # print (img_data_scaled.std(axis=0))
    
    if K.image_dim_ordering()=='channels_first':
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],num_channel,img_rows,img_cols)
        # print (img_data_scaled.shape)
        
    else:
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],img_rows,img_cols,num_channel)
        # print (img_data_scaled.shape)
    
    
    if K.image_dim_ordering()=='channels_first':
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],num_channel,img_rows,img_cols)
        # print (img_data_scaled.shape)
        
    else:
        img_data_scaled=img_data_scaled.reshape(img_data.shape[0],img_rows,img_cols,num_channel)
        # print (img_data_scaled.shape)

if USE_SKLEARN_PREPROCESSING:
    img_data=img_data_scaled
#%%
# Assigning Labels

num_of_samples = img_data.shape[0]
labels = np.ones((num_of_samples,),dtype='int64')

#Alterar-Mudar
labels[   0:  17]  =0
labels[  17:  34]  =1
labels[  34:  51]  =2
labels[  51:  68]  =3
labels[  68:  85]  =4
labels[  85: 102]  =5
labels[ 102: 119]  =6
labels[ 119: 136]  =7
labels[ 136: 153]  =8
labels[ 153: 170]  =9
      
names = ['0','1','2','3','4','5','6','7','8','9']
      
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
model.add(Convolution2D(32, 5,5,border_mode='same',input_shape=input_shape))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

#Original 32,3,3
model.add(Convolution2D(32, 5,5,border_mode='same',input_shape=input_shape))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

#Original 32,3,3
model.add(Convolution2D(16, 3, 3))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))


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
# print('Test Loss:', score[0])
# print('Test accuracy:', score[1])
test_image = X_test[0:1]
# print (test_image.shape)
# print(model.predict(test_image))
# print(model.predict_classes(test_image))
# print(y_test[0:1])
 

#%%

# Visualizing the intermediate layer

def get_featuremaps(model, layer_idx, X_batch):
    get_activations = K.function([model.layers[0].input, K.learning_phase()],[model.layers[layer_idx].output,])
    activations = get_activations([X_batch,0])
    return activations

layer_num=3
filter_num=0

activations = get_featuremaps(model, int(layer_num),test_image)

# print (np.shape(activations))
feature_maps = activations[0][0]      
# print (np.shape(feature_maps))

if K.common.image_dim_ordering() == 'channels_first':
    feature_maps=np.rollaxis((np.rollaxis(feature_maps,2,0)),2,0)

# fig=plt.figure(figsize=(16,16))
# plt.imshow(feature_maps[:,:,filter_num],cmap='gray')

# num_of_featuremaps=feature_maps.shape[2]
# fig=plt.figure(figsize=(16,16))    
# plt.title("featuremaps-layer-{}".format(layer_num))
# subplot_num=int(np.ceil(np.sqrt(num_of_featuremaps)))
# for i in range(int(num_of_featuremaps)):
#     ax = fig.add_subplot(subplot_num, subplot_num, i+1)
#     ax.imshow(feature_maps[:,:,i],cmap='gray')
#     plt.xticks([])
#     plt.yticks([])
#     plt.tight_layout()
# plt.show()

#%%
# Printing the confusion matrix
from sklearn.metrics import classification_report,confusion_matrix
import itertools

Y_pred = model.predict(X_test)
# print(Y_pred)
y_pred = np.argmax(Y_pred, axis=1)
# print(y_pred)

#Alterar-Mudar
target_names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# print(classification_report(np.argmax(y_test,axis=1), y_pred, labels=target_names))

# print(confusion_matrix(np.argmax(y_test,axis=1), y_pred))


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
        # print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    # print(cm)

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
plt.show()

#%%

from keras.models import load_model
# model.save('modelo.h5')
model=load_model('modelo.h5')

while(True):
    file = '3.png'
        
    test_image = cv2.imread(file)
    test_image=cv2.cvtColor(test_image, cv2.COLOR_BGR2GRAY)
    test_image=cv2.resize(test_image,(128,128))
    test_image = np.array(test_image)
    test_image = test_image.astype('float32')
    test_image /= 255
       
    if num_channel==1:
        if K.common.image_dim_ordering() == 'channels_first':
            test_image= np.expand_dims(test_image, axis=0)
            test_image= np.expand_dims(test_image, axis=0)
        else:
            test_image= np.expand_dims(test_image, axis=0) 
            test_image= np.expand_dims(test_image, axis=0)         
    else:
        if K.common.image_dim_ordering() == 'channels_first':
            test_image=np.rollaxis(test_image,2,0)
            test_image= np.expand_dims(test_image, axis=0)
        else:
            test_image= np.expand_dims(test_image, axis=0)
            
    # Predicting the test image
    Percentual = model.predict(test_image)
    Posicao    = model.predict_classes(test_image)
    
    layer_num=3
    filter_num=4
    
    activations = get_featuremaps(model, int(layer_num),test_image)
    feature_maps = activations[0][0]      
    
    if K.common.image_dim_ordering()=='channels_first':
        feature_maps=np.rollaxis((np.rollaxis(feature_maps,2,0)),2,0)
    
    plt.imshow(feature_maps[:,:,filter_num],cmap='gray')
    
    num_of_featuremaps=feature_maps.shape[2]
    subplot_num=int(np.ceil(np.sqrt(num_of_featuremaps)))
    for i in range(int(num_of_featuremaps)):
        # ax = fig.add_subplot(subplot_num, subplot_num, i+1)
        # ax.imshow(feature_maps[:,:,i],cmap='gray')
        plt.xticks([])
        plt.yticks([])
        plt.tight_layout()
    
    # get_ipython().magic('clear')
    plt.show()
    
    print(Posicao)
    if  (Posicao == 0 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 0 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 1 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 1 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 2 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 2 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 3 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 3 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 4 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 4 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 5 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 5 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 6 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 6 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 7 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 7 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 8 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 8 {Percentual[0][Posicao]*100}%')
    elif(Posicao == 9 and Percentual[0][Posicao]> 0.50):
        print(f'Numero 9 {Percentual[0][Posicao]*100}%')
    else:
        print(f'Desconhecido. Melhore sua caligrafia!')
        
    time.sleep(1)
