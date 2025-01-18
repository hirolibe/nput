# Nput

## 1. サービスの概要
「Nput（エヌプット）」は、プログラミング学習をサポートするWebサービスです。

URL: [https://n-put.com](https://n-put.com)
<br><br>

## 2. サービスの特徴
本サービスは、次の3つの機能によって、プログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。

#### 学習記録機能
- 本サービス内のノートに学習内容を記録することができます。
- 学習時間を記録して可視化することで、成果を実感しにくい学習初期の段階でも、達成感を得ることができます。

#### 情報共有機能
- 学習記録として位置づけることでノート共有のハードルが下がり、コミュニティへの積極的な貢献が促進されます。
- エール機能、コメント機能、フォロー機能を通じて、コミュニティの活性化をサポートします。

#### エール機能
- 学習時間に応じて貯まるポイントを使って、他のユーザーにエールを送ることができます。
- ポイント制としてエールできる回数を制限することで、通常の「いいね」以上の特別な価値を持たせています。
<br><br>

## 3. 画面操作
### 3-1. 新規登録・ログイン
ゲストログイン（アカウント登録なし）で一部機能を体験することができます。
ノート保存、コメント投稿、フォロー、プロフィール更新などを行うにはログインが必要です。

### 3-2. ノートページの閲覧
ノート一覧・詳細ページでは、以下の操作ができます。
（基本的なUI/UXは既存サービスの「Zenn」や「Qiita」を模倣しています）
- ユーザーが公開したノート一覧をカード形式で閲覧
- カードをクリックしてノート詳細ページに遷移
- ノートにエールを送信
- ノートにコメントを投稿（マークダウン記法・画像挿入可）

### 3-3. ユーザーページの閲覧
ユーザーページでは、以下の情報を閲覧できます。
- プロフィール情報
- 学習記録
- ノート公開・エール・フォロー・フォロワーなどの活動履歴

### 3-4. ノート作成・編集
ノート作成・編集ページでは、以下の操作ができます。
（基本的なUI/UXは既存サービスの「Zenn」や「Qiita」を模倣しています）
- タイトル・本文・タグ・概要の入力（本文はマークダウン記法・画像挿入可）
- エディタ/プレビューの表示切り替え
- 下書き保存・ノート公開・ノート削除
- ノート作成時間の確認
<br><br>

## 4. 機能一覧
| 機能 | 説明 |
| ---- | ---- |
| アカウント関連機能 | 新規登録、ログイン、ログアウト、削除 |
| ノート関連機能 | 新規作成、マークダウンテキスト、画像保存、下書き保存、公開、一覧表示、詳細表示、編集、削除 |
| コメント機能 | コメント投稿、マークダウンテキスト、画像保存、ノートに対するコメント一覧表示、削除 |
| エール機能 | エール送信、エールポイント消費、エール状態表示、エール回数表示、保有エールポイント表示、エールしたノート一覧表示、削除 |
| タグ付け機能 | ノートへのタグ付け、タグ付けされたノート一覧表示、タグ編集 |
| 学習時間記録機能 | タイムトラッキング、エールポイント付与、学習時間のグラフ表示、ノート作成時間表示 |
| プロフィール関連機能 | プロフィール表示、編集、アバター画像保存 |
| フォロー機能 | フォロー、フォロー状態表示、フォロー中ユーザー一覧表示、フォロワー一覧表示、アンフォロー |
<br>

## 5. 技術スタック
### 5-1. 使用技術
#### 開発言語・フレームワーク
| 区分 | 名称 | 説明 |
|------|------|------------|
| フロントエンド | Node.js(v19.4.0) | JavaScriptランタイム環境 |
| | Next.js(v14.2.13) | フロントエンドフレームワーク |
| | TypeScript(5.3.3) | フロントエンド開発言語 |
| バックエンド | Ruby(3.1.2) | バックエンド開発言語 |
| | Ruby on Rails(API mode)(7.0.8.4c) | バックエンドフレームワーク |
<br>

#### ライブラリ・ツール
- フロントエンド

| 区分 | 名称 | 説明 |
|-----|-----|------|
| UI | React(18.3.1) | UIライブラリ |
| | MUI(Material UI) | UIコンポーネント |
| | Marked | Markdown変換ツール  |
| フォーム | React Hook Form | 状態管理ライブラリ |
| データフェッチ | Axios | HTTPリクエストライブラリ |
| | SWR | データフェッチとキャッシュ管理を行うライブラリ |
| リントツール | ESLint(v8.57.1) | コードの静的解析ツール |
| | Prettier(3.4.2) | コードフォーマッタ |
<br>

- バックエンド

| 区分 | 名称 | 説明 |
|-----|-----|------|
| リントツール | RuboCop | コードの静的解析ツール |
| テスト | RSpec | テストフレームワーク |
| | FactoryBot | テスト用データを作成するライブラリ |
| | Faker | ランダムなデータを生成するライブラリ |
<br>

#### インフラ
- 開発環境

| 区分 | 名称 | 説明 |
|-----|-----|------|
| コンテナ管理  | Docker(v27.4.0, build bde2b89) | コンテナ管理ツール                 |
|             | Docker Compose                 | コンテナのオーケストレーションツール  |
| サーバー      | Puma                           | バックエンドサーバー               |
| フレームワーク | Next.js                        | フロントエンドフレームワーク        |
| ストレージ    | ActiveStorage                  | ファイルの保存管理                 |
| データベース  | MySQL(8.0.39)(コンテナ)          | リレーショナルデータベース管理システム |
| キャッシュ    | Redis(コンテナ)                  | インメモリデータベース             |
<br>

- 本番環境

| 区分 | 名称 | 説明 |
|-----|-----|------|
| コンテナ管理    | Docker              | コンテナ管理ツール                                    |
|               | ECS Fargate         | サーバーレスコンテナ実行サービス                        |
| ネットワーク    | VPC                 | AWS上で仮想ネットワークを構築                          |
|               | Public Subnet       | フロントエンド(Next.js)、バックエンド(Puma、Nginx)を配置 |
|               | Private Subnet      | RDS(MySQL)、ElastiCache(Redis)を配置                |
| ロードバランサー | ALB                 | ドメイン名に基づくトラフィック分散                      |
| DNS/SSL       | Route53             | ドメイン名管理とDNS設定                               |
|               | ACM                 | SSL証明書の管理                                      |
| ストレージ      | ECR                 | コンテナイメージを保存するリポジトリ                     |
|               | S3                  | ファイルを保存管理するストレージサービス                  |
| データベース    | RDS                 | データベースサービス(MySQL)                            |
| キャッシュ      | ElastiCache         | データキャッシュサービス                               |
| 監視           | CloudWatch          | ログ監視                                            |
<br>

#### 外部API（アカウント認証）
- Firebase Authentication

#### Continuous Integration / Continuous Delivery(CI/CD)
- GitHub Actions
<br><br>

### 5-2. 図解
#### インフラ構成図
インフラの全体像をまとめています。
画像以外のデータをRDS（MySQL）に、画像データはS3に保管しています。
![Image](https://github.com/user-attachments/assets/2c947f1e-6b63-4f08-8ad9-757767884a19)

#### ER図
![Image](https://github.com/user-attachments/assets/40c2257f-8814-474d-acb5-77ff3219d53b)
<br><br>

## 6. 今後の展望
### 6-1. 課題と解決策
#### 課題① 認証機能のセキュリティ向上
- GoogleやGitHubなどのソーシャルログインを利用
- メールアドレスで新規登録した場合は、メール認証を通じてユーザーをアクティブ化
#### 課題② オフライン環境下でのデータ操作
- ローカルストレージの利用

### 6-2. 今後追加したい機能
- エディタ機能の拡充（マークダウンのリアルタイムプレビュー機能など）
- ノートのフォルダ整理機能
- 通知機能（エール、コメント、フォロー、運営者からのメッセージ等）
- ノート検索機能
- トレンド表示機能
<br><br>

## 7. ライセンス
Nput は [MIT License](https://opensource.org/licenses/MIT) のもとで公開されています。詳細は [LICENSE.md](https://github.com/hirolibe/nput/blob/main/LICENSE.md) をご覧ください。
