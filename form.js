'use strict'

/**
 * Clamp between two numbers
 *
 * @param      {number}  min     The minimum
 * @param      {number}  max     The maximum
 * @param      {number}  val     The value to clamp
 */
function clamp(min, max, val) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Fix num cores, allowing blanks to remain
 */
function fix_num_cores() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  let num_cores_input = $('#batch_connect_session_context_num_cores');

  if(num_cores_input.val() === '') {
    return;
  }

  set_ppn_by_node_type(node_type_input, num_cores_input);
}

/**
 * Sets the ppn by node type.
 *
 * @param      {element}  node_type_input  The node type input
 * @param      {element}  num_cores_input  The number cores input
 */
function set_ppn_by_node_type(node_type_input, num_cores_input) {
  let data = node_type_input.find(':selected').data();

  num_cores_input.attr('max', data.maxPpn);
  num_cores_input.attr('min', data.minPpn);

  // Clamp value between min and max
  num_cores_input.val(
    clamp(data.minPpn, data.maxPpn, num_cores_input.val())
  );
}

/**
 * Toggle the visibilty of a form group
 *
 * @param      {string}    form_id  The form identifier
 * @param      {boolean}   show     Whether to show or hide
 */
function toggle_visibility_of_form_group(form_id, show) {
  let form_element = $(form_id);
  let parent = form_element.parent();

  if(show) {
    parent.show();
  } else {
    form_element.val('');
    parent.hide();
  }
}

/**
 * Toggle the visibilty of the CUDA select
 *
 * Looking for the value of data-can-show-cuda
 */
function toggle_cuda_version_visibility() {
  let node_type_input = $('#batch_connect_session_context_node_type');

  // Allow for cuda_version control not existing
  if ( ! ($('#batch_connect_session_context_cuda_version').length > 0) ) {
    return;
  }

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_cuda_version',
    node_type_input.find(':selected').data('can-show-cuda')
  );
}

/**
 * Sets the change handler for the node_type select.
 */
function set_node_type_change_handler() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  node_type_input.change(node_type_change_hander);
}

/**
 * Update UI when node_type changes
 */
function node_type_change_hander() {
  fix_num_cores();
  toggle_cuda_version_visibility();
}

/**
 * advanced settings toggle
 */
function advanced_settings_change_handler() {
  console.log('advanced settings handler...');
  let toggle = $('#batch_connect_session_context_advanced_settings')[0];

  let ssdquota = $('#batch_connect_session_context_CRYOSPARC_CACHE_QUOTA')[0]
  toggle_visibility_of_form_group(
    '#batch_connect_session_context_CRYOSPARC_CACHE_QUOTA',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_CRYOSPARC_CACHE_QUOTA')[0].value = ssdquota.defaultValue

  let ssdreserve = $('#batch_connect_session_context_CRYOSPARC_CACHE_FREE')[0]
  toggle_visibility_of_form_group(
    '#batch_connect_session_context_CRYOSPARC_CACHE_FREE',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_CRYOSPARC_CACHE_FREE')[0].value = ssdreserve.defaultValue

  let singularity_options = $('#batch_connect_session_context_SINGULARITY_OPTIONS')[0]
  toggle_visibility_of_form_group(
    '#batch_connect_session_context_SINGULARITY_OPTIONS',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_SINGULARITY_OPTIONS')[0].value = singularity_options.defaultValue
}

function set_advanced_settings_change_handler() {
  let toggle = $('#batch_connect_session_context_advanced_settings');
  advanced_settings_change_handler()
  toggle.change( advanced_settings_change_handler );
}


/**
 * Show "Migrate database from" only for CryoSPARC v5 images, since v4 ignores it.
 *
 * Nothing here rewrites a field's value. the data directory is the
 * user's choice, and the migrate-from path stays a record of where the data came
 * from.
 */
function selected_version_is_v5() {
  let tag = $('#batch_connect_session_context_SINGULARITY_IMAGE_TAG').val();
  return typeof tag === 'string' && tag.startsWith('5.');
}

/**
 * Like toggle_visibility_of_form_group(), but does NOT clear the value when
 * hiding -- hiding a field is not a reason to discard what it records.
 */
function toggle_visibility_keep_value(form_id, show) {
  let parent = $(form_id).parent();
  if (show) {
    parent.show();
  } else {
    parent.hide();
  }
}

/**
 * Help text that only applies to CryoSPARC v5.
 *
 * This lives here rather than in form.yml's `help:` because it wouldn't hide the other way
 */
const V5_HELP_ID = 'cryosparc-v5-datadir-help';

const V5_HELP_HTML = [
  '<div id="' + V5_HELP_ID + '" class="help-block form-text text-muted">',
  'For CryoSPARC v5, enter a <strong>new, empty directory</strong>, for example ',
  '<code>/sdf/group/cryoem/g/C###/.../cryosparc-v5</code>. ',
  'Do <strong>not</strong> point this at your existing v4 directory: your v4 ',
  'database is copied here and upgraded, and the original is deliberately left ',
  'untouched so you can still start a v4 session. Reusing the same directory ',
  'for both would remove that safety net.',
  '<br><br>',
  'If this path already contains a database that CryoSPARC v5 did not create, ',
  'the session will refuse to start rather than risk damaging it.',
  '</div>'
].join('');

function toggle_v5_only_help(show) {
  let existing = $('#' + V5_HELP_ID);
  if (show) {
    if (existing.length === 0) {
      $('#batch_connect_session_context_CRYOSPARC_DATADIR').after(V5_HELP_HTML);
    }
  } else {
    existing.remove();
  }
}

function image_tag_change_handler() {
  let is_v5 = selected_version_is_v5();
  toggle_visibility_keep_value(
    '#batch_connect_session_context_CRYOSPARC_MIGRATE_FROM',
    is_v5
  );
  toggle_v5_only_help(is_v5);
}

function set_image_tag_change_handler() {
  // Deferred to document-ready: if form.js happens to run before the select
  // exists, both the initial call and the binding would silently do nothing.
  $(function () {
    let tag_input = $('#batch_connect_session_context_SINGULARITY_IMAGE_TAG');
    image_tag_change_handler();
    tag_input.on('change', image_tag_change_handler);
  });
}

/**
 * Main
 */

// Set controls to align with the values of the last session context
//fix_num_cores();
//toggle_cuda_version_visibility();

// Install event handlers
//set_node_type_change_handler();
set_advanced_settings_change_handler();
set_image_tag_change_handler();
