import os
import csv
import weaviate

from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv('WEAVIATE_CLUSTER_URL')
WEAVIATE_API_KEY = os.getenv('WEAVIATE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
COHERE_API_KEY = os.getenv('COHERE_API_KEY')

client = weaviate.Client(
    url=WEAVIATE_CLUSTER_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_API_KEY), 
    additional_headers={"X-OpenAI-Api-Key": OPENAI_API_KEY, "X-Cohere-Api-Key": COHERE_API_KEY})

client.schema.delete_class("Gift")

class_obj = {
    "class": "Gift",
    "vectorizer": "text2vec-openai",
    "moduleConfig": {
        "text2vec-openai": {
            "model": "ada",
            "modelVersion": "002",
            "type": "text"
        },
        "generative-cohere": {}
    }
}


client.schema.create_class(class_obj)

f = open("./data-pipeline/gifts.csv", "r")
current_gift = None
try:
    with client.batch as batch:  # Initialize a batch process
        batch.batch_size = 100
        reader = csv.reader(f)
        next(reader)  # Skip header row
        # Iterate through each row of data
        for gift in reader:
            current_gift = gift
            # 0 - giftId
            # 1 - name
            # 2 - category
            # 3 - image
            # 4 - description
            # 5 - price
            # 6 - average_rating
            # 7 - ratings_count

            properties = {
                "giftId": gift[0],
                "name": gift[1],
                "category": gift[2],
                "image": gift[3],
                "description": gift[4],
                "price": gift[5],
                "average_rating": gift[6],
                "ratings_count": gift[7],
            }

            batch.add_data_object(data_object=properties, class_name="Gift")
except Exception as e:
    print(f"something happened {e}. Failure at {current_gift}")

f.close()
