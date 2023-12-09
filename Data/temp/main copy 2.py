from shapely.geometry import Point
import geopandas as gpd
from fuzzywuzzy import fuzz

def similarity_score(a, b):
    return fuzz.token_set_ratio(a, b)

# Read the GeoJSON file
file_path = 'test.geojson'
data = gpd.read_file(file_path)

# Set a threshold distance for considering duplicates (adjust as needed)
threshold_distance = 0.01  # Example threshold in degrees
name_similarity_threshold = 80

# Function to find duplicates based on spatial distance and name similarity
def find_duplicates(gdf):
    indices_to_drop = set()  # Collect indices to drop
    
    for index, row in gdf.iterrows():
        possible_duplicates = list(gdf.sindex.intersection(row['geometry'].buffer(threshold_distance).bounds))
        for comp_index in possible_duplicates:
            if index != comp_index and similarity_score(row['FACILITY_NAME'], gdf.loc[comp_index]['FACILITY_NAME']) > name_similarity_threshold:
                distance = row['geometry'].distance(gdf.loc[comp_index]['geometry'])
                if distance < threshold_distance:
                    indices_to_drop.add(comp_index)  # Add indices to drop set

    return indices_to_drop  # Return indices to drop

# Find duplicates and drop them
indices_to_drop = find_duplicates(data)
dropped_indices = list(indices_to_drop)  # Convert set to a list for printing
data.drop(indices_to_drop, inplace=True)

# Display the final GeoDataFrame of accommodations
print(data)

# Show dropped indices
print("Dropped indices:", dropped_indices)
