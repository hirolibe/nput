# Nput

## 1. サービスの概要
「Nput（エヌプット）」は、プログラミング学習をサポートするWebサービスです。

URL: [https://n-put.com](https://n-put.com)

開発に要した時間：約650時間
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

#### エール機能
- 学習時間に応じて獲得できるポイントを使って、他のユーザーを応援することができます。
- ポイント制としてエールできる回数を制限することで、通常の「いいね」以上の特別な価値を持たせています。
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
以下の手順で本サービスにログインできます。
最初に、ヘッダーの右側にある「ログイン」ボタンをクリックします。

**◯ ゲストログインする場合**
1. 「新規登録」タブをクリック
2. 「ゲストログイン」ボタンをクリック

![Image](https://github.com/user-attachments/assets/0f9a9c71-2cf6-4681-b693-e314b0be3692)

**◯ 新規登録する場合**
1. 「新規登録」タブをクリック
2. メールアドレスとパスワードを入力
3. 「新規登録」ボタンをクリック
4. メールアドレスに送信されたコードを入力
5. 「確定」ボタンをクリック
6. ページ遷移後、「ユーザー名」を入力
7. 「利用規約に同意する」と「プライバシーポリシーに同意する」にチェック
8. 「新規登録する」ボタンをクリック

![Image](https://github.com/user-attachments/assets/6cbf3135-1b5b-4588-af73-d9ff24f7ca20)

**◯ ログインする場合**
1. 「ログイン」タブをクリック
2. アカウント登録済のメールアドレスとパスワードを入力
3. 「ログイン」ボタンをクリック

![Image](https://github.com/user-attachments/assets/565a19b6-4ebc-47c0-a6ad-ee9933089f00)

**◯ パスワードを忘れた場合**
1. 「ログイン」タブをクリック
2. 「パスワードを忘れた場合」をクリック
3. アカウント登録済のメールアドレスを入力
4. 「コードを送信」ボタンをクリック
5. メールアドレスに送信されたコードを入力
6. 新しいパスワードを入力
7. 「送信」ボタンを入力し、パスワードのリセットが完了
8. 「ログイン」タブでメールアドレスとパスワードを入力
9. 「ログイン」ボタンをクリック

![Image](https://github.com/user-attachments/assets/565a19b6-4ebc-47c0-a6ad-ee9933089f00)

**◯ Googleで新規登録する場合**

Googleプロバイダーを利用した認証機能については、現在Googleへ申請中です。利用可能となるまでは、上述の方法にてログインをお願い致します。


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

![Image](https://github.com/user-attachments/assets/ba715710-0bc8-4e7d-bfbe-b3bd6954162b)
<br><br>

## 4. 機能一覧
| 機能 | 説明 |
| ---- | ---- |
| アカウント関連機能 | 新規登録、ゲストログイン、ソーシャルログイン（申請中）、ログイン、ログアウト、削除 |
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

**◯ フロントエンド**

広く採用されており、学習リソースが豊富な技術を選定しています。これにより、アプリ開発の基礎を効率的に学びながら、習得した技術を実践で活かせると考えました。

フロントエンドでは、Next.jsとTypeScriptを組み合わせています。Next.jsは、技術ブログの構築に適した強力なフレームワークです。

クライアントサイドレンダリング（CSR）により、インタラクティブな体験を提供します。

また、インクリメンタル静的再生成（ISR）を組み合わせることで、動的なコンテンツ更新と初期ロードの高速化の両立を実現しています。これにより、優れたSEO対策が可能になり、、

TypeScriptとの相性も良く型安全な開発が可能です。さらに、Markdownサポートや画像の最適化などの機能により、効率的なブログ開発と運用を実現できます。

**◯ バックエンド**

Ruby on Railsを必要最小限の機能に絞ったAPI modeで使用しています。これにより軽量で効率的なAPIサーバーを実現しています。

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
| | Marked | Markdown変換ツール  |
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
| コンテナ管理  | Docker(v27.4.0, build bde2b89) | コンテナ管理ツール                 |
|             | Docker Compose                 | コンテナのオーケストレーションツール  |
| サーバー      | Puma                           | バックエンドサーバー               |
| ストレージ    | ActiveStorage                  | ファイルの保存管理                 |
| データベース  | MySQL(8.0.39)(コンテナ)          | リレーショナルデータベース管理システム |
| キャッシュ    | Redis(コンテナ)                  | インメモリデータベース             |
<br>

**◯ 本番環境**

| 区分 | 名称 | 説明 |
|-----|-----|------|
| コンテナ管理    | Docker          | コンテナ管理ツール                                    |
|               | ECS Fargate     | サーバーレスコンテナ実行サービス                        |
| ネットワーク    | VPC             | AWS上で仮想ネットワークを構築                          |
|               | Public Subnet   | フロントエンド(Next.js)、バックエンド(Puma、Nginx)を配置 |
|               | Private Subnet  | RDS(MySQL)、ElastiCache(Redis)を配置                |
| ロードバランサー | ALB             | ドメイン名に基づくトラフィック分散                      |
| DNS/SSL       | Route53         | ドメイン名管理とDNS設定                               |
|               | ACM             | SSL証明書の管理                                      |
| ストレージ      | ECR             | コンテナイメージを保存するリポジトリ                     |
|               | S3              | ファイルを保存管理するストレージサービス                  |
| データベース    | RDS             | データベースサービス(MySQL)                            |
| キャッシュ      | ElastiCache     | データキャッシュサービス                               |
| 秘密情報管理    | Secrets Manager | マスターキー、Firebase_Credentialsの管理              |
| 監視           | CloudWatch      | ログ監視                                            |
<br>

#### 【外部サービス】
- Google認証（申請中）

#### 【Continuous Integration / Continuous Delivery(CI/CD)】
- GitHub Actions
<br><br>

### 5-2. 図解
#### インフラ構成図
**◯ 全体**
- フロントエンドとバックエンドをAWSに統合
- Route53によるDNS管理
- ACMによるSSL/TLS証明書付与
- HTTPからHTTPSへの自動リダイレクト

**◯ フロントエンド（Amplify）**
- 静的ファイルのキャッシュによる初期ロードの高速化
- ユーザー認証ロジックの実装効率化
- Git連携による自動デプロイパイプライン

**◯ バックエンド（ECS/Fargate）**
- RDSのプライベートサブネットへの配置
- GitHub ActionsとECRを連携した自動デプロイパイプライン

![Image](https://github.com/user-attachments/assets/cb2375d9-4cfe-49a0-9e4e-0fe19a8d39c2)

#### ER図
- カウンターキャッシュを利用して、合計数（例: cheers_count）を効率的に取得
- durationsテーブルを設けて、学習時間の記録と集計を効率化

![Image](https://github.com/user-attachments/assets/02638772-f0fe-4bd1-88b9-acd39516fb94)
<br><br>

## 6. 今後の展望
### 6-1. 今後追加したい機能
- 認証機能の改善
- オフラインでのデータ操作（ローカルにキャッシュ → オンライン復帰時に自動同期）
<br><br>

### 6-2. 課題
**◯ 認証機能の改善**
- 目的
  - 新たなパスワード管理を不要とすることによるユーザー体験の向上
- 対策
  - Google認証の導入（申請中）
<br><br>

**◯ オフラインでのデータ操作**
- 目的
  - オフライン環境におけるデータ操作を可能にすることによるユーザー体験の向上
- 対策
  - AmplifyのDataStoreの利用
<br><br>


## 7. ライセンス
Nput は [MIT License](https://opensource.org/licenses/MIT) のもとで公開されています。詳細は [LICENSE.md](https://github.com/hirolibe/nput/blob/main/LICENSE.md) をご覧ください。
