from shapely.geometry import Point
import geopandas as gpd
from fuzzywuzzy import fuzz

def similarity_score(a, b):
    return fuzz.token_set_ratio(a, b)

# Read the GeoJSON file
file_path = 'test.geojson'
data = gpd.read_file(file_path)

# Set a threshold distance for considering duplicates (adjust as needed)
threshold_distance = 0.05  # Example threshold in degrees
name_similarity_threshold = 95

# Function to find duplicates based on spatial distance and name similarity
def find_duplicates(gdf):
    duplicate_records = {}  # Dictionary to store merged records
    
    for index, row in gdf.iterrows():
        possible_duplicates = list(gdf.sindex.intersection(row['geometry'].buffer(threshold_distance).bounds))
        for comp_index in possible_duplicates:
            if index != comp_index and similarity_score(row['FACILITY_NAME'], gdf.loc[comp_index]['FACILITY_NAME']) > name_similarity_threshold:
                distance = row['geometry'].distance(gdf.loc[comp_index]['geometry'])
                if distance < threshold_distance:
                    # Merge duplicate records into a dictionary
                    if index in duplicate_records:
                        duplicate_records[index].append(comp_index)
                    else:
                        duplicate_records[index] = [index, comp_index]

    return duplicate_records.values()  # Return lists of indices to be merged

# Find duplicates to be merged
print(data)
print("--------------------------------------------")
records_to_merge = find_duplicates(data)
print(records_to_merge)

# Merge duplicate records and keep only one of each
for indices in records_to_merge:
    records = data.iloc[list(indices)]
    merged_geometry = records.unary_union
    data.at[indices[0], 'geometry'] = merged_geometry

# Drop duplicates except for the first occurrence
duplicate_indices = set([item for sublist in records_to_merge for item in sublist[1:]])
data = data.drop(duplicate_indices)

# Display the GeoDataFrame with merged geometries and single occurrences of duplicates
print(data)
