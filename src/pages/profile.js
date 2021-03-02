const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

const PROFILE_EDITABLE = [ 'chat_id', 'name','twitter_user','github_user' ];

import { collectInputs } from '../js/forms.js';
import { updateProfile } from '../js/auth.js';


// Takes a form field container and pulls out input values that
// can be then sent to the server to update the user's profile
export async function updateViaForm(fieldset) {
  const fdata = collectInputs( fieldset, PROFILE_EDITABLE );

  // Data validation
  // Matrix id: @localpart:domain
  if ('chat_id' in fdata && !fdata['chat_id'].match(/^@[0-9a-z\/=_.-]+:.*/i)) {
    throw Object.assign(
      new Error('Matrix IDs should be in the format @username:domain'), { type: 'invalid' }
    );
  }

  return await updateProfile(fdata);
}
