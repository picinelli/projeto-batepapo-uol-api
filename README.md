<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/picinelli/projeto-batepapo-uol-api">
    <img src="https://bootcampra.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F089d96f5-8c2e-451d-be67-56fcedf3670e%2F919fa83bed3698c340186745cb0214b3-removebg-preview.png?table=block&id=88dcf7f3-e5dd-4dc0-a91a-1de8e91a0258&spaceId=f797e032-5eb2-4c9d-beb7-cd7181e19e47&width=250&userId=&cache=v2" alt="Logo" width="100">
  </a>

<h3 align="center">Projeto - API Batepapo UOL</h3>
  <h4 align="center"> 
	🚀 Concluído! 🚀
  </h4>
  <p align="center">
    Construção de uma API destinada à um clone do Batepapo UOL
    <br />
    <a href="https://github.com/picinelli/projeto-batepapo-uol-api/blob/main/index.js"><strong>Código JS»</strong></a>
</div>

<!-- ABOUT THE PROJECT -->

# Requisitos

- Geral
    - [x]  A porta utilizada pelo seu servidor deve ser a 5000 (isso facilita nossa avaliação 🙂).
    - [x]  Versionamento usando Git é obrigatório, crie um **repositório público** no seu perfil do GitHub.
    - [x]  Faça commits a cada funcionalidade implementada.
    - [x]  Utilize dotenv.
- Armazenamento de dados
    - [x]  Para persistir os dados (participantes e mensagens), utilize coleções do Mongo com a biblioteca `mongodb`.
    - [x]  O formato de um **participante** deve ser:
        
        ```jsx
        {name: 'João', lastStatus: 12313123} // O conteúdo do lastStatus será explicado nos próximos requisitos
        ```
        
    - [x]  O formato de uma **mensagem** deve ser:
        
        ```jsx
        {from: 'João', to: 'Todos', text: 'oi galera', type: 'message', time: '20:04:37'}
        ```
        
- **POST** `/participants`
    - [x]  Deve receber (pelo body da request), um parâmetro **name**, contendo o nome do participante a ser cadastrado:
        
        ```jsx
        {
            name: "João"
        }
        ```
        
    - [x]  Validar: (caso algum erro seja encontrado, retornar **status 422**)
        - [x]  **name** deve ser strings não vazio
    - [x]  As validações deveram ser feitas com a biblioteca `joi`
    - [x]  Impeça o cadastro de um nome que já está sendo utilizado (caso exista, retornar **status 409**)
    - [x]  Salvar o participante com o MongoDB, no formato:
        
        ```jsx
        {name: 'xxx', lastStatus: Date.now()}
        ```
        
    - [x]  Salvar com o MongoDB uma mensagem no formato:
        
        ```jsx
        {from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:mm:ss'}
        ```
        
        Para gerar o horário nesse formato, (utilize a biblioteca `dayjs`)
        
    - [x]  Por fim, retornar **status 201**. Não é necessário retornar nenhuma mensagem além do status.
- **GET** `/participants`
    - [x]  Retornar a lista de todos os participantes
- **POST** `/messages`
    - [x]  Deve receber (pelo body da request), os parâmetros `to`, `text` e `type`:
        
        ```jsx
        {
            to: "Maria",
            text: "oi sumida rs",
            type: "private_message"
        }
        ```
        
    - [x]  Já o `from` da mensagem, ou seja, o remetente, **não será enviado pelo body**. Será enviado pelo front através de um **header** na requisição, chamado `User`.
    - [x]  Validar: (caso algum erro seja encontrado, retornar **status 422**)
        - [x]  **to** e **text** devem ser strings não vazias
        - [x]  **type** só pode ser 'message' ou 'private_message'
        - [x]  **from** deve ser um participante existente na lista de participantes
    - [x]  As validações deveram ser feitas com a biblioteca `joi`
    - [x]  Ao salvar essa mensagem, deve ser acrescentado o atributo **time**, contendo a hora atual no formato HH:MM:SS (utilize a biblioteca `dayjs`)
    - [x]  Por fim, retornar **status 201**. Não é necessário retornar nenhuma mensagem além do status.
