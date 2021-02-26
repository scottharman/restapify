'use strict';

var sirv = require('sirv');
var polka = require('polka');
var compression = require('compression');
var fs = require('fs');
var path = require('path');
var hljs = require('highlight.js');
var showdown = require('showdown');
var Stream = require('stream');
var http = require('http');
var Url = require('url');
var https = require('https');
var zlib = require('zlib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sirv__default = /*#__PURE__*/_interopDefaultLegacy(sirv);
var polka__default = /*#__PURE__*/_interopDefaultLegacy(polka);
var compression__default = /*#__PURE__*/_interopDefaultLegacy(compression);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var hljs__default = /*#__PURE__*/_interopDefaultLegacy(hljs);
var showdown__default = /*#__PURE__*/_interopDefaultLegacy(showdown);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Url__default = /*#__PURE__*/_interopDefaultLegacy(Url);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

const initHighlightJs = () => {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs__default['default'].highlightBlock(block);
    });
};

var bg = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20viewBox%3D%22-84.96%20112.15%201139.43%20855.7%22%3E%3Cdesc%3ECreated%20with%20Fabric.js%204.2.0%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20transform%3D%22matrix%281%200%200%201%20540%20540%29%22%20id%3D%22b13d279c-a7c8-43f8-8418-b25b69802bc2%22%3E%3C%2Fg%3E%3Cg%20transform%3D%22matrix%281.05%200%200%201.05%20484.45%20540%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%281.14%200%200%201.14%20201.2%2081.18%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28255%2C219%2C144%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%28-0.7%200.9%20-0.9%20-0.7%20-155.41%200%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28214%2C235%2C244%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

/* src/components/Terminal.svelte generated by Svelte v3.32.3 */

const css = {
	code: "pre.svelte-14p7wzv.svelte-14p7wzv{width:300px}pre.svelte-14p7wzv code.svelte-14p7wzv{display:inline-block;width:100%}.editor.svelte-14p7wzv.svelte-14p7wzv{width:fit-content;overflow:hidden}.editor.svelte-14p7wzv .editor-toolbar.svelte-14p7wzv{border:solid 1px #1E1E1E;border-radius:5px 5px 0 0}.editor.svelte-14p7wzv .editor-toolbar div.svelte-14p7wzv{height:12px;width:12px;border:solid 1px #1E1E1E}.editor.svelte-14p7wzv code.svelte-14p7wzv{border-radius:0 0 5px 5px}",
	map: "{\"version\":3,\"file\":\"Terminal.svelte\",\"sources\":[\"Terminal.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">export let content;\\nexport let language = '';\\nlet className = '';\\nexport { className as class };\\n</script>\\n\\n<style lang=\\\"scss\\\">pre {\\n  width: 300px; }\\n  pre code {\\n    display: inline-block;\\n    width: 100%; }\\n\\n.editor {\\n  width: fit-content;\\n  overflow: hidden; }\\n  .editor .editor-toolbar {\\n    border: solid 1px #1E1E1E;\\n    border-radius: 5px 5px 0 0; }\\n    .editor .editor-toolbar div {\\n      height: 12px;\\n      width: 12px;\\n      border: solid 1px #1E1E1E; }\\n  .editor code {\\n    border-radius: 0 0 5px 5px; }\\n</style>\\n\\n<div class={`editor d-flex flex-column ${className}`}>\\n  <div class=\\\"editor-toolbar d-flex ps-2 py-1 bg-light\\\">\\n    <div class=\\\"rounded-circle mx-1 bg-danger\\\"> </div>\\n    <div class=\\\"rounded-circle mx-1 bg-warning\\\"> </div>\\n    <div class=\\\"rounded-circle mx-1 bg-success\\\"> </div>\\n  </div>\\n  <pre>\\n    <code class={`${language} p-3`}>{content}</code>\\n  </pre>\\n</div>\"],\"names\":[],\"mappings\":\"AAMmB,GAAG,8BAAC,CAAC,AACtB,KAAK,CAAE,KAAK,AAAE,CAAC,AACf,kBAAG,CAAC,IAAI,eAAC,CAAC,AACR,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,IAAI,AAAE,CAAC,AAElB,OAAO,8BAAC,CAAC,AACP,KAAK,CAAE,WAAW,CAClB,QAAQ,CAAE,MAAM,AAAE,CAAC,AACnB,sBAAO,CAAC,eAAe,eAAC,CAAC,AACvB,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,OAAO,CACzB,aAAa,CAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,AAAE,CAAC,AAC7B,sBAAO,CAAC,eAAe,CAAC,GAAG,eAAC,CAAC,AAC3B,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,OAAO,AAAE,CAAC,AAChC,sBAAO,CAAC,IAAI,eAAC,CAAC,AACZ,aAAa,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,AAAE,CAAC\"}"
};

const Terminal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { content } = $$props;
	let { language = "" } = $$props;
	let { class: className = "" } = $$props;
	if ($$props.content === void 0 && $$bindings.content && content !== void 0) $$bindings.content(content);
	if ($$props.language === void 0 && $$bindings.language && language !== void 0) $$bindings.language(language);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	$$result.css.add(css);

	return `<div class="${escape(null_to_empty(`editor d-flex flex-column ${className}`)) + " svelte-14p7wzv"}"><div class="${"editor-toolbar d-flex ps-2 py-1 bg-light svelte-14p7wzv"}"><div class="${"rounded-circle mx-1 bg-danger svelte-14p7wzv"}"></div>
    <div class="${"rounded-circle mx-1 bg-warning svelte-14p7wzv"}"></div>
    <div class="${"rounded-circle mx-1 bg-success svelte-14p7wzv"}"></div></div>
  <pre class="${"svelte-14p7wzv"}"><code class="${escape(null_to_empty(`${language} p-3`)) + " svelte-14p7wzv"}">${escape(content)}</code></pre></div>`;
});

var link = "data:image/svg+xml,%3Csvg%20width%3D%221em%22%20height%3D%221em%22%20viewBox%3D%220%200%2016%2016%22%20class%3D%22bi%20bi-link-45deg%22%20fill%3D%22currentColor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%3Cpath%20d%3D%22M4.715%206.542L3.343%207.914a3%203%200%201%200%204.243%204.243l1.828-1.829A3%203%200%200%200%208.586%205.5L8%206.086a1.001%201.001%200%200%200-.154.199%202%202%200%200%201%20.861%203.337L6.88%2011.45a2%202%200%201%201-2.83-2.83l.793-.792a4.018%204.018%200%200%201-.128-1.287z%22%2F%3E%20%20%3Cpath%20d%3D%22M6.586%204.672A3%203%200%200%200%207.414%209.5l.775-.776a2%202%200%200%201-.896-3.346L9.12%203.55a2%202%200%200%201%202.83%202.83l-.793.792c.112.42.155.855.128%201.287l1.372-1.372a3%203%200%200%200-4.243-4.243L6.586%204.672z%22%2F%3E%3C%2Fsvg%3E";

var github = "data:image/svg+xml,%3Csvg%20aria-hidden%3D%22true%22%20focusable%3D%22false%22%20data-prefix%3D%22fab%22%20data-icon%3D%22github-alt%22%20role%3D%22img%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20480%20512%22%20class%3D%22svg-inline--fa%20fa-github-alt%20fa-w-15%20fa-7x%22%3E%20%20%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M186.1%20328.7c0%2020.9-10.9%2055.1-36.7%2055.1s-36.7-34.2-36.7-55.1%2010.9-55.1%2036.7-55.1%2036.7%2034.2%2036.7%2055.1zM480%20278.2c0%2031.9-3.2%2065.7-17.5%2095-37.9%2076.6-142.1%2074.8-216.7%2074.8-75.8%200-186.2%202.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95%200-41.9%2013.9-81.5%2041.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8%200-21.5%204.9-32.3%2014.6-51.8%2045.3%200%2074.3%209%20108.8%2036%2029-6.9%2058.8-10%2088.7-10%2027%200%2054.2%202.9%2080.4%209.2%2034-26.7%2063-35.2%20107.8-35.2%209.8%2019.5%2014.6%2030.3%2014.6%2051.8%200%2016.4-2.6%2032.7-7.7%2048.2%2027.5%2032.4%2039%2072.3%2039%20114.2zm-64.3%2050.5c0-43.9-26.7-82.6-73.5-82.6-18.9%200-37%203.4-56%206-14.9%202.3-29.8%203.2-45.1%203.2-15.2%200-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8%200-73.5%2038.7-73.5%2082.6%200%2087.8%2080.4%20101.3%20150.4%20101.3h48.2c70.3%200%20150.6-13.4%20150.6-101.3zm-82.6-55.1c-25.8%200-36.7%2034.2-36.7%2055.1s10.9%2055.1%2036.7%2055.1%2036.7-34.2%2036.7-55.1-10.9-55.1-36.7-55.1z%22%20class%3D%22%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E";

var close = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-x-circle%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M8%2015A7%207%200%201%200%208%201a7%207%200%200%200%200%2014zm0%201A8%208%200%201%200%208%200a8%208%200%200%200%200%2016z%22%2F%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.646%204.646a.5.5%200%200%201%20.708%200L8%207.293l2.646-2.647a.5.5%200%200%201%20.708.708L8.707%208l2.647%202.646a.5.5%200%200%201-.708.708L8%208.707l-2.646%202.647a.5.5%200%200%201-.708-.708L7.293%208%204.646%205.354a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E";

var circleHalf = "data:image/svg+xml,%3Csvg%20width%3D%221em%22%20height%3D%221em%22%20viewBox%3D%220%200%2016%2016%22%20class%3D%22bi%20bi-circle-half%22%20fill%3D%22currentColor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M8%2015V1a7%207%200%201%201%200%2014zm0%201A8%208%200%201%201%208%200a8%208%200%200%201%200%2016z%22%2F%3E%3C%2Fsvg%3E";

var book = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-book%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M1%202.828c.885-.37%202.154-.769%203.388-.893%201.33-.134%202.458.063%203.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689%201.782-.886%203.112-.752%201.234.124%202.503.523%203.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8%201.783C7.015.936%205.587.81%204.287.94c-1.514.153-3.042.672-3.994%201.105A.5.5%200%200%200%200%202.5v11a.5.5%200%200%200%20.707.455c.882-.4%202.303-.881%203.68-1.02%201.409-.142%202.59.087%203.223.877a.5.5%200%200%200%20.78%200c.633-.79%201.814-1.019%203.222-.877%201.378.139%202.8.62%203.681%201.02A.5.5%200%200%200%2016%2013.5v-11a.5.5%200%200%200-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809%208.985.936%208%201.783z%22%2F%3E%3C%2Fsvg%3E";

var eye = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-eye%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M16%208s-3-5.5-8-5.5S0%208%200%208s3%205.5%208%205.5S16%208%2016%208zM1.173%208a13.133%2013.133%200%200%201%201.66-2.043C4.12%204.668%205.88%203.5%208%203.5c2.12%200%203.879%201.168%205.168%202.457A13.133%2013.133%200%200%201%2014.828%208c-.058.087-.122.183-.195.288-.335.48-.83%201.12-1.465%201.755C11.879%2011.332%2010.119%2012.5%208%2012.5c-2.12%200-3.879-1.168-5.168-2.457A13.134%2013.134%200%200%201%201.172%208z%22%2F%3E%20%20%3Cpath%20d%3D%22M8%205.5a2.5%202.5%200%201%200%200%205%202.5%202.5%200%200%200%200-5zM4.5%208a3.5%203.5%200%201%201%207%200%203.5%203.5%200%200%201-7%200z%22%2F%3E%3C%2Fsvg%3E";

var folder = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-folder%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M.54%203.87L.5%203a2%202%200%200%201%202-2h3.672a2%202%200%200%201%201.414.586l.828.828A2%202%200%200%200%209.828%203h3.982a2%202%200%200%201%201.992%202.181l-.637%207A2%202%200%200%201%2013.174%2014H2.826a2%202%200%200%201-1.991-1.819l-.637-7a1.99%201.99%200%200%201%20.342-1.31zM2.19%204a1%201%200%200%200-.996%201.09l.637%207a1%201%200%200%200%20.995.91h10.348a1%201%200%200%200%20.995-.91l.637-7A1%201%200%200%200%2013.81%204H2.19zm4.69-1.707A1%201%200%200%200%206.172%202H2.5a1%201%200%200%200-1%20.981l.006.139C1.72%203.042%201.95%203%202.19%203h5.396l-.707-.707z%22%2F%3E%3C%2Fsvg%3E";

var folderOpen = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-folder2-open%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M1%203.5A1.5%201.5%200%200%201%202.5%202h2.764c.958%200%201.76.56%202.311%201.184C7.985%203.648%208.48%204%209%204h4.5A1.5%201.5%200%200%201%2015%205.5v.64c.57.265.94.876.856%201.546l-.64%205.124A2.5%202.5%200%200%201%2012.733%2015H3.266a2.5%202.5%200%200%201-2.481-2.19l-.64-5.124A1.5%201.5%200%200%201%201%206.14V3.5zM2%206h12v-.5a.5.5%200%200%200-.5-.5H9c-.964%200-1.71-.629-2.174-1.154C6.374%203.334%205.82%203%205.264%203H2.5a.5.5%200%200%200-.5.5V6zm-.367%201a.5.5%200%200%200-.496.562l.64%205.124A1.5%201.5%200%200%200%203.266%2014h9.468a1.5%201.5%200%200%200%201.489-1.314l.64-5.124A.5.5%200%200%200%2014.367%207H1.633z%22%2F%3E%3C%2Fsvg%3E";

var fileCode = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-file-code%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M6.646%205.646a.5.5%200%201%201%20.708.708L5.707%208l1.647%201.646a.5.5%200%200%201-.708.708l-2-2a.5.5%200%200%201%200-.708l2-2zm2.708%200a.5.5%200%201%200-.708.708L10.293%208%208.646%209.646a.5.5%200%200%200%20.708.708l2-2a.5.5%200%200%200%200-.708l-2-2z%22%2F%3E%20%20%3Cpath%20d%3D%22M2%202a2%202%200%200%201%202-2h8a2%202%200%200%201%202%202v12a2%202%200%200%201-2%202H4a2%202%200%200%201-2-2V2zm10-1H4a1%201%200%200%200-1%201v12a1%201%200%200%200%201%201h8a1%201%200%200%200%201-1V2a1%201%200%200%200-1-1z%22%2F%3E%3C%2Fsvg%3E";

var arrowBarBottom = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-arrow-bar-down%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M1%203.5a.5.5%200%200%201%20.5-.5h13a.5.5%200%200%201%200%201h-13a.5.5%200%200%201-.5-.5zM8%206a.5.5%200%200%201%20.5.5v5.793l2.146-2.147a.5.5%200%200%201%20.708.708l-3%203a.5.5%200%200%201-.708%200l-3-3a.5.5%200%200%201%20.708-.708L7.5%2012.293V6.5A.5.5%200%200%201%208%206z%22%2F%3E%3C%2Fsvg%3E";

var fileEarmarkText = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-file-earmark-text%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M5.5%207a.5.5%200%200%200%200%201h5a.5.5%200%200%200%200-1h-5zM5%209.5a.5.5%200%200%201%20.5-.5h5a.5.5%200%200%201%200%201h-5a.5.5%200%200%201-.5-.5zm0%202a.5.5%200%200%201%20.5-.5h2a.5.5%200%200%201%200%201h-2a.5.5%200%200%201-.5-.5z%22%2F%3E%20%20%3Cpath%20d%3D%22M9.5%200H4a2%202%200%200%200-2%202v12a2%202%200%200%200%202%202h8a2%202%200%200%200%202-2V4.5L9.5%200zm0%201v2A1.5%201.5%200%200%200%2011%204.5h2V14a1%201%200%200%201-1%201H4a1%201%200%200%201-1-1V2a1%201%200%200%201%201-1h5.5z%22%2F%3E%3C%2Fsvg%3E";

