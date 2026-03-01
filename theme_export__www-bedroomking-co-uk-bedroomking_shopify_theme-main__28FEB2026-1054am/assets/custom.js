/**
 * JAVASCRIPT DEVELOPER DOCUMENTATION
 *
 * Enterprise is a powerful and customizable theme designed for large-scale e-commerce stores. Built
 * using Web Components, it offers a highly modular architecture that makes customization and
 * maintenance easier than ever. In addition, Enterprise is optimized for speed, ensuring that your
 * store runs as fast as possible to provide your customers with a seamless shopping experience.
 *
 * If you would like to add your own JS to Enterprise, we recommend using this file and referencing
 * it using Theme Settings > Advanced > Custom HTML.
 *
 * As a brief overview, Enterprise:
 *  - Broadcasts many JS events.
 *  - Is built using Web Components.
 *  - Follows a 'code splitting' architecture.
 *  - Is completely custom built (no JS libraries other than instant.page)
 *  - Has a number of JS utilities.
 *
 *
 *
 * =================================================================================================
 * Custom JavaScript Events
 * =================================================================================================
 *
 * Enterprise broadcasts many custom events for ease of extensibility, detailed in this section.
 *
 * When in the Theme Editor, the details of each custom event will be logged out in the Dev Tools
 * console everytime it is triggered.
 *
 * Events are named in the following convention: ["on/dispatch"]:[subject]:[action] (where
 * 'dispatch' will trigger an event to occur, and 'on' indicates an event has occurred).
 *
 * All 'Return data' detailed in this section is returned within the 'event.detail' object.
 *
 * The available events are:
 *  1.  on:variant:change
 *  2.  on:cart:add
 *  3.  on:cart:error
 *  4.  on:line-item:change
 *  5.  on:cart-drawer:before-open
 *  6.  on:cart-drawer:after-open
 *  7.  on:cart-drawer:after-close
 *  8.  on:quickbuy:before-open
 *  9.  on:quickbuy:after-open
 *  10. on:quickbuy:after-close
 *  11. dispatch:cart-drawer:open
 *  12. dispatch:cart-drawer:refresh
 *  13. dispatch:cart-drawer:close
 *  14. on:debounced-resize
 *  15. on:breakpoint-change
 *
 * -------------------------------------------------------------------------------------------------
 * 1) on:variant:change
 * -------------------------------------------------------------------------------------------------
 * Fires whenever a variant is selected (e.g. Product page, Quickbuy, Featured Product etc).
 *
 * How to listen:
 * document.addEventListener('on:variant:change', (event) => {
 *  // your code here
 * });
 *
 * Returned data:
 *  - form: the product form content
 *  - variant: the selected variant object
 *  - product: the product object (includes a list of all variants)
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 2) on:cart:add
 * -------------------------------------------------------------------------------------------------
 * Fires when a variant has been added to the cart, where it didn't exist in the cart before. This
 * event does not fire when the added variant was already in the cart. To listen for this, see the
 * on:line-item:change event.
 *
 * How to listen:
 * document.addEventListener('on:cart:add', (event) => {
 *   // your code here
 * });
 *
 * Returned data:
 *   - cart: the new cart object after the variant was added
 *   - variantId: id of the variant that was just added to the cart
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 3) on:line-item:change
 * -------------------------------------------------------------------------------------------------
 * Fires when the quantity of an item already in the cart is updated. Note, if the 'newQuantity' is
 * 0, this indicates the item was removed from that cart.
 *
 * Note, when adding a variant to the cart - this event will fire if that variant is already in the
 * cart (i.e. the quantity is incremented). In this situation, 'on:cart:add' will not fire.
 *
 * How to listen:
 * document.addEventListener('on:line-item:change', (event) => {
 *   // your code here
 * });
 *
 * Returned data:
 *   - cart: the new cart object after the quantity change was completed
 *   - variantId: id of the variant that was just updated
 *   - newQuantity: new quantity of the line item
 *   - oldQuantity: old quantity of the line item
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 4) on:cart:error
 * -------------------------------------------------------------------------------------------------
 * Fires when an action related to the cart has failed, for example adding too much quantity of an
 * item to the cart.
 *
 * How to listen:
 * document.addEventListener('on:cart:error', (event) => {
 *   // your code here
 * });
 *
 * Returned data:
 *   - error: the error message
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 5) on:cart-drawer:before-open
 * -------------------------------------------------------------------------------------------------
 * Fires before the cart drawer opens.
 *
 * How to listen:
 * document.addEventListener('on:cart-drawer:before-open', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 6) on:cart-drawer:after-open
 * -------------------------------------------------------------------------------------------------
 * Fires after the cart drawer has finished opening.
 *
 * How to listen:
 * document.addEventListener('on:cart-drawer:after-open', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 7) on:cart-drawer:after-close
 * -------------------------------------------------------------------------------------------------
 * Fires after the cart drawer has finished closing.
 *
 * How to listen:
 * document.addEventListener('on:cart-drawer:after-close', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 8) on:quickbuy:before-open
 * -------------------------------------------------------------------------------------------------
 * Fires before the quick buy drawer opens.
 *
 * How to listen:
 * document.addEventListener('on:quickbuy:before-open', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 9) on:quickbuy:after-open
 * -------------------------------------------------------------------------------------------------
 * Fires after the quick buy drawer has finished opening.
 *
 * How to listen:
 * document.addEventListener('on:quickbuy:after-open', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 10) on:quickbuy:after-close
 * -------------------------------------------------------------------------------------------------
 * Fires after the quick buy drawer has finished closing.
 *
 * How to listen:
 * document.addEventListener('on:quickbuy:after-close', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 11) dispatch:cart-drawer:open
 * -------------------------------------------------------------------------------------------------
 * Opens the cart drawer (if enabled in the Theme Settings).
 *
 * How to trigger:
 * document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
 *
 * You can optionally pass in a 'detail' object with a property of 'opener', which specifies the DOM
 * element that should be focussed on when the drawer is closed.
 *
 * Example:
 * document.getElementById('header-search').addEventListener('keydown', (evt) => {
 *   if (evt.keyCode === 67) {
 *     evt.preventDefault();
 *     document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open', {
 *       detail: {
 *         opener: evt.target
 *       }
 *     }));
 *   }
 * });
 *
 * In this example, we attach a keydown listener to the search input in the header. If the user
 * presses the 'c' key, it prevents the default behavior (which would be to type the letter 'c' in
 * the input) and dispatches the 'dispatch:cart-drawer:open' event with a 'detail' object that
 * specifies the search input as the opener. When the cart drawer is closed, focus is returned to
 * the search input.
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 12) dispatch:cart-drawer:refresh
 * -------------------------------------------------------------------------------------------------
 * Refreshes the contents of the cart drawer.
 *
 * This event is useful when you are adding variants to the cart and would like to instruct the
 * theme to re-render the cart drawer.
 *
 * How to trigger:
 * document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:refresh', {
 *   bubbles: true
 * }));
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 13) dispatch:cart-drawer:close
 * -------------------------------------------------------------------------------------------------
 * Closes the cart drawer.
 *
 * How to trigger:
 * document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:close'));
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 14) on:debounced-resize
 * -------------------------------------------------------------------------------------------------
 * Fires when the viewport finishes resizing (debounced to 300ms by default).
 *
 * How to listen:
 * window.addEventListener('on:debounced-resize', (event) => {
 *   // your code here
 * });
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 15) on:breakpoint-change
 * -------------------------------------------------------------------------------------------------
 * Fires when the breakpoint of the viewport changes. See the 'Media Queries' section in this file
 * for more.
 *
 * Example:
 * window.addEventListener('on:breakpoint-change', (event) => {
 *  if (theme.mediaMatches.md) {
 *   console.log('we are not on mobile');
 *  }
 * });
 *
 *
 *
 * =================================================================================================
 * Web Components
 * =================================================================================================
 *
 * Enterprise utilizes Web Components to the fullest.
 *
 * Web Components are a set of standardized APIs that allow developers to create custom, reusable
 * HTML elements that can be used across different web pages and applications.
 * Web Components consist of three main technologies: Custom Elements, Shadow DOM and HTML
 * Templates.
 *
 * See Mozilla for more: https://developer.mozilla.org/en-US/docs/Web/Web_Components
 *
 *
 *
 * =================================================================================================
 * Third-Party JavaScript Dependencies
 * =================================================================================================
 *
 * Enterprise only has one third-party dependency: instant.page (https://instant.page/).
 *
 * It's included locally and is only active if it has been enabled in
 * 'Theme Settings > Advanced > Preload links on hover'.
 *
 * Instant.page is a JavaScript library that speeds up page loads by preloading links as soon as the
 * customer hovers over them.
 *
 *
 *
 * =================================================================================================
 * Code Splitting
 * =================================================================================================
 * We followed the ‘code splitting’ technique when building Enterprise.
 *
 * Code splitting consists in writing JavaScript (and CSS)in a modularized way within typically
 * small, more manageable files that can be loaded on-demand, as needed. The idea is to improve the
 * performance of our theme by reducing the amount of code that needs to be loaded upfront.
 *
 * If the customer is visiting a specific page of the theme that requires certain JavaScript
 * functionality, only the code needed for that page will be loaded, rather than one large
 * JavaScript file containing largely unused code. For example, the file media-gallery.js will
 * only be loaded if there is a media gallery on the page.
 *
 * Shopify uses HTTP/2, which is the newer version of the HTTP protocol used to deliver web content.
 * HTTP/2 supports multiplexing, which means that multiple requests can be sent over a single
 * connection at the same time - meaning multiple JS files are essentially served at the speed of a
 * single file.
 *
 * The only JS file which is served on every page in Enterprise is 'main.aio.min.js'. Main.js contains
 * utility JS which is likely to be needed by many scripts. This is outlined more in the next
 * section.
 *
 *
 *
 * =================================================================================================
 * Utilities
 * =================================================================================================
 * Enterprise provides a few utility utilities, contained in main.js. Some of the key ones are
 * outlined below. See main.js for more.
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 1) Lazy Loading
 * -------------------------------------------------------------------------------------------------
 * Lazy loading is a technique for delaying the loading of certain elements until they are needed,
 * which can help improve page load times.
 *
 * We use three functions used for lazy loading images and scripts in our theme:
 *
 *  - setImageSources function - copies the data-src and data-srcset attributes of lazy loaded
 *    images to their src and srcset attributes.
 *  - initLazyImages function - uses the IntersectionObserver API to lazy load images when needed.
 *  - initLazyScript function - only loads a script when a specific element is scrolled into view.
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 2) Cookies
 * -------------------------------------------------------------------------------------------------
 * Cookies are small pieces of data that can be stored on a user's computer. They can be useful for
 * tracking user activity, remembering user preferences or other similar purposes.
 *
 * We use three functions to manage cookies:
 *
 *  - setCookie function - sets a cookie with a given name, value and number of days until it
 *  should expire.
 *  - getCookie function - takes in the name of a cookie to retrieve its value.
 *  - deleteCookie function - takes in the name of a cookie to delete it.
 *
 *
 * -------------------------------------------------------------------------------------------------
 * 3) Media Queries
 * -------------------------------------------------------------------------------------------------
 * The theme creates a theme.mediaMatches object (in theme.liquid) for several key screen sizes
 * specified in our theme, and adds listeners for each media query.
 *
 * These are:
 *
 * mediaQueries: {
 *  sm: '(min-width: 600px)',
 *  md: '(min-width: 769px)',
 *  lg: '(min-width: 1024px)',
 *  xl: '(min-width: 1280px)',
 *  xxl: '(min-width: 1536px)',
 *  portrait: '(orientation: portrait)'
 * }
 *
 * If a breakpoint is crossed, the mediaMatches values are updated and an 'on:breakpoint-change'
 * event is dispatched.
 *
 * You can request the entire theme.mediaMatches object to check which media queries are currently
 * matched. In this case, the returned data will be an object with the names of the media queries as
 * keys, and boolean values indicating whether they are currently matched or not.
 *
 * Example:
 *
 * {
 *  sm: true,
 *  md: true,
 *  lg: true,
 *  xl: true,
 *  xxl: false,
 *  portrait: false
 * }
 *
 * You can reference a specific media query to check if it's currently matched by using:
 * theme.mediaMatches.lg.
 *
 * To check if you're on mobile you can use:
 * !theme.mediaMatches.md
 *
 * If you want to perform some action when the breakpoint changes, you can listen for the
 * breakpoint-change event on the window object.
 *
 * Example:
 * window.addEventListener('on:breakpoint-change', (event) => {
 *  // your code here
 * });
 *
 * =================================================================================================
 *
 * Have fun! - The Clean Canvas Development Team.
 */

Shopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /{{\s*(\w+)\s*}}/;
  var formatString = format || this.money_format;
  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100.0).toFixed(precision);
    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";
    return dollars + cents;
  }
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }
  return formatString.replace(placeholderRegex, value);
};

$(document).on({
  contextmenu: function (e) {
    //console.log("ctx menu button:", e.which);
    // Stop the context menu
    e.preventDefault();
  },
  mousedown: function (e) {
    //console.log("normal mouse down:", e.which);
  },
  mouseup: function (e) {
    //console.log("normal mouse up:", e.which);
  },
});
document.onkeydown = function (e) {
  if (
    e.ctrlKey &&
    (e.keyCode === 67 ||
      e.keyCode === 86 ||
      e.keyCode === 85 ||
      e.keyCode === 117)
  ) {
    //alert('not allowed');
    return false;
  } else {
    return true;
  }
};
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key == "p") {
    alert("This section is not allowed to print or export to PDF");
    e.cancelBubble = true;
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key == "PrintScreen") {
    navigator.clipboard.writeText("");
    alert("Screenshots disabled!");
  }
});

$("body").on("dragstart drop", function (e) {
  e.preventDefault();
  return false;
});


$(document).ready(() => {
  // 1️⃣ Only do *any* of the Trustpilot logic on /collections/ pages:
  if (!window.location.pathname.startsWith('/collections/')) {
    console.log('🔍 Not a collection page — skipping Trustpilot handler.');
    return;
  }

  // 2️⃣ Scoped mover function
  const moveTrustpilotWidgetAboveFooter = () => {
    const $trustWidget = $('#trustpilot-widget-trustbox-0-wrapper');
    const $footer      = $('footer');

    if ($trustWidget.length && $footer.length) {
      console.log('✅ Trustpilot widget found. Moving it above footer.');
      $trustWidget.insertBefore($footer);
      return true;
    }
    return false;
  };

  // 3️⃣ Poll until success or max attempts
  const maxAttempts = 10;
  let attempts      = 0;

  const intervalId = setInterval(() => {
    attempts++;
    if (moveTrustpilotWidgetAboveFooter() || attempts >= maxAttempts) {
      if (attempts >= maxAttempts && !moveTrustpilotWidgetAboveFooter()) {
        console.warn('❌ Trustpilot widget not found after 10 attempts.');
      }
      clearInterval(intervalId);
    }
    
  }, 500);
});

