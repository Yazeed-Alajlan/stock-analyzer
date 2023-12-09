import pandas as pd
from shapely.geometry import Point
import geopandas as gpd
from fuzzywuzzy import fuzz



def similarity_score(a, b):
    return fuzz.token_set_ratio(a, b)

# Read the GeoJSON file
# file_path = 'accomodations-riyadh-exercise.geojson'
file_path = 'accomodations-riyadh-exercise.geojson'
data = gpd.read_file(file_path)

# Convert JSON data to a GeoDataFrame
accommodation_list = []
for feature in data.iterrows():
    accommodation_list.append({
        'U_ID': feature[1]['U_ID'],
        'DATA_SOURCE': feature[1]['DATA_SOURCE'],
        'SOURCE_IDENTIFIER': feature[1]['SOURCE_IDENTIFIER'],
        'FACILITY_NAME': feature[1]['FACILITY_NAME'],
        'geometry': Point(feature[1]['geometry'].x, feature[1]['geometry'].y)  # Extracting x, y coordinates
    })

gdf = gpd.GeoDataFrame(accommodation_list, geometry='geometry')

# Set a threshold distance for considering duplicates (adjust as needed)
threshold_distance = 0.01  # Example threshold in degrees
name_similarity_threshold=80

# Spatial comparison to find duplicates
duplicates = []
indices_to_drop = set()  # Collect indices to drop
for index, row in gdf.iterrows():
    for comp_index, comp_row in gdf.iterrows():
        if index != comp_index and similarity_score(row['FACILITY_NAME'], comp_row['FACILITY_NAME']) > name_similarity_threshold:
            distance = row['geometry'].distance(comp_row['geometry'])
            if distance < threshold_distance:
                duplicates.append((index, comp_index))
                indices_to_drop.add(comp_index)  # Add indices to drop set

# Drop duplicates based on specific conditions
gdf.drop(indices_to_drop, inplace=True)  # Drop collected indices
# Display the final GeoDataFrame of accommodations
print(gdf)
