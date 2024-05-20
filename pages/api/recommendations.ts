import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    const { method } = req;
    let { query, userInterests } = req.body;

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
          apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || 'n6mdfI32xrXF3DH76i8Pwc2IajzLZop2igb6'), // READONLY API Key, ensure the environment variable is an Admin key to support writing
          headers: headers,
        });

        let nearText: NearTextType = {
          concepts: [],
        };

        nearText.certainty = 0.6;
        nearText.concepts = query;

        let generatePrompt = `Briefly describe why this gift might be interesting to someone who has interests or hobbies in ${userInterests}. The gift's name is {name}, with a description: {description}, and is in the category: {category}. Don't make up anything that wasn't given in this prompt and don't ask how you can help.`;

        let recDataBuilder = client.graphql
          .get()
          .withClassName('Gift')
          .withFields(
            'giftId name category image description price average_rating ratings_count'
          )
          .withNearText(nearText)
          .withLimit(20);

        if (headers['X-Cohere-Api-Key']) {
          recDataBuilder = recDataBuilder.withGenerate({
            singlePrompt: generatePrompt,
          });
        }

        const recData = await recDataBuilder.do();

        res.status(200).json(recData);
        break;
      }
      default:
        res.status(400);
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}