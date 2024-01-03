
import functools


def find_min_max_values(dataframe):
    numerical_cols = dataframe.select_dtypes(include=['number']).columns
    
    min_max_values = []
    for col in numerical_cols:
        min_value = float(dataframe[col].min())
        max_value = float(dataframe[col].max())
        min_max_values.append({"key": col, "value": [min_value, max_value]})
    
    return min_max_values

def find_filtered_numerical_data(data, df):
    
    conditions = []
    for row in data:
        col = row[0]
        min, max = row[1]
        conditions.append(df[col] < max)
        conditions.append(df[col] > min)
    
    return df[functools.reduce(lambda x, y: x & y, conditions)]