var arrowRight = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-arrow-right%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M1%208a.5.5%200%200%201%20.5-.5h11.793l-3.147-3.146a.5.5%200%200%201%20.708-.708l4%204a.5.5%200%200%201%200%20.708l-4%204a.5.5%200%200%201-.708-.708L13.293%208.5H1.5A.5.5%200%200%201%201%208z%22%2F%3E%3C%2Fsvg%3E";

var x = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-x%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M4.646%204.646a.5.5%200%200%201%20.708%200L8%207.293l2.646-2.647a.5.5%200%200%201%20.708.708L8.707%208l2.647%202.646a.5.5%200%200%201-.708.708L8%208.707l-2.646%202.647a.5.5%200%200%201-.708-.708L7.293%208%204.646%205.354a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E";

var list = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-list%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M2.5%2011.5A.5.5%200%200%201%203%2011h10a.5.5%200%200%201%200%201H3a.5.5%200%200%201-.5-.5zm0-4A.5.5%200%200%201%203%207h10a.5.5%200%200%201%200%201H3a.5.5%200%200%201-.5-.5zm0-4A.5.5%200%200%201%203%203h10a.5.5%200%200%201%200%201H3a.5.5%200%200%201-.5-.5z%22%2F%3E%3C%2Fsvg%3E";

/* src/components/Icon/Icon.svelte generated by Svelte v3.32.3 */

const css$1 = {
	code: "img.svelte-1w3h9yq{width:1em}",
	map: "{\"version\":3,\"file\":\"Icon.svelte\",\"sources\":[\"Icon.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">import link from './icons/link.svg';\\nimport github from './icons/github.svg';\\nimport close from './icons/close.svg';\\nimport circleHalf from './icons/circle-half.svg';\\nimport book from './icons/book.svg';\\nimport eye from './icons/eye.svg';\\nimport folder from './icons/folder.svg';\\nimport folderOpen from './icons/folderOpen.svg';\\nimport fileCode from './icons/fileCode.svg';\\nimport arrowBarBottom from './icons/arrowBarBottom.svg';\\nimport fileEarmarkText from './icons/fileEarmarkText.svg';\\nimport arrowRight from './icons/arrowRight.svg';\\nimport x from './icons/x.svg';\\nimport list from './icons/list.svg';\\nlet className = '';\\nexport let name = 'github';\\nexport { className as class };\\nconst icons = {\\n    'circle-half': circleHalf,\\n    link,\\n    github,\\n    close,\\n    book,\\n    eye,\\n    folder,\\n    'folder-open': folderOpen,\\n    'file-code': fileCode,\\n    'arrow-bar-bottom': arrowBarBottom,\\n    'file-earmark-text': fileEarmarkText,\\n    'arrow-right': arrowRight,\\n    x,\\n    list\\n};\\n</script>\\n\\n<style>\\n  img {\\n    width: 1em;\\n  }\\n</style>\\n\\n<img src={icons[name]} class={`icon ${className}`} alt={`Icon ${name}`} />\"],\"names\":[],\"mappings\":\"AAoCE,GAAG,eAAC,CAAC,AACH,KAAK,CAAE,GAAG,AACZ,CAAC\"}"
};

const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { class: className = "" } = $$props;
	let { name = "github" } = $$props;

	const icons = {
		"circle-half": circleHalf,
		link,
		github,
		close,
		book,
		eye,
		folder,
		"folder-open": folderOpen,
		"file-code": fileCode,
		"arrow-bar-bottom": arrowBarBottom,
		"file-earmark-text": fileEarmarkText,
		"arrow-right": arrowRight,
		x,
		list
	};

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	$$result.css.add(css$1);
	return `<img${add_attribute("src", icons[name], 0)} class="${escape(null_to_empty(`icon ${className}`)) + " svelte-1w3h9yq"}"${add_attribute("alt", `Icon ${name}`, 0)}>`;
});

var arrowIcon = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-arrow-90deg-down%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.854%2014.854a.5.5%200%200%201-.708%200l-4-4a.5.5%200%200%201%20.708-.708L4%2013.293V3.5A2.5%202.5%200%200%201%206.5%201h8a.5.5%200%200%201%200%201h-8A1.5%201.5%200%200%200%205%203.5v9.793l3.146-3.147a.5.5%200%200%201%20.708.708l-4%204z%22%2F%3E%3C%2Fsvg%3E";

/* src/components/File.svelte generated by Svelte v3.32.3 */

const css$2 = {
	code: "button.svelte-khd7i3.svelte-khd7i3{border:none;background-color:transparent;position:relative;padding:0 0 0 1.5em;background:0 0.1em no-repeat;background-size:1em 1em;cursor:pointer}button.svelte-khd7i3 img.svelte-khd7i3{position:absolute;left:100%;top:50%;transform:rotateY(180deg);width:1.5em}",
	map: "{\"version\":3,\"file\":\"File.svelte\",\"sources\":[\"File.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from \\\"svelte\\\"\\n  import { initHighlightJs } from \\\"../utils\\\"\\n  import Terminal from './Terminal.svelte'\\n\\timport Icon from './Icon/Icon.svelte';\\n\\n  import arrowIcon from '../assets/arrow-90deg-down.svg'\\n\\n\\texport let name\\n  export let content\\n  export let expended = false\\n\\n  const toggle = () => {\\n\\t\\texpended = !expended\\n\\t}\\n\\n  onMount(() => {\\n    initHighlightJs()\\n  })\\n</script>\\n\\n<style lang=\\\"scss\\\">button {\\n  border: none;\\n  background-color: transparent;\\n  position: relative;\\n  padding: 0 0 0 1.5em;\\n  background: 0 0.1em no-repeat;\\n  background-size: 1em 1em;\\n  cursor: pointer; }\\n  button img {\\n    position: absolute;\\n    left: 100%;\\n    top: 50%;\\n    transform: rotateY(180deg);\\n    width: 1.5em; }\\n</style>\\n\\n<button on:click={toggle} class=\\\"ps-0\\\">\\n  <Icon name=\\\"file-earmark-text\\\" /> {name}\\n  <img \\n    src={arrowIcon} \\n    alt=\\\"File content indicator\\\"\\n    class:d-none={!expended} \\n    class=\\\"ms-3\\\"\\n  />\\n</button>\\n\\n<div class:d-none={!expended} class=\\\"mt-4\\\">\\n  <Terminal class=\\\"ms-4 mt-2\\\" content={JSON.stringify(content, null, content[0] !== null ? 2 : 0)} language=\\\"json\\\" />\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAqBmB,MAAM,4BAAC,CAAC,AACzB,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,WAAW,CAC7B,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CACpB,UAAU,CAAE,CAAC,CAAC,KAAK,CAAC,SAAS,CAC7B,eAAe,CAAE,GAAG,CAAC,GAAG,CACxB,MAAM,CAAE,OAAO,AAAE,CAAC,AAClB,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,QAAQ,MAAM,CAAC,CAC1B,KAAK,CAAE,KAAK,AAAE,CAAC\"}"
};

const File = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { name } = $$props;
	let { content } = $$props;
	let { expended = false } = $$props;

	onMount(() => {
		initHighlightJs();
	});

	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	if ($$props.content === void 0 && $$bindings.content && content !== void 0) $$bindings.content(content);
	if ($$props.expended === void 0 && $$bindings.expended && expended !== void 0) $$bindings.expended(expended);
	$$result.css.add(css$2);

	return `<button class="${"ps-0 svelte-khd7i3"}">${validate_component(Icon, "Icon").$$render($$result, { name: "file-earmark-text" }, {}, {})} ${escape(name)}
  <img${add_attribute("src", arrowIcon, 0)} alt="${"File content indicator"}" class="${["ms-3 svelte-khd7i3", !expended ? "d-none" : ""].join(" ").trim()}"></button>

<div class="${["mt-4", !expended ? "d-none" : ""].join(" ").trim()}">${validate_component(Terminal, "Terminal").$$render(
		$$result,
		{
			class: "ms-4 mt-2",
			content: JSON.stringify(content, null, content[0] !== null ? 2 : 0),
			language: "json"
		},
		{},
		{}
	)}</div>`;
});

/* src/components/Folder.svelte generated by Svelte v3.32.3 */

const css$3 = {
	code: "button.svelte-us4pyf{border:none;background-color:transparent;color:black;background-size:1em 1em;font-weight:bold;cursor:pointer}ul.svelte-us4pyf{padding:0.2em 0 0 0.5em;margin:0 0 0 0.4em;list-style:none;border-left:2px solid black}li.svelte-us4pyf{padding:0.2em 0}",
	map: "{\"version\":3,\"file\":\"Folder.svelte\",\"sources\":[\"Folder.svelte\"],\"sourcesContent\":[\"<script>\\n\\timport File from './File.svelte';\\n\\timport Icon from './Icon/Icon.svelte';\\n\\n\\texport let expanded = false;\\n\\texport let name;\\n\\texport let files;\\n\\n\\tconst toggle = () => {\\n\\t\\texpanded = !expanded;\\n\\t}\\n</script>\\n\\n<style>\\n\\tbutton {\\n    border: none;\\n    background-color: transparent;\\n\\t\\tcolor: black;\\n\\t\\tbackground-size: 1em 1em;\\n\\t\\tfont-weight: bold;\\n\\t\\tcursor: pointer;\\n\\t}\\n\\n\\tul {\\n\\t\\tpadding: 0.2em 0 0 0.5em;\\n\\t\\tmargin: 0 0 0 0.4em;\\n\\t\\tlist-style: none;\\n\\t\\tborder-left: 2px solid black;\\n\\t}\\n\\n\\tli {\\n\\t\\tpadding: 0.2em 0;\\n\\t}\\n</style>\\n\\n<button on:click={toggle} class=\\\"ps-0\\\">\\n\\t<Icon name={expanded ? 'folder-open' : 'folder'} />\\n\\t{name}\\n</button>\\n\\n{#if expanded}\\n\\t<ul>\\n\\t\\t{#each files as {type, ...file}}\\n\\t\\t\\t<li>\\n\\t\\t\\t\\t{#if type === 'folder'}\\n\\t\\t\\t\\t\\t<svelte:self {...file}/>\\n\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t<File {...file}/>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</li>\\n\\t\\t{/each}\\n\\t</ul>\\n{/if}\"],\"names\":[],\"mappings\":\"AAcC,MAAM,cAAC,CAAC,AACL,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,WAAW,CAC/B,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,GAAG,CAAC,GAAG,CACxB,WAAW,CAAE,IAAI,CACjB,MAAM,CAAE,OAAO,AAChB,CAAC,AAED,EAAE,cAAC,CAAC,AACH,OAAO,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CACxB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CACnB,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,AAC7B,CAAC,AAED,EAAE,cAAC,CAAC,AACH,OAAO,CAAE,KAAK,CAAC,CAAC,AACjB,CAAC\"}"
};

const Folder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { expanded = false } = $$props;
	let { name } = $$props;
	let { files } = $$props;

	if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0) $$bindings.expanded(expanded);
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	if ($$props.files === void 0 && $$bindings.files && files !== void 0) $$bindings.files(files);
	$$result.css.add(css$3);

	return `<button class="${"ps-0 svelte-us4pyf"}">${validate_component(Icon, "Icon").$$render(
		$$result,
		{
			name: expanded ? "folder-open" : "folder"
		},
		{},
		{}
	)}
	${escape(name)}</button>

${expanded
	? `<ul class="${"svelte-us4pyf"}">${each(files, ({ type, ...file }) => `<li class="${"svelte-us4pyf"}">${type === "folder"
		? `${validate_component(Folder, "svelte:self").$$render($$result, Object.assign(file), {}, {})}`
		: `${validate_component(File, "File").$$render($$result, Object.assign(file), {}, {})}`}
			</li>`)}</ul>`
	: ``}`;
});

/* src/components/MethodBadge.svelte generated by Svelte v3.32.3 */

const css$4 = {
	code: ".badge.svelte-18rcjpl{text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}",
	map: "{\"version\":3,\"file\":\"MethodBadge.svelte\",\"sources\":[\"MethodBadge.svelte\"],\"sourcesContent\":[\"<script  lang=\\\"ts\\\">export let method;\\nconst getBadgeBgClass = () => {\\n    switch (method) {\\n        case 'GET':\\n            return 'bg-success';\\n        case 'POST':\\n            return 'bg-warning';\\n        case 'PUT':\\n            return 'bg-primary';\\n        case 'PATCH':\\n            return 'bg-secondary';\\n        case 'DELETE':\\n            return 'bg-danger';\\n    }\\n};\\nconst getMethodName = () => {\\n    switch (method) {\\n        case 'DELETE':\\n            return 'DEL';\\n        default:\\n            return method;\\n    }\\n};\\n</script>\\n\\n<span class={`badge ${getBadgeBgClass()} method`}>{getMethodName()}</span>\\n\\n<style>\\n  .badge {\\n    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;\\n  }\\n</style>\"],\"names\":[],\"mappings\":\"AA4BE,MAAM,eAAC,CAAC,AACN,WAAW,CAAE,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,KAAK,AACnE,CAAC\"}"
};

const MethodBadge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { method } = $$props;

	const getBadgeBgClass = () => {
		switch (method) {
			case "GET":
				return "bg-success";
			case "POST":
				return "bg-warning";
			case "PUT":
				return "bg-primary";
			case "PATCH":
				return "bg-secondary";
			case "DELETE":
				return "bg-danger";
		}
	};

	const getMethodName = () => {
		switch (method) {
			case "DELETE":
				return "DEL";
			default:
				return method;
		}
	};

	if ($$props.method === void 0 && $$bindings.method && method !== void 0) $$bindings.method(method);
	$$result.css.add(css$4);
	return `<span class="${escape(null_to_empty(`badge ${getBadgeBgClass()} method`)) + " svelte-18rcjpl"}">${escape(getMethodName())}</span>`;
});

/* src/components/ApiOverview/Route.svelte generated by Svelte v3.32.3 */

const Route = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { method } = $$props;
	let { slug } = $$props;
	let { open = false } = $$props;

	const replaceAll = (str, find, replace) => {
		return str.split(find).join(replace);
	};

	const id = `${method}_${replaceAll(replaceAll(slug, "/", "-"), ":", "-")}`;
	if ($$props.method === void 0 && $$bindings.method && method !== void 0) $$bindings.method(method);
	if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0) $$bindings.slug(slug);
	if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);

	return `<div class="${"accordion-item"}"><h2 class="${"accordion-header"}"${add_attribute("id", `heading-${id}`, 0)}><button class="${["accordion-button align-items-center", !open ? "collapsed" : ""].join(" ").trim()}" type="${"button"}" data-bs-toggle="${"collapse"}"${add_attribute("data-bs-target", `#${id}`, 0)} aria-expanded="${"false"}"${add_attribute("aria-controls", `${id}`, 0)}>${validate_component(MethodBadge, "MethodBadge").$$render($$result, { method }, {}, {})}
      <h3 class="${"fs-6 ms-2 mb-0"}">${escape(slug)}</h3></button></h2>
  <div${add_attribute("id", `${id}`, 0)} class="${["accordion-collapse collapse", open ? "show" : ""].join(" ").trim()}"${add_attribute("aria-labelledby", `heading-${id}`, 0)} data-bs-parent="${"#apiOverview"}"><div class="${"accordion-body"}">${slots.default ? slots.default({}) : ``}</div></div></div>`;
});

