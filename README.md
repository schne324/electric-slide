# Electric slide
## It's electric!
Accessible slider plugin

## Usage
Called on the element which contains the handle.

### jQuery

```javascript
jQuery(container).electricSlide(options);
```

### Contructor

```javascript
new ElectricSlide(container, options);
```

## Options
- `handle`: The selector for the handle element (qualified within the container). Defaults to: `'.handle'`.

- `label` (optional): The selector for the label element.  An `aria-labelledby` association between the handle and the label element(s) will be made.

- `help` (optional): The selector for the help text.  An `aria-describedby` association between the handle and the help text element(s) will be made.

- `values`: Either an array of values or an object containing the following properties:
  - `min`: the minimum value
  - `max`: the maximum value
  - defaults to:

  ```javascript
    {
      min: 0,
      max: 100
    }
  ```
- `increment` (optional): The amount to increment/decrement within the values of the slider (should really only be used with the object form of the `values` option).

- `initialValue` (optional): The initial value to be set on the slider.

- `highlight` (optional): Fill in the slider area up to the handle.

- `disable` (optional): Disable the slider.

## Events
- `electricSlide:init`: Fired when the slider is initialized.
  - Params:
    - `e` the jQuery event object
    - `container` the slider container
    - `handle` the slider handle
  - Example:

    ```javascript
      $('.electric-slide')
        .electricSlide()
        .on('electricSlide:init', function (e, container, handle) {
          $('body').addClass('slider-initialized');
        });
    ```
- `electricSlide:change`: Fired when the slider's value is changed.
  - Params:
    - `e` the jQuery event object
    - `container` the slider container
    - `handle` the slider handle
  - Example:

    ```javascript
      $('.electric-slide')
        .electricSlide({
          values: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        })
        .on('electricSlide:change', function (e, container, handle) {
          $(container).find('.tooltip').text($(handle).attr('aria-valuetext'))
        });
    ```

## Public Methods
- `ElectricSlide#disable`: disable the slider
- `ElectricSlide#enable`: enable the slider
- Example:

  ```javascript
    var container = document.querySelector('.electric-slide');
    var slider = new ElectricSlide(container);
    slider.disable();
  ```

## DEV
- `npm i && bower i`
- Run server: `gulp server` (this builds -> sets up watcher -> runs server (which restarts when js file updated))
- Build demo: `gulp` or `gulp build`