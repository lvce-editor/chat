import * as Rpc from '../Rpc/Rpc.ts';

const execSimpleBrowserTool = async (params) => {
  if (!params.url) {
    throw new Error('url is required');
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.setUrl', params.url);
  return {
    type: 'navigation-successful',
  };
};

export default execSimpleBrowserTool;
