<style>
em { color: red }
</style>

## Реферат


## Вступ

Інколи розділити якусь територію на набір зон може бути корисно. Для прикладу сегментувати знімки з супутника.
Надалі можна використати ці дані для навчання нейронних мереж, які будуть автоматично класифікувати територію на основі нових знімків, або ж знімків територій, що мають недостатнє охоплення векторними даними.

Актуальність теми

Мета та завдання роботи

Отримати векторну розмітку певних зон (класифікованих за набором правил).
Зони мають бути виділені на основі сітки доріг, залізничних шляхів, водних об'єктів.

Об'єкт дослідження

Предметом дослідження

Наукова новизна

Практична значущість


## Розділ 1.

### Постановка задачі

Суть задачі полягає в побудові набору полігонів прокласифікованих за заданим набором правил на певні класи. При цьому необхідно досягнути розділення зон міста (полігонів) з використанням сітки доріг.

В даній роботі було використано 6 класів: _(детальніше розписати по кожному класу)_

 * Забудова
 * Агро-зона
 * Ліси
 * Дороги
 * Залізничні дороги
 * Водні території

Потрібно реалізувати алгоритм який на вході прийматиме ідентифікатиор міста (в даному випадку id міста у відкритому джерелі OSM), завантажуватиме необхідну для розграхунків геометрію, формуватиме набір класифікованих полігонів та зберігатиме даний набір в GeoJSON файл.

### Алгоритм

- Завантажуємо геометрію coastline (це необхідно для правильної побудови зон міст які знаходяться біля океану).

- Завантажуємо межу міста з OSM і формуємо з неї полігон (або мультиполігон в загальному випадку).

- Завантажуємо дороги, залізничні шляхи, водні об'єкти і формуємо з них відповідну геометрію (навколо ліній будуємо буфери, полігони залишаємо у вигляді полігонів).

- Завантаження іншої геометрії з OSM, яка необхідна для подальшої класифікації (це теж полігони).

- Проектуємо всю геометрію в прямокутну систему координат аби позбутись спотворень при виконанні геометричних операцій.

- Формуємо мультиполігон вирахуваної об'єднаної зони доріг.

- Аналогічно формуємо мультиполігон водних об'єктів.

- Від межі міста віднімаємо сформовані мультиполігони доріг та водних об'єктів, що в результаті дасть мультиполігон нерозмічених зон.

- Класифікуємо кожну зону за певним набором правил, наприклад знаходячи суму пересічень з іншими об'єктами на карті (будинками, полями і т.д.).

- Проектуємо назад у полярну систему координат.

- Зберігаємо результати.

На цьому алгоритм можна було б і завершити, але через візуальну засміченість результатів такого "простого" алгоритму, появилась необхідність провести додаткові трансформації геометрії.

