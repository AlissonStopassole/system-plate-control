# system-plate-control PROJETO DE TCC

STOPASSOLE, Alisson. RECONHECIMENTO AUTOMÁTICO DE PLACAS VEICULARESPARA O CONTROLE DE ESTACIONAMENTOS BASEADO EM APRENDIZADODE MÁQUINA E VISÃO COMPUTACIONAL. 51 f. Trabalho de Conclusão de Curso –Coordenadoria do Curso de Engenharia de Software, Universidade Tecnológica Federal doParaná. Dois Vizinhos, 2020.

Recentemente o Mercosul (Mercado Comum do Sul) adotou um padrão comum deplacas veiculares que deverá substituir gradativamente as placas de cada um de seus estados membros. O presente projeto destina-se a implementar um algoritmo baseado em Inteligência Artificial e Visão Computacional capaz de identificar e reconhecer ambos,o novo padrão adotado de placas veiculares no formato Mercosul, bem como o formato brasileiro antigo. O objetivo deste trabalho é realizar estudos com foco nas mudanças deplaca e desenvolver um framework para a automatização do reconhecimento destas placas através de imagens e vídeos bem como demostrar este framework em um protótipo de um sistema web para controle de estacionamento. Para a validação, uma série de experimentos utilizando tanto placas antigas quanto novas será conduzido e resultados reportados.

Palavras-chave:Inteligência Artificial, Visão Computacional, Reconhecimento Automáticode Placa, Placa Mercosul.

Para execução basta configurar o ambiente em python 2.6, NodeJs, Angular 9, e Banco de dados Mongo.

Executar o back-end -> cd /api && nodemon

Executar o front-end -> cd /front && ng serve -o

Executar o algoritmo de processamento -> cd /processing/rede_neural1 && veicleDetectOK.py

Todos os demais arquivos e pastas foram bases de estudo utilizados em testes.
