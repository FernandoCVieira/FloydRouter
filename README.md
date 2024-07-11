# Floyd Router

Este repositório destina-se ao versionamento da implementação da aplicação web desenvolvida como projeto de conclusão do curso de Ciência da Computação na UERN.

### Descrição do projeto

A aplicação web chamada Floyd Router utiliza a API do Google Maps para obter as localizações georreferenciadas com base nos pontos marcados pelo usuário no mapa, calculando a distância entre esses pontos. Essas distâncias são então aproveitadas para criar uma matriz de distâncias, que alimenta o algoritmo de Floyd-Warshall. Esse algoritmo calcula a menor rota entre todos os pontos marcados, otimizando a trajetória com base na menor distância encontrada na matriz atualizada.

No desenvolvimento deste projeto, foram utilizadas diversas tecnologias. Inicialmente, HTML foi utilizado para definir a estrutura da página, seguido pelo uso de CSS e Bootstrap para estilização. JavaScript foi a linguagem de programação escolhida para a lógica do projeto, com o auxílio do framework JQuery. Por fim, o Font Awesome foi empregado para aprimorar o estilo visual da página.

Diversos desafios surgiram durante a implementação do projeto, como a obtenção das distâncias entre os pontos marcados no mapa e a plotagem da melhor rota. O projeto ainda carece de melhorias na interface, visando tanto a versão mobile quanto um software instalado localmente para projetos futuros.

### Instruções para uso

Para seguir as instruções, o usuário precisa primeiro acessar o link do projeto disponibilizado na seguinte página [Floyd Router](https://fernandocvieira.github.io/FloydRouter/).

#### Tela Inicial

![DER](/img/imgREADME/TelaInicial.png)

A página inicial possui os seguintes componentes: um mapa interativo, um campo de entrada para definir a localização desejada pelo usuário, uma seção para exibir os pontos marcados no mapa e botões para realizar a solução, limpar a matriz e exibir a matriz de distâncias.

- Solucionar: Será chamada funcionalidade que calcula e a menor rota entre todos os pontos marcados e plotagem do mapa.
- Limpar Matriz: Atualizar a página da aplicação.
- Matriz de distância: Ao clicar será exibido a matriz de distância que foi composto pelo pontos marcados no mapa.

#### Exemplo de uso

![DER](/img/imgREADME/ExUso.png)

Com o uso do campo de entrada para que o usuário defina a localização desejada, o mapa agora está completamente marcado com os pontos, e a seção de exibição dos pontos está preenchida com os marcadores correspondentes. 

#### Resultado

![DER](/img/imgREADME/ExUso2.png)

E assim é gerado o caminho ideal e a distância percorrida com a plotagem no mapa do menor caminho.

## Contribuição com o projeto

[![Star](https://img.shields.io/github/stars/FernandoCVieira/FloydRouter?style=social)](https://github.com/FernandoCVieira/FloydRouter/stargazers)
[![Forks](https://img.shields.io/github/forks/FernandoCVieira/FloydRouter?style=social)](https://github.com/FernandoCVieira/FloydRouter/forks)
[![GitHub Issues](https://img.shields.io/github/issues/FernandoCVieira/FloydRouter?style=social)](https://github.com/FernandoCVieira/FloydRouter/issues/)

Este projeto é parte do trabalho de conclusão de curso em Ciência da Computação da Universidade Estadual do Rio Grande do Norte, com Fernando Carlos como seu principal contribuidor. Para entrar em contato, você pode enviar um e-mail para <fernando_carlos_12@hotmail.com>.