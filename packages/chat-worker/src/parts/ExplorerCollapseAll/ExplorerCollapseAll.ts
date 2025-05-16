import * as Rpc from '../Rpc/Rpc.ts';

const explorerCollapseAll = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Explorer.collapseAll');
  return {
    type: 'command-executed-successfully',
  };
};

export default explorerCollapseAll;