/* src/components/ApiOverview/RouteBody.svelte generated by Svelte v3.32.3 */

const css$5 = {
	code: ".request.svelte-4u2812{font-size:.8em}",
	map: "{\"version\":3,\"file\":\"RouteBody.svelte\",\"sources\":[\"RouteBody.svelte\"],\"sourcesContent\":[\"<script>\\n  import Icon from '../Icon/Icon.svelte'\\n\\n  export let request\\n  export let status = 200\\n  export let response\\n</script>\\n\\n<style>\\n  .request {\\n    font-size: .8em;\\n  }\\n</style>\\n\\n<div class=\\\"d-flex flex-column align-items-center\\\">\\n  <pre class=\\\"mb-0\\\"><code class=\\\"text rounded-3 request\\\">{request}</code></pre>\\n  <Icon name=\\\"arrow-bar-bottom\\\" />\\n</div>\\n\\n<p class=\\\"fw-bold mb-1\\\">Status: {status}</p>\\n<pre><code class=\\\"json rounded-3\\\">{response}</code></pre>\"],\"names\":[],\"mappings\":\"AASE,QAAQ,cAAC,CAAC,AACR,SAAS,CAAE,IAAI,AACjB,CAAC\"}"
};

const RouteBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { request } = $$props;
	let { status = 200 } = $$props;
	let { response } = $$props;
	if ($$props.request === void 0 && $$bindings.request && request !== void 0) $$bindings.request(request);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.response === void 0 && $$bindings.response && response !== void 0) $$bindings.response(response);
	$$result.css.add(css$5);

	return `<div class="${"d-flex flex-column align-items-center"}"><pre class="${"mb-0"}"><code class="${"text rounded-3 request svelte-4u2812"}">${escape(request)}</code></pre>
  ${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-bar-bottom" }, {}, {})}</div>

<p class="${"fw-bold mb-1"}">Status: ${escape(status)}</p>
<pre><code class="${"json rounded-3"}">${escape(response)}</code></pre>`;
});

/* src/components/ApiOverview/ApiOverview.svelte generated by Svelte v3.32.3 */

const css$6 = {
	code: "#apiOverview.svelte-plmekt{max-height:80vh;border-color:black;overflow:auto}#apiOverview.svelte-plmekt .icon{width:2em!important}#apiOverview.svelte-plmekt .accordion-button{border-color:black}pre.svelte-plmekt{display:inline-block}",
	map: "{\"version\":3,\"file\":\"ApiOverview.svelte\",\"sources\":[\"ApiOverview.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">import Icon from '../Icon/Icon.svelte';\\nimport Route from './Route.svelte';\\nimport RouteBody from './RouteBody.svelte';\\nconst stringify = (json) => {\\n    return JSON.stringify(json, null, 2);\\n};\\n</script>\\n\\n<style style=\\\"scss\\\">\\n  #apiOverview {\\n    max-height: 80vh;\\n    border-color: black;\\n    overflow: auto;\\n  }\\n\\n  #apiOverview :global(.icon) {\\n    width: 2em!important;\\n  }\\n\\n  #apiOverview :global(.accordion-button) {\\n    border-color: black;\\n  }\\n\\n  pre {\\n    display: inline-block;\\n  }\\n</style>\\n\\n<div class=\\\"accordion bg-light\\\" id=\\\"apiOverview\\\">\\n  <Route method=\\\"GET\\\" slug=\\\"/me\\\">\\n    <RouteBody \\n      request=\\\"GET http://localhost:6767/api/me\\\" \\n      response={stringify({\\n        \\\"firstname\\\": \\\"Janie\\\",\\n        \\\"lastname\\\": \\\"Hermann\\\",\\n        \\\"email\\\": \\\"Jo.Kessler@yahoo.com\\\"\\n      })} \\n  />\\n  </Route>\\n\\n  <Route method=\\\"GET\\\" slug=\\\"/posts\\\">\\n    <RouteBody\\n      request=\\\"GET http://localhost:6767/api/posts\\\"\\n      response={stringify([\\n        {\\n          \\\"id\\\": 0,\\n          \\\"title\\\": \\\"Post n: #0\\\"\\n        },\\n        {\\n          \\\"id\\\": 1,\\n          \\\"title\\\": \\\"Post n: #1\\\"\\n        },\\n        {\\n          \\\"id\\\": 2,\\n          \\\"title\\\": \\\"Post n: #2\\\"\\n        },\\n        {\\n          \\\"id\\\": 3,\\n          \\\"title\\\": \\\"Post n: #3\\\"\\n        },\\n        {\\n          \\\"id\\\": 4,\\n          \\\"title\\\": \\\"Post n: #4\\\"\\n        },  \\n      ])} \\n    />\\n  </Route>\\n\\n  <Route method=\\\"GET\\\" slug=\\\"/users\\\">\\n    <RouteBody \\n      request=\\\"GET http://localhost:6767/api/users\\\"\\n      response={stringify([\\n        {\\n          \\\"id\\\": 0,\\n          \\\"email\\\": \\\"Julianne.Hegmann58@gmail.com\\\"\\n        },\\n        {\\n          \\\"id\\\": 1,\\n          \\\"email\\\": \\\"Sim44@gmail.com\\\"\\n        },\\n        '. . .',\\n        {\\n          \\\"id\\\": 24,\\n          \\\"email\\\": \\\"Evalyn_Kovacek71@hotmail.com\\\"\\n        }\\n      ])} \\n    />\\n    <hr>\\n    <RouteBody \\n      request=\\\"GET http://localhost:6767/api/users?limit=3\\\"\\n      response={stringify([\\n        {\\n          \\\"id\\\": 0,\\n          \\\"email\\\": \\\"Clyde.Cartwright@gmail.com\\\"\\n        },\\n        {\\n          \\\"id\\\": 1,\\n          \\\"email\\\": \\\"Maximilian42@yahoo.com\\\"\\n        },\\n        {\\n          \\\"id\\\": 2,\\n          \\\"email\\\": \\\"Betsy40@gmail.com\\\"\\n        }\\n      ])} \\n    />\\n  </Route>\\n\\n  <Route method=\\\"GET\\\" slug=\\\"/users/:userid\\\">\\n    <div class=\\\"d-flex flex-column align-items-center\\\">\\n      <pre class=\\\"mb-0\\\"><code class=\\\"text rounded-3\\\">GET http://localhost:6767/api/users/42</code></pre>\\n      <Icon name=\\\"arrow-bar-bottom\\\" />\\n    </div>\\n    <ul class=\\\"nav nav-tabs mb-3 align-items-baseline\\\" id=\\\"tabs-tab\\\" role=\\\"tablist\\\">\\n      <h5 class=\\\"mb-0 me-2\\\">State:</h5>\\n      <li class=\\\"nav-item\\\" role=\\\"presentation\\\">\\n        <button class=\\\"nav-link active\\\" id=\\\"tabs-default-tab\\\" data-bs-toggle=\\\"tab\\\" data-bs-target=\\\"#tabs-default\\\" type=\\\"button\\\" role=\\\"tab\\\" aria-controls=\\\"tabs-default\\\" aria-selected=\\\"true\\\">\\n          _default\\n        </button>\\n      </li>\\n      <li class=\\\"nav-item\\\" role=\\\"presentation\\\">\\n        <button class=\\\"nav-link\\\" id=\\\"tabs-not-found-tab\\\" data-bs-toggle=\\\"tab\\\" data-bs-target=\\\"#tabs-not-found\\\" type=\\\"button\\\" role=\\\"tab\\\" aria-controls=\\\"tabs-not-found\\\" aria-selected=\\\"false\\\">\\n          NOT_FOUND\\n        </button>\\n      </li>\\n    </ul>\\n    <div class=\\\"tab-content\\\" id=\\\"tabs-tabContent\\\">\\n      <div class=\\\"tab-pane fade show active\\\" id=\\\"tabs-default\\\" role=\\\"tabpanel\\\" aria-labelledby=\\\"tabs-default-tab\\\">\\n        <p class=\\\"fw-bold mb-1\\\">Status: 200</p>\\n        <pre class=\\\"w-100 rounded-3\\\">\\n          <code>{stringify({\\n            \\\"id\\\": 42,\\n            \\\"email\\\": \\\"Betsy40@gmail.com\\\"\\n          })}</code>\\n        </pre>\\n      </div>\\n      <div class=\\\"tab-pane fade\\\" id=\\\"tabs-not-found\\\" role=\\\"tabpanel\\\" aria-labelledby=\\\"tabs-not-found-tab\\\">\\n        <p class=\\\"fw-bold mb-1\\\">Status: 404</p>\\n      </div>\\n    </div>\\n  </Route>\\n  <Route method=\\\"POST\\\" slug=\\\"/users/:userid\\\">\\n    <RouteBody \\n      request=\\\"POST http://localhost:6767/api/users/42\\\"\\n      status={201}\\n      response={stringify({\\n        \\\"success\\\": true,\\n        \\\"data\\\": {\\n          \\\"id\\\": 42,\\n          \\\"email\\\": \\\"Maximilian42@yahoo.com\\\"\\n        }\\n      })} \\n    />\\n  </Route>\\n  <Route method=\\\"DELETE\\\" slug=\\\"/users/:userid\\\">\\n    <div class=\\\"d-flex flex-column align-items-center\\\">\\n      <pre class=\\\"mb-0\\\"><code class=\\\"text rounded-3\\\">DELETE http://localhost:6767/api/users/42</code></pre>\\n      <Icon name=\\\"arrow-bar-bottom\\\" />\\n    </div>\\n    <ul class=\\\"nav nav-tabs mb-3 align-items-baseline\\\" id=\\\"tabs-tab\\\" role=\\\"tablist\\\">\\n      <h5 class=\\\"mb-0 me-2\\\">State:</h5>\\n      <li class=\\\"nav-item\\\" role=\\\"presentation\\\">\\n        <button class=\\\"nav-link active\\\" id=\\\"tabs-del-user-default-tab\\\" data-bs-toggle=\\\"tab\\\" data-bs-target=\\\"#tabs-del-user-default\\\" type=\\\"button\\\" role=\\\"tab\\\" aria-controls=\\\"tabs-del-user-default\\\" aria-selected=\\\"true\\\">_default</button>\\n      </li>\\n      <li class=\\\"nav-item\\\" role=\\\"presentation\\\">\\n        <button class=\\\"nav-link\\\" id=\\\"tabs-inv-cred-tab\\\" data-bs-toggle=\\\"tab\\\" data-bs-target=\\\"#tabs-inv-cred\\\" type=\\\"button\\\" role=\\\"tab\\\" aria-controls=\\\"tabs-inv-cred\\\" aria-selected=\\\"false\\\">\\n          INV_CRED\\n        </button>\\n      </li>\\n    </ul>\\n    <div class=\\\"tab-content\\\" id=\\\"tabs-tabContent\\\">\\n      <div class=\\\"tab-pane fade show active\\\" id=\\\"tabs-del-user-default\\\" role=\\\"tabpanel\\\" aria-labelledby=\\\"tabs-del-user-default-tab\\\">\\n        <p class=\\\"fw-bold mb-1\\\">Status: 200</p>\\n        <pre class=\\\"w-100 rounded-3\\\">\\n          <code>{stringify({\\n            \\\"success\\\": true\\n          })}</code>\\n        </pre>\\n      </div>\\n      <div class=\\\"tab-pane fade\\\" id=\\\"tabs-inv-cred\\\" role=\\\"tabpanel\\\" aria-labelledby=\\\"tabs-inv-cred-tab\\\">\\n        <p class=\\\"fw-bold mb-1\\\">Status: 401</p>\\n      </div>\\n    </div>\\n  </Route>\\n  <Route method=\\\"GET\\\" slug=\\\"/users/:userid/comments\\\">\\n    <RouteBody \\n      request=\\\"GET http://localhost:6767/api/users/42/comments\\\"\\n      response={stringify([\\n        {\\n          \\\"id\\\": 0,\\n          \\\"creatorId\\\": 42,\\n          \\\"content\\\": \\\"Saepe ipsam est recusandae accusamus expedita. Magnam quibusdam aut enim omnis aspernatur libero facilis ab sed. Consequuntur aliquid quod ut ea. Vitae totam nemo error ut quo qui omnis et. Blanditiis natus corporis. Incidunt dolorem recusandae qui.\\\"\\n        },\\n        {\\n          \\\"id\\\": 1,\\n          \\\"creatorId\\\": 42,\\n          \\\"content\\\": \\\"Quibusdam aut illum sit dicta suscipit. Illo error quia nostrum quod aut. Asperiores vitae tenetur odit odio. Explicabo ab dolores. Molestiae corrupti hic officia nihil sunt veritatis adipisci et et.\\\"\\n        },\\n        '. . .',\\n        {\\n          \\\"id\\\": 24,\\n          \\\"creatorId\\\": 42,\\n          \\\"content\\\": \\\"Quo culpa dolorem. Est veniam dolorem nam. Dolor autem dolore qui aut repellendus. Necessitatibus voluptas et et asperiores voluptas consectetur placeat vitae. Voluptas neque et tempora sit aspernatur enim. Quibusdam autem optio veniam.\\\"\\n        }\\n      ])} \\n    />\\n  </Route>\\n</div>\"],\"names\":[],\"mappings\":\"AASE,YAAY,cAAC,CAAC,AACZ,UAAU,CAAE,IAAI,CAChB,YAAY,CAAE,KAAK,CACnB,QAAQ,CAAE,IAAI,AAChB,CAAC,AAED,0BAAY,CAAC,AAAQ,KAAK,AAAE,CAAC,AAC3B,KAAK,CAAE,GAAG,UAAU,AACtB,CAAC,AAED,0BAAY,CAAC,AAAQ,iBAAiB,AAAE,CAAC,AACvC,YAAY,CAAE,KAAK,AACrB,CAAC,AAED,GAAG,cAAC,CAAC,AACH,OAAO,CAAE,YAAY,AACvB,CAAC\"}"
};

