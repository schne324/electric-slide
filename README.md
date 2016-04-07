# Electric slide
## It's electric!
Accessible slider plugin

## Options
- todo: document options

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
          // set initial slider state
          $(handle).attr('aria-valuenow', '10');
        });
    ```

## DEV
- `npm i && bower i`
- Run server: `gulp server` (this builds -> sets up watcher -> runs server (which restarts when js file updated))
- Build demo: `gulp` or `gulp build`