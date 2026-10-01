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
 * CryoSPARC v5 keeps its database in a directory of its own, so that the v4
 * database it was migrated from stays intact and a v4 session remains possible.
 * The "-v5" suffix is the marker, which makes this toggle idempotent and keeps
 * working for users who have moved their data directory into a project folder.
 */
const V5_SUFFIX = '-v5';

function selected_version_is_v5() {
  let tag = $('#batch_connect_session_context_SINGULARITY_IMAGE_TAG').val();
  return typeof tag === 'string' && tag.startsWith('5.');
}

function image_tag_change_handler() {
  let datadir = $('#batch_connect_session_context_CRYOSPARC_DATADIR');
  let migrate_from = $('#batch_connect_session_context_CRYOSPARC_MIGRATE_FROM');
  let path = datadir.val() || '';

  if (selected_version_is_v5()) {
    // Whatever the user has configured is the v4 database we migrate from; the
    // v5 instance lives in a sibling directory next to it.
    let v4_path = path.endsWith(V5_SUFFIX) ? path.slice(0, -V5_SUFFIX.length) : path;
    datadir.val(v4_path + V5_SUFFIX);
    toggle_visibility_of_form_group(
      '#batch_connect_session_context_CRYOSPARC_MIGRATE_FROM', true
    );
    migrate_from.val(v4_path);
  } else {
    if (path.endsWith(V5_SUFFIX)) {
      datadir.val(path.slice(0, -V5_SUFFIX.length));
    }
    // Hiding blanks the field, which is what we want: v4 ignores it entirely.
    toggle_visibility_of_form_group(
      '#batch_connect_session_context_CRYOSPARC_MIGRATE_FROM', false
    );
  }
}

function set_image_tag_change_handler() {
  let tag_input = $('#batch_connect_session_context_SINGULARITY_IMAGE_TAG');
  image_tag_change_handler();
  tag_input.change(image_tag_change_handler);
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
