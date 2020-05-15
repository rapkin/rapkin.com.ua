---
layout: layouts/post
---

![Mercator map](/assets/img/Mercator_map.jpg)

Structure of geojson file is quite simple. To work with geojson we can use standart module in python called `json`. Often geojson files contains utf-8 symbols, so `codecs` module will be helpfull. And main module that we need for projections is `pyproj` (follow [installation guide](https://pyproj4.github.io/pyproj/stable/installation.html) or simply run command below).

```sh
pip install pyproj
```

Pyproj provides APIs to convert pair of coordinates. Projection of single point will look like:

```python
polar = pyproj.Proj(init='epsg:4326')
mercator = pyproj.Proj(init='epsg:3857')

[x, y] = [26.2513165, 50.6196175]
new_x, new_y = pyproj.transform(polar, mercator, x, y)
```

All we need to convert any geomentry in geojson is simple recursive function:

```python
def project_coords(coords, from_proj, to_proj):
    if len(coords) < 1:
        return []

    if isinstance(coords[0], numbers.Number):
        from_x, from_y = coords
        to_x, to_y = pyproj.transform(from_proj, to_proj, from_x, from_y)
        return [to_x, to_y]

    new_coords = []
    for coord in coords:
        new_coords.append(project_coords(coord, from_proj, to_proj))
    return new_coords
```

Actually you can use this example to convert geojson files with different projections. More details about this you can find in [pyproj documentation](https://pyproj4.github.io/pyproj/stable/examples.html).

Full code snippet of convertation from Polar projection (EPSG:4326) to Pseudo-Mercator (WGS84 or EPSG:3857) and vise versa:

```python
import json
import codecs
import pyproj
import numbers

# Define projections
polar = pyproj.Proj(init='epsg:4326')
mercator = pyproj.Proj(init='epsg:3857')


def project_coords(coords, from_proj, to_proj):
    if len(coords) < 1:
        return []

    if isinstance(coords[0], numbers.Number):
        from_x, from_y = coords
        to_x, to_y = pyproj.transform(from_proj, to_proj, from_x, from_y)
        return [to_x, to_y]

    new_coords = []
    for coord in coords:
        new_coords.append(project_coords(coord, from_proj, to_proj))
    return new_coords


def project_feature(feature, from_proj, to_proj):
    if not 'geometry' in feature or not 'coordinates' in feature['geometry']:
        print('Failed project feature', feature)
        return None

    new_coordinates = project_coords(feature['geometry']['coordinates'], from_proj, to_proj)
    feature['geometry']['coordinates'] = new_coordinates
    return feature


def read_data(geom_file):
    with open(geom_file, encoding='utf-8') as data:
        data = json.load(data)
    return data


def save_data(data, geom_file):
    json_data = json.dumps(data, indent=2)
    f = codecs.open(geom_file, "w")
    f.write(json_data)
    f.close()


def project_geojson_file(in_file, out_file, from_proj, to_proj):
    data = read_data(in_file)

    projected_features = []
    for feature in data['features']:
        projected_features.append(project_feature(feature, from_proj, to_proj))
    data['features'] = projected_features

    save_data(data, out_file)


def project_file_to_polar(in_file, out_file):
    project_geojson_file(in_file, out_file, from_proj=mercator, to_proj=polar)


def project_file_to_mercator(in_file, out_file):
    project_geojson_file(in_file, out_file, from_proj=polar, to_proj=mercator)


# Project geojson file from mercator to polar
project_file_to_polar('example-mercator.geojson', 'example-polar.geojson')

# And from polar to mercator
project_file_to_mercator('example-polar.geojson', 'example-mercator.geojson')

# Or any other projection you want
project_geojson_file('example-epsg-6069.geojson', 'example-polar.geojson',
                     from_proj=pyproj.Proj(init='epsg:6069'), to_proj=polar)
```

_* All code in this article provided under MIT license_
