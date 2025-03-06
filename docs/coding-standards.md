# SmartSpendプロジェクト フロントエンドコーディング規約

このドキュメントはSmartSpendプロジェクトのフロントエンド開発におけるコーディング規約を定めています。
チーム全体でこの規約に従うことで、コードの一貫性と保守性を確保します。

## 目次

1. [全般的なルール](#全般的なルール)
2. [TypeScriptの使用](#typescriptの使用)
3. [コンポーネント](#コンポーネント)
4. [状態管理](#状態管理)
5. [スタイリング](#スタイリング)
6. [インポート規約](#インポート規約)
7. [テスト](#テスト)

## 全般的なルール

- インデントはスペース2つを使用する
- セミコロンは必ず使用する
- 関数定義後の波括弧の前には必ずスペースを入れる
- コードはESLintの設定に準拠すること
- コメントは日本語で記述すること
- 命名は英語で、意味が明確に伝わるようにすること

## TypeScriptの使用

- 型定義は明示的に行う（`any`は極力避ける）
- インターフェースの命名は`IPascalCase`ではなく`PascalCase`を使用する
- 可能な限り`unknown`、`never`などの型安全な型を使用する
- 繰り返し使用する型は`types/`ディレクトリに定義する
- 型エラーを無視するのではなく、適切に修正する
- `as`によるタイプキャストは最小限に抑える

## コンポーネント

- コンポーネント名はPascalCaseで記述する
- コンポーネントファイル名は.tsxとする
- 関数コンポーネントのみを使用する
- 小さなコンポーネントに分割し、一つのファイルは200行以内を目指す
- propの型定義は明示的に行う
- 大きなコンポーネントは複数の小さなコンポーネントに分割する
- レンダリングパフォーマンスを考慮し、必要に応じてメモ化する

## 状態管理

- グローバル状態にはReduxを使用する
- ローカル状態にはReact Hooksを使用する
- ReduxのスライスはRedux Toolkitの規約に従って実装する
- 非同期処理にはthunkを使用する
- コンポーネント内のローカル状態はuseStateで管理する
- フォーム状態はreact-hook-formで管理する

## スタイリング

- スタイリングはTailwind CSSを使用する
- 共通のスタイルはユーティリティクラスとして抽出する
- コンポーネント特有のスタイルはコンポーネントレベルで定義する
- レスポンシブデザインはTailwindのブレークポイントを使用する
- ダークモード対応を考慮したスタイリングを行う

## インポート規約

### エイリアスパスの使用

```typescript
// 🔴 避けるべき方法（相対パス）
import { getUser } from '../../../store/auth/authSlice';
import { Button } from '../../../../components/ui/Button';

// 🟢 推奨される方法（エイリアスパス）
import { getUser } from '@/store/auth/authSlice';
import { Button } from '@/components/ui/Button';
// または
import { getUser } from 'store/auth/authSlice';
import { Button } from 'components/ui/Button';
```

### インポート順序のガイドライン

以下の順序でインポート文を整理してください：

1. 外部ライブラリ
2. エイリアスを使用したプロジェクト内のインポート
3. 相対パスを使用した同一ディレクトリ内のインポート
4. タイプ/インターフェイスのインポート

各グループの間には空行を入れてください。

```typescript
// 1. 外部ライブラリ
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

// 2. エイリアスを使用したプロジェクトのインポート
import { getUser } from '@/store/auth/authSlice';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';

// 3. 相対パスによる同一ディレクトリからのインポート
import { ExpenseItem } from './ExpenseItem';
import { useSortableData } from './hooks/useSortableData';

// 4. 型/インターフェースのインポート
import type { Expense } from '@/types/expense';
import type { AppDispatch } from '@/store';
```

### ディレクトリ別のエイリアスパス

プロジェクトでは以下の主要なディレクトリに対するエイリアスが設定されています：

* `components/*` - UIコンポーネント
* `services/*` - APIサービス
* `types/*` - 型定義
* `features/*` - 機能モジュール
* `hooks/*` - カスタムフック
* `lib/*` - ライブラリコード
* `assets/*` - 静的アセット
* `store/*` - Reduxストア
* `utils/*` - ユーティリティ関数
* `layouts/*` - レイアウトコンポーネント
* `@/*` - src直下の任意のパス

ディレクトリ固有のエイリアスを使うか、汎用的な`@/`エイリアスを使うかについては、チーム内で統一することをお勧めします。

### インポートの例

#### サービスの呼び出し

```typescript
// 🔴 避ける
import { login } from '../../services/auth';

// 🟢 推奨
import { login } from '@/services/auth';
// または
import { login } from 'services/auth';
```

#### コンポーネントの使用

```typescript
// 🔴 避ける
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

// 🟢 推奨
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// または
import { Button } from 'components/ui/Button';
import { Input } from 'components/ui/Input';
```

#### 型のインポート

```typescript
// 🔴 避ける
import type { User } from '../../types/user';

// 🟢 推奨
import type { User } from '@/types/user';
// または
import type { User } from 'types/user';
```

### 命名規則とインポートの短縮化

```typescript
// 🔴 避ける（名前が長すぎる）
import { createVeryLongNamedComponentWithProps } from '@/components/ui/VeryLongNamedComponent';

// 🟢 推奨（適切な名前でインポート）
import { VeryLongComponent } from '@/components/ui/VeryLongNamedComponent';
```

### インポートの禁止事項

以下は避けるべきパターンです：

* `*` を使用した全インポート
* デフォルトエクスポートとメンバーエクスポートの混在
* 未使用のインポート
* 循環依存を作る可能性のあるインポート

```typescript
// 🔴 避ける
import * as Components from '@/components/ui';

// 🟢 推奨
import { Button, Input, Card } from '@/components/ui';
```

### ベストプラクティス

* エイリアスパスを一貫して使用する
* 絶対に深い相対パス（「../../../」など）を使用しない
* ESLintの`import/order`ルールを活用する
* インポートは必要に応じて複数行に分割する

## テスト

- コンポーネントにはJestとReact Testing Libraryを使用してテストを書く
- ユニットテストはカバレッジを90%以上を目指す
- 重要なユーザーフローにはE2Eテストを実装する
- モックとスタブは最小限に抑え、実際の挙動に近いテストを書く
- テストファイルは対象のコンポーネントと同じディレクトリに配置し、`.test.tsx`または`.spec.tsx`の拡張子を使用する

## ドキュメント

- 複雑なロジックやワークフローには必ずコメントを付ける
- 関数とクラスにはJSDocスタイルのコメントを書く
- ユーザーストーリーとタスクは常に最新の状態を保つ
- 重要な機能変更はREADMEファイルに記録する

---

上記の規約に従うことで、SmartSpendプロジェクトのコードベースは一貫性があり、保守しやすく、拡張性の高いものになります。新しいチームメンバーもこの規約を参照することで、プロジェクトの構造と規約を素早く理解できるようになります。 