/* global harden */
// import this to recognize harden by TypeScript
import 'ses';
import React, {useState, useEffect} from 'react';
import {E} from '@agoric/eventual-send';
import {useAgoricWalletContext} from './@rbflabs';
import moolaMinterConstants from '../moolaMinterConstants.mjs';

const MintForm = (props: any) => {
  const [amount, setAmount] = useState(0);
  const [moolaPursePetname, setMoolaPursePetname] = useState(undefined);

  const {purses, zoe, board, walletBridge} = useAgoricWalletContext();

  useEffect(() => {
    E(walletBridge).suggestIssuer('Moola', moolaMinterConstants.TOKEN_ISSUER_BOARD_ID);
    E(walletBridge).suggestInstallation('Moola installation', moolaMinterConstants.INSTALLATION_BOARD_ID);
    E(walletBridge).suggestInstance('Moola Instance', moolaMinterConstants.INSTANCE_BOARD_ID);
  }, [walletBridge]);

  useEffect(() => {
    const tokenPurse = purses.find(
      // Does the purse's brand match our token brand?
      ({brandBoardId} : any) => brandBoardId === moolaMinterConstants.TOKEN_BRAND_BOARD_ID
    );
    if (tokenPurse && tokenPurse.pursePetname) {
      // If we got a petname for that purse, use it in the offers we create.
      console.log(`found purse name ${tokenPurse.pursePetname}`);
      setMoolaPursePetname(tokenPurse.pursePetname);
    }
  }, [purses]);

  const mintSomeMoola = async () => {
    console.log('mintMoola handler running');
    const moolaInstance = await E(board).getValue(moolaMinterConstants.INSTANCE_BOARD_ID);
    const moolaPublicFacet = await E(zoe).getPublicFacet(moolaInstance);
    const mintInvitation = await E(moolaPublicFacet).makeMintInvitation();

    const offerConfig = harden({
      id: `${Date.now()}`,
      invitation: mintInvitation,
      proposalTemplate: {
        want: {
          Tokens: {
            pursePetname: moolaPursePetname,
            value: amount,
          },
        },
      },
      dappContext: true,
    });

    console.log('adding offer to mint Moolas');
    const newOffer = await E(walletBridge).addOffer(offerConfig);
  };

  return (
    <div id="Mint-form">
      <div className="Mint-form-input-row">
        <label>Amount of Moola to mint:</label>
        <input
          type="text"
          pattern="[0-9]*"
          id="mintInput"
          onChange={ev => setAmount(parseInt(ev.target.value) || 0)}
          value={amount}
        />
        <button onClick={() => mintSomeMoola()}>Get some Moola!</button>
      </div>
    </div>
  );
};

export default MintForm;
