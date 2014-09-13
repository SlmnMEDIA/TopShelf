/**
 * @ngdoc Directives
 * @name select-field
 * @description
 * Renders a drop-down &lt;select&gt; menu along with an input label.
 * This type of component works with large enumerations and can be configured to allow for a blank/empty selection by way of an allow-blank attribute.
 *
 * @param {attribute} allow-blank The presence of this attribute indicates that an empty/blank selection should be allowed.
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} direction Specifies the select-field menu's vertical direction ('down', 'up', 'auto').
 * This attribute defaults to 'auto' which means that the menu will drop up or down based on its position within the viewport.
 * @param {Boolean} enableFiltering Enable filtering of list via a text input at the top of the dropdown.
 * @param {String} filter Two-way bindable filter string.
 * $watch this property to load remote options based on filter text.
 * (Refer to this Plunker demo for an example.)
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed before the drop-down.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {String} labelAttribute Optional override for label key in options array.
 * Defaults to "label".
 * @param {Array} options Set of options, each containing a label and value key.
 * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if no value has been selected.
 * The text "Select" will be displayed if no placeholder is provided.
 * @param {attribute} prevent-default-option Optional attribute to override default selection of the first list option.
 * Without this attribute, lists with `allow-blank` will default select the first option in the options array.
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
 * @param {String} valueAttribute Optional override for value key in options array.
 * Defaults to "value".
 *
 * @example
 * // To use this component you'll first need to define a set of options. For instance:
 * $scope.genders = [
 *   { value: 'f', label: 'Female' },
 *   { value: 'm', label: 'Male' }
 * ];
 *
 * // To render a drop-down input using the above options:
 * <select-field attribute="gender"
 *               label="Gender"
 *               options="genders">
 * </select-field>
 *
 * // If you want to make this attribute optional you can use the allow-blank attribute as follows:
 * <select-field attribute="gender"
 *               label="Gender"
 *               options="genders"
 *               allow-blank>
 * </select-field>
 */
