'use strict';

app.directive('ticker', function ($timeout, $parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, controller) {
      var originalText = '', elText = '', tickDelay = 0, tickInterval, mustTick = false;

      $timeout(function () {
        if ($(element).innerWidth() < element[0].scrollWidth) {
          elText = originalText = element.text().trim();
          mustTick = true;
        }
      }, 0);

      attrs.$observe('ticker', function (val) {
        if ($parse(val)(scope) === true && mustTick) {
          tickDelay = 2;
          tickInterval = setInterval(function () {
            if (elText.length) {
              if (tickDelay === 0) {
                elText = elText.substring(elText[0] === ' ' ? 2 : 1);
              } else {
                tickDelay--;
              }
            } else {
              elText = originalText;
              tickDelay = 20;
              $(element).css({display: 'none'});
              $(element).fadeIn();
            }
            element.text(elText);
          }, 120);
        }

        if ($parse(val)(scope) === false && mustTick) {
          clearInterval(tickInterval);
          elText = originalText;
          element.text(elText);
          tickDelay = 0;
        }
      });

    }
  };
});