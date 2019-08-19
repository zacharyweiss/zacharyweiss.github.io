// prepend polyfill needed for Edge
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
// via https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('prepend')) {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });

        this.insertBefore(docFrag, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

function clear_email_signup_field(field) {
  const old_value = field.value;
  field.value = "";

  function blur_handler(evt) {
    field.value = field.value || old_value;
    field.removeEventListener("blur", blur_handler);
  }

  field.addEventListener("blur", blur_handler);
}

const body_text_cookie = "bpt-body-text";
const font_palette_cookie = "bpt-font-palette";

const get_switcher = () => document.getElementById("switcher");
const get_toolbar = () => document.getElementById("toolbar");
const switcher_detached = () => get_switcher().classList.contains("detached");

function maybe_relocate_switcher() {
  const switcher = get_switcher();
  if ( ! (switcher && switcher_detached())) return;
  const switcher_bottom = switcher.getBoundingClientRect().bottom;
  if ( switcher_bottom > window.innerHeight - 150 ) {
    console.log(`relocating from ${switcher_bottom} to ${window.innerHeight}`);
    detach_switcher(window.innerHeight - 150);
  }
}

function move_switcher_inside_toolbar () {
  const toolbar = get_toolbar();
  const switcher = get_switcher();
  if ( ! (toolbar && switcher) ) return;
  set_cookie(font_palette_cookie, "false");
  switcher.classList.remove("detached");
  toolbar.prepend(switcher);
}

function detach_switcher(top) {
  const switcher = get_switcher();
  if ( ! switcher ) return;
  const switcher_top = switcher.getBoundingClientRect().top;
  switcher.style.top = `${top || switcher_top}px`;
  switcher.classList.add("detached");
  document.body.appendChild(switcher);
}

function drag_switcher(top_evt) {
  const switcher = get_switcher();
  if ( ! switcher ) return;
  console.log("drag started");
  const dragging_class = "dragging";
  switcher.classList.add(dragging_class);
  detach_switcher();

  function onMouseMove(evt) {
    const new_top = evt.clientY - top_evt.offsetY;
    if ( new_top > document.body.scrollHeight || new_top < 0 ) return; // ignore wackdoodle value
    switcher.style.top = `${set_cookie(font_palette_cookie, new_top)}px`;
  };

  function onMouseUp(evt) {
    switcher.classList.remove(dragging_class);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}


function make_css_string(path, maybe_media) {
  return `<link rel="preload" as="style" type="text/css" media="${maybe_media || "all"}" href="${path}" />
  <link rel="stylesheet" type="text/css" media="${maybe_media || "all"}" href="${path}" />`
}

function get_platform_specific_css_string(family_in) {
  const family = family_in.toLowerCase();
  console.log(`loading platform-specific ${family} fonts`);
  if (navigator.appVersion.indexOf("Win")!=-1) {
    return make_css_string(`/fonts/${family}-heavy.css`);
  } else if (navigator.appVersion.indexOf("Mac")!=-1) {
      if (navigator.userAgent.match(/iPad/i) != null) {
          return make_css_string(`/fonts/${family}-light.css`, "only screen and (max-device-width: 1024px)");
          return make_css_string(`/fonts/${family}-heavy.css`, "only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2)");
      } else {
          return make_css_string(`/fonts/${family}-light.css`);
      }
  } else {
      return make_css_string(`/fonts/${family}-heavy.css`);
  }
}

function get_body_text_css_string(family_in) {
  const family = family_in.toLowerCase();
  console.log(`loading ${family} font for body text`);
  return make_css_string(`/fonts/${family}-body-text.css`);
}

function get_browser_specific_css_string() {
  console.log(`loading browser-specific css patch`);
  var isFirefox = typeof InstallTrigger !== 'undefined';
  if (isFirefox) {
    return make_css_string("/firefox.css");
  }
  var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");
  if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isIEedge == false) {
     // is Google Chrome or Opera
    return make_css_string("/chrome.css");
  }

  var ua = window.navigator.userAgent;
   // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // 'MSIE' key detects IE10 and before; 'Trident' key detects IE11
  if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
    return make_css_string("/ie.css");
  }
}

function set_cookie(cookie_name, value, maybe_days_until_expiration)
{
    const days_until_expiration = maybe_days_until_expiration || 30;
    const expiration_date = new Date();
    expiration_date.setDate(expiration_date.getDate() + days_until_expiration);
    const cookie_value = `${escape(value)}; expires=${expiration_date.toUTCString()}`;
    document.cookie = `${cookie_name}=${cookie_value}; path=/`;
    return value;
}

