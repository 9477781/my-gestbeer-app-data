<<<<<<< HEAD
# ゲストビールアプリ

HUBと82のゲストビール情報を表示するWebアプリケーションです。

## 📋 機能

- ゲストビールの詳細情報表示
- 日本語/英語の多言語対応
- Google スプレッドシートからのデータ取得（GAS連携）
- レスポンシブデザイン

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/9477781/my-gestbeer-app-data.git
cd my-gestbeer-app-data
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、GAS APIのURLを設定します。

```bash
cp .env.example .env.local
```

`.env.local`を編集：

```env
VITE_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. ローカルで起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 📦 ビルド

```bash
npm run build
```

ビルドされたファイルは`dist`フォルダに出力されます。

## 🌐 デプロイ（Vercel）

### Vercelへのデプロイ手順

1. [Vercel](https://vercel.com/)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：
   - `VITE_GAS_API_URL`: GAS APIのURL
5. 「Deploy」をクリック

## 📊 Google Apps Script（GAS）の設定

### スプレッドシートの準備

スプレッドシートに以下のシート構造を作成してください：

#### 店舗シート（stores）
| 店舗名 | URL |
|-------|-----|
| 82 神田店 | https://... |

#### ビールシート（beers）
| id | name_ja | name_en | type | abv | ibu | ... | available_at |
|----|---------|---------|------|-----|-----|-----|--------------|
| 1 | ビール名 | Beer Name | IPA | 5.5% | 40 | ... | 82 神田店,HUB東京 |

### GASコードの作成

スプレッドシートから「拡張機能」→「Apps Script」を開き、以下のコードを貼り付けてください：

```javascript
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 店舗データの取得
  const storesSheet = ss.getSheetByName('stores');
  const storesData = storesSheet.getDataRange().getValues();
  const stores = {};
  
  for (let i = 1; i < storesData.length; i++) {
    const [name, url] = storesData[i];
    if (name && url) {
      stores[name] = url;
    }
  }
  
  // ビールデータの取得
  const beersSheet = ss.getSheetByName('beers');
  const beersData = beersSheet.getDataRange().getValues();
  const headers = beersData[0];
  const beers = [];
  
  for (let i = 1; i < beersData.length; i++) {
    const row = beersData[i];
    const beer = {};
    
    headers.forEach((header, index) => {
      if (header === 'available_at') {
        // カンマ区切りの店舗リストを配列に変換
        beer[header] = row[index] ? row[index].split(',').map(s => s.trim()) : [];
      } else if (header === 'features_ja' || header === 'features_en') {
        // 改行区切りの特徴を配列に変換
        beer[header] = row[index] ? row[index].split('\\n').map(s => s.trim()) : [];
      } else if (header === 'id' || header === 'ibu' || header.includes('price')) {
        // 数値項目
        beer[header] = Number(row[index]) || 0;
      } else {
        beer[header] = row[index] || '';
      }
    });
    
    beers.push(beer);
  }
  
  const result = {
    stores: stores,
    beers: beers
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### デプロイ

1. GASエディタで「デプロイ」→「新しいデプロイ」
2. 「種類」を「ウェブアプリ」に設定
3. 「次のユーザーとして実行」を自分のアカウントに設定
4. 「アクセスできるユーザー」を「全員」に設定
5. 「デプロイ」をクリック
6. 生成されたURLを`.env.local`に設定

## 🛠️ 技術スタック

- **React** 19.2.0
- **TypeScript** 5.8.2
- **Vite** 6.2.0
- **Tailwind CSS** (CDN)

## 📝 ライセンス

Private
=======
# my-gestbeer-app-data
Googleスプレッドシートからゲストビール情報を同期
>>>>>>> 2103f063231c95ef868af6b98618d9c4f63f0bb9
