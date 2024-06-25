import os
import weaviate
import json

from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv('WEAVIATE_CLUSTER_URL') or 'https://your-default-cluster-url'
WEAVIATE_API_KEY = os.getenv('WEAVIATE_API_KEY') or 'your-default-api-key'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
COHERE_API_KEY = os.getenv('COHERE_API_KEY')

client = weaviate.Client(
    url=WEAVIATE_CLUSTER_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_API_KEY),
    additional_headers={"X-OpenAI-Api-Key": OPENAI_API_KEY, "X-Cohere-Api-Key": COHERE_API_KEY})

nearText = {
    "concepts": [
        "technology", "luxury", "gadgets", "music", "sports", 
        "fashion", "food", "travel", "home decor", "books", 
        "toys", "wellness", "fitness", "handmade", "personalized"
    ]
}

generate_prompt = "Explain why this gift might be interesting to someone who likes {category}. The gift's name is {name}, with a description: {description}, and is priced at {price}."

response = (client.query.get("Gift", [
    "giftId",
    "name",
    "category",
    "image",
    "description",
    "price",
    "average_rating",
    "link"
]) .with_generate(single_prompt=generate_prompt).with_near_text(nearText).with_limit(10).do())

print(json.dumps(response, indent=4))
