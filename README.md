# Real Time Weather Application

Proje geliştirme süreci, ilk olarak ‘**OpenWeatherMap’** üzerinden gerçek zamanlı olarak verilerin çekilmesi ile başladı.

- ## Fetch Weather Data from ‘OpenWeatherMap’

Bu noktada önce kullanıcının ‘**latitude’** ve ‘**longitude’** verilerine ‘**ipinfo.io**’ aracılığı ile erişim sağlandı. İlgili ‘end-point’e bir istek yapılarak dönen ‘response’dan kullanıcın ‘lat’ ve ‘lon’ değerleri alındı.

Ardından alınan bu değerler ‘**OpenWeatherMap’e** iletildi ve sonucunda kullanıcın konumuna ait anlık hava durumu verisi elde edildi.

‘OpenWeatherMap’ dokümanından yararlanarak veriden, ‘**temperature’**, ‘**humidity’**, ‘**feels_like’**, ‘**city’**, ‘**clouds’**, ‘**location’**, ‘**wind_speed’** ve ‘**wind_direction**’ özellikleri çıkartıldı.

- ## Validate Data

Elde edilen bu veriler, ‘**InfluxDB’** ye yazılmadan önce ‘**pydantic’** kullanarak verilen aralıkara göre kontrol edildi ve bu sınırlar özelinde aykırı değer olma ihitmaline karşı uyarı verecek şekilde kurgulandı.

- ## Write Data to InfluxDB

Elde verilerin ‘**InfluxDB’ye** yazılmadan önce ilgili kurumlar yapıldı. Bu noktada ‘**InfluxDB’** dokümanından ve çeşitli kaynaklardan yararlanıldı.

İlk olarak bir ‘**InfluxDB’** hesabı ve ‘**API’** anahtarları oluşturuldu. Ardından ‘**InfluxDB CLI**’ indirildi ve gerekli giriş ve doğrulama işlemleri yapıldı.

Bu işlemlerden sonra ‘**local’de** çalışan bir ‘**InfluxDB’** clientı ortaya çıktı. Artık veriler ‘**local’e** yazılabilir ve okunabilir hale geldi.

‘:8086’ portunda çalışan bu client’a, ‘**OpenWeatherMap’den** alınan veriler, veri noktasının hangi özelliği ‘**tag’** olarak, hangileri ‘**field’** olarak kayıt edileceği dikkate alınarak ‘**InfluxDB’ye** kayıt edildi.

Bu sayede ‘**OpenWeatherMap’den** alınan bir veri, ‘**InfluxDB’ye** kayıt edilebilir hale geldi.

- ## Automation and Monitoring

Önceki adımlar sonucunda, ‘**OpenWeatherMap’den** alınan ve yalnızca bir ‘t’ anına ait veri başarılı bir şekilde ‘**InfluxDB’** ye kayıt edilmişti.

Sırada bu işlemin otomatize edilmesi ve verilen aralıkarla sürekli olarak çalışıp, devamlı bir şekilde ‘**OpenWeatherMap’den** ‘**InfluxDB’ye** veri akışının sağlanmasında.

İlgili, veriyi çekme, çekilen verinin doğrulanması ve hedefe yazılması işlemlerini otomatize etmek için ‘**Advanced Python Scheduler**’ kullanıldı.

‘**apscheduler’,** bir iş kuyruğu mantığı yapısıyla çalışan ve bu kuyruğa, belirlenen aralıklarla ilgili işi ekleyip, bu işi çalıştıran bir yapıya sahip.

Tüm bu işlemlerin ‘**apscheduler’a** ile otomatize edilmesi şu sırayla gerçekleşmektedir;

- - ‘**ipinfo.io**’dan kullanıcının ‘lat’ ve ‘lon’ değerlerinin alınması,
    - Bu değerleri kullanarak ‘**OpenWeatherMap’den** hava durumunun çekilmesi,
    - Çekilen ‘t’ anına ait hava durumu verisinin ‘**pydantic**‘ ile doğrulanması,
    - Ve son olarak doğrulanan bu veri noktasının ‘**InfluxDB’ye** kaydedilmesi.

Bu noktada, ‘t’ anına ait hava durumu verisi ‘**1 dakika**’ aralıklarla ‘**OpenWeatherMap’den** alınıyor, ‘**pydantic**’ tarafından doğrulanıyor ve ‘**InfluxDB’ye** yazılıyor.

- ## Machine Learning Operations

**Önemli Not:** Çalışmanın bu kısmında ‘**InfluxDB**’ye yazılan 2 günlük ve ‘**Konya**’ iline ait, 1 dakika aralıklarla tutulmuş veriler kullanılmıştır.

Bu sebepten dolayı ilgili çalışmaların başarı sonuçlarının yetersiz olduğunun farkında olup, sonuçlardan ziyade izlenen yol ve kullanılan araçlara odaklanılmıştır.

Tüm **‘Machine Learning, Exploratory Data Analysis ve Visualization’** işlemleri ‘**ML_ops.ipynb’** dosyası içerisinde bulunmaktadır.

- ## User Interface

‘**InfluxDB**’ye yazılan, temizlenmiş ve doğrulanmış veriyi bir web sitesinde göstermek için ‘**React’** kullanıldı.

İlk olarak ‘**InfluxDB**’deki verinin bir ‘**api endpoint**’i ile dışarıdan erişilebilir hale getirilmesi gerekmekte.

Bu noktada ‘**flask’** kullanarak 2 adet ‘**endpoint**’ hazırlandı:

- @app.route('/api/latestWeather', methods=\['GET'\])
  - Bu ‘**endpoint**’, kullanıcının konumuna göre çekilen **son** kaydı sağlamakta.