- **GET** `/messages`
    - [x]  Retornar as mensagens
    - [x]  Essa rota deve aceitar um parâmetro via **query string** (o que vem após a interrogação numa URL), indicando a quantidade de mensagens que gostaria de obter. Esse parâmetro deve se chamar `limit`. Ou seja, o request do front será feito pra URL:
        
        ```jsx
        http://localhost:4000/messages?limit=100
        ```
        
    - [x]  Caso não seja informado um `limit`, todas as mensagens devem ser retornadas. Caso tenha sido fornecido um `limit`, por exemplo 100, somente as últimas 100 mensagens mais recentes devem ser retornadas
    - [x]  Além disso, o back-end só deve entregar as mensagens que aquele usuário poderia ver. Ou seja, deve entregar todas as mensagens públicas, todas as mensagens privadas enviadas para ele e por ele. Para isso, o front envia um header `User` para identificar quem está fazendo a requisição
- **POST** `/status`
    - [x]  Deve receber por um **header** na requisição, chamado `User`, contendo o nome do participante a ser atualizado
    - [x]  Caso este participante não conste na lista de participantes, deve ser retornado um **status 404.** Nenhuma mensagem precisa ser retornada além do status.
    - [x]  Atualizar o atributo **lastStatus** do participante informado para o timestamp atual, utilizando `Date.now()`
    - [x]  Por fim, retornar **status 200**
- Remoção automática de usuários inativos
    - [x]  A cada 15 segundos, remova da lista de participantes os participantes que possuam um **lastStatus** de mais de 10 segundos atrásTda
        
        **Dica:** você pode usar `setInterval` no arquivo do seu servidor
        
    - [x]  Para cada participante removido, salve uma nova mensagem com o MongoDB, no formato:
        
        ```jsx
        {from: 'xxx', to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'}
        ```
        

# Bônus (opcional)

- Sanitização de dados
    
    ⚠️ (verifique se você está usando o front-end onde registrarParticipante() salva response.data.name) (o diego trocou pois encontramos um probleminha)
    
    - [x]  Ao salvar um participante, sanitizar o parâmetro **name** (remover possíveis tags HTML por segurança)
    - [x]  Ao salvar uma mensagem, sanitizar todos os parâmetros (remover possíveis tags HTML por segurança)
    - [x]  Além disso, remova possíveis espaços em branco no início e fim das strings (pesquise por **trim**)
    - [x]  Retorne o nome do usuário sanitizado para o front-end no **POST** `/participants` junto ao status 201 usando o formato:
        
        ```bash
        {
        	name: "nome sanitizado"
        }
        ```
        
- **DELETE** `/messages/ID_DA_MENSAGEM`
    - [x]  Deve receber por um **header** na requisição, chamado `User`, contendo o nome do participante que deseja deletar a mensagem
    - [x]  Deve receber por **path params** o ID da mensagem a ser deletada
    - [x]  Deve buscar na coleção `messages` se alguma mensagem existe com o id recebido, e, caso não existe, retornar **status 404**
    - [x]  Caso o usuario do header não seja o dono da mensagem, retornar **status 401**
    - [x]  Remover a mensagem da coleção `messages`
- **PUT** `/messages/ID_DA_MENSAGEM`
    - [x]  Deve receber (pelo body da request), os parâmetros `to`, `text` e `type`:
        
        ```jsx
        {
            to: "Maria",
            text: "oi sumida rs",
            type: "private_message"
        }
        ```
        
    - [x]  Já o `from` da mensagem, ou seja, o remetente, **não será enviado pelo body**. Será enviado pelo front através de um **header** na requisição, chamado `User`.
    - [x]  Deve receber por um **header** na requisição, chamado `User`, contendo o nome do participante que deseja atualizar a mensagem
    - [x]  Validar: (caso algum erro seja encontrado, retornar **status 422**)
        - [x]  **to** e **text** devem ser strings não vazias
        - [x]  **type** só pode ser 'message' ou 'private_message'
        - [x]  **from** deve ser um participante existente na lista de participantes
    - [x]  As validações deveram ser feitas com a biblioteca `joi`
    - [x]  Deve receber por **path params** o ID da mensagem a ser atualizada
    - [x]  Deve buscar na coleção `messages` se alguma mensagem existe com o id recebido, e, caso não existe, retornar **status 404**
    - [x]  Caso o usuario do header não seja o dono da mensagem, retornar **status 401**
    - [x]  Atualizar a mensagem da coleção `messages` com os dados do body


### Tecnologias Utilizadas
 
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

<!-- CONTACT -->

### Contato

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Mail][mail-shield]][mail-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/pedro-ivo-brum-cinelli//
[mail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[mail-url]: mailto:cinelli.dev@gmail.com
