'use strict';

/**
 * Electric Slide
 * @author Harris Schneiderman
 */

var defaults = {
  handle: '.handle', // qualified within container
  label: null,
  values: { // this can also be an array ['Monday', 'Tuesday',...]
    min: 0,
    max: 100
  },
  increment: 1
};

/**
 * ElectricSlide
 * @param {HTMLElement} container the slider container
 * @param {Object} userOpts  user's options
 */
function ElectricSlide(container, userOpts) {
  this.options = jQuery.extend({}, defaults, userOpts);
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

  this.currentValue = $handle.attr('aria-valuenow');


  this.mapSlideArea(); // TODO: for responsive stuff call this onresize
  this.attachEvents();
  // Fire the init event
  setTimeout(function () {
    $container.trigger('electricSlide:init', [$container[0], $handle[0]]);
  });

  this.goTo(this.currentValue);
};

ElectricSlide.prototype.mapSlideArea = function () {
  var vals = this.options.values;
  var width = this.$container.width();
  var diff = jQuery.isArray(vals) ? vals.length - 1 : vals.max - vals.min;
  this.totalWidth = width;
  this.incrementWidth = width / diff;
};

ElectricSlide.prototype.attachEvents = function () {
  var that = this;

  this.$handle
    // arrow key
    .off('keydown.electricSlide')
    .on('keydown.ElectricSlide', function (e) {
      var which = e.which;
      if (which >= 37 && which <= 40) {
        e.preventDefault(); // don't scroll
        that.onArrow(which);
      }
    });
  this.$container
    // drag
    .on('mousedown.electricSlide', function () {
      that.$container // TODO: if sloppy drag is desired, attach it to the document...
        .on('mousemove.electricSlide', function (e) {
          var posNow = { x: e.pageX, y: e.pageY };
          console.log('posNow: ', posNow);

          if (that.lastPos) {
            // calculate where on the slider

          }

          that.lastPos = posNow;
        });
    });
  $(document).on('mouseup.electricSlide', function () {
    that.$container.off('mousemove.electricSlide');
  });

};

ElectricSlide.prototype.onArrow = function (which) {
  var isForward = which === 38 || which === 39;
  var currentValue = parseInt(this.currentValue);
  var inc = parseInt(this.options.increment);
  this.goTo((isForward) ? currentValue + inc : currentValue - inc);
};

ElectricSlide.prototype.goTo = function (value) {
  var vals = this.options.values;
  var isArray = jQuery.isArray(vals);
  var isOutlier = value < vals.min || value > vals.max;
  if (isOutlier || (isArray && !vals[value])) { return; }
  if (isArray) {
    this.$handle.attr('aria-valuetext', vals[value]);
  }

  this.currentValue = value;
  this.$handle.attr('aria-valuenow', value);
  // move the slider visually to the new value
  move(this.$handle, this.incrementWidth, this.options)

  this.$container.trigger('electricSlide:change', [this.$container[0], this.$handle[0]])
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

// ensures token list attributes dont get clobbered
function tokenList(attr, target, el) {
  var $el = jQuery(el);
  var existingVal = jQuery(target).attr(attr) || '';
  if (!$el.prop('id')) {
    $el.prop('id', randy());
  }

  jQuery(target).attr(attr, [existingVal, $el.prop('id')].join(' ').trim());
}

// generates unique id
function randy(len) {
  len = len || 7;
  for (var i = 0, str = ''; i < len; i++) {
    str += String.fromCharCode(97 + Math.floor(Math.random() * 25));
  };

  // dont create duplicate ids
  if (document.getElementById(str)) {
    return randy(len);
  }

  return str;
}

function configureAriaValue($handle, options) {
  var vals = options.values;
  var isArray = jQuery.isArray(vals);
  var minVal = (isArray) ? 0 : vals.min;
  $handle.attr({
    'aria-valuemin': minVal,
    'aria-valuemax': (isArray) ? vals.length: vals.max,
    'aria-valuenow': minVal
  });

  if (isArray) { $handle.attr('aria-valuetext', vals[0]) }
}

function move($handle, incrementWidth, options) {
  var halfWidth = $handle.width() / 2;
  var valNow = parseInt($handle.attr('aria-valuenow'));
  var valMin = parseInt($handle.attr('aria-valuemin'));
  var moveTo = (valNow - valMin) * incrementWidth;
  $handle.css('margin-left', [(moveTo - halfWidth).toString(), 'px'].join(''));
}