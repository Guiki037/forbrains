# Como os leads do diagnóstico chegam à Forbrains

O diagnóstico de liderança fica na seção **Contato**. A pessoa responde 6 perguntas, informa se é pessoa física ou empresa, o nome e um contato (WhatsApp, e-mail ou os dois) e só então vê o painel com o resultado. Nesse momento o site envia o lead para **todos** os destinos ligados em `public/config.json`:

```json
{
  "backend": false,
  "leadEmail": "contato@forbrains.com.br",
  "leadWebhook": ""
}
```

O painel abre na hora para a pessoa, mesmo que o envio demore ou falhe. O aviso embaixo do painel diz se o diagnóstico foi recebido.

## 1. E-mail (ligado) — FormSubmit

Cada diagnóstico chega por e-mail no endereço de `leadEmail`, pelo [FormSubmit](https://formsubmit.co) (serviço gratuito, sem servidor).

**Ativação, uma vez só (faça antes de divulgar o site):**

1. Publique o site e faça um diagnóstico de teste na página publicada.
2. O FormSubmit manda para `contato@forbrains.com.br` um e-mail de confirmação com o botão **Activate Form**. Clique nele.
3. A partir daí, cada diagnóstico concluído vira um e-mail.

**Esconder o endereço (recomendado):** o e-mail de confirmação traz um código aleatório. Troque `contato@forbrains.com.br` por esse código em `leadEmail`. O site continua entregando no mesmo e-mail, mas o endereço deixa de aparecer nos arquivos públicos (e de atrair spam).

**O que chega em cada e-mail** (uma tabela):

| Campo | Exemplo |
|---|---|
| Prioridade | Alta, Média ou Baixa (veja abaixo) |
| Nome ou Empresa + Responsável | quem respondeu |
| Tipo | Pessoa física ou Empresa |
| WhatsApp, E-mail | ao menos um vem preenchido |
| Principal desafio | Retenção de talentos (100%) |
| Índice de maturidade | 50/100 · Em desenvolvimento |
| Uma linha por área | Comunicação: 25% · Raramente |
| Soluções sugeridas | as 3 soluções que o painel mostrou |
| Enviado em, Página | data e endereço da página |

Responder o e-mail vai direto para a pessoa, quando ela informou o e-mail.

**Prioridade sugerida:** Alta quando o índice de maturidade é 50 ou menos, Média de 51 a 74, Baixa de 75 para cima. A regra fica em `prioridade()` em `src/data/diagnostico.js`.

**Trocar o e-mail:** altere `leadEmail` (o FormSubmit pede uma nova ativação para o novo endereço). **Desligar:** deixe `"leadEmail": ""`.

**Privacidade:** os dados passam pelo FormSubmit, que guarda os envios por 30 dias. O formulário avisa a pessoa de que os dados e as respostas vão para a Forbrains. Se a política de privacidade da empresa exigir outro caminho, use o webhook ou o banco abaixo e deixe `leadEmail` vazio.

**Proteção contra robôs:** o formulário tem um campo escondido que pessoas não veem; quando ele chega preenchido, nada é enviado.

## 2. Planilha ou CRM (opcional) — `leadWebhook`

URL de um webhook (Google Planilhas, Make, Zapier, n8n, RD Station…). Recebe o lead em JSON. Funciona junto com o e-mail.

**Google Planilhas em 5 minutos:**

1. Crie uma planilha e abra **Extensões → Apps Script**.
2. Apague o conteúdo e cole:

```js
function doPost(e) {
  const lead = JSON.parse(e.postData.contents)
  const planilha = SpreadsheetApp.getActiveSpreadsheet()
  const aba = planilha.getSheetByName('Leads') || planilha.insertSheet('Leads')
  if (aba.getLastRow() === 0) {
    aba.appendRow(['Data', 'Prioridade', 'Tipo', 'Nome / empresa', 'Responsável', 'WhatsApp', 'E-mail',
      'Principal desafio', 'Intensidade', 'Índice', 'Faixa', 'Soluções sugeridas', 'Página'])
  }
  aba.appendRow([
    new Date(),
    lead.prioridade,
    lead.tipo === 'pj' ? 'Empresa' : 'Pessoa física',
    lead.nome,
    lead.responsavel || '',
    lead.whatsapp ? "'" + lead.whatsapp : '',
    lead.email || '',
    lead.principal ? lead.principal.area : 'Nenhum desafio crítico',
    lead.principal ? lead.principal.intensidade + '%' : '',
    lead.indice,
    lead.faixa,
    (lead.sugestoes || []).join(' · '),
    lead.pagina || ''
  ])
  return ContentService.createTextOutput('ok')
}
```

3. Clique em **Implantar → Nova implantação → App da Web**, com "Executar como: eu" e "Quem pode acessar: qualquer pessoa".
4. Copie a URL gerada e cole em `"leadWebhook"` no `public/config.json`.

A URL fica visível no código do site; se começar a chegar lixo, faça uma nova implantação e troque a URL.

## 3. Banco de dados (opcional) — `backend: true`

O `server.js` grava o lead na tabela `leads` (cria a tabela sozinho). Precisa publicar o site com o servidor e a variável `DATABASE_URL`.

## Se nenhum destino aceitar o envio

O painel abre do mesmo jeito e o aviso pede para a pessoa usar o botão **Falar com um especialista**, que abre um e-mail para `contato@forbrains.com.br` já preenchido com o diagnóstico.

## Campos do lead (webhook e banco)

| Campo | Conteúdo |
|---|---|
| `tipo` | `pf` (pessoa física) ou `pj` (empresa) |
| `nome` | nome da pessoa ou da empresa |
| `responsavel` | nome de quem respondeu, quando é empresa (opcional) |
| `whatsapp`, `email` | ao menos um dos dois vem preenchido |
| `respostas` | resposta de cada pergunta, de 0 (nunca) a 4 (sempre) |
| `intensidades` | intensidade de cada desafio, de 0 a 100% |
| `areas` | as 6 áreas em ordem de intensidade: `{ id, area, intensidade, resposta }` |
| `principal` | `{ id, area, intensidade }` do maior desafio (ou `null`) |
| `indice`, `faixa` | índice de maturidade (0–100) e a faixa: Crítica, Em atenção, Em desenvolvimento ou Avançada |
| `prioridade` | Alta, Média ou Baixa |
| `sugestoes` | nomes das soluções recomendadas no painel |
| `criadoEm`, `pagina` | data e endereço da página |

As perguntas, as faixas, a prioridade e as soluções recomendadas para cada desafio ficam em `src/data/diagnostico.js`.
