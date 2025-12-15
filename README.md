Scène Website (GitHub Pages / Jekyll)「料理のために用意された、静かな一夜」というコンセプトを体現するため、没入感のあるシングルページ・デザインを採用したWebサイトの構成ファイル一式です。📁 ディレクトリ構成/
├─ _config.yml          # サイト全体の設定（予約URL、ドメインなど）
├─ _includes/           # 共通部品（切り出しファイル）
│   ├─ head.html        # <head>タグ内（CSS読み込みなど）
│   └─ header.html      # ヘッダー・ナビゲーション・モバイルメニュー
├─ _layouts/            # ページレイアウト
│   ├─ default.html     # 基本レイアウト（フッター・CTA・モーダルを含む）
│   └─ post.html        # ニュース記事詳細ページ用
├─ _posts/              # ニュース記事データ（Markdown）
│   ├─ YYYY-MM-DD-title.md
│   └─ ...
├─ assets/
│   ├─ css/style.css    # デザイン・スタイルシート
│   ├─ js/script.js     # スクロール演出・動的制御
│   └─ img/             # 画像ファイル（各自追加してください）
├─ jp/
│   └─ index.html       # 【日本語】トップページ（全コンテンツを集約）
└─ en/
    └─ index.html       # 【英語】トップページ（全コンテンツを集約）

運用・更新マニュアル1. ニュース（お知らせ）の追加お知らせを追加する場合、HTMLを直接編集する必要はありません。Markdownファイルを追加するだけで自動的にトップページのリストと詳細ページが生成されます。_posts フォルダ内に新しいファイルを作成します。ファイル名形式: YYYY-MM-DD-title.md （例: 2025-12-25-winter-menu.md）注意: ファイル名は必ず半角英数字とハイフンを使用してください。ファイルの内容を以下のように記述します。---
layout: post
title: "記事のタイトル"
date: 2025-12-25
lang: jp  # 英語記事の場合は en
---

ここに本文を記述します。
改行やリンクもMarkdown記法で記述可能です。
2. テキスト・コンテンツの修正Webサイトのメインコンテンツ（コンセプト、料理の説明、FAQ、アクセス情報など）を修正する場合は、以下のファイルを編集します。日本語: jp/index.html英語: en/index.htmlファイル内の該当するセクション（例: <section id="concept"> や <section id="access">）を探し、テキストを書き換えてください。3. フッター・CTA・ナビゲーションの修正共通部分の修正箇所は以下の通りです。ヘッダー・メニュー: _includes/header.htmlフッター・固定予約ボタン(CTA): _layouts/default.html4. 画像の差し替え現在はダミー画像（Unsplash）が設定されています。実店舗の写真に差し替えてください。assets/img フォルダを作成し、写真ファイルをアップロードします。jp/index.html や en/index.html 内の img src="..." を書き換えます。変更前: https://images.unsplash.com/...変更後: {{ '/assets/img/your-photo.jpg' | relative_url }}5. 予約リンクの変更予約システムを変更する場合、全ページのボタンを一括で更新できます。編集ファイル: _config.yml該当箇所: reservation_url: "https://..."🚀 公開手順 (GitHub Pages)このフォルダ一式をGitHubリポジトリの main ブランチにプッシュします。GitHubのリポジトリ設定 (Settings > Pages) を開きます。Source を Deploy from a branch に設定し、Branchを main / /(root) に指定してSaveします。数分待つと、https://<username>.github.io/<repo-name>/ で公開されます。独自ドメインを使用する場合CNAME ファイル内のテキストを取得したドメイン（例: scene-daisen.com）に書き換えます。GitHub Pagesの設定画面で「Custom domain」を入力し、DNS設定を行います。公開後、_config.yml の url: を本番ドメインに書き換えてください。