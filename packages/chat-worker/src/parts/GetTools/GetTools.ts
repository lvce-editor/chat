export const getTools = (): readonly any[] => {
  return [
    {
      name: 'set_simple_browser_url',
      description: 'Set the url of the simple browser',
      input_schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The url of the simple browser or a search term',
          },
        },
        required: ['url'],
      },
    },
  ]
}
