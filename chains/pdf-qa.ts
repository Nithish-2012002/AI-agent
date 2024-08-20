import { defineChain, Client } from '@relevanceai/chain';
import type pdfQa from './chains/pdf-qa.ts';
import dotenv from 'dotenv';

// Define the chain
const chain = defineChain({
    title: 'PDF Q&A',
    publiclyTriggerable: true,
    params: {
        question: {
            type: 'string',
        },
        pdf_url: {
            type: 'string',
        },
        user_question: {
            type: 'string',
        },
        num_answers_to_generate: {
            type: 'number',
        },
    },
    
    setup({ params, step, foreach }) {
        
        const { pdf_url } = params;

        const { text } = step('pdf_to_text', {
            pdf_url,
        });

        const { chunks } = step('split_text', {
            method: 'tokens',
            num_tokens: 200,
            text,
        });

        const results = foreach(chunks, ({ item }) =>
            step('prompt_completion', {
                prompt: `${item}. Summarise this text.`,
            })
        );

        const { text: summary } = step('join_array', {
            array: results['*'].answer,
            sep: '\n',
        });

        return { summary };
    },
});

// Define the region and project IDs
dotenv.config();
const region = process.env.RELEVANCE_REGION;
const project = process.env.RELEVANCE_PROJECT_ID;
console.log("region:"+region);
console.log("project:"+project)
// Initialize the client
const client = new Client({
    region,
    project,
  });

async function runChain() {
    try {
        // Pass the required parameters when running the chain
        const output = await client.runChain('pdf-qa', { question });
        console.log(output);
      } catch (error) {
        console.error(error);
      }
}

runChain();
export default chain;
