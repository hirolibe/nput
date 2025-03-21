# Nput

## 1. サービスの概要
「Nput（エヌプット）」は、プログラミング学習をサポートするWebサービスです。

URL: [https://n-put.com](https://n-put.com)
<br><br>

## 2. サービスの特徴
本サービスは次の3つの機能によって、プログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。

#### 学習記録機能
- 本サービス内のノートに学習内容・学習時間を記録することができます。
- 学習時間を記録して可視化することで、成果を実感しにくい学習初期の段階でも、モチベーションを保ちやすくなります。

#### 情報共有機能
- 作成したノートを公開すると、他のユーザーが閲覧できるようになります。
- エール機能、コメント機能、フォロー機能を通じて、コミュニティの活性化をサポートします。
- また、日々の学習記録と連動させることでアウトプットの機会を増やし、コミュニティへの積極的な貢献を促します。

#### 応援機能
- 学習時間に応じて獲得できるポイントを使って、他のユーザーを応援することができます。
- ポイント制として応援できる回数を制限することで、通常の「いいね」以上の特別な価値を持たせています。
<br><br>

## 3. 画面操作
### 3-1. 新規登録・ログイン

#### ログイン状態と利用できる機能
- 未ログイン
  - ノート一覧・ノート詳細・ユーザー詳細ページの閲覧
- ログイン中
  - 未ログイン時の機能
  - ノート編集・プロフィール編集ページの閲覧
  - エール送信・解除
  - データの作成・編集・保存・削除
  - フォロー・アンフォロー

#### 新規登録・ログイン方法

新規登録・ログイン方法は以下の4種です。

①Googleで新規登録

②ゲストログイン

③新規登録

④メールアドレス/パスワードでログイン
<br><br>

最初に、ヘッダーの右側にある「ログイン」ボタンをクリックします。

**① Googleで新規登録する場合**

1. 「新規登録」タブをクリック
2. 「Googleで新規登録」ボタンをクリック
3. Googleアカウントのメールアドレスを入力して「次へ」ボタンをクリック
4. Googleアカウントのパスワードを入力して「次へ」ボタンをクリック

![Image](https://github.com/user-attachments/assets/9b6209dd-a269-41d6-b6e5-8d8b13c3fffc)

**② ゲストログインする場合**
1. 「新規登録」タブをクリック
2. 「ゲストログイン」ボタンをクリック

![Image](https://github.com/user-attachments/assets/0f9a9c71-2cf6-4681-b693-e314b0be3692)

**③ 新規登録する場合**
1. 「新規登録」タブをクリック
2. メールアドレスとパスワードを入力
3. 「新規登録」ボタンをクリック
4. メールアドレスに送信されたコードを入力
5. 「確定」ボタンをクリック
6. ページ遷移後、「ユーザー名」を入力
7. 「利用規約に同意する」と「プライバシーポリシーに同意する」にチェック
8. 「新規登録する」ボタンをクリック

![Image](https://github.com/user-attachments/assets/6cbf3135-1b5b-4588-af73-d9ff24f7ca20)

**④ メールアドレス/パスワードでログインする場合**
1. 「ログイン」タブをクリック
2. アカウント登録済のメールアドレスとパスワードを入力
3. 「ログイン」ボタンをクリック

![Image](https://github.com/user-attachments/assets/efecd9db-a092-4b6f-be50-500de2025e27)

**◯ パスワードを忘れた場合**
1. 「ログイン」タブをクリック
2. 「パスワードを忘れた場合」をクリック
3. アカウント登録済のメールアドレスを入力
4. 「コードを送信」ボタンをクリック
5. メールアドレスに送信されたコードを入力
6. 新しいパスワードを入力
7. 「送信」ボタンを入力し、パスワードのリセットが完了

![Image](https://github.com/user-attachments/assets/b79f32c2-011e-4727-848d-442eedde7e80)


### 3-2. ノートページの閲覧
ノート一覧・詳細ページでは、以下の操作ができます。（UI/UXは「Zenn」や「Qiita」などの既存のサービスを参考に設計しています）
- ユーザーが公開したノート一覧をカード形式で閲覧（ページネーション）
- カードをクリックしてノート詳細ページに遷移
- ノートにエールを送信
- ノートにコメントを投稿（マークダウン記法・画像挿入可）

![Image](https://github.com/user-attachments/assets/08aa14ec-9947-47f4-90cf-6128fc00e495)

### 3-3. ユーザーページの閲覧
ユーザーページでは、以下の情報を閲覧できます。
- プロフィール情報
- 学習記録
- ノート公開・エール・フォローなどの活動履歴

![Image](https://github.com/user-attachments/assets/56f954f0-0e4a-4dca-b3da-55f6e3919631)

### 3-4. ノート作成・編集
ノート作成・編集ページでは、以下の操作ができます。（UI/UXは「Zenn」や「Qiita」などの既存のサービスを参考に設計しています）
- タイトル・本文・タグ・概要の入力（本文はマークダウン記法・画像挿入可）
- エディタ/プレビューの表示切り替え
- 下書き保存・ノート公開・ノート削除
- ノート作成時間の確認

![Image](https://github.com/user-attachments/assets/94234abb-26e8-425c-a292-da40be7ecf4b)
<br><br>

## 4. 機能一覧
| 機能 | 説明 |
| ---- | ---- |
| アカウント関連機能 | 新規登録、ゲストログイン、ソーシャルログイン、メールアドレス/パスワードログイン、パスワードリセット、ログアウト、削除 |
| ノート関連機能 | 新規作成、マークダウンテキスト、画像保存、変更内容のバックアップ、下書き保存、公開、一覧表示、詳細表示、検索、編集、削除 |
| コメント機能 | コメント投稿、マークダウンテキスト、画像保存、ノートに対するコメント一覧表示、削除 |
| エール機能 | エール送信、エールポイント消費、エール状態表示、エール回数表示、保有エールポイント表示、エールしたノート一覧表示、削除 |
| タグ付け機能 | ノートへのタグ付け、タグ付けされたノート一覧表示、ノートに付けるタグの編集 |
| 学習時間記録機能 | タイムトラッキング、エールポイント付与、学習時間のグラフ表示、ノート作成時間表示 |
| プロフィール関連機能 | プロフィール表示、編集、アバター画像保存 |
| フォロー機能 | フォロー、フォロー状態表示、フォロー中ユーザーの一覧表示、フォロワーの一覧表示、アンフォロー |
<br>

## 5. 技術スタック
### 5-1. 使用技術
#### 【開発言語・フレームワーク】

本サービスの開発に使用した技術は、以下の3点を軸に選定しています。
- アプリ開発の基礎を効率的に学べるように、学習リソースが豊富な技術であること
- 実務環境ですぐに活用できるように、業界で広く採用されている技術であること

**◯ フロントエンド**

- TypeScript
  - 静的型付けによるコード品質の保証と開発効率の向上
- Next.js
  - CSR（Client Side Rendering）によるインタラクティブな体験の提供
  - ISR（Incremental Static Regeneration）による、コンテンツの初期ロード高速化と動的更新の両立
  - 組み込みのMarkdownサポートと画像最適化機能による開発効率の向上とパフォーマンスの改善

**◯ バックエンド**

- Ruby on Rails
  - 必要最小限の機能に絞ったAPI modeで使用することで、軽量で効率的なAPIサーバーを実現

**◯ 一覧**

| 区分 | 名称 | 説明 |
|------|-----|-----|
| フロントエンド | Node.js(v20.18.3) | JavaScriptランタイム環境 |
| | Next.js(v14.2.13) | フロントエンドフレームワーク |
| | TypeScript(5.3.3) | フロントエンド開発言語 |
| バックエンド | Ruby(3.1.2) | バックエンド開発言語 |
| | Ruby on Rails(API mode)(7.0.8.4c) | バックエンドフレームワーク |
<br>

#### 【ライブラリ・ツール】

**◯ フロントエンド**

| 区分 | 名称 | 説明 |
|-----|-----|------|
| UI | React(18.3.1) | UIライブラリ |
| | MUI(Material UI) | UIコンポーネント |
| | Marked | Markdown変換ツール |
| フォーム | React Hook Form | 状態管理ライブラリ |
| データフェッチ | Axios | HTTPリクエストライブラリ |
| | SWR | データフェッチとキャッシュ管理を行うライブラリ |
| リントツール | ESLint(v8.57.1) | コードの静的解析ツール |
| | Prettier(3.4.2) | コードフォーマッタ |
<br>

**◯ バックエンド**

| 区分 | 名称 | 説明 |
|-----|-----|------|
| リントツール | RuboCop | コードの静的解析ツール |
| テスト | RSpec | テストフレームワーク |
| | FactoryBot | テスト用データを作成するライブラリ |
| | Faker | ランダムなデータを生成するライブラリ |
<br>

#### 【インフラ】
**◯ 開発環境**

| 区分 | 名称 | 説明 |
|-----|-----|------|
| 共通 | Docker(v27.4.0, build bde2b89) | コンテナ管理ツール |
|  | Docker Compose | コンテナのオーケストレーションツール |
| フロントエンド | AWS Amplify Sandbox | ローカル開発環境 |
| バックエンド | Puma | バックエンドサーバー |
|  | ActiveStorage | ファイルの保存管理 |
|  | MySQL(8.0.39)(コンテナ) | リレーショナルデータベース管理システム |
|  | Redis(コンテナ) | インメモリデータベース |
<br>

**◯ 本番環境**

| 区分 | 名称 | 説明 |
|-----|-----|------|
| 共通 | Docker | コンテナ管理ツール |
| フロントエンド | AWS Amplify | ローカル開発環境 |
| バックエンド | ECS Fargate     | サーバーレスコンテナ実行サービス |
|  | VPC | AWS上で仮想ネットワークを構築 |
|  | Public Subnet | フロントエンド(Next.js)、バックエンド(Puma、Nginx)を配置 |
|  | Private Subnet | RDS(MySQL)、ElastiCache(Redis)を配置 |
|  | ALB | ドメイン名に基づくトラフィック分散 |
|  | Route53 | ドメイン名管理とDNS設定 |
|  | ACM | SSL証明書の管理 |
|  | ECR | コンテナイメージを保存するリポジトリ |
|  | S3 | ファイルを保存管理するストレージサービス 
|  | RDS | データベースサービス(MySQL) |
|  | ElastiCache | データキャッシュサービス |
|  | Systems Manager | マスターキーなどの秘密情報管理 |
|  | CloudWatch | ログ監視 |
<br>

#### 【認証】
| 区分 | 名称 | 説明 |
|-----|-----|------|
| ID管理 | AWS Cognito | ユーザー情報の管理 |
| 認証方法 | メール/パスワード | Cognito組み込み機能 |
|  | Google認証 | ソーシャルログイン連携 |
| トークン | JWT | バックエンドでのトークン検証 |
<br>

#### 【Continuous Integration / Continuous Delivery(CI/CD)】
| 区分 | 名称 | 説明 |
|-----|-----|------|
| フロントエンド | GitHub Actions | コード品質チェックの自動化 |
|  | AWS Amplify | ビルド・デプロイ自動化 |
| バックエンド | GitHub Actions | テスト・ビルド・デプロイ自動化 |

<br><br>

### 5-2. 図解
#### インフラ構成図
**◯ 全体**
- フロントエンドとバックエンドをAWSに統合
- Route53によるDNS管理
- ACMによるSSL/TLS証明書付与

**◯ フロントエンド（Amplify）**
- 静的ファイルのキャッシュによる初期ロードの高速化
- ユーザー認証ロジックの実装効率化
- GitHub連携による自動デプロイパイプライン
- HTTPからHTTPSへの自動リダイレクト

**◯ バックエンド（ECS/Fargate）**
- RDSのプライベートサブネットへの配置
- GitHub ActionsとECRを連携した自動デプロイパイプライン

![Image](https://github.com/user-attachments/assets/254271cd-17f9-4d04-901d-10025532df39)

#### ER図
- カウンターキャッシュを利用して、合計数（例: cheers_count）を効率的に取得
- durationsテーブルを設けて、学習時間の記録と集計を効率化

![Image](https://github.com/user-attachments/assets/9119e6f9-e7bc-499a-8d64-0a3b6ee7b641)
<br><br>

## 6. 今後の展望と課題
### 今後追加したい機能
- オフライン環境におけるデータ操作（ローカルにキャッシュ → オンライン復帰時に自動同期）
<br><br>

### 課題
  - AWS Amplify DataStoreの導入検討
<br><br>


## 7. ライセンス
Nput は [MIT License](https://opensource.org/licenses/MIT) のもとで公開されています。詳細は [LICENSE.md](https://github.com/hirolibe/nput/blob/main/LICENSE.md) をご覧ください。