![Залізнична розв'язка у місті Київ](/assets/img/not-merged.png)

Тому перед відніманням зони доріг від межі міста можна додати пункт:

- Об'єднання паралельних та близько розміщених доріг.

А перед пунктом класифікації додамо ще один пункт:

- Згладження форми отриманих нерозмічених зон.

Варто зазначити, що в деяких місцях порядок не обов'язковий і є можливість асинхронно виконувати якісь завдання (наприклад завантаження інформації, або робота з кожним класом геометрії).


### Технології

Для реалізації алгоритму було використано наступний набір технологій та ресурсів:

- **Python (Cython)** — насправді можна реалізувати аналогічний алгоритм і іншою мовою програмування (наприклад використавши JavaScript та Turf.js), та в деяких місцях на Python є можливість щось оптимізувати без особливих зусиль. Наприклад, використати Cython для компіляції коду написаного на Python в нативне розширення.

- **Shapely** — бібліотека в Python, яка надає функції для операцій з геометрією.

- **Geopandas** — потрібен для роботи з датасетами shape-файлів.

- **OSM (OpenStreetMap)** — відкритий ресурс, де і буде взято всю необхідну геометрію.

- **Overpass** — API щоб завантажувати, фільтрувати чи трансформувати дані з OSM.

- **Osm2geojson** — бібліотека для конвертації даних OSM (та Overpass) в геометрію.

- **Land polygons** — датасет берегової лінії [https://osmdata.openstreetmap.de/data/land-polygons.html](https://osmdata.openstreetmap.de/data/land-polygons.html)

- **QGIS** — графічний інтерфейс для візуалізації та роботи з просторовими даними.


## Розділ 2. Реалізація

Етапи реалізації алгоритму можна умовно розділити на:

 * Завантаження необхідної інформації
 * Формування шаршів геометрії
 * Реалізація "простого" алгоритму
 * Реалізація алгоритму з об'єднанням доріг
 * Реалізація алгоритму зі згладжуванням некласифікованих зон
 * Оптимізація виконання алгоритму

Налагодження та виправлення помилок не можна виділити як окремий етап, так як цей процес необхідно виконувати на кожному етапі.

### Завантаження даних з OSM

Щоб сформувати необхідну геометрію з відкритих даних OSM було реалізовано (та опубліковано в відкритий доступ) бібліотеку [osm2geojson](https://github.com/aspectumapp/osm2geojson), яка перетворює OSM/Overpass XML в геометрію Shapely або GeoJSON.
Звичайно, можна скористатись бібліотекою GDAL, але процес встановлення занадто складний і через особливості роботи бібліотеки GDAL з файловою системою її використання значно знижує швидкість роботи алгоритму.

Отож отримати межу міста можна простим запитом до API Overpass:

```python
def get_city_border(city_id):
  data = overpass_call(f"""
    rel({city_id});
    out geom;
  """) # returns xml-string
  data = xml2geojson(data)

  for f in data['features']:
    if f['properties']['tags']['type'] == 'boundary':
      return f
  return None
```

Для отримання набору доріг запит уже складніший:

```python
def get_roads(minlat, minlon, maxlat, maxlon):
  bb = f"({minlat}, {minlon}, {maxlat}, {maxlon})"
  data = overpass_call(f"""
    way[highway~"^motorway$|^trunk$|^primary$|^secondary$|^tertiary$|^residential$"]{bb};
    out geom;
  """)
  return xml2geojson(data)['features']
```

Водні об’єкти я завантажую досить великим запитом, адже там зустрічається як лінійна геометрія так і полігональна.

```python
def get_water_zones(minlat, minlon, maxlat, maxlon):
  bb = f"({minlat}, {minlon}, {maxlat}, {maxlon})"
  data = overpass_call(f"""
    (
      way[waterway~"^river$|^stream$|^riverbank$"]{bb};
      way[landuse=basin]{bb};
      way[natural=water]{bb};
      way[water]{bb};
      rel[landuse=basin]{bb};
      rel[natural=water]{bb};
      rel[water]{bb};
      rel[waterway=riverbank]{bb};
      <;
    );
    out geom;
  """)
  return xml2geojson(data)['features']
```

Інформацію про берегову лінію можна завантажити вручну (адже це один датасет для всієї планети), але корисно мати для цього код, який завантажує та кешує цей датасет, адже він може змінюватись.
Після завантаження датасету, його потрібно розархівувати та отримати геометрію:

```python
def get_coastline():
  print('Loading coastline to memory ...')
  coastline_zip = get_coastline_file() # returns abs path to zip file with dataset
  coastline_dir = coastline_zip.replace('.zip', '')
  coastline_file = os.path.join(coastline_dir, 'land_polygons.shp')

  if not os.path.exists(coastline_file):
    r = zipfile.ZipFile(coastline_zip, 'r')
    r.extractall(config.CACHE_DIR)
    r.close()

  data = geopandas.read_file(coastline_file)
  print('Coastline loaded!')
  return data
```

### Формування початкової геометрії

Як було сказано раніше, робота з лінійною та полігональною геометріями відрізняється — адже полігони займають певну площу, а от для лінійної геометрію цю площу потрібно якось побудувати — перетворити лінію на полігон певного розміру, який би відповідав розмірам реального об’єкту.
Аби зробити це перетворення можна використати операцію буферизації — грубо кажучи це розширення лінії.
В документації Shapely більше деталей по роботі цього методу [shapely/object.buffer](https://shapely.readthedocs.io/en/stable/manual.html#object.buffer).

З підбором розміру цього буферу теж все доволі просто — для різних видів доріг в OSM є свої теги і детальний опис як їх потрібно використовувати, наприклад, для доріг в Україні можна скористатись класифікацією з [вікі OSM](https://wiki.openstreetmap.org/wiki/Uk:%D0%92%D1%96%D0%BA%D1%96%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0/%D0%9A%D0%BB%D0%B0%D1%81%D0%B8%D1%84%D1%96%D0%BA%D0%B0%D1%86%D1%96%D1%8F_%D0%B4%D0%BE%D1%80%D1%96%D0%B3) (для інших країн теж існують подібні класифікації).
А самі значення розміру дорожньої смуги можна знайти в державних стандартах (для більшості країн значення часто однакові).

Для побудови буферів слугує функція build_buffer_on_lines, яка виконує побудову квадратного буфера.
Цей вид буферу найкраще підходить для нашого випадку (по якості результату та кількості обчислень).

```python
def build_buffer_on_lines(lines, b_size):
  buffers = []
  for line in lines:
    b = line.buffer(b_size, cap_style=3, join_style=2, mitre_limit=1)
    buffers.append(b)
  return array_to_multipolygon(buffers)
```

Приклад перетворення geojson в геометрію shapely найкраще проілюстровано в формуванні зон водної території:

```python
def convert_water_features_to_zones(geoms):
  water_zones = []
  lines = []
  for item in geoms:
    shape = geometry.shape(item['geometry'])
    if isinstance(shape, geometry.LineString) or isinstance(shape, geometry.MultiLineString):
      lines.append(shape)
    if isinstance(shape, geometry.Polygon) or isinstance(shape, geometry.MultiPolygon):
      water_zones.append(shape)

  rivers = build_buffer_on_lines(lines, buffer_sizes['river'])
  water_zones.append(rivers)
  return ops.cascaded_union(water_zones)
```

Геометрію по якій буде проводитись класифікації зон міста можна завантажити зробивши схожий запит, але уже без фільтрації за властивостями об'єктів.

```python
def get_all_geometry(minlat, minlon, maxlat, maxlon):
  query = f"(node({minlat}, {minlon}, {maxlat}, {maxlon});<;); out geom;"""
  data = overpass_call(query)

  features = []
  for item in xml2geojson(data)['features']:
    if item['geometry']['type'] in ['Polygon', 'MultiPolygon']:
      cls = detect_class(item) # here some magic
    if cls is None:
      continue
    item['properties']['class'] = cls
    features.append(item)
  return features
```

В цьому коді було використано метод `detect_class`, деталі реалізації якого буде описано в наступному пункті.

В результаті цих операцій ми отримуємо початкові набори геометрії (на прикладі міста Київ):

- межа міста (border)

![Межа міста Київ](/assets/img/border.png)

- мультиполігон звичайних дорожніх шляхів (roads)

![Дороги міста Київ](/assets/img/roads-kiev.png)

- мультиполігон залізничних шляхів (railways)

![Залізничні шляхи міста Київ](/assets/img/railways-kiev.png)

- мультиполігон водних об’єктів (water_zones)

![Водні об'єкти міста Київ](/assets/img/water-kiev.png)

- вся інша геометрія, по якій буде проводитись класифікація, згрупована за цільовим набором класів (all_geometry_by_class)

![Класифікована геометрія міста Київ](/assets/img/classified-geom.png)


### “Простий” алгоритм

Для того щоб побудувати звичайну карту потрібно на межу міста накласти всю іншу геометрію з урахуванням пріоритетів.
Визначення пріоритетності кожного класу не зовсім очевидне завдання, наприклад водні об’єкти мають найнижчий пріоритет, бо зазвичай дорожні та залізничні шляхи проходять над річками і т.д..

А от з дорогами та залізницею все трохи складніше, бо дорожні мости можуть проходити над залізничними шляхами, так і навпаки — залізничні мости над дорожніми шляхами.
Але все ж краще виявилось надавати дорогам вищий пріоритет (кількість правильно розміченої території буде більша).
Є і більш складна схема розподілу отриманої геометрії на шари, яка описана тут [wiki.osm/Key:layer](https://wiki.openstreetmap.org/wiki/Key:layer).
Мінусом цього підходу у нашому випадку — значний ріст кількості обчислень.

![Результат накладання шарів](/assets/img/layers.png)

Одним з важливих етапів в обрахунках є етап оптимізації геометрії.
Необхідність цього виникає по причині надзвичайно великих полігонів доріг та водних об’єктів (інколи сітка доріг покриває ледь не все місто і формує один полігон).
Використання такої геометрії призводить до неконтрольованого росту складності обчислень (на великих містах це може займати кілька діб).
Щоб позбутись цієї проблеми можна просто розбивати великі полігони на менші. Вивчаючи цю тему я натрапив на корисну [статтю](https://snorfalorpagus.net/blog/2016/03/13/splitting-large-polygons-for-faster-intersections/), де теж вирішувалась ця проблема.
Саме цей алгоритм розбиття я і використав.

Ще одна важлива частина оптимізації це побудова індексу над наборами полігонів (детальніше про це можна почитати в [цій статті](https://geoffboeing.com/2016/10/r-tree-spatial-index-python/)).
В бібліотеці Shapely вже вбудований хороший алгоритм для індексації геометрії STRtree (Sort-Tile-Recursive algorithm).
Код для обчислення пересічення та різниці полігонів трохи ускладниться (бо потрібно додати етап індексації та пошуку полігонів у індексі), але досить просто виділити ці операції в окремі методи

```python
def optimized_intersection(a, b):
  a_opt = katana(a, split_size)
  b_opt = katana(b, split_size)
  a_tree = STRtree(a_opt)

  parts = []
  for zone in b_opt:
    for p in a_tree.query(zone):
      intersection =  p.intersection(zone)
      if intersection.area > 0:
        parts.append(intersection)

  return array_to_multipolygon(parts)

def optimized_difference(a, b):
  a_opt = katana(a, split_size)
  b_opt = katana(b, split_size)
  b_tree = STRtree(b_opt)

  parts = []
  for zone in a_opt:
    for p in b_tree.query(zone):
      zone = zone.difference(p)
      parts.append(zone)

  return array_to_multipolygon(parts)
```

Після цього можна безпосередньо переходити до логіки алгоритму:

```python
def compute_simple_zones(border, roads, railways, water_zones):
  roads_in_city = optimized_intersection(roads, border)
  railways_in_city = optimized_intersection(railways, border)
  water_zones_in_city = optimized_intersection(water_zones, border)

  water_zones_fixed = optimized_difference(water_zones_in_city, roads_in_city)
  water_zones_fixed = optimized_difference(water_zones_fixed, railways_in_city)

  city_zones = optimized_difference(border, roads)
  city_zones = optimized_difference(city_zones, railways)
  city_zones = optimized_difference(city_zones, water_zones)

  railways_without_roads = optimized_difference(railways_in_city, roads_in_city)

  features = multipolygon_to_features(roads_in_city, 'roads')
  features += multipolygon_to_features(water_zones_fixed, 'water')
  features += multipolygon_to_features(railways_without_roads, 'railways')
  features += multipolygon_to_features(city_zones)

  return features
```

В результаті ми отримали набір полігонів (в GeoJSON).
Але кінцева ціль — отримати класифіковані зони міста, тому полігони які ще не мають класу потрібно якось класифікувати (зони доріг, залізниці та водних об’єктів ми вже отримали на попередніх етапах).

Маючи набір некласифікованих зон можна провести їхню класифікацію вирахувавши площу пересічення з іншими полігонами OSM (які до цього було завантажено та прокласифіковано).

```python
def classify_features(features, all_geometry_by_class):
  geometry_index = {}
  for cls in all_geometry_by_class:
    geometry_index[cls] = STRtree(all_geometry_by_class[cls])

    for feature in features:
      if 'class' in f['properties']:
        continue

      shape = geometry.shape(feature['geometry'])
      if not shape.is_valid:
        print('Shape is invalid! Try to fix')
        shape = polygon_fix(shape)
        if not shape.is_valid:
          print('Not fixed :(', validation.explain_validity(shape))
          continue

      probs = {}
      for cls in geometry_index:
        probs[cls] = 0
        for s in geometry_index[cls].query(shape):
          if s.is_valid:
            probs[cls] += shape.intersection(s).area

      detected_class = 'Artificial Surfaces' # default class
      max_area = 0
      for cls in probs:
        if probs[cls] > max_area:
          max_area = probs[cls]
          detected_class = cls

      feature['properties'] = {
        'class': detected_class,
        'probabilities': normalize(probs)
      }
  return features
```

Цікавою частиною тут є функція polygon_fix, яка часто допомагає впоратись з неправильною геометрією (на жаль, я вже й не пам’ятаю де знайшов код цієї функції).

```python
def polygon_fix(polygon):
  be = polygon.exterior
  mls = be.intersection(be)
  polygons = ops.polygonize(mls)
  return geometry.MultiPolygon(polygons)
```

На цьому основна частина алгоритму закінчується, а класифіковану геометрію можна зберегти в файл аби десь візуалізувати.

Візуалізація для міста Київ з використанням QGIS

![Класифіковані зони міста Київ](/assets/img/kiev-simple.png)


### Алгоритм з об’єднанням доріг

Цей алгоритм майже не відрізняється від попереднього, відмінний лише етап утворення мультиполігонів доріг (звичайних та залізничних).
Аби цього досягнути потрібно замість звичайної побудови буферів робити буфер більшого розміру, а потім операцією віднімання буферу отримувати полігони потрібного розміру, при цьому дороги які були поряд стануть об’єднаними. Код який це робить:

```python
def merge_roads(polygon):
  area = polygon.buffer(merge_buffer_size, cap_style=2, join_style=2, mitre_limit=1)
  return area.buffer(-merge_buffer_size, cap_style=2, join_style=2, mitre_limit=1)
```

Різницю в геометрії, що генерується, можна побачити на зображенні.

![Порівняння простої геометрії та після об'єднання](/assets/img/kiev-compare-geom.png)

А повне зображення для міста Київ:

![Зони міста Київ з об'єднаними дорогами](/assets/img/kiev-merged.png)


### Алгоритм зі згладжуванням зон

Деколи високе “засмічення” карти дорогами є небажаним результатом (наприклад візуально це погано сприймається).
Для цього знову можна використати операцію з додаванням та відніманням буферу — для кожної зони ми спершу додаємо буфер, а потім віднімаємо.
Але через важливість збереження основних ліній доріг (потрібно видалити лише сліпі дороги) алгоритм дещо ускладниться

```python
def compute_smoothed_zones(border, roads, railways, water_zones):
  smooth_city_zones_by_roads = make_smooth_zones(optimized_difference(border, roads))
  other_zones_by_roads = optimized_difference(border, smooth_city_zones_by_roads)
  smoothed_roads = optimized_intersection(roads, other_zones_by_roads)
  roads_in_city = optimized_intersection(smoothed_roads, border)

  smooth_city_zones_by_railways = make_smooth_zones(optimized_difference(border, railways))
  other_zones_by_railways = optimized_difference(border, smooth_city_zones_by_railways)
  smoothed_railways = optimized_intersection(railways, other_zones_by_railways)
  railways_in_city = optimized_difference(smoothed_railways, smoothed_roads)

  water_zones_in_city = optimized_intersection(water_zones, border)
  water_zones_in_city = optimized_difference(water_zones_in_city, roads_in_city)
  water_zones_in_city = optimized_difference(water_zones_in_city, railways_in_city)

  smooth_city_zones = optimized_difference(border, smoothed_roads)
  smooth_city_zones = optimized_difference(smooth_city_zones, smoothed_railways)
  smooth_city_zones = optimized_difference(smooth_city_zones, water_zones)

  features = multipolygon_to_features(roads_in_city, 'roads')
  features += multipolygon_to_features(railways_in_city, 'railways')
  features += multipolygon_to_features(water_zones_in_city, 'water')
  features += multipolygon_to_features(smooth_city_zones)

  return features
```

Як помітно з коду, появилась нова функція — make_smooth_zones.
Саме вона і займається побудовою буферів і виправленням згенерованої геометрії (інколи зони накладаються одна на одну і потрібно робити додаткове віднімання між полігонами зон аби утворити правильний мультиполігон)

```python
def make_smooth_zones(city_zones):
  zones_polygons = []
  if isinstance(city_zones, geometry.Polygon):
    zones_polygons.append(city_zones)
  else:
    for poly in city_zones.geoms:
      zones_polygons.append(
        poly
        .buffer(merge_buffer_size, cap_style=3, join_style=2, mitre_limit=1)
        .buffer(-merge_buffer_size, cap_style=2, join_style=2, mitre_limit=1)
      )

  zonesTree = STRtree(zones_polygons)
  for idx, zone in enumerate(zones_polygons):
    found = zonesTree.query(zone)
    for z in found:
      if zone.intersects(z):
        if not z is zone and zone.intersection(z).area > 0:
          zones_polygons[idx] = zone.difference(z.buffer(0.000001, cap_style=2, join_style=2, mitre_limit=1))

  return geometry.MultiPolygon(zones_polygons)
```

Результат згладжування

![Згладжені зони міста Київ](/assets/img/kiev.png)

### Класифікація завантаженої геометрії з OSM

Вище було вже згадано, що завантажену геометрію з OSM потрібно класифікувати, аби потім була можливість вираховувати площі пересічень з утвореними некласифікованими зонами міст.

Для розуміння повної структури стандарту OSM краще скористатись документацією стандарту (в нашому випадку потрібно також ознайомитись і з особливостями формату даних Overpass), але основні пункти буде описано тут.

Кожен геометричний об'єкт OSM поряд з просторовою інформацією несе також мета-дані, а саме набір властивостей ключ:значення, які покликані відобразити господарське призначення тих чи інших об'єктів, їхні властивості та інше. Перерахувати всі ці властивості буде складно, але для прикладу вище в коді запиту на завантаження геометрії яка описує водні об'єкти можна було помітити набір фільтрів, де і були записані такі пари ключ:значення які присвоюють саме для водних об'єктів: landuse=basin, landuse=water і тд.

Основні види геометрії формату OSM це: точки, лінії та полігони. Але у випадку задачі класифікації зон доцільно використовувати саме полігональну геометрію. Для ліній та точок теж можна надати розмір (утворивши буфер), але для кожного виду таких об'єктів потрібно було б визначати цей розмір, що зайняло б дуже багато часу та зусиль, а вплив на якість результату був би мінімальним.

Аби провести класифікацію всього різноманіття завантаженої геометрії було сформовано файл конфігурації, який зберігає значення пар ключ:значення, які відповідають вже цільвому набору класів. Приклад частини цього файлу:

```json
{
  "Artificial Surfaces": [
    {
      "key": "amenity",
      "values": [
        "animal_shelter",
        "arts_centre",
        "bank",
        "bar",
        "cafe",
        ...
      ]
    },
    {
      "key": "building",
      "values": [...]
    },
    ...
  ],
  "Forests": [...],
  ...
}
```

Маючи цю конфігурацію, доволі просто знайти до якого класу відноситься об'єкт зіставивши значення властивостей об'єкту зі значеннями описаними в конфігурації.

Використання такої конфігурації дозволяє гнучко змінувати цільовий набір класів та властивості які характеризують кожен клас.

Далі приведено код для завантаження конфігурації в пам'ять та класифікації об'єкту OSM відповідно.

```python
def load_osm_classes():
    osm_classes = {}
    with open(os.path.join(config.DIR, 'osm-classes.json'), encoding='utf-8') as data:
        data = json.load(data)
        for label, items in data.items():
            if not label in osm_classes:
                osm_classes[label] = {}

            for item in items:
                if not item['key'] in osm_classes[label]:
                    osm_classes[label][item['key']] = item['values']
                else:
                    for v in item['values']:
                        osm_classes[label][item['key']].append(v)
    return osm_classes

osm_classes = load_osm_classes()

def detect_class(f):
    if 'tags' not in f['properties']:
        return None

    for key, value in f['properties']['tags'].items():
        for label, by_key in osm_classes.items():
            if key in by_key and value in by_key[key]:
                return label
    return None
```

### Оптимізація та виконання алгоритму

Оскільки цей алгоритм виконує розмітку для міста, то логічно буде спробувати запустити його для декількох міст.
А в тому щоб робити це синхронно нема ніякої необхідності — найпростіше буде просто запустити виконання для кожного міста в окремому потоці.

Приклад коду який запускає обрахунки для кількох міст паралельно:

```python
city_ids = [
    395856,
    421866,
    439840,
    ...
]
t_limit = Semaphore(multiprocessing.cpu_count())
pool = []
lock = Lock()

for id in city_ids:
    t = Thread(target=split_city, args=(id, lock, t_limit), name=f"city-{id}")
    pool.append(t)
    t.start()

for t in pool:
    t.join()
```

Тіло методу `split_city`, який і виконує всі три модифікацї алгоритму:

```python
def split_city(id, lock, t_limit):
    lock.acquire()
    try:
        border, roads, railways, water_zones = load_projected_data(id)
    except Exception as e:
        print('Data for city not loaded', id, e)
        traceback.print_exc()
        return False
    finally:
        lock.release()
    t_limit.acquire()

    zones_simple = compute_simple_zones(border, roads, railways, water_zones)
    zones_simple = project_features_to_polar(zones_simple)
    classify_and_save_items(zones_simple, id, f"data/city-{id}-simple.geojson")

    merged_roads_multipolygon = merge_roads(roads)
    merged_railways_multipolygon = merge_roads(railways)

    zones_merged = compute_merged_zones(border, merged_roads_multipolygon, merged_railways_multipolygon, water_zones)
    zones_merged = project_features_to_polar(zones_merged)
    classify_and_save_items(zones_merged, id, f"data/city-{id}-merged.geojson")

    zones_smoothed = compute_smoothed_zones(border, merged_roads_multipolygon, merged_railways_multipolygon, water_zones)
    zones_smoothed = project_features_to_polar(zones_smoothed)
    classify_and_save_items(zones_smoothed, id, f"data/city-{id}-smoothed.geojson")

    t_limit.release()
    return True
```

В результаті виконання цього коду буде утворено GeoJSON файли з класифікованими зонами для вказаних міст. Ці файли можна використовувати як датасет або візуалізувати (наприклад програмою QGIS).

Також велику частину обрахованої геометрії можна кешувати та зберігати на жорсткий диск, але потрібно враховувати те, що OSM постійно змінюється і про інвалідацію цього кешу забувати не треба.

Добре ілюструє підхід до кешування етап завантаження даних з OSM/Overpass. Вище в коді часто зустрічався метод `overpass_call`, який завантажує необхідну інформацію (згідно запиту) з Overpass:

```python
def overpass_call(query):
    encoded = urllib.parse.quote(query.encode("utf-8"), safe='~()*!.\'')
    r = requests.post(config.OVERPASS,
                      data=f"data={encoded}",
                      headers={"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"})
    if not r.status_code is 200:
        raise requests.exceptions.HTTPError('Overpass server respond with status '+str(r.status_code))
    return r.text
```

В коді доволі просто замінити виклик цього методу на версію з вбудованим механізмом кешування:

```python
def cached_overpass_call(query):
    name = os.path.join(config.CACHE_DIR, str(zlib.adler32(query.encode())) + '.osm')
    if os.path.exists(name):
        with codecs.open(name, 'r', encoding='utf8') as data:
            return data.read()
    data = overpass_call(query)
    save_file(data, name)
    return data
```

Ще одним місцем для оптимізації є інтерпретатор Python.
Значна кількість обчислень в бібліотеці Shapely і так винесена в нативне розширення (основними операціями з геометрією займається бібліотека GEOS, яка написана на C++).
Але в нашому коді також є велика кількість обрахунків на стороні python.
На щастя не так складно виявилось реалізувати компіляцію всього коду в нативне розширення за допомогою [Cython](https://cython.org/).

## Висновки

Використання відкритих векторних даних може дати непоганий результат, але в процесі часто виникають проблеми з неправильною геометрією та нерівномірністю розмітки.
В деяких задачах гостро встає проблема складності обрахунків і швидкодії.
Але в цій статті я намагався показати, як з цими проблемами можна впоратись.

Товариство OSM не стоїть на місці і постійно покращує свій продукт, що в свою чергу дозволяє на такому хорошому джерелі інформації проводити купу досліджень.
Різноманітність даних OSM дозволяє максимально детально класифікувати сформовані зони в межах населених пунктів, що можна розглянути як глобальний Urban Atlas.

Використання оглянутого підходу по сегментації не обмежується містами, а дозволяє формувати геометрії в будь-яких інших територіях з достатньо густою сіткою лінійної геометрії.

Розвиток ресурсу OSM забезпечує все більшу користь від використання методу, що надалі може повністю замінити ручну роботу для класифікації супутникових знімків.

## Список використаних джерел
