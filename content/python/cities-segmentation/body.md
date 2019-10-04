---
layout: layouts/post
date: 2019-10-03 21:42:13
---

![Сегментовані міста Європи](/assets/img/segmentation-title.png)

Інколи розділити якусь територію на набір зон може бути корисно. Для прикладу сегментувати знімки з супутника. В подальшому можна використати ці дані для навчання нейронних мереж, що буде автоматично класифікувати територію на основі нових знімків, або ж знімків територій, що мають недостатнє охоплення векторними даними. (В цьому блозі вже робився огляд підходу по класифікації територій).

## Що нам потрібно для цього?

Якщо коротко то Python (Cython), Shapely, OSM/Overpass та Aspectum щоб робити візуалізацію. А тепер по кожному пункту:

- **Python** - насправді можна спробувати і на іншій мові зробити аналогічне (наприклад використавши JavaScript та Turf.js), та в деяких місцях на Python є можливість щось оптимізувати без особливих зусиль. Наприклад використати Cython для компіляції коду написаного на python в нативне розширення.

- **Shapely** - потрібен для операцій з геометрією.

- **Geopandas** - потрібен для роботи з датасетами shape-файлів.

- **OSM (OpenStreetMap)** - відкритий ресурс, де і буде взято всю необхідну геометрію.

- **Overpass** - API щоб завантажувати, фільтрувати чи трансформувати дані з OSM.

- **osm2geojson** - бібліотека для конвертації даних OSM (та Overpass) в геометрію.

- **Land polygons** - датасет берегової лінії http://openstreetmapdata.com/data/land-polygons

- **Aspectum** - сервіс для візуалізації та аналізу картографічної інформації. Можна скористатись і geojson.io, але при великій кількості геометрію можуть виникати проблеми з продуктивністю. Часто можна замінити інтерфейсом QGIS. Сторінка сервісу https://aspectum.com

## Що конкретно ми хочемо отримати?

GeoJson файл, в якому містяться набір полігонів певних зон (класифікованих за набором правил). Зони мають бути виділені на основі сітки доріг, залізничних шляхів, водних об'єктів. Прокласифікувати ці зони можна використавши метадані з OSM (теги які позначають тип будівлі, земельної ділянки і тд).

## Який алгоритм виконання такого завдання?

- Завантажуємо геометрію coastline (це необхідно для правильної побудови зон міст які знаходяться біля океану).

- Завантажуємо межу міста з OSM і формуємо з неї полігон (або мультиполігон в загальному випадку).

- Завантажуємо дороги, залізничні шляхи, водні об'єкти і формуємо з них відповідну геометрію (навколо ліній будуємо буфери, полігони залишаємо у вигляді полігонів).

- Завантаження іншої геометрії з OSM, яка необхідна для подальшої класифікації (це теж полігони).

- Проектуємо всю геометрію в прямокутну систему координат аби позбутись спотворень при виконанні геометричних операцій.

- Формуємо мультиполігон вирахуваної об'єднаної зони доріг.

- Аналогічно формуємо мультиполігон водних об'єктів.

- Від межі міста віднімаємо сформовані мультиполігони доріг та водних об'єктів, що в результаті дасть мультиполігон нерозмічених зон.

- Класифікуємо кожну зону за певним набором правил, наприклад знаходячи суму пересічень з іншими об'єктами на карті (будинками, полями і тд).

- Проектуємо назад у полярну систему координат.

- Зберігаємо результати.

На цьому алгоритм можна було б і завершити, але через візуальну засміченість результатів такого "простого" алгоритму, появилась необхідність провести додаткові трансформації геометрії.

