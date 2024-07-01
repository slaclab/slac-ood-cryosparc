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
function toggle_visibilty_of_form_group(form_id, show) {
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

  toggle_visibilty_of_form_group(
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

  let datadir = $('#batch_connect_session_context_CRYOSPARC_DATADIR')[0]
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_CRYOSPARC_DATADIR',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_CRYOSPARC_DATADIR')[0].value = datadir.defaultValue

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
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_SINGULARITY_OPTIONS',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_SINGULARITY_OPTIONS')[0].value = singularity_options.defaultValue

  let bootstrap = $('#batch_connect_session_context_OOD_BOOTSTRAP_SCRIPT')[0]
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_OOD_BOOTSTRAP_SCRIPT',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_OOD_BOOTSTRAP_SCRIPT')[0].value = bootstrap.defaultValue

  let master = $('#batch_connect_session_context_CRYOSPARC_MASTER_PATH')[0]
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_CRYOSPARC_MASTER_PATH',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_CRYOSPARC_MASTER_PATH')[0].value = master.defaultValue

  let worker = $('#batch_connect_session_context_CRYOSPARC_WORKER_PATH')[0]
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_CRYOSPARC_WORKER_PATH',
    toggle.checked == true ? true : false
  );
  $('#batch_connect_session_context_CRYOSPARC_WORKER_PATH')[0].value = worker.defaultValue

}

function set_advanced_settings_change_handler() {
  let toggle = $('#batch_connect_session_context_advanced_settings');
  advanced_settings_change_handler()
  toggle.change( advanced_settings_change_handler );
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
