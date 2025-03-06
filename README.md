# SmartSpend フロントエンド

SmartSpendプロジェクトのフロントエンドリポジトリです。React、TypeScript、Viteを使用して開発されています。

## 開発環境のセットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

## コーディング規約

このプロジェクトでは、一貫性のあるコードベースを維持するために、特定のコーディング規約に従っています。詳細は以下のドキュメントを参照してください：

- [コーディング規約](./docs/coding-standards.md) - 全般的なコーディング規約
- [エイリアスパスの使用方法](./docs/エイリアスパスの使用方法.md) - インポートパスの使い方

## 技術スタック

- **フレームワーク**: React 19
- **言語**: TypeScript
- **ビルドツール**: Vite
- **状態管理**: Redux Toolkit
- **UIライブラリ**: Tailwind CSS
- **ルーティング**: React Router
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod
- **HTTP通信**: Axios

## プロジェクト構造

```
src/
├── assets/        # 静的アセット（画像、フォントなど）
├── components/    # 再利用可能なUIコンポーネント
├── features/      # 機能別モジュール
├── hooks/         # カスタムReact Hooks
├── layouts/       # レイアウトコンポーネント
├── lib/           # ライブラリコード（Axiosインスタンスなど）
├── services/      # APIサービス
├── store/         # Reduxストア
├── types/         # TypeScript型定義
└── utils/         # ユーティリティ関数
```

## 主要な開発コマンド

```bash
# 開発サーバーの起動
bun run dev

# プロダクションビルド
bun run build

# ビルド後のプレビュー
bun run preview

# リントチェック
bun run lint

# 型チェック
bun run type-check
```

---

オリジナルのViteテンプレートREADMEは以下の通りです：

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
