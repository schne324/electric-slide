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
  initialValue: null,
  increment: 1,
  highlight: false,
  disabled: false,
  help: false
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

  if (options.disabled) {
    this.disable();
  }

  if (options.help) {
    tokenList('aria-describedby', $handle, jQuery(options.help));
  }

  if (options.highlight) {
    var $fill = jQuery('<span />').addClass('electric-fill');
    $container.prepend($fill);
    this.$fill = $fill;
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

  if (this.options.initialValue) {
    this.goTo(this.options.initialValue);
  } else {
    this.goTo(this.currentValue);
  }
};

ElectricSlide.prototype.mapSlideArea = function () {
  var vals = this.options.values;
  var width = this.$container.width();
  var diff = jQuery.isArray(vals) ? vals.length - 1 : vals.max - vals.min;
  this.totalWidth = width;
  this.incrementWidth = width / diff;
};

ElectricSlide.prototype.attachEvents = function () {
  var $document = jQuery(document);
  var that = this;

  this.$handle
    // arrow key
    .off('keydown.electricSlide')
    .on('keydown.ElectricSlide', function (e) {
      if (that.disabled) { return; }
      var which = e.which;
      if (which >= 37 && which <= 40) {
        e.preventDefault(); // don't scroll
        that.onArrow(which);
      }
    });
  this.$container
    // drag
    .off('mousedown.electricSlide')
    .on('mousedown.electricSlide', function (e) {
      if (e.which === 3 || that.disabled) { return; }
      $document // this allows for sloppy drags
        .on('mousemove.electricSlide', function (e) {
          var x = e.pageX; // TODO: for vertical sliders, use e.pageY
          that.onDrag(x - that.$container.offset().left);
        });
    });

  $document.on('mouseup.electricSlide', function () {
    $document.off('mousemove.electricSlide');
  });

  this.$container
    // jump to
    .on('mousedown', function (e) {
      if (e.which === 3 || that.disabled) { return; }
      if (!jQuery(e.target).is(that.$handle[0])) {
        that.onDrag(e.offsetX, true);
      }
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
  this.move();
  // trigger change event
  this.$container.trigger('electricSlide:change', [this.$container[0], this.$handle[0]]);
};

ElectricSlide.prototype.disable = function () {
  this.disabled = true;
  this.$container.addClass('disabled');
  this.$handle.attr('aria-disabled', true);
};

ElectricSlide.prototype.enable = function () {
  this.disabled = false;
  this.$container.removeClass('disabled');
  this.$handle.removeAttr('aria-disabled');
};

// TODO: rename this because it is utilized for jump-to funcionality as well as drag
ElectricSlide.prototype.onDrag = function (offsetLeft, force) {
  var units = offsetLeft / this.incrementWidth;
  if (!jQuery.isArray(this.options.values)) {
    units = Math.floor(this.options.values.min + units);
    var grissle = units % this.options.increment;
    if ((grissle > 0) && !force) {
      return;
    } else if (force) {
      units = roundTo(units, this.options.increment);
    }
  } else {
    var dec = units - Math.floor(units);
    if (dec > 0.5) { // round up
      units = Math.ceil(units);
    } else { // round down
      units = Math.floor(units);
    }
  }

  this.goTo(units);
};

ElectricSlide.prototype.move = function () {
  var $handle = this.$handle;
  var valNow = parseInt($handle.attr('aria-valuenow'));
  var valMin = parseInt($handle.attr('aria-valuemin'));
  var moveTo = (valNow - valMin) * this.incrementWidth;
  var offset = [(moveTo - ($handle.width() / 2)).toString(), 'px'].join('');
  $handle.css('margin-left', offset);

  if (this.options.highlight) {
    this.$fill.css('width', offset);
  }
}

/**
 * Register jQuery Plugin
 * @param  {Object} userOpts User's options
 * @return {jQuery}          Chainable
 */
jQuery.fn.electricSlide = function (userOpts) {
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
  }

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

  if (isArray) { $handle.attr('aria-valuetext', vals[0]); }
}

// rounds to the nearest increment
function roundTo(n, inc) {
  var grissle = n % inc;
  if (grissle <= (inc/2)) {
    return n - grissle;
  } else {
    return n + inc - grissle;
  }
}