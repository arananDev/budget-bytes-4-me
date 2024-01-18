
import functools


def find_min_max_values(dataframe):
    min_max_values = {
        'prep_time_mins': [0.0, 60],
        'cook_time_mins': [0.0, 60],
        'servings': [1.0, 50],
        'protien_per_serving_grams': [0.0, 50],
        'carbs_per_serving_grams': [0.25, 100],
        'calories_per_serving_kcal': [5.0, 500],
        'fat_per_serving_grams': [0.0, 50],
        'sodium_per_serving_mg': [1.0, 1000],
        'fiber_per_serving_mg': [0.0, 20]
    }

    return [{'key': key, 'value': value} for key, value in min_max_values.items()]

max_nullifiers = {
    "prep_time_mins": 60,
    "cook_time_mins": 60,
    "servings": 50,
    "protien_per_serving_grams": 50,
    "carbs_per_serving_grams": 100,
    "calories_per_serving_kcal": 500,
    "fat_per_serving_grams" :50,
    "sodium_per_serving_mg": 1000,
    "fiber_per_serving_mg": 20,
}

def find_filtered_numerical_data(data, df):
    conditions = []
    for row in data:
        col = row["key"]
        min, max = row["value"]
        if max != max_nullifiers[col]:
            conditions.append(df[col] < max)
        conditions.append(df[col] > min)
    filtered_df = df[functools.reduce(lambda x, y: x & y, conditions)]
    
    return filtered_df.to_dict(orient="records")