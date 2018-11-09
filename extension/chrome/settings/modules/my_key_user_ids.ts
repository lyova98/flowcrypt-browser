/* © 2016-2018 FlowCrypt Limited. Limitations apply. Contact human@flowcrypt.com */

'use strict';

import { Store } from '../../../js/common/store.js';
import { Xss, Env } from '../../../js/common/browser.js';
import { Settings } from '../../../js/common/settings.js';
import { Catch } from '../../../js/common/catch.js';

declare const openpgp: typeof OpenPGP;

Catch.try(async () => {

  const urlParams = Env.urlParams(['acctEmail', 'longid', 'parentTabId']);
  const acctEmail = Env.urlParamRequire.string(urlParams, 'acctEmail');

  $('.action_show_public_key').attr('href', Env.urlCreate('my_key.htm', urlParams));

  const [primaryKi] = await Store.keysGet(acctEmail, [urlParams.longid as string || 'primary']);
  Settings.abortAndRenderErrorIfKeyinfoEmpty(primaryKi);

  const key = openpgp.key.readArmored(primaryKi.private).keys[0];

  const userIds = key.users.map((u: any) => u.userId.userid); // todo - create a common function in settings.js for here and setup.js user_ids
  Xss.sanitizeRender('.user_ids', userIds.map((uid: string) => `<div>${Xss.escape(uid)}</div>`).join(''));

  $('.email').text(acctEmail);
  $('.key_words').text(primaryKi.keywords);

})();