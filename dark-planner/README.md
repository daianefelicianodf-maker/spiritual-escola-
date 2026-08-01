# Dark Planner

Sistema de gestão de canais do YouTube: painel com métricas, cadastro de
canais, buscador de nicho (canais/vídeos em alta via YouTube Data API v3),
planejador de conteúdo em kanban (com upload de roteiro/áudio) e análises
com gráficos. Interface em PT-BR/EN/ES via seletor interno — sem depender
do tradutor automático do navegador.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Radix UI (dialogs)
- Zustand (estado global, persistido em `localStorage`)
- Recharts (gráficos)
- React Router (`HashRouter`)

Canais, vídeos planejados e métricas do painel são mockados e persistidos
localmente no navegador — não há backend. O **Buscador de nicho** é a
exceção: ele consulta a YouTube Data API v3 de verdade, direto do navegador,
usando uma chave de API gratuita que a própria pessoa usuária cria e cola na
tela (fica salva só em `localStorage`, nunca passa por um servidor nosso).

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # servir o build localmente
```

## Estrutura

```
src/
  components/
    layout/     Sidebar, Topbar, seletor de idioma
    ui/         Primitivos (Button, Card, Dialog, Field, ...)
    channels/   Cartão de canal, dialog de importação
    niche/      Cartão de vídeo/canal em alta
    planner/    Kanban, cartão de vídeo, dialog de novo vídeo
    analytics/  Gráficos de visualizações/inscritos
  lib/
    store.ts    Estado global (Zustand)
    i18n.ts     Traduções PT-BR/EN/ES
    types.ts    Tipos compartilhados
    mock-data.ts Dados de exemplo
    youtube.ts  Cliente da YouTube Data API v3 (buscador de nicho)
  pages/        Uma página por rota
```

## Buscador de nicho

Como não existe integração real com o YouTube no restante do app, essa
página é a única que fala com uma API externa. Fluxo:

1. A pessoa cria uma chave gratuita em console.cloud.google.com (ativa a
   "YouTube Data API v3" e gera uma API key — não precisa cartão nem
   assinatura, só o limite diário gratuito do Google, ~100 buscas/dia).
2. Cola a chave na página; ela fica salva em `localStorage`.
3. Ao buscar um nicho, o app chama `search.list` (ordenado por
   visualizações, filtrado por período), depois `videos.list` e
   `channels.list` para pegar visualizações e inscritos reais.
4. Cada vídeo recebe um "viral score" = (visualizações por dia) / inscritos
   do canal, usado para ordenar e marcar como "🔥 Explodindo agora" ou
   "📈 Subindo rápido".
5. Da lista de resultados dá pra importar o canal direto para a aba Canais,
   já com o número real de inscritos.
