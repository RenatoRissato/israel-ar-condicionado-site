# Israel Ar-condicionado — site institucional

Site estático de página única para instalação, manutenção e higienização de
ar-condicionado em Limeira e região.

**Sem build, sem dependências.** São três arquivos servidos como estão:
`index.html`, `style.css` e `script.js`. Não existe `package.json` e **não há
`npm run dev`** — qualquer servidor de arquivos estáticos roda o site.

## Rodando localmente

Abrir o `index.html` direto no navegador funciona, mas prefira um servidor local
para que caminhos e `fetch` se comportem como em produção:

```bash
npx serve .          # ou
python -m http.server 8000
```

## Estrutura

```
index.html      Página inteira: conteúdo, sprite SVG de ícones e os dois blocos JSON-LD
style.css       Estilos. Toda a paleta vive no :root do topo do arquivo
script.js       Comportamento, dividido em funções init* independentes
favicon.svg     Ícone principal (favicon.png é o fallback e o apple-touch-icon)
robots.txt      Libera indexação e aponta o sitemap
sitemap.xml     Uma URL — atualize <lastmod> em mudanças relevantes
assets/         Imagens em WebP + og-image.jpg (preview de compartilhamento)
```

## Trocando o número de WhatsApp

O número aparece em dois lugares, por design:

1. **`script.js`** — a constante `WHATSAPP_NUMBER` no topo. É a fonte de verdade:
   com o JS ativo, todos os links `.whatsapp-link` são reescritos a partir dela,
   já com a mensagem padrão pré-preenchida.
2. **`index.html`** — os `href` dos 13 links `.whatsapp-link` existem apenas como
   fallback para quando o JS não carrega. Troque com um find/replace de
   `wa.me/5519999453094`, e não esqueça do `href="tel:+5519999453094"` na seção
   de contato nem do link dentro do `<noscript>`.

Também vale conferir o `telephone` no JSON-LD do `<head>`.

## Trocando o domínio

O domínio está gravado em seis pontos. Um find/replace de
`https://www.israelarcondicionado.com.br` cobre todos:

- `index.html` — `canonical`, `og:url`, `og:image`, `twitter:image` e os campos
  `@id` / `url` / `image` / `logo` dos dois blocos JSON-LD
- `robots.txt` — a linha `Sitemap:`
- `sitemap.xml` — a tag `<loc>`

## Dados estruturados

Há dois blocos JSON-LD no `<head>`: `HVACBusiness` (endereço, telefone,
coordenadas, horários) e `FAQPage` (as 8 perguntas).

**O texto do `FAQPage` precisa bater com o que está visível na página.** Ao editar
uma pergunta ou resposta na seção FAQ, edite o JSON-LD junto — o Google penaliza
schema divergente do conteúdo.

Não há `priceRange` por decisão do cliente: os serviços são sob orçamento.

Depois de publicar, valide em:
- [Rich Results Test](https://search.google.com/test/rich-results) — confere o FAQ
- [Sharing Debugger](https://developers.facebook.com/tools/debug/) — força o cache da og:image

## Regerando a og:image

`assets/og-image.jpg` (1200×630) é gerada a partir dos assets do site com o
`sharp`. O script de geração não faz parte do repositório porque roda uma vez;
se precisar refazer, componha: `manutencao-ar-condicionado.webp` como fundo
(resize cover), overlay em gradiente `#052b50 → #0e7db6`, a logo recortada em
círculo e o texto. Mantenha 1200×630 e exporte em JPEG — WebP tem suporte
irregular em previews de link.

## Acessibilidade

O site já cobre: skip-link, `aria-expanded`/`aria-controls` no menu e no FAQ,
`aria-live` nas mensagens de erro do formulário, foco visível e
`prefers-reduced-motion` respeitado no CSS e no JS. Preserve esses atributos ao
editar o HTML.

## Convenções do código

**`script.js`** é uma sequência de funções `init*` chamadas no fim do arquivo.
Cada uma busca os próprios elementos e desiste em silêncio se não os encontrar,
para que remover uma seção do HTML não derrube o resto da página. Mantenha esse
padrão ao adicionar comportamento.

**`style.css`** concentra toda a paleta no `:root`. Não introduza cores
hexadecimais no corpo do arquivo — crie ou reaproveite uma variável.

Duas escalas cobrem tudo que fica sobre fundo escuro, nomeadas por luminosidade
decrescente (100 é o mais claro):

| Escala | Níveis | Uso |
|---|---|---|
| `--on-dark-100…600` | 6 | Texto sobre hero, "why", contato e rodapé |
| `--accent-100…400` | 4 | Ciano de destaque: eyebrows, ícones, links sobre azul |

O design original tinha 19 tons aqui, muitos separados por diferenças
imperceptíveis. Foram consolidados por distância perceptual (ΔE em CIELAB,
limite 5 para texto e 4 para acento), escolhendo em cada grupo o tom de **maior
contraste**, de modo que nenhum uso perdesse legibilidade — os 19 usos ficam
entre 5,4:1 e 12,3:1 sobre seus fundos reais, todos acima de WCAG AA.

Ao escolher um nível, prefira o mais claro que couber na hierarquia: `100` para
texto de destaque, `300` para corpo, `500`/`600` apenas para rótulos e notas
de rodapé.

## Formulário de orçamento

Não há backend: o formulário valida no cliente e abre o WhatsApp com a mensagem
montada. Nenhum dado é armazenado ou enviado a servidor.

O `novalidate` é aplicado pelo JS (`form.noValidate = true`), nunca no HTML —
assim, sem JavaScript, o navegador ainda exige os campos obrigatórios, e o
`<noscript>` oferece o WhatsApp e o telefone como saída.

## Deploy

Suba os arquivos como estão em qualquer hospedagem estática (Vercel, Netlify,
Cloudflare Pages, GitHub Pages ou hospedagem tradicional). Nenhuma etapa de build.

Configure o servidor para servir `index.html` na raiz e redirecionar a variante
sem `www` para `https://www.israelarcondicionado.com.br/`, que é a URL declarada
no `canonical`.
