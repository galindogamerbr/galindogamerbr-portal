# Plano de mudanças — página Parceiros

## Objetivo

Transformar a página `/parceiros` em uma apresentação comercial objetiva: uma marca deve entender a oportunidade, conferir a comunidade e enviar uma proposta com facilidade.

O fluxo esperado é:

`/parceiros` → possibilidades de parceria → `/comunidade` → formulário → e-mail comercial.

## Escopo fechado

### Sobre

Não adicionar seções nem alterar a estrutura da página.

- Em `src/components/shared/PartnershipTeaser.tsx`, trocar o botão **“Quero conhecer o projeto →”** por **“Quero conhecer a comunidade →”**.
- O botão deixará de abrir o formulário e passará a navegar para `/comunidade`.
- Em `src/routes/Sobre.tsx`, trocar **“um projeto feito por uma pessoa comum”** por **“um projeto independente”**.
- Como o formulário não será mais aberto nessa página, remover o estado e a renderização de `PartnershipModal` de `Sobre.tsx`.

### Comunidade

Não alterar conteúdo, números, layout ou cards.

`/comunidade` continua sendo a prova social do portal. A página Parceiros apenas direciona a empresa para ela; os números não serão repetidos.

## Página Parceiros

Arquivo principal: `src/routes/Parceiros.tsx`.

### Cabeçalho

Manter o eyebrow **“Parceiros”** e trocar o título:

> SUA MARCA NA RESENHA

por:

> SUA MARCA NO UNIVERSO GALINDOGAMERBR

Adicionar abaixo:

> Parcerias que fazem sentido para a marca, para o conteúdo e para a comunidade.

### Bloco de oportunidade

Substituir os parágrafos atuais por:

> O GalindoGamerBR conecta games, simuladores, entretenimento e comunidade em conteúdos ao vivo e vídeos publicados em diferentes plataformas.

> Buscamos marcas, lojas, desenvolvedores e projetos que tenham conexão real com esse universo e que queiram construir uma parceria que vá além de simplesmente colocar uma logo em uma página.

> Podemos trabalhar com produtos, tecnologia, games, periféricos, simuladores, campanhas, cupons, afiliados e ações especiais junto à comunidade.

### Como podemos trabalhar juntos

Adicionar a seção **“COMO PODEMOS TRABALHAR JUNTOS”** entre o bloco de oportunidade e o CTA final, com cinco cards no mesmo sistema visual existente:

1. **Produto em destaque** — Seu produto pode fazer parte do conteúdo de forma natural, sendo apresentado e utilizado durante gameplay ou live.
2. **Conteúdo & lives** — Sua marca pode aparecer em vídeos, transmissões ao vivo e conteúdos relacionados aos jogos e simuladores.
3. **Cupons & afiliados** — Criamos links ou cupons exclusivos para facilitar a divulgação e permitir o acompanhamento dos resultados.
4. **Simuladores & tecnologia** — Oportunidade para produtos ligados a Farming Simulator, ETS2, SnowRunner, periféricos, hardware e setups.
5. **Campanhas & ações** — Campanhas, lançamentos, sorteios e outras ações planejadas conforme a marca e a comunidade.

Em telas pequenas, os cards ficam em uma coluna. Em telas maiores, usar uma grade responsiva, sem alterar cores, fundo ou identidade visual.

### Prova social por navegação

Adicionar depois dos cards:

**Eyebrow:** UMA COMUNIDADE QUE ESTÁ PRESENTE

**Texto:** O GalindoGamerBR está presente em diferentes plataformas e mantém uma comunidade construída em torno de games, simuladores, lives e interação diária.

**Botão:** CONHEÇA A COMUNIDADE →

O botão navega para `/comunidade`. Não incluir números nessa seção.

### CTA final

Manter o card final com logo e o estilo atual, mas trocar o texto por:

**Título:** VAMOS CONVERSAR SOBRE PARCERIA?

**Texto:** Conte um pouco sobre sua marca, produto ou projeto. Nossa equipe analisa a proposta e entra em contato pelo e-mail informado.

**Botão:** QUERO SER PARCEIRO

Esse é o único botão da página que abre o formulário.

## Formulário comercial

Arquivos envolvidos:

- `src/components/shared/PartnershipModal.tsx`
- `src/lib/api/partnership.ts`
- `functions/api/partnership.ts`
- `functions/lib/emailTemplates.ts`
- `functions/lib/resend.ts`

### Campos

Substituir os campos atuais por:

| Campo | Obrigatório | Placeholder ou opções |
| --- | --- | --- |
| Empresa / marca | Sim | Nome da empresa ou marca |
| Seu nome | Sim | Nome do responsável pela proposta |
| E-mail | Sim | contato@empresa.com.br |
| WhatsApp | Recomendado como opcional | (00) 00000-0000 |
| Tipo de parceria | Sim | Produto para divulgação; Afiliado / cupom; Divulgação de marca; Patrocínio; Campanha; Outra proposta |
| Mensagem | Sim | Conte um pouco sobre sua marca, produto ou proposta de parceria. |

Trocar o texto do botão de **“Enviar”** para **“Enviar proposta”**.

O título do modal permanece **“QUERO SER PARCEIRO”**. A mensagem de sucesso deve confirmar que a equipe responderá no e-mail informado.

### API e e-mail

Ampliar `PartnershipSubmission` para transportar:

- `company`
- `name`
- `email`
- `phone`
- `partnershipType`
- `message`

Na API, validar e limitar tamanho dos dois novos campos com a mesma estratégia de limpeza já usada (`trim` e corte de tamanho). Atualizar o e-mail recebido em `parcerias@galindogamerbr.com.br` para mostrar empresa/marca e tipo de parceria junto aos dados atuais.

Preservar sem alteração:

- limite de cinco envios por IP a cada hora;
- escape de HTML no e-mail;
- origem de e-mail de produção e preview;
- retorno de sucesso e tratamento de erro do formulário.

## Fora de escopo

- Nova página para parceiros.
- Números de seguidores em Parceiros ou Sobre.
- Preços, tabela de patrocínio ou mídia kit no site.
- Logos de empresas sem parceria ativa.
- Mais categorias de parceria além das seis opções do formulário.
- Mudança de fundo, cores, logo ou identidade visual.

## Testes e aceite

Antes do PR:

1. Adicionar ou ajustar testes da API de parceria para payload completo, campos obrigatórios, sanitização e envio de e-mail.
2. Conferir manualmente o fluxo em desktop e celular: CTA de Sobre, CTA para Comunidade, abertura do modal, formulário, sucesso e erro.
3. Executar typecheck, lint, testes e build.

O trabalho estará pronto quando uma empresa puder entender as possibilidades de parceria, consultar a comunidade e enviar uma proposta com seus dados comerciais sem precisar de outra página ou contato paralelo.
