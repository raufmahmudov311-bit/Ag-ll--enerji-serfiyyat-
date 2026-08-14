# Smart Energy — Ağıllı Enerji Monitorinq Platforması

Evlərin elektrik enerjisini izləmək, analiz etmək və istifadəçiyə təhlükəli
və qeyri-normal vəziyyətlər barədə xəbərdarlıq etmək üçün hazırlanmış
peşəkar veb platforma.

Bu, sadəcə bir dashboard deyil — gələcəkdə real IoT cihazları (ESP32 +
enerji ölçmə sensorları) ilə işləyəcək bir **Smart Energy SaaS/IoT
platformasının** birinci mərhələsidir.

---

## 1. Layihənin məqsədi

Platforma aşağıdakıları edir:

- Gərginlik (V), cərəyan (A), güc (W/kW) və enerji sərfiyyatını (kWh) izləyir
- Elektrik sızmasını (leakage current, mA) izləyir və təhlükə halında xəbərdarlıq edir
- Tarifə əsasən təxmini elektrik xərcini hesablayır
- Bir neçə evi və cihazı dəstəkləyir
- Bildiriş/alert sistemi ilə qeyri-normal vəziyyətləri bildirir
- Sadə dildə analiz verən demo AI Enerji Köməkçisinə malikdir

## 2. Sistem necə işləyir

```
EV → SENSOR → ESP32/IoT → Wi-Fi/Internet → API → SERVER → DATABASE → WEB PLATFORM
```

Hazırda real sensor və ESP32 **yoxdur**. Bunun əvəzinə `lib/simulator.ts`
faylı realistik məlumat yaradır. Frontend heç vaxt bilmir ki, məlumat
simulyatordan gəlir, yoxsa real API-dan — çünki hər ikisi eyni
`services/energy-api.ts` interfeysindən keçir:

```
Bu gün:    Simulator  → energy-api.ts → Dashboard
Sabah:     ESP32 → Real API → Database → energy-api.ts → Dashboard
```

Yəni real sensor qoşulanda **yalnız `services/energy-api.ts` daxilindəki
funksiyaların gövdəsi** `fetch()` çağırışları ilə əvəz olunacaq. Heç bir
komponent və ya səhifə dəyişməyəcək.

### Simulator necə işləyir

`lib/simulator.ts`:

- Gərginlik: 225–235 V aralığında "random walk" ilə dəyişir
- Cərəyan: 0.5–15 A aralığında dəyişir
- Güc: `Voltage × Current` düsturu ilə hesablanır
- Enerji: vaxta və gücə əsasən kumulyativ artır
- Sızma: normalda 0–5 mA, təsadüfi hallarda (təhlükə demo etmək üçün)
  12–22 mA-a qədər sıçrayır
- Tarixi qrafiklər üçün `generateHistoricalSeries()` 24 saat/7 gün/30 gün
  üçün determinized (seed-based) məlumat yaradır ki, hər render zamanı
  qrafik "atlamasın"

Dashboard-da bu aydın şəkildə **"DEMO / SİMULYASİYA REJİMİ"** banneri ilə
göstərilir.

### API nədir

`services/energy-api.ts` — bütün frontend-in enerji məlumatına müraciət
etdiyi tək qapıdır:

- `fetchLatestReading(deviceId)` — canlı ölçmə
- `fetchHistoricalSeries(deviceId, metric, range)` — tarixi məlumat

`NEXT_PUBLIC_DATA_SOURCE` environment dəyişəni `"simulator"` (default) və ya
`"api"` ola bilər. `"api"` seçildikdə, funksiyalar `NEXT_PUBLIC_API_BASE_URL`
ünvanına real HTTP sorğuları göndərir.

### ESP32 gələcəkdə necə qoşulacaq

1. ESP32 üzərində PZEM-004T və ya ATM90E32 kimi bir enerji ölçmə modulu
   quraşdırılır.
2. ESP32 Wi-Fi vasitəsilə backend-ə (`/api/devices/:id/readings`) HTTP POST
   sorğusu göndərir — `types/energy.ts`-dəki `EnergyReading` formatında.
3. Backend məlumatı `EnergyMeasurement` cədvəlinə yazır və lazım gələrsə
   `Alert` yaradır.
4. Frontend dəyişmədən `services/energy-api.ts` vasitəsilə bu məlumatı
   `"api"` rejimində oxuyur.
5. Cihaz autentifikasiyası üçün `DEVICE_AUTH_SECRET` istifadə olunacaq
   (bax `.env.example`).

### Sensor sistemi necə işləyəcək

Frontend heç bir konkret sensor modelindən asılı deyil.
`types/energy.ts`-dəki `EnergyReading` interfeysi ümumi kontraktdır.
İstənilən sensor (PZEM-004T, ATM90E32, digər uyğun modullar) backend
tərəfində bu formata çevrilə bilər.

### Elektrik sızması monitorinqi

`components/dashboard/LeakageCard.tsx` normal/təhlükə vəziyyətini göstərir
(🟢 / 🔴) və 10 mA-dan yuxarı olduqda xəbərdarlıq edir (bax
`config/thresholds.ts`).

