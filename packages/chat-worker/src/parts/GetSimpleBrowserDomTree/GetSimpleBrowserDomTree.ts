import * as Rpc from '../Rpc/Rpc.ts';

const getSimpleBrowserDomTree = async (params) => {
  const result = await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.getDomTree');
  const limit = params?.maxLength || 10_000;
  const sliced = result.slice(0, limit);
  return {
    type: 'simple-browser-dom',
    html: sliced,
  };
};

export default getSimpleBrowserDomTree;
