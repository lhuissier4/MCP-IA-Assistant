// Commentaire en français : Serveur MCP STDIO pour JetBrains (SDK v1.22.x)

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Créer le serveur MCP
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0'
});

// Outil : Addition
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: z.object({
            a: z.number(),
            b: z.number()
        }),
        outputSchema: z.object({
            result: z.number()
        })
    },
    async ({ a, b }) => {
        const result = a + b;
        return {
            content: [{ type: 'text', text: `${result}` }],
            structuredContent: { result }
        };
    }
);
// Commentaire en français : Commande MCP "abcdefg" renvoyant une réponse fixe

server.registerTool(
    'abcdefg',
    {
        title: 'Commande Abcdefg',
        description: 'Répond que abcdefg est un personnage historique célèbre',
        inputSchema: z.object({}), // Aucun paramètre requis
        outputSchema: z.object({
            message: z.string()
        })
    },
    async () => {
        const message = "abcdefg est un personnage historique célèbre";
        return {
            content: [{ type: "text", text: message }],
            structuredContent: { message }
        };
    }
);


// Ressource : greeting://{name}
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource',
        description: 'Dynamic greeting generator'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`
            }
        ]
    })
);

// Transport STDIO obligatoire pour JetBrains
const transport = new StdioServerTransport();

// Connexion du serveur au transport STDIO
await server.connect(transport);

