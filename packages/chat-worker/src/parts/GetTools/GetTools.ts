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
            description: 'The javascript code to insert to the simple browser. This property is required',
          },
        },
        required: ['code'],
      },
    },
    {
      name: 'layout_toggle_side_bar',
      description: 'Toggle the side bar',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'layout_show_search',
      description: 'Layout: Show Search',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'layout_show_source_control',
      description: 'Layout: Show Source Control',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'layout_toggle_panel',
      description: 'Toggle the panel',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'help_show_about',
      description: 'Show About info',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'explorer_collapse_all',
      description: 'Collapse all files in explorer',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'quickpick_open_recent',
      description: 'open recent items quickpick',
      input_schema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'get_simple_browser_dom_tree',
      description: 'Get the dom html of the simple browser',
      input_schema: {
        type: 'object',
        properties: {
          maxLength: {
            type: 'number',
            description: 'The max length of html code to query',
          },
        },
        required: [],
      },
    },
  ]
}