function get_cookie(cookie_name) {
    const cookie_kvs = {}
    document.cookie.split(';')
    .map(cp => {
      const [key, val] = cp.split('=');
      cookie_kvs[key.trim()] = val;
    })
    return cookie_kvs[cookie_name] || "";
}

function get_or_set_cookie(cookie_name, value, maybe_days_until_expiration) {
    return get_cookie(cookie_name)
        || set_cookie(cookie_name, value, maybe_days_until_expiration);
}

function set_body_text(new_family) {
  console.log(`setting body text to ${new_family}`);
  set_cookie(body_text_cookie, new_family);
  broadcast_style("body-text_" + new_family);
  Array.from(document.getElementsByClassName("body-texter"))
    .map(el => el.classList.remove("active"));
  document.getElementById(new_family).classList.add("active");
}

function handle_font_info_click(evt) {
  document.location = `${get_cookie(body_text_cookie)}.html`;
}

const max_scroll_height = () => document.body.scrollHeight;

function scroll_to_bottom() {
  console.log("scrolling to bottom");
  window.scrollTo(window.scrollX, max_scroll_height());
}

function handle_body_text_click(evt) {
  set_body_text(evt.id);
  if ( ! switcher_detached() ) { scroll_to_bottom(); }
}


const reveal_bottom_nav = function() {
    const toolbar = get_toolbar();
    if (! toolbar) return;
    const y_remaining = max_scroll_height() - (window.scrollY + window.innerHeight);
    const invisible_threshold = body.clientWidth * .175;
    const visible_threshold = body.clientWidth * .100;
    const new_opacity =
      y_remaining >= invisible_threshold ? 0
      : y_remaining <= visible_threshold ? 1
      : Math.pow( ((invisible_threshold - y_remaining)
        / (invisible_threshold - visible_threshold)), 2);
    toolbar.style.opacity = new_opacity;
    toolbar.classList[new_opacity > 0 ? "add" : "remove"]("visible")
};

const query_attribute = query => Array.from(document.querySelectorAll(`[${query}]`));

const get_styler_listeners = () => query_attribute("body-text");

function make_event(type, options) {
    const evt = new Event(type);
    Object.keys(options || {}).map(key => evt[key] = options[key]);
    return evt;
}

function broadcast_style(style) {
    get_styler_listeners()
    .map(el => el.dispatchEvent(make_event("restyle", {style})));
}

const prefixOf = str => str.split("_")[0] + "_";

function prep_styler_listeners() {
    get_styler_listeners()
    .map(el => {
        el.addEventListener("restyle", evt => {
            const style = evt.style.toLowerCase();
            Array.from(el.classList)
                .filter(name => name.startsWith(prefixOf(style)))
                .map(name => el.classList.remove(name));
            el.classList.add(style.replace(/ /g, "_"));
        });
    });
    console.log("styler_listeners prepped");
}

// these want to run immediately, before `load` fires

const valid_fonts = ["equity", "valkyrie", "century-supra", "concourse", "hermes-maia", "triplicate"];

valid_fonts.map(family => {
  document.write(get_platform_specific_css_string(family));
})

window.addEventListener("load", event => {
  prep_styler_listeners();

  const default_families = ["century-supra", "valkyrie", "equity"];
  const default_body_text_family = default_families[Math.floor(Math.random()*default_families.length)];
  const body_text_family = get_or_set_cookie(body_text_cookie, default_body_text_family);
  set_body_text(
      valid_fonts.includes(body_text_family) ?
      body_text_family :
      set_cookie(body_text_cookie, default_body_text_family));

  const palette_cookie = get_cookie(font_palette_cookie);
  const palette_top = palette_cookie && parseInt(palette_cookie);
  ( palette_top && palette_top > 0 ) ?
    detach_switcher(palette_top) : move_switcher_inside_toolbar();

  window.dispatchEvent(make_event("resize"));
  document.getElementById("body").classList.remove("hidden");
  document.getElementById("content").addEventListener("copy", (event) => {
    event.preventDefault();
    const selectedText = window.getSelection().toString();
    event.clipboardData.setData("text/plain", selectedText.replace(/\u00AD/g, ""));
  });
})

window.addEventListener("resize", reveal_bottom_nav);
window.addEventListener("resize", maybe_relocate_switcher);
window.addEventListener("scroll", reveal_bottom_nav);



