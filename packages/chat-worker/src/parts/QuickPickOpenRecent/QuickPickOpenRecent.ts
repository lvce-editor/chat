import * as Rpc from '../Rpc/Rpc.ts';

const quickPickOpenRecent = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'QuickPick.openRecent');
  return {
    type: 'command-executed-successfully',
  };
};

export default quickPickOpenRecent;
