/**
 * Main.gs - FUTURE ASIA PREMIUM 自動Notion登録
 * メインエントリポイント（日次トリガーから呼ばれる）
 */

/**
 * 日次実行: FUTURE ASIA PREMIUMメルマガをNotionに自動登録
 */
function dailyFutureAsiaPremium() {
  var config = getConfig();
  var startTime = new Date();
  Logger.log('=== FUTURE ASIA PREMIUM 自動登録開始 ===');
  Logger.log('実行日時: ' + startTime.toLocaleString('ja-JP'));

  // 結果トラッキング
  var stats = {
    emailsFound: 0,
    articlesExtracted: 0,
    duplicatesSkipped: 0,
    pagesCreated: 0,
    errors: [],
    createdTitles: []
  };

  try {
    // 1. Gmail検索
    Logger.log('Step 1: Gmail検索中...');
    var emails = searchEmails(config.GMAIL_QUERY);
    stats.emailsFound = emails.length;
    Logger.log('  → ' + emails.length + '件のメールを検出');

    if (emails.length === 0) {
      Logger.log('新着メールなし。処理終了。');
      sendNotification(stats, startTime);
      return;
    }

    // 2. 各メールを処理
    for (var i = 0; i < emails.length; i++) {
      var email = emails[i];
      Logger.log('\nStep 2: メール ' + (i + 1) + '/' + emails.length + ' を処理中...');
      Logger.log('  件名: ' + email.subject);
      Logger.log('  日付: ' + email.date);

      try {
        // 3. Claude APIで分析
        Logger.log('Step 3: Claude APIで分析中...');
        var dateStr = formatDateISO(email.date);
        var articles = analyzeEmailWithClaude(email.body, email.subject, dateStr);
        stats.articlesExtracted += articles.length;
        Logger.log('  → ' + articles.length + '件の記事を抽出');

        // 4. 各記事を処理
        for (var j = 0; j < articles.length; j++) {
          var article = articles[j];
          Logger.log('  記事 ' + (j + 1) + ': ' + article.title);

          // 5. 重複チェック
          if (isDuplicateInNotion(article.title)) {
            Logger.log('    → 重複あり、スキップ');
            stats.duplicatesSkipped++;
            continue;
          }

          // 6. Notion登録
          Logger.log('    → Notionに登録中...');
          createNotionPage(article, dateStr, email.gmailLink);
          stats.pagesCreated++;
          stats.createdTitles.push(article.title);
          Logger.log('    → 登録完了');

          // Notion APIレート制限対策（3リクエスト/秒）
          Utilities.sleep(400);
        }

      } catch (e) {
        Logger.log('  エラー: ' + e.message);
        stats.errors.push('メール「' + email.subject + '」: ' + e.message);
      }
    }

  } catch (e) {
    Logger.log('致命的エラー: ' + e.message);
    stats.errors.push('致命的エラー: ' + e.message);
  }

  // 7. 結果レポート
  var elapsed = ((new Date() - startTime) / 1000).toFixed(1);
  Logger.log('\n=== 処理完了 ===');
  Logger.log('処理時間: ' + elapsed + '秒');
  Logger.log('メール数: ' + stats.emailsFound);
  Logger.log('抽出記事数: ' + stats.articlesExtracted);
  Logger.log('重複スキップ: ' + stats.duplicatesSkipped);
  Logger.log('新規登録: ' + stats.pagesCreated);
  if (stats.errors.length > 0) {
    Logger.log('エラー: ' + stats.errors.join('; '));
  }
  if (stats.createdTitles.length > 0) {
    Logger.log('登録タイトル:');
    for (var k = 0; k < stats.createdTitles.length; k++) {
      Logger.log('  - ' + stats.createdTitles[k]);
    }
  }

  // 8. 通知
  sendNotification(stats, startTime);
}

/**
 * 処理結果をメールで通知（設定されている場合）
 * @param {Object} stats - 処理統計
 * @param {Date} startTime - 開始時刻
 */
function sendNotification(stats, startTime) {
  var config = getConfig();
  if (!config.NOTIFICATION_EMAIL) return;

  var elapsed = ((new Date() - startTime) / 1000).toFixed(1);
  var subject = '【FUTURE ASIA PREMIUM】自動登録レポート（' + stats.pagesCreated + '件登録）';

  var body = 'FUTURE ASIA PREMIUM 自動Notion登録レポート\n'
    + '実行日時: ' + startTime.toLocaleString('ja-JP') + '\n'
    + '処理時間: ' + elapsed + '秒\n'
    + '─────────────────────\n'
    + 'メール検出数: ' + stats.emailsFound + '\n'
    + '記事抽出数: ' + stats.articlesExtracted + '\n'
    + '重複スキップ: ' + stats.duplicatesSkipped + '\n'
    + '新規登録数: ' + stats.pagesCreated + '\n';

  if (stats.createdTitles.length > 0) {
    body += '\n【登録タイトル】\n';
    for (var i = 0; i < stats.createdTitles.length; i++) {
      body += '  ・' + stats.createdTitles[i] + '\n';
    }
  }

  if (stats.errors.length > 0) {
    body += '\n【エラー】\n';
    for (var j = 0; j < stats.errors.length; j++) {
      body += '  ⚠ ' + stats.errors[j] + '\n';
    }
  }

  body += '\n─────────────────────\n'
    + 'Notion: https://www.notion.so/f78a0938dc9a462384180c7bc72943c0\n';

  MailApp.sendEmail(config.NOTIFICATION_EMAIL, subject, body);
}

/**
 * テスト実行: 直近3日間を対象にドライラン
 */
function testRun() {
  var config = getConfig();
  Logger.log('=== テスト実行（直近3日間） ===');

  var testQuery = 'from:mailmag@mag2premium.com subject:田村耕太郎 newer_than:3d';
  var emails = searchEmails(testQuery);
  Logger.log('メール数: ' + emails.length);

  for (var i = 0; i < emails.length; i++) {
    Logger.log('\n--- メール ' + (i + 1) + ' ---');
    Logger.log('件名: ' + emails[i].subject);
    Logger.log('日付: ' + emails[i].date);
    Logger.log('本文長: ' + emails[i].body.length + '文字');

    var dateStr = formatDateISO(emails[i].date);
    var articles = analyzeEmailWithClaude(emails[i].body, emails[i].subject, dateStr);

    Logger.log('抽出記事数: ' + articles.length);
    for (var j = 0; j < articles.length; j++) {
      var a = articles[j];
      Logger.log('  [' + a.content_type + '] ' + a.title);
      Logger.log('    ジャンル: ' + a.genre + ' / 重要度: ' + a.importance);
      Logger.log('    地域: ' + (a.regions || []).join(', '));
      Logger.log('    重複チェック: ' + (isDuplicateInNotion(a.title) ? '既存あり→スキップ' : '新規→登録対象'));
    }
  }
}
