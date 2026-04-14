# FUTURE ASIA PREMIUM 自動Notion登録 - セットアップ手順

## 概要
毎日のFUTURE ASIA PREMIUMメルマガを自動でNotionナレッジベースに登録するGASスクリプト。

```
Gmail → GAS (日次トリガー) → Claude API (分析) → Notion API (登録)
```

## セットアップ手順

### Step 1: GASプロジェクト作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「FUTURE ASIA PREMIUM Auto」に変更

### Step 2: ファイルを作成

GASエディタで以下の5ファイルを作成し、それぞれのコードを貼り付け:

| ファイル名 | 内容 |
|-----------|------|
| `Config.gs` | 設定管理・トリガー設定 |
| `Main.gs` | メイン処理フロー |
| `GmailService.gs` | Gmail検索・本文抽出 |
| `ClaudeService.gs` | Claude API連携 |
| `NotionService.gs` | Notion API連携 |

> GASエディタでは「+」→「スクリプト」で新しいファイルを追加できます。
> ファイル名には `.gs` を付けずに入力してください（自動で付与されます）。

### Step 3: APIキーを設定

GASエディタの左メニュー → ⚙ プロジェクトの設定 → スクリプトプロパティ

以下を追加:

| プロパティ名 | 値 |
|------------|---|
| `CLAUDE_API_KEY` | Anthropic APIキー (`sk-ant-...`) |
| `NOTION_API_KEY` | Notion内部インテグレーションのシークレット (`secret_...`) |
| `NOTION_DATABASE_ID` | `7762b953-8f13-4b0b-bce4-7382dbd3cdc3` |
| `NOTIFICATION_EMAIL` | 通知先メールアドレス（任意、空欄可） |

### Step 4: Notion内部インテグレーションの設定

1. [Notion Integrations](https://www.notion.so/my-integrations) にアクセス
2. 「新しいインテグレーション」を作成（既存のものがあればそれを使用）
3. 機能:「コンテンツを読み取る」「コンテンツを挿入」にチェック
4. シークレットをコピーしてスクリプトプロパティに設定
5. **重要**: Notionの「FUTURE ASIA PREMIUM ナレッジベース」データベースページで
   「...」→「コネクト」→ 作成したインテグレーションを追加

### Step 5: テスト実行

1. GASエディタで関数選択を `testRun` に変更
2. 「実行」をクリック
3. 初回は権限の承認ダイアログが表示される → 承認
4. 「実行ログ」で結果を確認
   - メールの検出、Claude APIの分析結果、重複チェック結果が表示される

### Step 6: 本番テスト

1. 関数選択を `dailyFutureAsiaPremium` に変更
2. 「実行」をクリック
3. Notionで新規ページが正しく作成されているか確認

### Step 7: 日次トリガー設定

1. 関数選択を `createDailyTrigger` に変更
2. 「実行」をクリック
3. → 毎日午前8〜9時に自動実行されるようになります

**または**手動でトリガーを設定:
1. GASエディタ左メニュー → 「トリガー」（時計アイコン）
2. 「トリガーを追加」
3. 関数: `dailyFutureAsiaPremium`
4. イベントのソース: 時間主導型
5. 時間ベースのトリガーのタイプ: 日付ベースのタイマー
6. 時刻: 午前8時〜9時

## コスト目安

| 項目 | 月間コスト |
|------|----------|
| GAS | 無料 |
| Claude API (Sonnet) | 約$1-3/月（1日1-2メール × ~4000トークン） |
| Notion API | 無料 |

## トラブルシューティング

### Claude APIエラー
- APIキーが正しいか確認
- Anthropicアカウントにクレジットがあるか確認
- `実行ログ` でエラー詳細を確認

### Notionに登録されない
- Notion内部インテグレーションがデータベースに接続されているか確認
- APIキーが正しいか確認
- データベースIDが正しいか確認

### メールが検出されない
- Gmailの検索クエリが正しいか確認
- `newer_than:1d` を `newer_than:3d` に変更してテスト

### トリガーが動かない
- GASエディタ → トリガー で設定を確認
- 「トリガーの実行ログ」でエラーを確認
