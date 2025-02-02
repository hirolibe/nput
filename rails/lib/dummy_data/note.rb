module DummyData
  module Note
    NOTE = {
      title: "NputのMarkdown記法一覧",
      content: <<~CONTENT
        このページでは、NputのMarkdown記法を一覧で紹介します。

        # 見出し
        ```
        # 見出し1
        ## 見出し2
        ### 見出し3
        #### 見出し4
        ```
        <br><br>

        # リスト
        ```
        - Hello World!
          - Hello!
        ```
        - Hello World!
          - Hello!
          * Hi!
        <br><br>

        # 番号付きリスト
        ```
        1. First
        2. Second
        ```
        1. First
        2. Second
        <br><br>

        # テキストリンク
        ```
        [アンカーテキスト](リンクのURL)
        ```
        [アンカーテキスト](リンクのURL)
        <br><br>

        # 画像
        ```
        <img src="https://画像のURL" width="700" />
        ```
        <img src="https://backend.n-put.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBJQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--85f57d8b0c9ddf5d2375dda3bc59a448e288f5a4/スクリーンショット 2025-02-02 6.34.17.png" width="700" />
        <br>

        ### 画像の横幅を指定する
        画像のサイズを調整する場合は、widthの値を変更することで画像の幅をpx単位で指定できます。
        ```
        <img src="https://画像のURL" width="200" />
        ```
        <img src="https://backend.n-put.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBJQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--85f57d8b0c9ddf5d2375dda3bc59a448e288f5a4/スクリーンショット 2025-02-02 6.34.17.png" width="200" />
        <br>

        ### Altテキストを指定する
        ```
        <img src="https://画像のURL" alt="Altテキスト" width="700" />
        ```
        <img src="https://画像のURL" alt="Altテキスト" width="700" />
        <br>

        ### キャプションをつける
        ```
        *キャプション*
        ```
        *キャプション*

        <br>

        ### 画像にリンクを貼る
        ```
        [<img src="https://画像のURL" width="700" />](リンクのURL)
        ```
        <br><br>

        # テーブル
        ```
        | Header 1 | Header 2 | Header 3 |
        | -------- | -------- | -------- |
        | Row 1    | Row 1    | Row 1    |
        | Row 2    | Row 2    | Row 2    |
        ```
        <br>

        | Header 1 | Header 2 | Header 3 |
        | -------- | -------- | -------- |
        | Row 1    | Row 1    | Row 1    |
        | Row 2    | Row 2    | Row 2    |

        <br><br>

        # コードブロック
        コードは「```」で挟むことでブロックとして挿入できます。以下のように言語を指定するとコードへ装飾（シンタックスハイライト）が適用されます。

        ```js
        console.log("javascript")
        ```
        シンタックスハイライトにはPrismLightを使用しています。
        <br><br>

        # 引用
        ```
        > 引用文
        ```
        > 引用文

        <br><br>

        # 区切り線
        ```
        ---
        ```
        ---
        <br><br>

        # インラインスタイル
        ```
        *イタリック*
        **太字**
        ~~打ち消し線~~
        インラインで`code`を挿入する
        ```
        *イタリック*

        **太字**

        ~~打ち消し線~~

        インラインで`code`を挿入する
        <br><br>

        # メモ
        ```
        <!-- ここに記載したコメントはページ上に表示されません -->
        ```
        <!-- ここに記載したコメントはページ上に表示されません -->
        <br><br>
      CONTENT
    }
  end
end