const ApiOverview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	const stringify = json => {
		return JSON.stringify(json, null, 2);
	};

	$$result.css.add(css$6);

	return `<div class="${"accordion bg-light svelte-plmekt"}" id="${"apiOverview"}">${validate_component(Route, "Route").$$render($$result, { method: "GET", slug: "/me" }, {}, {
		default: () => `${validate_component(RouteBody, "RouteBody").$$render(
			$$result,
			{
				request: "GET http://localhost:6767/api/me",
				response: stringify({
					"firstname": "Janie",
					"lastname": "Hermann",
					"email": "Jo.Kessler@yahoo.com"
				})
			},
			{},
			{}
		)}`
	})}

  ${validate_component(Route, "Route").$$render($$result, { method: "GET", slug: "/posts" }, {}, {
		default: () => `${validate_component(RouteBody, "RouteBody").$$render(
			$$result,
			{
				request: "GET http://localhost:6767/api/posts",
				response: stringify([
					{ "id": 0, "title": "Post n: #0" },
					{ "id": 1, "title": "Post n: #1" },
					{ "id": 2, "title": "Post n: #2" },
					{ "id": 3, "title": "Post n: #3" },
					{ "id": 4, "title": "Post n: #4" }
				])
			},
			{},
			{}
		)}`
	})}

  ${validate_component(Route, "Route").$$render($$result, { method: "GET", slug: "/users" }, {}, {
		default: () => `${validate_component(RouteBody, "RouteBody").$$render(
			$$result,
			{
				request: "GET http://localhost:6767/api/users",
				response: stringify([
					{
						"id": 0,
						"email": "Julianne.Hegmann58@gmail.com"
					},
					{ "id": 1, "email": "Sim44@gmail.com" },
					". . .",
					{
						"id": 24,
						"email": "Evalyn_Kovacek71@hotmail.com"
					}
				])
			},
			{},
			{}
		)}
    <hr>
    ${validate_component(RouteBody, "RouteBody").$$render(
			$$result,
			{
				request: "GET http://localhost:6767/api/users?limit=3",
				response: stringify([
					{
						"id": 0,
						"email": "Clyde.Cartwright@gmail.com"
					},
					{
						"id": 1,
						"email": "Maximilian42@yahoo.com"
					},
					{ "id": 2, "email": "Betsy40@gmail.com" }
				])
			},
			{},
			{}
		)}`
	})}

  ${validate_component(Route, "Route").$$render($$result, { method: "GET", slug: "/users/:userid" }, {}, {
		default: () => `<div class="${"d-flex flex-column align-items-center"}"><pre class="${"mb-0 svelte-plmekt"}"><code class="${"text rounded-3"}">GET http://localhost:6767/api/users/42</code></pre>
      ${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-bar-bottom" }, {}, {})}</div>
    <ul class="${"nav nav-tabs mb-3 align-items-baseline"}" id="${"tabs-tab"}" role="${"tablist"}"><h5 class="${"mb-0 me-2"}">State:</h5>
      <li class="${"nav-item"}" role="${"presentation"}"><button class="${"nav-link active"}" id="${"tabs-default-tab"}" data-bs-toggle="${"tab"}" data-bs-target="${"#tabs-default"}" type="${"button"}" role="${"tab"}" aria-controls="${"tabs-default"}" aria-selected="${"true"}">_default
        </button></li>
      <li class="${"nav-item"}" role="${"presentation"}"><button class="${"nav-link"}" id="${"tabs-not-found-tab"}" data-bs-toggle="${"tab"}" data-bs-target="${"#tabs-not-found"}" type="${"button"}" role="${"tab"}" aria-controls="${"tabs-not-found"}" aria-selected="${"false"}">NOT_FOUND
        </button></li></ul>
    <div class="${"tab-content"}" id="${"tabs-tabContent"}"><div class="${"tab-pane fade show active"}" id="${"tabs-default"}" role="${"tabpanel"}" aria-labelledby="${"tabs-default-tab"}"><p class="${"fw-bold mb-1"}">Status: 200</p>
        <pre class="${"w-100 rounded-3 svelte-plmekt"}"><code>${escape(stringify({ "id": 42, "email": "Betsy40@gmail.com" }))}</code></pre></div>
      <div class="${"tab-pane fade"}" id="${"tabs-not-found"}" role="${"tabpanel"}" aria-labelledby="${"tabs-not-found-tab"}"><p class="${"fw-bold mb-1"}">Status: 404</p></div></div>`
	})}
  ${validate_component(Route, "Route").$$render($$result, { method: "POST", slug: "/users/:userid" }, {}, {
		default: () => `${validate_component(RouteBody, "RouteBody").$$render(
			$$result,
			{
				request: "POST http://localhost:6767/api/users/42",
				status: 201,
				response: stringify({
					"success": true,
					"data": {
						"id": 42,
						"email": "Maximilian42@yahoo.com"
					}
				})
			},
			{},
			{}
		)}`
	})}
  ${validate_component(Route, "Route").$$render($$result, { method: "DELETE", slug: "/users/:userid" }, {}, {
		default: () => `<div class="${"d-flex flex-column align-items-center"}"><pre class="${"mb-0 svelte-plmekt"}"><code class="${"text rounded-3"}">DELETE http://localhost:6767/api/users/42</code></pre>
      ${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-bar-bottom" }, {}, {})}</div>
    <ul class="${"nav nav-tabs mb-3 align-items-baseline"}" id="${"tabs-tab"}" role="${"tablist"}"><h5 class="${"mb-0 me-2"}">State:</h5>
      <li class="${"nav-item"}" role="${"presentation"}"><button class="${"nav-link active"}" id="${"tabs-del-user-default-tab"}" data-bs-toggle="${"tab"}" data-bs-target="${"#tabs-del-user-default"}" type="${"button"}" role="${"tab"}" aria-controls="${"tabs-del-user-default"}" aria-selected="${"true"}">_default</button></li>
      <li class="${"nav-item"}" role="${"presentation"}"><button class="${"nav-link"}" id="${"tabs-inv-cred-tab"}" data-bs-toggle="${"tab"}" data-bs-target="${"#tabs-inv-cred"}" type="${"button"}" role="${"tab"}" aria-controls="${"tabs-inv-cred"}" aria-selected="${"false"}">INV_CRED
        </button></li></ul>
    <div class="${"tab-content"}" id="${"tabs-tabContent"}"><div class="${"tab-pane fade show active"}" id="${"tabs-del-user-default"}" role="${"tabpanel"}" aria-labelledby="${"tabs-del-user-default-tab"}"><p class="${"fw-bold mb-1"}">Status: 200</p>
        <pre class="${"w-100 rounded-3 svelte-plmekt"}"><code>${escape(stringify({ "success": true }))}</code></pre></div>
      <div class="${"tab-pane fade"}" id="${"tabs-inv-cred"}" role="${"tabpanel"}" aria-labelledby="${"tabs-inv-cred-tab"}"><p class="${"fw-bold mb-1"}">Status: 401</p></div></div>`
	})}
  ${validate_component(Route, "Route").$$render(
		$$result,
		{
			method: "GET",
			slug: "/users/:userid/comments"
		},
		{},
		{
			default: () => `${validate_component(RouteBody, "RouteBody").$$render(
				$$result,
				{
					request: "GET http://localhost:6767/api/users/42/comments",
					response: stringify([
						{
							"id": 0,
							"creatorId": 42,
							"content": "Saepe ipsam est recusandae accusamus expedita. Magnam quibusdam aut enim omnis aspernatur libero facilis ab sed. Consequuntur aliquid quod ut ea. Vitae totam nemo error ut quo qui omnis et. Blanditiis natus corporis. Incidunt dolorem recusandae qui."
						},
						{
							"id": 1,
							"creatorId": 42,
							"content": "Quibusdam aut illum sit dicta suscipit. Illo error quia nostrum quod aut. Asperiores vitae tenetur odit odio. Explicabo ab dolores. Molestiae corrupti hic officia nihil sunt veritatis adipisci et et."
						},
						". . .",
						{
							"id": 24,
							"creatorId": 42,
							"content": "Quo culpa dolorem. Est veniam dolorem nam. Dolor autem dolore qui aut repellendus. Necessitatibus voluptas et et asperiores voluptas consectetur placeat vitae. Voluptas neque et tempora sit aspernatur enim. Quibusdam autem optio veniam."
						}
					])
				},
				{},
				{}
			)}`
		}
	)}</div>`;
});

/* src/components/Header.svelte generated by Svelte v3.32.3 */

const css$7 = {
	code: "header.svelte-kkpmth.svelte-kkpmth{position:relative;min-height:80vh}header.svelte-kkpmth h1.svelte-kkpmth{margin-top:10vh}header.svelte-kkpmth #bg.svelte-kkpmth{position:absolute;top:-10%;left:-20%;width:120%;opacity:.3;z-index:-1}header.svelte-kkpmth #arrowSeparator.svelte-kkpmth .icon{width:2.5em}header.svelte-kkpmth .api-overview.svelte-kkpmth{height:100%;overflow:auto}header.svelte-kkpmth #filesTree.svelte-kkpmth{height:80vh;overflow:auto}header.svelte-kkpmth #filesTree.svelte-kkpmth img{width:1.3em !important}@media(max-width: 768px){header.svelte-kkpmth.svelte-kkpmth{overflow-x:hidden}header.svelte-kkpmth #bg.svelte-kkpmth{top:-5%;left:-50%;height:100vh;width:auto}header.svelte-kkpmth #arrowSeparator.svelte-kkpmth{transform:rotate(90deg);margin:1em 0}}",
	map: "{\"version\":3,\"file\":\"Header.svelte\",\"sources\":[\"Header.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">import bg from '../assets/restapify-icon-bg.svg';\\nimport Folder from './Folder.svelte';\\nimport ApiOverview from \\\"./ApiOverview/ApiOverview.svelte\\\";\\nimport Terminal from \\\"./Terminal.svelte\\\";\\nimport Icon from \\\"./Icon/Icon.svelte\\\";\\nlet root = [\\n    {\\n        type: 'folder',\\n        name: 'posts',\\n        files: [\\n            {\\n                type: 'file',\\n                name: '*.json',\\n                expended: true,\\n                content: [\\n                    \\\"#for i in range(5)\\\",\\n                    {\\n                        id: \\\"n:[i]\\\",\\n                        title: \\\"Post n: #[i]\\\"\\n                    },\\n                    \\\"#endfor\\\"\\n                ]\\n            }\\n        ]\\n    },\\n    {\\n        type: 'folder',\\n        name: 'users',\\n        expanded: true,\\n        files: [\\n            {\\n                type: 'file',\\n                name: '*.json',\\n                content: [\\n                    \\\"#for i in range([q:limit|25])\\\",\\n                    {\\n                        id: \\\"n:[i]\\\",\\n                        email: \\\"[#faker:internet:email]\\\"\\n                    },\\n                    \\\"#endfor\\\"\\n                ]\\n            },\\n            {\\n                type: 'folder',\\n                name: '[userid]',\\n                expanded: true,\\n                files: [\\n                    {\\n                        type: 'file',\\n                        name: '*.json',\\n                        content: {\\n                            id: \\\"n:[userid]\\\",\\n                            email: \\\"[#faker:internet:email]\\\"\\n                        },\\n                    },\\n                    {\\n                        type: 'file',\\n                        name: '*.404.{NOT_FOUND}.json',\\n                        content: [null],\\n                    },\\n                    {\\n                        type: 'file',\\n                        name: '*.DELETE.401.{INV_CRED}.json',\\n                        content: [null],\\n                    },\\n                    {\\n                        type: 'file',\\n                        name: '*.DELETE.json',\\n                        content: {\\n                            \\\"#header\\\": {\\n                                \\\"Content-Type\\\": \\\"text/html; charset=UTF-8\\\"\\n                            },\\n                            \\\"#body\\\": {\\n                                \\\"success\\\": true,\\n                            }\\n                        }\\n                    },\\n                    {\\n                        type: 'file',\\n                        name: '*.POST.201.json',\\n                        content: {\\n                            success: true,\\n                            data: {\\n                                id: \\\"n:[userid]\\\",\\n                                email: \\\"[#faker:internet:email]\\\"\\n                            }\\n                        }\\n                    },\\n                    {\\n                        type: 'file',\\n                        name: 'comments.json',\\n                        content: [\\n                            \\\"#for i in range([q:limit|25])\\\",\\n                            {\\n                                id: \\\"n:[i]\\\",\\n                                creatorId: \\\"n:[userid]\\\",\\n                                content: \\\"[#faker:lorem:sentences]\\\"\\n                            },\\n                            \\\"#endfor\\\"\\n                        ]\\n                    }\\n                ]\\n            },\\n        ]\\n    },\\n    {\\n        type: 'file',\\n        name: 'me.json',\\n        content: {\\n            firstname: \\\"[#faker:name:firstName]\\\",\\n            lastname: \\\"[#faker:name:lastName]\\\",\\n            email: \\\"[#faker:internet:email]\\\"\\n        }\\n    }\\n];\\n</script>\\n\\n<style lang=\\\"scss\\\">header {\\n  position: relative;\\n  min-height: 80vh; }\\n  header h1 {\\n    margin-top: 10vh; }\\n  header #bg {\\n    position: absolute;\\n    top: -10%;\\n    left: -20%;\\n    width: 120%;\\n    opacity: .3;\\n    z-index: -1; }\\n  header #arrowSeparator :global(.icon) {\\n    width: 2.5em; }\\n  header .api-overview {\\n    height: 100%;\\n    overflow: auto; }\\n  header #filesTree {\\n    height: 80vh;\\n    overflow: auto; }\\n  header #filesTree :global(img) {\\n    width: 1.3em !important; }\\n  @media (max-width: 768px) {\\n    header {\\n      overflow-x: hidden; }\\n      header #bg {\\n        top: -5%;\\n        left: -50%;\\n        height: 100vh;\\n        width: auto; }\\n      header #arrowSeparator {\\n        transform: rotate(90deg);\\n        margin: 1em 0; } }\\n</style>\\n\\n<header class=\\\"px-3 d-flex flex-column\\\">\\n  <img src={bg} id=\\\"bg\\\" alt=\\\"Design colors\\\" />\\n  <h1 class=\\\"text-center px-2 px-md-5\\\">\\n    Quickly and easily deploy a mocked REST API\\n  </h1>\\n  <p class=\\\"text-center fs-5 lh-sm\\\">Save time on the development of your Frontend project by avoiding wasting it on the API mocking.</p>\\n  <Terminal class=\\\"mx-auto mt-5\\\" content={`$ yarn global add restapify \\n# or npm install -g restapify\\n$ restapify serve mockedApi/`} language=\\\"bash\\\"/>\\n  <div class=\\\"row justify-content-center mt-5\\\">\\n    <div class=\\\"col-11 col-md-5 col-lg-4 p-0\\\">\\n      <h3>#1 Define routes\\n        <a href=\\\"/docs\\\" class=\\\"fs-6 text-decoration-none\\\">[docs]</a>\\n      </h3>\\n      <div id=\\\"filesTree\\\" class=\\\"p-3 bg-light border border-dark rounded-3\\\">\\n        <Folder name=\\\"mockedApi\\\" files={root} expanded/>\\n      </div>\\n    </div>\\n    <div id=\\\"arrowSeparator\\\" class=\\\"col-12 col-md-1 align-self-center d-flex justify-content-center\\\">\\n      <Icon name='arrow-right' />\\n    </div>\\n    <div class=\\\"col-11 col-md-5 col-lg-4 p-0 api-overview\\\">\\n      <h3>#2 Consume the API</h3>\\n      <ApiOverview />\\n    </div>\\n  </div>\\n</header>\"],\"names\":[],\"mappings\":\"AAqHmB,MAAM,4BAAC,CAAC,AACzB,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,IAAI,AAAE,CAAC,AACnB,oBAAM,CAAC,EAAE,cAAC,CAAC,AACT,UAAU,CAAE,IAAI,AAAE,CAAC,AACrB,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,EAAE,AAAE,CAAC,AAChB,oBAAM,CAAC,6BAAe,CAAC,AAAQ,KAAK,AAAE,CAAC,AACrC,KAAK,CAAE,KAAK,AAAE,CAAC,AACjB,oBAAM,CAAC,aAAa,cAAC,CAAC,AACpB,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,AAAE,CAAC,AACnB,oBAAM,CAAC,UAAU,cAAC,CAAC,AACjB,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,AAAE,CAAC,AACnB,oBAAM,CAAC,wBAAU,CAAC,AAAQ,GAAG,AAAE,CAAC,AAC9B,KAAK,CAAE,KAAK,CAAC,UAAU,AAAE,CAAC,AAC5B,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,4BAAC,CAAC,AACN,UAAU,CAAE,MAAM,AAAE,CAAC,AACrB,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,IAAI,AAAE,CAAC,AAChB,oBAAM,CAAC,eAAe,cAAC,CAAC,AACtB,SAAS,CAAE,OAAO,KAAK,CAAC,CACxB,MAAM,CAAE,GAAG,CAAC,CAAC,AAAE,CAAC,AAAC,CAAC\"}"
};