![Залізнична розв'язка у місті Київ](/assets/img/not-merged.png)

Тому перед відніманням зони доріг від межі міста можна додати пункт:

- Об'єднання паралельних та близько розміщених доріг.

А перед пунктом класифікації додамо ще один пункт:

- Згладження форми отриманих нерозмічених зон.
  Варто відмітити, що в деяких місцях порядок не обов'язковий і є можливість асинхронно виконувати якісь завдання (наприклад завантаження інформації, або робота з кожним класом геометрії).

Тепер можна детальніше привести приклади коду для кожного пункту.

## Завантаження даних з OSM

Не зміг знайти хорошої бібліотеки аби відпарсити дані OSM (якщо я погано шукав, то поділіться такою бібліотекою в коментарях), тому щоб сформувати з набору XML даних якусь геометрію я написав (і опублікував на github https://github.com/eos-vision/osm2geojson) бібліотеку, яка б перетворила OSM/Overpass XML в геометрію. Доречі, для роботи з Overpass JSON там теж є функції.

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
  data = cached_overpass_call(f"""
    way[highway~"^motorway$|^trunk$|^primary$|^secondary$|^tertiary$|^residential$"]{bb};
    out geom;
  """)
  return xml2geojson(data)['features']
```

Водні об’єкти я завантажую досить великим запитом, адже там зустрічається як лінійна геометрія так і полігональна.

```python
def get_water_zones(minlat, minlon, maxlat, maxlon):
  bb = f"({minlat}, {minlon}, {maxlat}, {maxlon})"
  data = cached_overpass_call(f"""
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

Інформацію про берегову лінію можна завантажити вручну (адже це один датасет для всієї планети), але корисно мати для цього код, який завантажує та кешує цей датасет, адже він може змінюватись. Після завантаження датасету, його потрібно розархівувати та отримати геометрію:

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

## Формування початкової геометрії

Як було сказано раніше робота з лінійною та полігональною геометріями відрізняється - адже полігони займають певну площу, а от для лінійної геометрію цю площу потрібно якось побудувати - перетворити лінію на полігон певного розміру, який би відповідав розмірам реального об’єкту. Аби зробити це перетворення можна використати операцію буферизації - грубо кажучи це розширення лінії. В документації Shapely більше деталей по роботі цього методу https://shapely.readthedocs.io/en/stable/manual.html#object.buffer. З підбором розміру цього буферу теж все доволі просто - для різних видів доріг в OSM є свої теги і детальний опис як їх потрібно використовувати, наприклад для доріг в Україні можна скористатись класифікацією з [вікі OSM](https://wiki.openstreetmap.org/wiki/Uk:%D0%92%D1%96%D0%BA%D1%96%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0/%D0%9A%D0%BB%D0%B0%D1%81%D0%B8%D1%84%D1%96%D0%BA%D0%B0%D1%86%D1%96%D1%8F_%D0%B4%D0%BE%D1%80%D1%96%D0%B3) (для інших країн теж існують подібні класифікації). А самі значення розміру дорожньої смуги можна знайти в державних стандартах (для більшості країн значення часто однакові).

Для побудови буферів слугує функція build_buffer_on_lines, яка виконує побудову квадратного буферу. Цей вид буферу найкраще підходить для нашого випадку (по якості результату та кількості обчислень).

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

На жаль, процес класифікації геометрії OSM не вдасться повністю помістити в цю статтю (бо насправді це можна виділити в окрему величезну статтю), але в кількох словах завантаження всієї геометрії з OSM та розбиття за певними правилами на цільовий набір класів.

```python
def get_all_geometry(minlat, minlon, maxlat, maxlon):
  query = f"(node({minlat}, {minlon}, {maxlat}, {maxlon});<;); out geom;"""
  data = cached_overpass_call(query)

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

В результаті цих операцій ми отримуємо початкові набори геометрії (на прикладі міста Київ):

- межа міста (border)

![Межа міста Київ](/assets/img/border.png)

- мультиполігон звичайних дорожніх шляхів (roads)

![Дороги міста Київ](/assets/img/roads-kiev.png)

- мультиполігон залізничних шляхів (railways)

![Залізничні шляхи міста Київ](/assets/img/railways-kiev.png)

- мультиполігон водних об’єктів (water_zones)

![Водні об'єкти міста Київ](/assets/img/water-kiev.png)

- вся інша геометрія по якій буде проводитись класифікація, згрупована за цільовим набором класів (all_geometry_by_class)

![Класифікована геометрія міста Київ](/assets/img/classified-geom.png)

## “Простий” алгоритм

Для того щоб побудувати звичайну карту потрібно на межу міста накласти всю іншу геометрію з урахуванням пріоритетів. Визначення пріоритетності кожного класу не зовсім очевидне завдання, наприклад водні об’єкти мають найнижчий пріоритет, бо зазвичай дорожні та залізничні шляхи проходять над річками і тд. А от з дорогами та залізницею все трохи складніше, бо дорожні мости можуть проходити над залізничними шляхами, так і навпаки - залізничні мости над дорожніми шляхами. Але все ж краще виявилось надавати дорогам вищий пріоритет (кількість правильно розміченої території буде більша). Є і більш складна схема розподілу отриманої геометрії на шари, яка описана тут https://wiki.openstreetmap.org/wiki/Key:layer . Мінусом цього підходу у нашому випадку - значний ріст кількості обчислень.

![Результат накладання шарів](/assets/img/layers.png)

Одним з важливих етапів в обрахунка є етап оптимізації геометрії. Необхідність цього виникає по причині надзвичайно великих полігонів доріг та водних об’єктів (інколи сітка доріг покриває ледь не все місто і формує один полігон). А для швидкодії операцій пересічення та віднімання полігонів - використання такої геометрії призводить до неконтрольованого росту складності обчислень (на великих містах це може займати кілька діб). Щоб позбутись цієї проблеми можна просто розбивати великі полігони на менші. Вивчаючи цю тему я натрапив на корисну статтю, де теж вирішувалась ця проблема (https://snorfalorpagus.net/blog/2016/03/13/splitting-large-polygons-for-faster-intersections/). Саме цей алгоритм розбиття я і використав.

Ще одна важлива частина оптимізації це побудова індексу над наборами полігонів (детальніше про це можна почитати в цій статті https://geoffboeing.com/2016/10/r-tree-spatial-index-python/). В бібліотеці Shapely вже вбудований хороший алгоритм для індексації геометрії STRtree (Sort-Tile-Recursive (STR) algorithm). Код для обчислення пересічення та різниці полігонів трохи ускладниться (бо потрібно додати етап індексації та пошуку полігонів у індексі), але можна запросто виділити ці операції в окремі методи

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

В результаті ми отримали набір полігонів (в GeoJSON). Але кінцева ціль - отримати класифіковані зони міста, тому полігони які ще не мають класу потрібно якось класифікувати (зони доріг, залізниці та водних об’єктів ми вже отримали на попередніх етапах).

Для прикладу можна прокласифікувати ці зони порахувавши площу пересічення з іншими полігонами OSM (які ми до цього автоматично розмітили цільовим набором класів).

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

Цікавою частиною тут є функція polygon_fix, яка часто допомагає впоратись з невалідною геометрією (на жаль, я вже й не пам’ятаю де знайшов код цієї функції).

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

Роздивитись згенеровану геометрію можна використавши веб-платформу Aspectum:

<iframe class="lazyload" data-src="https://aspectum.com/app/maps/embed/dbcc98bb-6bd2-49ee-92d0-26d03297a33b" width="960" height="600" frameborder="0" style="border: 0"></iframe>

## Алгоритм з об’єднанням доріг

Цей алгоритм майже не відрізняється від попереднього, відмінний лише етап утворення мультиполігонів доріг (звичайних та залізничних). Аби цього досягнути можна замість звичайної побудови буферів робити буфер більшого розміру, а потім операцією віднімання буферу отримувати буфери потрібного розміру, при цьому дороги які були поряд стануть об’єднаними.

![Візуалізація алгоритму об'єднання доріг](/assets/img/merge-vis.gif)

Код який це робить

```python
def merge_roads(polygon):
  area = polygon.buffer(merge_buffer_size, cap_style=2, join_style=2, mitre_limit=1)
  return area.buffer(-merge_buffer_size, cap_style=2, join_style=2, mitre_limit=1)
```

Різницю в геометрії, що генерується, можна побачити на зображенні.

![Порівняння простої геометрії та після об'єднання](/assets/img/kiev-compare-geom.png)

А повне зображення для міста Київ:

![Зони міста Київ з об'єднаними дорогами](/assets/img/kiev-merged.png)

Переглянути для всіх міст можна тут:

<iframe class="lazyload" data-src="https://aspectum.com/app/maps/embed/2351cf7d-e975-4a5d-b10a-b6c2776474da" width="960" height="600" frameborder="0" style="border: 0"></iframe>

## Алгоритм зі згладжуванням зон

Деколи високе “засмічення” карти дорогами є небажаним результатом (наприклад візуально це погано сприймається). Для цього знову можна використати операцію з додаванням та відніманням буферу - для кожної зони ми спершу додаємо буфер, а потім віднімаємо. Але через важливість збереження основних ліній доріг (потрібно видалити лише сліпі дороги) алгоритм дещо ускладниться

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

Як помітно з коду, з'явилась нова функція - make_smooth_zones. Саме вона і займається побудовою буферів і виправленням згенерованої геометрії (інколи зони накладаються одна на одну - і потрібно робити додаткове віднімання між полігонами зон аби утворити правильний мультиполігон)

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
```

Результат згладжування

![Згладжені зони міста Київ](/assets/img/kiev.png)

Роздивитись можна тут:

<iframe class="lazyload" data-src="https://aspectum.com/app/maps/embed/10da881d-136c-4c53-b83c-b22815a09ba7" width="960" height="600" frameborder="0" style="border: 0"></iframe>

## Оптимізація виконання алгоритму

Так як цей алгоритм виконує розмітку для міста, то логічно буде спробувати запустити його на декількох містах. А в тому щоб робити це синхронно нема ніякої необхідності - найпростіше буде просто запустити виконання для кожного міста в окремому потоці.

Також велику частину обрахованої геометрії можна кешувати та зберігати на жорсткий диск, але потрібно враховувати те, що OSM постійно змінюється і про інвалідацію цього кешу забувати не треба.

Ще одним місцем для оптимізації є інтерпретатор Python. Значна кількість обчислень в бібліотеці Shapely і так винесена в нативне розширення (основними операціями з геометрією займається бібліотека GEOS, яка написана на C++). Aле в нашому коді також є велика кількість обрахунків на стороні python. На щастя не так складно виявилось реалізувати компіляцію всього коду в нативне розширення за допомогою Cython (https://cython.org/).

## Висновки

Використання відкритих векторних даних може дати непоганий результат, але в процесі часто виникають проблеми з невалідною геометрією та нерівномірністю розмітки. В деяких задачах гостро стає проблема складності обрахунків і швидкодії. Але в цій статті я намагався показати, як з цими проблемами можна впоратись.

Товариство OSM не стоїть на місці і постійно покращує свій продукт, що в свою чергу дозволяє на такому хорошому джерелі інформації проводити купу досліджень. Різноманітність даних OSM дозволяє максимально детально класифікувати сформовані зони в межах населених пунктів, що можна розглянути як глобальний Urban Atlas.

Використання оглянутого підходу по сегментації не обмежується містами, а дозволяє формувати геометрії в будь-яких інших територіях з достатньо густою сіткою лінійної геометрії.

Розвиток ресурсу OSM забезпечує все більшу користь від використання методу, що в подальшому може повністю замінити ручну роботу для класифікації супутникових знімків.
