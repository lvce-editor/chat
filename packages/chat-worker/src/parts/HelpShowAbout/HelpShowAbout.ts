import * as Rpc from '../Rpc/Rpc.ts';

const helpShowAbout = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'About.showAbout');
  return {
    type: 'command-executed-successfully',
  };
};

export default helpShowAbout;