- @app.route('/api/weather', methods=\['GET'\])
  - Bu ‘**endpoint’** ise, kayıt edilmiş **tüm** **veriyi** getirmekte.

Ardından bu ‘**endpoint**’lere ‘**React**’ uygulaması tarafından ‘**react interceptor**’ yöntemiyle ilgili istekler yapıldı.

Bu geliştirilen ve kullanıcının veriler hakkında çeşitli tablolar görebildiği web sitesi ‘**local**’den dışarıya açılmak istenmiştir. Fakat her ne kadar ilgili ‘**React**’ uygulaması çeşitli servislere ‘**deploy**’ edilse de, ‘**python**’ ile geliştirilen ‘**flask api**’ dışarıya açılamamıştır. Bu sebepten dolayı yalnızca localde çalışmaktadır.

Bunun da önüne geçmek adına çeşitli araştırmalar yapılmış olup, ‘**ngrok’** adlı bir servis bulunmuştur.

Bu servis, ‘**localhost**’ üzerinde çalışan ‘**React**’ uygulamamı, geçici olarak dış dünyaya açmaya yaramaktadır. Fakat bir önceki aşamada karşılaşılan ‘**flask api**’nin dışarıya açık olmamasından dolayı web sitesi dışarıya açılamamıştır.

Siteye ait kaynak kodlar ilgili ‘**GitHub**’ dosyasına eklenmiş olup, çeşitli ekran görüntüleri ektedir.

![resim](https://github.com/user-attachments/assets/5a96b225-ffb8-4633-b569-c78b2a6668fc)

**‘/weather**’ ‘**endpoint**’inden alınan tüm datanın bulunduğu grafik.


![resim](https://github.com/user-attachments/assets/a4b31612-ebfd-4354-9419-2cb2f71ee6d0)

Grafik üzerinde çeşitli filtrelemeler ve görüntüleme seçenekleri.


![resim](https://github.com/user-attachments/assets/9e168069-1f24-4031-b5b0-e2fbdb3638c3)

**‘/lastWeather** ‘**endpoint**’inden alınan ‘t’ anına ait veri.


![resim](https://github.com/user-attachments/assets/7edbc7ab-5758-42d1-bdc7-c337a8d255cf)

**‘/weather**’ ‘**endpoint**’inden alınan veririn seçilen ‘**feature**’ özelinde dağılım grafiği.


![resim](https://github.com/user-attachments/assets/fb70b519-149d-43c4-85a6-f7c15af07c25)

**‘/weather**’ ‘**endpoint**’inden alınan veririn seçilen ‘**feature**’ özelinde dağılım grafiği.


# SONUÇ

Bu proje, gerçek zamanlı hava durumu verilerini toplama, doğrulama, depolama ve görselleştirme süreçlerini baştan sona deneyimleme fırsatı sundu. İlk etapta, ‘**OpenWeatherMap API'**sinden hava durumu verilerini çekme sürecinden başlayarak, bu verilerin ‘**InfluxDB’** gibi bir zaman serisi veritabanına kaydedilmesi ve ardından bu verilerin kullanıcılara sunulması için gerekli otomasyon süreçlerini inşa ettim.

Bu projeyi geliştirirken, aşağıdaki kazanımları elde ettim ve bu süreçleri başarıyla hayata geçirdim:

- **Veri Entegrasyonu**: Gerçek zamanlı verilerin, ‘**OpenWeatherMap API'**sinden çekilmesi ve kullanıcının ‘**latitude**’ ve ‘**longitude**’ verileri üzerinden doğrulanması sürecini başarıyla gerçekleştirdim.
- **Veri Doğrulama**: ‘**Pydantic**‘ kütüphanesini kullanarak verilerin doğrulama sürecini uyguladım. Bu sayede, aykırı değerlerin tespit edilmesi ve temiz veri akışı sağlanmış oldu.
- **Veri Depolama**: ‘**InfluxDB**‘ ile tanışarak, verilerin zaman serisi olarak depolanmasını sağladım. ‘**InfluxDB**’ üzerinde gerekli yapılandırmaları gerçekleştirip, verileri başarılı bir şekilde kaydetmeyi başardım.
- **Otomasyon ve İzleme**: ‘**APScheduler**‘ ile veri çekme ve kaydetme işlemlerini otomatize ettim. Bu sayede, belirli aralıklarla otomatik olarak veri çekme, doğrulama ve kaydetme işlemleri gerçekleştirildi.
- **Makine Öğrenmesi**: Projenin ilerleyen aşamalarında, veriler üzerinde makine öğrenmesi operasyonları gerçekleştirdim. Kısa bir sürede ‘**InfluxDB‘** üzerinde depolanan verileri analiz ederek, çeşitli öngörü ve modelleme süreçlerine dahil ettim.
- **Kullanıcı Arayüzü Geliştirme**: ‘**React**’ ve ‘**Flask**‘ kullanarak, kullanıcıların bu verileri kolayca görüntüleyebileceği bir arayüz geliştirdim. Web arayüzünde verilerin filtrelenmesi, görselleştirilmesi ve çeşitli dağılım grafikleri sunulmasını sağladım.

Bu projenin, kısa bir süre içinde farklı teknolojilere adapte olma ve bu teknolojileri entegre ederek işleyen bir sistem kurma yeteneğimi gösterdiğini düşünmekteyim.

Verinin toplanmasından, doğrulanmasına, saklanmasına ve son kullanıcıya sunulmasına kadar geçen süreci başarılı bir şekilde yönettim. Özellikle, bu süreçte karşılaştığım sorunları çözme ve yeni araçları hızlıca öğrenme konusunda önemli bir deneyim kazandım.