// Function: Add full text as 'title' attribute for product titles (for tooltip on hover)

  $(".products-grid-container .grid li .card--product .card__title").each(
    function () {
      var titleText = $(this).text().trim(); // create variable for title text
      $(this).attr("title", titleText); // set it as title attribute
    }
  );


// – Shows the matching Bed specs whenever a size is selected

// Bed Frame Specs Display Controller (with load + delay)
$(window).on('load', function() {
  // wait a bit for all DPO elements to render
  setTimeout(function() {
    var $specs  = $('.bed-details-container .specs').hide(),
        $radios = $('.frame-size .options-list input[type="radio"]');

    // on change, hide all then show the matching panel
    $radios.on('change', function() {
      var labelText = $(this).closest('.field').find('.dpo_title span').first().text().trim();
      var sizeKey   = labelText.split(' ')[0].toLowerCase();

      $specs.hide();
      var $target = $('#if-size-' + sizeKey);
      if (sizeKey === '6ft') {
        $target.css('display', 'flex');
      } else {
        $target.show();
      }
    });

    // initialize if something was pre-checked
    $radios.filter(':checked').trigger('change');

    // default to 3ft if nothing’s checked
    if (!$radios.is(':checked')) {
      $('#if-size-3ft').show();
    }

   
    var $select = $('#bed-size-select');
    function updateSpecs() {
      var txt = $select.find('option:selected').text().trim(); // e.g., "4ft6 Double"
      console.log('selected size', txt);
      var m = txt.match(/^(\d+ft6?)/i);                        // "3ft", "4ft", "4ft6", "5ft", "6ft"
      $specs.hide();
      var targetId = m ? '#if-size-' + m[1].toLowerCase() : '#if-size-3ft';
      $(targetId).css('display', 'flex');                      // ensure flex layout
    }

    // init + bind
    updateSpecs();
    $select.on('change', updateSpecs);

       
  }, 500); 
});

