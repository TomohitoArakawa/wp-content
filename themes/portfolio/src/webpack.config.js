module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "production",

  // メインのJS
  entry: "./js/index.js",
  // 出力ファイル
  output: {
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "../dist",
    port: 3000
  }
}
