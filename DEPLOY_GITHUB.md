# GitHubへのプッシュ手順

## ステップ1: Gitの初期化とリモート設定

コマンドプロンプトまたはPowerShellを開き、以下のコマンドを実行してください。

```bash
# アプリのフォルダに移動
cd "C:\Users\user1097\Desktop\アプリ開発\ゲストビールアプリ"

# Gitの初期化（まだ初期化していない場合）
git init

# GitHubリポジトリをリモートとして追加
git remote add origin https://github.com/9477781/my-gestbeer-app-data.git

# メインブランチに変更（古いバージョンのGitを使っている場合）
git branch -M main
```

## ステップ2: ファイルをステージング

```bash
# すべてのファイルを追加
git add .

# 追加されたファイルを確認
git status
```

## ステップ3: コミット

```bash
# コミットメッセージを付けてコミット
git commit -m "Initial commit: Add guest beer app with GAS integration"
```

## ステップ4: GitHubにプッシュ

```bash
# GitHubにプッシュ
git push -u origin main
```

もし認証エラーが出る場合は、GitHubの個人アクセストークンを使用してください。

## ステップ5: 確認

ブラウザで以下のURLを開き、ファイルが正しくアップロードされたか確認してください：
https://github.com/9477781/my-gestbeer-app-data

---

# トラブルシューティング

## エラー: "remote origin already exists"

```bash
# 既存のリモートを削除
git remote remove origin

# 再度リモートを追加
git remote add origin https://github.com/9477781/my-gestbeer-app-data.git
```

## エラー: "Updates were rejected because the remote contains work"

GitHubのリポジトリに既にファイルがある場合：

```bash
# リモートの内容を取得してマージ
git pull origin main --allow-unrelated-histories

# 競合がある場合は解決してからコミット
git add .
git commit -m "Merge remote and local"

# プッシュ
git push -u origin main
```

## GitHub認証エラー

Windows環境でパスワード認証が使えない場合は、個人アクセストークンを使用してください：

1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. `repo`権限を付与
3. 生成されたトークンをコピー
4. プッシュ時にパスワードの代わりにトークンを入力
