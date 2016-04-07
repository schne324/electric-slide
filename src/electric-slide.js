'use strict';

/**
 * Electric Slide
 * @author Harris Schneiderman
 */

var defaults = {
  handle: '.handle', // qualified within container
  label: '#slider-label',
  values: { // this can also be an array ['Monday', 'Tuesday',...]
    min: 0,
    max: 100,
  },
  increment: 1
};

/**
 * ElectricSlide
 * @param {HTMLElement} container the slider container
 * @param {Object} userOpts  user's options
 */
function ElectricSlide(container, userOpts) {
  this.options = $.extend({}, defaults, userOpts);
  this.$container = jQuery(container);
  this.setup();
}


ElectricSlide.prototype.setup = function () {
  var options = this.options;
  var $container = this.$container;
  var $handle = this.$handle = $container.find(options.handle);

  if (options.label) {
    var $label = jQuery(options.label);
    tokenList('aria-labelledby', $handle, $label);
  }

  $handle.attr({
    role: 'slider',
    tabIndex: 0
  });

  configureAriaValue($handle, options);

  // Fire the init event
  setTimeout(function () {
    $container.trigger('electricSlide:init', [$container[0], $handle[0]]);
  });
};

/**
 * Register jQuery Plugin
 * @param  {Object} userOpts User's options
 * @return {jQuery}          Chainable
 */
$.fn.electricSlide = function (userOpts) {
  return this.each(function () {
    return new ElectricSlide(this, userOpts);
  });
};

/**
 * Helpers
 */

function tokenList(attr, target, el) {
  var $el = jQuery(el);
  var existingVal = jQuery(target).attr(attr) || '';
  if (!$el.prop('id')) {
    $el.prop('id', randy());
  }

  jQuery(target).attr(attr, [existingVal, $el.prop('id')].join(' ').trim());
}


function randy(len) {
  len = len || 7;
  for (var i = 0, str = ''; i < len; i++) {
    str += String.fromCharCode(97 + Math.floor(Math.random() * 25));
  };

  if (document.getElementById(str)) {
    return randy(len);
  }

  return str;
}

function configureAriaValue($handle, options) {
  var vals = options.values;
  var isArray = jQuery.isArray(vals)
  var minVal = (isArray) ? 1 : vals.min;
  $handle.attr({
    'aria-valuemin': minVal,
    'aria-valuemax': (isArray) ? vals.length: vals.max,
    'aria-valuenow': minVal
  });

  if (isArray) { $handle.attr('aria-valuetext', vals[0]) }
}