const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let root = [
		{
			type: "folder",
			name: "posts",
			files: [
				{
					type: "file",
					name: "*.json",
					expended: true,
					content: [
						"#for i in range(5)",
						{ id: "n:[i]", title: "Post n: #[i]" },
						"#endfor"
					]
				}
			]
		},
		{
			type: "folder",
			name: "users",
			expanded: true,
			files: [
				{
					type: "file",
					name: "*.json",
					content: [
						"#for i in range([q:limit|25])",
						{
							id: "n:[i]",
							email: "[#faker:internet:email]"
						},
						"#endfor"
					]
				},
				{
					type: "folder",
					name: "[userid]",
					expanded: true,
					files: [
						{
							type: "file",
							name: "*.json",
							content: {
								id: "n:[userid]",
								email: "[#faker:internet:email]"
							}
						},
						{
							type: "file",
							name: "*.404.{NOT_FOUND}.json",
							content: [null]
						},
						{
							type: "file",
							name: "*.DELETE.401.{INV_CRED}.json",
							content: [null]
						},
						{
							type: "file",
							name: "*.DELETE.json",
							content: {
								"#header": {
									"Content-Type": "text/html; charset=UTF-8"
								},
								"#body": { "success": true }
							}
						},
						{
							type: "file",
							name: "*.POST.201.json",
							content: {
								success: true,
								data: {
									id: "n:[userid]",
									email: "[#faker:internet:email]"
								}
							}
						},
						{
							type: "file",
							name: "comments.json",
							content: [
								"#for i in range([q:limit|25])",
								{
									id: "n:[i]",
									creatorId: "n:[userid]",
									content: "[#faker:lorem:sentences]"
								},
								"#endfor"
							]
						}
					]
				}
			]
		},
		{
			type: "file",
			name: "me.json",
			content: {
				firstname: "[#faker:name:firstName]",
				lastname: "[#faker:name:lastName]",
				email: "[#faker:internet:email]"
			}
		}
	];

	$$result.css.add(css$7);

	return `<header class="${"px-3 d-flex flex-column svelte-kkpmth"}"><img${add_attribute("src", bg, 0)} id="${"bg"}" alt="${"Design colors"}" class="${"svelte-kkpmth"}">
  <h1 class="${"text-center px-2 px-md-5 svelte-kkpmth"}">Quickly and easily deploy a mocked REST API
  </h1>
  <p class="${"text-center fs-5 lh-sm"}">Save time on the development of your Frontend project by avoiding wasting it on the API mocking.</p>
  ${validate_component(Terminal, "Terminal").$$render(
		$$result,
		{
			class: "mx-auto mt-5",
			content: `$ yarn global add restapify 
# or npm install -g restapify
$ restapify serve mockedApi/`,
			language: "bash"
		},
		{},
		{}
	)}
  <div class="${"row justify-content-center mt-5"}"><div class="${"col-11 col-md-5 col-lg-4 p-0"}"><h3>#1 Define routes
        <a href="${"/docs"}" class="${"fs-6 text-decoration-none"}">[docs]</a></h3>
      <div id="${"filesTree"}" class="${"p-3 bg-light border border-dark rounded-3 svelte-kkpmth"}">${validate_component(Folder, "Folder").$$render(
		$$result,
		{
			name: "mockedApi",
			files: root,
			expanded: true
		},
		{},
		{}
	)}</div></div>
    <div id="${"arrowSeparator"}" class="${"col-12 col-md-1 align-self-center d-flex justify-content-center svelte-kkpmth"}">${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-right" }, {}, {})}</div>
    <div class="${"col-11 col-md-5 col-lg-4 p-0 api-overview svelte-kkpmth"}"><h3>#2 Consume the API</h3>
      ${validate_component(ApiOverview, "ApiOverview").$$render($$result, {}, {}, {})}</div></div></header>`;
});

/* src/components/Features.svelte generated by Svelte v3.32.3 */

const Features = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	const FEATURES = [
		{
			title: "💡 Incredible DX",
			description: "Intuitive files structure and JSON syntax to cover all the scenarios of your future API"
		},
		{
			title: "✅ JSON valid",
			description: "You will only use <code>.json</code> files that follows the <a href=\"https://www.ecma-international.org/publications-and-standards/standards/ecma-404/\">ECMA-404</a> standard"
		},
		{
			title: "🎛 Dashboard ",
			description: "Out of the box Single Page Application to explore and manage your mocked API"
		},
		{
			title: "💻 CLI",
			description: "Use the CLI for an instant deployment"
		},
		{
			title: "📝 Fakerjs implementation",
			description: "Intuitive syntax to quickly populate your API responses with the famous <a href=\"https://github.com/marak/Faker.js/\">fakerjs</a> library"
		},
		{
			title: "🔥 Built in hot watcher",
			description: "Directly see your changes after a file update"
		}
	];

	return `<div class="${"row mx-4"}">${each(FEATURES, feature => `<div class="${"col-md-4 px-1 px-md-4 mb-1 mb-md-5"}"><h3 class="${"mb-3 fs-4"}">${escape(feature.title)}</h3>
      <p class="${"grey-text mb-md-0 mb-5 lh-sm"}">${feature.description}</p>
    </div>`)}</div>`;
});

/* src/components/GettingStarted.svelte generated by Svelte v3.32.3 */

const GettingStarted = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	const instanciateRpfy = `import * as path from 'path'
import Restapify from 'restapify'

const apiFolderPath = path.resolve(__dirname, './path/to/folder')

const rpfy = new Restapify({
  rootDir: apiFolderPath
})
rpfy.run()`;

	return `<div class="${"row justify-content-center"}"><div class="${"col-md-8"}"><h2>Getting Started</h2>
    <h4 class="${"mt-5"}">Using the cli</h4>
    <p>The simplest way to use Restapify is to use his <a href="${"/docs#cli"}">cli</a> ...</p>
    <pre><code class="${"rounded-3 bash"}">yarn global add restapify
# or npm install -g restapify</code></pre>
    <p>...and then serve your api folder:</p>
    <pre><code class="${"rounded-3 bash"}">restapify serve path/to/folder/</code></pre>

    <h4 class="${"mt-5"}">Using the JavaScript class</h4>

    <p>You can install restapify&#39;s class using \`npm\` (note that this package should be a devDependency):</p>
    <pre><code class="${"rounded-3 bash"}">yarn add -D restapify
# or npm i -D restapify</code></pre>
    <p>You can then import the class and instantiate it to serve the api folder:</p>
    <pre><code class="${"rounded-3 js"}">${escape(instanciateRpfy)}</code></pre></div></div>`;
});

/* src/routes/index.svelte generated by Svelte v3.32.3 */

const css$8 = {
	code: "#home.svelte-139o43o{height:100%;overflow:auto}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from \\\"svelte\\\"\\n  import { initHighlightJs } from \\\"../utils\\\"\\n\\timport Header from '../components/Header.svelte'\\n\\timport Features from '../components/Features.svelte'\\n\\timport GettingStarted from '../components/GettingStarted.svelte'\\n\\n\\tonMount(() => {\\n    initHighlightJs()\\n  })\\n</script>\\n\\n<style>\\n\\th1, figure, p {\\n\\t\\ttext-align: center;\\n\\t\\tmargin: 0 auto;\\n\\t}\\n\\n\\th1 {\\n\\t\\tfont-size: 2.8em;\\n\\t\\ttext-transform: uppercase;\\n\\t\\tfont-weight: 700;\\n\\t\\tmargin: 0 0 0.5em 0;\\n\\t}\\n\\n\\tfigure {\\n\\t\\tmargin: 0 0 1em 0;\\n\\t}\\n\\n\\timg {\\n\\t\\twidth: 100%;\\n\\t\\tmax-width: 400px;\\n\\t\\tmargin: 0 0 1em 0;\\n\\t}\\n\\n\\tp {\\n\\t\\tmargin: 1em auto;\\n\\t}\\n\\n\\t#home {\\n\\t\\theight: 100%;\\n\\t\\toverflow: auto;\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>Restapify</title>\\n\\t<link rel=\\\"stylesheet\\\" href=\\\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/vs2015.min.css\\\" integrity=\\\"sha512-w8aclkBlN3Ha08SMwFKXFJqhSUx2qlvTBFLLelF8sm4xQnlg64qmGB/A6pBIKy0W8Bo51yDMDtQiPLNRq1WMcQ==\\\" crossorigin=\\\"anonymous\\\" />\\n</svelte:head>\\n\\n<div id=\\\"home\\\">\\n\\t<Header />\\n\\t<section class=\\\"container my-5 py-5\\\">\\n\\t\\t<Features />\\n\\t\\t<hr />\\n\\t\\t<GettingStarted />\\n\\t</section>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAuCC,KAAK,eAAC,CAAC,AACN,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,AACf,CAAC\"}"
};

const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	onMount(() => {
		initHighlightJs();
	});

	$$result.css.add(css$8);

	return `${($$result.head += `${($$result.title = `<title>Restapify</title>`, "")}<link rel="${"stylesheet"}" href="${"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/vs2015.min.css"}" integrity="${"sha512-w8aclkBlN3Ha08SMwFKXFJqhSUx2qlvTBFLLelF8sm4xQnlg64qmGB/A6pBIKy0W8Bo51yDMDtQiPLNRq1WMcQ=="}" crossorigin="${"anonymous"}" data-svelte="svelte-11sxile">`, "")}

<div id="${"home"}" class="${"svelte-139o43o"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
	<section class="${"container my-5 py-5"}">${validate_component(Features, "Features").$$render($$result, {}, {}, {})}
		<hr>
		${validate_component(GettingStarted, "GettingStarted").$$render($$result, {}, {}, {})}</section></div>`;
});

var component_0 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Routes
});

