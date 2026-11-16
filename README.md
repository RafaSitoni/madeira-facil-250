# Madeira Fácil 250+ — Landing page (React + TypeScript + Vite)

## Rodar e publicar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/ para publicar (Vercel, Netlify ou Lovable)
```
Na Vercel: `npx vercel@latest deploy --prod --yes` dentro da pasta do projeto.

## Antes de subir tráfego
1. Em `src/App.tsx`, bloco `CONFIG`: cole as URLs de checkout da Hotmart (`checkoutEssencial`, `checkoutCompleto`), e-mail de contato e links de Termos e Privacidade (os links só aparecem no rodapé quando preenchidos).
2. Os botões de compra repassam as UTMs da página para o checkout e acrescentam `src=` com a origem (plano_essencial, plano_completo, popup_saida).
3. Todos os botões de compra têm a classe CSS `checkout-btn`: use essa classe na regra de InitiateCheckout da UTMify.
4. Cole o script de UTMs e o pixel da UTMify, e a tag do Clarity, no `<head>` de `index.html` (há um comentário marcando o lugar).
5. Troque as imagens de `src/assets/` pelas fichas finais conferidas (mesmos nomes, formato .webp).
6. Depoimentos: adicione em `CONFIG.depoimentos` apenas avaliações reais e autorizadas. Com a lista vazia, a seção fica escondida.
7. A seção de categorias mostra a distribuição planejada (50/50/40/35/30/25/20). Ajuste os números para o que realmente estiver na biblioteca no dia do lançamento.

## Estrutura da página
Barra de oferta → topo → hero → faixa de benefícios → dor e virada → Método M.C.M. → fichas por dentro (carrossel + anatomia da ficha) → 7 categorias → para quem é + níveis → 5 bônus com capa → (depoimentos) → planos Essencial R$ 29,90 e Completo R$ 39,90 → garantia de 7 dias → FAQ → CTA final → rodapé. Barra de compra fixa ao rolar e pop-up de saída (desktop) oferecendo o Essencial.

Fontes (Oswald e Inter) e imagens ficam dentro do projeto, sem depender do Google Fonts.
