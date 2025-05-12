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
    {
      name: 'simple_browser_insert_css',
      description:
        'Insert Css into the simple browser. Probably best to wrap your javascript code in an iife to not conflict with other code.',
      input_schema: {
        type: 'object',
        properties: {
          css: {
            type: 'string',
            description: 'The css to insert to the simple browser',
          },
        },
        required: ['css'],
      },
    },
    {
      name: 'simple_browser_insert_javascript',
      description: 'Insert JavaScript into the simple browser',
      input_schema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The javascript code to insert to the simple browser',
          },
        },
        required: ['code'],
      },
    },
    {
      name: 'get_simple_browser_dom_tree',
      description: 'Get the dom html of the simple browser',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  ]
}