const DOCS_URL = 'https://raw.githubusercontent.com/johannchopin/restapify/main/docs/README.md';
const classMap = {
    h3: 'mt-5',
    h4: 'mt-4',
    ul: 'list-group list-group-flush',
    li: 'list-group-item',
    pre: 'rounded-2',
    blockquote: 'alert alert-warning',
    table: 'table table-striped'
};
const classInjectionExt = Object.keys(classMap)
    .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`
}));
const idLinkReplacerExt = {
    type: 'output',
    regex: new RegExp(` href="#(.*)"`, 'g'),
    replace: ` href="docs#$1"`
};
const getHtmlListFromDoc = (doc) => {
    return doc.substring(doc.lastIndexOf("<!-- START doctoc generated TOC please keep comment here to allow auto update -->"), doc.lastIndexOf("<!-- END doctoc generated TOC please keep comment here to allow auto update -->"));
};
const getContentTableAsHtml = (md) => {
    const mdList = getHtmlListFromDoc(md);
    const converter = new showdown__default['default'].Converter({
        disableForced4SpacesIndentedSublists: true,
        ghCompatibleHeaderId: true,
        extensions: [
            idLinkReplacerExt
        ]
    });
    return converter.makeHtml(mdList);
};
const getDocsAsHtml = (doc) => {
    const docWithoutList = doc.replace(getHtmlListFromDoc(doc), '');
    const converter = new showdown__default['default'].Converter({
        disableForced4SpacesIndentedSublists: true,
        ghCompatibleHeaderId: true,
        tables: true,
        extensions: [
            classInjectionExt,
            idLinkReplacerExt
        ]
    });
    return converter.makeHtml(docWithoutList);
};

var editIcon = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-pencil-square%22%20viewBox%3D%220%200%2016%2016%22%3E%20%20%3Cpath%20d%3D%22M15.502%201.94a.5.5%200%200%201%200%20.706L14.459%203.69l-2-2L13.502.646a.5.5%200%200%201%20.707%200l1.293%201.293zm-1.75%202.456l-2-2L4.939%209.21a.5.5%200%200%200-.121.196l-.805%202.414a.25.25%200%200%200%20.316.316l2.414-.805a.5.5%200%200%200%20.196-.12l6.813-6.814z%22%2F%3E%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M1%2013.5A1.5%201.5%200%200%200%202.5%2015h11a1.5%201.5%200%200%200%201.5-1.5v-6a.5.5%200%200%200-1%200v6a.5.5%200%200%201-.5.5h-11a.5.5%200%200%201-.5-.5v-11a.5.5%200%200%201%20.5-.5H9a.5.5%200%200%200%200-1H2.5A1.5%201.5%200%200%200%201%202.5v11z%22%2F%3E%3C%2Fsvg%3E";

/* src/routes/docs.svelte generated by Svelte v3.32.3 */

const css$9 = {
	code: "#wrapper.svelte-1hb9u9u.svelte-1hb9u9u{height:100%}#sidebar.svelte-1hb9u9u.svelte-1hb9u9u{position:relative;min-width:20vw;height:100%;overflow:auto;padding-right:1rem}#sidebar.svelte-1hb9u9u a{white-space:nowrap;color:black;text-decoration:none}#sidebar.svelte-1hb9u9u a:focus,#sidebar.svelte-1hb9u9u a:hover{text-decoration:underline}#sidebar.svelte-1hb9u9u a{white-space:nowrap;color:black;text-decoration:none}#sidebar.svelte-1hb9u9u>ul > li{margin-top:1em}#sidebar.svelte-1hb9u9u>ul > li > a{font-weight:bold}#sidebar.svelte-1hb9u9u ul{padding-left:1rem}#sidebar.svelte-1hb9u9u li{list-style:none}#docs.svelte-1hb9u9u.svelte-1hb9u9u{flex-grow:1;height:100%;overflow:auto;scroll-behavior:smooth}#docs.svelte-1hb9u9u a.btn:hover img.svelte-1hb9u9u{filter:invert(100%)}#docs.svelte-1hb9u9u h2:not(:first-of-type){margin-top:40vh}#docs.svelte-1hb9u9u h2:not(:first-of-type)::before{content:\"\";display:inline-block;width:100%;height:2px;background-color:lightgray;margin-bottom:1rem}#docs.svelte-1hb9u9u blockquote p{margin:0}#toggleSidebarBtn.svelte-1hb9u9u.svelte-1hb9u9u{width:fit-content;z-index:2}#toggleSidebarBtn.svelte-1hb9u9u img,#closeSidebarBtn.svelte-1hb9u9u img{width:1.5em}@media(max-width: 768px){#sidebar.svelte-1hb9u9u.svelte-1hb9u9u{position:absolute;z-index:1}}",
	map: "{\"version\":3,\"file\":\"docs.svelte\",\"sources\":[\"docs.svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\n  import { getDocsAsHtml, getContentTableAsHtml, DOCS_URL } from \\\"../docs-generation/getDocs\\\";\\n\\n  export async function preload(page) {\\n    const response = await this.fetch(DOCS_URL)\\n    const inlineMd = await response.text()\\n    const htmlContentTable = getContentTableAsHtml(inlineMd)\\n\\t\\tconst htmlContent = getDocsAsHtml(inlineMd)\\n\\n\\t\\treturn { htmlContent, htmlContentTable };\\n\\t}\\n</script>\\n\\n<script>\\n  import { onMount } from \\\"svelte\\\"\\n  import { initHighlightJs } from \\\"../utils\\\"\\n  import Icon from '../components/Icon/Icon.svelte'\\n  import editIcon from '../assets/edit-icon.svg'\\n\\n  export let htmlContent\\n  export let htmlContentTable\\n\\n  let showSidebar = true\\n  \\n  const scrollToSection = () => {\\n    const url = window.location.href\\n    const id = url.substring(url.lastIndexOf('#'))\\n\\n    const urlContainsId = id.startsWith('#')\\n\\n    if (urlContainsId) {\\n      document.getElementById(id.substring(1)).scrollIntoView();\\n    }\\n  }\\n\\n  const toggleSidebar = () => {\\n    showSidebar = !showSidebar\\n  }\\n\\n  onMount(() => {\\n    initHighlightJs()\\n    scrollToSection()\\n  })\\n</script>\\n\\n<style lang=\\\"scss\\\">#wrapper {\\n  height: 100%; }\\n\\n#sidebar {\\n  position: relative;\\n  min-width: 20vw;\\n  height: 100%;\\n  overflow: auto;\\n  padding-right: 1rem; }\\n  #sidebar :global(a) {\\n    white-space: nowrap;\\n    color: black;\\n    text-decoration: none; }\\n    #sidebar :global(a):focus, #sidebar :global(a):hover {\\n      text-decoration: underline; }\\n  #sidebar :global(a) {\\n    white-space: nowrap;\\n    color: black;\\n    text-decoration: none; }\\n  #sidebar > :global(ul > li) {\\n    margin-top: 1em; }\\n  #sidebar > :global(ul > li > a) {\\n    font-weight: bold; }\\n  #sidebar :global(ul) {\\n    padding-left: 1rem; }\\n  #sidebar :global(li) {\\n    list-style: none; }\\n\\n#docs {\\n  flex-grow: 1;\\n  height: 100%;\\n  overflow: auto;\\n  scroll-behavior: smooth; }\\n  #docs a.btn:hover img {\\n    filter: invert(100%); }\\n  #docs :global(h2:not(:first-of-type)) {\\n    margin-top: 40vh; }\\n    #docs :global(h2:not(:first-of-type))::before {\\n      content: \\\"\\\";\\n      display: inline-block;\\n      width: 100%;\\n      height: 2px;\\n      background-color: lightgray;\\n      margin-bottom: 1rem; }\\n  #docs :global(blockquote p) {\\n    margin: 0; }\\n\\n#toggleSidebarBtn {\\n  width: fit-content;\\n  z-index: 2; }\\n\\n#toggleSidebarBtn :global(img),\\n#closeSidebarBtn :global(img) {\\n  width: 1.5em; }\\n\\n@media (max-width: 768px) {\\n  #sidebar {\\n    position: absolute;\\n    z-index: 1; } }\\n</style>\\n\\n<svelte:head>\\n\\t<title>Docs • Restapify</title>\\n  <link rel=\\\"stylesheet\\\" href=\\\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/zenburn.min.css\\\" integrity=\\\"sha512-JPxjD2t82edI35nXydY/erE9jVPpqxEJ++6nYEoZEpX2TRsmp2FpZuQqZa+wBCen5U16QZOkMadGXHCfp+tUdg==\\\" crossorigin=\\\"anonymous\\\" />\\n</svelte:head>\\n\\n<div class=\\\"row\\\" id=\\\"wrapper\\\">\\n\\t<div id=\\\"sidebar\\\" class=\\\"bg-light col-11 col-md-3 border-end\\\" class:d-none={!showSidebar}>\\n    {@html htmlContentTable}\\n    <button\\n      id=\\\"closeSidebarBtn\\\"\\n      class=\\\"d-md-none btn btn-outline-dark bg-light position-absolute top-0 end-0 m-2\\\" \\n      on:click={() => { showSidebar = false }}\\n    >\\n      <Icon name=\\\"x\\\" />\\n    </button>\\n  </div>\\n  <section id=\\\"docs\\\" class=\\\"position-relative col p-4\\\">\\n    <a \\n      href=\\\"https://github.com/johannchopin/restapify/edit/main/docs/README.md\\\" \\n      class=\\\"d-flex align-items-center position-absolute top-0 end-0 mt-4 me-4 btn btn-outline-dark\\\"\\n    >\\n      <img src={editIcon} alt=\\\"edit docs\\\">\\n      <p class=\\\"m-0 ms-1\\\">Edit on GitHub</p>\\n    </a>\\n    {@html htmlContent}\\n  </section>\\n  <button\\n    id=\\\"toggleSidebarBtn\\\"\\n    class=\\\"d-md-none btn btn-outline-dark bg-light position-absolute bottom-0 end-0 m-2\\\" \\n    on:click={toggleSidebar}\\n  >\\n    <Icon name={showSidebar ? 'x' : 'list'} />\\n  </button>\\n</div>\\n\\n\\n\"],\"names\":[],\"mappings\":\"AA6CmB,QAAQ,8BAAC,CAAC,AAC3B,MAAM,CAAE,IAAI,AAAE,CAAC,AAEjB,QAAQ,8BAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,CACd,aAAa,CAAE,IAAI,AAAE,CAAC,AACtB,uBAAQ,CAAC,AAAQ,CAAC,AAAE,CAAC,AACnB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,IAAI,AAAE,CAAC,AACxB,uBAAQ,CAAC,AAAQ,CAAC,AAAC,MAAM,CAAE,uBAAQ,CAAC,AAAQ,CAAC,AAAC,MAAM,AAAC,CAAC,AACpD,eAAe,CAAE,SAAS,AAAE,CAAC,AACjC,uBAAQ,CAAC,AAAQ,CAAC,AAAE,CAAC,AACnB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,IAAI,AAAE,CAAC,AAC1B,uBAAQ,CAAW,OAAO,AAAE,CAAC,AAC3B,UAAU,CAAE,GAAG,AAAE,CAAC,AACpB,uBAAQ,CAAW,WAAW,AAAE,CAAC,AAC/B,WAAW,CAAE,IAAI,AAAE,CAAC,AACtB,uBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACpB,YAAY,CAAE,IAAI,AAAE,CAAC,AACvB,uBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACpB,UAAU,CAAE,IAAI,AAAE,CAAC,AAEvB,KAAK,8BAAC,CAAC,AACL,SAAS,CAAE,CAAC,CACZ,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,CACd,eAAe,CAAE,MAAM,AAAE,CAAC,AAC1B,oBAAK,CAAC,CAAC,IAAI,MAAM,CAAC,GAAG,eAAC,CAAC,AACrB,MAAM,CAAE,OAAO,IAAI,CAAC,AAAE,CAAC,AACzB,oBAAK,CAAC,AAAQ,sBAAsB,AAAE,CAAC,AACrC,UAAU,CAAE,IAAI,AAAE,CAAC,AACnB,oBAAK,CAAC,AAAQ,sBAAsB,AAAC,QAAQ,AAAC,CAAC,AAC7C,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,SAAS,CAC3B,aAAa,CAAE,IAAI,AAAE,CAAC,AAC1B,oBAAK,CAAC,AAAQ,YAAY,AAAE,CAAC,AAC3B,MAAM,CAAE,CAAC,AAAE,CAAC,AAEhB,iBAAiB,8BAAC,CAAC,AACjB,KAAK,CAAE,WAAW,CAClB,OAAO,CAAE,CAAC,AAAE,CAAC,AAEf,gCAAiB,CAAC,AAAQ,GAAG,AAAC,CAC9B,+BAAgB,CAAC,AAAQ,GAAG,AAAE,CAAC,AAC7B,KAAK,CAAE,KAAK,AAAE,CAAC,AAEjB,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,QAAQ,8BAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,AAAE,CAAC,AAAC,CAAC\"}"
};

async function preload(page) {
	const response = await this.fetch(DOCS_URL);
	const inlineMd = await response.text();
	const htmlContentTable = getContentTableAsHtml(inlineMd);
	const htmlContent = getDocsAsHtml(inlineMd);
	return { htmlContent, htmlContentTable };
}

const Docs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { htmlContent } = $$props;
	let { htmlContentTable } = $$props;

	const scrollToSection = () => {
		const url = window.location.href;
		const id = url.substring(url.lastIndexOf("#"));
		const urlContainsId = id.startsWith("#");

		if (urlContainsId) {
			document.getElementById(id.substring(1)).scrollIntoView();
		}
	};

	onMount(() => {
		initHighlightJs();
		scrollToSection();
	});

	if ($$props.htmlContent === void 0 && $$bindings.htmlContent && htmlContent !== void 0) $$bindings.htmlContent(htmlContent);
	if ($$props.htmlContentTable === void 0 && $$bindings.htmlContentTable && htmlContentTable !== void 0) $$bindings.htmlContentTable(htmlContentTable);
	$$result.css.add(css$9);

	return `${($$result.head += `${($$result.title = `<title>Docs • Restapify</title>`, "")}<link rel="${"stylesheet"}" href="${"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/zenburn.min.css"}" integrity="${"sha512-JPxjD2t82edI35nXydY/erE9jVPpqxEJ++6nYEoZEpX2TRsmp2FpZuQqZa+wBCen5U16QZOkMadGXHCfp+tUdg=="}" crossorigin="${"anonymous"}" data-svelte="svelte-1ooda1l">`, "")}

<div class="${"row svelte-1hb9u9u"}" id="${"wrapper"}"><div id="${"sidebar"}" class="${[
		"bg-light col-11 col-md-3 border-end svelte-1hb9u9u",
		""
	].join(" ").trim()}">${htmlContentTable}
    <button id="${"closeSidebarBtn"}" class="${"d-md-none btn btn-outline-dark bg-light position-absolute top-0 end-0 m-2 svelte-1hb9u9u"}">${validate_component(Icon, "Icon").$$render($$result, { name: "x" }, {}, {})}</button></div>
  <section id="${"docs"}" class="${"position-relative col p-4 svelte-1hb9u9u"}"><a href="${"https://github.com/johannchopin/restapify/edit/main/docs/README.md"}" class="${"d-flex align-items-center position-absolute top-0 end-0 mt-4 me-4 btn btn-outline-dark"}"><img${add_attribute("src", editIcon, 0)} alt="${"edit docs"}" class="${"svelte-1hb9u9u"}">
      <p class="${"m-0 ms-1"}">Edit on GitHub</p></a>
    ${htmlContent}</section>
  <button id="${"toggleSidebarBtn"}" class="${"d-md-none btn btn-outline-dark bg-light position-absolute bottom-0 end-0 m-2 svelte-1hb9u9u"}">${validate_component(Icon, "Icon").$$render($$result, { name: "x"  }, {}, {})}</button></div>`;
});

var component_1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Docs,
    preload: preload
});

var restapifyIcon = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20viewBox%3D%22-84.96%20112.15%201139.43%20855.7%22%3E%3Cdesc%3ECreated%20with%20Fabric.js%204.2.0%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20transform%3D%22matrix%281%200%200%201%20540%20540%29%22%20id%3D%22b13d279c-a7c8-43f8-8418-b25b69802bc2%22%3E%3C%2Fg%3E%3Cg%20transform%3D%22matrix%281.05%200%200%201.05%20484.45%20540%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%281.14%200%200%201.14%20201.2%2081.18%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28255%2C219%2C144%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%28-0.7%200.9%20-0.9%20-0.7%20-155.41%200%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28214%2C235%2C244%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%2847.86%200%200%2047.86%2065.11%20-68.26%29%22%3E%3Cpath%20style%3D%22stroke%3A%20rgb%280%2C0%2C0%29%3B%20stroke-width%3A%200%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-8%2C%20-7.5%29%22%20d%3D%22M%200.54%203.87%20L%200.5%203%20C%200.5%201.895430500338413%201.395430500338413%201%202.5%201%20L%206.172000000000001%201%20C%206.702389626957629%201.0001132748109898%207.211014537285083%201.2109012503780958%207.585999999999999%201.5859999999999992%20L%208.414%202.4139999999999997%20C%208.788985462714916%202.7890987496219033%209.297610373042371%202.9998867251890093%209.828%203%20L%2013.809999999999999%203%20C%2014.371944507063548%202.99994181344107%2014.907988548753293%203.2362943728740303%2015.286958175882914%203.651220455589744%20C%2015.665927803012535%204.066146538305458%2015.852855981174343%204.6213614545232184%2015.802%205.180999999999999%20L%2015.165%2012.181000000000001%20C%2015.071411322559975%2013.21088633969406%2014.208129849263837%2013.999590006155977%2013.174%2014%20L%202.826%2014%20C%201.7918701507361623%2013.999590006155977%200.9285886774400236%2013.21088633969406%200.835%2012.181000000000001%20L%200.19799999999999995%205.181000000000001%20C%200.15538623098938223%204.717782492347585%200.2763940224250574%204.254273115795729%200.5400000000000003%203.8710000000000004%20z%20M%202.19%204%20C%201.9091230222874496%203.9999836431888887%201.6411881700891677%204.1180921977290375%201.4517202526954953%204.32544162539882%20C%201.262252335301823%204.532791053068602%201.1687210714867386%204.810262886535049%201.194%205.09%20L%201.831%2012.09%20C%201.8775341360619322%2012.604950220712128%202.3089517251732294%2012.99951304090437%202.8260000000000005%2013%20L%2013.174000000000001%2013%20C%2013.691048274826771%2012.99951304090437%2014.122465863938068%2012.604950220712128%2014.169%2012.09%20L%2014.806000000000001%205.09%20C%2014.831278928513262%204.810262886535048%2014.737747664698178%204.5327910530686015%2014.548279747304505%204.3254416253988195%20C%2014.358811829910833%204.1180921977290375%2014.09087697771255%203.9999836431888887%2013.81%204%20L%202.19%204%20z%20M%206.880000000000001%202.293%20C%206.692262313828545%202.105205444372648%206.437541315719522%201.9997912460026708%206.171999999999999%202%20L%202.5%202%20C%201.9550509222374148%201.9999016279796986%201.5103540237673267%202.436149285378855%201.5%202.981%20L%201.506%203.12%20C%201.72%203.042%201.95%203%202.19%203%20L%207.586%203%20L%206.8790000000000004%202.293%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%281.73%200%200%201.73%2065.07%20-59.59%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%20-94.57%200.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%2094.58%20-0.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%20-0.77%200.77%202.5%2064.87%2083.22%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-256%2C%20-208.65%29%22%20d%3D%22M%20255.999%20221.541%20C%20244.68%20221.541%20234.059%20216.81799999999998%20226.85999999999999%20208.581%20C%20224.051%20205.368%20224.379%20200.488%20227.59099999999998%20197.679%20C%20230.80399999999997%20194.87%20235.68499999999997%20195.197%20238.49299999999997%20198.41%20C%20242.75899999999996%20203.289%20249.13899999999995%20206.087%20255.99799999999996%20206.087%20C%20262.85799999999995%20206.087%20269.23799999999994%20203.289%20273.50199999999995%20198.411%20C%20276.30899999999997%20195.197%20281.19199999999995%20194.869%20284.40299999999996%20197.679%20C%20287.616%20200.487%20287.94499999999994%20205.368%20285.135%20208.581%20C%20277.939%20216.818%20267.318%20221.541%20255.999%20221.541%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

/* src/components/Nav.svelte generated by Svelte v3.32.3 */

const css$a = {
	code: "h1.svelte-c735tm.svelte-c735tm{line-height:2.5em}#brand.svelte-c735tm img.svelte-c735tm{min-width:7vw}@media(min-width: 992px){#brand.svelte-c735tm img.svelte-c735tm{min-width:5vw}}@media(max-width: 767.98px){#brand.svelte-c735tm img.svelte-c735tm{min-width:15vw}}li.svelte-c735tm.svelte-c735tm{display:block}nav.svelte-c735tm.svelte-c735tm{z-index:2}a.svelte-c735tm.svelte-c735tm{display:block;text-decoration:none;padding:1em 0.5em;color:black}",
	map: "{\"version\":3,\"file\":\"Nav.svelte\",\"sources\":[\"Nav.svelte\"],\"sourcesContent\":[\"<script>\\n  import restapifyIcon from '../assets/restapify-icon.svg'\\n</script>\\n\\n<style lang=\\\"scss\\\">h1 {\\n  line-height: 2.5em; }\\n\\n#brand img {\\n  min-width: 7vw; }\\n\\n@media (min-width: 992px) {\\n  #brand img {\\n    min-width: 5vw; } }\\n\\n@media (max-width: 767.98px) {\\n  #brand img {\\n    min-width: 15vw; } }\\n\\nli {\\n  display: block; }\\n\\nnav {\\n  z-index: 2; }\\n\\n.navbar-brand img {\\n  width: 25%; }\\n\\na {\\n  display: block;\\n  text-decoration: none;\\n  padding: 1em 0.5em;\\n  color: black; }\\n</style>\\n\\n\\n<nav class=\\\"navbar navbar-expand-lg px-md-4 pt-0 pb-0 navbar-light bg-light shadow\\\">\\n  <div class=\\\"container-fluid\\\">\\n    <a id=\\\"brand\\\" rel=\\\"prefetch\\\" class=\\\"p-0 d-flex align-contents-center link-dark\\\" href=\\\"/\\\">\\n\\t\\t\\t<img src={restapifyIcon} alt=\\\"Restapify icon\\\">\\n\\t\\t\\t<h1 class=\\\"d-none d-md-block ms-1 mb-0 fs-4\\\">Restapify</h1>\\n    </a>\\n    <ul class=\\\"d-flex ms-auto mb-0\\\">\\n      <li class=\\\"nav-item\\\">\\n        <a class=\\\"nav-link\\\" rel=\\\"prefetch\\\" href=\\\"/docs\\\">Docs</a>\\n      </li>\\n      <li class=\\\"nav-item\\\">\\n        <a class=\\\"nav-link\\\" href=\\\"https://github.com/johannchopin/restapify\\\" target=\\\"_blank\\\">GitHub</a>\\n      </li>\\n\\t\\t\\t<li class=\\\"nav-item d-none d-md-block ms-3\\\">\\n\\t\\t\\t\\t<a class=\\\"nav-link\\\" href=\\\"https://codecov.io/gh/johannchopin/restapify\\\">\\n\\t\\t\\t\\t\\t<img src=\\\"https://img.shields.io/codecov/c/github/johannchopin/restapify\\\" target=\\\"_blank\\\" alt=\\\"codecov\\\">\\n\\t\\t\\t\\t</a>\\n      </li>\\n\\t\\t\\t<li class=\\\"nav-item d-flex align-items-center\\\">\\n\\t\\t\\t\\t<iframe src=\\\"https://ghbtns.com/github-btn.html?user=johannchopin&repo=restapify&type=star&count=true&v=2\\\" frameborder=\\\"0\\\" scrolling=\\\"0\\\" width=\\\"100\\\" height=\\\"20\\\" title=\\\"GitHub\\\"></iframe>\\n      </li>\\n    </ul>\\n  </div>\\n</nav>\"],\"names\":[],\"mappings\":\"AAImB,EAAE,4BAAC,CAAC,AACrB,WAAW,CAAE,KAAK,AAAE,CAAC,AAEvB,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,SAAS,CAAE,GAAG,AAAE,CAAC,AAEnB,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,SAAS,CAAE,GAAG,AAAE,CAAC,AAAC,CAAC,AAEvB,MAAM,AAAC,YAAY,QAAQ,CAAC,AAAC,CAAC,AAC5B,oBAAM,CAAC,GAAG,cAAC,CAAC,AACV,SAAS,CAAE,IAAI,AAAE,CAAC,AAAC,CAAC,AAExB,EAAE,4BAAC,CAAC,AACF,OAAO,CAAE,KAAK,AAAE,CAAC,AAEnB,GAAG,4BAAC,CAAC,AACH,OAAO,CAAE,CAAC,AAAE,CAAC,AAKf,CAAC,4BAAC,CAAC,AACD,OAAO,CAAE,KAAK,CACd,eAAe,CAAE,IAAI,CACrB,OAAO,CAAE,GAAG,CAAC,KAAK,CAClB,KAAK,CAAE,KAAK,AAAE,CAAC\"}"
};

const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	$$result.css.add(css$a);

	return `<nav class="${"navbar navbar-expand-lg px-md-4 pt-0 pb-0 navbar-light bg-light shadow svelte-c735tm"}"><div class="${"container-fluid"}"><a id="${"brand"}" rel="${"prefetch"}" class="${"p-0 d-flex align-contents-center link-dark svelte-c735tm"}" href="${"/"}"><img${add_attribute("src", restapifyIcon, 0)} alt="${"Restapify icon"}" class="${"svelte-c735tm"}">
			<h1 class="${"d-none d-md-block ms-1 mb-0 fs-4 svelte-c735tm"}">Restapify</h1></a>
    <ul class="${"d-flex ms-auto mb-0"}"><li class="${"nav-item svelte-c735tm"}"><a class="${"nav-link svelte-c735tm"}" rel="${"prefetch"}" href="${"/docs"}">Docs</a></li>
      <li class="${"nav-item svelte-c735tm"}"><a class="${"nav-link svelte-c735tm"}" href="${"https://github.com/johannchopin/restapify"}" target="${"_blank"}">GitHub</a></li>
			<li class="${"nav-item d-none d-md-block ms-3 svelte-c735tm"}"><a class="${"nav-link svelte-c735tm"}" href="${"https://codecov.io/gh/johannchopin/restapify"}"><img src="${"https://img.shields.io/codecov/c/github/johannchopin/restapify"}" target="${"_blank"}" alt="${"codecov"}"></a></li>
			<li class="${"nav-item d-flex align-items-center svelte-c735tm"}"><iframe src="${"https://ghbtns.com/github-btn.html?user=johannchopin&repo=restapify&type=star&count=true&v=2"}" frameborder="${"0"}" scrolling="${"0"}" width="${"100"}" height="${"20"}" title="${"GitHub"}"></iframe></li></ul></div></nav>`;
});

