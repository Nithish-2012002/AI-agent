// chains/hello-world.ts
import { defineChain } from '@relevanceai/chain';

export default defineChain({
    title: 'My First App!',
    params: {
        name: {
            type: 'string',
        },
    },
    setup({ params, step }) {
        const { name } = params;

        const { answer } = step('prompt_completion', {
            prompt: `Say hello to me! and then tell me a joke... My name is: ${name}.`,
        });

        return { answer };
    },
});
