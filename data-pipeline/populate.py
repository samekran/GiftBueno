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

# Only delete the class if you need to recreate it from scratch
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
    },
    "properties": [
        {
            "name": "giftId",
            "dataType": ["string"]
        },
        {
            "name": "name",
            "dataType": ["string"]
        },
        {
            "name": "category",
            "dataType": ["string"]
        },
        {
            "name": "image",
            "dataType": ["string"]
        },
        {
            "name": "description",
            "dataType": ["string"]
        },
        {
            "name": "price",
            "dataType": ["number"]
        },
        {
            "name": "average_rating",
            "dataType": ["number"]
        },
        {
            "name": "link",
            "dataType": ["string"]
        }
    ]
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
            try:
                price = float(gift[5]) if gift[5] != 'N/A' else None
                average_rating = float(gift[6]) if gift[6] != 'N/A' else None
            except ValueError:
                print(f"Skipping gift due to conversion error: {gift}")
                continue

            properties = {
                "giftId": gift[0],
                "name": gift[1],
                "category": gift[2],
                "image": gift[3],
                "description": gift[4],
                "price": price,
                "average_rating": average_rating,
                "link": gift[7],
            }

            batch.add_data_object(data_object=properties, class_name="Gift")
except Exception as e:
    print(f"something happened {e}. Failure at {current_gift}")

f.close()
