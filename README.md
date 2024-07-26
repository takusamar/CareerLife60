# CareerLife60 - 仕事人生60年表 -

仕事人生60年表は、誕生から現在そして未来の60歳までを図で表現します。

人生60年を俯瞰して眺めることで、今までの自分のキャリアをふりかえり、またこの先に残されている時間を実感することができます。

## サービスの背景

私自身が、自分のキャリアをふりかえって残りの人生をどう生きようかと考えていたタイミングで、平鍋健児さんが以前ブログに書いていた記事を思い出しました。

https://anagileway.com/2016/02/07/60-years-of-working-life/

せっかくなのでExcelではなくWebアプリ化してみようと思い、これを作成しました。

## URL

https://careerlife60.web.app/

### サンプル用アカウント

https://careerlife60.web.app/ZQGC2g4HgRd9n2TrWlNGNgIWwnj2

## 使用技術

| Category       | Technology Stack                                               |
| -------------- | -------------------------------------------------------------- |
| Frontend       | TypeScript, React, Chakra UI, TanStack Router, ReactFire, Jest |
| Backend        | (N/A)                                                          |
| Infrastructure | Firebase Hosting, Authentication, Firestore                    |
| CI/CD          | GitHub Actions                                                 |
| Design         | Figma                                                          |

## 画面説明

![careerlife60_top](https://github.com/user-attachments/assets/4c147661-9ad6-4148-bed9-93bd7c019291)

### アカウント登録

1. トップページからアカウント登録に進み、メールアドレスを入力

![careerlife60_signup](https://github.com/user-attachments/assets/26fbf326-1fc3-4716-8596-f4fef948513b)

2. 確認メールが送られるので、メール本文内のリンクをクリック

3. アカウント情報（ユーザーネーム、生年月、パスワード）を入力し、登録

![careerlife60_signup_form](https://github.com/user-attachments/assets/a828dc5d-fe8c-42cd-88df-9ed79b615e0b)

### ログイン、ログアウト

- （ログイン前）右上の「ログイン」からログイン

- （ログイン中）右上のユーザーネームからログアウト

### 年表画面

0歳から60歳までの年表が表示される

![careerlife60_timeline](https://github.com/user-attachments/assets/7ac96cd2-fd97-49f4-b4b7-6d47dafa3d4f)

「経歴追加」から経歴を追加すると、年表に表示される

![careerlife60_add_history](https://github.com/user-attachments/assets/6f1c67c9-ebc4-4fd4-aa47-f5e3aa5e6c6b)

経歴のタイトルをクリックすると内容を編集できる

![careerlife60_history](https://github.com/user-attachments/assets/38c1daa5-40d1-44d7-8d81-8f6be8761769)