angular.module('formFor').directive('selectField',
  function($document, $log, $timeout, $window, FieldHelper) {
    var MAX_HEIGHT = 250;
    var MIN_TIMEOUT_INTERVAL = 10;

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '=',
        filter: '=?',
        filterDebounce: '@?',
        help: '@?',
        options: '='
      },
      link: function($scope, $element, $attributes, formForController) {
        $window = $($window);

        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.enableFiltering = $attributes.hasOwnProperty('enableFiltering');
        $scope.preventDefaultOption = $attributes.hasOwnProperty('preventDefaultOption');

        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';
        $scope.placeholder = $attributes.placeholder || 'Select';
        $scope.tabIndex = $attributes.tabIndex || 0;

        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        FieldHelper.manageFieldRegistration($scope, formForController);

        /*****************************************************************************************
         * The following code pertains to filtering visible options.
         *****************************************************************************************/

        $scope.emptyOption = {};
        $scope.emptyOption[$scope.labelAttribute] = '';
        $scope.emptyOption[$scope.valueAttribute] = undefined;

        $scope.filteredOptions = [];

        var sanitize = function(value) {
          return value && value.toLowerCase();
        };

        var calculateFilteredOptions = function() {
          var options = $scope.options || [];

          $scope.filteredOptions.splice(0);

          if (!$scope.enableFiltering || !$scope.filter) {
            angular.copy(options, $scope.filteredOptions);
          } else {
            var filter = sanitize($scope.filter);

            angular.forEach(options, function(option) {
              var index = sanitize(option[$scope.labelAttribute]).indexOf(filter);

              if (index >= 0) {
                $scope.filteredOptions.push(option);
              }
            });
          }

          if ($scope.allowBlank) {
            $scope.filteredOptions.unshift($scope.emptyOption);
          }
        };

        $scope.$watch('filter', calculateFilteredOptions);
        $scope.$watch('options.length', calculateFilteredOptions);

        /*****************************************************************************************
         * The following code manages setting the correct default value based on bindable model.
         *****************************************************************************************/

        var updateDefaultOption = function() {
          var selected = $scope.selectedOption && $scope.selectedOption[[$scope.valueAttribute]];
          var matchingOption;

          if ($scope.model.bindable === selected) {

            // Default select the first item in the list
            // Do not do this if a blank option is allowed OR if the user has explicitly disabled this function
            if (!$scope.allowBlank && !$scope.preventDefaultOption && $scope.options && $scope.options.length) {
              $scope.model.bindable = $scope.options[0][$scope.valueAttribute];
            }

            return;
          }
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options.length', updateDefaultOption);

        /*****************************************************************************************
         * The following code deals with toggling/collapsing the drop-down and selecting values.
         *****************************************************************************************/

        var toggleButton = $element.find('[toggle-button]');

        $scope.$watch('model.bindable', function(value) {
          var matchingOption;

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matchingOption = option;
              }
            });

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];

          // Make sure our filtered text reflects the currently selected label (important for Bootstrap styles).
          $scope.filter = $scope.selectedOptionLabel;
        });

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
          $scope.isOpen = false;
        };

        var clickWatcher = function(event) {
          $scope.isOpen = false;
          $scope.$apply();
        };

        var listContainer = $element.find('.select-field-list-container');
        var listScroller = $element.find('.select-field-list-scrollable');
        var list = $element.find('.select-field-list');

        var scrollToValue = function(value) {
          $timeout(
            function() {
              var listItems = this.find('.select-field-list-item');
              var matchingListItem;

              for (var index = 0; index < listItems.length; index++) {
                var listItem = listItems[index];
                var option = $(listItem).scope().option;

                if (option && option[$scope.valueAttribute] === value) {
                  matchingListItem = listItem;

                  break;
                }
              }

              if (matchingListItem) {
                listScroller.scrollTop(0);

                var scrollerTop = listScroller.scrollTop();// + listScroller.offset().top;
                var scrollerHeight = listScroller.outerHeight();
                var itemTop = $(matchingListItem).position().top;
                var itemHeight = $(matchingListItem).outerHeight();

                if (scrollerHeight === 0) {
                  listScroller.scrollTop(itemTop);
                } else if (itemTop < scrollerTop) {
                  listScroller.scrollTop(itemTop);
                } else if (scrollerTop + scrollerHeight < itemTop + itemHeight) {
                  listScroller.scrollTop(itemTop - scrollerHeight + itemHeight);
                }
              }
            }.bind($element), MIN_TIMEOUT_INTERVAL);
        };

        var clickToOpen = function(event) {
          if ($scope.disable || $scope.model.disabled) {
            return;
          }

          $scope.isOpen = true;

          if ($scope.isOpen) {
            setListVerticalDirection();
            scrollToValue($scope.model.bindable);
          }

          $scope.$$phase || $scope.$digest();
        };

        $scope.$watch('isOpen', function(value) {
          $timeout(function() {
            if ($scope.isOpen) {
              toggleButton.off('click', clickToOpen);
              $document.on('click', clickWatcher);
            } else {
              toggleButton.on('click', clickToOpen);
              $document.off('click', clickWatcher);
            }
          }, MIN_TIMEOUT_INTERVAL);
        });

        /*****************************************************************************************
         * The following code controls the directionality of the drop-down (or drop-up) menu
         *****************************************************************************************/

        var shouldDropUp = function() {
          switch ($attributes.direction) {
            case 'up':
              return true;
              break;
            case 'down':
              return false;
              break;
            case 'auto':
            default:
              var offset = toggleButton.offset().top - $window.scrollTop();

              return offset + toggleButton.outerHeight() + MAX_HEIGHT > $window.height();
              break;
          }
        };

        var setListVerticalDirection = function() {
          if (shouldDropUp()) {
            $scope.dropUp = true;

            listContainer.css({
              bottom: (toggleButton.outerHeight() - 1) + 'px',
              top: 'auto'
            });
          } else {
            $scope.dropUp = false;

            listContainer.css({
              bottom: 'auto',
              top: '100%'
            });
          }
        };

        /*****************************************************************************************
         * The following code responds to keyboard events when the drop-down is visible
         *****************************************************************************************/

        var filterText = $element.find('.filter-text-input');

        $scope.mouseOver = function(index) {
          $scope.mouseOverIndex = index;
          $scope.mouseOverOption = index >= 0 ? $scope.filteredOptions[index] : null;
        };

        // Listen to key down, not up, because ENTER key sometimes gets converted into a click event.
        $scope.keyDown = function(event) {
          switch (event.keyCode) {
            case 27: // Escape key
              $scope.isOpen = false;

              // Return focus to toggle button on close (to prevent interrupting tab order)
              $timeout(toggleButton.focus.bind(toggleButton));
              break;
            case 13: // Enter key
              if ($scope.isOpen) {
                $scope.selectOption($scope.mouseOverOption);
                $scope.isOpen = false;

                // Return focus to toggle button on close (to prevent interrupting tab order)
                $timeout(toggleButton.focus.bind(toggleButton));

              } else {
                $scope.isOpen = true;

                setListVerticalDirection();
              }

              // Don't bubble up and submit the parent form
              event.preventDefault();
              break;
            case 38: // Up arrow
              if ($scope.isOpen) {
                $scope.mouseOver( $scope.mouseOverIndex > 0 ? $scope.mouseOverIndex - 1 : $scope.filteredOptions.length - 1 );

                scrollToValue($scope.mouseOverOption && $scope.mouseOverOption.value);
              } else {
                $scope.isOpen = true;
              }

              // Don't allow up/down arrows to scroll the window
              event.preventDefault();
              break;
            case 40: // Down arrow
              if ($scope.isOpen) {
                $scope.mouseOver( $scope.mouseOverIndex < $scope.filteredOptions.length - 1 ? $scope.mouseOverIndex + 1 : 0 );

                scrollToValue($scope.mouseOverOption && $scope.mouseOverOption.value);
              } else {
                $scope.isOpen = true;
              }

              // Don't allow up/down arrows to scroll the window
              event.preventDefault();
              break;

            // Tabbing (in or out) should close the menu.
            case 9:
            case 16:
              $scope.isOpen = false;
              break;

            // But all other key events should (they potentially indicate a changed type-ahead filter value).
            default:
              $scope.isOpen = true;
              break;
          }
        };

        $scope.$watchCollection('[isOpen, filteredOptions.length]', function() {
          $scope.mouseOver(-1); // Reset hover anytime our list opens/closes or our collection is refreshed.

          // Pass focus through to filter field when select is opened
          if ($scope.isOpen && $scope.enableFiltering) {
            $timeout(filterText.focus.bind(filterText));
          }
        });

        $scope.$on('$destroy', function() {
          $document.off('click', clickWatcher);
        });
      }
    };
  });
