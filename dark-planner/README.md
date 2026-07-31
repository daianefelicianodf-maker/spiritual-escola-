# Dark Planner

Sistema de gestão de canais do YouTube: painel com métricas, cadastro de
canais, planejador de conteúdo em kanban (com upload de roteiro/áudio) e
análises com gráficos. Interface em PT-BR/EN/ES via seletor interno —
sem depender do tradutor automático do navegador.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Radix UI (dialogs)
- Zustand (estado global, persistido em `localStorage`)
- Recharts (gráficos)
- React Router (`HashRouter`)

Os dados (canais, vídeos planejados, métricas) são mockados e persistidos
localmente no navegador — não há backend nem integração real com a API do
YouTube.

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
    planner/    Kanban, cartão de vídeo, dialog de novo vídeo
    analytics/  Gráficos de visualizações/inscritos
  lib/
    store.ts    Estado global (Zustand)
    i18n.ts     Traduções PT-BR/EN/ES
    types.ts    Tipos compartilhados
    mock-data.ts Dados de exemplo
  pages/        Uma página por rota
```