/* src/routes/_layout.svelte generated by Svelte v3.32.3 */

const css$b = {
	code: "main.svelte-1xuhwr1{position:relative;margin:0 auto;box-sizing:border-box;overflow-x:hidden;overflow:hidden;flex-grow:1;width:100%}*:not(pre) > code{color:white!important;padding:.2em .4em;font-size:80%;background-color:#3F3F3F;border-radius:.25rem;white-space:nowrap}",
	map: "{\"version\":3,\"file\":\"_layout.svelte\",\"sources\":[\"_layout.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">import Nav from '../components/Nav.svelte';\\n</script>\\n\\n<style>\\n\\tmain {\\n\\t\\tposition: relative;\\n\\t\\tmargin: 0 auto;\\n\\t\\tbox-sizing: border-box;\\n\\t\\toverflow-x: hidden;\\n    overflow: hidden;\\n\\t\\tflex-grow: 1;\\n\\t\\twidth: 100%;\\n\\t}\\n\\t:global(*:not(pre) > code) {\\n\\t\\tcolor: white!important;\\n\\t\\tpadding: .2em .4em;\\n\\t\\tfont-size: 80%;\\n\\t\\tbackground-color: #3F3F3F;\\n\\t\\tborder-radius: .25rem;\\n\\t\\twhite-space: nowrap;\\n\\t}\\n</style>\\n\\n<Nav />\\n\\n<svelte:head>\\n\\t<script src=\\\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js\\\" integrity=\\\"sha512-zol3kFQ5tnYhL7PzGt0LnllHHVWRGt2bTCIywDiScVvLIlaDOVJ6sPdJTVi0m3rA660RT+yZxkkRzMbb1L8Zkw==\\\" crossorigin=\\\"anonymous\\\"></script>\\n</svelte:head>\\n\\n<main>\\n\\t<slot></slot>\\n</main>\"],\"names\":[],\"mappings\":\"AAIC,IAAI,eAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UAAU,CACtB,UAAU,CAAE,MAAM,CAChB,QAAQ,CAAE,MAAM,CAClB,SAAS,CAAE,CAAC,CACZ,KAAK,CAAE,IAAI,AACZ,CAAC,AACO,iBAAiB,AAAE,CAAC,AAC3B,KAAK,CAAE,KAAK,UAAU,CACtB,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,SAAS,CAAE,GAAG,CACd,gBAAgB,CAAE,OAAO,CACzB,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,MAAM,AACpB,CAAC\"}"
};

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	$$result.css.add(css$b);

	return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}

${($$result.head += `<script src="${"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js"}" integrity="${"sha512-zol3kFQ5tnYhL7PzGt0LnllHHVWRGt2bTCIywDiScVvLIlaDOVJ6sPdJTVi0m3rA660RT+yZxkkRzMbb1L8Zkw=="}" crossorigin="${"anonymous"}" data-svelte="svelte-c1qtge"></script>`, "")}

<main class="${"svelte-1xuhwr1"}">${slots.default ? slots.default({}) : ``}</main>`;
});

var root_comp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Layout
});

/* src/routes/_error.svelte generated by Svelte v3.32.3 */

const css$c = {
	code: "h1.svelte-8od9u6,p.svelte-8od9u6{margin:0 auto}h1.svelte-8od9u6{font-size:2.8em;font-weight:700;margin:0 0 0.5em 0}p.svelte-8od9u6{margin:1em auto}@media(min-width: 480px){h1.svelte-8od9u6{font-size:4em}}",
	map: "{\"version\":3,\"file\":\"_error.svelte\",\"sources\":[\"_error.svelte\"],\"sourcesContent\":[\"<script lang=\\\"ts\\\">export let status;\\nexport let error;\\nconst dev = undefined === 'development';\\n</script>\\n\\n<style>\\n\\th1, p {\\n\\t\\tmargin: 0 auto;\\n\\t}\\n\\n\\th1 {\\n\\t\\tfont-size: 2.8em;\\n\\t\\tfont-weight: 700;\\n\\t\\tmargin: 0 0 0.5em 0;\\n\\t}\\n\\n\\tp {\\n\\t\\tmargin: 1em auto;\\n\\t}\\n\\n\\t@media (min-width: 480px) {\\n\\t\\th1 {\\n\\t\\t\\tfont-size: 4em;\\n\\t\\t}\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>{status}</title>\\n</svelte:head>\\n\\n<h1>{status}</h1>\\n\\n<p>{error.message}</p>\\n\\n{#if dev && error.stack}\\n\\t<pre>{error.stack}</pre>\\n{/if}\\n\"],\"names\":[],\"mappings\":\"AAMC,gBAAE,CAAE,CAAC,cAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AAED,EAAE,cAAC,CAAC,AACH,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC,AAED,CAAC,cAAC,CAAC,AACF,MAAM,CAAE,GAAG,CAAC,IAAI,AACjB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,EAAE,cAAC,CAAC,AACH,SAAS,CAAE,GAAG,AACf,CAAC,AACF,CAAC\"}"
};

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { status } = $$props;
	let { error } = $$props;
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	$$result.css.add(css$c);

	return `${($$result.head += `${($$result.title = `<title>${escape(status)}</title>`, "")}`, "")}

<h1 class="${"svelte-8od9u6"}">${escape(status)}</h1>

<p class="${"svelte-8od9u6"}">${escape(error.message)}</p>

${``}`;
});

// This file is generated by Sapper — do not edit it!

const manifest = {
	server_routes: [
		
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: component_0 }
			]
		},

		{
			// docs.svelte
			pattern: /^\/docs\/?$/,
			parts: [
				{ name: "docs", file: "docs.svelte", component: component_1 }
			]
		}
	],

	root_comp,
	error: Error$1
};

const build_dir = "__sapper__/build";

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const CONTEXT_KEY = {};

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.32.3 */

const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { notify } = $$props;
	afterUpdate(notify);
	setContext(CONTEXT_KEY, stores);
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);
	if ($$props.notify === void 0 && $$bindings.notify && notify !== void 0) $$bindings.notify(notify);

	return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `${error
		? `${validate_component(Error$1, "Error").$$render($$result, { error, status }, {}, {})}`
		: `${validate_component(level1.component || missing_component, "svelte:component").$$render($$result, Object.assign(level1.props), {}, {})}`}`
	})}`;
});

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/mrb-consumer+xml":["*xdf"],"application/mrb-publish+xml":["*xdf"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["*xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/ttml+xml":["ttml"],"application/urc-ressheet+xml":["rsheet"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-error+xml":["xer"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var lite = new Mime_1(standard);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function get_server_route_handler(routes) {
    function handle_route(route, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.params = route.params(route.pattern.exec(req.path));
            const method = req.method.toLowerCase();
            // 'delete' cannot be exported from a module because it is a keyword,
            // so check for 'del' instead
            const method_export = method === 'delete' ? 'del' : method;
            const handle_method = route.handlers[method_export];
            if (handle_method) {
                if (process.env.SAPPER_EXPORT) {
                    const { write, end, setHeader } = res;
                    const chunks = [];
                    const headers = {};
                    // intercept data so that it can be exported
                    res.write = function (chunk) {
                        chunks.push(Buffer.from(chunk));
                        return write.apply(res, [chunk]);
                    };
                    res.setHeader = function (name, value) {
                        headers[name.toLowerCase()] = value;
                        setHeader.apply(res, [name, value]);
                    };
                    res.end = function (chunk) {
                        if (chunk)
                            chunks.push(Buffer.from(chunk));
                        end.apply(res, [chunk]);
                        process.send({
                            __sapper__: true,
                            event: 'file',
                            url: req.url,
                            method: req.method,
                            status: res.statusCode,
                            type: headers['content-type'],
                            body: Buffer.concat(chunks)
                        });
                    };
                }
                const handle_next = (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.message);
                    }
                    else {
                        process.nextTick(next);
                    }
                };
                try {
                    yield handle_method(req, res, handle_next);
                }
                catch (err) {
                    console.error(err);
                    handle_next(err);
                }
            }
            else {
                // no matching handler for method
                process.nextTick(next);
            }
        });
    }
    return function find_route(req, res, next) {
        for (const route of routes) {
            if (route.pattern.test(req.path)) {
                handle_route(route, req, res, next);
                return;
            }
        }
        next();
    };
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return "new RegExp(" + stringifyString(thing.source) + ", \"" + thing.flags + "\")";
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url__default['default'].parse;
const format_url = Url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = Url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode$1 = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode$1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$2 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$2
};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$1 = arraySet.ArraySet;

