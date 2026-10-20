# Créditos e licenças

## Imagens e motions

O site não usa fotos. Todas as ilustrações são vetoriais, desenhadas em código a partir do anel de pontos do logotipo Forbrains (`public/assets/images/logo-forbrains.png`):

- o anel do hero com a rede de pessoas, os emblemas dos 9 cartões de soluções e das 4 etapas da metodologia, e o anel do manifesto e do diagnóstico ficam em `src/parts/art/` e `src/lib/dots.js`;
- os motions (pontos que se montam ao entrar na tela e anéis que giram com a rolagem) ficam em `src/styles/art.css`; com "reduzir movimento" ligado, tudo aparece pronto e parado;
- `public/assets/images/og-cover.jpg` (imagem de compartilhamento) foi gerada a partir da mesma arte do hero.

São criações originais para a Forbrains, sem licença de terceiros.

## Tipografia

- **Sora** — Google Fonts, licença SIL Open Font License 1.1 (uso livre, inclusive comercial).
- **Inter** — autohospedada (`src/assets/fonts/`), licença SIL Open Font License 1.1.

## Código

- Template base: architect-portfolio (estrutura React + Vite fornecida pela plataforma).
- **GSAP 3 + ScrollTrigger** — licença padrão "no charge" da GSAP (Webflow), uso permitido em sites comerciais; verifique os termos em gsap.com para o caso de uso final.
- **Efeitos de rolagem** (cartões que empilham, galeria horizontal, texto que se preenche e máscara que revela) — adaptados da vitrine de 36 animações em JavaScript do canal Não Codei, reescritos para a janela inteira em `src/hooks/use*.js` e `src/styles/effects.css`.
