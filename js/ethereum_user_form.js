/**
 * @file
 */

(function ($) {

  Drupal.behaviors.hellothereum_user_form = {
    attach: function (context, settings) {
      $('#ethereum_user_address a').click(function () {
        $('#hellothereum-user-form').toggle('fast');
      });
    }
  }
}(jQuery));