var quickSort$1 = quickSort.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$1.fromArray(names.map(String), true);
  this._sources = ArraySet$1.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$1.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$1.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$1(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$1(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$1(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$1(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort$1(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

var SourceMapConsumer$1 = sourceMapConsumer.SourceMapConsumer;

function get_sourcemap_url(contents) {
    const reversed = contents
        .split('\n')
        .reverse()
        .join('\n');
    const match = /\/[/*]#[ \t]+sourceMappingURL=([^\s'"]+?)(?:[ \t]+|$)/gm.exec(reversed);
    if (match)
        return match[1];
    return undefined;
}
const file_cache = new Map();
function get_file_contents(file_path) {
    if (file_cache.has(file_path)) {
        return file_cache.get(file_path);
    }
    try {
        const data = fs__default['default'].readFileSync(file_path, 'utf8');
        file_cache.set(file_path, data);
        return data;
    }
    catch (_a) {
        return undefined;
    }
}
function sourcemap_stacktrace(stack) {
    const replace = (line) => line.replace(/^ {4}at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?)\)?/, (input, var_name, file_path, line_num, column) => {
        if (!file_path)
            return input;
        const contents = get_file_contents(file_path);
        if (!contents)
            return input;
        const sourcemap_url = get_sourcemap_url(contents);
        if (!sourcemap_url)
            return input;
        let dir = path__default['default'].dirname(file_path);
        let sourcemap_data;
        if (/^data:application\/json[^,]+base64,/.test(sourcemap_url)) {
            const raw_data = sourcemap_url.slice(sourcemap_url.indexOf(',') + 1);
            try {
                sourcemap_data = Buffer.from(raw_data, 'base64').toString();
            }
            catch (_a) {
                return input;
            }
        }
        else {
            const sourcemap_path = path__default['default'].resolve(dir, sourcemap_url);
            const data = get_file_contents(sourcemap_path);
            if (!data)
                return input;
            sourcemap_data = data;
            dir = path__default['default'].dirname(sourcemap_path);
        }
        let raw_sourcemap;
        try {
            raw_sourcemap = JSON.parse(sourcemap_data);
        }
        catch (_b) {
            return input;
        }
        const consumer = new SourceMapConsumer$1(raw_sourcemap);
        const pos = consumer.originalPositionFor({
            line: Number(line_num),
            column: Number(column),
            bias: SourceMapConsumer$1.LEAST_UPPER_BOUND
        });
        if (!pos.source)
            return input;
        const source_path = path__default['default'].resolve(dir, pos.source);
        const source = `${source_path}:${pos.line || 0}:${pos.column || 0}`;
        if (!var_name)
            return `    at ${source}`;
        return `    at ${var_name} (${source})`;
    });
    file_cache.clear();
    return stack
        .split('\n')
        .map(replace)
        .join('\n');
}

function get_page_handler(manifest, session_getter) {
    const get_build_info = (assets => () => assets)(JSON.parse(fs__default['default'].readFileSync(path__default['default'].join(build_dir, 'build.json'), 'utf-8')));
    const template = (str => () => str)(read_template(build_dir));
    const has_service_worker = fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js'));
    const { pages, error: error_route } = manifest;
    function bail(res, err) {
        console.error(err);
        const message = 'Internal server error';
        res.statusCode = 500;
        res.end(`<pre>${message}</pre>`);
    }
    function handle_error(req, res, statusCode, error) {
        handle_page({
            pattern: null,
            parts: [
                { name: null, component: { default: error_route } }
            ]
        }, req, res, statusCode, error || 'Unknown error');
    }
    function handle_page(page, req, res, status = 200, error = null) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const is_service_worker_index = req.path === '/service-worker-index.html';
            const build_info = get_build_info();
            res.setHeader('Content-Type', 'text/html');
            // preload main js and css
            // TODO detect other stuff we can preload like fonts?
            let preload_files = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
            if ((_a = build_info === null || build_info === void 0 ? void 0 : build_info.css) === null || _a === void 0 ? void 0 : _a.main) {
                preload_files = preload_files.concat((_b = build_info === null || build_info === void 0 ? void 0 : build_info.css) === null || _b === void 0 ? void 0 : _b.main);
            }
            let es6_preload = false;
            if (build_info.bundler === 'rollup') {
                es6_preload = true;
                const route = page.parts[page.parts.length - 1].file;
                const deps = build_info.dependencies[route];
                if (deps) {
                    preload_files = preload_files.concat(deps);
                }
            }
            else if (!error && !is_service_worker_index) {
                page.parts.forEach(part => {
                    if (!part)
                        return;
                    // using concat because it could be a string or an array. thanks webpack!
                    preload_files = preload_files.concat(build_info.assets[part.name]);
                });
            }
            const link = preload_files
                .filter((v, i, a) => a.indexOf(v) === i) // remove any duplicates
                .filter(file => file && !file.match(/\.map$/)) // exclude source maps
                .map((file) => {
                const as = /\.css$/.test(file) ? 'style' : 'script';
                const rel = es6_preload && as === 'script' ? 'modulepreload' : 'preload';
                return `<${req.baseUrl}/client/${file}>;rel="${rel}";as="${as}"`;
            })
                .join(', ');
            res.setHeader('Link', link);
            let session;
            try {
                session = yield session_getter(req, res);
            }
            catch (err) {
                return bail(res, err);
            }
            let redirect;
            let preload_error;
            const preload_context = {
                redirect: (statusCode, location) => {
                    if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
                        throw new Error('Conflicting redirects');
                    }
                    location = location.replace(/^\//g, ''); // leading slash (only)
                    redirect = { statusCode, location };
                },
                error: (statusCode, message) => {
                    preload_error = { statusCode, message };
                },
                fetch: (url, opts) => {
                    const protocol = req.socket.encrypted ? 'https' : 'http';
                    const parsed = new Url__default['default'].URL(url, `${protocol}://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' : ''}`);
                    opts = Object.assign({}, opts);
                    const include_credentials = (opts.credentials === 'include' ||
                        opts.credentials !== 'omit' && parsed.origin === `${protocol}://127.0.0.1:${process.env.PORT}`);
                    if (include_credentials) {
                        opts.headers = Object.assign({}, opts.headers);
                        const cookies = Object.assign({}, parse_1(req.headers.cookie || ''), parse_1(opts.headers.cookie || ''));
                        const set_cookie = res.getHeader('Set-Cookie');
                        (Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach((s) => {
                            const m = /([^=]+)=([^;]+)/.exec(s);
                            if (m)
                                cookies[m[1]] = m[2];
                        });
                        const str = Object.keys(cookies)
                            .map(key => `${key}=${cookies[key]}`)
                            .join('; ');
                        opts.headers.cookie = str;
                        if (!opts.headers.authorization && req.headers.authorization) {
                            opts.headers.authorization = req.headers.authorization;
                        }
                    }
                    return fetch(parsed.href, opts);
                }
            };
            let preloaded;
            let match;
            let params;
            try {
                const root_preload = manifest.root_comp.preload || (() => { });
                const root_preloaded = root_preload.call(preload_context, {
                    host: req.headers.host,
                    path: req.path,
                    query: req.query,
                    params: {}
                }, session);
                match = error ? null : page.pattern.exec(req.path);
                let toPreload = [root_preloaded];
                if (!is_service_worker_index) {
                    toPreload = toPreload.concat(page.parts.map(part => {
                        if (!part)
                            return null;
                        // the deepest level is used below, to initialise the store
                        params = part.params ? part.params(match) : {};
                        return part.component.preload
                            ? part.component.preload.call(preload_context, {
                                host: req.headers.host,
                                path: req.path,
                                query: req.query,
                                params
                            }, session)
                            : {};
                    }));
                }
                preloaded = yield Promise.all(toPreload);
            }
            catch (err) {
                if (error) {
                    return bail(res, err);
                }
                preload_error = { statusCode: 500, message: err };
                preloaded = []; // appease TypeScript
            }
            try {
                if (redirect) {
                    const location = Url__default['default'].resolve((req.baseUrl || '') + '/', redirect.location);
                    res.statusCode = redirect.statusCode;
                    res.setHeader('Location', location);
                    res.end();
                    return;
                }
                if (preload_error) {
                    if (!error) {
                        handle_error(req, res, preload_error.statusCode, preload_error.message);
                    }
                    else {
                        bail(res, preload_error.message);
                    }
                    return;
                }
                const segments = req.path.split('/').filter(Boolean);
                // TODO make this less confusing
                const layout_segments = [segments[0]];
                let l = 1;
                page.parts.forEach((part, i) => {
                    layout_segments[l] = segments[i + 1];
                    if (!part)
                        return null;
                    l++;
                });
                if (error instanceof Error && error.stack) {
                    error.stack = sourcemap_stacktrace(error.stack);
                }
                const pageContext = {
                    host: req.headers.host,
                    path: req.path,
                    query: req.query,
                    params,
                    error: error
                        ? error instanceof Error
                            ? error
                            : { message: error, name: 'PreloadError' }
                        : null
                };
                const props = {
                    stores: {
                        page: {
                            subscribe: writable(pageContext).subscribe
                        },
                        preloading: {
                            subscribe: writable(null).subscribe
                        },
                        session: writable(session)
                    },
                    segments: layout_segments,
                    status: error ? status : 200,
                    error: pageContext.error,
                    level0: {
                        props: preloaded[0]
                    },
                    level1: {
                        segment: segments[0],
                        props: {}
                    }
                };
                if (!is_service_worker_index) {
                    let level_index = 1;
                    for (let i = 0; i < page.parts.length; i += 1) {
                        const part = page.parts[i];
                        if (!part)
                            continue;
                        props[`level${level_index++}`] = {
                            component: part.component.default,
                            props: preloaded[i + 1] || {},
                            segment: segments[i]
                        };
                    }
                }
                const { html, head, css } = App.render(props);
                const serialized = {
                    preloaded: `[${preloaded.map(data => try_serialize(data, err => {
                        console.error(`Failed to serialize preloaded data to transmit to the client at the /${segments.join('/')} route: ${err.message}`);
                        console.warn('The client will re-render over the server-rendered page fresh instead of continuing where it left off. See https://sapper.svelte.dev/docs#Return_value for more information');
                    })).join(',')}]`,
                    session: session && try_serialize(session, err => {
                        throw new Error(`Failed to serialize session data: ${err.message}`);
                    }),
                    error: error && serialize_error(props.error)
                };
                let script = `__SAPPER__={${[
                    error && `error:${serialized.error},status:${status}`,
                    `baseUrl:"${req.baseUrl}"`,
                    serialized.preloaded && `preloaded:${serialized.preloaded}`,
                    serialized.session && `session:${serialized.session}`
                ].filter(Boolean).join(',')}};`;
                if (has_service_worker) {
                    script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
                }
                const file = [].concat(build_info.assets.main).filter(f => f && /\.js$/.test(f))[0];
                const main = `${req.baseUrl}/client/${file}`;
                // users can set a CSP nonce using res.locals.nonce
                const nonce_value = (res.locals && res.locals.nonce) ? res.locals.nonce : '';
                const nonce_attr = nonce_value ? ` nonce="${nonce_value}"` : '';
                if (build_info.bundler === 'rollup') {
                    if (build_info.legacy_assets) {
                        const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
                        script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
                    }
                    else {
                        script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
                    }
                }
                else {
                    script += `</script><script${nonce_attr} src="${main}" defer>`;
                }
                let styles;
                // TODO make this consistent across apps
                // TODO embed build_info in placeholder.ts
                if (build_info.css && build_info.css.main) {
                    const css_chunks = new Set(build_info.css.main);
                    page.parts.forEach(part => {
                        if (!part || !build_info.dependencies)
                            return;
                        const deps_for_part = build_info.dependencies[part.file];
                        if (deps_for_part) {
                            deps_for_part.filter(d => d.endsWith('.css')).forEach(chunk => {
                                css_chunks.add(chunk);
                            });
                        }
                    });
                    styles = Array.from(css_chunks)
                        .map(href => `<link rel="stylesheet" href="client/${href}">`)
                        .join('');
                }
                else {
                    styles = (css && css.code ? `<style${nonce_attr}>${css.code}</style>` : '');
                }
                const body = template()
                    .replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
                    .replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
                    .replace('%sapper.html%', () => html)
                    .replace('%sapper.head%', () => head)
                    .replace('%sapper.styles%', () => styles)
                    .replace(/%sapper\.cspnonce%/g, () => nonce_value);
                res.statusCode = status;
                res.end(body);
            }
            catch (err) {
                if (error) {
                    bail(res, err);
                }
                else {
                    handle_error(req, res, 500, err);
                }
            }
        });
    }
    return function find_route(req, res, next) {
        const path = req.path === '/service-worker-index.html' ? '/' : req.path;
        const page = pages.find(page => page.pattern.test(path));
        if (page) {
            handle_page(page, req, res);
        }
        else {
            handle_error(req, res, 404, 'Not found');
        }
    };
}
function read_template(dir = build_dir) {
    return fs__default['default'].readFileSync(`${dir}/template.html`, 'utf-8');
}
function try_serialize(data, fail) {
    try {
        return devalue(data);
    }
    catch (err) {
        if (fail)
            fail(err);
        return null;
    }
}
// Ensure we return something truthy so the client will not re-render the page over the error
function serialize_error(error) {
    if (!error)
        return null;
    let serialized = try_serialize(error);
    if (!serialized) {
        const { name, message, stack } = error;
        serialized = try_serialize({ name, message, stack });
    }
    if (!serialized) {
        serialized = '{}';
    }
    return serialized;
}

function middleware(opts = {}) {
    const { session, ignore } = opts;
    let emitted_basepath = false;
    return compose_handlers(ignore, [
        (req, res, next) => {
            if (req.baseUrl === undefined) {
                let originalUrl = req.originalUrl || req.url;
                if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
                    originalUrl += '/';
                }
                req.baseUrl = originalUrl
                    ? originalUrl.slice(0, -req.url.length)
                    : '';
            }
            if (!emitted_basepath && process.send) {
                process.send({
                    __sapper__: true,
                    event: 'basepath',
                    basepath: req.baseUrl
                });
                emitted_basepath = true;
            }
            if (req.path === undefined) {
                req.path = req.url.replace(/\?.*/, '');
            }
            next();
        },
        fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js')) && serve({
            pathname: '/service-worker.js',
            cache_control: 'no-cache, no-store, must-revalidate'
        }),
        fs__default['default'].existsSync(path__default['default'].join(build_dir, 'service-worker.js.map')) && serve({
            pathname: '/service-worker.js.map',
            cache_control: 'no-cache, no-store, must-revalidate'
        }),
        serve({
            prefix: '/client/',
            cache_control: 'max-age=31536000, immutable'
        }),
        get_server_route_handler(manifest.server_routes),
        get_page_handler(manifest, session || noop$1)
    ].filter(Boolean));
}
function compose_handlers(ignore, handlers) {
    const total = handlers.length;
    function nth_handler(n, req, res, next) {
        if (n >= total) {
            return next();
        }
        handlers[n](req, res, () => nth_handler(n + 1, req, res, next));
    }
    return !ignore
        ? (req, res, next) => nth_handler(0, req, res, next)
        : (req, res, next) => {
            if (should_ignore(req.path, ignore)) {
                next();
            }
            else {
                nth_handler(0, req, res, next);
            }
        };
}
function should_ignore(uri, val) {
    if (Array.isArray(val))
        return val.some(x => should_ignore(uri, x));
    if (val instanceof RegExp)
        return val.test(uri);
    if (typeof val === 'function')
        return val(uri);
    return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}
function serve({ prefix, pathname, cache_control }) {
    const filter = pathname
        ? (req) => req.path === pathname
        : (req) => req.path.startsWith(prefix);
    const cache = new Map();
    const read = (file) => (cache.has(file) ? cache : cache.set(file, fs__default['default'].readFileSync(path__default['default'].join(build_dir, file)))).get(file);
    return (req, res, next) => {
        if (filter(req)) {
            const type = lite.getType(req.path);
            try {
                const file = path__default['default'].posix.normalize(decodeURIComponent(req.path));
                const data = read(file);
                res.setHeader('Content-Type', type);
                res.setHeader('Cache-Control', cache_control);
                res.end(data);
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    next();
                }
                else {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('an error occurred while reading a static file from disk');
                }
            }
        }
        else {
            next();
        }
    };
}
function noop$1() { }

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
polka__default['default']() // You can also use Express
    .use(compression__default['default']({ threshold: 0 }), sirv__default['default']('static', { dev }), middleware())
    .listen(PORT, err => {
    if (err)
        console.log('error', err);
});
