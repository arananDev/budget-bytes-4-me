from bs4 import BeautifulSoup
import requests
import re


### helper functions  
def get_only_numbers(text):
    try:
        return int(re.sub(r'\D', "", text))
    except Exception:
        return None

def get_recipe_links(no_of_pages):
    urls = []
    recipe_links = []
    for i in range(1 , no_of_pages): 
        link_string = f"https://www.budgetbytes.com/category/recipes/page/{str(i+1)}/"
        urls.append(link_string)
    for url in urls:
        hdr = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers= hdr)
        if response.status_code == 200:
            html_content = response.content

            # Parse HTML content
            soup = BeautifulSoup(html_content, 'html.parser')
            recipe_articles = soup.find_all('article')
            for link in recipe_articles:
                recipe_links.append(link.find("a")["href"])
        else:
            print(f"Issue with parsing {url} with status code: {str(response.status_code)}")
    return recipe_links


#get the recipe links from one page.
def get_data_from_recipe_link(link):
    def get_ingredients_from_soup(soup):
        result = []
        try:
            ingredients = soup.find( "ul", class_="wprm-recipe-ingredients").findAll("li", class_ = "wprm-recipe-ingredient")
            for ingredient in ingredients:
                text = ""
                text += ingredient.find("span", class_ = "wprm-recipe-ingredient-amount").text
                text += " "
                text += ingredient.find("span", class_ = "wprm-recipe-ingredient-name").text
                result.append(text)
        except Exception:
            pass
        
        return result
    
    def parse_minutes(soup, element, class_):
        minutes = 0
        try:
            for innerSoup in soup.findAll(element, class_=class_):
                text = innerSoup.text.strip().lower()
                if "hour" in text:
                    minutes += (60 * get_only_numbers(text))
                elif "minute" in text:
                    minutes += get_only_numbers(text)
        except Exception: 
            return None
        return minutes

    def parse_element(soup, tag, class_name):
        try:
            return soup.find(tag, class_=class_name).text.strip()
        except Exception:
            return None
    
    def extract_nutrition_value(soup, nutrient):
        try:
            value = soup.find("span",class_=nutrient).find(
                    "span",
                    class_="wprm-nutrition-label-text-nutrition-value").text
            return float(value)
        except AttributeError:
            return None

    hdr = {'User-Agent': 'Mozilla/5.0'}
    data = {"url": link}
    response = requests.get(link, headers= hdr)
    if response.status_code == 200:
            html_content = response.content
            # Parse HTML content
            soup = BeautifulSoup(html_content, 'html.parser')
            data["prep_time_mins"] = parse_element(soup, "span", "wprm-recipe-prep_time")
            data["prep_time_mins"] = parse_minutes(soup, "span", "wprm-recipe-prep_time")
            data["cook_time_mins"] = parse_minutes(soup, "span", "wprm-recipe-cook_time")  
            data["total_time_mins"] = parse_minutes(soup, "span", "wprm-recipe-total_time")
            data["servings"] = get_only_numbers(str(parse_element(soup, "span", "wprm-recipe-servings")))
            # Nutrition values using extract_nutrition_value
            data["protien_per_serving_grams"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-protein")
            data["carbs_per_serving_grams"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-carbohydrates")
            data["calories_per_serving_kcal"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-calories")
            data["fat_per_serving_grams"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-fat")
            data["sodium_per_serving_mg"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-sodium")
            data["fiber_per_serving_mg"] = extract_nutrition_value(soup, "wprm-nutrition-label-text-nutrition-container-fiber")

            data["ingredients_for_servings_size"] = get_ingredients_from_soup(soup)
    return data

def dataScraperRecipeLink(no_of_pages):
    complete_data = []
    recipe_links = get_recipe_links(no_of_pages)
    for link in recipe_links:
        complete_data.append(get_data_from_recipe_link(link))
    return complete_data
 
