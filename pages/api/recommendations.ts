import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    const { method } = req;
    let { relationship, occasion, age, hobbies, memory, priceRange } = req.body;

    const weaviateClusterUrl = process.env.WEAVIATE_CLUSTER_URL?.replace("https://", "");

    switch (method) {
      case 'POST': {
        let headers: { [key: string]: string } = {};

        if (process.env.OPENAI_API_KEY) {
          headers['X-OpenAI-Api-Key'] = process.env.OPENAI_API_KEY;
        }

        if (process.env.COHERE_API_KEY) {
          headers['X-Cohere-Api-Key'] = process.env.COHERE_API_KEY;
        }

        const client: WeaviateClient = weaviate.client({
          scheme: 'https',
          host: weaviateClusterUrl || 'zxzyqcyksbw7ozpm5yowa.c0.us-west2.gcp.weaviate.cloud',
          apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || 'n6mdfI32xrXF3DH76i8Pwc2IajzLZop2igb6'), //READONLY API Key, ensure the environment variable is an Admin key to support writing
          headers: headers,
        });

        let nearText: NearTextType = {
          concepts: [],
        };

        nearText.certainty = 0.6;

        // Assigning a single concatenated string within an array
        nearText.concepts = [`${relationship}, ${occasion}, ${age}, ${hobbies}, ${memory}, ${priceRange}`];

        let generatePrompt = `Briefly describe why this gift might be interesting to someone who has interests or hobbies in ${hobbies}. The gift's name is {name}, with a description: {description}, and is in the category: {category}. Don't make up anything that wasn't given in this prompt and don't ask how you can help.`;

        let recDataBuilder = client.graphql
          .get()
          .withClassName('Gift')
          .withFields(
            'giftId name category image description price average_rating ratings_count link' // Ensure link is included here
          )
          .withNearText(nearText)
          .withLimit(20);

        if (headers['X-Cohere-Api-Key']) {
          recDataBuilder = recDataBuilder.withGenerate({
            singlePrompt: generatePrompt,
          });
        }

        const recData = await recDataBuilder.do();

        console.log(recData); // Log the API response

        res.status(200).json(recData);
        break;
      }
      default:
        res.status(400).end();
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