**VACİB:** Bu sistem yalnız **təhlükəsizlik xəbərdarlığı** məqsədi daşıyır.
Platforma özünü sertifikatlaşdırılmış elektrik qoruyucu cihaz (RCD) əvəzi
kimi təqdim etmir və etməməlidir. Real sistemdə leakage-current/residual-
current ölçən uyğun, sertifikatlaşdırılmış hardware tələb olunur. Real
elektrik xəttinə qoşulma təhlükəlidir — quraşdırma yalnız ixtisaslı
elektrikçi tərəfindən, təhlükəsizlik standartlarına uyğun aparılmalıdır.

### AI sistemi

`components/dashboard/AIAssistant.tsx` daxilindəki `buildInsights()`
funksiyası son ölçmələr üzərində sadə statistika aparıb Azərbaycan dilində
izahlar yaradır (məs. "Son 7 gündə sərfiyyatınız artıb"). Bu, real bir AI
API-ya müraciət etmir — demo/qayda-əsaslı analizdir.

Gələcəkdə `AI_PROVIDER_API_KEY` təyin edilərək bu funksiya bir LLM API-sına
(OpenAI və ya digər) qoşula bilər — komponent kontraktı (readings daxil,
mətn insight-lar xaric) dəyişməyəcək.

### Database strukturu

Hazırda verilənlər bazası qoşulmayıb, `data/` qovluğunda demo data
istifadə olunur. Gələcək backend üçün nəzərdə tutulan struktur:

| Cədvəl | Sahələr |
|---|---|
| **User** | userId, name, email |
| **Home** | homeId, userId, name, address |
| **Device** | deviceId, homeId, status |
| **EnergyMeasurement** | deviceId, timestamp, voltage, current, power, energy, leakage |
| **Alert** | alertId, homeId, type, value, severity, timestamp, status |

Bu struktur `types/energy.ts` və `types/home.ts` daxilindəki TypeScript
interfeyslərinə uyğundur.

## 3. Environment variables

`.env.example` faylını `.env.local` adına köçürün:

```bash
cp .env.example .env.local
```

| Dəyişən | Təsvir |
|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `simulator` (default) və ya `api` |
| `NEXT_PUBLIC_API_BASE_URL` | Real backend ünvanı (Faza 2+) |
| `DEVICE_AUTH_SECRET` | ESP32 cihazlarının autentifikasiyası üçün server-side sirr |
| `DATABASE_URL` | Backend-in verilənlər bazası bağlantısı |
| `AI_PROVIDER_API_KEY` | Real AI provayderi üçün (opsional) |
| `AUTH_SECRET` | Real authentication üçün (Faza 2+) |

Demo rejimdə heç bir dəyişən **məcburi deyil** — layihə boş `.env.local`
ilə də tam işləyir.

## 4. Local development

```bash
npm install
npm run dev
```

Sonra brauzerdə [http://localhost:3000](http://localhost:3000) açın.

Login/Register səhifələrində demo authentication istifadə olunur — istənilən
email/şifrə qəbul edilir, session brauzerin `localStorage`-ında saxlanılır.

## 5. Vercel deployment

1. Layihəni GitHub-a push edin.
2. [vercel.com](https://vercel.com) üzərində "New Project" ilə repo-nu
   import edin.
3. Framework avtomatik "Next.js" kimi aşkarlanacaq — əlavə konfiqurasiya
   lazım deyil.
4. İstəyə görə Environment Variables bölməsində `.env.example`-dəki
   dəyişənləri əlavə edin.
5. Deploy düyməsini basın.

## 6. Fayl strukturu

```
app/                     — Next.js App Router səhifələri
  page.tsx                 — Landing page
  login/, register/        — Autentifikasiya səhifələri
  dashboard/                — Qorunan (auth-guard) bölmə
    layout.tsx                — Sidebar + mobil naviqasiya + HomeProvider
    page.tsx                   — Əsas dashboard
    devices/, notifications/, settings/

components/
  landing/                 — Hero, Features, ArchitectureDiagram, Nav, Footer
  dashboard/                — VoltageCard, CurrentCard, PowerCard, EnergyCard,
                               CostCard, LeakageCard, SystemStatusCard,
                               EnergyChart, AlertPanel, HomeSelector,
                               DeviceStatus, AIAssistant, Sidebar, MobileNav,
                               DemoModeBanner, StatCard (paylaşılan primitiv)

services/
  energy-api.ts             — Simulator ↔ real API abstraksiya qatı
  auth-api.ts                — Demo authentication

lib/
  simulator.ts               — Realistik məlumat generatoru
  utils.ts                    — Formatlama və hesablama funksiyaları

types/                    — EnergyReading, Home, Device, Alert, User və s.
config/                   — tariff.ts, thresholds.ts (kodun içinə hardcode edilməyib)
hooks/                    — useEnergyData, useAlerts, HomeProvider (context)
data/                     — Demo evlər və cihazlar
```

## 7. Gələcək inkişaf planı

| Mərhələ | Təsvir |
|---|---|
| 1 | Web Platform + Simulator *(bu versiya)* |
| 2 | Real API + verilənlər bazası inteqrasiyası |
| 3 | ESP32 + real enerji sensoru (PZEM-004T / ATM90E32) |
| 4 | 1 real ev üzərində pilot istifadə |
| 5 | Çoxlu ev + ödənişli SaaS xidməti |

---

**Qeyd:** Bu README həm istifadəçi, həm də gələcək inkişaf edən proqramçı
üçün yazılıb. Kodun heç bir yerində yarımçıq və ya pseudo-code hissə yoxdur;
bütün funksiyalar tam işlək şəkildə yazılıb.
