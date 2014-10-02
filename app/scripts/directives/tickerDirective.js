'use strict';

app.directive('ticker', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, controller) {
      var originalText = '', elText = '', tickDelay = 0, tickInterval, tickerEnabled = false;

      $timeout(function () {
        if ($(element).innerWidth() < element[0].scrollWidth) {
          elText = originalText = element.text().trim();
          tickerEnabled = true;
        }
      }, 0);

      attrs.$observe('ticker', function (val) {
        //Why is val no primitive?!
        if (val === 'true' && tickerEnabled) {
          tickInterval = setInterval(function () {
            if (elText.length) {
              if (tickDelay === 0) {
                elText = elText.substring(elText.charAt(0) === ' ' ? 2 : 1);
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
          }, 100);
        }

        if (val === 'false' && tickerEnabled) {
          clearInterval(tickInterval);
          elText = originalText;
          element.text(elText);
          $(element).css({display: 'none'});
          $(element).fadeIn();
          tickDelay = 0;
        }
      });

    }
  };
});