---
layout: layouts/post
---

I love fishing! And the place itself is very important for fishing. You can usually use a local site or forum to find a suitable place. But I'm not used to looking for shortcuts, so I'll try to use OpenStreetMap to find fishing places.

In OSM Wiki I found two useful tags [leisure=fishing](https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dfishing) and [fishing=*](https://wiki.openstreetmap.org/wiki/Key:fishing). To find all geometry by this tag you can run this query with [Overpass Turbo](https://overpass-turbo.eu/):

```R
[out:json];
(
    node[leisure=fishing]({{bbox}});
    node[fishing=yes]({{bbox}});
    node[fishing=private]({{bbox}});
    node[fishing=permissive]({{bbox}});
    way[leisure=fishing]({{bbox}});
    way[fishing=yes]({{bbox}});
    way[fishing=private]({{bbox}});
    way[fishing=permissive]({{bbox}});
    relation[leisure=fishing]({{bbox}});
    relation[fishing=yes]({{bbox}});
    relation[fishing=private]({{bbox}});
    relation[fishing=permissive]({{bbox}});
    <;
);
out geom;
```

Ok, what we can do with this data? First idea is to filter geometry by country (in my case Ukraine).
To do this we should download boundary of country and find intersections with this boundary for all fishing places.

The easiest way is to run Overpass-query with name of a country:

```R
[out:json];
rel[admin_level=2]["name:en"="Ukraine"];
out geom;
```

![Ukrainian border in overpass](/assets/img/ukraine-border-overpass.png)

When we have border of country we can find all geometries that have intersection with country polygon (or multipolygon). To convert OSM data (loaded with overpass) I use [osm2geojson](https://github.com/aspectumapp/osm2geojson).
Here full example on python how to download data from Overpass and convert it to GeoJSON:

```python
import requests
import urllib
import codecs
import json
import os
from shapely import geometry
from shapely.strtree import STRtree
from osm2geojson import json2geojson

OVERPASS = "https://overpass-api.de/api/interpreter/"
SPLIT_SIZE = 1.5 # optimal value for countries


# source from https://snorfalorpagus.net/blog/2016/03/13/splitting-large-polygons-for-faster-intersections/
def katana(shape, threshold, count=0):
    """Split a Polygon into two parts across it's shortest dimension"""
    bounds = shape.bounds
    if len(bounds) == 0:
        # emptry geometry, usual situation
        width = 0
        height = 0
    else:
        width = bounds[2] - bounds[0]
        height = bounds[3] - bounds[1]

    if max(width, height) <= threshold or count == 250:
        # either the polygon is smaller than the threshold, or the maximum
        # number of recursions has been reached
        return [shape]
    if height >= width:
        # split left to right
        a = geometry.box(bounds[0], bounds[1], bounds[2], bounds[1]+height/2)
        b = geometry.box(bounds[0], bounds[1]+height/2, bounds[2], bounds[3])
    else:
        # split top to bottom
        a = geometry.box(bounds[0], bounds[1], bounds[0]+width/2, bounds[3])
        b = geometry.box(bounds[0]+width/2, bounds[1], bounds[2], bounds[3])
    result = []
    for d in (a, b,):
        c = shape.intersection(d)
        if not isinstance(c, geometry.GeometryCollection):
            c = [c]
        for e in c:
            if isinstance(e, (geometry.Polygon, geometry.MultiPolygon)):
                result.extend(katana(e, threshold, count+1))
    if count > 0:
        return result
    # convert multipart into singlepart
    final_result = []
    for g in result:
        if isinstance(g, geometry.MultiPolygon):
            final_result.extend(g.geoms)
        else:
            final_result.append(g)
    return final_result


def overpass_call(query):
    encoded = urllib.parse.quote(query.encode('utf-8'), safe='~()*!.\'')
    r = requests.post(OVERPASS,
                      data=f"data={encoded}",
                      headers={'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'})
    if r.status_code != 200:
        raise requests.exceptions.HTTPError('Overpass server respond with status '+str(r.status_code))
    return r.text


def get_country_border(name):
    print(f"Loading border of {name}...")
    data = overpass_call(f"""
        [out:json];
        rel[admin_level=2]["name:en"="{name}"];
        out geom;
    """)
    geojson_data = json2geojson(data)

    print(f"Country border loaded!")
    for f in geojson_data['features']:
        if f['properties']['tags']['type'] == 'boundary':
            return f

    return None


def get_features_inside_shape(geojson_data, border_shape):
    optimized_shapes = katana(border_shape, SPLIT_SIZE)
    tree = STRtree(optimized_shapes)

    inside_shape = []
    for feature in geojson_data['features']:
        shape = geometry.shape(feature['geometry'])
        indices = tree.query(shape)
        for idx in indices:
            if optimized_shapes[idx].contains(shape):
                inside_shape.append(feature)
                break
    geojson_data['features'] = inside_shape
    return geojson_data


def get_fishing_places_in_country(name):
    border = get_country_border(name)
    border_shape = geometry.shape(border['geometry'])
    minlon, minlat, maxlon, maxlat = border_shape.bounds
    bbox = f"({minlat}, {minlon}, {maxlat}, {maxlon})"

    tags = ['leisure=fishing'] + [f"fishing={v}" for v in ['yes', 'private', 'permissive']]
    queries = []
    for geom_t in ['node', 'way', 'relation']:
        for tag in tags:
            queries.append(f"{geom_t}[{tag}]{bbox};")

    print("Loading all information about fishing places from overpass...")
    data = overpass_call(f"""
        [out:json];
        (
            {"".join(queries)}
            <;
        );
        out geom;
    """)

    geojson_data = json2geojson(data, filter_used_refs=False)
    print(f"Find all geometries inside {name}")
    geojson_data = get_features_inside_shape(geojson_data, border_shape)
    print("Count of features:", len(geojson_data['features']))
    return geojson_data


def save_data(data, geom_file):
    json_data = json.dumps(data, indent=2)
    f = codecs.open(geom_file, 'w')
    f.write(json_data)
    f.close()
    print("Data saved to", geom_file)


data = get_fishing_places_in_country("Ukraine")
save_data(data, 'fishing_places_ukraine.geojson')
```

In this code you can notice some optimizations inside `get_features_inside_shape`. We need this to perform geospatial queries (like intersection) faster. Here used `katana` method to split large geometries into parts, you can find more information in this article [Splitting large polygons for faster intersections](https://snorfalorpagus.net/blog/2016/03/13/splitting-large-polygons-for-faster-intersections/). Other optimization is R-tree packed using the Sort-Tile-Recursive algorithm ([documentation about STRtree in shapely](https://shapely.readthedocs.io/en/stable/manual.html#str-packed-r-tree)).

The generated dataset visualization:

![Fishing places in Ukraine](/assets/img/fishing-zones.png)

The map shows that the number of places suitable for fishing is very small (although in reality there are many more). And this is even more motivating to add new information to the OSM.

_* All code in this article provided under MIT license_
