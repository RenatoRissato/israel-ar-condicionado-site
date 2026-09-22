# ❄️ Israel Ar-condicionado — Site Institucional

Site institucional desenvolvido para o **Israel Ar-condicionado**, empresa de instalação, manutenção e higienização de sistemas de ar-condicionado em **Limeira-SP e região**.

O projeto foi desenvolvido com foco em apresentar os serviços da empresa de forma profissional, facilitar o contato com potenciais clientes e direcionar solicitações de orçamento diretamente para o WhatsApp.

🌐 **Site online:**
https://israel-ar-condicionado-site.vercel.app/

---

## 📸 Sobre o projeto

A proposta foi criar uma presença digital moderna para o Israel Ar-condicionado, permitindo que clientes encontrem rapidamente informações sobre os serviços prestados e solicitem atendimento.

O site apresenta:

* instalação de ar-condicionado;
* manutenção preventiva e corretiva;
* higienização de equipamentos;
* atendimento residencial e comercial;
* principais problemas relacionados ao ar-condicionado;
* diferenciais da empresa;
* avaliações de clientes;
* perguntas frequentes;
* formulário de orçamento;
* integração direta com WhatsApp;
* localização e área de atendimento.

O projeto foi desenvolvido utilizando **HTML, CSS e JavaScript puros**, sem frameworks.

---

## 🚀 Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

O projeto utiliza:

* **HTML5** para a estrutura semântica da página;
* **CSS3** para estilização, responsividade e animações;
* **JavaScript** para interações, carrosséis, FAQ, formulário e integração com WhatsApp;
* **Vercel** para hospedagem e publicação do site;
* **Git e GitHub** para versionamento e armazenamento do projeto.

Não foram utilizados frameworks como React, Vue ou Angular.

---

## ✨ Principais recursos

### 📱 Design responsivo

O site foi desenvolvido para funcionar corretamente em diferentes tamanhos de tela, incluindo:

* smartphones;
* tablets;
* notebooks;
* desktops.

A disposição dos elementos se adapta automaticamente para manter a navegação simples e confortável.

---

### 💬 Integração com WhatsApp

O principal canal de conversão do site é o WhatsApp.

Os botões de orçamento direcionam o visitante diretamente para uma conversa com a empresa utilizando mensagens pré-configuradas.

O formulário de orçamento também gera automaticamente uma mensagem com os dados preenchidos pelo usuário.

Nenhuma informação do formulário é armazenada em servidor.

---

### 🧾 Formulário de orçamento

O visitante pode preencher informações relacionadas ao atendimento desejado.

Após o preenchimento, o JavaScript monta automaticamente uma mensagem e abre o WhatsApp da empresa.

Isso permite oferecer uma experiência de orçamento sem necessidade de backend.

---

### ⭐ Avaliações de clientes

O site possui uma seção dedicada a avaliações reais de clientes, apresentadas em formato de carrossel.

O componente possui:

* navegação automática;
* controles manuais;
* pausa durante interação;
* suporte a teclado;
* adaptação para dispositivos móveis.

---

### 🎞️ Diferenciais em formato de stories

Os diferenciais da empresa são apresentados em cards verticais inspirados no formato de stories.

No desktop, vários cards ficam visíveis ao mesmo tempo.

No celular, o usuário pode navegar deslizando horizontalmente.

O carrossel também possui rotação automática e controles de navegação.

---

### ❓ FAQ interativo

A seção de perguntas frequentes utiliza um sistema de acordeão desenvolvido em JavaScript.

O objetivo é permitir que o visitante encontre rapidamente respostas para dúvidas comuns sem deixar a página visualmente carregada.

---

### 🗺️ Localização e atendimento

O site apresenta informações sobre a área atendida pelo Israel Ar-condicionado e facilita o contato com clientes de **Limeira-SP e região**.

---

## 🎨 Identidade visual

O design utiliza predominantemente tons de azul relacionados ao segmento de climatização.

O verde é utilizado principalmente nos botões de contato via WhatsApp.

A hierarquia visual foi pensada para separar:

* identidade da marca;
* conteúdo;
* chamadas para ação.

Elementos como cards, sombras, espaçamentos e animações foram utilizados para criar uma interface moderna sem prejudicar a leitura.

---

## ⚡ Performance

Algumas estratégias utilizadas para melhorar o carregamento do site:

* imagens em **WebP**;
* uso de `srcset` para diferentes resoluções;
* preload da imagem principal;
* ausência de frameworks pesados;
* assets otimizados;
* JavaScript separado por funcionalidades;
* hospedagem estática através da Vercel.

---

## ♿ Acessibilidade

O projeto possui cuidados de acessibilidade como:

* navegação por teclado;
* foco visível;
* `aria-expanded`;
* `aria-controls`;
* `aria-live`;
* link para pular diretamente ao conteúdo;
* respeito à configuração `prefers-reduced-motion`;
* áreas de toque adequadas em dispositivos móveis.

As animações automáticas também possuem mecanismos de pausa.

---

## 🔎 SEO

O projeto possui recursos voltados para mecanismos de busca e compartilhamento em redes sociais.

Entre eles:

* `canonical`;
* Open Graph;
* Twitter Cards;
* `robots.txt`;
* `sitemap.xml`;
* dados estruturados com JSON-LD;
* schema `HVACBusiness`;
* schema `FAQPage`.

Esses recursos ajudam mecanismos de busca a compreender melhor o conteúdo e o tipo de negócio representado pelo site.

---

## 📁 Estrutura do projeto

```text
Israel-Ar-Condicionado/
│
├── index.html
├── style.css
├── script.js
├── package.json
├── favicon.svg
├── favicon.png
├── robots.txt
├── sitemap.xml
│
└── assets/
    ├── imagens
    └── og-image.jpg
```

### Principais arquivos

| Arquivo       | Função                                                |
| ------------- | ----------------------------------------------------- |
| `index.html`  | Estrutura e conteúdo principal do site                |
| `style.css`   | Layout, responsividade, animações e identidade visual |
| `script.js`   | Interações, FAQ, carrosséis, formulário e WhatsApp    |
| `robots.txt`  | Configuração para mecanismos de busca                 |
| `sitemap.xml` | Sitemap do site                                       |
| `assets/`     | Imagens e arquivos utilizados pela página             |

---

## 💻 Executando localmente

Clone o repositório:

```bash
git clone URL-DO-SEU-REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd israel-ar-condicionado-site
```

Instale as dependências de desenvolvimento:

```bash
npm install
```

Execute o servidor local:

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

Também é possível utilizar:

```bash
npx serve .
```

---

## ☁️ Deploy

O projeto está publicado na **Vercel**.

🔗 **Produção:**
https://israel-ar-condicionado-site.vercel.app/

O projeto está hospedado como site estático utilizando HTML, CSS e JavaScript.

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido para atender uma necessidade real de um prestador de serviços e também faz parte do meu portfólio de desenvolvimento web.

Durante o desenvolvimento foram aplicados conhecimentos em:

```text
HTML semântico
CSS responsivo
JavaScript
UX/UI
Responsividade
SEO
Acessibilidade
Performance Web
Integração com WhatsApp
Git/GitHub
Deploy com Vercel
```

---

## 👨‍💻 Desenvolvedor

**Renato Rissato da Silva**

Tecnólogo em **Análise e Desenvolvimento de Sistemas**.

🔗 GitHub:
https://github.com/RenatoRissato

---

⭐ Se gostou do projeto, considere deixar uma estrela no repositório.
