import geopandas as gpd
from fuzzywuzzy import fuzz
from collections import defaultdict
import math

# Read the GeoJSON file
file_path = 'test.geojson'
data = gpd.read_file(file_path)

# Function to calculate distance between two points given their coordinates
def calculate_distance(coords1, coords2):
    # Haversine formula for distance calculation
    lat1, lon1 = coords1
    lat2, lon2 = coords2
    R = 6371000  # Earth radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2) * math.sin(delta_phi / 2) + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) * math.sin(delta_lambda / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance

# Function to compare textual similarity
def similarity(a, b):
    return fuzz.token_set_ratio(a, b)

# Group accommodations by spatial proximity
merged_accommodations = defaultdict(list)
for index, row in data.iterrows():
    new_entry = (row['FACILITY_NAME'], row['geometry'].coords[0])
    for idx, rw in data.iloc[index + 1:].iterrows():
        distance = calculate_distance(row['geometry'].coords[0], rw['geometry'].coords[0])
        if distance < 100:  # Adjust threshold as needed
            if similarity(row['FACILITY_NAME'], rw['FACILITY_NAME']) > 80:
                new_entry = (row['FACILITY_NAME'], row['geometry'].coords[0])
    merged_accommodations[new_entry].append(row)

# Convert merged accommodations back to a list of GeoDataFrame rows
final_accommodations = []
for value in merged_accommodations.values():
    final_accommodations.extend(value)

# Create the final GeoDataFrame
final_table = gpd.GeoDataFrame(final_accommodations)
print(final_table)
# Save or work with the final_table GeoDataFrame
# final_table.to_file('final_accommodations.geojson', driver='GeoJSON')