document.addEventListener('click', function(e){
  const a = e.target.closest('a.bed-dimensions');
  if(!a) return;
  // e.preventDefault();  // keeps URL unchanged
  const target = document.getElementById('bed-dimensions');
  if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
});


// $(window).on('load', function() {
  
//   setTimeout(function() {
//     var $addBtn = $('[dpo_add2cart]');

//     // disable Add to Cart initially
//     $addBtn.prop('disabled', true).addClass('disabled');

    
//     // enabling it when conditions are met
//     $(document).on('dpo:validationPassed', function() {
//       $addBtn.prop('disabled', false).removeClass('disabled');
//     });

//     $(document).on('dpo:validationFailed', function() {
//       $addBtn.prop('disabled', true).addClass('disabled');
//     });

//   }, 500); 
// });

(function ($) {
  var ROOT = '#itoris_dynamicproductoptions';
  var ADD = '[dpo_add2cart]';
  var SCROLL_OFFSET = 80;

  function setBtn(disabled) {
    var $b = $(ADD);
    disabled = !!disabled;
    $b.prop('disabled', disabled)
      .toggleClass('disabled is-disabled', disabled)
      .attr('aria-disabled', disabled ? 'true' : 'false');
  }

  function visible($el) {
    return $el.is(':visible') &&
           !$el.is('[hidden]') &&
           $el.css('visibility') !== 'hidden' &&
           $el.closest('.ihidden,[aria-hidden="true"]').length === 0;
  }

  function getRequiredBlocks($root) {
    var $fields = $root.find('div.field').filter(function(){ return visible($(this)); });
    return $fields.filter(function () {
      var $f = $(this);
      if ($f.find('label.required').length) return true;
      if ($f.find('.options-list[validation*="required"]').length) return true;
      if ($f.find('select[validation*="required"]').length) return true;
      return false;
    });
  }

  function blockOK($block) {
    if (!visible($block)) return true;

    var $radios = $block.find('input[type="radio"]').filter(function(){
      var $r = $(this); return visible($r) && !$r.prop('disabled');
    });
    if ($radios.length) return $radios.is(':checked');

    var $selects = $block.find('select').filter(function(){
      var $s = $(this); return visible($s) && !$s.prop('disabled');
    });
    if ($selects.length) {
      var okSel = true;
      $selects.each(function(){
        var txt = String($(this).find('option:selected').text() || '');
        var v = $(this).val();
        if (v === null || v === '' || /^--\s*Please\s*Select/i.test(txt)) { okSel = false; return false; }
      });
      if (!okSel) return false;
    }

    var $texts = $block.find('input[type="text"],input[type="number"],input[type="email"],input[type="tel"],textarea')
                       .filter(function(){ return visible($(this)) && !$(this).prop('disabled'); });
    if ($texts.length) {
      var allFilled = true;
      $texts.each(function(){
        if (String($(this).val() || '').trim() === '') { allFilled = false; return false; }
      });
      if (!allFilled) return false;
    }

    var $files = $block.find('input[type="file"]').filter(function(){ return visible($(this)) && !$(this).prop('disabled'); });
    if ($files.length) {
      var allChosen = true;
      $files.each(function(){ if (!this.files || !this.files.length) { allChosen = false; return false; } });
      if (!allChosen) return false;
    }

    return true;
  }

  function firstInvalid($blocks) {
    var bad = null;
    $blocks.each(function(){
      var $b = $(this);
      if (!blockOK($b)) { bad = $b; return false; }
    });
    return bad;
  }

  function validate() {
    var $root = $(ROOT);
    if (!$root.length) { setBtn(true); return; }

    var $req = getRequiredBlocks($root);
    if (!$req.length) { setBtn(false); $(document).data('dpoBad', null); return; }

    var bad = firstInvalid($req);
    setBtn(!!bad);
    $(document).data('dpoBad', bad || null);
  }

  // === NEW: 500ms debounce wrapper ===
  var validateTimer = null;
  function validateDebounced() {
    clearTimeout(validateTimer);
    validateTimer = setTimeout(validate, 500); // <- 500ms delay requested
  }

  function scrollToBad() {
    var $bad = $(document).data('dpoBad');
    if (!$bad || !$bad.length) return;
    var top = Math.max(0, $bad.offset().top - SCROLL_OFFSET);
    $('html,body').stop(true).animate({scrollTop: top}, 320);
    $bad.addClass('dpo-highlight-invalid');
    setTimeout(function(){ $bad.removeClass('dpo-highlight-invalid'); }, 1200);
  }

  function bind() {
    setBtn(true);
    validateDebounced(); // initial pass delayed by 500ms

    var $root = $(ROOT);

    // Re-validate on interactions, but debounced 500ms
    $root.on('change input click', 'input, select, textarea, label', validateDebounced);

    // Re-validate on DOM changes (also debounced)
    try {
      var mo = new MutationObserver(validateDebounced);
      mo.observe($root.get(0), {subtree:true, childList:true, attributes:true, attributeFilter:['style','class','hidden','aria-hidden','disabled']});
    } catch(e){}

    // Guard Add to Cart
    $(document).on('click', ADD, function(e){
      var $b = $(this);
      var blocked = $b.is(':disabled') || $b.hasClass('disabled') || $b.hasClass('is-disabled') || $b.attr('aria-disabled') === 'true';
      if (blocked) { e.preventDefault(); e.stopImmediatePropagation(); validate(); scrollToBad(); return false; }
    });

    // Safety passes (these call immediate validate to avoid queues)
    setTimeout(validate, 700);   // 200ms after initial debounce finishes
    setTimeout(validate, 1500);
    setTimeout(validate, 3000);
  }

  (function wait(i){
    if ($(ROOT).length) return bind();
    if (i > 80) return bind();
    setTimeout(function(){ wait(i+1); }, 200);
  })(0);

})(jQuery);




 // document.addEventListener('DOMContentLoaded', function() {
 //    const url = new URL(window.location.href);
 //    // list of Shopify search params to remove
 //    ['_pos','_psq','_ss','_v'].forEach(p => url.searchParams.delete(p));
 //    // update address bar without reloading
 //    if (window.location.search !== url.search) {
 //      window.history.replaceState(null, '', url.pathname + url.search);
 //    }
 //  });

