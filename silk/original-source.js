@ -0,0 +1,14115 @@
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [958],
  {
    59182: (e, t, n) => {
      "use strict";
      n.d(t, {
        o: () => i,
      });
      var a = n(86119),
        r = n(12115),
        i = function (e) {
          return (0, r.useCallback)(function (t) {
            var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : [];
            return n
              ? t +
                  (n.length ? " " : "") +
                  n
                    .map(function (t) {
                      var n;
                      return (
                        t +
                        ("string" == typeof e[t] &&
                        null !== (n = e[t]) &&
                        void 0 !== n &&
                        n.startsWith("media(")
                          ? "-mq"
                          : "-" + e[t])
                      );
                    })
                    .join(" ")
              : t;
          }, (0, a.A)(e ? Object.values(e) : []));
        };
    },
    19160: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => u,
      });
      var a = n(5601),
        r = n(14637),
        i = n(12115);
      function o(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function s(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? o(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : o(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      function l(e) {
        var t = document.querySelector('meta[name="description"]');
        t ||
          (((t = document.createElement("meta")).name = "description"),
          document.head.appendChild(t)),
          (t.content = e);
      }
      var c = !1,
        u = function (e) {
          var t = (0, i.useState)(!1),
            n = t[0],
            a = t[1];
          (0, i.useEffect)(function () {
            document.documentElement.setAttribute(
              "data-overlay-incoming",
              "false"
            ),
              setTimeout(function () {
                return document.documentElement.removeAttribute(
                  "data-overlay-incoming"
                );
              }, 3e3);
            var t = function () {
              var t = document.location.hash;
              if (c || document.location.pathname + t !== e.path) {
                if (
                  "##" === t ||
                  (e.path === r.g.access.path &&
                    document.location.pathname === r.g.terms.path) ||
                  t.endsWith("2") ||
                  (e.path === r.g.examples.path &&
                    (t.endsWith("-e0") ||
                      t.endsWith("-e1") ||
                      t.endsWith("-e2"))) ||
                  ("/#example-parallax-page-h1" === e.path &&
                    (t.endsWith("-p1") || t.endsWith("-p2")))
                )
                  return;
                a(!1);
              } else
                (c = !0),
                  setTimeout(function () {
                    return (c = !1);
                  }, 500),
                  a(!0);
            };
            return (
              t(),
              window.addEventListener("popstate", t),
              function () {
                return window.removeEventListener("popstate", t);
              }
            );
          }, []);
          var o = (0, i.useState)(r.g.root),
            u = o[0],
            d = o[1];
          return [
            n,
            (0, i.useCallback)(
              function (t) {
                if (
                  (a(t),
                  !window.matchMedia("(display-mode: standalone)").matches &&
                    !window.navigator.standalone)
                ) {
                  var n = document.location.pathname + document.location.hash,
                    i = (function (e) {
                      if (/\d$/.test(e)) {
                        var t = e.lastIndexOf("-");
                        return -1 !== t ? e.slice(0, t) : e;
                      }
                      return e;
                    })(n),
                    o = Object.values(r.g).find(function (e) {
                      return e.path === i;
                    });
                  if (!o) {
                    var c,
                      A = i.indexOf("#"),
                      f = -1 === A ? i : i.substring(0, A);
                    if (
                      !(o = Object.values(r.g).find(function (e) {
                        return e.path === f;
                      }))
                    )
                      return;
                    n = null === (c = o) || void 0 === c ? void 0 : c.path;
                  }
                  o &&
                    (t && n !== e.path
                      ? (history.pushState({}, "", e.path),
                        e.title && (document.title = e.title),
                        e.description && l(e.description),
                        window.dispatchEvent(new Event("pushstate")))
                      : t ||
                        n === u.path ||
                        (history.pushState({}, "", u.path),
                        u.title && (document.title = u.title),
                        u.description && l(u.description),
                        window.dispatchEvent(new Event("pushstate"))),
                    d(
                      s(
                        s({}, o),
                        {},
                        {
                          path: n,
                        }
                      )
                    ));
                }
              },
              [u]
            ),
          ];
        };
    },
    45512: (e, t, n) => {
      "use strict";
      n.d(t, {
        e: () => r,
      });
      var a = n(12115),
        r = function () {
          var e = (0, a.useState)({
              platform: "unknown",
              browserEngine: "unknown",
            }),
            t = e[0],
            n = e[1];
          return (
            (0, a.useEffect)(function () {
              var e,
                t = window.navigator.userAgent,
                a = "unknown",
                r = "unknown";
              if (
                (navigator.userAgentData &&
                  (navigator.userAgentData.brands.some(function (e) {
                    return "Chromium" === e.brand;
                  }) && (a = "chromium"),
                  "Android" === navigator.userAgentData.platform &&
                    (r = "android")),
                "unknown" === r &&
                  null != t &&
                  t.match(/android/i) &&
                  (r = "android"),
                "unknown" === a &&
                  (null != t && t.match(/Chrome/i)
                    ? (a = "chromium")
                    : null != t && t.match(/Firefox/i)
                    ? (a = "gecko")
                    : null != t && t.match(/Safari|iPhone/i) && (a = "webkit")),
                "webkit" === a)
              ) {
                if (null != t && t.match(/iPhone/i)) r = "ios";
                else if (null != t && t.match(/iPad/i)) r = "ipados";
                else if (null != t && t.match(/Macintosh/i))
                  try {
                    null === (e = document) ||
                      void 0 === e ||
                      e.createEvent("TouchEvent"),
                      (r = "ipados");
                  } catch (e) {
                    r = "macos";
                  }
              }
              n({
                browserEngine: a,
                platform: r,
              });
            }, []),
            t
          );
        };
    },
    80582: (e, t, n) => {
      "use strict";
      n.d(t, {
        E: () => A,
      });
      var a = n(5601),
        r = n(41629),
        i = n(12115),
        o = n(99827),
        s = n(39411);
      n(92115);
      var l = n(95155),
        c = [
          "children",
          "className",
          "href",
          "forComponent",
          "thumbnail",
          "color",
        ];
      function u(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function d(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? u(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : u(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var A = function (e) {
        var t = e.children,
          n = e.className,
          a = e.href,
          u = e.forComponent,
          A = e.thumbnail,
          f = e.color,
          p = (0, r.A)(e, c),
          m = (0, i.useRef)(null),
          h = (0, i.useCallback)(function (e) {
            if (m.current && "mouse" === e.pointerType) {
              var t = m.current.getBoundingClientRect(),
                n = e.clientX - t.left,
                a = e.clientY - t.top;
              m.current.style.setProperty("--xPos", "".concat(n, "px")),
                m.current.style.setProperty("--yPos", "".concat(a, "px"));
            }
          }, []);
        return (0, l.jsx)(
          o.cj.Trigger,
          d(
            d(
              {
                className: [
                  "SheetTriggerCard-root",
                  "color:".concat(f),
                  n,
                ].join(" "),
                travelAnimation: {
                  scale: [1, 0.95],
                },
                forComponent: u,
                onPointerMove: h,
                ref: m,
                href: a,
              },
              p
            ),
            {},
            {
              asChild: !0,
              children: (0, l.jsxs)(a ? "a" : "button", {
                children: [
                  A &&
                    (0, l.jsx)(s.default, {
                      className: "SheetTriggerCard-image",
                      src: A,
                      alt: t,
                      draggable: "false",
                      quality: 100,
                      sizes:
                        "(max-width: 615px) 85.5vw, (max-width: 899px) 49vw, 1083px",
                      loading: "eager",
                    }),
                  (0, l.jsx)("div", {
                    className: "SheetTriggerCard-innerShadowClipper",
                    children: (0, l.jsx)("div", {
                      className: "SheetTriggerCard-innerShadow",
                    }),
                  }),
                  (0, l.jsx)("div", {
                    className: [
                      "SheetTriggerCard-text",
                      "color:".concat(f),
                    ].join(" "),
                    children: (0, l.jsx)("span", {
                      className: "SheetTriggerCard-actualText",
                      children: t,
                    }),
                  }),
                  (0, l.jsx)("div", {
                    className: "SheetTriggerCard-glow",
                  }),
                ],
              }),
            }
          )
        );
      };
    },
    72261: (e, t, n) => {
      "use strict";
      n.d(t, {
        A1: () => s,
        FB: () => o,
        FI: () => i,
        SY: () => l,
        i_: () => d,
        kU: () => A,
        kx: () => u,
        p5: () => f,
        xZ: () => c,
        yO: () => p,
      });
      var a = n(12115),
        r = n(99827),
        i = (0, a.createContext)({
          current: void 0,
        }),
        o = (0, r.Vq)(),
        s = (0, r.Vq)(),
        l = (0, a.createContext)({}),
        c = (0, r.Vq)(),
        u = (0, r.Vq)(),
        d = (0, r.Vq)(),
        A = (0, r.Vq)(),
        f = (0, r.Vq)(),
        p = (0, r.Vq)();
    },
    72114: (e, t, n) => {
      "use strict";
      n.d(t, {
        BU: () => I,
        bQ: () => m,
        vS: () => g,
        o2: () => h,
      });
      var a = n(5601),
        r = n(64023),
        i = n(41629),
        o = n(12115),
        s = n(99827),
        l = n(60003);
      n(91539);
      var c = n(95155),
        u = ["children", "ref"],
        d = ["children", "ref"],
        A = ["presentTrigger", "sheetContent", "sheetTitle"];
      function f(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function p(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? f(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : f(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var m = function (e) {
          var t = e.stackId,
            n = e.pageContainer,
            a = e.menuTitleContainer,
            r = e.menuLeftContainer,
            i = e.children,
            u = (0, o.useMemo)(
              function () {
                return {
                  stackId: t,
                  pageContainer: n,
                  menuTitleContainer: a,
                  menuLeftContainer: r,
                };
              },
              [t, n, a, r]
            );
          return (0, c.jsx)(l.MK.Provider, {
            value: u,
            children: (0, c.jsx)(s.eI.Root, {
              componentId: t,
              children: i,
            }),
          });
        },
        h = function (e) {
          var t = e.children,
            n = e.ref,
            a = (0, i.A)(e, u);
          return (0, c.jsx)(
            s.eI.Outlet,
            p(
              p(
                {
                  stackingAnimation: {
                    translateX: function (e) {
                      var t = e.progress;
                      return t <= 1 ? -80 * t + "px" : "-80px";
                    },
                  },
                  className: "ParallaxPageStack-outlet",
                },
                a
              ),
              {},
              {
                ref: n,
                asChild: !0,
                children: t,
              }
            )
          );
        },
        g = function (e) {
          var t = e.children,
            n = e.ref,
            a = (0, i.A)(e, d);
          return (0, c.jsx)(
            s.eI.Outlet,
            p(
              p(
                {
                  stackingAnimation: {
                    opacity: function (e) {
                      return 0.75 - (1 / 0.75) * (e.progress - 0.25);
                    },
                  },
                },
                a
              ),
              {},
              {
                ref: n,
                children: t,
              }
            )
          );
        },
        v = function (e) {
          var t = e.presentTrigger,
            n = e.sheetContent,
            a = e.sheetTitle,
            r = (0, i.A)(e, A),
            u = (0, o.useContext)(l.MK),
            d = u.stackId,
            f = u.pageContainer,
            m = u.menuTitleContainer,
            h = u.menuLeftContainer;
          return (0, c.jsxs)(
            s.cj.Root,
            p(
              p(
                {
                  license: "commercial",
                  componentId: l.UT,
                  forComponent: d,
                },
                r
              ),
              {},
              {
                children: [
                  t,
                  (0, c.jsx)(s.cj.Portal, {
                    container: f,
                    children: (0, c.jsxs)(s.cj.View, {
                      forComponent: l.UT,
                      className: "ParallaxPage-view",
                      contentPlacement: "right",
                      swipeOvershoot: !1,
                      nativeEdgeSwipePrevention: !0,
                      children: [
                        (0, c.jsx)(s.cj.Portal, {
                          container: h,
                          children: (0, c.jsx)(s.cj.Trigger, {
                            className: "ParallaxPage-dismissTrigger",
                            action: "dismiss",
                            travelAnimation: {
                              visibility: "visible",
                              opacity: function (e) {
                                return (1 / 0.75) * (e.progress - 0.25);
                              },
                            },
                            children: (0, c.jsx)("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              viewBox: "0 0 20 20",
                              fill: "currentColor",
                              className: "ParallaxPage-dismissIcon",
                              children: (0, c.jsx)("path", {
                                fillRule: "evenodd",
                                d: "M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z",
                                clipRule: "evenodd",
                              }),
                            }),
                          }),
                        }),
                        (0, c.jsx)(s.cj.Portal, {
                          container: m,
                          children: (0, c.jsx)(s.cj.Outlet, {
                            travelAnimation: {
                              opacity: function (e) {
                                return (1 / 0.75) * (e.progress - 0.25);
                              },
                            },
                            stackingAnimation: {
                              opacity: function (e) {
                                return 0.75 - (1 / 0.75) * (e.progress - 0.25);
                              },
                            },
                            className: "ParallaxPage-menuTitle",
                            children: a,
                          }),
                        }),
                        (0, c.jsx)(s.cj.Backdrop, {
                          className: "ParallaxPage-backdrop",
                          travelAnimation: {
                            opacity: [0, 0.25],
                          },
                        }),
                        (0, c.jsx)(s.cj.Content, {
                          className: "ParallaxPage-content",
                          stackingAnimation: {
                            translateX: function (e) {
                              var t = e.progress;
                              return t <= 1 ? -80 * t + "px" : "-80px";
                            },
                          },
                          asChild: !0,
                          children: n,
                        }),
                      ],
                    }),
                  }),
                ],
              }
            )
          );
        };
      n(14347);
      var b = n(80582);
      let y = {
        src: "/_next/static/media/ParallaxPage.34ba5ada.png",
        height: 644,
        width: 1083,
        blurDataURL:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAMAAABPT11nAAAAVFBMVEX1/PvI2uDR4uTE29jj7/NhgIiBmaDa2dzj7+v18/NMaXGIp6mIq7SKj4r///dQXVqmytLs8uy90MyMucSVkIudvca+z9T6//+vxMq+vsD29ffM6PCwvIw2AAAAFXRSTlNe/PNy+/39/Jj5AJv6mSGY+yqY+ZYpp+LYAAAACXBIWXMAAA4mAAAOJgGi7yX8AAAAMklEQVR4nGPg4mMAAUEGZiYxCVEBaREGblEeNlZhUX4GXglGSTEWcSEGDil2dnZOcQ4AKO0CADVn1bAAAAAASUVORK5CYII=",
        blurWidth: 8,
        blurHeight: 5,
      };
      var C = n(39411),
        k = n(94988),
        S = n(73524),
        E = n(72261),
        x = n(19160),
        w = n(14637),
        T = [
          "triggerClassName",
          "pathOrigin",
          "pathCount",
          "data",
          "showSheetWithDepth",
        ];
      function P(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function O(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? P(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : P(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var D = w.g.parallaxPage,
        I = function e(t) {
          var n = t.triggerClassName,
            a = t.pathOrigin,
            l = t.pathCount,
            u = t.data,
            d = t.showSheetWithDepth,
            A = (0, i.A)(t, T),
            f = (0, o.useContext)(E.FI),
            p = (0, x.A)(
              O(
                O({}, D),
                {},
                {
                  path: D.path + a + l,
                }
              )
            ),
            m = (0, r.A)(p, 2),
            h = m[0],
            g = m[1];
          return (0, c.jsx)(
            v,
            O(
              {
                presented: h,
                onPresentedChange: g,
                sheetTitle: u.title,
                presentTrigger: (0, c.jsxs)(c.Fragment, {
                  children: [
                    (0, c.jsx)(b.E, {
                      className: n,
                      thumbnail: y,
                      color: "green",
                      href: D.path + a + l,
                      onClick: function (e) {
                        return e.preventDefault();
                      },
                      children: "Parallax Page",
                    }),
                    (0, c.jsx)(s.cj.Portal, {
                      container: f.current,
                      children: (0, c.jsx)(C.default, {
                        "aria-hidden": "true",
                        src: u.heroImage,
                        sizes: "100vw",
                        quality: 90,
                        alt: "",
                        draggable: "false",
                        loading: "eager",
                      }),
                    }),
                  ],
                }),
                sheetContent: (0, c.jsx)(s.OY.Root, {
                  asChild: !0,
                  children: (0, c.jsx)(s.OY.View, {
                    className: "ExampleParallaxPage-scrollView",
                    children: (0, c.jsx)(s.OY.Content, {
                      asChild: !0,
                      children: (0, c.jsxs)("article", {
                        className: "ExampleParallaxPage-article",
                        children: [
                          (0, c.jsx)(C.default, {
                            className: "ExampleParallaxPage-illustration",
                            src: u.heroImage,
                            sizes: "100vw",
                            quality: 90,
                            alt: "Cover picture",
                            draggable: "false",
                            loading: "eager",
                            decoding: "sync",
                          }),
                          (0, c.jsxs)("div", {
                            className: "ExampleParallaxPage-articleContent",
                            children: [
                              (0, c.jsx)(s.cj.Title, {
                                className: "ExampleParallaxPage-title",
                                asChild: !0,
                                children: (0, c.jsx)("h1", {
                                  children: u.title,
                                }),
                              }),
                              (0, c.jsx)("h2", {
                                className: "ExampleParallaxPage-subtitle",
                                children: u.subtitle,
                              }),
                              (0, c.jsxs)("div", {
                                className: "ExampleParallaxPage-author",
                                children: [
                                  "by ",
                                  (0, c.jsx)("span", {
                                    className: "ExampleParallaxPage-authorName",
                                    children: u.author,
                                  }),
                                ],
                              }),
                              (0, c.jsx)("section", {
                                className: "ExampleParallaxPage-articleBody",
                                children: u.content.map(function (e, t) {
                                  return (0, c.jsx)(
                                    "p",
                                    {
                                      children: e,
                                    },
                                    t
                                  );
                                }),
                              }),
                              u.nestedSheet &&
                                (0, c.jsxs)("div", {
                                  className: "ExampleParallaxPage-relatedPages",
                                  children: [
                                    (0, c.jsx)(e, {
                                      triggerClassName:
                                        "plausible-event-name=ExamplesPage+ParallaxPageNested+Click",
                                      pathOrigin: a,
                                      pathCount: "2",
                                      data: u.nestedSheet,
                                    }),
                                    (void 0 === d || d) &&
                                      (0, c.jsx)(k.xA, {
                                        triggerClassName:
                                          "plausible-event-name=ExamplesPage+SheetWithDepthNested+Click",
                                        pathOrigin: "-p",
                                        pathCount: "1",
                                        data: S.d,
                                      }),
                                  ],
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                }),
              },
              A
            )
          );
        };
    },
    9627: (e, t, n) => {
      "use strict";
      n.d(t, {
        R: () => a,
      });
      var a = {
        title:
          "Exploring the Streets of Seville: Hidden Gems You Won’t Want to Miss",
        subtitle:
          "Discover the lesser-known treasures of Seville beyond the popular tourist attractions.",
        author: "Gabriel Garc\xeda M\xe1rquez",
        heroImage: {
          src: "/_next/static/media/image14.f8e41612.jpg",
          height: 6336,
          width: 7920,
          blurDataURL:
            "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAGAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUAQEAAAAAAAAAAAAAAAAAAAAE/9oADAMBAAIQAxAAAAC4EC//xAAdEAABBAIDAAAAAAAAAAAAAAABAgMEEgAFISJD/9oACAEBAAE/ANZKd2jEhSXfKnZtAsSOCa5//8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECIf/aAAgBAgEBPwCZVLT/xAAZEQEBAAMBAAAAAAAAAAAAAAACAQADESH/2gAIAQMBAT8AbWt2G8nmf//Z",
          blurWidth: 8,
          blurHeight: 6,
        },
        content: [
          "Seville is a city rich in culture and history, but beyond the main attractions, there are countless hidden gems waiting to be discovered. Whether you're a first-time visitor or a seasoned traveler, the streets of Seville offer many surprises for those willing to wander.",
          "Start your journey in the Triana neighborhood, located across the river from the city center. Famous for its traditional ceramic shops and charming narrow streets, Triana feels like a step back in time. Stroll along Calle Pureza and enjoy the sight of vibrant tiles adorning the walls of local shops.",
          "Next, head towards the Alameda de H\xe9rcules, a bustling square with a mix of history and modernity. This area is known for its lively atmosphere, trendy bars, and a blend of ancient and contemporary architecture. Don’t forget to check out the nearby street art, a true reflection of the city's creative spirit.",
          "The quaint Barrio Santa Cruz, often overshadowed by more popular attractions, is another hidden gem. This maze of narrow, whitewashed streets and beautiful courtyards is a perfect spot for a peaceful walk away from the crowds. Stop at one of the many hidden squares, such as Plaza de los Venerables, to take in the beauty of the surroundings.",
          "Venture to the lesser-known streets near the Seville Cathedral, such as Calle Mateos Gago, which offers an intimate view of the cathedral’s back side. Here, you’ll find boutique shops, small tapas bars, and a quieter vibe that contrasts with the bustle of the main squares.",
          "Another must-see location is the Jardines de Murillo, an idyllic park tucked behind the Alc\xe1zar. This hidden green space offers a peaceful retreat from the city's noise, with shaded paths and beautiful fountains. It's an ideal spot for a leisurely stroll or a picnic.",
          "The Hospital de la Caridad, a baroque masterpiece, is one of Seville's lesser-known cultural gems. Located in the heart of the city, this historic hospital is home to impressive artwork and offers insight into Seville’s medical and artistic history. A visit here is a great way to discover the city’s lesser-explored cultural side.",
          "Finally, make your way to the quirky and colorful Calle de la Feria, one of Seville’s oldest streets. This area offers a mix of antique shops, local markets, and hidden cafes, making it the perfect place to end your exploration of Seville’s hidden gems.",
        ],
        nestedSheet: {
          title:
            "Seville’s Stunning Architecture: From the Alc\xe1zar to the Giralda Tower",
          subtitle:
            "Explore Seville's iconic and architectural masterpieces that tell the city’s rich history.",
          author: "Isabel Allende",
          heroImage: {
            src: "/_next/static/media/image15.16eee7c7.jpg",
            height: 6336,
            width: 7920,
            blurDataURL:
              "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAGAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/9oADAMBAAIQAxAAAACyEP8A/8QAHRAAAQQCAwAAAAAAAAAAAAAAAwECBBEAEgUTUf/aAAgBAQABPwAfIw50AjhxXM7CEDSLrentZ//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAECAQE/AK//xAAXEQADAQAAAAAAAAAAAAAAAAAAARIh/9oACAEDAQE/AJWH/9k=",
            blurWidth: 8,
            blurHeight: 6,
          },
          content: [
            "Seville is home to some of Spain’s most stunning architectural masterpieces, each telling the story of the city’s rich history and cultural heritage. From the Moorish Alc\xe1zar to the towering Giralda, Seville’s architecture is a true testament to its diverse past.",
            "The Alc\xe1zar of Seville is one of the most breathtaking examples of Moorish architecture in Spain. This royal palace, originally built in the 10th century, boasts intricate tile work, stunning gardens, and majestic courtyards. Don’t miss the Patio de las Doncellas, a beautiful courtyard that showcases the intricacies of Islamic design.",
            "The Seville Cathedral, one of the largest Gothic cathedrals in the world, is another architectural gem. It’s home to the tomb of Christopher Columbus and features stunning stained-glass windows, tall vaulted ceilings, and impressive altarpieces. The Giralda Tower, once a minaret, stands tall beside the cathedral and offers panoramic views of the city.",
            "A short walk from the cathedral, the Metropol Parasol, also known as Las Setas, is one of Seville’s most modern architectural creations. This massive wooden structure, designed by architect J\xfcrgen Mayer, provides shade in the city’s hot summers and serves as a hub for locals and tourists alike. The panoramic view from the top is worth the climb.",
            "The Plaza de Espa\xf1a, built for the Ibero-American Exposition of 1929, is a magnificent semicircular plaza surrounded by a canal. The plaza features a stunning blend of Renaissance Revival and Moorish Revival styles, with beautiful bridges and colorful ceramic tiles representing Spain’s provinces. It's a perfect spot for a leisurely walk or a boat ride.",
            "The Casa de Pilatos is a lesser-known gem that combines Renaissance, Mudejar, and Gothic styles. This stunning palace is a fine example of Seville’s rich architectural diversity. Its beautiful courtyards, grand staircase, and impressive artwork make it a must-visit spot for those interested in Seville’s architectural history.",
            "The Basilica de la Macarena, located in the northern part of the city, is another example of Seville’s Baroque architecture. The basilica is home to the famous statue of the Virgin of Macarena, a revered symbol of Seville’s Semana Santa celebrations. Its intricate facade and lavish interior are awe-inspiring.",
            "Lastly, the Palacio de las Due\xf1as, a stately mansion in the heart of Seville, blends various architectural styles, from Gothic to Renaissance. Its tranquil gardens and beautifully decorated rooms offer a glimpse into Seville's aristocratic past. A visit here will leave you with a deeper appreciation for Seville's architectural heritage.",
          ],
        },
      };
    },
    94988: (e, t, n) => {
      "use strict";
      n.d(t, {
        xA: () => j,
        lb: () => m,
        JZ: () => v,
        W0: () => b,
        uo: () => g,
      });
      var a = n(41629),
        r = n(5601),
        i = n(64023),
        o = n(12115),
        s = n(99827);
      n(47015), n(14271);
      var l = n(60003),
        c = n(95155),
        u = ["children"],
        d = ["children", "ref"],
        A = ["children"];
      function f(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function p(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? f(Object(n), !0).forEach(function (t) {
                (0, r.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : f(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var m = function (e) {
          var t = e.children,
            n = (0, a.A)(e, u),
            r = (0, o.useRef)(null),
            i = (0, o.useRef)(null),
            d = (0, o.useState)(!1),
            A = d[0],
            f = d[1];
          (0, o.useEffect)(function () {
            var e;
            f(
              window.navigator.standalone &&
                (null === (e = window.navigator.userAgent) || void 0 === e
                  ? void 0
                  : e.match(/iPhone|iPad/i))
            );
          }, []);
          var m = (0, s.C9)().nativePageScrollReplaced,
            h = (0, o.useState)(0),
            g = h[0],
            v = h[1],
            b = (0, o.useMemo)(
              function () {
                return {
                  stackBackgroundRef: r,
                  stackFirstSheetBackdropRef: i,
                  iOSStandalone: A,
                  nativePageScrollReplaced: m,
                  stackingCount: g,
                  setStackingCount: v,
                };
              },
              [A, m, g]
            );
          return (0, c.jsx)(l.O3.Provider, {
            value: b,
            children: (0, c.jsx)(
              s.eI.Root,
              p(
                p(
                  {
                    componentId: l.o0,
                  },
                  n
                ),
                {},
                {
                  children: t,
                }
              )
            ),
          });
        },
        h = "max(env(safe-area-inset-top), 1.3vh)",
        g = function (e) {
          var t = e.children,
            n = e.ref,
            r = (0, a.A)(e, d),
            i = (0, o.useContext)(l.O3),
            u = i.iOSStandalone,
            A = i.nativePageScrollReplaced,
            f = (0, o.useMemo)(
              function () {
                return A
                  ? u
                    ? {
                        borderRadius: "24px",
                        transformOrigin: "50% 0",
                      }
                    : {
                        borderRadius: function (e) {
                          return Math.min(24 * e.progress, 24) + "px";
                        },
                        transformOrigin: "50% 0",
                      }
                  : {
                      clipBoundary: "layout-viewport",
                      clipBorderRadius: "24px",
                      clipTransformOrigin: "50% 0",
                    };
              },
              [A, u]
            );
          return (0, c.jsx)(
            s.eI.Outlet,
            p(
              p(
                {
                  forComponent: l.o0,
                  stackingAnimation: p(
                    {
                      translateY: function (e) {
                        var t = e.progress;
                        return t <= 1
                          ? "calc(" + t + " * " + h + ")"
                          : "calc(" + h + " + 0.65vh * " + (t - 1) + ")";
                      },
                      scale: [1, 0.91],
                    },
                    f
                  ),
                },
                r
              ),
              {},
              {
                ref: n,
                asChild: !0,
                children: t,
              }
            )
          );
        },
        v = function () {
          var e = (0, o.useContext)(l.O3),
            t = e.nativePageScrollReplaced,
            n = e.stackBackgroundRef;
          return (0, c.jsx)("div", {
            className:
              "SheetWithDepth-stackBackground nativePageScrollReplaced-".concat(
                t
              ),
            ref: n,
          });
        },
        b = function () {
          var e = (0, o.useContext)(l.O3).stackFirstSheetBackdropRef;
          return (0, c.jsx)("div", {
            className: "SheetWithDepth-stackFirstSheetBackdrop",
            ref: e,
          });
        },
        y = function (e) {
          var t = e.children,
            n = (0, a.A)(e, A);
          return (0, c.jsx)(
            s.cj.Root,
            p(
              p(
                {
                  license: "commercial",
                  forComponent: l.o0,
                },
                n
              ),
              {},
              {
                children: t,
              }
            )
          );
        },
        C = function (e) {
          var t = e.children,
            n = e.onTravelStatusChange,
            a = (0, o.useContext)(l.O3),
            r = a.stackingCount,
            i = a.setStackingCount,
            u = a.nativePageScrollReplaced,
            d = a.stackBackgroundRef,
            A = a.stackFirstSheetBackdropRef,
            f = (0, o.useState)(0),
            p = f[0],
            m = f[1],
            h = (0, o.useRef)(!1),
            g = (0, o.useState)("idleOutside"),
            v = g[0],
            b = g[1],
            y = (0, s.Be)({
              elementRef: d,
              dimmingColor: "rgb(0, 0, 0)",
            }),
            C = y.setDimmingOverlayOpacity,
            k = y.animateDimmingOverlayOpacity,
            S = (0, o.useCallback)(
              function (e) {
                null == n || n(e),
                  "stepping" !== v && "idleInside" === e
                    ? (0 === p && m(r + 1),
                      i(function (e) {
                        return e + 1;
                      }))
                    : "idleOutside" === e &&
                      (m(0),
                      i(function (e) {
                        return e - 1;
                      })),
                  0 === r &&
                    "entering" === e &&
                    ((h.current = !1),
                    u ||
                      k({
                        keyframes: [0, 1],
                      }),
                    (0, s.i0)(A.current, {
                      opacity: [0, 0.33],
                    })),
                  1 === r &&
                    "exiting" === e &&
                    ((h.current = !0),
                    u ||
                      k({
                        keyframes: [1, 0],
                      }),
                    (0, s.i0)(A.current, {
                      opacity: [0.33, 0],
                    })),
                  b(e);
              },
              [k, p, u, i, A, r, v]
            ),
            E = (0, o.useMemo)(
              function () {
                return 1 === p && "entering" !== v && "exiting" !== v
                  ? function (e) {
                      var t = e.progress;
                      u || C(t),
                        A.current.style.setProperty("opacity", 0.33 * t);
                    }
                  : void 0;
              },
              [p, v, u, A, C]
            );
          return (0, c.jsx)(s.cj.Portal, {
            children: (0, c.jsxs)(s.cj.View, {
              className: "SheetWithDepth-view",
              contentPlacement: "bottom",
              onTravelStatusChange: S,
              onTravel: E,
              nativeEdgeSwipePrevention: !0,
              children: [
                r > 0 &&
                  1 !== p &&
                  (0, c.jsx)(s.cj.Backdrop, {
                    className: "SheetWithDepth-backdrop",
                    travelAnimation: {
                      opacity: [0, 0.33],
                    },
                  }),
                (0, c.jsxs)(s.cj.Content, {
                  className: "SheetWithDepth-content",
                  stackingAnimation: {
                    translateY: function (e) {
                      var t = e.progress;
                      return t <= 1
                        ? -1.3 * t + "vh"
                        : "calc(-1.3vh + 0.65vh * " + (t - 1) + ")";
                    },
                    scale: [1, 0.91],
                    transformOrigin: "50% 0",
                  },
                  children: [
                    (0, c.jsx)(s.cj.BleedingBackground, {
                      className: "SheetWithDepth-bleedingBackground",
                    }),
                    t,
                  ],
                }),
              ],
            }),
          });
        },
        k = n(39411);
      let S = {
        src: "/_next/static/media/SheetWithDepth.d8dd2cef.png",
        height: 644,
        width: 1083,
        blurDataURL:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAMAAABPT11nAAAAPFBMVEX5+frF392ks7HI///09fXj7+3p9/Xc9/Hs6+uos7dMaXG21tPFzMvFzMjU+Oybra///v6vvMHQ1tPe3dt6WuFAAAAAEHRSTlP+9Jgh/JeZXvz7AHD8lyqajVDHVQAAAAlwSFlzAAAOJgAADiYBou8l/AAAADBJREFUeJwVwYkRwCAIAMEzfqBJBOy/V8dd/n7lwbffiEiT5aqu/tAMsUKlmRSEegAkVAFyXaR7twAAAABJRU5ErkJggg==",
        blurWidth: 8,
        blurHeight: 5,
      };
      var E = n(80582),
        x = n(72261),
        w = n(19160),
        T = n(14637),
        P = ["triggerClassName", "pathOrigin", "pathCount", "data"];
      function O(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function D(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? O(Object(n), !0).forEach(function (t) {
                (0, r.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : O(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var I = T.g.sheetWithDepth,
        R = function e(t) {
          var n = t.pathOrigin,
            a = t.pathCount,
            r = t.data,
            l = a + 1,
            u = (0, w.A)(
              D(
                D({}, I),
                {},
                {
                  path: I.path + n + l,
                }
              )
            ),
            d = (0, i.A)(u, 2),
            A = d[0],
            f = d[1],
            p = (0, o.useState)(!1),
            m = p[0],
            h = p[1],
            g = (0, o.useCallback)(function (e) {
              "idleOutside" === e &&
                setTimeout(function () {
                  return h(!1);
                }, 10);
            }, []);
          return (0, c.jsxs)(C, {
            onTravelStatusChange: g,
            children: [
              (0, c.jsx)(s.OY.Root, {
                className: "ExampleSheetWithDepth-scrollView",
                asChild: !0,
                children: (0, c.jsx)(s.OY.View, {
                  scrollGestureTrap: {
                    yEnd: !0,
                  },
                  onScroll: function (e) {
                    return h(e.distance > 0);
                  },
                  children: (0, c.jsxs)(s.OY.Content, {
                    className: "ExampleSheetWithDepth-scrollContent",
                    children: [
                      (0, c.jsx)(k.default, {
                        className: "ExampleSheetWithDepth-banner",
                        src: r.banner,
                        sizes: "100vw",
                        quality: 90,
                        alt: "Mountain",
                        draggable: "false",
                        loading: "eager",
                        decoding: "sync",
                      }),
                      (0, c.jsx)(k.default, {
                        className: "ExampleSheetWithDepth-profilePicture",
                        src: r.profilePicture,
                        sizes:
                          "(max-width: 600px) 110px,(max-width: 900px) 20vw, 180px",
                        quality: 90,
                        alt: "Profile picture of a women",
                        draggable: "false",
                        loading: "eager",
                        decoding: "sync",
                      }),
                      (0, c.jsxs)("div", {
                        className: "ExampleSheetWithDepth-info",
                        children: [
                          (0, c.jsxs)("div", {
                            className: "ExampleSheetWithDepth-identification",
                            children: [
                              (0, c.jsx)(s.cj.Title, {
                                className: "ExampleSheetWithDepth-username",
                                children: r.name,
                              }),
                              (0, c.jsxs)("div", {
                                className: "ExampleSheetWithDepth-handle",
                                children: ["@", r.handle],
                              }),
                            ],
                          }),
                          (0, c.jsxs)("div", {
                            className: "ExampleSheetWithDepth-metrics",
                            children: [
                              (0, c.jsxs)("div", {
                                className: "ExampleSheetWithDepth-metric",
                                children: [
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricCount",
                                    children: r.followers,
                                  }),
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricLabel",
                                    children: " followers",
                                  }),
                                ],
                              }),
                              (0, c.jsxs)("div", {
                                className: "ExampleSheetWithDepth-metric",
                                children: [
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricCount",
                                    children: r.following,
                                  }),
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricLabel",
                                    children: " following",
                                  }),
                                ],
                              }),
                              (0, c.jsxs)("div", {
                                className: "ExampleSheetWithDepth-metric",
                                children: [
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricCount",
                                    children: r.posts,
                                  }),
                                  (0, c.jsx)("span", {
                                    className:
                                      "ExampleSheetWithDepth-metricLabel",
                                    children: " posts",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, c.jsx)("div", {
                            className: "ExampleSheetWithDepth-bio",
                            children: r.bio,
                          }),
                        ],
                      }),
                      (0, c.jsxs)(y, {
                        className: "ExampleSheetWithDepth-nestedSheetRoot",
                        presented: A,
                        onPresentedChange: f,
                        children: [
                          (0, c.jsx)("section", {
                            className: "ExampleSheetWithDepth-posts",
                            children: r.content.map(function (e, t) {
                              return (0, c.jsxs)(
                                "div",
                                {
                                  className: "ExampleSheetWithDepth-post",
                                  children: [
                                    e.reposted &&
                                      (0, c.jsxs)(c.Fragment, {
                                        children: [
                                          (0, c.jsxs)("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            width: "18",
                                            height: "18",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2.1",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            className:
                                              "ExampleSheetWithDepth-postRepostIcon",
                                            children: [
                                              (0, c.jsx)("path", {
                                                d: "m2 9 3-3 3 3",
                                              }),
                                              (0, c.jsx)("path", {
                                                d: "M13 18H7a2 2 0 0 1-2-2V6",
                                              }),
                                              (0, c.jsx)("path", {
                                                d: "m22 15-3 3-3-3",
                                              }),
                                              (0, c.jsx)("path", {
                                                d: "M11 6h6a2 2 0 0 1 2 2v10",
                                              }),
                                            ],
                                          }),
                                          (0, c.jsxs)("div", {
                                            className:
                                              "ExampleSheetWithDepth-postRepostText",
                                            children: [r.name, " reposted"],
                                          }),
                                        ],
                                      }),
                                    (0, c.jsx)(k.default, {
                                      className:
                                        "ExampleSheetWithDepth-postProfilePicture",
                                      src: e.profilePicture,
                                      alt: "".concat(
                                        e.username,
                                        "'s profile picture"
                                      ),
                                      sizes: "56px",
                                      quality: 90,
                                      draggable: "false",
                                      loading: "eager",
                                      decoding: "sync",
                                    }),
                                    (0, c.jsxs)("div", {
                                      className:
                                        "ExampleSheetWithDepth-postContent",
                                      children: [
                                        (0, c.jsxs)("div", {
                                          className:
                                            "ExampleSheetWithDepth-postHeader",
                                          children: [
                                            (0, c.jsx)("div", {
                                              className:
                                                "ExampleSheetWithDepth-postUsername",
                                              children: e.username,
                                            }),
                                            (0, c.jsxs)("div", {
                                              children: ["@", e.handle],
                                            }),
                                            (0, c.jsx)("div", {
                                              children: "\xb7",
                                            }),
                                            (0, c.jsxs)("div", {
                                              children: [e.hoursPast, "h"],
                                            }),
                                          ],
                                        }),
                                        (0, c.jsx)("div", {
                                          className:
                                            "ExampleSheetWithDepth-postBody",
                                          children: e.content.map(function (
                                            e,
                                            t
                                          ) {
                                            return (0, c.jsx)(
                                              "p",
                                              {
                                                className:
                                                  "ExampleSheetWithDepth-postParagraph",
                                                children: e,
                                              },
                                              t
                                            );
                                          }),
                                        }),
                                        (0, c.jsxs)("div", {
                                          className:
                                            "ExampleSheetWithDepth-postActions",
                                          children: [
                                            (0, c.jsxs)("div", {
                                              className:
                                                "ExampleSheetWithDepth-postAction",
                                              children: [
                                                (0, c.jsx)("svg", {
                                                  xmlns:
                                                    "http://www.w3.org/2000/svg",
                                                  width: "19",
                                                  height: "19",
                                                  viewBox: "0 0 24 24",
                                                  fill: "none",
                                                  stroke: "currentColor",
                                                  strokeWidth: "2.05",
                                                  strokeLinecap: "round",
                                                  strokeLinejoin: "round",
                                                  className:
                                                    "ExampleSheetWithDepth-postCommentsIcon",
                                                  children: (0, c.jsx)("path", {
                                                    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                                                  }),
                                                }),
                                                (0, c.jsx)("div", {
                                                  className:
                                                    "ExampleSheetWithDepth-postCommentsCount",
                                                  children: e.commentsCount,
                                                }),
                                              ],
                                            }),
                                            (0, c.jsxs)("div", {
                                              className:
                                                "ExampleSheetWithDepth-postAction",
                                              children: [
                                                (0, c.jsxs)("svg", {
                                                  xmlns:
                                                    "http://www.w3.org/2000/svg",
                                                  width: "23",
                                                  height: "23",
                                                  viewBox: "0 0 24 24",
                                                  fill: "none",
                                                  stroke: "currentColor",
                                                  strokeWidth: "1.6",
                                                  strokeLinecap: "round",
                                                  strokeLinejoin: "round",
                                                  className:
                                                    "ExampleSheetWithDepth-postSharesIcon",
                                                  children: [
                                                    (0, c.jsx)("path", {
                                                      d: "m2 9 3-3 3 3",
                                                    }),
                                                    (0, c.jsx)("path", {
                                                      d: "M13 18H7a2 2 0 0 1-2-2V6",
                                                    }),
                                                    (0, c.jsx)("path", {
                                                      d: "m22 15-3 3-3-3",
                                                    }),
                                                    (0, c.jsx)("path", {
                                                      d: "M11 6h6a2 2 0 0 1 2 2v10",
                                                    }),
                                                  ],
                                                }),
                                                (0, c.jsx)("div", {
                                                  className:
                                                    "ExampleSheetWithDepth-postSharesCount",
                                                  children: e.sharesCount,
                                                }),
                                              ],
                                            }),
                                            (0, c.jsxs)("div", {
                                              className:
                                                "ExampleSheetWithDepth-postAction",
                                              children: [
                                                (0, c.jsx)("svg", {
                                                  xmlns:
                                                    "http://www.w3.org/2000/svg",
                                                  width: "19",
                                                  height: "19",
                                                  viewBox: "0 0 24 24",
                                                  fill: "none",
                                                  stroke: "currentColor",
                                                  strokeWidth: "2.05",
                                                  strokeLinecap: "round",
                                                  strokeLinejoin: "round",
                                                  className:
                                                    "ExampleSheetWithDepth-postLikesIcon",
                                                  children: (0, c.jsx)("path", {
                                                    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
                                                  }),
                                                }),
                                                (0, c.jsx)("div", {
                                                  className:
                                                    "ExampleSheetWithDepth-postLikesCount",
                                                  children: e.likesCount,
                                                }),
                                              ],
                                            }),
                                            (0, c.jsx)("div", {
                                              className:
                                                "ExampleSheetWithDepth-postAction",
                                              children: (0, c.jsxs)("svg", {
                                                xmlns:
                                                  "http://www.w3.org/2000/svg",
                                                width: "18",
                                                height: "18",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                className:
                                                  "ExampleSheetWithDepth-postShareIcon",
                                                children: [
                                                  (0, c.jsx)("path", {
                                                    d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
                                                  }),
                                                  (0, c.jsx)("polyline", {
                                                    points: "16 6 12 2 8 6",
                                                  }),
                                                  (0, c.jsx)("line", {
                                                    x1: "12",
                                                    x2: "12",
                                                    y1: "2",
                                                    y2: "15",
                                                  }),
                                                ],
                                              }),
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                t
                              );
                            }),
                          }),
                          r.nestedSheet &&
                            (0, c.jsx)("div", {
                              className: "ExampleSheetWithDepth-relatedPages",
                              children: (0, c.jsx)(E.E, {
                                className:
                                  "plausible-event-name=ExamplesPage+SheetWithDepthNested+Click",
                                thumbnail: S,
                                color: "blue",
                                href: I.path + n + l,
                                onClick: function (e) {
                                  return e.preventDefault();
                                },
                                children: "Sheet with Depth",
                              }),
                            }),
                          r.nestedSheet &&
                            (0, c.jsx)(e, {
                              data: r.nestedSheet,
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
              (0, c.jsxs)("div", {
                className: "ExampleSheetWithDepth-topBar fullyVisible-".concat(
                  m
                ),
                children: [
                  (0, c.jsxs)(s.cj.Trigger, {
                    className: "ExampleSheetWithDepth-dismissTrigger",
                    action: "dismiss",
                    children: [
                      (0, c.jsx)("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        className:
                          "ExampleSheetWithDepth-topDismissIcon fullyVisible-".concat(
                            m
                          ),
                        children: (0, c.jsx)("path", {
                          fillRule: "evenodd",
                          d: "M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z",
                          clipRule: "evenodd",
                        }),
                      }),
                      (0, c.jsx)("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        className:
                          "ExampleSheetWithDepth-flowDismissIcon fullyVisible-".concat(
                            m
                          ),
                        children: (0, c.jsx)("path", {
                          fillRule: "evenodd",
                          d: "M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z",
                          clipRule: "evenodd",
                        }),
                      }),
                    ],
                  }),
                  (0, c.jsx)("h3", {
                    className: "ExampleSheetWithDepth-topBarTitle",
                    children: r.name,
                  }),
                ],
              }),
            ],
          });
        },
        j = function (e) {
          var t = e.triggerClassName,
            n = e.pathOrigin,
            r = e.pathCount,
            l = e.data,
            u = (0, a.A)(e, P),
            d = (0, o.useContext)(x.FI),
            A = (0, w.A)(
              D(
                D({}, I),
                {},
                {
                  path: I.path + n + r,
                }
              )
            ),
            f = (0, i.A)(A, 2),
            p = f[0],
            m = f[1];
          return (0, c.jsxs)(
            y,
            D(
              D(
                {
                  presented: p,
                  onPresentedChange: m,
                },
                u
              ),
              {},
              {
                children: [
                  (0, c.jsx)(E.E, {
                    className: t,
                    thumbnail: S,
                    color: "blue",
                    href: I.path + n + r,
                    onClick: function (e) {
                      return e.preventDefault();
                    },
                    children: "Sheet with Depth",
                  }),
                  (0, c.jsxs)(s.cj.Portal, {
                    container: d.current,
                    children: [
                      (0, c.jsx)(k.default, {
                        "aria-hidden": "true",
                        src: l.banner,
                        sizes: "100vw",
                        quality: 90,
                        alt: "",
                        draggable: "false",
                        loading: "eager",
                      }),
                      (0, c.jsx)(k.default, {
                        "aria-hidden": "true",
                        src: l.profilePicture,
                        sizes:
                          "(max-width: 600px) 110px,(max-width: 900px) 20vw, 180px",
                        quality: 90,
                        alt: "",
                        draggable: "false",
                        loading: "eager",
                      }),
                    ],
                  }),
                  (0, c.jsx)(R, {
                    pathOrigin: n,
                    pathCount: 1,
                    data: l,
                  }),
                ],
              }
            )
          );
        };
    },
    73524: (e, t, n) => {
      "use strict";
      n.d(t, {
        d: () => h,
      });
      var a = n(1754),
        r = n(85080),
        i = n(50183),
        o = n(30489),
        s = n(59929),
        l = n(2179),
        c = n(86707),
        u = n(89709),
        d = n(713),
        A = n(30629),
        f = n(4987),
        p = n(45677),
        m = n(31400),
        h = {
          name: "Sophie Dubois",
          handle: "sophiedubois",
          followers: 465,
          following: 239,
          posts: 47,
          bio: "Author of captivating contemporary fiction. Creating stories that resonate.",
          profilePicture: o.A,
          banner: a.A,
          content: [
            {
              profilePicture: i.A,
              username: "Sophie Dubois",
              handle: "sophiedubois",
              hoursPast: 1,
              content: [
                "Excited to share a sneak peek of my upcoming novel! This story has been a journey, and I can't wait for you all to read it.",
              ],
              commentsCount: 30,
              sharesCount: 12,
              likesCount: 80,
            },
            {
              reposted: !0,
              profilePicture: c.A,
              username: "Liam M\xfcller",
              handle: "liammuller",
              hoursPast: 3,
              content: [
                "Spent the weekend hiking in the mountains. The views were breathtaking, and the fresh air was invigorating. We spotted some wildlife and enjoyed the beauty of nature.",
                "Can't wait to plan the next adventure and explore more of what the great outdoors has to offer.",
              ],
              commentsCount: 20,
              sharesCount: 8,
              likesCount: 60,
            },
            {
              reposted: !0,
              profilePicture: u.A,
              username: "Olivia Dupont",
              handle: "oliviadupont",
              hoursPast: 5,
              content: [
                "Finally got around to reading that book everyone's been talking about. The characters were well-developed, and the plot kept me on the edge of my seat. \uD83D\uDCDA✨",
              ],
              commentsCount: 12,
              sharesCount: 3,
              likesCount: 35,
            },
            {
              profilePicture: i.A,
              username: "Sophie Dubois",
              handle: "SophieDubois",
              hoursPast: 7,
              content: [
                "Writing can be both exhilarating and daunting. Some days, the words flow effortlessly; other days, it’s a struggle. But every page brings me closer to the story I want to tell.",
              ],
              commentsCount: 22,
              sharesCount: 9,
              likesCount: 70,
            },
            {
              reposted: !0,
              profilePicture: d.A,
              username: "Ava Rossi",
              handle: "avarossi",
              hoursPast: 9,
              content: [
                "Just adopted a new puppy! He's already stealing everyone's hearts with his playful energy and adorable antics. We've named him Max. \uD83D\uDC36",
                "Can't wait for all the adventures ahead. Welcoming him into our home has been an incredible experience.",
              ],
              commentsCount: 25,
              sharesCount: 10,
              likesCount: 70,
            },
            {
              reposted: !0,
              profilePicture: A.A,
              username: "Sophia Ivanova",
              handle: "sophiaivanova",
              hoursPast: 9,
              content: [
                "Spent the day exploring a new city. So many hidden gems to discover! From local cafes to historic sites, it was a day well spent.",
              ],
              commentsCount: 14,
              sharesCount: 4,
              likesCount: 40,
            },
            {
              profilePicture: i.A,
              username: "Sophie Dubois",
              handle: "SophieDubois",
              hoursPast: 13,
              content: [
                "Books have the power to transport us to new worlds, to help us feel and understand emotions we might never have otherwise experienced. What book changed your perspective?",
              ],
              commentsCount: 26,
              sharesCount: 11,
              likesCount: 75,
            },
            {
              reposted: !0,
              profilePicture: f.A,
              username: "Isabella Silva",
              handle: "isabellasilva",
              hoursPast: 15,
              content: [
                "Started a new fitness routine this week. Feeling stronger already! The workouts are challenging but rewarding.",
              ],
              commentsCount: 16,
              sharesCount: 5,
              likesCount: 45,
            },
            {
              reposted: !0,
              profilePicture: p.A,
              username: "James Nielsen",
              handle: "jamesnielsen",
              hoursPast: 17,
              content: [
                "Attended a concert last night. The energy was electric! The band's performance was incredible, and the crowd was fully engaged. \uD83C\uDFB6",
              ],
              commentsCount: 28,
              sharesCount: 9,
              likesCount: 65,
            },
            {
              reposted: !0,
              profilePicture: m.A,
              username: "Amelia Leclair",
              handle: "amelialeclair",
              hoursPast: 18,
              content: [
                "Spent the day at the beach. The sun, sand, and waves were perfect. The sound of the ocean was soothing, and the gentle breeze made the warm sun feel just right.",
                "Nothing beats a relaxing day by the ocean. Already planning the next beach trip and looking forward to more sun-filled days by the shore.",
              ],
              commentsCount: 19,
              sharesCount: 6,
              likesCount: 52,
            },
          ],
          nestedSheet: {
            name: "Erik Johansson",
            handle: "erikjohansson",
            followers: 387,
            following: 453,
            posts: 64,
            bio: "Storyteller, dreamer, and lover of words. Crafting narratives that inspire and connect.",
            profilePicture: l.A,
            banner: r.A,
            content: [
              {
                profilePicture: s.A,
                username: "Erik Johansson",
                handle: "erikjohansson",
                hoursPast: 1,
                content: [
                  "Starting my day with a fresh cup of coffee and a new chapter. Writing is both a challenge and a joy, and today feels like a good day for creativity!",
                ],
                commentsCount: 28,
                sharesCount: 10,
                likesCount: 75,
              },
              {
                reposted: !0,
                profilePicture: u.A,
                username: "Olivia Dupont",
                handle: "oliviadupont",
                hoursPast: 5,
                content: [
                  "Tried a new recipe today! It was a mix of bold flavors and fresh ingredients. Cooking has become my new passion.",
                ],
                commentsCount: 14,
                sharesCount: 5,
                likesCount: 38,
              },
              {
                profilePicture: s.A,
                username: "Erik Johansson",
                handle: "erikjohansson",
                hoursPast: 7,
                content: [
                  "A good book and a quiet evening—nothing beats that. What are you all reading this week? \uD83D\uDCDA",
                ],
                commentsCount: 20,
                sharesCount: 7,
                likesCount: 65,
              },
              {
                reposted: !0,
                profilePicture: c.A,
                username: "Liam M\xfcller",
                handle: "liammuller",
                hoursPast: 8,
                content: [
                  "Exploring new hiking trails is my favorite weekend activity. The fresh air and scenic views are unbeatable.",
                ],
                commentsCount: 18,
                sharesCount: 8,
                likesCount: 58,
              },
              {
                profilePicture: s.A,
                username: "Erik Johansson",
                handle: "erikjohansson",
                hoursPast: 13,
                content: [
                  "Writing has taught me patience, discipline, and the joy of storytelling. Every page is a step towards something meaningful.",
                ],
                commentsCount: 24,
                sharesCount: 9,
                likesCount: 72,
              },
              {
                reposted: !0,
                profilePicture: d.A,
                username: "Ava Rossi",
                handle: "avarossi",
                hoursPast: 14,
                content: [
                  "Adopted a new cat today! She's already made herself at home. Can't wait for all the cozy evenings ahead!",
                ],
                commentsCount: 22,
                sharesCount: 9,
                likesCount: 68,
              },
              {
                reposted: !0,
                profilePicture: f.A,
                username: "Isabella Silva",
                handle: "isabellasilva",
                hoursPast: 15,
                content: [
                  "Started painting again after a long time. There's something so therapeutic about creating art. \uD83C\uDFA8",
                ],
                commentsCount: 15,
                sharesCount: 6,
                likesCount: 50,
              },
              {
                reposted: !0,
                profilePicture: A.A,
                username: "Sophia Ivanova",
                handle: "sophiaivanova",
                hoursPast: 18,
                content: [
                  "Visited an art gallery today. The exhibits were breathtaking, and the creativity on display was inspiring.",
                ],
                commentsCount: 13,
                sharesCount: 4,
                likesCount: 40,
              },
              {
                reposted: !0,
                profilePicture: m.A,
                username: "Amelia Leclair",
                handle: "amelialeclair",
                hoursPast: 20,
                content: [
                  "Spent the evening stargazing. The sky was so clear, and it reminded me how small we are in the vast universe.",
                ],
                commentsCount: 17,
                sharesCount: 7,
                likesCount: 55,
              },
              {
                reposted: !0,
                profilePicture: p.A,
                username: "James Nielsen",
                handle: "jamesnielsen",
                hoursPast: 22,
                content: [
                  "Attended a jazz festival today. The music, the atmosphere, everything was just perfect. \uD83C\uDFB7",
                ],
                commentsCount: 20,
                sharesCount: 8,
                likesCount: 60,
              },
            ],
          },
        };
    },
    60003: (e, t, n) => {
      "use strict";
      n.d(t, {
        MK: () => i,
        O3: () => s,
        UT: () => o,
        o0: () => l,
      });
      var a = n(12115),
        r = n(99827);
      (0, r.Vq)(), (0, r.Vq)(), (0, r.Vq)(), (0, r.Vq)();
      var i = (0, a.createContext)({}),
        o = (0, r.Vq)(),
        s = (0, a.createContext)({}),
        l = (0, r.Vq)();
    },
    14637: (e, t, n) => {
      "use strict";
      n.d(t, {
        g: () => a,
      });
      var a = {
        root: {
          path: "/",
          title: "Silk - Native-like swipeable sheets on the web",
          description:
            "Swipeable and accessible modal sheet component for React. Silk makes it easy to build high-quality bottom sheets, drawers, dialogs, and more.",
        },
        access: {
          path: "/access",
          title: "Silk - Get Access",
          description:
            "Find out how to get access for commercial and non-commercial usage for Silk, the swipeable and accessible modal sheet component for React.",
        },
        commercialPlanPicker: {
          path: "/##commercial-plan-pricing",
        },
        examples: {
          path: "/examples",
          title: "Silk - Examples",
          description:
            "Discover all the examples for Silk, the swipeable and accessible modal sheet component for React. Bottom sheet, sidebar, lightbox, and more.",
        },
        terms: {
          path: "/terms",
          title: "Silk - Legal Terms",
          description:
            "The legal terms for Silk, the swipeable and accessible modal sheet component for React.",
        },
        features: {
          path: "/##feature-rich",
        },
        ux: {
          path: "/##user-experience",
        },
        dx: {
          path: "/##developer-experience",
        },
        FAQItem: {
          path: "/##",
        },
        community: {
          path: "/##community",
        },
        bottomSheet: {
          path: "/##example-bottom-sheet",
        },
        topSheet: {
          path: "/##example-top-sheet",
        },
        detachedSheet: {
          path: "/##example-detached-sheet",
        },
        card: {
          path: "/##example-card",
        },
        sidebar: {
          path: "/##example-sidebar",
        },
        sheetWithStacking: {
          path: "/##example-sheet-with-stacking",
        },
        sheetWithDetent: {
          path: "/##example-sheet-with-detent",
        },
        sheetWithDepth: {
          path: "/##example-sheet-with-depth",
        },
        sheetWithKeyboard: {
          path: "/##example-sheet-with-keyboard",
        },
        lightbox: {
          path: "/##example-lightbox",
        },
        lightboxComments: {
          path: "/##",
        },
        parallaxPage: {
          path: "/##example-parallax-page",
        },
        longSheet: {
          path: "/##example-long-sheet",
        },
        page: {
          path: "/##example-page",
        },
        pageFromBottom: {
          path: "/##example-page-from-bottom",
        },
      };
    },
    14347: () => {},
    91539: () => {},
    47015: () => {},
    14271: () => {},
    92115: () => {},
    1754: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/image11.9cadf26e.jpg",
        height: 2432,
        width: 3648,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAFAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//aAAwDAQACEAMQAAAAgDn/AP/EABsQAAEEAwAAAAAAAAAAAAAAAAIAAQMFBhIU/9oACAEBAAE/ADz2zAN+eB1//8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQIBAT8Ar//EABURAQEAAAAAAAAAAAAAAAAAAAAC/9oACAEDAQE/AJf/2Q==",
        blurWidth: 8,
        blurHeight: 5,
      };
    },
    85080: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/image13.c7d9a95f.jpg",
        height: 3040,
        width: 3078,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBv/aAAwDAQACEAMQAAAApRPs/8QAGxABAQACAwEAAAAAAAAAAAAAAgMBQgARFGH/2gAIAQEAAT8Akq19RzECJSIW1OtvmOf/xAAaEQACAgMAAAAAAAAAAAAAAAABAgMhAAQU/9oACAECAQE/AOzYkdi0hqs//8QAGBEBAAMBAAAAAAAAAAAAAAAAAQACAxT/2gAIAQMBAT8A5saAGZP/2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    31400: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/amelialeclair.c97b3982.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/aAAwDAQACEAMQAAAAkBUf/8QAHhAAAgEDBQAAAAAAAAAAAAAAAQIFAAMEEyEkQUL/2gAIAQEAAT8AjQcSPsImpyd3boA+a//EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAgEBPwANW//EABYRAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAgBAwEBPwBAM3//2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    713: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/avarossi.2d5f1a62.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/aAAwDAQACEAMQAAAAgURf/8QAHRAAAgIBBQAAAAAAAAAAAAAAAQIDBBEABSFBcf/aAAgBAQABPwAbpXaV7ogJRGSEtnnvB81//8QAHBEAAQMFAAAAAAAAAAAAAAAAAQACIQMEEVFh/9oACAECAQE/ABZ0cugw7fF//8QAGxEAAQQDAAAAAAAAAAAAAAAAAgABBCERFFH/2gAIAQMBAT8A3pGBsbbi/9k=",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    2179: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/erikjohansson-large.578bfe9c.jpg",
        height: 510,
        width: 510,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAAoj//xAAbEAACAgMBAAAAAAAAAAAAAAACAwEEABRBwf/aAAgBAQABPwArxL07twxCVPhbCCZLnuf/xAAZEQEAAgMAAAAAAAAAAAAAAAACAAEREkH/2gAIAQIBAT8ALQ2xfZ//xAAaEQACAgMAAAAAAAAAAAAAAAABAgADESEx/9oACAEDAQE/AGrWwISOLjU//9k=",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    59929: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/erikjohansson.578bfe9c.jpg",
        height: 510,
        width: 510,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAAoj//xAAbEAACAgMBAAAAAAAAAAAAAAACAwEEABRBwf/aAAgBAQABPwArxL07twxCVPhbCCZLnuf/xAAZEQEAAgMAAAAAAAAAAAAAAAACAAEREkH/2gAIAQIBAT8ALQ2xfZ//xAAaEQACAgMAAAAAAAAAAAAAAAABAgADESEx/9oACAEDAQE/AGrWwISOLjU//9k=",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    4987: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/isabellasilva.d4f4d48b.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/9oADAMBAAIQAxAAAACZAX//xAAcEAACAgIDAAAAAAAAAAAAAAACAwEEABIRIaH/2gAIAQEAAT8AC2lZXYtwUuNSgVt3xsPmf//EABcRAAMBAAAAAAAAAAAAAAAAAAABAhH/2gAIAQIBAT8AucZ//8QAFxEBAAMAAAAAAAAAAAAAAAAAAQACA//aAAgBAwEBPwDOyk//2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    45677: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/jamesnielsen.5f5f4730.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAAkNf/xAAdEAABBAIDAAAAAAAAAAAAAAABAgMEEgARBSNR/9oACAEBAAE/AI3FqiSVz3nwUddaqIIOtVI8z//EABcRAQADAAAAAAAAAAAAAAAAAAEAAhL/2gAIAQIBAT8As5Z//8QAFxEBAAMAAAAAAAAAAAAAAAAAAQACEv/aAAgBAwEBPwCpon//2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    86707: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/liammuller.7da0e011.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAAqhf/xAAcEAACAgIDAAAAAAAAAAAAAAACAwQFABIGMlL/2gAIAQEAAT8Au72uqeQRGvN+pxiBmvUfOf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oACAECAQE/AI//xAAXEQADAQAAAAAAAAAAAAAAAAAAAUFx/9oACAEDAQE/AHMP/9k=",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    89709: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/oliviadupont.0df5adad.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUAQEAAAAAAAAAAAAAAAAAAAAF/9oADAMBAAIQAxAAAACMB1P/xAAcEAACAgIDAAAAAAAAAAAAAAABAwIEBRIAETL/2gAIAQEAAT8Anknpyd+2oa3U3SAw+ZRmetef/8QAGhEAAgIDAAAAAAAAAAAAAAAAAgMAAREhwf/aAAgBAgEBPwB72LYYjes8n//EABgRAQEAAwAAAAAAAAAAAAAAAAMCABIh/9oACAEDAQE/ACA0OKqe65//2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    30629: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/sophiaivanova.c92784d9.jpg",
        height: 108,
        width: 108,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAVAQEBAAAAAAAAAAAAAAAAAAACBP/aAAwDAQACEAMQAAAAhEr/AP/EABsQAAICAwEAAAAAAAAAAAAAAAECAxIABBEy/9oACAEBAAE/AC2zFNGjRUW73YMOUHnP/8QAFREBAQAAAAAAAAAAAAAAAAAAADH/2gAIAQIBAT8Aj//EABcRAAMBAAAAAAAAAAAAAAAAAAABAhH/2gAIAQMBAT8Ap6f/2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    30489: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/sophiedubois-large.89ee0392.jpg",
        height: 540,
        width: 540,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//aAAwDAQACEAMQAAAArgbf/8QAGhABAQACAwAAAAAAAAAAAAAAAQIDBAARFf/aAAgBAQABPwA1r9is87WYRVltYqE6JJ5//8QAGBEBAQADAAAAAAAAAAAAAAAAAQIAA1H/2gAIAQIBAT8AKSthys//xAAYEQADAQEAAAAAAAAAAAAAAAABAhEAA//aAAgBAwEBPwBlBXkZKg3/2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    50183: (e, t, n) => {
      "use strict";
      n.d(t, {
        A: () => a,
      });
      let a = {
        src: "/_next/static/media/sophiedubois.89ee0392.jpg",
        height: 540,
        width: 540,
        blurDataURL:
          "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/2wBDAQoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/v/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//aAAwDAQACEAMQAAAArgbf/8QAGhABAQACAwAAAAAAAAAAAAAAAQIDBAARFf/aAAgBAQABPwA1r9is87WYRVltYqE6JJ5//8QAGBEBAQADAAAAAAAAAAAAAAAAAQIAA1H/2gAIAQIBAT8AKSthys//xAAYEQADAQEAAAAAAAAAAAAAAAABAhEAA//aAAgBAwEBPwBlBXkZKg3/2Q==",
        blurWidth: 8,
        blurHeight: 8,
      };
    },
    99827: (e, t, n) => {
      "use strict";
      n.d(t, {
        Be: () => ai,
        Bn: () => ar,
        C9: () => ao,
        Dv: () => t2,
        OY: () => n6,
        Vq: () => aa,
        cj: () => nU,
        eI: () => n_,
        i0: () => as,
        s6: () => nb,
        uq: () => an,
      });
      var a,
        r,
        i,
        o = n(43463),
        s = n(34393),
        l = n(87205),
        c = n(73335),
        u = n(77188),
        d = n(76985),
        A = n(41629),
        f = n(64023),
        p = n(86119),
        m = n(5601),
        h = n(82837),
        g = n(95155),
        v = n(47650),
        b = n(12115),
        y = ["message", "delay"],
        C = ["children"],
        k = ["children"],
        S = [
          "asChild",
          "active",
          "automaticallyDisabledForOptimisation",
          "axis",
          "preventBodyScroll",
          "children",
          "data-silk",
          "className",
        ],
        E = ["asChild", "className", "dataSilk", "children"],
        x = ["asChild", "children", "className", "data-silk"],
        w = ["asChild", "children"],
        T = [
          "forComponent",
          "as",
          "children",
          "className",
          "data-silk",
          "initialState",
          "onPresentAutoFocus",
          "onDismissAutoFocus",
          "onTravelStatusChange",
          "onTravelRangeChange",
          "swipeDismissal",
          "swipe",
          "snapOutAcceleration",
          "snapToEndDetentsAcceleration",
          "onTravel",
          "onTravelStart",
          "onTravelEnd",
          "detents",
          "inertOutside",
          "nativeEdgeSwipePrevention",
          "onSwipeFromEdgeToGoBackAttempt",
          "onClickOutside",
          "onEscapeKeyDown",
          "onFocusInside",
          "nativeFocusScrollPrevention",
          "contentPlacement",
          "tracks",
          "swipeOvershoot",
          "swipeTrap",
          "enteringAnimationSettings",
          "exitingAnimationSettings",
          "steppingAnimationSettings",
          "id",
        ],
        P = ["asChild", "children", "className", "data-silk"],
        O = [
          "asChild",
          "forComponent",
          "travelAnimation",
          "stackingAnimation",
          "style",
          "className",
        ],
        D = ["asChild"],
        I = [
          "forComponent",
          "className",
          "data-silk",
          "onPress",
          "onClick",
          "children",
          "action",
          "travelAnimation",
          "stackingAnimation",
        ],
        R = ["children", "className", "action"],
        j = [
          "className",
          "data-silk",
          "license",
          "sheetRole",
          "componentId",
          "forComponent",
          "defaultPresented",
          "presented",
          "onPresentedChange",
          "defaultActiveDetent",
          "activeDetent",
          "onActiveDetentChange",
          "onSafeToUnmountChange",
        ],
        N = ["asChild", "swipeable"],
        M = [
          "className",
          "data-silk",
          "children",
          "travelAnimation",
          "stackingAnimation",
          "themeColorDimming",
        ],
        B = ["opacity"],
        F = [
          "asChild",
          "children",
          "className",
          "data-silk",
          "travelAnimation",
          "stackingAnimation",
          "style",
        ],
        L = ["asChild"],
        Q = ["className", "data-silk"],
        U = ["className", "data-silk"],
        W = ["asChild", "travelAnimation", "stackingAnimation"],
        G = ["asChild", "travelAnimation", "stackingAnimation"],
        _ = ["componentId", "className", "data-silk", "asChild"],
        V = [
          "forComponent",
          "asChild",
          "stackingAnimation",
          "style",
          "className",
        ],
        Y = [
          "asChild",
          "className",
          "componentId",
          "componentRef",
          "data-silk",
        ],
        X = [
          "asChild",
          "children",
          "className",
          "data-silk",
          "forComponent",
          "axis",
          "pageScroll",
          "nativePageScrollReplacement",
          "safeArea",
          "scrollGestureTrap",
          "scrollGestureOvershoot",
          "scrollGesture",
          "onScrollStart",
          "onScroll",
          "onScrollEnd",
          "onFocusInside",
          "nativeFocusScrollPrevention",
          "scrollAnimationSettings",
          "scrollAnchoring",
          "scrollSnapType",
          "scrollPadding",
          "scrollTimelineName",
          "nativeScrollbar",
        ],
        z = ["side"],
        H = ["asChild", "className", "data-silk"],
        K = ["asChild"],
        q = ["forComponent", "onPress", "onClick", "children", "action"],
        Z = ["type"],
        J = [
          "asChild",
          "className",
          "data-silk",
          "timing",
          "forComponent",
          "tabIndex",
        ],
        $ = [
          "asChild",
          "disabled",
          "children",
          "contentGetter",
          "forComponent",
        ],
        ee = ["asChild", "children"],
        et = [
          "asChild",
          "children",
          "contentGetter",
          "disabled",
          "selfManagedInertOutside",
        ];
      function en(e, t) {
        var n =
          ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!n) {
          if (
            Array.isArray(e) ||
            (n = (function (e, t) {
              if (e) {
                if ("string" == typeof e) return ea(e, void 0);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                if (
                  ("Object" === n && e.constructor && (n = e.constructor.name),
                  "Map" === n || "Set" === n)
                )
                  return Array.from(e);
                if (
                  "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                  return ea(e, void 0);
              }
            })(e)) ||
            (t && e && "number" == typeof e.length)
          ) {
            n && (e = n);
            var a = 0,
              r = function () {};
            return {
              s: r,
              n: function () {
                return a >= e.length
                  ? {
                      done: !0,
                    }
                  : {
                      done: !1,
                      value: e[a++],
                    };
              },
              e: function (e) {
                throw e;
              },
              f: r,
            };
          }
          throw TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }
        var i,
          o = !0,
          s = !1;
        return {
          s: function () {
            n = n.call(e);
          },
          n: function () {
            var e = n.next();
            return (o = e.done), e;
          },
          e: function (e) {
            (s = !0), (i = e);
          },
          f: function () {
            try {
              o || null == n.return || n.return();
            } finally {
              if (s) throw i;
            }
          },
        };
      }
      function ea(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, a = Array(t); n < t; n++) a[n] = e[n];
        return a;
      }
      function er(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function ei(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? er(Object(n), !0).forEach(function (t) {
                (0, m.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : er(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var eo =
          window.document && window.document.createElement
            ? b.useLayoutEffect
            : b.useEffect,
        es = function (e) {
          return function (t, n) {
            return "calc(" + t + " + (" + n + " - " + t + ") * " + e + ")";
          };
        },
        el = window.navigator.userAgent,
        ec = "unknown",
        eu = "unknown";
      if (
        (navigator.userAgentData &&
          ((null === (i = navigator.userAgentData.brands) || void 0 === i
            ? void 0
            : i.some(function (e) {
                return "Chromium" === e.brand;
              })) && (ec = "chromium"),
          "Android" === navigator.userAgentData.platform && (eu = "android")),
        "unknown" === eu &&
          (null == el ? void 0 : el.match(/android/i)) &&
          (eu = "android"),
        "unknown" === ec &&
          ((null == el ? void 0 : el.match(/Chrome/i))
            ? (ec = "chromium")
            : (null == el ? void 0 : el.match(/Firefox/i))
            ? (ec = "gecko")
            : (null == el ? void 0 : el.match(/Safari|iPhone/i)) &&
              (ec = "webkit")),
        "webkit" === ec)
      ) {
        if (null == el ? void 0 : el.match(/iPhone/i)) eu = "ios";
        else if (null == el ? void 0 : el.match(/iPad/i)) eu = "ipados";
        else if (null == el ? void 0 : el.match(/Macintosh/i))
          try {
            null == document || document.createEvent("TouchEvent"),
              (eu = "ipados");
          } catch (e) {
            eu = "macos";
          }
      }
      var ed = {
          mapping: {
            Sheet: {
              componentName: "a",
              elementNames: {
                root: 0,
                view: 1,
                backdrop: 2,
                backdropTrap: 3,
                primaryScrollTrapRoot: 4,
                secondaryScrollTrapRoot: 5,
                scrollContainer: 6,
                frontSpacer: 7,
                backSpacer: 8,
                detentMarker: 9,
                contentWrapper: 10,
                content: 11,
                bleedingBackground: 12,
                stickyContainer: 13,
                sticky: 14,
                leftEdge: 15,
                trigger: 16,
                handle: 17,
                outlet: 18,
              },
              variationSetsNames: {
                openness: "A",
                staging: "B",
                opennessClosedStatus: "C",
                position: "D",
                positionCoveredStatus: "E",
                placement: "F",
                track: "G",
                swipeDisabled: "H",
                swipeOutDisabledWithDetent: "I",
                swipeOvershootDisabled: "J",
                bleedDisabled: "K",
                inertOutside: "L",
                backdropSwipeable: "M",
                scrollContainerShouldBePassThrough: "N",
                swipeTrap: "M",
              },
              variationValuesNames: (0, m.A)(
                {
                  open: "a",
                  opening: "b",
                  closed: "c",
                  closing: "d",
                  none: "e",
                  top: "f",
                  bottom: "g",
                  left: "h",
                  right: "i",
                  horizontal: "j",
                  vertical: "k",
                  front: "l",
                  covered: "m",
                  true: "o",
                  false: "p",
                  auto: "q",
                  center: "r",
                  pending: "s",
                  "flushing-to-preparing-open": "t",
                  "flushing-to-preparing-opening": "u",
                  "preparing-open": "v",
                  "preparing-opening": "x",
                  "safe-to-unmount": "y",
                  content: "z",
                  root: "aa",
                  "going-down": "ab",
                  "going-up": "ac",
                  indeterminate: "ad",
                  idle: "ae",
                  "come-back": "af",
                  out: "ag",
                  stepping: "ah",
                  both: "ai",
                },
                "none",
                "aj"
              ),
            },
            ScrollTrap: {
              componentName: "b",
              elementNames: {
                root: 0,
                stabiliser: 1,
              },
              variationSetsNames: {
                active: "A",
                axis: "B",
                automaticallyDisabledForOptimisation: "C",
              },
              variationValuesNames: {
                true: "a",
                false: "b",
                horizontal: "e",
                vertical: "f",
                both: "g",
                none: "h",
              },
            },
            Scroll: {
              componentName: "c",
              elementNames: {
                root: 0,
                view: 1,
                scrollContainer: 2,
                content: 3,
                UAScrollbarMeasurer: 4,
                spy: 5,
                startSpacer: 6,
                endSpacer: 7,
              },
              variationSetsNames: {
                axis: "A",
                contentPlacement: "B",
                scrollTrapX: "C",
                scrollTrapY: "D",
                scrollGestureOvershoot: "E",
                scrollDisabled: "F",
                side: "G",
                pageScroll: "H",
                overflowX: "I",
                overflowY: "J",
                skipScrollAnimation: "K",
                scrollAnchoring: "L",
                scrollSnapType: "M",
                scrollPadding: "N",
                scrollTimelineName: "O",
                nativeScrollbar: "P",
                scrollOngoing: "Q",
              },
              variationValuesNames: {
                true: "a",
                false: "b",
                x: "c",
                y: "d",
                both: "e",
                unset: "f",
                contain: "g",
                start: "h",
                end: "i",
                center: "j",
                auto: "k",
                default: "l",
                none: "m",
                mandatoryX: "n",
                mandatoryY: "o",
                proximityX: "p",
                proximityY: "q",
              },
            },
            SlideShow: {
              componentName: "d",
              elementNames: {},
              variationSetsNames: {},
              variationValuesNames: {},
            },
            VisuallyHidden: {
              componentName: "e",
              elementNames: {
                root: 0,
              },
              variationSetsNames: {},
              variationValuesNames: {},
            },
            SpecialWrapper: {
              componentName: "f",
              elementNames: {
                root: 0,
                content: 1,
              },
              variationSetsNames: {},
              variationValuesNames: {},
            },
            Fixed: {
              componentName: "g",
              elementNames: {
                root: 0,
              },
              variationSetsNames: {},
              variationValuesNames: {},
            },
            SheetStack: {
              componentName: "h",
              elementNames: {
                root: 0,
                outlet: 1,
              },
              variationSetsNames: {},
              variationValuesNames: {},
            },
            AutoFocusTarget: {
              componentName: "i",
              elementNames: {
                root: 0,
              },
              variationSetsNames: {},
              variationValuesNames: {},
            },
          },
        }.mapping,
        eA = function (e) {
          var t;
          return null !== (t = ed[e].componentName) && void 0 !== t ? t : null;
        },
        ef = function (e, t) {
          var n;
          return null !== (n = ed[e].elementNames[t]) && void 0 !== n
            ? n
            : null;
        },
        ep = function (e, t) {
          var n;
          return null !== (n = ed[e].variationSetsNames[t]) && void 0 !== n
            ? n
            : null;
        },
        em = function (e, t) {
          var n;
          return null !== (n = ed[e].variationValuesNames[t]) && void 0 !== n
            ? n
            : null;
        },
        eh = function (e, t) {
          return (0, b.useCallback)(function (n) {
            var a,
              r,
              i,
              o =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : [],
              s = arguments.length > 2 ? arguments[2] : void 0,
              l =
                null !==
                  (r =
                    null == s
                      ? void 0
                      : null === (a = s.dataSilk) || void 0 === a
                      ? void 0
                      : a.filter(Boolean).join(" ")) && void 0 !== r
                  ? r
                  : "",
              c = eA(e);
            if (((i = c + ef(e, n)), t))
              for (var u = 0; u < o.length; u++) {
                var d = o[u],
                  A = t[d],
                  f = ep(e, d),
                  p = em(e, A);
                i += null != A ? " " + c + f + p : "";
              }
            return {
              className: null == s ? void 0 : s.className,
              "data-silk": i + " " + l,
            };
          }, [e].concat((0, p.A)(t ? Object.values(t) : [])));
        },
        eg = new WeakMap(),
        ev = "function" == typeof Float32Array;
      function eb(e, t, n) {
        return (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e;
      }
      function ey(e, t, n) {
        return (
          3 * (1 - 3 * n + 3 * t) * e * e + 2 * (3 * n - 6 * t) * e + 3 * t
        );
      }
      function eC(e) {
        return e;
      }
      var ek = function (e, t, n, a) {
          if (!(0 <= e && e <= 1 && 0 <= n && n <= 1))
            throw Error("bezier x values must be in [0, 1] range");
          if (e === t && n === a) return eC;
          for (
            var r = ev ? new Float32Array(11) : Array(11), i = 0;
            i < 11;
            ++i
          )
            r[i] = eb(0.1 * i, e, n);
          return function (i) {
            return 0 === i || 1 === i
              ? i
              : eb(
                  (function (t) {
                    for (var a = 0, i = 1; 10 !== i && r[i] <= t; ++i) a += 0.1;
                    var o = a + ((t - r[--i]) / (r[i + 1] - r[i])) * 0.1,
                      s = ey(o, e, n);
                    return s >= 0.001
                      ? (function (e, t, n, a) {
                          for (var r = 0; r < 4; ++r) {
                            var i = ey(t, n, a);
                            if (0 === i) break;
                            var o = eb(t, n, a) - e;
                            t -= o / i;
                          }
                          return t;
                        })(t, o, e, n)
                      : 0 === s
                      ? o
                      : (function (e, t, n, a, r) {
                          var i,
                            o,
                            s = 0;
                          do
                            (i = eb((o = t + (n - t) / 2), a, r) - e) > 0
                              ? (n = o)
                              : (t = o);
                          while (Math.abs(i) > 1e-7 && ++s < 10);
                          return o;
                        })(t, a, a + 0.1, e, n);
                  })(i),
                  t,
                  a
                );
          };
        },
        eS = function (e) {
          return "string" == typeof e
            ? document.querySelector(e)
            : null == e
            ? void 0
            : e();
        },
        eE = function (e, t) {
          return Array.isArray(e) ? e.includes(t) : e === t;
        },
        ex = function (e) {
          return (
            (null == e ? void 0 : e.getAttribute("data-silk-clone")) === "true"
          );
        },
        ew = new Set([
          "checkbox",
          "radio",
          "range",
          "color",
          "file",
          "image",
          "button",
          "submit",
          "reset",
        ]),
        eT = function (e) {
          return (
            (e instanceof HTMLInputElement && !ew.has(e.type)) ||
            e instanceof HTMLTextAreaElement ||
            (e instanceof HTMLElement && e.isContentEditable)
          );
        },
        eP = function (e) {
          return (
            (e instanceof HTMLInputElement && "color" === e.type) ||
            e instanceof HTMLSelectElement
          );
        },
        eO = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        eD = function () {
          var e;
          return (
            window.innerHeight - 200 >
            (null === (e = window.visualViewport) || void 0 === e
              ? void 0
              : e.height)
          );
        };
      function eI(e) {
        var t = e.nativeEvent,
          n = e.defaultBehavior,
          a = e.handler,
          r = n;
        if (a) {
          if ("function" == typeof a) {
            var i = ei(
              ei({}, n),
              {},
              {
                nativeEvent: t,
                changeDefault: function (e) {
                  (r = ei(ei({}, n), e)), Object.assign(this, e);
                },
              }
            );
            (i.changeDefault = i.changeDefault.bind(i)), a(i);
          } else r = ei(ei({}, n), a);
        }
        return r;
      }
      function eR(e) {
        return (e.startsWith("rgb(") || e.startsWith("rgba(")) &&
          e.endsWith(")")
          ? e
              .substring(e.indexOf("(") + 1, e.indexOf(")"))
              .split(",")
              .map(function (e) {
                return e.trim();
              })
              .slice(0, 3)
              .map(function (e) {
                return parseFloat(e);
              })
          : null;
      }
      var ej = function (e) {
          var t,
            n,
            a = null;
          return (
            e.startsWith("rgb(") || e.startsWith("rgba(")
              ? (a = eR(e))
              : e.startsWith("#") &&
                ((n =
                  3 === (t = e.replace(/^#/, "")).length
                    ? t
                        .split("")
                        .map(function (e) {
                          return e + e;
                        })
                        .join("")
                    : t),
                (a = /^[0-9A-Fa-f]{6}$/.test(n)
                  ? [
                      parseInt(n.slice(0, 2), 16),
                      parseInt(n.slice(2, 4), 16),
                      parseInt(n.slice(4, 6), 16),
                    ]
                  : null)),
            a
          );
        },
        eN = function (e) {
          for (
            var t = e.color,
              n = e.overlays,
              a = (0, p.A)(t),
              r = n.length,
              i = 0;
            i < r;
            i++
          )
            for (var o = n[i], s = o.alpha, l = 0; l < 3; l++)
              a[l] = (1 - s) * a[l] + s * o.color[l];
          return "rgb(" + a.join(",") + ")";
        },
        eM = function (e) {
          (0, b.useEffect)(
            function () {
              var t = function () {
                eD() ? e(!0) : e(!1);
              };
              return (
                t(),
                visualViewport.addEventListener("resize", t),
                function () {
                  visualViewport.removeEventListener("resize", t);
                }
              );
            },
            [e]
          );
        },
        eB = function (e) {
          var t = (0, b.useState)(!1),
            n = (0, f.A)(t, 2),
            a = n[0],
            r = n[1];
          return (
            eM(
              (0, b.useCallback)(
                function (t) {
                  e.current &&
                    r(
                      !!t &&
                        !e.current.matches(
                          '[data-silk~="0ad"]:not([data-silk~="0ai"]) *, [data-silk~="0ab"] *'
                        )
                    );
                },
                [e]
              )
            ),
            a
          );
        },
        eF = function () {
          return (
            "android" === eu &&
            "chromium" === ec &&
            !window.matchMedia(
              "(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)"
            ).matches
          );
        },
        eL = function () {
          var e, t, n;
          return (
            window.navigator.standalone &&
            (null === (e = document.querySelector("meta[name='viewport']")) ||
            void 0 === e
              ? void 0
              : e.content.includes("viewport-fit=cover")) &&
            (null ===
              (t = document.querySelector(
                "meta[name='apple-mobile-web-app-capable']"
              )) || void 0 === t
              ? void 0
              : t.content) === "yes" &&
            (null ===
              (n = document.querySelector(
                "meta[name='apple-mobile-web-app-status-bar-style']"
              )) || void 0 === n
              ? void 0
              : n.content) === "black-translucent"
          );
        },
        eQ = function () {
          return "webkit" === ec;
        },
        eU = function (e) {
          var t = e.genericContext,
            n = e.customContext,
            a = e.value,
            r = e.children;
          return n
            ? (0, g.jsx)(n.Provider, {
                value: a,
                children: (0, g.jsx)(t.Provider, {
                  value: a,
                  children: r,
                }),
              })
            : (0, g.jsx)(t.Provider, {
                value: a,
                children: r,
              });
        };
      eU.displayName = "CustomisableContext";
      var eW = function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {
                    duration: 500,
                    cubicBezier: [0.25, 0.1, 0.25, 1],
                  },
            n = t.duration,
            a = t.cubicBezier,
            r = ek.apply(void 0, (0, p.A)(a)),
            i = null;
          !(function e(t, a) {
            i || (i = t);
            var o = t - i,
              s = r(o / n);
            o < n
              ? (a(s),
                requestAnimationFrame(function () {
                  return e(document.timeline.currentTime, a);
                }))
              : a(1);
          })(document.timeline.currentTime, e);
        },
        eG = function (e) {
          var t = (0, b.useRef)(null);
          return (
            eo(function () {
              t.current = e;
            }),
            (0, b.useCallback)(function () {
              return t.current.apply(void 0, arguments);
            }, [])
          );
        };
      function e_(e) {
        for (var t = 0; t < e.length; t++)
          if (!e[t].matches('[data-silk~="0ad"]')) return e[t];
        return e[0];
      }
      var eV = function (e, t) {
          var n,
            a = eq(t, ["[data-silk~='0ac']"]),
            r = a.safelyFocusableElements,
            i = a.safelyTabbableElements,
            o = th.autoFocusTargets
              .filter(function (t) {
                return "any" === t.layerId || t.layerId === e;
              })
              .filter(function (e) {
                return eE(e.timing, "present");
              }),
            s = e_(
              r.filter(function (e) {
                return o
                  .map(function (e) {
                    return e.element;
                  })
                  .includes(e);
              })
            ),
            l = e_(i);
          (null !== (n = null != s ? s : l) && void 0 !== n ? n : t).focus({
            preventScroll: !0,
          });
        },
        eY = function (e, t, n) {
          eI({
            nativeEvent: null,
            defaultBehavior: {
              focus: !0,
            },
            handler: n,
          }).focus && eV(e, t);
        },
        eX = function (e, t, n, a) {
          if (
            !(
              !t.contains(document.activeElement) &&
              document.contains(document.activeElement)
            ) &&
            eI({
              nativeEvent: null,
              defaultBehavior: {
                focus: !0,
              },
              handler: n,
            }).focus
          ) {
            var r,
              i = th.autoFocusTargets
                .filter(function (t) {
                  return "any" === t.layerId || t.layerId === e;
                })
                .filter(function (e) {
                  return eE(e.timing, "dismiss") && !t.contains(e.element);
                }),
              o = e_(
                eq(document.body).safelyFocusableElements.filter(function (e) {
                  return i
                    .map(function (e) {
                      return e.element;
                    })
                    .includes(e);
                })
              );
            (null !== (r = null != o ? o : a) && void 0 !== r
              ? r
              : document.body
            ).focus({
              preventScroll: !0,
            });
          }
        },
        ez = function (e) {
          null != e.parentNode && e.parentNode.removeChild(e);
        },
        eH = function () {
          var e = document.createElement("div");
          return (
            (e.tabIndex = 0),
            (e.style.position = "fixed"),
            e.setAttribute("aria-hidden", "true"),
            e.setAttribute("data-silk", "0aa"),
            e
          );
        },
        eK = function (e) {
          var t = eH(),
            n = eH();
          return (
            e.insertAdjacentElement("beforebegin", t),
            e.insertAdjacentElement("afterend", n),
            function () {
              ez(t), ez(n);
            }
          );
        },
        eq = function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : [],
            n = [
              "input:not([disabled]):not([type=hidden])",
              "select:not([disabled])",
              "textarea:not([disabled])",
              "button:not([disabled])",
              "a[href]",
              "area[href]",
              "summary",
              "iframe",
              "object",
              "embed",
              "audio[controls]",
              "video[controls]",
              "[contenteditable]",
              "[tabindex]:not([disabled])",
            ]
              .concat((0, p.A)(t))
              .join(","),
            a = e
              ? [].concat(
                  (0, p.A)(e.matches(n) ? [e] : []),
                  (0, p.A)(e.querySelectorAll(n))
                )
              : [],
            r = [].concat((0, p.A)(t), [
              "[aria-hidden='true']",
              "[aria-hidden='true'] *",
              "[inert]",
              "[inert] *",
            ]),
            i = a.map(function (e) {
              return {
                element: e,
                tabbable: e.matches(':not([hidden]):not([tabindex^="-"])'),
                skippable:
                  e.matches(r.join(",")) ||
                  !(
                    e.offsetWidth ||
                    e.offsetHeight ||
                    e.getClientRects().length
                  ),
              };
            }),
            o = i
              .filter(function (e) {
                return !e.skippable;
              })
              .map(function (e) {
                return e.element;
              }),
            s = i.filter(function (e) {
              return e.tabbable;
            }),
            l = s
              .filter(function (e) {
                return !e.skippable;
              })
              .map(function (e) {
                return e.element;
              });
          return {
            allFocusableElementsWithData: i,
            safelyFocusableElements: o,
            allTabbableElementsWithData: s,
            safelyTabbableElements: l,
          };
        },
        eZ = function (e, t) {
          var n = eq(e, ["[data-silk~='0ac']"]),
            a = n.safelyTabbableElements,
            r = n.allTabbableElementsWithData,
            i = n.allFocusableElementsWithData,
            o = (0, p.A)(r),
            s = (0, p.A)(i);
          return (
            t &&
              [o, s].forEach(function (t) {
                t.unshift({
                  element: e.previousElementSibling,
                  tabbable: !0,
                  skippable: !0,
                }),
                  t.push({
                    element: e.nextElementSibling,
                    tabbable: !0,
                    skippable: !0,
                  });
              }),
            {
              safelyTabbableElements: a,
              allTabbableElementsWithGuardsWithData: o,
              allFocusableElementsWithGuardsWithData: s,
            }
          );
        },
        eJ = function (e, t) {
          var n;
          return (
            (n = t
              .slice(0, e)
              .reverse()
              .find(function (e) {
                return !1 === e.skippable;
              })) ||
              (n = t
                .slice(e + 1 - t.length)
                .reverse()
                .find(function (e) {
                  return !1 === e.skippable;
                })),
            n
          );
        },
        e$ = function (e, t) {
          var n;
          return (
            (n = t.slice(e + 1).find(function (e) {
              return !1 === e.skippable;
            })) ||
              (n = t.slice(0, e).find(function (e) {
                return !1 === e.skippable;
              })),
            n
          );
        },
        e0 = function (e) {
          var t,
            n,
            a,
            r = e.rootElements,
            i = e.e,
            o = e.fromElement,
            s = e.toElement,
            l = e.fallbackElement;
          if (s) {
            var c = [],
              u = [],
              d = [];
            r.forEach(function (e) {
              var t = eZ(e, !0),
                n = t.safelyTabbableElements,
                a = t.allTabbableElementsWithGuardsWithData,
                r = t.allFocusableElementsWithGuardsWithData;
              (c = [].concat((0, p.A)(c), (0, p.A)(n))),
                (u = [].concat((0, p.A)(u), (0, p.A)(a))),
                (d = [].concat((0, p.A)(d), (0, p.A)(r)));
            });
            var A = u.findIndex(function (e) {
                return e.element === o;
              }),
              f = u.findIndex(function (e) {
                return e.element === s;
              }),
              m = u[f],
              h = d.findIndex(function (e) {
                return e.element === s;
              }),
              g = !!s && r.includes(s) && "-1" === s.getAttribute("tabindex");
            if (-1 === h && !g) {
              var v = r.find(function (e) {
                return "-1" === e.getAttribute("tabindex");
              });
              null == v || v.focus();
            }
            (null == m ? void 0 : m.skippable) &&
              (c.length
                ? 1 === c.length
                  ? o === c[0]
                    ? (i.preventDefault(),
                      i.stopPropagation(),
                      requestAnimationFrame(function () {
                        return o.focus();
                      }))
                    : c[0].focus()
                  : A
                  ? f < A
                    ? null === (n = eJ(f, u)) ||
                      void 0 === n ||
                      n.element.focus()
                    : null === (a = e$(f, u)) ||
                      void 0 === a ||
                      a.element.focus()
                  : null === (t = e$(f, u)) || void 0 === t || t.element.focus()
                : null == l || l.focus());
          }
        },
        e1 = function (e, t, n, a, r) {
          if (
            null === (i = e.target) ||
            void 0 === i ||
            !i.matches("[data-silk-clone]")
          ) {
            var i,
              o = [],
              s = [];
            n.forEach(function (e) {
              var t = eq(e),
                n = t.safelyFocusableElements,
                a = t.safelyTabbableElements;
              (o = [].concat((0, p.A)(o), (0, p.A)(n))),
                (s = [].concat((0, p.A)(s), (0, p.A)(a)));
            }),
              n.includes(e.target) || o.includes(e.target)
                ? e.target && r(e.target)
                : a
                ? a.focus()
                : s.length
                ? s[0].focus()
                : t.focus();
          }
        },
        e2 = function (e, t) {
          if (
            null === (n = e.relatedTarget) ||
            void 0 === n ||
            !n.matches("[data-silk-clone]")
          ) {
            var n,
              a = null != e3 ? e3 : e.target,
              r = null != e4 ? e4 : e.relatedTarget;
            e0({
              rootElements: t,
              e: e,
              fromElement: a,
              toElement: r,
            }),
              (e3 = null),
              (e4 = null);
          }
        },
        e5 = function (e, t, n, a, r) {
          var i = n.find(function (t) {
            return t.contains(e.target);
          });
          "Tab" !== e.key ||
            i ||
            (e.preventDefault(), e.stopPropagation(), e1(e, t, n, a, r));
        },
        e3 = null,
        e4 = null,
        e8 = function (e) {
          var t = e.rootElements,
            n = e.viewElement,
            a = e.elementFocusedLast,
            r = e.setElementFocusedLast,
            i = [];
          t.forEach(function (e) {
            i.push(eK(e));
          });
          var o = (function (e) {
              for (
                var t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : document,
                  n = new Set(e),
                  a = new Set(),
                  r = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, {
                    acceptNode: function (t) {
                      return (t instanceof HTMLElement &&
                        "true" === t.dataset.liveAnnouncer &&
                        n.add(t),
                      "HEAD" === t.tagName ||
                        "SCRIPT" === t.tagName ||
                        n.has(t) ||
                        (t.parentElement && a.has(t.parentElement)))
                        ? NodeFilter.FILTER_REJECT
                        : (t instanceof HTMLElement &&
                            "row" === t.getAttribute("role")) ||
                          e.some(function (e) {
                            return t.contains(e);
                          })
                        ? NodeFilter.FILTER_SKIP
                        : NodeFilter.FILTER_ACCEPT;
                    },
                  }),
                  i = function (e) {
                    var t,
                      n = null !== (t = eg.get(e)) && void 0 !== t ? t : 0;
                    ("true" !== e.getAttribute("aria-hidden") || 0 !== n) &&
                      (0 === n && e.setAttribute("aria-hidden", "true"),
                      a.add(e),
                      eg.set(e, n + 1));
                  },
                  o = r.nextNode();
                null != o;

              )
                i(o), (o = r.nextNode());
              var s = new MutationObserver(function (e) {
                var t,
                  r = en(e);
                try {
                  for (r.s(); !(t = r.n()).done; )
                    !(function () {
                      var e = t.value;
                      if (
                        "childList" === e.type &&
                        0 !== e.addedNodes.length &&
                        ![].concat((0, p.A)(n), (0, p.A)(a)).some(function (t) {
                          return t.contains(e.target);
                        })
                      ) {
                        var r,
                          o = en(e.addedNodes);
                        try {
                          for (o.s(); !(r = o.n()).done; ) {
                            var s = r.value;
                            s instanceof HTMLElement &&
                            "true" === s.dataset.liveAnnouncer
                              ? n.add(s)
                              : s instanceof Element && i(s);
                          }
                        } catch (e) {
                          o.e(e);
                        } finally {
                          o.f();
                        }
                      }
                    })();
                } catch (e) {
                  r.e(e);
                } finally {
                  r.f();
                }
              });
              return (
                s.observe(t, {
                  childList: !0,
                  subtree: !0,
                }),
                function () {
                  var e,
                    t = en((s.disconnect(), a));
                  try {
                    for (t.s(); !(e = t.n()).done; ) {
                      var n = e.value,
                        r = eg.get(n);
                      1 === r
                        ? (n.removeAttribute("aria-hidden"), eg.delete(n))
                        : void 0 !== r && eg.set(n, r - 1);
                    }
                  } catch (e) {
                    t.e(e);
                  } finally {
                    t.f();
                  }
                }
              );
            })(t, document),
            s = function (e) {
              return e2(e, t);
            },
            l = function (e) {
              return e1(e, n, t, a, r);
            },
            c = function (e) {
              return e5(e, n, t, a, r);
            };
          return (
            document.addEventListener("keydown", c),
            document.addEventListener("focusout", s),
            document.addEventListener("focusin", l),
            function () {
              document.removeEventListener("focusout", s),
                document.removeEventListener("focusin", l),
                document.removeEventListener("keydown", c),
                o(),
                i.forEach(function (e) {
                  return e();
                });
            }
          );
        },
        e9 = new Set(),
        e7 = function (e) {
          e9.add(e);
        },
        e6 = function (e) {
          e9.delete(e);
        },
        te = function e(t, n, a, r) {
          var i = t[n],
            o = i.onClickOutside,
            s = i.dismissOverlayIfNotAlertDialog,
            l = i.viewElement,
            c = i.scrollContainerElement,
            u = i.backdropElement;
          if (
            c === r.target ||
            u === r.target ||
            (!(null == l ? void 0 : l.contains(r.target)) &&
              !a.find(function (e) {
                return e.element.contains(r.target);
              }) &&
              (function (e) {
                var t,
                  n = en(th.automaticLayerElements);
                try {
                  for (n.s(); !(t = n.n()).done; )
                    if (t.value.contains(e)) return !1;
                } catch (e) {
                  n.e(e);
                } finally {
                  n.f();
                }
                return !0;
              })(r.target))
          ) {
            var d = !0,
              A = !0;
            if (o) {
              var f = eI({
                  nativeEvent: r,
                  defaultBehavior: {
                    dismiss: !0,
                    stopOverlayPropagation: !0,
                  },
                  handler: o,
                }),
                p = f.dismiss,
                m = f.stopOverlayPropagation;
              (d = p), (A = m);
            }
            d && s && s(), n > 0 && !A && e(t, n - 1, a, r);
          }
        },
        tt = null,
        tn = function (e, t, n) {
          if (
            !(
              e9.size ||
              (null === (a = e.target) || void 0 === a
                ? void 0
                : a.matches('[data-silk~="0ak"] *'))
            ) &&
            (e.target !== document.body || tt === document.body) &&
            e.target &&
            e.target.isConnected
          ) {
            var a,
              r = t.length;
            te(t, r - 1, n, e), (tt = null);
          }
        },
        ta = function (e, t) {
          var n = function (e) {
              return (tt = e.target);
            },
            a = function (n) {
              return tn(n, e, t);
            };
          return (
            document.addEventListener("pointerdown", n, {
              capture: !0,
            }),
            document.addEventListener("click", a, {
              capture: !0,
            }),
            function () {
              document.removeEventListener("pointerdown", n, {
                capture: !0,
              }),
                document.removeEventListener("click", a, {
                  capture: !0,
                });
            }
          );
        },
        tr = function e(t, n, a) {
          var r = t[n],
            i = r.onEscapeKeyDown,
            o = r.dismissOverlayIfNotAlertDialog,
            s = !0,
            l = !0,
            c = !0;
          if (i) {
            var u = eI({
                nativeEvent: a,
                defaultBehavior: {
                  nativePreventDefault: !0,
                  dismiss: !0,
                  stopOverlayPropagation: !0,
                },
                handler: i,
              }),
              d = u.dismiss,
              A = u.nativePreventDefault,
              f = u.stopOverlayPropagation;
            (s = A), (l = d), (c = f);
          }
          s && a.preventDefault(), l && o && o(), n > 0 && !c && e(t, n - 1, a);
        },
        ti = function (e, t) {
          if ("Escape" === e.key && !e9.size) {
            var n = t.length;
            tr(t, n - 1, e);
          }
        },
        to = function (e) {
          var t = function (t) {
            return ti(t, e);
          };
          return (
            document.addEventListener("keydown", t),
            function () {
              document.removeEventListener("keydown", t);
            }
          );
        },
        ts = function (e) {
          return (
            e.setAttribute("aria-hidden", "true"),
            function () {
              return e.removeAttribute("aria-hidden");
            }
          );
        },
        tl = function (e) {
          eZ(e).allTabbableElementsWithGuardsWithData.forEach(function (e) {
            e.element.tabIndex = -1;
          });
        },
        tc = function (e) {
          var t;
          return (
            e instanceof HTMLInputElement &&
            (!!(
              "password" === e.type ||
              ("text" === e.type && "username" === e.autocomplete) ||
              (null === (t = e.closest("form")) || void 0 === t
                ? void 0
                : t.querySelector('input[type="password"]'))
            ) ||
              void 0)
          );
        },
        tu = function (e) {
          var t,
            n,
            a = e.getBoundingClientRect(),
            r = a.height,
            i =
              (null !==
                (n =
                  null === (t = window.visualViewport) || void 0 === t
                    ? void 0
                    : t.height) && void 0 !== n
                ? n
                : 0) - a.bottom;
          return i > -r / 2 && i < r + 32;
        },
        td = function (e) {
          var t;
          return null ===
            (t =
              null == e
                ? void 0
                : e.closest('[data-silk~="0ab"], [data-silk~="0ad"]')) ||
            void 0 === t
            ? void 0
            : t.matches('[data-silk~="0ah"]');
        },
        tA = function () {
          var e = function e(t) {
              var n,
                a = t.target;
              td(a) &&
                (null ===
                  (n = null == a ? void 0 : a.closest('[data-silk~="0ah"]')) ||
                  void 0 === n ||
                  n.focus({
                    preventScroll: !0,
                  }),
                document.removeEventListener("touchstart", e, {
                  capture: !0,
                }));
            },
            t = function (t) {
              var n = t.target,
                a = t.relatedTarget;
              if (!a)
                return document.addEventListener("touchstart", e, {
                  capture: !0,
                  passive: !1,
                });
              if (
                td(a) &&
                (eP(a) &&
                  document.addEventListener("touchstart", e, {
                    capture: !0,
                    passive: !1,
                  }),
                !((!eT(a) && !eP(a)) || ex(n)))
              ) {
                if (!tc(a) && eT(n) && tu(n)) {
                  var r = n.cloneNode(!1);
                  r.removeAttribute("id"),
                    r.setAttribute("data-silk-clone", "true"),
                    r.style.setProperty("position", "fixed"),
                    r.style.setProperty("left", "0"),
                    r.style.setProperty("top", "0"),
                    r.style.setProperty(
                      "transform",
                      "translateY(-3000px) scale(0)"
                    ),
                    document.documentElement.appendChild(r),
                    (e4 = a),
                    null == r ||
                      r.focus({
                        preventScroll: !0,
                      }),
                    setTimeout(function () {
                      (e3 = n),
                        (e4 = a),
                        null == a ||
                          a.focus({
                            preventScroll: !0,
                          }),
                        r.remove();
                    }, 32);
                } else
                  (e4 = a),
                    null == a ||
                      a.focus({
                        preventScroll: !0,
                      });
              }
            },
            n = function (e) {
              var t,
                n = e.target;
              !(n !== document.activeElement || !eT(n) || eD()) &&
                td(n) &&
                (null ===
                  (t =
                    null == n
                      ? void 0
                      : n.closest('[data-silk~="0ab"], [data-silk~="0ad"]')) ||
                  void 0 === t ||
                  t.focus({
                    preventScroll: !0,
                  }));
            },
            a = function (e) {
              var t,
                n = e.target;
              if (
                n &&
                "setSelectionRange" in n &&
                (["password", "search", "tel", "text", "url"].includes(
                  n.type
                ) ||
                  n instanceof HTMLTextAreaElement) &&
                !0 !== n._silk_focusedBefore
              ) {
                var a = n.value.length;
                null === (t = n.setSelectionRange) ||
                  void 0 === t ||
                  t.call(n, a, a),
                  (n._silk_focusedBefore = !0);
              }
            };
          return (
            document.addEventListener("blur", t, {
              capture: !0,
              passive: !1,
            }),
            document.addEventListener("touchstart", e, {
              capture: !0,
              passive: !0,
            }),
            document.addEventListener("touchend", n, {
              capture: !0,
              passive: !0,
            }),
            document.addEventListener("focusin", a),
            function () {
              document.removeEventListener("blur", t, {
                capture: !0,
              }),
                document.removeEventListener("touchend", n, {
                  capture: !0,
                }),
                document.removeEventListener("touchstart", e, {
                  capture: !0,
                }),
                document.removeEventListener("focusin", a);
            }
          );
        },
        tf = [
          "translate",
          "translateX",
          "translateY",
          "translateZ",
          "scale",
          "scaleX",
          "scaleY",
          "scaleZ",
          "rotate",
          "rotateX",
          "rotateY",
          "rotateZ",
          "skew",
          "skewX",
          "skewY",
        ],
        tp = null,
        tm = function (e) {
          tp = e;
        },
        th = {
          sheets: [],
          addSheet: function (e) {
            if (e.id) {
              var t,
                n = this.findSheet(e.id);
              return (
                n
                  ? (e.stackId && (n.stackId = e.stackId),
                    e.sendToOpennessMachine &&
                      (n.sendToOpennessMachine = e.sendToOpennessMachine),
                    (t = n))
                  : ((t = ei(
                      {
                        stackingIndex: -1,
                        travelAnimations: [],
                        aggregatedTravelCallback: function (e, t) {
                          for (
                            var n = this.travelAnimations, a = 0, r = n.length;
                            a < r;
                            a++
                          )
                            n[a].callback(e, t);
                        },
                        stackingAnimations: [],
                        aggregatedStackingCallback: function (e, t) {
                          for (
                            var n = this.stackingAnimations,
                              a = 0,
                              r = n.length;
                            a < r;
                            a++
                          )
                            n[a].callback(e, t);
                        },
                        belowSheetsInStack: [],
                        outlets: new Set(),
                      },
                      e
                    )),
                    this.sheets.push(t)),
                this.updateBelowSheetsInStackOfAllSheets(),
                t
              );
            }
          },
          attemptToRemoveSheet: function (e, t) {
            var n = this.findSheet(e);
            if (n) {
              if (0 === n.outlets.size) {
                var a,
                  r =
                    null === (a = this.findSheet(e)) || void 0 === a
                      ? void 0
                      : a.stackId;
                (this.sheets = this.sheets.filter(function (t) {
                  return t.id !== e;
                })),
                  r && this.updateSelfAndAboveTravelProgressSumInStack(r);
              } else t && t(n);
            }
          },
          attemptToRemoveSheetOrCleanup: function (e) {
            this.attemptToRemoveSheet(e, function (e) {
              e.sendToOpennessMachine = null;
            });
          },
          findSheet: function (e) {
            return this.sheets.find(function (t) {
              return t.id === e;
            });
          },
          addOutletToSheet: function (e, t) {
            var n = this.findSheet(e);
            n
              ? n.outlets.add(t)
              : this.addSheet({
                  id: e,
                  outlets: new Set([t]),
                });
          },
          removeOutletFromSheet: function (e, t) {
            var n = this.findSheet(e);
            null == n || n.outlets.delete(t), this.attemptToRemoveSheet(e);
          },
          sheetStacks: [],
          addSheetStack: function (e) {
            var t;
            return (
              this.findSheetStack(e.id) ||
                ((t = ei(
                  {
                    stackingAnimations: [],
                    aggregatedStackingCallback: function (e, t) {
                      for (
                        var n = this.stackingAnimations, a = 0, r = n.length;
                        a < r;
                        a++
                      )
                        n[a].callback(e, t);
                    },
                  },
                  e
                )),
                this.sheetStacks.push(t)),
              this.updateBelowSheetsInStackOfAllSheets(),
              t
            );
          },
          removeSheetStack: function (e) {
            e &&
              ((this.sheetStacks = this.sheetStacks.filter(function (t) {
                return t.id !== e;
              })),
              this.removeAllOutletPersistedStylesFromStack(e));
          },
          findSheetStack: function (e) {
            return this.sheetStacks.find(function (t) {
              return t.id === e;
            });
          },
          updateBelowSheetsInStackOfAllSheets: function () {
            var e = this;
            this.sheets.forEach(function (t) {
              var n,
                a = t.stackId;
              if (a) {
                n = e.findSheetStack(a);
                var r = e.sheets.filter(function (e) {
                    return e.stackId === t.stackId;
                  }),
                  i = r.filter(function (e) {
                    return (
                      e.stackId === t.stackId &&
                      e.stackingIndex > t.stackingIndex
                    );
                  });
                n && (i.unshift(n), (n.stackingIndex = r.length - 1)),
                  (t.belowSheetsInStack = i),
                  e.updateSelfAndAboveTravelProgressSumInStack(a);
              }
            });
          },
          updateSheetStackingIndex: function (e, t) {
            var n = this.findSheet(e);
            n && (n.stackingIndex = t),
              this.updateBelowSheetsInStackOfAllSheets();
          },
          updateSheetTravelProgress: function (e, t) {
            var n = this.findSheet(e);
            n &&
              n.stackId &&
              ((n.travelProgress = t),
              this.updateSelfAndAboveTravelProgressSumInStack(n.stackId));
          },
          updateSelfAndAboveTravelProgressSumInStack: function (e) {
            var t = this.sheets
                .filter(function (t) {
                  return t.stackId === e;
                })
                .sort(function (e, t) {
                  return t.stackingIndex - e.stackingIndex;
                }),
              n = this.findSheetStack(e);
            n && t.unshift(n);
            for (var a = t.length, r = 0; r < a; r++) {
              var i = t[r];
              i.selfAndAboveTravelProgressSum = [];
              for (var o = 0; o < a; o++)
                o <= r
                  ? (i.selfAndAboveTravelProgressSum[o] = 0)
                  : (i.selfAndAboveTravelProgressSum[o] = t
                      .slice(r + 1, o + 1)
                      .reduce(function (e, t) {
                        return e + t.travelProgress;
                      }, 0));
            }
          },
          addAnimationToSheetOrStack: function (e) {
            var t = e.type,
              n = e.sheetId,
              a = e.stackId,
              r = e.element,
              i = e.config,
              o = i.hasOwnProperty("properties") ? i.properties : i,
              s = [];
            Object.entries(o).forEach(function (e) {
              var t = (0, f.A)(e, 2),
                n = t[0],
                a = t[1];
              if ("ignore" !== a && a && "string" != typeof a) {
                if ("function" == typeof a) {
                  if (tf.includes(n)) {
                    var r = s.findIndex(function (e) {
                        return "transform" === e[0];
                      }),
                      i = function (e) {
                        return n + "(" + a(e) + ")";
                      };
                    if (-1 !== r) {
                      var o = s[r][1];
                      s[r][1] = function (e) {
                        return o(e) + " " + i(e);
                      };
                    } else s.push(["transform", i]);
                  } else if ("transform" === n) {
                    var l = s.findIndex(function (e) {
                      return "transform" === e[0];
                    });
                    if (-1 !== l) {
                      var c = s[l][1];
                      s[l][1] = function (e) {
                        return c(e) + " " + a(e);
                      };
                    } else s.push(["transform", a]);
                  } else s.push([n, a]);
                } else if ("opacity" === n) {
                  var u = [
                    "opacity",
                    function (e) {
                      return (0, e.tween)(a[0], a[1]);
                    },
                  ];
                  s.push(u);
                } else {
                  if (!n.startsWith("scale") && (!isNaN(a[0]) || !isNaN(a[1])))
                    throw Error(
                      "Keyframe values used with a 'transform' property require a unit (e.g. 'px', 'em' or '%')."
                    );
                  var d = s.findIndex(function (e) {
                      return "transform" === e[0];
                    }),
                    A = function (e) {
                      return n + "(" + (0, e.tween)(a[0], a[1]) + ")";
                    };
                  if (-1 !== d) {
                    var p = s[d][1];
                    s[d][1] = function (e) {
                      return p(e) + " " + A(e);
                    };
                  } else s.push(["transform", A]);
                }
              }
            });
            var l = s.map(function (e) {
                return [
                  (e[0].startsWith("webkit") || e[0].startsWith("moz")
                    ? "-"
                    : "") + e[0].replace(/[A-Z]/g, "-$&").toLowerCase(),
                  e[1],
                ];
              }),
              c = l.length,
              u = {
                target: r,
                config: s,
                dashedPropertiesAsArray: l,
                callback: function (e, t) {
                  for (var n = 0; n < c; n++) {
                    var a = (0, f.A)(l[n], 2),
                      i = a[0],
                      o = a[1];
                    r.style.setProperty(
                      i,
                      o({
                        progress: e,
                        tween: t,
                      })
                    );
                  }
                },
              },
              d = a ? this.findSheetStack(a) : this.findSheet(n);
            d &&
              ("travel" === t
                ? d.travelAnimations.push(u)
                : d.stackingAnimations.push(u));
          },
          removeAnimationFromSheetOrStack: function (e) {
            var t = e.sheetId,
              n = e.stackId,
              a = e.type,
              r = e.element,
              i = n ? this.findSheetStack(n) : this.findSheet(t);
            if (i) {
              if ("travel" === a) {
                var o = i.travelAnimations.filter(function (e) {
                  return e.target !== r;
                });
                i.travelAnimations = o;
              } else {
                var s = i.stackingAnimations.filter(function (e) {
                  return e.target !== r;
                });
                i.stackingAnimations = s;
              }
            }
          },
          removeAllOutletPersistedStylesFromSheet: function (e) {
            var t = this.findSheet(e);
            t &&
              []
                .concat(
                  (0, p.A)(t.travelAnimations),
                  (0, p.A)(t.stackingAnimations)
                )
                .forEach(function (e) {
                  e.dashedPropertiesAsArray.forEach(function (t) {
                    var n = (0, f.A)(t, 1)[0];
                    e.target.style.removeProperty(n);
                  });
                });
          },
          removeAllOutletPersistedStylesFromStack: function (e) {
            var t = this.findSheetStack(e);
            t &&
              t.stackingAnimations.forEach(function (e) {
                e.dashedPropertiesAsArray.forEach(function (t) {
                  var n = (0, f.A)(t, 1)[0];
                  e.target.style.removeProperty(n);
                });
              });
          },
          getAggregatedStackingCallbackForSheetsBelow: function (e) {
            var t,
              n = this.findSheet(e);
            return (
              n &&
                (t = function (e) {
                  for (
                    var t = n.belowSheetsInStack, a = t.length, r = 0;
                    r < a;
                    r++
                  ) {
                    var i = t[r],
                      o = i.selfAndAboveTravelProgressSum[a - 1] + e,
                      s = es(o);
                    i.aggregatedStackingCallback(o, s);
                  }
                }),
              t
            );
          },
          automaticIslandElements: new Set([]),
          automaticLayerElements: new Set([]),
          automaticLayerAndIslandDetectionCleanup: null,
          focusContainmentRootElements: [],
          focusContainmentCleanup: function () {},
          escapeKeyDownListenerCleanup: null,
          clickOutsideListenerCleanup: null,
          processLayersAndIslandsChangesTimeout: null,
          setupAutomaticLayerAndIslandDetection: function (e) {
            var t = this,
              n = document.documentElement,
              a = document.body,
              r = function () {
                var r,
                  i = new Set([]),
                  o = new Set([]),
                  s = (function (e) {
                    for (var t = e.parentElement; t && t !== document.body; ) {
                      if (t.parentElement === document.body) return t;
                      t = t.parentElement;
                    }
                    return e.parentElement === document.body ? e : null;
                  })(e);
                r = s ? s.nextElementSibling : a.firstElementChild;
                for (
                  var l = function (e) {
                    return e.matches(
                      '[data-silk~="0ag"], [data-silk~="0ab"], [data-silk~="0aa"], [data-silk-clone]'
                    );
                  };
                  r;

                )
                  l(r) || "SCRIPT" === r.tagName || i.add(r),
                    (r = r.nextElementSibling);
                for (var c = n.children, u = 0; u < c.length; u++) {
                  var d = c[u];
                  "HEAD" === d.tagName ||
                    "BODY" === d.tagName ||
                    l(d) ||
                    o.add(d);
                }
                var A = new Set(
                    (0, p.A)(i).filter(function (e) {
                      return !t.automaticLayerElements.has(e);
                    })
                  ),
                  f = new Set(
                    (0, p.A)(t.automaticLayerElements).filter(function (e) {
                      return !i.has(e);
                    })
                  );
                t.automaticLayerElements = i;
                var m = new Set(
                    (0, p.A)(o).filter(function (e) {
                      return !t.automaticIslandElements.has(e);
                    })
                  ),
                  h = new Set(
                    (0, p.A)(t.automaticIslandElements).filter(function (e) {
                      return !o.has(e);
                    })
                  );
                (t.automaticIslandElements = o),
                  A.forEach(function (e) {
                    t.updateLayer({
                      automatic: !0,
                      layerId: null,
                      viewElement: e,
                      inertOutside: !1,
                      onPresentAutoFocus: {
                        focus: !1,
                      },
                      onDismissAutoFocus: {
                        focus: !1,
                      },
                      dismissOverlayIfNotAlertDialog: function () {},
                      onClickOutside: {
                        stopOverlayPropagation: !1,
                      },
                      onEscapeKeyDown: {
                        stopOverlayPropagation: !1,
                      },
                    });
                  }),
                  f.forEach(function (e) {
                    return t.removeLayer(null, e);
                  }),
                  m.forEach(function (e) {
                    return t.addIsland({
                      element: e,
                      automatic: !0,
                    });
                  }),
                  h.forEach(function (e) {
                    return t.removeIsland(null, e);
                  });
              };
            r();
            var i = new MutationObserver(function () {
              r();
            });
            i.observe(n, {
              childList: !0,
            }),
              i.observe(a, {
                childList: !0,
              }),
              (this.automaticLayerAndIslandDetectionCleanup = function () {
                var e = this;
                i.disconnect(),
                  this.layers.forEach(function (t) {
                    t.automatic && e.removeLayer(null, t.viewElement);
                  }),
                  (this.automaticLayerElements = new Set([])),
                  this.islands.forEach(function (t) {
                    t.automatic && e.removeIsland(null, t.element);
                  }),
                  (this.automaticIslandElements = new Set([])),
                  (this.automaticLayerAndIslandDetectionCleanup = null);
              });
          },
          moveFocusIfNecessary: function (e, t, n, a, r, i) {
            for (var o = !1, s = 0; s < t.length; s++)
              if (t[s].contains(document.activeElement)) {
                o = !0;
                break;
              }
            if (n.length) {
              var l = n.filter(function (e) {
                return !e.automatic && !e.external;
              });
              if (l.length) {
                var c = l[l.length - 1];
                return eY(c.layerId, c.viewElement, c.onPresentAutoFocus);
              }
            }
            if (r.length && !o) {
              var u = e[e.length - 1];
              if (!u.external)
                return eY(u.layerId, u.viewElement, u.onPresentAutoFocus);
            }
            if (
              a.length &&
              a.find(function (e) {
                return e.focusWasInside;
              })
            ) {
              var d = a[0];
              if (!d.external)
                return eX(
                  d.layerId,
                  d.viewElement,
                  d.onDismissAutoFocus,
                  d.elementFocusedLastBeforeShowing
                );
            }
            if (
              i.length &&
              i.find(function (e) {
                return e.focusWasInside;
              })
            ) {
              var A = e[e.length - 1];
              if (A) return eV(A.layerId, A.viewElement);
            }
          },
          processLayersAndIslandsChanges: function () {
            var e,
              t = this;
            clearTimeout(this.processLayersAndIslandsChangesTimeout);
            var n = function () {
              var e,
                n,
                a = t.layers.length,
                r = new Set([]);
              if (
                t.layers.some(function (e) {
                  return e.inertOutside;
                })
              ) {
                t.islands
                  .filter(function (e) {
                    return !e.componentId || 0 === e.componentId.length;
                  })
                  .forEach(function (e) {
                    return r.add(e.element);
                  });
                for (
                  var i = a - 1;
                  i >= 0 &&
                  0 !==
                    (function () {
                      var e = t.layers[i];
                      if (e.external && e.inertOutside)
                        return (r = new Set([])), 0;
                      r.add(e.viewElement);
                      var a = t.islands.filter(function (t) {
                          return (
                            t.componentId &&
                            e.layerContextId &&
                            t.componentId.includes(e.layerContextId)
                          );
                        }),
                        o = t.islands.filter(function (t) {
                          return (
                            t.componentId &&
                            e.layerStackContextId &&
                            t.componentId.includes(e.layerStackContextId)
                          );
                        });
                      if (
                        ([]
                          .concat((0, p.A)(a), (0, p.A)(o))
                          .forEach(function (e) {
                            r.add(e.element);
                          }),
                        e.inertOutside)
                      )
                        return (n = e), 0;
                      n = e;
                    })();
                  i--
                );
              }
              var o = (0, p.A)(r),
                s = !(function (e, t) {
                  if (e.length !== t.length) return !1;
                  var n,
                    a = new Set(),
                    r = en(e);
                  try {
                    for (r.s(); !(n = r.n()).done; ) {
                      var i = n.value;
                      a.add(i);
                    }
                  } catch (e) {
                    r.e(e);
                  } finally {
                    r.f();
                  }
                  var o,
                    s = en(t);
                  try {
                    for (s.s(); !(o = s.n()).done; ) {
                      var l = o.value;
                      if (!a.has(l)) return !1;
                    }
                  } catch (e) {
                    s.e(e);
                  } finally {
                    s.f();
                  }
                  return !0;
                })(t.focusContainmentRootElements, o);
              (t.focusContainmentRootElements = o),
                s &&
                  (t.focusContainmentCleanup(),
                  (t.focusContainmentCleanup = function () {}),
                  null === (e = t.automaticLayerAndIslandDetectionCleanup) ||
                    void 0 === e ||
                    e.call(t),
                  n &&
                    (t.setupAutomaticLayerAndIslandDetection(
                      null == n ? void 0 : n.viewElement
                    ),
                    (t.focusContainmentCleanup = e8({
                      rootElements: t.focusContainmentRootElements,
                      viewElement: null == n ? void 0 : n.viewElement,
                      elementFocusedLast: tp,
                      setElementFocusedLast: tm,
                    })))),
                t.moveFocusIfNecessary(
                  t.layers,
                  t.focusContainmentRootElements,
                  t.layersJustAdded,
                  t.layersJustRemoved,
                  t.layersJustWentToInertOutsideTrue,
                  t.islandsJustRemoved
                ),
                t.escapeKeyDownListenerCleanup &&
                  (t.escapeKeyDownListenerCleanup(),
                  (t.escapeKeyDownListenerCleanup = null)),
                t.clickOutsideListenerCleanup &&
                  (t.clickOutsideListenerCleanup(),
                  (t.clickOutsideListenerCleanup = null)),
                a > 0 &&
                  ((t.escapeKeyDownListenerCleanup = to(t.layers)),
                  (t.clickOutsideListenerCleanup = ta(t.layers, t.islands)));
              var l = t.layersJustRemoved.length;
              if (l)
                for (var c = 0; c < l; c++) {
                  var u = t.layersJustRemoved[c],
                    d = u.viewElement,
                    A = u.automatic;
                  d && !A && (ts(d), tl(d));
                }
              (t.islandsJustRemoved = []),
                (t.layersJustAdded = []),
                (t.layersJustRemoved = []),
                (t.layersJustWentToInertOutsideTrue = []);
            };
            (
              null ===
                (e = this.layersJustAdded[this.layersJustAdded.length - 1]) ||
              void 0 === e
                ? void 0
                : e.external
            )
              ? n()
              : (this.processLayersAndIslandsChangesTimeout = setTimeout(
                  n,
                  16
                ));
          },
          autoFocusTargets: [],
          addAutoFocusTarget: function (e) {
            var t = e.layerId,
              n = e.element,
              a = e.timing;
            this.autoFocusTargets.push({
              layerId: t,
              element: n,
              timing: a,
            });
          },
          removeAutoFocusTarget: function (e) {
            this.autoFocusTargets = this.autoFocusTargets.filter(function (t) {
              return t.element !== e;
            });
          },
          islands: [],
          islandsJustRemoved: [],
          addIsland: function (e) {
            var t,
              n = this.islands[this.islands.length - 1],
              a = (null !== (t = e.id) && void 0 !== t ? t : n) ? n.id + 1 : 0;
            return (
              this.islands.push(
                ei(
                  ei({}, e),
                  {},
                  {
                    id: a,
                  }
                )
              ),
              this.processLayersAndIslandsChanges(),
              a
            );
          },
          removeIsland: function (e, t) {
            var n = this;
            (this.islands = this.islands.filter(function (a) {
              if (
                (e && a.id && a.id !== e) ||
                (t && a.element && a.element !== t)
              )
                return !0;
              var r = a.element.contains(document.activeElement);
              return (
                n.islandsJustRemoved.push(
                  ei(
                    ei({}, a),
                    {},
                    {
                      focusWasInside: r,
                    }
                  )
                ),
                !1
              );
            })),
              this.processLayersAndIslandsChanges();
          },
          layers: [],
          layersJustAdded: [],
          layersJustRemoved: [],
          layersJustWentToInertOutsideTrue: [],
          updateLayer: function (e) {
            for (
              var t = e.layerId,
                n = e.viewElement,
                a = !1,
                r = this.layers,
                i = 0;
              i < r.length;
              i++
            ) {
              var o = r[i];
              if (null !== t ? o.layerId === t : o.viewElement === n) {
                var s = ei(ei({}, o), e);
                !o.inertOutside &&
                  e.inertOutside &&
                  this.layersJustWentToInertOutsideTrue.push(s),
                  (r[i] = s),
                  (a = !0);
                break;
              }
            }
            if (!a) {
              var l,
                c = ei(
                  ei({}, e),
                  {},
                  {
                    elementFocusedLastBeforeShowing:
                      null !== (l = e.elementFocusedLastBeforeShowing) &&
                      void 0 !== l
                        ? l
                        : document.activeElement,
                  }
                );
              r.push(c), this.layersJustAdded.push(c);
            }
            this.processLayersAndIslandsChanges();
          },
          removeLayer: function (e, t) {
            var n,
              a = this;
            (this.layers = this.layers.filter(function (n) {
              if (
                (e && n.layerId && n.layerId !== e) ||
                (t && n.viewElement && n.viewElement !== t)
              )
                return !0;
              var r,
                i =
                  null === (r = n.viewElement) || void 0 === r
                    ? void 0
                    : r.contains(document.activeElement);
              return (
                a.layersJustRemoved.push(
                  ei(
                    ei({}, n),
                    {},
                    {
                      focusWasInside: i,
                    }
                  )
                ),
                !1
              );
            })),
              0 ===
                this.layers.filter(function (e) {
                  return !e.automatic;
                }).length &&
                (null === (n = this.automaticLayerAndIslandDetectionCleanup) ||
                  void 0 === n ||
                  n.call(this)),
              this.processLayersAndIslandsChanges();
          },
          nativeFocusScrollPreventers: [],
          nativeFocusScrollPreventionCleanup: null,
          addNativeFocusScrollPreventer: function (e) {
            this.nativeFocusScrollPreventers.push({
              id: e,
            }),
              this.processNativeFocusScrollPreventersChanges();
          },
          removeNativeFocusScrollPreventer: function (e) {
            (this.nativeFocusScrollPreventers =
              this.nativeFocusScrollPreventers.filter(function (t) {
                return t.id !== e;
              })),
              this.processNativeFocusScrollPreventersChanges();
          },
          processNativeFocusScrollPreventersChanges: function () {
            var e,
              t = this.nativeFocusScrollPreventers.length;
            eQ() &&
              ("ios" === eu || "ipados" === eu) &&
              (t
                ? this.nativeFocusScrollPreventionCleanup ||
                  (this.nativeFocusScrollPreventionCleanup = tA())
                : (null === (e = this.nativeFocusScrollPreventionCleanup) ||
                    void 0 === e ||
                    e.call(this),
                  (this.nativeFocusScrollPreventionCleanup = null)));
          },
          fixedComponents: [],
          addFixedComponent: function (e) {
            this.fixedComponents.push(e);
          },
          updateFixedComponent: function (e) {
            var t = this.fixedComponents.find(function (t) {
              return t.id === e.id;
            });
            t &&
              (e.element && (t.element = e.element),
              e.initialInlineCSSTransform &&
                (t.initialInlineCSSTransform = e.initialInlineCSSTransform),
              "boolean" == typeof e.compensated &&
                (t.compensated = e.compensated));
          },
          removeFixedComponent: function (e) {
            this.fixedComponents = this.fixedComponents.filter(function (t) {
              return t.id !== e;
            });
          },
          findActualFixedComponentsInsideOutlet: function (e) {
            return this.fixedComponents.filter(function (t) {
              if (t.element && e)
                return (
                  e.contains(t.element) &&
                  "fixed" ===
                    window
                      .getComputedStyle(t.element)
                      .getPropertyValue("position")
                );
            });
          },
          themeColorMetaTag: null,
          underlyingThemeColor: null,
          themeColorDimmingOverlays: [],
          storeThemeColorMetaTag: function () {
            if (
              ((this.themeColorMetaTag =
                "undefined" != typeof document
                  ? document.querySelector('meta[name="theme-color"]')
                  : null),
              !this.themeColorMetaTag)
            ) {
              var e = document.createElement("meta");
              (e.name = "theme-color"),
                (e.content = window.getComputedStyle(
                  document.body
                ).backgroundColor),
                document.head.appendChild(e),
                (this.themeColorMetaTag = e);
            }
          },
          getAndStoreUnderlyingThemeColorAsRGBArray: function () {
            var e, t;
            return (
              this.themeColorDimmingOverlays.length > 0
                ? (e = this.underlyingThemeColor)
                : (this.themeColorMetaTag || this.storeThemeColorMetaTag(),
                  (e = ej(
                    null === (t = this.themeColorMetaTag) || void 0 === t
                      ? void 0
                      : t.content
                  )) ||
                    console.warn(
                      "`themeColorDimming` prop ignored: Only `theme-color` meta tag with a value in `rgb()`, `rgba()`, or hexadecimal format is supported."
                    ),
                  (this.underlyingThemeColor = e)),
              e
            );
          },
          updateUnderlyingThemeColor: function (e) {
            var t = ej(e);
            if (!t)
              throw Error(
                "The color provided to `updateThemeColor` doesn't match `rgb()`, `rgba()`, or hexadecimal format."
              );
            (this.underlyingThemeColor = t), this.setActualThemeColor();
          },
          setActualThemeColor: function () {
            var e;
            this.themeColorMetaTag || this.storeThemeColorMetaTag(),
              null === (e = this.themeColorMetaTag) ||
                void 0 === e ||
                e.setAttribute(
                  "content",
                  eN({
                    color: this.underlyingThemeColor,
                    overlays: this.themeColorDimmingOverlays,
                  })
                );
          },
          findThemeColorDimmingOverlay: function (e) {
            return this.themeColorDimmingOverlays.find(function (t) {
              return t.dimmingOverlayId === e;
            });
          },
          findIndexThemeColorDimmingOverlay: function (e) {
            return this.themeColorDimmingOverlays.findIndex(function (t) {
              return t.dimmingOverlayId === e;
            });
          },
          updateThemeColorDimmingOverlay: function (e) {
            var t = e;
            t.color &&
              (t = ei(
                ei({}, t),
                {},
                {
                  color: eR(t.color),
                }
              ));
            var n = this.findThemeColorDimmingOverlay(t.dimmingOverlayId);
            return (
              n
                ? Object.assign(n, t)
                : ((n = t), this.themeColorDimmingOverlays.push(t)),
              this.setActualThemeColor(),
              n
            );
          },
          updateThemeColorDimmingOverlayAlphaValue: function (e, t) {
            (e.alpha = t), this.setActualThemeColor();
          },
          removeThemeColorDimmingOverlay: function (e) {
            var t = this,
              n = this.findThemeColorDimmingOverlay(e);
            n &&
              ((n.abortRemoval = !1),
              setTimeout(function () {
                (null == n ? void 0 : n.abortRemoval) ||
                  ((t.themeColorDimmingOverlays =
                    t.themeColorDimmingOverlays.filter(function (t) {
                      return t.dimmingOverlayId !== e;
                    })),
                  t.setActualThemeColor(),
                  0 !== t.themeColorDimmingOverlays.length ||
                    ((t.underlyingThemeColor = null),
                    (t.themeColorMetaTag = null)));
              }, 20));
          },
        },
        tg = function (e) {
          var t = (0, b.useRef)(null);
          return (
            eo(function () {
              t.current = e;
            }),
            (0, b.useCallback)(function () {
              return t.current.apply(void 0, arguments);
            }, [])
          );
        },
        tv = function (e) {
          return "layout" === e ? eo : b.useEffect;
        },
        tb = function (e) {
          var t = null == e ? void 0 : e.lastIndexOf(":");
          return -1 === t ? "" : null == e ? void 0 : e.substring(t + 1);
        },
        ty = function (e) {
          var t = [],
            n = [];
          return (
            (function e(a, r, i) {
              var o = i.partOfInitial;
              Array.isArray(a)
                ? a.forEach(function (t) {
                    return e(t, r, {
                      partOfInitial: o,
                    });
                  })
                : ((r += (r ? "." : "") + a.name),
                  o && n.push(r + ":" + a.initial),
                  Object.entries(a.states).forEach(function (n) {
                    var i = (0, f.A)(n, 2),
                      s = i[0],
                      l = i[1],
                      c = r + ":" + s;
                    (l.machine = r),
                      (l.path = c),
                      (l.reactive = !a.silentOnly),
                      t.push(l),
                      l.machines &&
                        e(l.machines, c, {
                          partOfInitial: o && a.initial === s,
                        });
                  }));
            })(e, "", {
              partOfInitial: !0,
            }),
            [n, t]
          );
        },
        tC = function (e, t) {
          return e.includes(":")
            ? e
            : t.substring(0, t.lastIndexOf(":") + 1) + e;
        },
        tk = function (e) {
          var t = e.split("."),
            n = [];
          return (
            t.forEach(function (e, t) {
              var a = n[t - 1],
                r = (a ? a.full + "." : "") + e,
                i = r.substring(0, r.lastIndexOf(":")),
                o = r.substring(r.lastIndexOf(":") + 1);
              n.push({
                full: r,
                withoutState: i,
                state: o,
              });
            }),
            n
          );
        },
        tS = function (e) {
          var t = e.checkedPoolOfStates,
            n = e.referencePoolOfStates,
            a = e.callbackOnExclusion,
            r = e.callbackOnPresent;
          return t.filter(function (e) {
            var t = !0;
            return (
              e.forEach(function (i) {
                n.forEach(function (n) {
                  n.forEach(function (o) {
                    i.withoutState === o.withoutState &&
                      (i.state !== o.state
                        ? ((t = !1),
                          null == a ||
                            a({
                              decomposedCheckedState: e,
                              checkedStatePiece: i,
                              decomposedReferenceState: n,
                              referenceStatePiece: o,
                            }))
                        : r({
                            decomposedCheckedState: e,
                            checkedStatePiece: i,
                            decomposedReferenceState: n,
                            referenceStatePiece: o,
                          }));
                  });
                });
              }),
              t
            );
          });
        },
        tE = function (e) {
          var t = ty(e),
            n = (0, f.A)(t, 2),
            a = n[0],
            r = n[1];
          return [
            a,
            function (e, t) {
              var n,
                a = "string" == typeof t ? t : t.type,
                i = [];
              r.forEach(function (r) {
                e.includes(r.path) &&
                  (!t.machine || t.machine === r.machine) &&
                  r.messages &&
                  Object.entries(r.messages).forEach(function (o) {
                    var s = (0, f.A)(o, 2),
                      l = s[0],
                      c = s[1];
                    if (l === a) {
                      if ("string" == typeof c) (n = l), i.push(tC(c, r.path));
                      else {
                        var u,
                          d = en(c);
                        try {
                          for (d.s(); !(u = d.n()).done; ) {
                            var A = u.value;
                            if (!A.guard || A.guard(e, t)) {
                              (n = l), i.push(tC(A.target, r.path));
                              break;
                            }
                          }
                        } catch (e) {
                          d.e(e);
                        } finally {
                          d.f();
                        }
                      }
                    }
                  });
              });
              var o = e.map(function (e) {
                  return tk(e);
                }),
                s = i.map(function (e) {
                  return tk(e);
                }),
                l = [],
                c = tS({
                  checkedPoolOfStates: o,
                  referencePoolOfStates: s,
                  callbackOnExclusion: function (e) {
                    var t = e.decomposedCheckedState;
                    l.push(t[t.length - 1].full);
                  },
                  callbackOnPresent: function (e) {
                    e.referenceStatePiece.unchanged = !0;
                  },
                }).map(function (e) {
                  return e[e.length - 1].full;
                }),
                u = [],
                d = [];
              s.forEach(function (e) {
                e.forEach(function (t, n) {
                  if (!t.unchanged) {
                    n < e.length - 1 && u.push(t.full);
                    var a,
                      i,
                      o = r.find(function (e) {
                        return e.path === t.full;
                      });
                    null === (a = o.machines) ||
                      void 0 === a ||
                      null === (i = a.forEach) ||
                      void 0 === i ||
                      i.call(a, function (t) {
                        var a = function () {
                          s.find(function (e) {
                            return e.find(function (e) {
                              return (
                                e.withoutState ===
                                "".concat(o.path, ".").concat(t.name)
                              );
                            });
                          }) ||
                            d.push(
                              ""
                                .concat(o.path, ".")
                                .concat(t.name, ":")
                                .concat(t.initial)
                            );
                        };
                        n < e.length - 1
                          ? o.path + t.name !== e[n + 1].withoutState && a()
                          : a(),
                          (function e(t) {
                            var n, a;
                            null ===
                              (n = r.find(function (e) {
                                return e.path === t;
                              }).machines) ||
                              void 0 === n ||
                              null === (a = n.forEach) ||
                              void 0 === a ||
                              a.call(n, function (n) {
                                s.find(function (e) {
                                  return e.find(function (e) {
                                    return (
                                      e.withoutState ===
                                      "".concat(o.path, ".").concat(n.name)
                                    );
                                  });
                                }) ||
                                  d.push(
                                    ""
                                      .concat(t, ".")
                                      .concat(n.name, ":")
                                      .concat(n.initial)
                                  ),
                                  e(
                                    ""
                                      .concat(t, ".")
                                      .concat(n.name, ":")
                                      .concat(n.initial)
                                  );
                              });
                          })(
                            ""
                              .concat(o.path, ".")
                              .concat(t.name, ":")
                              .concat(t.initial)
                          );
                      });
                  }
                });
              });
              var A = [].concat(i, u, d),
                m = [].concat((0, p.A)(c), (0, p.A)(A)),
                h = [].concat(l, (0, p.A)(A)),
                g = r
                  .filter(function (e) {
                    return h.includes(e.path);
                  })
                  .some(function (e) {
                    return e.reactive;
                  });
              return {
                exitedStates: l,
                transitionTaken: n,
                enteredStates: A,
                nextStates: m,
                reactive: g,
              };
            },
          ];
        },
        tx = function (e, t) {
          return null == e
            ? void 0
            : e
                .toStrings()
                .filter(function (e) {
                  return null == e ? void 0 : e.startsWith(t);
                })
                .filter(function (e) {
                  var n;
                  return !(null ===
                    (n = null == e ? void 0 : e.slice(t.length)) || void 0 === n
                    ? void 0
                    : n.includes("."));
                })[0];
        },
        tw = function (e) {
          var t = (0, b.useMemo)(
              function () {
                return tE(e);
              },
              [e]
            ),
            n = (0, f.A)(t, 2),
            a = n[0],
            r = n[1],
            i = (0, b.useRef)(),
            o = (0, b.useRef)([]),
            s = (0, b.useRef)([]),
            l = (0, b.useRef)([]),
            c = (0, b.useRef)([]),
            u = (0, b.useRef)(a),
            d = (0, b.useRef)({
              toStrings: function () {
                return a;
              },
              matches: function (e) {
                return tO(a, e);
              },
              lastMessageTreatedRef: i,
              exitActionsRef: o,
              transitionActionsRef: s,
              entryActionsRef: l,
              selectorsRef: c,
            }),
            A = (0, b.useState)(
              ei(
                ei({}, d.current),
                {},
                {
                  silent: d.current,
                }
              )
            ),
            p = (0, f.A)(A, 2),
            m = p[0],
            h = p[1],
            g = (0, b.useRef)([]);
          return [
            m,
            (0, b.useCallback)(
              function (e) {
                g.current.push(e),
                  1 === g.current.length &&
                    (function e(t) {
                      var n = r(u.current, g.current[0]),
                        a = n.nextStates,
                        A = n.exitedStates,
                        f = n.transitionTaken,
                        p = n.enteredStates,
                        m = n.reactive,
                        v = u.current;
                      if (
                        ((u.current = a),
                        o.current.forEach(function (e) {
                          A.includes(e.state) &&
                            ("function" == typeof e.guard
                              ? e.guard(v, g.current[0])
                              : e.guard) &&
                            e.callback(g.current[0], e.params);
                        }),
                        s.current.forEach(function (e) {
                          A.includes(e.state) &&
                            e.transition === f &&
                            ("function" == typeof e.guard
                              ? e.guard(v, g.current[0])
                              : e.guard) &&
                            e.callback(g.current[0], e.params);
                        }),
                        l.current.forEach(function (e) {
                          p.includes(e.state) &&
                            ("function" == typeof e.guard
                              ? e.guard(v, g.current[0])
                              : e.guard) &&
                            e.callback(g.current[0], e.params);
                        }),
                        (i.current =
                          "string" == typeof g.current[0]
                            ? {
                                type: g.current[0],
                              }
                            : g.current[0]),
                        g.current.shift(),
                        g.current.length)
                      )
                        e(m || t);
                      else {
                        var b = a.slice();
                        (d.current.toStrings = function () {
                          return b;
                        }),
                          (d.current.matches = function (e) {
                            return tO(b, e);
                          }),
                          (d.current.getValues = function () {
                            return [tb(b.toStrings)];
                          }),
                          c.current.forEach(function (e) {
                            var t = e.current.selection;
                            (e.current.toStrings = function () {
                              return [tx(d.current, t)];
                            }),
                              (e.current.matches = function (e) {
                                return tO([tx(d.current, t)], e);
                              }),
                              (e.current.getValues = function () {
                                return [tb(tx(d.current, t))];
                              });
                          }),
                          (t || m) &&
                            h(
                              ei(
                                ei({}, d.current),
                                {},
                                {
                                  silent: d.current,
                                }
                              )
                            );
                      }
                    })();
              },
              [r]
            ),
          ];
        },
        tT = function (e, t, n) {
          var a =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {
                    delay: null,
                  },
            r = a.message,
            i = a.delay,
            o = void 0 === i ? null : i,
            s = (0, A.A)(a, y);
          (0, b.useEffect)(
            function () {
              var a;
              return (
                t.matches(n) &&
                  (a = setTimeout(
                    function () {
                      return e(
                        ei(
                          {
                            type: "",
                          },
                          s
                        )
                      );
                    },
                    null != o ? o : 0
                  )),
                function () {
                  a && clearTimeout(a);
                }
              );
            },
            [t, n, o, e, void 0 === r ? "" : r, s]
          );
        },
        tP = function (e, t) {
          var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          n.shallow;
          var a = (0, b.useMemo)(
              function () {
                return tx(e, t);
              },
              [e, t]
            ),
            r = (0, b.useRef)({
              lastMessageTreatedRef:
                null == e ? void 0 : e.lastMessageTreatedRef,
              exitActionsRef: null == e ? void 0 : e.exitActionsRef,
              transitionActionsRef: null == e ? void 0 : e.transitionActionsRef,
              entryActionsRef: null == e ? void 0 : e.entryActionsRef,
              toStrings: function () {
                return [a];
              },
              matches: function (e) {
                return tO([a], e);
              },
              selection: t,
              getValues: function () {
                return [tb(a)];
              },
            }),
            i = (0, b.useRef)(Symbol());
          return (
            eo(function () {
              e.selectorsRef.current.find(function (e) {
                return e.id === i.current;
              }) || e.selectorsRef.current.push(r);
            }, []),
            (0, b.useMemo)(
              function () {
                return ei(
                  ei({}, r.current),
                  {},
                  {
                    silent: r.current,
                  }
                );
              },
              [a]
            )
          );
        },
        tO = function (e, t) {
          return Array.isArray(t)
            ? t.some(function (t) {
                return e.includes(t);
              }) ||
                e.some(function (e) {
                  return t.some(function (t) {
                    return (
                      (null == e ? void 0 : e.startsWith(t)) &&
                      (null == e ? void 0 : e.charAt(t.length)) === "."
                    );
                  });
                })
            : e.includes(t) ||
                e.some(function (e) {
                  return (
                    (null == e ? void 0 : e.startsWith(t)) &&
                    (null == e ? void 0 : e.charAt(t.length)) === "."
                  );
                });
        },
        tD = function (e, t, n) {
          var a = n.state,
            r = n.callback,
            i = n.params,
            o = n.empty,
            s = void 0 !== o && o,
            l = !n.hasOwnProperty("guard") || n.guard,
            c = (0, b.useMemo)(
              function () {
                return i ? Object.values(i) : [];
              },
              [i]
            ),
            u = (0, b.useMemo)(
              function () {
                return t.entryActionsRef;
              },
              [t]
            ),
            d = tv("before-paint" === e ? "layout" : "normal"),
            A = tg(function (e) {
              (((null == e ? void 0 : e.matches) &&
                (null == e ? void 0 : e.matches(a))) ||
                (!(null == e ? void 0 : e.matches) && tO(e, a))) &&
                (("function" == typeof l && l()) ||
                  ("function" != typeof l && l)) &&
                r(e.lastMessageTreatedRef.current, i);
            }),
            f = (0, b.useRef)(Symbol());
          d(
            function () {
              if (!s) {
                if ("immediate" === e) {
                  var n = {
                      id: f.current,
                      state: a,
                      guard: l,
                      callback: r,
                      params: i,
                    },
                    o = u.current.findIndex(function (e) {
                      return e.id === f.current;
                    });
                  -1 === o ? u.current.push(n) : (u.current[o] = n);
                } else A(t);
              }
            },
            "immediate" === e ? [e, a, l, r, u].concat((0, p.A)(c)) : [e, A, t]
          ),
            (0, b.useEffect)(function () {
              return function () {
                u.current = u.current.filter(function (e) {
                  return e.id !== f.current;
                });
              };
            }, []);
        },
        tI = function (e, t) {
          var n = t.state,
            a = t.transition,
            r = t.callback,
            i = t.params,
            o = !t.hasOwnProperty("guard") || t.guard,
            s = (0, b.useMemo)(
              function () {
                return i ? Object.values(i) : [];
              },
              [i]
            ),
            l = (0, b.useMemo)(
              function () {
                return e.transitionActionsRef;
              },
              [e]
            ),
            c = (0, b.useRef)(Symbol());
          (0, b.useEffect)(function () {
            var e = {
                id: c.current,
                state: n,
                transition: a,
                guard: o,
                callback: r,
                params: i,
              },
              t = l.current.findIndex(function (e) {
                return e.id === c.current;
              });
            -1 === t ? l.current.push(e) : (l.current[t] = e);
          }, [n, a, o, r, l].concat((0, p.A)(s))),
            (0, b.useEffect)(function () {
              return function () {
                l.current = l.current.filter(function (e) {
                  return e.id !== c.current;
                });
              };
            }, []);
        },
        tR = function (e, t, n) {
          var a = n.state,
            r = n.callback,
            i = n.params,
            o = !n.hasOwnProperty("guard") || n.guard,
            s = (0, b.useMemo)(
              function () {
                return i ? Object.values(i) : [];
              },
              [i]
            ),
            l = (0, b.useMemo)(
              function () {
                return t.exitActionsRef;
              },
              [t]
            ),
            c = tv("before-paint" === e ? "layout" : "normal"),
            u = tg(function (e) {
              (((null == e ? void 0 : e.matches) &&
                (null == e ? void 0 : e.matches(a))) ||
                (!(null == e ? void 0 : e.matches) && tO(e, a))) &&
                (("function" == typeof o && o()) ||
                  ("function" != typeof o && o)) &&
                r(e.lastMessageTreatedRef.current, i);
            }),
            d = (0, b.useRef)(Symbol());
          c(
            function () {
              if ("immediate" === e) {
                var n = {
                    id: d.current,
                    state: a,
                    guard: o,
                    callback: r,
                    params: i,
                  },
                  s = l.current.findIndex(function (e) {
                    return e.id === d.current;
                  });
                -1 === s ? l.current.push(n) : (l.current[s] = n);
              }
              return function () {
                "immediate" !== e && u(t);
              };
            },
            "immediate" === e ? [e, a, o, r, l].concat((0, p.A)(s)) : [e, u, t]
          ),
            (0, b.useEffect)(function () {
              return function () {
                l.current = l.current.filter(function (e) {
                  return e.id !== d.current;
                });
              };
            }, []);
        },
        tj = function (e, t, n) {
          var a = n.state,
            r = n.callback,
            i = n.params,
            o = (n.name, !n.hasOwnProperty("guard") || n.guard),
            s = i ? Object.values(i) : [],
            l = "string" == typeof e ? e : e.start,
            c = "string" == typeof e ? e : e.update,
            u = (0, b.useRef)(null);
          tD("immediate", t, {
            state: a,
            guard: o,
            callback: (0, b.useCallback)(
              function () {
                u.current = r(null, i);
              },
              [r, i]
            ),
            params: i,
            empty: "immediate" !== l,
          });
          var d = tv("before-paint" === c ? "layout" : "normal"),
            A = (0, b.useRef)(!1);
          d(function () {
            var e,
              n =
                ((null == t ? void 0 : t.matches) &&
                  (null == t ? void 0 : t.matches(a))) ||
                (!(null == t ? void 0 : t.matches) && tO(t, a)) ||
                "" === a,
              s =
                ("function" == typeof o && o()) ||
                ("function" != typeof o && o);
            return (
              n &&
                s &&
                (e =
                  "immediate" === l
                    ? A.current
                      ? r(null, i)
                      : u.current
                    : r(null, i)),
              n && !A.current && (A.current = !0),
              function () {
                var n;
                (null === (n = t.silent) || void 0 === n
                  ? void 0
                  : n.matches(a)) || ((A.current = !1), (u.current = null)),
                  null == e || e();
              }
            );
          }, ["" !== a ? t : null, a, o, r].concat((0, p.A)(s)));
        },
        tN = function (e) {
          var t = (0, b.useRef)({
              value: e,
            }),
            n = (0, b.useState)({
              value: e,
              silent: t.current,
            }),
            a = (0, f.A)(n, 2),
            r = a[0],
            i = a[1];
          return [
            r,
            (0, b.useCallback)(function (e) {
              var n = "function" == typeof e ? e(t.current.value) : e;
              (t.current.value = n),
                i({
                  value: n,
                  silent: t.current,
                });
            }, []),
          ];
        };
      function tM() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return function (e) {
          return t.forEach(function (t) {
            "function" == typeof t ? t(e) : null != t && (t.current = e);
          });
        };
      }
      function tB() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return (0, b.useCallback)(tM.apply(void 0, t), t);
      }
      var tF = function (e, t) {
          var n = function () {
              null == t || t();
            },
            a = function (e) {
              e.preventDefault(),
                window.addEventListener("touchend", n, {
                  once: !0,
                });
            },
            r = e.current;
          return (
            r.addEventListener("touchstart", a, {
              passive: !1,
            }),
            function () {
              r &&
                (r.removeEventListener("touchstart", a, {
                  passive: !1,
                }),
                window.removeEventListener("touchend", n));
            }
          );
        },
        tL = !1,
        tQ = 0;
      function tU(e) {
        if (void 0 !== b.useId) {
          var t,
            n = (0, b.useId)();
          return null != e ? e : n;
        }
        var a = (0, b.useState)(null != e ? e : tL ? ++tQ : null),
          r = (0, f.A)(a, 2),
          i = r[0],
          o = r[1];
        return (
          eo(function () {
            null === i && o(++tQ);
          }, []),
          (0, b.useEffect)(function () {
            !1 === tL && (tL = !0);
          }, []),
          null !== (t = null != e ? e : i) && void 0 !== t ? t : void 0
        );
      }
      var tW = (0, b.forwardRef)(function (e, t) {
        var n = e.children,
          a = (0, A.A)(e, C),
          r = b.Children.toArray(n),
          i = r.find(tV);
        if (i) {
          var o = i.props.children,
            s = r.map(function (e) {
              return e !== i
                ? e
                : b.Children.count(o) > 1
                ? b.Children.only(null)
                : (0, b.isValidElement)(o)
                ? o.props.children
                : null;
            });
          return (0, g.jsx)(
            tG,
            ei(
              ei({}, a),
              {},
              {
                ref: t,
                children: (0, b.isValidElement)(o)
                  ? (0, b.cloneElement)(o, void 0, s)
                  : null,
              }
            )
          );
        }
        return (0, g.jsx)(
          tG,
          ei(
            ei({}, a),
            {},
            {
              ref: t,
              children: n,
            }
          )
        );
      });
      tW.displayName = "Slot.Root";
      var tG = (0, b.forwardRef)(function (e, t) {
        var n,
          a,
          r,
          i = e.children,
          o = (0, A.A)(e, k),
          s =
            (r =
              null === (n = Object.getOwnPropertyDescriptor(i.props, "ref")) ||
              void 0 === n
                ? void 0
                : n.get) &&
            "isReactWarning" in r &&
            r.isReactWarning
              ? i.ref
              : (r =
                  null === (a = Object.getOwnPropertyDescriptor(i, "ref")) ||
                  void 0 === a
                    ? void 0
                    : a.get) &&
                "isReactWarning" in r &&
                r.isReactWarning
              ? i.props.ref
              : i.props.ref || i.ref;
        return (0, b.isValidElement)(i)
          ? (0, b.cloneElement)(
              i,
              ei(
                ei(
                  {},
                  (function (e, t) {
                    var n = ei({}, t);
                    for (var a in t)
                      !(function () {
                        var r = e[a],
                          i = t[a];
                        /^on[A-Z]/.test(a)
                          ? r && i
                            ? (n[a] = function () {
                                i.apply(void 0, arguments),
                                  r.apply(void 0, arguments);
                              })
                            : r && (n[a] = r)
                          : "style" === a
                          ? (n[a] = ei(ei({}, r), i))
                          : "className" === a &&
                            (n[a] = [r, i].filter(Boolean).join(" "));
                      })();
                    return ei(ei({}, e), n);
                  })(o, i.props)
                ),
                {},
                {
                  ref: t ? tM(t, s) : s,
                }
              )
            )
          : b.Children.count(i) > 1
          ? b.Children.only(null)
          : null;
      });
      tG.displayName = "Slot.Anonymous";
      var t_ = function (e) {
        var t = e.children;
        return (0, g.jsx)(g.Fragment, {
          children: t,
        });
      };
      function tV(e) {
        return (0, b.isValidElement)(e) && e.type === t_;
      }
      var tY = 0,
        tX = [0, 0],
        tz = !1,
        tH = function () {
          clearTimeout(a),
            (tz = !0),
            (a = setTimeout(function () {
              return (tz = !1);
            }, 50));
        },
        tK = function () {
          var e;
          tz || (e = window).scrollTo.apply(e, (0, p.A)(tX));
        },
        tq = b.forwardRef(function (e, t) {
          var n = e.asChild,
            a = e.active,
            r = void 0 === a || a,
            i = e.automaticallyDisabledForOptimisation,
            o = e.axis,
            s = e.preventBodyScroll,
            l = e.children,
            c = e["data-silk"],
            u = e.className,
            d = (0, A.A)(e, S),
            f = null == c ? void 0 : c.includes("0ae"),
            p = (0, b.useRef)(null),
            m = tB(p, t);
          eo(
            function () {
              if (((tX = [window.screenX, window.scrollY]), r && s)) {
                if (0 === tY) {
                  var e = window.innerWidth,
                    t = document.documentElement.clientWidth,
                    n = window.innerHeight,
                    a = document.documentElement.clientHeight;
                  document.body.style.setProperty("overflow", "hidden");
                  var i = "".concat(e - t, "px"),
                    o = "".concat(n - a, "px");
                  document
                    .querySelectorAll("[data-silk~='0al']")
                    .forEach(function (e) {
                      e.style.setProperty(
                        "--x-collapsed-scrollbar-thickness",
                        i
                      ),
                        e.style.setProperty(
                          "--y-collapsed-scrollbar-thickness",
                          o
                        );
                    }),
                    document.body.style.setProperty("padding-right", i),
                    document.body.style.setProperty("padding-bottom", o),
                    window.addEventListener("resize", tH),
                    window.addEventListener("scroll", tK, {
                      passive: !1,
                    }),
                    tY++;
                } else tY++;
              }
              return function () {
                if (r && s && 0 == --tY) {
                  var e = document.querySelectorAll("[data-silk~='0al']");
                  document.body.style.removeProperty("overflow"),
                    e.forEach(function (e) {
                      e.style.removeProperty(
                        "--x-collapsed-scrollbar-thickness"
                      ),
                        e.style.removeProperty(
                          "--y-collapsed-scrollbar-thickness"
                        );
                    }),
                    document.body.style.removeProperty("padding-right"),
                    document.body.style.removeProperty("padding-bottom"),
                    window.removeEventListener("scroll", tK),
                    window.removeEventListener("resize", tH);
                }
              };
            },
            [s, r]
          ),
            (0, b.useEffect)(
              function () {
                var e,
                  t = p.current;
                return (
                  !f &&
                    r &&
                    t &&
                    (e = new ResizeObserver(function (e) {
                      e.forEach(function () {
                        t.scrollTo(300, 300);
                      });
                    })).observe(t, {
                      box: "border-box",
                    }),
                  function () {
                    !f && r && t && e && (e.unobserve(t), e.disconnect());
                  }
                );
              },
              [r, f]
            );
          var h = (0, b.useCallback)(function (e) {
              var t = e.currentTarget;
              t.scrollTo(300, 300),
                ("ios" !== eu && "ipados" !== eu) ||
                  CSS.supports("overscroll-behavior: contain") ||
                  (t.style.setProperty("overflow", "hidden"),
                  setTimeout(function () {
                    t.style.setProperty("overflow", "auto");
                  }, 10));
            }, []),
            v = n ? tW : "div",
            y = eh("ScrollTrap", {
              active: r,
              automaticallyDisabledForOptimisation: void 0 === i || i,
              axis: void 0 === o ? "both" : o,
            });
          return (0, g.jsx)(
            v,
            ei(
              ei(
                ei(
                  {},
                  y(
                    "root",
                    ["active", "automaticallyDisabledForOptimisation", "axis"],
                    {
                      className: u,
                      dataSilk: [c, "0ac", "0ae"],
                    }
                  )
                ),
                {},
                {
                  onScroll: f ? void 0 : h,
                },
                d
              ),
              {},
              {
                ref: m,
                children: l,
              }
            )
          );
        });
      tq.displayName = "Sheet.Anonymous";
      var tZ = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.className,
          r = e.dataSilk,
          i = e.children,
          o = (0, A.A)(e, E),
          s = n ? tW : "div",
          l = eh("ScrollTrap", {});
        return (0, g.jsx)(
          s,
          ei(
            ei(
              ei(
                {},
                l("stabiliser", [], {
                  className: a,
                  dataSilk: [r],
                })
              ),
              o
            ),
            {},
            {
              ref: t,
              children: i,
            }
          )
        );
      });
      tZ.displayName = "Sheet.DDD";
      var tJ = {
          Root: tq,
          Stabiliser: tZ,
        },
        t$ = function () {
          var e = tU();
          return (0, b.useCallback)(
            function (t) {
              t
                ? th.addFixedComponent({
                    id: e,
                    element: t,
                  })
                : th.removeFixedComponent(e);
            },
            [e]
          );
        },
        t0 = b.forwardRef(function (e, t) {
          var n = e.asChild,
            a = e.children,
            r = e.className,
            i = e["data-silk"],
            o = (0, A.A)(e, x),
            s = tB(t$(), t),
            l = eh("Fixed", {});
          return (0, g.jsx)(
            tJ.Root,
            ei(
              ei(
                ei(
                  {},
                  l("root", [], {
                    className: r,
                    dataSilk: [i, "0al"],
                  })
                ),
                {},
                {
                  asChild: n,
                },
                o
              ),
              {},
              {
                ref: s,
                children: a,
              }
            )
          );
        });
      t0.displayName = "Fixed.Root";
      var t1 = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.children,
          r = (0, A.A)(e, w);
        return (0, g.jsx)(
          tJ.Stabiliser,
          ei(
            ei(
              {
                asChild: n,
              },
              r
            ),
            {},
            {
              ref: t,
              children: a,
            }
          )
        );
      });
      t1.displayName = "Fixed.Content";
      var t2 = {
          Root: t0,
          Content: t1,
        },
        t5 = b.createContext(null);
      t5.displayName = "Sheet.GenericContext";
      var t3 = b.createContext(null);
      t3.displayName = "Sheet.Anonymous";
      var t4 = function (e) {
          var t = "cubic-bezier(";
          if (!e.startsWith(t)) return null;
          var n = e
            .slice(t.length, -1)
            .split(",")
            .map(function (e) {
              return parseFloat(e.trim());
            });
          return 4 !== n.length || n.some(isNaN) ? null : n;
        },
        t8 = function (e) {
          for (
            var t = e.mass,
              n = e.stiffness,
              a = e.damping,
              r = e.initialVelocity,
              i = e.fromPosition,
              o = e.toPosition,
              s = e.precision,
              l = [],
              c = 0,
              u = Math.abs(o - i),
              d = 0,
              A = void 0 === r ? 0 : r,
              f = !1,
              p = !1,
              m = -(1e-6 * n),
              h = -(0.001 * a),
              g = s / 22,
              v = 10 * s;
            !(f && p);

          ) {
            var b = (m * (d - u) + h * A) / t;
            (A += b),
              (d += A),
              (f = Math.abs(A) <= g),
              (p = Math.abs(u - d) <= v);
            var y = d / u;
            l.push(y), c++;
          }
          return {
            progressValuesArray: l,
            duration: c,
          };
        },
        t9 = function () {
          return (
            CSS.supports("transition-timing-function", "linear(0, 1)") && !eQ()
          );
        },
        t7 = function (e) {
          var t,
            n,
            a,
            r,
            i,
            o,
            s,
            l,
            c,
            u,
            d = e.origin,
            A = e.destination,
            f = e.animationConfig,
            m = [];
          if (f && f.easing && "spring" !== f.easing) {
            if ("linear" === f.easing)
              for (
                var h = (u =
                    null !== (o = f.duration) && void 0 !== o ? o : 250),
                  g = 1 / (h - 1),
                  v = 0;
                v < h;
                v++
              ) {
                var b = v * g;
                m.push(isNaN(b) ? 0 : b);
              }
            else {
              var y,
                C = (u = null !== (s = f.duration) && void 0 !== s ? s : 250);
              y =
                "ease" === f.easing
                  ? [0.25, 0.1, 0.25, 1]
                  : "ease-in" === f.easing
                  ? [0.42, 0, 1, 1]
                  : "ease-out" === f.easing
                  ? [0, 0, 0.58, 1]
                  : "ease-in-out" === f.easing
                  ? [0.42, 0, 0.58, 1]
                  : f.easing.startsWith("cubic-bezier") &&
                    null !== (l = t4(f.easing)) &&
                    void 0 !== l
                  ? l
                  : [0.25, 0.1, 0.25, 1];
              for (var k = ek.apply(void 0, (0, p.A)(y)), S = 0; S <= C; S++)
                m.push(k(S / C));
            }
          } else {
            var E = t8({
              stiffness:
                null !== (t = null == f ? void 0 : f.stiffness) && void 0 !== t
                  ? t
                  : 300,
              damping:
                null !== (n = null == f ? void 0 : f.damping) && void 0 !== n
                  ? n
                  : 34,
              mass:
                null !== (a = null == f ? void 0 : f.mass) && void 0 !== a
                  ? a
                  : 1,
              initialVelocity:
                null !== (r = null == f ? void 0 : f.initialVelocity) &&
                void 0 !== r
                  ? r
                  : 0,
              precision:
                null !== (i = null == f ? void 0 : f.precision) && void 0 !== i
                  ? i
                  : 0.1,
              fromPosition: void 0 === d ? 0 : d,
              toPosition: void 0 === A ? 1 : A,
            });
            (m = E.progressValuesArray), (u = E.duration);
          }
          return {
            progressValuesArray: m,
            easing: "linear",
            duration: u,
            delay:
              null !== (c = null == f ? void 0 : f.delay) && void 0 !== c
                ? c
                : 0,
          };
        },
        t6 = function (e, t) {
          var n = {};
          return (
            e.forEach(function (e) {
              var a = (0, f.A)(e, 2),
                r = a[0],
                i = a[1],
                o = es(t);
              n[r] = i({
                progress: t,
                tween: o,
              });
            }),
            n
          );
        },
        ne = function (e) {
          var t = e.type,
            n = e.progressValuesArray,
            a = e.target,
            r = e.templatesPerProperty,
            i = e.reversedStackingIndex,
            o = e.selfAndAboveTravelProgressSum,
            s = null != i,
            l = function (e) {
              return "travel" === t
                ? e
                : s && o
                ? (null == o ? void 0 : o[i]) + e
                : 0;
            };
          return {
            target: a,
            keyframes: t9()
              ? [t6(r, l(n[0])), t6(r, l(n[n.length - 1]))]
              : n.map(function (e) {
                  return t6(r, l(e));
                }),
          };
        },
        nt = function (e) {
          var t,
            n,
            a = e.sheetId,
            r = e.destinationDetent,
            i = e.setSegment,
            o = e.viewElement,
            s = e.scrollContainer,
            l = e.travellingElement,
            c = e.contentPlacement,
            u = e.positionToScrollTo,
            A = e.scrollAxis,
            m = e.animationConfig,
            g = e.onTravel,
            v = e.onTravelStart,
            b = e.onTravelEnd,
            y = e.runOnTravelStart,
            C = e.rAFLoopEndCallback,
            k = e.dimensions,
            S = e.trackToTravelOn,
            E = th.findSheet(a);
          if (E) {
            var x,
              w = [],
              T = [];
            (w = E.travelAnimations),
              E.belowSheetsInStack.forEach(function (e) {
                T.push.apply(
                  T,
                  (0, p.A)(
                    e.stackingAnimations.map(function (t) {
                      return ei(
                        ei({}, t),
                        {},
                        {
                          reversedStackingIndex:
                            E.belowSheetsInStack.length - 1,
                          selfAndAboveTravelProgressSum:
                            e.selfAndAboveTravelProgressSum,
                        }
                      );
                    })
                  )
                );
              }),
              y && (null == v || v());
            var P = !(m.hasOwnProperty("contentMove") && !m.contentMove),
              O = k.current.view.travelAxis.unitless,
              D = k.current.content.travelAxis.unitless,
              I = o.getBoundingClientRect(),
              R = l.getBoundingClientRect(),
              j = "center" !== c ? D : D + (O - D) / 2,
              N = R.top - I.top,
              M = R.left - I.left,
              B = 0;
            switch (S) {
              case "top":
                B = N + j;
                break;
              case "bottom":
                B = N - j;
                break;
              case "left":
                B = M + j;
                break;
              case "right":
                B = M - j;
            }
            var F = Math.max(Math.abs(B) / j, 0),
              L = k.current.progressValueAtDetents[r].exact,
              Q = L * j,
              U = "left" === S || "top" === S ? Q : -Q,
              W = t7({
                origin: B,
                destination: U,
                animationConfig: m,
              }),
              G = W.progressValuesArray,
              _ = W.easing,
              V = W.duration,
              Y = W.delay,
              X = L - F,
              z = (function (e, t) {
                for (var n = [], a = 0; a < e.length - 1; a += 8) n.push(e[a]);
                return e.length % 8 != 0 && n.push(e[e.length - 1]), n;
              })(G, 0),
              H = z.map(function (e) {
                return F + X * e;
              }),
              K = [];
            w.length &&
              (null == K ||
                K.push.apply(
                  K,
                  (0, p.A)(
                    w.map(function (e) {
                      return ne({
                        type: "travel",
                        progressValuesArray: H,
                        target: e.target,
                        templatesPerProperty: e.config,
                      });
                    })
                  )
                )),
              T.length &&
                (null == K ||
                  K.push.apply(
                    K,
                    (0, p.A)(
                      T.map(function (e) {
                        return ne({
                          type: "stacking",
                          progressValuesArray: H,
                          target: e.target,
                          templatesPerProperty: e.config,
                          reversedStackingIndex: e.reversedStackingIndex,
                          selfAndAboveTravelProgressSum:
                            e.selfAndAboveTravelProgressSum,
                        });
                      })
                    )
                  )),
              (t = "x" === A ? "X" : "Y");
            var q = function (e) {
              return {
                transform: "translate" + t + "(" + (B - U) * (1 - e) + "px)",
              };
            };
            n = t9()
              ? [q(z[0]), q(z[z.length - 1])]
              : z.map(function (e) {
                  return {
                    transform:
                      "translate" + t + "(" + (B - U) * (1 - e) + "px)",
                  };
                });
            var Z = function () {
                s.scrollTo({
                  left: "x" === A ? u : 0,
                  top: "y" === A ? u : 0,
                });
              },
              J = function (e) {
                var t;
                if (!P) return e();
                (t = t9()
                  ? l.animate(n, {
                      easing: "linear(" + z.join(",") + ")",
                      duration: V,
                      delay: Y,
                    })
                  : l.animate(n, {
                      easing: _,
                      duration: V,
                      delay: Y,
                    })).addEventListener("finish", function n() {
                  e(), t.removeEventListener("finish", n);
                });
              },
              $ = function (e) {
                if (!K.length) return e();
                var t = [],
                  n = t9();
                null == K ||
                  K.forEach(function (e) {
                    var a,
                      r = e.target,
                      i = e.keyframes;
                    a = n
                      ? r.animate(i, {
                          easing: "linear(" + z.join(",") + ")",
                          duration: V,
                          delay: Y,
                        })
                      : r.animate(i, {
                          easing: _,
                          duration: V,
                          delay: Y,
                        });
                    var o = new Promise(function (e) {
                      a.addEventListener("finish", function t() {
                        Object.entries(i[i.length - 1]).forEach(function (e) {
                          var t = (0, f.A)(e, 2),
                            n = t[0],
                            a = t[1];
                          r.style.setProperty(
                            (n.startsWith("webkit") || n.startsWith("moz")
                              ? "-"
                              : "") + n.replace(/[A-Z]/g, "-$&").toLowerCase(),
                            a
                          );
                        }),
                          a.removeEventListener("finish", t),
                          e();
                      });
                    });
                    t.push(o);
                  }),
                  Promise.all(t).then(function () {
                    e();
                  });
              },
              ee = null,
              et = function (e) {
                !(function e(t, n, a) {
                  var i = k.current.progressValueAtDetents,
                    o = i.length;
                  ee || (ee = t);
                  var s = Math.floor(t - ee);
                  if (s < G.length) {
                    var l = F + X * G[s];
                    if (l < 0) n(l, [0, 0]);
                    else if (l > 1) n(l, [1, 1]);
                    else
                      for (var c = 0; c < o; c++) {
                        var u = i[c],
                          d = u.after;
                        l > d && c + 1 < o && l < i[c + 1].before
                          ? n(l, [c, c + 1])
                          : l > u.before && l < d && n(l, [c, c]);
                      }
                    requestAnimationFrame(function () {
                      return e(document.timeline.currentTime, n, a);
                    });
                  } else {
                    var A = Math.min(o - 1, r);
                    n(L, [A, A]),
                      P || (null == K ? void 0 : K.length) || null == C || C(),
                      a();
                  }
                })(
                  document.timeline.currentTime,
                  function (e, t) {
                    null == g ||
                      g({
                        progress: e,
                        range: {
                          start: t[0],
                          end: t[1],
                        },
                        progressAtDetents:
                          k.current.exactProgressValueAtDetents,
                      }),
                      i(t);
                  },
                  e
                );
              },
              en = function (e) {
                return new Promise(function (t) {
                  e(function () {
                    return t();
                  });
                });
              },
              ea = function () {
                null == b || b();
              },
              er =
                ((x = (0, d.A)(
                  h.mark(function e() {
                    return h.wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (e.next = 2), Promise.all([en(J), en($), en(et)])
                            );
                          case 2:
                            ea();
                          case 3:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                )),
                function () {
                  return x.apply(this, arguments);
                });
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                Z(), er();
              });
            });
          }
        },
        nn = function (e) {
          var t = e.desiredDestinationDetent,
            n = e.currentDetent;
          return "number" == typeof t ? t : n;
        },
        na = function (e) {
          var t,
            n,
            a = e.trackToTravelOn,
            r = e.destinationDetent,
            i = e.detentCountExcludingZero,
            o = e.actualSwipeOutDisabledWithDetent,
            s = e.hasOppositeTracks,
            l = e.contentPlacement,
            c = e.elementsDimensions,
            u = e.snapBackAcceleratorTravelAxisSize;
          if (
            (null === (t = c.detentMarkers) || void 0 === t
              ? void 0
              : t.length) <=
            r - 1
          )
            return {
              positionToScrollTo: null,
              scrollAxis: null,
            };
          var d = 0 === r,
            A = 1 === r,
            f = r === i,
            p = "right" === a || "bottom" === a,
            m = c.view.travelAxis.unitless,
            h = c.content.travelAxis.unitless,
            g = c.snapOutAccelerator.travelAxis.unitless,
            v = c.detentMarkers,
            b = d ? 0 : v[r - 1].accumulatedOffsets.travelAxis.unitless,
            y = 0;
          return (
            s
              ? f
                ? (y =
                    m - (m - h) / 2 + c.snapOutAccelerator.travelAxis.unitless)
                : d && (y = p ? 0 : 1e4)
              : p
              ? f
                ? (y = 1e4)
                : (o && A) || d
                ? (y = 0)
                : f ||
                  (o && A) ||
                  d ||
                  (y = o
                    ? v[r - 1].accumulatedOffsets.travelAxis.unitless -
                      v[0].travelAxis.unitless
                    : b + g)
              : ("left" === a || "top" === a) &&
                ((n = o && A ? 2 * u : f ? 0 : u),
                (y =
                  "center" === l
                    ? 0 === r
                      ? h + (m - h) / 2 - b + n
                      : 0
                    : h - b + n)),
            {
              positionToScrollTo: y,
              scrollAxis:
                "left" === a || "right" === a || "horizontal" === a ? "x" : "y",
            }
          );
        },
        nr = function (e) {
          var t = e.destinationDetent,
            n = e.behavior,
            a = e.runTravelCallbacksAndAnimations,
            r = void 0 === a || a,
            i = e.runOnTravelStart,
            o = e.animationConfig,
            s = e.rAFLoopEndCallback,
            l = e.trackToTravelOn,
            c = e.contentPlacement,
            u = e.onTravel,
            d = e.onTravelStart,
            A = e.onTravelEnd,
            f = e.fullTravelCallback,
            p = e.setProgrammaticScrollOngoing,
            m = e.currentDetent,
            h = e.segment,
            g = e.setSegment,
            v = e.lastProgressValue,
            b = e.dimensions,
            y = e.viewRef,
            C = e.scrollContainerRef,
            k = e.contentWrapperRef,
            S = e.sheetId,
            E = e.stackId,
            x = e.actualSwipeOutDisabledWithDetent,
            w = e.hasOppositeTracks,
            T = e.snapBackAcceleratorTravelAxisSize;
          if (void 0 !== t || null !== m) {
            var P = b.current,
              O = C.current;
            if (O && P.content) {
              var D = nn({
                  desiredDestinationDetent: t,
                  currentDetent: m,
                }),
                I = na({
                  destinationDetent: D,
                  detentCountExcludingZero: b.current.detentMarkers.length,
                  trackToTravelOn: l,
                  actualSwipeOutDisabledWithDetent: x,
                  hasOppositeTracks: w,
                  contentPlacement: c,
                  snapBackAcceleratorTravelAxisSize: T,
                  elementsDimensions: P,
                }),
                R = I.positionToScrollTo,
                j = I.scrollAxis;
              if (null !== R && null !== j) {
                if ((p(!0), "smooth" === (void 0 === n ? "instant" : n)))
                  nt({
                    sheetId: S,
                    stackId: E,
                    destinationDetent: D,
                    setSegment: g,
                    viewElement: y.current,
                    scrollContainer: O,
                    travellingElement: k.current,
                    positionToScrollTo: R,
                    contentPlacement: c,
                    scrollAxis: j,
                    animationConfig: o,
                    onTravel: u,
                    onTravelStart: d,
                    onTravelEnd: A,
                    runOnTravelStart: i,
                    rAFLoopEndCallback: s,
                    dimensions: b,
                    trackToTravelOn: l,
                    lastProgressValue: v,
                  });
                else if (
                  (r && i && (null == d || d()),
                  "x" === j
                    ? (O.scrollTo(R, 0), (O.scrollLeft = R))
                    : (O.scrollTo(0, R), (O.scrollTop = R)),
                  g([D, D]),
                  r)
                ) {
                  var N = b.current.progressValueAtDetents[D].exact;
                  null == f || f(N, h), null == A || A();
                }
              }
            }
          }
        },
        ni = function (e) {
          var t = (0, b.useRef)(null);
          return (
            eo(function () {
              t.current = e;
            }),
            (0, b.useCallback)(function () {
              return t.current.apply(void 0, arguments);
            }, [])
          );
        },
        no = function (e) {
          var t;
          return (
            (function n() {
              e(), (t = requestAnimationFrame(n));
            })(),
            function () {
              cancelAnimationFrame(t);
            }
          );
        },
        ns = (function () {
          var e = !0;
          CSS.supports("scroll-snap-align: start") || (e = !1);
          var t = !0;
          return (
            ("IntersectionObserver" in window &&
              "IntersectionObserverEntry" in window &&
              "intersectionRatio" in
                window.IntersectionObserverEntry.prototype) ||
              (t = !1),
            e && t
          );
        })(),
        nl = {
          gentle: {
            stiffness: 560,
            damping: 68,
            mass: 1.85,
          },
          smooth: {
            stiffness: 580,
            damping: 60,
            mass: 1.35,
          },
          snappy: {
            stiffness: 350,
            damping: 34,
            mass: 0.9,
          },
          brisk: {
            stiffness: 350,
            damping: 28,
            mass: 0.65,
          },
          bouncy: {
            stiffness: 240,
            damping: 19,
            mass: 0.7,
          },
          elastic: {
            stiffness: 260,
            damping: 20,
            mass: 1,
          },
        },
        nc = function (e, t) {
          var n,
            a = "string" == typeof e,
            r = a
              ? nl[e]
              : null !== (n = nl[null == e ? void 0 : e.preset]) && void 0 !== n
              ? n
              : null,
            i =
              r ||
              (null == e ? void 0 : e.easing) === "spring" ||
              ["ease", "ease-in", "ease-out", "ease-in-out", "linear"].includes(
                null == e ? void 0 : e.easing
              );
          return ei(
            ei(
              ei(
                {
                  skip: eO,
                  easing: "spring",
                },
                a ? {} : e
              ),
              null != r ? r : {}
            ),
            i ? {} : t
          );
        },
        nu = function (e, t) {
          return e.includes("skipOpening:true") || t.skipOpening;
        },
        nd = function (e, t) {
          return !e.includes("skipOpening:true") && !t.skipOpening;
        },
        nA = function (e, t) {
          return e.includes("skipClosing:true") || t.skipClosing;
        },
        nf = function (e, t) {
          return !e.includes("skipClosing:true") && !t.skipClosing;
        },
        np = function (e) {
          return e.includes("openness:closed.status:safe-to-unmount");
        },
        nm = function () {
          var e = "false",
            t = tw(
              (0, b.useMemo)(
                function () {
                  return [
                    {
                      name: "staging",
                      initial: "none",
                      states: {
                        none: {
                          messages: {
                            OPEN: [
                              {
                                guard: function (e, t) {
                                  return np(e, t) && nd(e, t);
                                },
                                target: "opening",
                              },
                              {
                                guard: np,
                                target: "open",
                              },
                            ],
                            OPEN_PREPARED: [
                              {
                                guard: nd,
                                target: "opening",
                              },
                              {
                                target: "open",
                              },
                            ],
                            ACTUALLY_CLOSE: [
                              {
                                guard: nf,
                                target: "closing",
                              },
                            ],
                            ACTUALLY_STEP: "stepping",
                            GO_DOWN: [
                              {
                                guard: function (e, t) {
                                  return !t.skipOpening;
                                },
                                target: "going-down",
                              },
                              {
                                target: "go-down",
                              },
                            ],
                            GO_UP: "going-up",
                          },
                        },
                        open: {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        opening: {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        stepping: {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        closing: {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        "go-down": {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        "going-down": {
                          messages: {
                            NEXT: "none",
                          },
                        },
                        "going-up": {
                          messages: {
                            NEXT: "none",
                          },
                        },
                      },
                    },
                    {
                      name: "longRunning",
                      initial: e,
                      states: {
                        false: {
                          messages: {
                            TO_TRUE: "true",
                          },
                        },
                        true: {
                          messages: {
                            TO_FALSE: "false",
                          },
                        },
                      },
                    },
                    {
                      name: "openness",
                      initial: "closed",
                      states: {
                        closed: {
                          messages: {
                            READY_TO_OPEN: [
                              {
                                guard: function (e, t) {
                                  return !t.skipOpening;
                                },
                                target: "opening",
                              },
                              {
                                target: "open",
                              },
                            ],
                          },
                          machines: {
                            name: "status",
                            initial: "safe-to-unmount",
                            states: {
                              pending: {
                                messages: {
                                  OPEN: [
                                    {
                                      guard: nu,
                                      target:
                                        "openness:closed.status:flushing-to-preparing-open",
                                    },
                                    {
                                      target:
                                        "openness:closed.status:flushing-to-preparing-opening",
                                    },
                                  ],
                                  "": "safe-to-unmount",
                                },
                              },
                              "flushing-to-preparing-open": {
                                messages: {
                                  "": "preparing-open",
                                },
                              },
                              "flushing-to-preparing-opening": {
                                messages: {
                                  "": "preparing-opening",
                                },
                              },
                              "preparing-open": {},
                              "preparing-opening": {},
                              "safe-to-unmount": {},
                            },
                          },
                        },
                        opening: {
                          messages: {
                            NEXT: "open",
                          },
                        },
                        open: {
                          messages: {
                            ACTUALLY_CLOSE: [
                              {
                                guard: nA,
                                target: "openness:closed.status:pending",
                              },
                            ],
                            SWIPED_OUT: "openness:closed.status:pending",
                            READY_TO_CLOSE: [
                              {
                                guard: function (e, t) {
                                  return !t.skipClosing;
                                },
                                target: "closing",
                              },
                            ],
                          },
                          machines: [
                            {
                              name: "scroll",
                              initial: "ended",
                              states: {
                                ended: {
                                  messages: {
                                    SCROLL_START: "ongoing",
                                  },
                                  machines: [
                                    {
                                      name: "afterPaintEffectsRun",
                                      initial: "false",
                                      states: {
                                        false: {
                                          messages: {
                                            OCCURRED: "true",
                                          },
                                        },
                                        true: {},
                                      },
                                    },
                                  ],
                                },
                                ongoing: {
                                  messages: {
                                    SCROLL_END: "ended",
                                  },
                                },
                              },
                            },
                            {
                              name: "move",
                              initial: "ended",
                              states: {
                                ended: {
                                  messages: {
                                    MOVE_START: "ongoing",
                                  },
                                },
                                ongoing: {
                                  messages: {
                                    MOVE_END: "ended",
                                  },
                                },
                              },
                            },
                            {
                              name: "swipe",
                              silentOnly: !0,
                              initial: "unstarted",
                              states: {
                                unstarted: {
                                  messages: {
                                    SWIPE_START: "ongoing",
                                  },
                                },
                                ongoing: {
                                  messages: {
                                    SWIPE_END: "ended",
                                  },
                                },
                                ended: {
                                  messages: {
                                    SWIPE_START: "ongoing",
                                    SWIPE_RESET: "unstarted",
                                  },
                                },
                              },
                            },
                            {
                              name: "evaluateCloseMessage",
                              silentOnly: !0,
                              initial: "false",
                              states: {
                                false: {
                                  messages: {
                                    CLOSE: "true",
                                  },
                                },
                                true: {
                                  messages: {
                                    CLOSE: "false",
                                  },
                                },
                              },
                            },
                            {
                              name: "evaluateStepMessage",
                              silentOnly: !0,
                              initial: "false",
                              states: {
                                false: {
                                  messages: {
                                    STEP: "true",
                                  },
                                },
                                true: {
                                  messages: {
                                    STEP: "false",
                                  },
                                },
                              },
                            },
                          ],
                        },
                        closing: {
                          messages: {
                            NEXT: "openness:closed.status:pending",
                          },
                        },
                      },
                    },
                    {
                      name: "skipOpening",
                      initial: "false",
                      states: {
                        true: {
                          messages: {
                            TO_FALSE: "false",
                          },
                        },
                        false: {
                          messages: {
                            TO_TRUE: "true",
                          },
                        },
                      },
                    },
                    {
                      name: "skipClosing",
                      initial: "false",
                      states: {
                        true: {
                          messages: {
                            TO_FALSE: "false",
                          },
                        },
                        false: {
                          messages: {
                            TO_TRUE: "true",
                          },
                        },
                      },
                    },
                    {
                      name: "scrollContainerTouch",
                      silentOnly: !0,
                      initial: "ended",
                      states: {
                        ended: {
                          messages: {
                            TOUCH_START: "ongoing",
                          },
                        },
                        ongoing: {
                          messages: {
                            TOUCH_END: "ended",
                          },
                        },
                      },
                    },
                    {
                      name: "backStuck",
                      silentOnly: !0,
                      initial: "false",
                      states: {
                        false: {
                          messages: {
                            STUCK_START: "true",
                          },
                        },
                        true: {
                          messages: {
                            STUCK_END: "false",
                          },
                        },
                      },
                    },
                    {
                      name: "frontStuck",
                      silentOnly: !0,
                      initial: "false",
                      states: {
                        false: {
                          messages: {
                            STUCK_START: "true",
                          },
                        },
                        true: {
                          messages: {
                            STUCK_END: "false",
                          },
                        },
                      },
                    },
                  ];
                },
                [e]
              )
            ),
            n = (0, f.A)(t, 2),
            a = n[0],
            r = n[1],
            i = tw(
              (0, b.useMemo)(function () {
                return [
                  {
                    name: "active",
                    initial: "false",
                    states: {
                      false: {
                        messages: {
                          TO_TRUE: "true",
                        },
                      },
                      true: {
                        messages: {
                          TO_FALSE: "false",
                        },
                      },
                    },
                  },
                  {
                    name: "position",
                    initial: "out",
                    states: {
                      out: {
                        messages: {
                          READY_TO_GO_FRONT: [
                            {
                              guard: function (e, t) {
                                return t.skipOpening;
                              },
                              target: "position:front.status:idle",
                            },
                            {
                              target: "position:front.status:opening",
                            },
                          ],
                        },
                      },
                      front: {
                        machines: [
                          {
                            name: "status",
                            initial: "opening",
                            states: {
                              opening: {
                                messages: {
                                  NEXT: "idle",
                                },
                              },
                              closing: {
                                messages: {
                                  NEXT: "position:out",
                                },
                              },
                              idle: {
                                messages: {
                                  READY_TO_GO_DOWN: [
                                    {
                                      guard: function (e, t) {
                                        return t.skipOpening;
                                      },
                                      target: "position:covered.status:idle",
                                    },
                                    {
                                      target:
                                        "position:covered.status:going-down",
                                    },
                                  ],
                                  READY_TO_GO_OUT: "closing",
                                  GO_OUT: "position:out",
                                },
                              },
                            },
                          },
                        ],
                      },
                      covered: {
                        machines: [
                          {
                            name: "status",
                            initial: "going-down",
                            states: {
                              "going-down": {
                                messages: {
                                  NEXT: "idle",
                                },
                              },
                              "going-up": {
                                messages: {
                                  NEXT: "indeterminate",
                                },
                              },
                              indeterminate: {
                                messages: {
                                  GOTO_idle: "idle",
                                  GOTO_front: "position:front.status:idle",
                                },
                              },
                              idle: {
                                messages: {
                                  READY_TO_GO_DOWN: [
                                    {
                                      guard: function (e, t) {
                                        return t.skipOpening;
                                      },
                                      target: "come-back",
                                    },
                                    {
                                      target: "going-down",
                                    },
                                  ],
                                  READY_TO_GO_UP: "going-up",
                                  GO_UP: "indeterminate",
                                },
                              },
                              "come-back": {
                                messages: {
                                  "": "idle",
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ];
              }, [])
            ),
            o = (0, f.A)(i, 2),
            s = o[0],
            l = o[1],
            c = (0, b.useMemo)(
              function () {
                return s.matches("position:out")
                  ? "out"
                  : s.matches("position:front")
                  ? "front"
                  : s.matches("position:covered")
                  ? "covered"
                  : void 0;
              },
              [s]
            ),
            u = (0, b.useMemo)(
              function () {
                return s.matches("position:covered.status:idle")
                  ? "idle"
                  : s.matches("position:covered.status:going-down")
                  ? "going-down"
                  : s.matches("position:covered.status:going-up")
                  ? "going-up"
                  : null;
              },
              [s]
            ),
            d = tP(a, "staging"),
            A = (0, b.useMemo)(
              function () {
                return d.getValues()[0];
              },
              [d]
            ),
            p = tN(-1),
            m = (0, f.A)(p, 2),
            h = m[0],
            g = m[1],
            v = tU(),
            y = tU();
          return (0, b.useMemo)(
            function () {
              return {
                titleId: v,
                descriptionId: y,
                staging: A,
                opennessState: a,
                sendToOpennessMachine: r,
                positionState: s,
                sendToPositionMachine: l,
                layerPosition: c,
                layerCovered: u,
                stackingIndex: h,
                assignStackingIndex: g,
              };
            },
            [v, y, A, a, r, s, l, c, u, h, g]
          );
        },
        nh = b.forwardRef(function (e, t) {
          var n,
            a = e.forComponent,
            r = (e.as, e.children),
            i = e.className,
            o = e["data-silk"],
            s = (e.initialState, e.onPresentAutoFocus),
            l = e.onDismissAutoFocus,
            c = e.onTravelStatusChange,
            u = e.onTravelRangeChange,
            d = e.swipeDismissal,
            m = void 0 === d || d,
            h = e.swipe,
            v = void 0 === h || h,
            y = e.snapOutAcceleration,
            C = void 0 === y ? "auto" : y,
            k = e.snapToEndDetentsAcceleration,
            S = void 0 === k ? "auto" : k,
            E = e.onTravel,
            x = e.onTravelStart,
            w = e.onTravelEnd,
            P = e.detents,
            O = e.inertOutside,
            D = void 0 === O || O,
            I = e.nativeEdgeSwipePrevention,
            R = void 0 !== I && I,
            j = e.onSwipeFromEdgeToGoBackAttempt,
            N = e.onClickOutside,
            M = e.onEscapeKeyDown,
            B = e.onFocusInside,
            F = e.nativeFocusScrollPrevention,
            L = void 0 === F || F,
            Q = e.contentPlacement,
            U = void 0 === Q ? null : Q,
            W = e.tracks,
            G = e.swipeOvershoot,
            _ = e.swipeTrap,
            V = e.enteringAnimationSettings,
            Y = e.exitingAnimationSettings,
            X = e.steppingAnimationSettings,
            z = (e.id, (0, A.A)(e, T)),
            H = null != a ? a : t5,
            K = (0, b.useContext)(H) || {},
            q = (K.license, K.StackContext),
            Z = K.CustomSheetContext,
            J = K.sheetRole,
            $ = K.open,
            ee = K.onOpenChange,
            et = K.elementFocusedLastBeforeShowing,
            ea = K.onSafeToUnmountChange,
            er = K.setLongRunning,
            eo = K.setStaging,
            el = K.defaultActiveDetent,
            ed = K.activeDetent,
            eA = K.onActiveDetentChange,
            ef = K.sheetId,
            ep = nm(),
            em = ep.titleId,
            eg = ep.descriptionId,
            ev = ep.staging,
            eb = ep.opennessState,
            ey = ep.sendToOpennessMachine,
            eC = ep.positionState,
            ek = ep.sendToPositionMachine,
            eS = ep.layerCovered,
            eE = ep.stackingIndex,
            ex = ep.assignStackingIndex,
            ew = tP(eb, "staging"),
            eT = q ? (0, b.useContext)(q) : {},
            eP = eT.stackId,
            eO = eT.setSheetsCount,
            eD = eT.updateSheetStagingDataInStack,
            eR = eT.removeSheetStagingDataInStack,
            ej = eT.updateSheetDataInStack,
            eN = eT.removeSheetDataFromStack,
            eM = eT.getPreviousSheetDataInStack,
            eL = ((0, b.useContext)(t3) || {})
              .ancestorPrimarySwipeTrapActiveOnYAxis,
            eW = t$(),
            eG = (0, b.useRef)(null),
            e_ = tB(eG, eW, t),
            eV = (0, b.useRef)(null),
            eY = (0, b.useRef)(null),
            eX = (0, b.useRef)(null),
            ez = (0, b.useRef)(null),
            eH = (0, b.useRef)(null),
            eK = (0, b.useRef)(null),
            eq = (0, b.useRef)(null),
            eZ = (0, b.useRef)([]),
            eJ = (0, b.useMemo)(
              function () {
                return P
                  ? "string" == typeof P
                    ? [P, "var(--silk-aF)"]
                    : [].concat((0, p.A)(P), ["var(--silk-aF)"])
                  : ["var(--silk-aF)"];
              },
              [P]
            ),
            e$ = (0, b.useRef)(null);
          (0, b.useEffect)(function () {
            null === e$.current &&
              Number.isInteger(ed) &&
              ed > 0 &&
              (e$.current = ed);
          }, []);
          var e0 = (0, b.useMemo)(
              function () {
                return Number.isInteger(el)
                  ? el
                  : Number.isInteger(ed) && ed > 0
                  ? ed
                  : e$.current
                  ? e$.current
                  : 1;
              },
              [ed, el]
            ),
            e1 = (0, b.useMemo)(
              function () {
                var e = {
                  actualPlacement: null,
                  actualTrack: null,
                };
                return (
                  U && !W
                    ? ((e.actualPlacement = U),
                      "center" !== U
                        ? (e.actualTrack = U)
                        : (e.actualTrack = "bottom"))
                    : W && !U
                    ? Array.isArray(W)
                      ? ((e.actualPlacement = "center"),
                        (e.actualTrack = W.includes("left")
                          ? "horizontal"
                          : "vertical"))
                      : ((e.actualPlacement = W), (e.actualTrack = W))
                    : W || U
                    ? W &&
                      U &&
                      ((e.actualPlacement = U),
                      Array.isArray(W)
                        ? (e.actualTrack = W.includes("left")
                            ? "horizontal"
                            : "vertical")
                        : (e.actualTrack = W))
                    : ((e.actualPlacement = "bottom"),
                      (e.actualTrack = "bottom")),
                  [
                    {
                      state: "staging:opening",
                      configTrack: null == V ? void 0 : V.track,
                    },
                    {
                      state: "staging:closing",
                      configTrack: null == Y ? void 0 : Y.track,
                    },
                  ].forEach(function (t) {
                    var n = t.state,
                      a = t.configTrack;
                    eb.matches(n) &&
                      a &&
                      (("top" === a && "bottom" === e.actualTrack) ||
                      ("bottom" === a && "top" === e.actualTrack)
                        ? (e.actualTrack = "vertical")
                        : (("left" === a && "right" === e.actualTrack) ||
                            ("right" === a && "left" === e.actualTrack)) &&
                          (e.actualTrack = "horizontal"));
                  }),
                  e
                );
              },
              [
                U,
                W,
                null == V ? void 0 : V.track,
                null == Y ? void 0 : Y.track,
                eb,
              ]
            ),
            e2 = e1.actualTrack,
            e5 = e1.actualPlacement;
          (0, b.useMemo)(
            function () {
              return "horizontal" === e2;
            },
            [e2]
          );
          var e3 = (0, b.useMemo)(
            function () {
              return "vertical" === e2;
            },
            [e2]
          );
          (0, b.useEffect)(
            function () {
              if (
                ((null == U ? void 0 : U.includes("top")) &&
                  W &&
                  "top" !== W) ||
                ((null == U ? void 0 : U.includes("bottom")) &&
                  W &&
                  "bottom" !== W) ||
                (!(null == U ? void 0 : U.includes("center")) &&
                  W &&
                  W.includes("top") &&
                  W.includes("bottom")) ||
                ((null == U ? void 0 : U.includes("left")) &&
                  W &&
                  "left" !== W) ||
                ((null == U ? void 0 : U.includes("right")) &&
                  W &&
                  "right" !== W) ||
                (!(null == U ? void 0 : U.includes("center")) &&
                  W &&
                  W.includes("left") &&
                  W.includes("right"))
              )
                throw Error(
                  "'placement' prop value '"
                    .concat(U, "' cannot be used with 'tracks' prop value '")
                    .concat(W, "'.")
                );
            },
            [U, W]
          );
          var e4 = (0, b.useMemo)(
              function () {
                return (
                  (null == V ? void 0 : V.track) ||
                  ("horizontal" === e2
                    ? "right"
                    : "vertical" === e2
                    ? "bottom"
                    : e2)
                );
              },
              [null == V ? void 0 : V.track, e2]
            ),
            e8 = (0, b.useMemo)(
              function () {
                return nc(V, nl.smooth);
              },
              [V]
            ),
            e9 = (0, b.useMemo)(
              function () {
                return nc(Y, {
                  easing: "spring",
                  stiffness: 520,
                  damping: 44,
                  mass: 1,
                });
              },
              [Y]
            ),
            te = (0, b.useMemo)(
              function () {
                return nc(null != X ? X : V, nl.smooth);
              },
              [X, V]
            ),
            tt = (0, b.useMemo)(
              function () {
                return "alertdialog" === J || !m;
              },
              [m, J]
            ),
            tn =
              (("horizontal" !== e2 && "vertical" !== e2) || !!tt) &&
              !(void 0 === G || G),
            ta = (0, b.useMemo)(
              function () {
                var e = !1,
                  t = !1,
                  n = !1,
                  a = !1;
                return (
                  v && ns
                    ? tt &&
                      (P
                        ? ((n = !0),
                          eb.matches("openness:open") &&
                            !eb.matches("staging:closing") &&
                            (t = !0))
                        : eb.matches("openness:open") &&
                          !eb.matches("staging:closing") &&
                          (!1 === tn && eQ() ? (a = !0) : (e = !0)))
                    : eb.matches("openness:closed") || (e = !0),
                  [e, t, n, a]
                );
              },
              [v, eb, tt, P, tn]
            ),
            tr = (0, f.A)(ta, 4),
            ti = tr[0],
            to = tr[1],
            ts = tr[2],
            tl = tr[3],
            tc = (0, b.useMemo)(
              function () {
                return "none" !== ew.getValues()[0];
              },
              [ew]
            ),
            tu = ["right", "left", "horizontal"].includes(e2)
              ? "horizontal"
              : "vertical",
            td = (0, b.useState)(!1),
            tA = (0, f.A)(td, 2),
            tf = tA[0],
            tp = tA[1],
            tg = (0, b.useState)(!1),
            tv = (0, f.A)(tg, 2),
            tb = tv[0],
            ty = tv[1],
            tC = (0, b.useMemo)(
              function () {
                return !D && (D ? void 0 : !0 !== tf);
              },
              [D, tf]
            ),
            tk = (0, b.useMemo)(
              function () {
                return !0 === tn ? ("auto" === S ? 10 : 1) : 0;
              },
              [tn, S]
            ),
            tS = (0, b.useRef)(null);
          (0, b.useEffect)(
            function () {
              return (
                ef &&
                  (tS.current = th.addSheet({
                    id: ef,
                    stackId: eP,
                    stackingIndex: -1,
                    sendToOpennessMachine: ey,
                  })),
                function () {
                  ef && th.attemptToRemoveSheetOrCleanup(ef);
                }
              );
            },
            [ey, ef, eP]
          ),
            (0, b.useEffect)(
              function () {
                return (
                  L && th.addNativeFocusScrollPreventer(ef),
                  function () {
                    L && th.removeNativeFocusScrollPreventer(ef);
                  }
                );
              },
              [L, ef]
            );
          var tE = (0, b.useMemo)(
              function () {
                return null == eM ? void 0 : eM(ef);
              },
              [eM, ef]
            ),
            tx = (0, b.useState)(null),
            tw = (0, f.A)(tx, 2),
            tO = tw[0],
            tN = tw[1],
            tM = (0, b.useMemo)(
              function () {
                return E && tO
                  ? function (e) {
                      tO(e), E(e);
                    }
                  : E && !tO
                  ? E
                  : !E && tO
                  ? tO
                  : null;
              },
              [E, tO]
            ),
            tL = (0, b.useCallback)(
              function () {
                null == w || w();
                var e = tH.current.exactProgressValueAtDetents[t7.current[0]];
                (nU.current = e), th.updateSheetTravelProgress(ef, e);
              },
              [w, ef]
            ),
            tQ = (0, b.useMemo)(
              function () {
                var e;
                if (eE.value > 0)
                  e = tM
                    ? function (e, t) {
                        tM({
                          progress: e,
                          range: t,
                          progressAtDetents:
                            tH.current.exactProgressValueAtDetents,
                        });
                        var n = es(e);
                        tS.current.aggregatedTravelCallback(e, n);
                      }
                    : function (e) {
                        var t = es(e);
                        tS.current.aggregatedTravelCallback(e, t);
                      };
                else {
                  var t = th.getAggregatedStackingCallbackForSheetsBelow(ef);
                  e = t
                    ? tM
                      ? function (e, n) {
                          tM({
                            progress: e,
                            range: n,
                            progressAtDetents:
                              tH.current.exactProgressValueAtDetents,
                          });
                          var a = es(e);
                          tS.current.aggregatedTravelCallback(e, a), t(e, a);
                        }
                      : function (e) {
                          var n = es(e);
                          tS.current.aggregatedTravelCallback(e, n), t(e, n);
                        }
                    : function () {};
                }
                return e;
              },
              [eE.value, tM, ef]
            ),
            tU = (0, b.useRef)(!1),
            tW = (0, b.useMemo)(
              function () {
                var e;
                return (
                  "bottom" === e2 || "vertical" === e2
                    ? (e = "translateY(-2px)")
                    : "top" === e2
                    ? (e = "translateY(2px)")
                    : "right" === e2 || "horizontal" === e2
                    ? (e = "translateX(-2px)")
                    : "left" === e2 && (e = "translateX(2px)"),
                  function (t) {
                    t > 0 && t < 1 && !tU.current
                      ? (eH.current.style.setProperty("transform", e),
                        (tU.current = !0))
                      : (t > 1 || t <= 0) &&
                        tU.current &&
                        (eH.current.style.removeProperty("transform"),
                        (tU.current = !1));
                  }
                );
              },
              [e2]
            ),
            tG = (0, b.useMemo)(
              function () {
                return tl
                  ? function (e) {
                      return tW(e);
                    }
                  : tQ;
              },
              [tW, tl, tQ]
            ),
            t_ = (0, b.useState)("both"),
            tV = (0, f.A)(t_, 2),
            tY = tV[0],
            tX = tV[1],
            tz = eB(eG);
          (0, b.useEffect)(
            function () {
              if ("boolean" == typeof _)
                n = {
                  x: _,
                  y: _,
                };
              else {
                var e,
                  t,
                  n,
                  a,
                  r,
                  i = _ || {};
                n = {
                  x: i.x,
                  y: i.y,
                };
              }
              var o = ("ios" === eu || "ipados" === eu) && D && !eL,
                s = eF();
              "vertical" === tu &&
                ((a = n.x),
                (r = !!o || (!s && (null === (e = n.y) || void 0 === e || e)))),
                "horizontal" === tu &&
                  ((r = !!o || n.y),
                  (a = null === (t = n.x) || void 0 === t || t)),
                (r = !!r || tz),
                a && !r
                  ? tX("horizontal")
                  : !a && r
                  ? tX("vertical")
                  : a && r
                  ? tX("both")
                  : tX("none");
            },
            [eL, D, _, tz, tu]
          );
          var tH = (0, b.useRef)({}),
            tK = (0, b.useState)(0),
            tq = (0, f.A)(tK, 2),
            tZ = tq[0],
            t0 = tq[1],
            t1 = (0, b.useState)(function () {
              return function () {
                return {
                  top: null,
                  bottom: null,
                };
              };
            }),
            t2 = (0, f.A)(t1, 2),
            t4 = t2[0],
            t8 = t2[1],
            t9 = (0, b.useRef)([]),
            t7 = (0, b.useRef)([0, 0]),
            t6 = (0, b.useRef)(0),
            ne = (0, b.useRef)(null),
            nt = (0, b.useRef)(function () {}),
            nn = (0, b.useRef)(!1),
            na = (0, b.useRef)(!1),
            nu = (0, b.useCallback)(function (e) {
              return (na.current = e);
            }, []),
            nd = ni(function (e) {
              var t = e.destinationDetent,
                n = e.trackToTravelOn,
                a =
                  void 0 === n
                    ? "vertical" === e2
                      ? "bottom"
                      : "horizontal" === e2
                      ? "right"
                      : e2
                    : n,
                r = e.behavior,
                i = e.runTravelCallbacksAndAnimations,
                o = e.runOnTravelStart,
                s = e.animationConfig,
                l = e.rAFLoopEndCallback,
                c = e.travelEndCallback;
              nr({
                destinationDetent: t,
                behavior: void 0 === r ? "instant" : r,
                runTravelCallbacksAndAnimations: void 0 === i || i,
                runOnTravelStart: void 0 === o || o,
                trackToTravelOn: a,
                animationConfig: s,
                rAFLoopEndCallback: l,
                onTravel: tM,
                onTravelStart: x,
                onTravelEnd: function () {
                  null == c || c(), tL();
                },
                segment: t7,
                fullTravelCallback: tQ,
                sheetId: ef,
                stackId: eP,
                dimensions: tH,
                snapBackAcceleratorTravelAxisSize: tk,
                actualSwipeOutDisabledWithDetent: to,
                lastProgressValue: nU,
                viewRef: eG,
                scrollContainerRef: eX,
                contentWrapperRef: eH,
                currentDetent:
                  t7.current[0] === t7.current[1] ? t7.current[0] : null,
                setSegment: nP,
                setProgrammaticScrollOngoing: nu,
                contentPlacement: e5,
                hasOppositeTracks: "horizontal" === e2 || "vertical" === e2,
              });
            }),
            nA = (0, b.useCallback)(
              function () {
                t7.current[0] === t7.current[1] &&
                  nd({
                    runTravelCallbacksAndAnimations: !1,
                    destinationDetent: t7.current[0],
                  });
              },
              [ef, e2, to, tl, tk]
            ),
            nf = (0, b.useCallback)(
              function (e) {
                null == ej ||
                  ej({
                    sheetId: ef,
                    sendToOpennessMachine: ey,
                    sendToPositionMachine: ek,
                  });
              },
              [ej, ef, ey, ek]
            ),
            np = (0, b.useCallback)(
              function () {
                null == eN || eN(ef);
              },
              [eN, ef]
            ),
            nh = (0, b.useMemo)(
              function () {
                return "alertdialog" === J
                  ? function () {}
                  : function () {
                      return ey({
                        type: "CLOSE",
                      });
                    };
              },
              [ey, J]
            ),
            ng = (0, b.useCallback)(
              function () {
                th.updateLayer({
                  layerId: ef,
                  layerContextId: Z,
                  layerStackContextId: q,
                  inertOutside: D,
                  onPresentAutoFocus: s,
                  onDismissAutoFocus: l,
                  dismissOverlayIfNotAlertDialog: nh,
                  onClickOutside: N,
                  onEscapeKeyDown: M,
                  viewElement: eG.current,
                  backdropElement: eY.current,
                  scrollContainerElement: eX.current,
                  elementFocusedLastBeforeShowing: et.current,
                });
              },
              [ef, Z, q, D, s, l, nh, N, M, et]
            ),
            nv = (0, b.useCallback)(
              function () {
                th.removeLayer(ef);
              },
              [ef]
            ),
            nb = (0, b.useCallback)(function () {
              var e = function (e) {
                  return [
                    "ArrowDown",
                    "ArrowUp",
                    "PageDown",
                    "PageUp",
                    "End",
                    "Home",
                    " ",
                  ].includes(e.key);
                },
                t = function (t) {
                  if (e(t)) {
                    var n, a;
                    null === (n = eX.current) ||
                      void 0 === n ||
                      n.style.setProperty("overflow", "hidden"),
                      null === (a = eX.current) ||
                        void 0 === a ||
                        a.style.setProperty("scroll-snap-type", "none");
                  }
                },
                n = function (t) {
                  if (e(t)) {
                    var n, a;
                    null === (n = eX.current) ||
                      void 0 === n ||
                      n.style.removeProperty("overflow"),
                      null === (a = eX.current) ||
                        void 0 === a ||
                        a.style.removeProperty("scroll-snap-type");
                  }
                };
              return (
                document.addEventListener("keydown", t),
                document.addEventListener("keyup", n),
                function () {
                  document.removeEventListener("keydown", t),
                    document.removeEventListener("keyup", n);
                }
              );
            }, []),
            ny = (0, b.useCallback)(
              function () {
                ex(function (e) {
                  return e + 1;
                }),
                  th.updateSheetStackingIndex(ef, eE.silent.value);
              },
              [ex, eE.silent, ef]
            ),
            nC = (0, b.useCallback)(
              function () {
                ex(function (e) {
                  return e - 1;
                }),
                  th.updateSheetStackingIndex(ef, eE.silent.value);
              },
              [ex, eE.silent, ef]
            ),
            nk = tP(eC, "active");
          tj("after-paint", nk, {
            state: "active:true",
            callback: ng,
          }),
            tj("after-paint", nk, {
              state: "active:true",
              callback: nb,
            }),
            tD("after-paint", nk, {
              state: "active:false",
              callback: nv,
            });
          var nS = tP(eC, "position"),
            nE = tP(eC, "position:covered.status");
          tI(nS, {
            state: "position:out",
            transition: "READY_TO_GO_FRONT",
            callback: (0, b.useCallback)(
              function (e) {
                null == tE ||
                  tE.sendToPositionMachine({
                    type: "READY_TO_GO_DOWN",
                    skipOpening: e.skipOpening,
                  }),
                  ny();
              },
              [ny, tE]
            ),
          }),
            tI(eC, {
              state: "position:front.status:opening",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("NEXT");
                },
                [tE]
              ),
            }),
            tI(eC, {
              state: "position:front.status:idle",
              transition: "READY_TO_GO_OUT",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("READY_TO_GO_UP");
                },
                [tE]
              ),
            }),
            tI(eC, {
              state: "position:front.status:idle",
              transition: "GO_OUT",
              callback: (0, b.useCallback)(
                function () {
                  null == tQ ||
                    tQ(0, {
                      start: 0,
                      end: 0,
                    }),
                    tL(),
                    null == tE || tE.sendToPositionMachine("GO_UP"),
                    nC();
                },
                [tQ, tL, tE, nC]
              ),
            }),
            tI(eC, {
              state: "position:front.status:idle",
              transition: "READY_TO_GO_DOWN",
              callback: (0, b.useCallback)(
                function (e) {
                  null == tE ||
                    tE.sendToPositionMachine({
                      type: "READY_TO_GO_DOWN",
                      skipOpening: e.skipOpening,
                    }),
                    ny();
                },
                [ny, tE]
              ),
            }),
            tI(eC, {
              state: "position:front.status:closing",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("NEXT"), nC();
                },
                [tE, nC]
              ),
            }),
            tI(nE, {
              state: "position:covered.status:going-down",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("NEXT");
                },
                [tE]
              ),
            }),
            tI(nE, {
              state: "position:covered.status:idle",
              transition: "READY_TO_GO_DOWN",
              callback: (0, b.useCallback)(
                function (e) {
                  null == tE ||
                    tE.sendToPositionMachine({
                      type: "READY_TO_GO_DOWN",
                      skipOpening: e.skipOpening,
                    }),
                    ny();
                },
                [ny, tE]
              ),
            }),
            tI(nE, {
              state: "position:covered.status:idle",
              transition: "READY_TO_GO_UP",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("READY_TO_GO_UP");
                },
                [tE]
              ),
            }),
            tI(nE, {
              state: "position:covered.status:idle",
              transition: "GO_UP",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("GO_UP"), nC();
                },
                [nC, tE]
              ),
            }),
            tD("immediate", nE, {
              state: "position:covered.status:come-back",
              callback: (0, b.useCallback)(
                function () {
                  return ek("");
                },
                [ek]
              ),
            }),
            tI(nE, {
              state: "position:covered.status:going-up",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  null == tE || tE.sendToPositionMachine("NEXT"), nC();
                },
                [tE, nC]
              ),
            }),
            tD("immediate", nE, {
              state: "position:covered.status:indeterminate",
              callback: (0, b.useCallback)(
                function () {
                  0 === eE.silent.value ? ek("GOTO_front") : ek("GOTO_idle");
                },
                [eE.silent, ek]
              ),
            });
          var nx = (0, b.useCallback)(
              function () {
                return null == tE
                  ? void 0
                  : tE.sendToOpennessMachine({
                      machine: "staging",
                      type: "NEXT",
                    });
              },
              [tE]
            ),
            nw = (0, b.useCallback)(
              function (e, t) {
                var a = t.newState;
                eo(a),
                  null == eD ||
                    eD({
                      sheetId: ef,
                      staging: a,
                    }),
                  null == n || n(a);
              },
              [n, eo, eD, ef]
            ),
            nT = (0, b.useCallback)(
              function (e, t) {
                var n = t.newState;
                null == c || c(n);
              },
              [c]
            ),
            nP = (0, b.useMemo)(
              function () {
                var e = function (e) {
                  (t6.current = e[1]),
                    queueMicrotask(function () {
                      var t = e[0],
                        n = e[1];
                      (t !== t7.current[0] || n !== t7.current[1]) &&
                        ((t7.current = e),
                        t === n &&
                          (null === ne.current && eA
                            ? eA(n)
                            : t === ne.current && (ne.current = null)));
                    });
                };
                return (
                  u && !1 === tn
                    ? (e = function (e) {
                        (t6.current = e[1]),
                          queueMicrotask(function () {
                            var t = e[0],
                              n = e[1];
                            (t !== t7.current[0] || n !== t7.current[1]) &&
                              ((t7.current = e),
                              u({
                                start: t,
                                end: n,
                              }),
                              t === n &&
                                (null === ne.current && eA
                                  ? eA(n)
                                  : t === ne.current && (ne.current = null)));
                          });
                      })
                    : !0 === tn &&
                      (e = ts
                        ? function (e) {
                            (t6.current = e[1]),
                              queueMicrotask(function () {
                                var t = e[0],
                                  n = e[1];
                                if (
                                  t !== t7.current[0] ||
                                  n !== t7.current[1]
                                ) {
                                  var a = eJ.length;
                                  to && 1 === t && 1 === n
                                    ? ey({
                                        machine: "backStuck",
                                        type: "STUCK_START",
                                      })
                                    : t === a && n === a
                                    ? ey({
                                        machine: "frontStuck",
                                        type: "STUCK_START",
                                      })
                                    : n0.current
                                    ? ey({
                                        machine: "frontStuck",
                                        type: "STUCK_END",
                                      })
                                    : nJ.current &&
                                      ey({
                                        machine: "backStuck",
                                        type: "STUCK_END",
                                      }),
                                    (t7.current = e),
                                    null == u ||
                                      u({
                                        start: t,
                                        end: n,
                                      }),
                                    t === n &&
                                      (null === ne.current && eA
                                        ? eA(n)
                                        : t === ne.current &&
                                          (ne.current = null));
                                }
                              });
                          }
                        : function (e) {
                            (t6.current = e[1]),
                              queueMicrotask(function () {
                                var t = e[0],
                                  n = e[1];
                                if (
                                  t !== t7.current[0] ||
                                  n !== t7.current[1]
                                ) {
                                  var a = eJ.length;
                                  t === a && n === a
                                    ? ey({
                                        machine: "frontStuck",
                                        type: "STUCK_START",
                                      })
                                    : n0.current &&
                                      ey({
                                        machine: "frontStuck",
                                        type: "STUCK_END",
                                      }),
                                    (t7.current = e),
                                    null == u ||
                                      u({
                                        start: t,
                                        end: n,
                                      }),
                                    t === n &&
                                      (null === ne.current && eA
                                        ? eA(n)
                                        : t === ne.current &&
                                          (ne.current = null));
                                }
                              });
                          }),
                  e
                );
              },
              [u, tn, eA, ts, to, eJ.length, ey]
            ),
            nO = (0, b.useCallback)(
              function (e) {
                var t;
                nd({
                  destinationDetent:
                    "front" === e ? tH.current.detentMarkers.length : 1,
                  runTravelCallbacksAndAnimations: !1,
                }),
                  eQ() &&
                    (null === (t = eX.current) ||
                      void 0 === t ||
                      t.style.setProperty("overflow", "hidden"),
                    setTimeout(
                      function () {
                        var e;
                        null === (e = eX.current) ||
                          void 0 === e ||
                          e.style.removeProperty("overflow");
                      },
                      CSS.supports("overscroll-behavior", "none") ? 1 : 10
                    )),
                  (nn.current = !1);
              },
              [nd]
            ),
            nD = (0, b.useCallback)(
              function (e, t) {
                var n,
                  a,
                  r = t7.current[0],
                  i = null != t ? t : null;
                return (
                  null === i &&
                    (i =
                      "up" === (null != e ? e : "up")
                        ? (n = t7.current[0]) < eJ.length
                          ? n + 1
                          : 1
                        : (a = t7.current[0]) > 1
                        ? a - 1
                        : eJ.length),
                  0 === i || i === r ? null : i
                );
              },
              [eJ]
            ),
            nI = (0, b.useCallback)(
              function (e) {
                var t = e.direction,
                  n = e.detent,
                  a = e.behavior,
                  r = function () {
                    var e = nD(t, n);
                    e &&
                      ey({
                        type: "ACTUALLY_STEP",
                        detent: e,
                        behavior: a,
                      });
                  };
                eb.silent.matches(
                  "openness:open.scroll:ended.afterPaintEffectsRun:true"
                )
                  ? r()
                  : (n5.current = r);
              },
              [eb.silent, nD, ey]
            ),
            nR = (0, b.useCallback)(
              function (e, t) {
                (ne.current = e),
                  null == eA || eA(e),
                  nd({
                    destinationDetent: e,
                    behavior: null != t ? t : te.skip ? "instant" : "smooth",
                    animationConfig: te,
                    travelEndCallback: function () {
                      return ey({
                        machine: "staging",
                        type: "NEXT",
                      });
                    },
                  });
              },
              [eA, nd, te, ey]
            ),
            nj = (0, b.useCallback)(function (e, t, n, a) {
              var r;
              if ("auto" === e) {
                var i = "center" === a ? n + (t - n) / 2 : n;
                r =
                  "chromium" === ec
                    ? i <= 1440
                      ? 70 + 0.25 * i
                      : 0.3 * i
                    : eQ()
                    ? "ios" === eu || "ipados" === eu
                      ? i <= 716
                        ? 15 + 0.1 * i
                        : 0.12 * i
                      : 0.5 * i
                    : 10;
              } else if ("function" == typeof e) {
                var o = parseInt(e(n), 10);
                r = o < 1 ? 1 : o > n / 2 ? n / 2 : o;
              } else "initial" === e && (r = 1);
              return r;
            }, []),
            nN = (0, b.useCallback)(function () {
              if (eG.current) {
                var e = function (e, t) {
                  return eG.current.style.setProperty(e, t);
                };
                e("--silk-aD", tH.current.view.travelAxis.px),
                  e("--silk-aE", tH.current.view.crossAxis.px),
                  e("--silk-aF", tH.current.content.travelAxis.px),
                  e("--silk-aG", tH.current.content.crossAxis.px),
                  e("--silk-aH", tH.current.frontSpacer.travelAxis.px),
                  e("--silk-aI", tH.current.backSpacer.travelAxis.px),
                  e("--silk-aJ", tH.current.snapOutAccelerator.travelAxis.px),
                  e("--silk-aK", tH.current.detentMarkers[0].travelAxis.px);
              }
            }, []),
            nM = (0, b.useCallback)(
              function (e) {
                var t = eG.current,
                  n = eK.current,
                  a = [];
                eZ.current.forEach(function (e) {
                  a.push(window.getComputedStyle(e));
                });
                var r = function (e) {
                    return parseInt(e, 10);
                  },
                  i = function (e) {
                    return "right" === e2 ||
                      "left" === e2 ||
                      "horizontal" === e2
                      ? "travelAxis" === e
                        ? "width"
                        : "height"
                      : "travelAxis" === e
                      ? "height"
                      : "width";
                  },
                  o = function (e) {
                    var t, n, a, o, s, l;
                    return (
                      (n = parseFloat(
                        (t = e.getPropertyValue(i("travelAxis")))
                      )),
                      (a = r(t)),
                      (s = r((o = e.getPropertyValue(i("crossAxis"))))),
                      (l = r(o)),
                      {
                        travelAxis: {
                          px: t,
                          unitless: n,
                          unitlessRoundedDown: a,
                        },
                        crossAxis: {
                          px: o,
                          unitless: s,
                          unitlessRoundedDown: l,
                        },
                      }
                    );
                  },
                  s = function () {
                    var e = window.getComputedStyle(eG.current),
                      t = window.getComputedStyle(eK.current),
                      n = 0;
                    t0(function (e) {
                      return e + 1;
                    }),
                      (tH.current = {
                        view: ei({}, o(e)),
                        scroll: {},
                        snapOutAccelerator: {
                          travelAxis: {},
                        },
                        frontSpacer: {
                          travelAxis: {},
                        },
                        backSpacer: {
                          travelAxis: {},
                        },
                        content: ei({}, o(t)),
                        detentMarkers: (0, p.A)(
                          a.map(function (e, t) {
                            var r = o(e);
                            return (
                              t !== a.length - 1 &&
                                (n += r.travelAxis.unitless),
                              ei(
                                ei({}, r),
                                {},
                                {
                                  accumulatedOffsets: {
                                    travelAxis: {
                                      px: n + "px",
                                      unitless: n,
                                      unitlessRoundedDown: null,
                                    },
                                  },
                                }
                              )
                            );
                          })
                        ),
                        progressValueAtDetents: [],
                      });
                    var i = tH.current;
                    i.scroll = i.view;
                    var s = nj(
                      C,
                      i.view.travelAxis.unitless,
                      i.content.travelAxis.unitless,
                      e5
                    );
                    (i.snapOutAccelerator.travelAxis.px = s + "px"),
                      (i.snapOutAccelerator.travelAxis.unitless = s),
                      (i.snapOutAccelerator.travelAxis.unitlessRoundedDown =
                        r(s));
                    var l = i.detentMarkers.length,
                      c = i.content.travelAxis.unitless - n;
                    i.detentMarkers[l - 1] = {
                      travelAxis: {
                        px: c + "px",
                        unitless: c,
                        unitlessRoundedDown: null,
                      },
                      crossAxis: {
                        px: "1px",
                        unitless: 1,
                        unitlessRoundedDown: 1,
                      },
                      accumulatedOffsets: {
                        travelAxis: {
                          px: n + c + "px",
                          unitless: n + c,
                          unitlessRoundedDown: null,
                        },
                      },
                    };
                    var u,
                      d,
                      A,
                      f = function (e) {
                        return {
                          before: e(-2.1),
                          exact: e(0),
                          after: e(2.1),
                        };
                      },
                      m = i.content.travelAxis.unitless,
                      h = [
                        f(function (e) {
                          return e / m;
                        }),
                      ];
                    i.detentMarkers.slice(0, -1).forEach(function (e) {
                      var t = e.accumulatedOffsets.travelAxis.unitless;
                      h.push(
                        f(function (e) {
                          return (t + e) / m;
                        })
                      );
                    }),
                      h.push(
                        f(function (e) {
                          return (m + e) / m;
                        })
                      ),
                      (A = h[e0]);
                    var g =
                        t9.current.length > 0 ? t9.current[t7.current[1]] : 0,
                      v = (function (e, t) {
                        for (var n = 0, a = 1; a < t.length; a++)
                          Math.abs(t[a] - e) < Math.abs(t[n] - e) && (n = a);
                        return n;
                      })(
                        null != g ? g : 1,
                        h.map(function (e) {
                          return e.exact;
                        })
                      );
                    nP([v, v]),
                      (i.progressValueAtDetents = h),
                      (i.exactProgressValueAtDetents = h.map(function (e) {
                        return e.exact;
                      })),
                      (t9.current = i.progressValueAtDetents.map(function (e) {
                        return e.exact;
                      })),
                      (i.progressValueAtInitialDetent = A),
                      (u = tl
                        ? "horizontal" === e2 || "vertical" === e2
                          ? i.view.travelAxis.unitless / 2 + 1
                          : 1
                        : to
                        ? i.content.travelAxis.unitless -
                          tH.current.detentMarkers[0].travelAxis.unitless +
                          tk
                        : "horizontal" === e2 || "vertical" === e2
                        ? i.view.travelAxis.unitless / 2 +
                          i.view.travelAxis.unitless -
                          (i.view.travelAxis.unitless -
                            i.content.travelAxis.unitless) /
                            2 +
                          i.snapOutAccelerator.travelAxis.unitless
                        : "center" === e5
                        ? i.view.travelAxis.unitless -
                          (i.view.travelAxis.unitless -
                            i.content.travelAxis.unitless) /
                            2 +
                          i.snapOutAccelerator.travelAxis.unitless
                        : i.view.travelAxis.unitless -
                          (i.view.travelAxis.unitless -
                            i.content.travelAxis.unitless) +
                          i.snapOutAccelerator.travelAxis.unitless),
                      (i.frontSpacer.travelAxis.unitless = u),
                      (i.frontSpacer.travelAxis.px = u + "px"),
                      (d =
                        !0 === tn && "auto" === S
                          ? i.view.travelAxis.unitless + tk
                          : "horizontal" === e2 || "vertical" === e2
                          ? tl
                            ? i.view.travelAxis.unitless / 2
                            : i.view.travelAxis.unitless / 2 +
                              i.view.travelAxis.unitless -
                              (i.view.travelAxis.unitless -
                                i.content.travelAxis.unitless) /
                                2 +
                              i.snapOutAccelerator.travelAxis.unitless
                          : i.view.travelAxis.unitless),
                      (i.backSpacer.travelAxis.unitless = d),
                      (i.backSpacer.travelAxis.px = d + "px"),
                      nN(),
                      t8(function () {
                        return function () {
                          if (!eG.current)
                            return {
                              top: null,
                              bottom: null,
                            };
                          var e,
                            t,
                            n = eG.current.getBoundingClientRect(),
                            a = n.top,
                            r = n.bottom,
                            o = e3 || "top" === e2 || "bottom" === e2,
                            s = i.view[o ? "travelAxis" : "crossAxis"].unitless,
                            l =
                              i.content[o ? "travelAxis" : "crossAxis"]
                                .unitless;
                          return (
                            "left" === e5 || "right" === e5 || "center" === e5
                              ? ((e = a + (s - l) / 2), (t = r - (s - l) / 2))
                              : "top" === e5
                              ? ((e = a), (t = r - (s - l)))
                              : "bottom" === e5 && ((e = a + (s - l)), (t = r)),
                            {
                              top: e,
                              bottom: t,
                            }
                          );
                        };
                      });
                  };
                s();
                var l = function (e, t) {
                    var n = new ResizeObserver(function (e) {
                      e.forEach(function () {
                        return t();
                      });
                    });
                    return (
                      n.observe(e, {
                        box: "border-box",
                      }),
                      n
                    );
                  },
                  c = function () {
                    s(),
                      nd({
                        runTravelCallbacksAndAnimations: !1,
                      });
                  },
                  u = !0,
                  d = l(t, function () {
                    u ? (u = !1) : c();
                  }),
                  A = !0,
                  f = l(n, function () {
                    A ? (s(), (A = !1)) : c();
                  });
                return function () {
                  d && t && (d.unobserve(t), d.disconnect()),
                    f && n && (f.unobserve(n), f.disconnect());
                };
              },
              [e2, nj, C, e0, tn, nN, tk, S, nd, nP, e5, to, tl, eJ]
            ),
            nB = (0, b.useCallback)(
              function (e) {
                var t,
                  n = 0,
                  a = e,
                  r = 0;
                return function (e) {
                  t = e;
                  var i = a - e;
                  return (
                    (n = i),
                    (0 === i || Math.abs(i) < Math.abs(r / 2)) &&
                      eb.silent.matches("scrollContainerTouch:ongoing") &&
                      ((t = a - r / 2), (n = a - t)),
                    Math.abs(n) >= 0.1 &&
                      0.35 > Math.abs(n) &&
                      ((t = n >= 0 ? a - 0.1 : a + 0.1),
                      (n = n >= 0 ? 0.1 : -0.1)),
                    e <= 0 && (t = 0),
                    (a = t),
                    (r = n),
                    t
                  );
                };
              },
              [eb.silent]
            ),
            nF = (0, b.useCallback)(
              function () {
                var e =
                    "right" === e2 || "left" === e2 || "horizontal" === e2
                      ? "scrollLeft"
                      : "scrollTop",
                  t = eX.current,
                  n = tH.current.snapOutAccelerator.travelAxis.unitless,
                  a = tH.current.content.travelAxis.unitless,
                  r = tH.current.scroll.travelAxis.unitless,
                  i = nB(
                    null !== (l = nU.current) && void 0 !== l
                      ? l
                      : tH.current.progressValueAtDetents[t7.current[1]].exact
                  ),
                  o = "right" === e2 || "bottom" === e2,
                  s = "left" === e2 || "top" === e2;
                if (o || s) {
                  if (tl)
                    d = s
                      ? function (e) {
                          return 1 - e / a;
                        }
                      : function (e) {
                          return 1 + e / a;
                        };
                  else if (o) {
                    if ("center" !== e5) {
                      var l,
                        c,
                        u,
                        d,
                        A = to
                          ? tH.current.detentMarkers[0].travelAxis.unitless - tk
                          : -n;
                      d = function (e) {
                        return (e + A) / a;
                      };
                    } else {
                      var f = a + (r - a) / 2;
                      d = function (e) {
                        return (e - n) / f;
                      };
                    }
                  } else if (s) {
                    if ("center" !== e5)
                      d = function (e) {
                        return (a + tk - e) / a;
                      };
                    else {
                      var p = a + (r - a) / 2;
                      d = function (e) {
                        return (p + tk - e) / p;
                      };
                    }
                  }
                  var m = !0 === tn ? 1 : 10,
                    h =
                      !0 === tn && to
                        ? tH.current.progressValueAtDetents[1].exact
                        : 0;
                  u = function () {
                    return (
                      (c = t[e]),
                      Math.min(
                        Math.max(i(Math.min(Math.max(d(c), h), m)), h),
                        m
                      )
                    );
                  };
                } else if ("horizontal" === e2 || "vertical" === e2) {
                  var g = (r - a) / 2,
                    v = tl ? 0 : n + r - g,
                    b = a + g;
                  u = function () {
                    return Math.max(
                      i(Math.max(1 - Math.abs((c = t[e]) - v) / b, 0)),
                      0
                    );
                  };
                }
                return u;
              },
              [e2, nB, tn, tl, e5, to, tk, tZ]
            ),
            nL = (0, b.useRef)(),
            nQ = (0, b.useCallback)(
              function () {
                var e = eX.current,
                  t = function () {
                    ey({
                      machine: "openness:open.move",
                      type: "MOVE_END",
                    });
                    for (
                      var e = 0;
                      e < tH.current.progressValueAtDetents.length;
                      e++
                    ) {
                      var t = tH.current.progressValueAtDetents[e].exact;
                      nU.current > t - 0.01 &&
                        nU.current < t + 0.01 &&
                        (ey({
                          machine: "openness:open.scroll",
                          type: "SCROLL_END",
                        }),
                        ey({
                          machine: "openness:open.swipe",
                          type: "SWIPE_END",
                        }));
                    }
                  },
                  n = function () {
                    na.current
                      ? nu(!1)
                      : (n2.current ||
                          ey({
                            machine: "openness:open.scroll",
                            type: "SCROLL_START",
                          }),
                        n0.current ||
                          nJ.current ||
                          (n4.current ||
                            ey({
                              machine: "openness:open.swipe",
                              type: "SWIPE_START",
                            }),
                          n3.current ||
                            ey({
                              machine: "openness:open.move",
                              type: "MOVE_START",
                            }))),
                      clearTimeout(nL.current),
                      (nL.current = setTimeout(t, 200));
                  };
                return (
                  e.addEventListener("scroll", n),
                  function () {
                    e.removeEventListener("scroll", n),
                      clearTimeout(nL.current);
                  }
                );
              },
              [ey, nu]
            ),
            nU = (0, b.useRef)(null),
            nW = (0, b.useCallback)(
              function () {
                var e;
                if (tG) {
                  var t = tH.current.progressValueAtDetents,
                    n = t.length,
                    a = nF();
                  e = no(function () {
                    var e,
                      r = a();
                    if (nU.current !== r) {
                      for (var i = 0; i < n; i++) {
                        var o = t[i],
                          s = o.after;
                        r > s && i + 1 < n && r < t[i + 1].before
                          ? ((e = {
                              start: i,
                              end: i + 1,
                            }),
                            nP([i, i + 1]))
                          : r > o.before && r < s
                          ? ((e = {
                              start: i,
                              end: i,
                            }),
                            nP([i, i]))
                          : r <= 0 &&
                            ((e = {
                              start: 0,
                              end: 0,
                            }),
                            nP([0, 0]));
                      }
                      nt.current(r, e), (nU.current = r);
                    }
                  });
                }
                return function () {
                  null == e || e();
                };
              },
              [nP, tG, nF]
            ),
            nG = (0, b.useCallback)(function (e) {
              var t = 1e5,
                n = function e(n) {
                  t < Math.abs(n.deltaY)
                    ? window.removeEventListener("wheel", e, {
                        passive: !1,
                      })
                    : n.preventDefault(),
                    (t = Math.abs(n.deltaY));
                };
              return (
                window.addEventListener("wheel", n, {
                  passive: !1,
                }),
                setTimeout(function () {
                  e("SWIPED_OUT");
                }, 100),
                function () {
                  return window.removeEventListener("wheel", n, {
                    passive: !1,
                  });
                }
              );
            }, []),
            n_ = (0, b.useCallback)(
              function (e, t) {
                var n,
                  a = t.send,
                  r = eG.current,
                  i = eK.current,
                  o = eX.current,
                  s = !1,
                  l = function () {
                    return (s = !0);
                  };
                window.addEventListener("wheel", l, {
                  passive: !0,
                  once: !0,
                });
                var c = new IntersectionObserver(
                  function (e) {
                    var t,
                      l = en(e);
                    try {
                      for (l.s(); !(t = l.n()).done; )
                        t.value.isIntersecting ||
                          (r.style.setProperty(
                            "pointer-events",
                            "none",
                            "important"
                          ),
                          r.style.setProperty("opacity", "0", "important"),
                          r.style.setProperty("position", "fixed", "important"),
                          r.style.setProperty("top", "-100px", "important"),
                          r.style.setProperty("left", "-100px", "important"),
                          i.style.setProperty(
                            "pointer-events",
                            "none",
                            "important"
                          ),
                          o.style.setProperty("width", "1px", "important"),
                          o.style.setProperty("height", "1px", "important"),
                          o.style.setProperty(
                            "clip-path",
                            "inset(0)",
                            "important"
                          ),
                          requestAnimationFrame(function () {
                            s ? (n = nG(a)) : a("SWIPED_OUT");
                          }));
                    } catch (e) {
                      l.e(e);
                    } finally {
                      l.f();
                    }
                  },
                  {
                    root: r,
                    threshold: [0],
                  }
                );
                return (
                  c.observe(i),
                  function () {
                    null == n || n(),
                      window.removeEventListener("wheel", l, {
                        passive: !0,
                        once: !0,
                      }),
                      c && (c.unobserve(i), c.disconnect());
                  }
                );
              },
              [nG]
            ),
            nV = (0, b.useRef)(function () {
              return 0;
            }),
            nY = (0, b.useCallback)(
              function () {
                var e = eG.current,
                  t = function (e) {
                    eI({
                      nativeEvent: e,
                      defaultBehavior: {},
                      handler: B,
                    });
                  };
                return (
                  null == e ||
                    e.addEventListener("focus", t, {
                      capture: !0,
                    }),
                  function () {
                    null == e ||
                      e.removeEventListener("focus", t, {
                        capture: !0,
                      });
                  }
                );
              },
              [B]
            ),
            nX = (0, b.useCallback)(
              function (e) {
                eX.current.contains(e.target) &&
                  ey({
                    machine: "scrollContainerTouch",
                    type: "TOUCH_START",
                  });
              },
              [ey]
            ),
            nz = (0, b.useCallback)(
              function (e) {
                eX.current.contains(e.target) &&
                  ey({
                    machine: "scrollContainerTouch",
                    type: "TOUCH_END",
                  });
              },
              [ey]
            );
          tD("immediate", ew, {
            state: "staging:none",
            callback: nw,
            params: {
              newState: "none",
            },
          }),
            tI(ew, {
              state: "staging:none",
              transition: "OPEN",
              callback: (0, b.useCallback)(
                function () {
                  return null == tE
                    ? void 0
                    : tE.sendToOpennessMachine({
                        machine: "staging",
                        type: "GO_DOWN",
                        skipOpening: null == e8 ? void 0 : e8.skip,
                      });
                },
                [tE, null == e8 ? void 0 : e8.skip]
              ),
            }),
            tI(ew, {
              state: "staging:none",
              transition: "OPEN_PREPARED",
              callback: (0, b.useCallback)(
                function (e) {
                  return null == tE
                    ? void 0
                    : tE.sendToOpennessMachine({
                        machine: "staging",
                        type: "GO_DOWN",
                        skipOpening: e.skipOpening,
                      });
                },
                [tE]
              ),
            }),
            tI(ew, {
              state: "staging:none",
              transition: "GO_DOWN",
              callback: (0, b.useCallback)(
                function (e) {
                  return null == tE
                    ? void 0
                    : tE.sendToOpennessMachine({
                        machine: "staging",
                        type: "GO_DOWN",
                        skipOpening: e.skipOpening,
                      });
                },
                [tE]
              ),
            }),
            tI(ew, {
              state: "staging:none",
              transition: "ACTUALLY_CLOSE",
              callback: (0, b.useCallback)(
                function () {
                  return null == tE
                    ? void 0
                    : tE.sendToOpennessMachine({
                        machine: "staging",
                        type: "GO_UP",
                      });
                },
                [tE]
              ),
            }),
            tI(ew, {
              state: "staging:none",
              transition: "GO_UP",
              callback: (0, b.useCallback)(
                function (e) {
                  return null == tE
                    ? void 0
                    : tE.sendToOpennessMachine({
                        machine: "staging",
                        type: "GO_UP",
                        skipClosing: e.skipClosing,
                      });
                },
                [tE]
              ),
            }),
            tD("immediate", ew, {
              state: "staging:open",
              callback: nw,
              params: {
                newState: "open",
              },
            }),
            tD("immediate", ew, {
              state: "staging:open",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "longRunning",
                    type: "TO_TRUE",
                  });
                },
                [ey]
              ),
            }),
            tD("immediate", ew, {
              state: "staging:open",
              callback: (0, b.useCallback)(
                function () {
                  $ || null == ee || ee(!0);
                },
                [$, ee]
              ),
            }),
            tD("after-paint", ew, {
              state: "staging:open",
              callback: (0, b.useCallback)(
                function () {
                  requestAnimationFrame(function () {
                    ey({
                      machine: "openness",
                      type: "READY_TO_OPEN",
                      skipOpening: !0,
                    }),
                      ey({
                        machine: "staging",
                        type: "NEXT",
                      });
                  });
                },
                [ey]
              ),
            }),
            tI(ew, {
              state: "staging:open",
              transition: "NEXT",
              callback: nx,
            }),
            tD("immediate", ew, {
              state: "staging:opening",
              callback: nw,
              params: {
                newState: "opening",
              },
            }),
            tD("immediate", ew, {
              state: "staging:opening",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "longRunning",
                    type: "TO_TRUE",
                  });
                },
                [ey]
              ),
            }),
            tD("immediate", ew, {
              state: "staging:opening",
              callback: (0, b.useCallback)(
                function () {
                  $ || null == ee || ee(!0);
                },
                [$, ee]
              ),
            }),
            tD("before-paint", ew, {
              state: "staging:opening",
              callback: (0, b.useCallback)(
                function () {
                  null == x || x(),
                    tQ(0, {
                      start: 0,
                      end: 0,
                    });
                },
                [tQ, x]
              ),
            }),
            tD("after-paint", ew, {
              state: "staging:opening",
              callback: (0, b.useCallback)(
                function () {
                  requestAnimationFrame(function () {
                    ey({
                      machine: "openness",
                      type: "READY_TO_OPEN",
                      skipOpening: !1,
                    });
                  });
                },
                [ey]
              ),
            }),
            tj("after-paint", ew, {
              state: "staging:opening",
              callback: (0, b.useCallback)(
                function () {
                  return (
                    e7(ef),
                    function () {
                      return e6(ef);
                    }
                  );
                },
                [ef]
              ),
            }),
            tI(ew, {
              state: "staging:opening",
              transition: "NEXT",
              callback: nx,
            }),
            tD("immediate", ew, {
              state: "staging:stepping",
              callback: nw,
              params: {
                newState: "stepping",
              },
            }),
            tD("after-paint", ew, {
              state: "staging:stepping",
              callback: (0, b.useCallback)(
                function (e) {
                  var t = e.detent,
                    n = e.behavior;
                  null == c || c("stepping"), nR(t, n);
                },
                [c, nR]
              ),
            }),
            tR("immediate", ew, {
              state: "staging:stepping",
              callback: (0, b.useCallback)(
                function () {
                  null == c || c("idleInside");
                },
                [c]
              ),
            }),
            tD("immediate", ew, {
              state: "staging:closing",
              callback: nw,
              params: {
                newState: "closing",
              },
            }),
            tD("immediate", ew, {
              state: "staging:closing",
              callback: (0, b.useCallback)(
                function () {
                  $ && (null == ee || ee(!1));
                },
                [$, ee]
              ),
            }),
            tD("after-paint", ew, {
              state: "staging:closing",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "openness",
                    type: "READY_TO_CLOSE",
                  });
                },
                [ey]
              ),
            }),
            tI(ew, {
              state: "staging:closing",
              transition: "NEXT",
              callback: nx,
            }),
            tD("immediate", ew, {
              state: "staging:go-down",
              callback: nw,
              params: {
                newState: "go-down",
              },
            }),
            tI(ew, {
              state: "staging:go-down",
              transition: "NEXT",
              callback: nx,
            }),
            tD("immediate", ew, {
              state: "staging:going-down",
              callback: nw,
              params: {
                newState: "going-down",
              },
            }),
            tI(ew, {
              state: "staging:going-down",
              transition: "NEXT",
              callback: nx,
            }),
            tD("immediate", ew, {
              state: "staging:going-up",
              callback: nw,
              params: {
                newState: "going-up",
              },
            }),
            tI(ew, {
              state: "staging:going-up",
              transition: "NEXT",
              callback: nx,
            });
          var nH = tP(eb, "longRunning");
          tD("immediate", nH, {
            state: "longRunning:true",
            callback: (0, b.useCallback)(
              function () {
                null === et.current && (et.current = document.activeElement);
              },
              [et]
            ),
          }),
            tD("immediate", nH, {
              state: "longRunning:true",
              callback: (0, b.useCallback)(
                function () {
                  er(!0),
                    null == eO ||
                      eO(function (e) {
                        return e + 1;
                      });
                },
                [er, eO]
              ),
            }),
            tj("before-paint", nH, {
              state: "longRunning:true",
              callback: nM,
            }),
            tD("before-paint", nH, {
              state: "longRunning:true",
              guard: !e8.skip,
              callback: (0, b.useCallback)(
                function () {
                  nd({
                    trackToTravelOn: e4,
                    runTravelCallbacksAndAnimations: !1,
                    destinationDetent: 0,
                  });
                },
                [nd, e4]
              ),
            }),
            tj("after-paint", nH, {
              state: "longRunning:true",
              guard: R,
              callback: (0, b.useCallback)(
                function () {
                  return tF(eV, j);
                },
                [j]
              ),
            }),
            tj("after-paint", nH, {
              state: "longRunning:true",
              callback: nf,
            }),
            tD("immediate", nH, {
              state: "longRunning:false",
              callback: (0, b.useCallback)(
                function () {
                  er(!1),
                    null == eO ||
                      eO(function (e) {
                        return e - 1;
                      });
                },
                [er, eO]
              ),
            }),
            tD("immediate", nH, {
              state: "longRunning:false",
              callback: (0, b.useCallback)(
                function () {
                  et.current = null;
                },
                [et]
              ),
            }),
            tD("before-paint", nH, {
              state: "longRunning:false",
              callback: (0, b.useCallback)(
                function () {
                  th.removeAllOutletPersistedStylesFromSheet(ef);
                },
                [ef]
              ),
            }),
            tD("after-paint", nH, {
              state: "longRunning:false",
              callback: np,
            }),
            tj("before-paint", nk, {
              state: "active:true",
              callback: nA,
            });
          var nK = tP(eb, "openness"),
            nq = tP(eb, "openness:closed.status");
          tD("immediate", nK, {
            state: "openness:closed",
            callback: nT,
            params: {
              newState: "idleOutside",
            },
          }),
            tD("immediate", nK, {
              state: "openness:closed",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "longRunning",
                    type: "TO_FALSE",
                  });
                },
                [ey]
              ),
            }),
            tD("immediate", nK, {
              state: "openness:closed",
              callback: (0, b.useCallback)(
                function () {
                  $ && (null == ee || ee(!1));
                },
                [$, ee]
              ),
            }),
            tD("immediate", nK, {
              state: "openness:closed",
              callback: (0, b.useCallback)(
                function () {
                  ek({
                    machine: "active",
                    type: "TO_FALSE",
                  });
                },
                [ek]
              ),
            }),
            tD("after-paint", nK, {
              state: "openness:closed",
              callback: (0, b.useCallback)(
                function () {
                  clearTimeout(nL.current),
                    (nU.current = null),
                    nP([0, 0]),
                    (tU.current = !1),
                    ex(-1),
                    (nn.current = !1);
                },
                [ex, nP]
              ),
            }),
            tI(nK, {
              state: "openness:closed",
              transition: "READY_TO_OPEN",
              callback: (0, b.useCallback)(
                function (e) {
                  ek({
                    machine: "position",
                    type: "READY_TO_GO_FRONT",
                    skipOpening: e.skipOpening,
                  });
                },
                [ek]
              ),
            }),
            tT(ey, nq, "openness:closed.status:pending", {
              delay: 3e3,
            }),
            tR("immediate", nq, {
              state: "openness:closed.status:pending",
              callback: (0, b.useCallback)(
                function () {
                  ey("SWIPE_RESET");
                },
                [ey]
              ),
            }),
            tD("before-paint", nq, {
              state: "openness:closed.status:flushing-to-preparing-opening",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "openness:closed.status",
                    type: "",
                  });
                },
                [ey]
              ),
            }),
            tD("before-paint", nq, {
              state: "openness:closed.status:flushing-to-preparing-open",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "openness:closed.status",
                    type: "",
                  });
                },
                [ey]
              ),
            }),
            tD("after-paint", nq, {
              state: "openness:closed.status:preparing-opening",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "staging",
                    type: "OPEN_PREPARED",
                    skipOpening: !1,
                  });
                },
                [ey]
              ),
            }),
            tD("after-paint", nq, {
              state: "openness:closed.status:preparing-open",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "staging",
                    type: "OPEN_PREPARED",
                    skipOpening: !0,
                  });
                },
                [ey]
              ),
            }),
            tD("immediate", nq, {
              state: "openness:closed.status:safe-to-unmount",
              callback: (0, b.useCallback)(
                function () {
                  null == ea || ea(!0);
                },
                [ea]
              ),
            }),
            tR("immediate", nq, {
              state: "openness:closed.status:safe-to-unmount",
              callback: (0, b.useCallback)(
                function () {
                  null == ea || ea(!1);
                },
                [ea]
              ),
            }),
            tD("immediate", nK, {
              state: "openness:opening",
              callback: nT,
              params: {
                newState: "entering",
              },
            }),
            tD("before-paint", nK, {
              state: "openness:opening",
              callback: (0, b.useCallback)(
                function () {
                  (ne.current = e0),
                    null == eA || eA(e0),
                    nd({
                      trackToTravelOn: e4,
                      destinationDetent: e0,
                      behavior: "smooth",
                      animationConfig: e8,
                      travelEndCallback: function () {
                        return ey("NEXT");
                      },
                      runOnTravelStart: !1,
                    });
                },
                [e4, eA, nd, e0, e8, ey]
              ),
            }),
            tI(nK, {
              state: "openness:opening",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  ek("NEXT"),
                    ey({
                      machine: "staging",
                      type: "NEXT",
                    });
                },
                [ek, ey]
              ),
            }),
            tD("immediate", nK, {
              state: "openness:open",
              callback: nT,
              params: {
                newState: "idleInside",
              },
            }),
            tD("immediate", nK, {
              state: "openness:open",
              callback: (0, b.useCallback)(
                function () {
                  ek({
                    machine: "active",
                    type: "TO_TRUE",
                  });
                },
                [ek]
              ),
            }),
            tD("before-paint", nK, {
              state: "openness:open",
              guard: e8.skip,
              callback: (0, b.useCallback)(
                function () {
                  (ne.current = e0),
                    null == eA || eA(e0),
                    nd({
                      trackToTravelOn: e4,
                      destinationDetent: e0,
                    });
                },
                [e0, eA, nd, e4]
              ),
            }),
            tj("before-paint", nK, {
              state: "openness:open",
              callback: (0, b.useCallback)(
                function () {
                  if (eQ() && tt) {
                    var e;
                    null === (e = eX.current) ||
                      void 0 === e ||
                      e.style.setProperty("will-change", "transform"),
                      requestAnimationFrame(function () {
                        var e;
                        return null === (e = eX.current) || void 0 === e
                          ? void 0
                          : e.style.removeProperty("will-change", "transform");
                      });
                  }
                },
                [tt]
              ),
              params: {
                unusedDep: tZ,
              },
            }),
            tj("before-paint", nK, {
              state: "openness:open",
              guard: !ti,
              callback: nQ,
            }),
            tD("after-paint", ew, {
              state: "staging:open",
              guard: !0 === tn && "auto" === S,
              callback: (0, b.useCallback)(
                function () {
                  e0 === eJ.length
                    ? ey({
                        machine: "frontStuck",
                        type: "STUCK_START",
                      })
                    : tt &&
                      1 === e0 &&
                      ey({
                        machine: "backStuck",
                        type: "STUCK_START",
                      });
                },
                [ey, e0, eJ, tt]
              ),
            }),
            tj("after-paint", nK, {
              state: "openness:open",
              guard: !ti && !tl && !to,
              callback: n_,
              params: {
                send: ey,
              },
            }),
            tj("after-paint", nK, {
              state: "openness:open",
              callback: nY,
            }),
            tI(nK, {
              state: "openness:open",
              transition: "READY_TO_CLOSE",
              callback: (0, b.useCallback)(
                function () {
                  return ek("READY_TO_GO_OUT");
                },
                [ek]
              ),
            }),
            tI(nK, {
              state: "openness:open",
              transition: "ACTUALLY_CLOSE",
              callback: (0, b.useCallback)(
                function () {
                  (ne.current = null),
                    null == eA || eA(0),
                    null == x || x(),
                    ek("GO_OUT");
                },
                [eA, x, ek]
              ),
            }),
            tI(nK, {
              state: "openness:open",
              transition: "SWIPED_OUT",
              callback: (0, b.useCallback)(
                function () {
                  var e;
                  null === (e = eX.current) ||
                    void 0 === e ||
                    e.style.setProperty(
                      "scroll-snap-type",
                      "none",
                      "important"
                    ),
                    (ne.current = null),
                    null == eA || eA(0),
                    ek("GO_OUT");
                },
                [eA, ek]
              ),
            }),
            tR("immediate", nK, {
              state: "openness:open",
              callback: (0, b.useCallback)(
                function () {
                  ey("SWIPE_END");
                },
                [ey]
              ),
            });
          var nZ = tP(eb, "backStuck"),
            nJ = (0, b.useRef)(!1);
          tI(nZ, {
            state: "backStuck:false",
            transition: "STUCK_START",
            callback: (0, b.useCallback)(function () {
              return (nJ.current = !0);
            }, []),
          }),
            tI(nZ, {
              state: "backStuck:true",
              transition: "STUCK_END",
              callback: (0, b.useCallback)(function () {
                return (nJ.current = !1);
              }, []),
            }),
            tI(nZ, {
              state: "backStuck:false",
              transition: "STUCK_START",
              guard: !0 === tn && "auto" === S,
              callback: (0, b.useCallback)(
                function () {
                  eb.silent.matches("scrollContainerTouch:ended") && nO("back");
                },
                [eb.silent, nO]
              ),
            });
          var n$ = tP(eb, "frontStuck"),
            n0 = (0, b.useRef)(!1);
          tI(n$, {
            state: "frontStuck:false",
            transition: "STUCK_START",
            callback: (0, b.useCallback)(function () {
              return (n0.current = !0);
            }, []),
          }),
            tI(n$, {
              state: "frontStuck:true",
              transition: "STUCK_END",
              callback: (0, b.useCallback)(function () {
                return (n0.current = !1);
              }, []),
            }),
            tI(n$, {
              state: "frontStuck:false",
              transition: "STUCK_START",
              guard: !0 === tn && "auto" === S,
              callback: (0, b.useCallback)(
                function () {
                  eb.silent.matches("openness:open") &&
                    eb.silent.matches("scrollContainerTouch:ended") &&
                    nO("front");
                },
                [eb.silent, nO]
              ),
            }),
            tD("immediate", eb, {
              state: "scrollContainerTouch:ended",
              guard: !0 === tn && "auto" === S,
              callback: (0, b.useCallback)(
                function () {
                  nn.current &&
                    setTimeout(function () {
                      requestAnimationFrame(function () {
                        eb.silent.matches("openness:open") &&
                          (eb.silent.matches("backStuck:true")
                            ? nO("back")
                            : eb.silent.matches("frontStuck:true") &&
                              nO("front"));
                      });
                    }, 80);
                },
                [eb.silent, nO]
              ),
            });
          var n1 = tP(eb, "openness:open.scroll"),
            n2 = (0, b.useRef)(!1);
          tD("immediate", n1, {
            state: "openness:open.scroll:ongoing",
            callback: (0, b.useCallback)(function () {
              return (n2.current = !0);
            }, []),
          }),
            tR("immediate", n1, {
              state: "openness:open.scroll:ongoing",
              callback: (0, b.useCallback)(function () {
                return (n2.current = !1);
              }, []),
            }),
            tD("immediate", n1, {
              state: "openness:open.scroll:ongoing",
              callback: (0, b.useCallback)(function () {
                nn.current = !0;
              }, []),
            }),
            tj(
              {
                start: "immediate",
                update: "before-paint",
              },
              n1,
              {
                state: "openness:open.scroll:ongoing",
                callback: nW,
              }
            );
          var n5 = (0, b.useRef)(function () {});
          tD("after-paint", n1, {
            state: "openness:open.scroll:ended",
            callback: (0, b.useCallback)(
              function () {
                ey({
                  machine: "openness:open.scroll:ended.afterPaintEffectsRun",
                  type: "OCCURRED",
                }),
                  n5.current(),
                  (n5.current = function () {});
              },
              [ey]
            ),
          }),
            tR("immediate", n1, {
              state: "openness:open.scroll:ended",
              callback: (0, b.useCallback)(
                function () {
                  ey({
                    machine: "openness:open.scroll:ended.afterPaintEffectsRun",
                    type: "RESET",
                  });
                },
                [ey]
              ),
            });
          var n3 = (0, b.useRef)(!1);
          tD("immediate", eb, {
            state: "openness:open.move:ongoing",
            callback: (0, b.useCallback)(
              function () {
                (n3.current = !0), (nt.current = tG);
              },
              [tG]
            ),
          }),
            tR("immediate", eb, {
              state: "openness:open.move:ongoing",
              callback: (0, b.useCallback)(function () {
                (n3.current = !1), (nt.current = function () {});
              }, []),
            });
          var n4 = (0, b.useRef)(!1);
          tD("immediate", eb, {
            state: "openness:open.swipe:ongoing",
            callback: (0, b.useCallback)(function () {
              return (n4.current = !0);
            }, []),
          }),
            tR("immediate", eb, {
              state: "openness:open.swipe:ongoing",
              callback: (0, b.useCallback)(function () {
                return (n4.current = !1);
              }, []),
            }),
            tD("immediate", eb, {
              state: "openness:open.swipe:ongoing",
              callback: (0, b.useCallback)(
                function () {
                  return null == x ? void 0 : x();
                },
                [x]
              ),
            }),
            tD("immediate", eb, {
              state: "openness:open.swipe:ongoing",
              callback: nT,
              params: {
                newState: "stepping",
              },
            }),
            tD("immediate", eb, {
              state: "openness:open.swipe:ended",
              callback: (0, b.useCallback)(
                function () {
                  return tL();
                },
                [tL]
              ),
            }),
            tD("immediate", eb, {
              state: "openness:open.swipe:ended",
              guard: "function" == typeof c,
              callback: (0, b.useCallback)(
                function () {
                  eb.silent.matches("openness:open") && c("idleInside");
                },
                [eb.silent, c]
              ),
            });
          var n8 = (0, b.useCallback)(
            function () {
              !nS.matches("position:front") ||
              (0 === t7.current[0] && 0 === t7.current[1]) ||
              (tt && t7.current[0] !== t7.current[1])
                ? !1 === $ && (null == ee || ee(!0))
                : ey("ACTUALLY_CLOSE");
            },
            [nS, ey, $, ee, tt]
          );
          tI(eb, {
            state: "openness:open.evaluateCloseMessage:true",
            transition: "CLOSE",
            callback: n8,
          }),
            tI(eb, {
              state: "openness:open.evaluateCloseMessage:false",
              transition: "CLOSE",
              callback: n8,
            }),
            tI(eb, {
              state: "openness:open.evaluateStepMessage:true",
              transition: "STEP",
              callback: nI,
            }),
            tI(eb, {
              state: "openness:open.evaluateStepMessage:false",
              transition: "STEP",
              callback: nI,
            }),
            tD("immediate", nK, {
              state: "openness:closing",
              callback: nT,
              params: {
                newState: "exiting",
              },
            }),
            tD("before-paint", nK, {
              state: "openness:closing",
              callback: (0, b.useCallback)(
                function () {
                  (ne.current = 0),
                    null == eA || eA(0),
                    nd({
                      trackToTravelOn: e9.track,
                      destinationDetent: 0,
                      behavior: "smooth",
                      animationConfig: e9,
                      travelEndCallback: function () {
                        return ey("NEXT");
                      },
                    });
                },
                [eA, nd, e9, ey]
              ),
            }),
            tI(nK, {
              state: "openness:closing",
              transition: "NEXT",
              callback: (0, b.useCallback)(
                function () {
                  ek("NEXT"),
                    ey({
                      machine: "staging",
                      type: "NEXT",
                    });
                },
                [ek, ey]
              ),
            }),
            tj("after-paint", eb, {
              state: "",
              callback: (0, b.useCallback)(
                function () {
                  return ey({
                    machine: "skipOpening",
                    type: e8.skip ? "TO_TRUE" : "TO_FALSE",
                  });
                },
                [ey, e8.skip]
              ),
            }),
            tj("after-paint", eb, {
              state: "",
              callback: (0, b.useCallback)(
                function () {
                  return ey({
                    machine: "skipClosing",
                    type: e9.skip ? "TO_TRUE" : "TO_FALSE",
                  });
                },
                [ey, e9.skip]
              ),
            }),
            (0, b.useEffect)(
              function () {
                void 0 !== $ && ey($ ? "OPEN" : "CLOSE");
              },
              [$, ey]
            );
          var n9 = ni(function () {
              np(),
                null == eR || eR(ef),
                th.removeAllOutletPersistedStylesFromSheet(ef);
            }),
            n7 = (0, b.useRef)(!0),
            n6 = ni(function () {
              $ && (null == ee || ee(!1));
            });
          (0, b.useEffect)(function () {
            return function () {
              !n7.current &&
                (n6(),
                nw(null, {
                  newState: "none",
                }),
                n9(),
                er(!1),
                nH.silent.matches("longRunning:true") &&
                  (null == eO ||
                    eO(function (e) {
                      return e - 1;
                    })));
            };
          }, []),
            (0, b.useEffect)(function () {
              return function () {
                return (n7.current = !1);
              };
            }),
            (0, b.useEffect)(
              function () {
                void 0 !== ed &&
                  t7.current[0] !== ed &&
                  t7.current[1] !== ed &&
                  ne.current !== ed &&
                  ey({
                    type: "STEP",
                    activeDetent: ed,
                  });
              },
              [ed, ey]
            ),
            (0, b.useEffect)(function () {
              var e = function () {
                var e;
                return null === (e = eX.current) || void 0 === e
                  ? void 0
                  : e.scrollTo(0, 0);
              };
              return (
                window.addEventListener("unload", e),
                function () {
                  return window.removeEventListener("unload", e);
                }
              );
            }, []);
          var ae = ni(function (e, t) {
              tS.current && !nK.matches("openness:closed") && tQ(e, t);
            }),
            at = ni(nv);
          (0, b.useEffect)(
            function () {
              return function () {
                ae(0, {
                  start: 0,
                  end: 0,
                }),
                  tS.current && at(),
                  tm(null);
              };
            },
            [nH.silent, eO, ae, at]
          );
          var an = eh("Sheet", {
              staging: ew.getValues()[0],
              openness: nK.getValues()[0],
              opennessClosedStatus: nq.getValues()[0],
              position: nS.getValues()[0],
              positionCoveredStatus: nE.getValues()[0],
              placement: e5,
              track: e2,
              swipeDisabled: ti,
              swipeOutDisabledWithDetent: to,
              swipeOvershootDisabled: tn,
              swipeTrap: tY,
              scrollContainerShouldBePassThrough: tC,
            }),
            aa = (0, b.useMemo)(
              function () {
                return !nq.matches([
                  "openness:closed.status:flushing-to-preparing-open",
                  "openness:closed.status:flushing-to-preparing-opening",
                  "openness:closed.status:safe-to-unmount",
                ]);
              },
              [nq]
            ),
            ar = (0, b.useMemo)(
              function () {
                return nK.matches("openness:closed") && aa;
              },
              [aa, nK]
            ),
            ai = (0, b.useMemo)(
              function () {
                return ew.matches(["staging:opening", "staging:open"]);
              },
              [ew]
            ),
            ao = (0, b.useMemo)(
              function () {
                return aa || ai;
              },
              [aa, ai]
            ),
            as = (0, b.useMemo)(
              function () {
                return (
                  D &&
                  (nS.matches(["position:front", "position:covered"]) ||
                    "none" !== ev)
                );
              },
              [D, nS, ev]
            );
          return (0, g.jsx)(eU, {
            genericContext: t5,
            customContext: Z,
            value: K,
            children: (0, g.jsx)(t3.Provider, {
              value: {
                sheetContext: H,
                titleId: em,
                descriptionId: eg,
                styleAttributes: an,
                backdropRef: eY,
                scrollContainerRef: eX,
                frontSpacerRef: ez,
                contentWrapperRef: eH,
                contentRef: eK,
                backSpacerRef: eq,
                detentMarkersRefs: eZ,
                leftEdgeRef: eV,
                setBackdropSwipeable: tp,
                setBleedingBackgroundPresent: ty,
                detents: eJ,
                longRunningState: nH,
                staging: ev,
                layerCovered: eS,
                placement: e5,
                track: e2,
                travelAxis: tu,
                nativeEdgeSwipePrevention: R,
                bleedingBackgroundPresent: tb,
                setBackdropTravelHandler: tN,
                ancestorPrimarySwipeTrapActiveOnYAxis:
                  "vertical" === tY || "both" === tY,
                scrollContainerTouchStartHandler: nX,
                scrollContainerTouchEndHandler: nz,
                getContentCoordinatesWhenRestingOnLastDetent: t4,
                getOffsetFromCurrentToNextDetent: nV,
              },
              children:
                ao &&
                (0, g.jsxs)(
                  "div",
                  ei(
                    ei(
                      ei(
                        {
                          id: ef,
                        },
                        an(
                          "view",
                          [
                            "track",
                            "staging",
                            "openness",
                            "opennessClosedStatus",
                            "scrollContainerShouldBePassThrough",
                          ],
                          {
                            className: i,
                            dataSilk: [
                              o,
                              "0ab",
                              L && "0ah",
                              tc && "0aj",
                              ar && "0ak",
                              "0al",
                            ],
                          }
                        )
                      ),
                      {},
                      {
                        ref: e_,
                        "aria-labelledby": em,
                        "aria-describedby": eg,
                      },
                      z
                    ),
                    {},
                    {
                      role: J,
                      tabIndex: -1,
                      children: [
                        (0, g.jsx)(
                          tJ.Root,
                          ei(
                            ei(
                              {},
                              an("primaryScrollTrapRoot", [
                                "track",
                                "scrollContainerShouldBePassThrough",
                              ])
                            ),
                            {},
                            {
                              active: "none" !== tY,
                              axis: tY,
                              children: (0, g.jsx)(tJ.Stabiliser, {
                                children: r,
                              }),
                            }
                          )
                        ),
                        (0, g.jsx)(
                          tJ.Root,
                          ei(
                            ei(
                              {},
                              an("secondaryScrollTrapRoot", [
                                "scrollContainerShouldBePassThrough",
                              ])
                            ),
                            {},
                            {
                              automaticallyDisabledForOptimisation: !1,
                              preventBodyScroll: as,
                            }
                          )
                        ),
                      ],
                    }
                  )
                ),
            }),
          });
        });
      nh.displayName = "Sheet.Anonymous";
      var ng = (function (e) {
          (0, l.A)(a, e);
          var t,
            n =
              ((t = (function () {
                if (
                  "undefined" == typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (e) {
                  return !1;
                }
              })()),
              function () {
                var e,
                  n = (0, u.A)(a);
                return (
                  (e = t
                    ? Reflect.construct(
                        n,
                        arguments,
                        (0, u.A)(this).constructor
                      )
                    : n.apply(this, arguments)),
                  (0, c.A)(this, e)
                );
              });
          function a(e) {
            var t;
            return (
              (0, o.A)(this, a),
              ((t = n.call(this, e)).state = {
                hasError: !1,
              }),
              t
            );
          }
          return (
            (0, s.A)(
              a,
              [
                {
                  key: "componentDidCatch",
                  value: function (e) {
                    console.error(e);
                  },
                },
                {
                  key: "render",
                  value: function () {
                    return this.state.hasError
                      ? (0, g.jsx)("h1", {
                          children: "Something went wrong.",
                        })
                      : this.props.children;
                  },
                },
              ],
              [
                {
                  key: "getDerivedStateFromError",
                  value: function (e) {
                    return {
                      hasError: !0,
                    };
                  },
                },
              ]
            ),
            a
          );
        })(b.Component),
        nv = b.forwardRef(function (e, t) {
          var n = e.asChild,
            a = e.children,
            r = e.className,
            i = e["data-silk"],
            o = (0, A.A)(e, P),
            s = n ? tW : "span",
            l = eh("VisuallyHidden", {});
          return (0, g.jsx)(
            s,
            ei(
              ei(
                ei(
                  {},
                  l("root", [], {
                    className: r,
                    dataSilk: [i],
                  })
                ),
                o
              ),
              {},
              {
                ref: t,
                children: a,
              }
            )
          );
        });
      nv.displayName = "VisuallyHidden.Root";
      var nb = {
          Root: nv,
        },
        ny = b.createContext(null);
      ny.displayName = "SheetStack.GenericContext";
      var nC = [],
        nk = function (e, t) {
          var n,
            a,
            i = function () {
              var n = (function (e) {
                  for (var t = 0, n = 0; e; )
                    (t += e.offsetLeft),
                      (n += e.offsetTop),
                      (e = e.offsetParent);
                  return [t, n];
                })(e),
                a = (0, f.A)(n, 2),
                r = a[0],
                i = a[1],
                o = {
                  top: i + scrollY,
                  bottom: Math.max(
                    e.offsetHeight - (i + scrollY + innerHeight),
                    0
                  ),
                  left: r + scrollX,
                  right: Math.max(
                    e.offsetWidth - (r + scrollX + innerWidth),
                    0
                  ),
                  height: innerHeight,
                  width: innerWidth,
                };
              t(
                o.top <= 0 && o.bottom <= 0 && o.left <= 0 && o.right <= 0
                  ? null
                  : o
              );
            };
          nC.push({
            element: e,
            callback: i,
          }),
            i(),
            1 === nC.length &&
              ((n = function () {
                nC.forEach(function (e) {
                  return e.callback();
                });
              }),
              (r = function () {
                clearTimeout(a),
                  (a = window.setTimeout(function () {
                    clearTimeout(a), n();
                  }, 100));
              }),
              window.addEventListener("scroll", r),
              window.addEventListener("resize", r));
        },
        nS = function (e) {
          (nC = nC.filter(function (t) {
            return t.element !== e;
          })).length ||
            (window.removeEventListener("scroll", r),
            window.removeEventListener("resize", r));
        },
        nE = function (e, t) {
          var n = (0, b.useId)(),
            a = (0, b.useRef)(null),
            r = tB(a, t),
            i = e.sheetId,
            o = e.stackId,
            s = e.sheetsCount,
            l = e.travelAnimation,
            c = e.stackingAnimation,
            u = e.style,
            d = nx(i),
            A = d.sheetId,
            m = d.longRunning,
            h = (0, b.useState)(null),
            g = (0, f.A)(h, 2),
            v = g[0],
            y = g[1],
            C = (0, b.useMemo)(
              function () {
                var e = [],
                  t = {},
                  n = {},
                  a = !1,
                  r = !1;
                return (
                  [l, c].forEach(function (i, o) {
                    i &&
                      Object.entries(
                        i.hasOwnProperty("properties") ? i.properties : i
                      ).forEach(function (i) {
                        var s = (0, f.A)(i, 2),
                          l = s[0],
                          c = s[1];
                        !c ||
                          ("clipBoundary" === l && (r = !0),
                          "string" == typeof c &&
                            (0 === o ? (t[l] = c) : (n[l] = c)),
                          tf.includes(l) || "transform" === l
                            ? e.includes("transform") ||
                              (e.push("transform"), (a = !0))
                            : "opacity" !== l ||
                              e.includes("opacity") ||
                              e.push("opacity"));
                      });
                  }),
                  {
                    willChangesValuesString: e.join(", "),
                    outletTransformedOnAnimation: a,
                    nonAnimatedTravelStyles: t,
                    nonAnimatedStackingStyles: n,
                    clippedToViewport: r,
                  }
                );
              },
              [c, l]
            ),
            k = C.willChangesValuesString,
            S = C.outletTransformedOnAnimation,
            E = C.nonAnimatedTravelStyles,
            x = C.nonAnimatedStackingStyles,
            w = C.clippedToViewport,
            T = (0, b.useMemo)(
              function () {
                if (v) {
                  var e,
                    t = v.top,
                    n = v.bottom,
                    a = v.left,
                    r = v.right;
                  e = ""
                    .concat(t - 0.1, "px ")
                    .concat(r, "px ")
                    .concat(n, "px ")
                    .concat(a, "px");
                }
                var i = function (t, n) {
                    if (!t) return [];
                    var a,
                      r,
                      i,
                      o = v || {},
                      s = o.top,
                      l = o.left,
                      c = o.height,
                      u = o.width,
                      d = t.hasOwnProperty("properties") ? t.properties : t,
                      A = d.clipBoundary,
                      f = d.clipBorderRadius,
                      m = d.clipTransformOrigin;
                    if (
                      (A &&
                        (m || (m = "50% 50% 0"),
                        (i = m
                          .split(" ")
                          .map(function (e) {
                            return "top" === e || "left" === e
                              ? "0%"
                              : "bottom" === e || "right" === e
                              ? "100%"
                              : e;
                          })
                          .map(function (e, t) {
                            if (0 === t) {
                              var n = e;
                              return (
                                e.includes("%")
                                  ? (n = e.replace(/\b\d+%/, function (e) {
                                      return (parseFloat(e) / 100) * u + "px";
                                    }))
                                  : "0" === e && (n = "0px"),
                                "calc(" + l + "px + " + n + ")"
                              );
                            }
                            if (1 === t) {
                              var a = e;
                              return (
                                e.includes("%")
                                  ? (a = e.replace(/\b\d+%/, function (e) {
                                      return (parseFloat(e) / 100) * c + "px";
                                    }))
                                  : "0" === e && (a = "0px"),
                                "calc(" + s + "px + " + a + ")"
                              );
                            }
                          })
                          .join(" "))),
                      A)
                    ) {
                      if ("layout-viewport" === A) {
                        if (e) {
                          if ("string" == typeof f)
                            a = "inset(".concat(e, " round ").concat(f, ")");
                          else if (Array.isArray(f)) {
                            var h = "inset(".concat(e, " round ");
                            a = function (e) {
                              return (
                                h + e.tween.apply(void 0, (0, p.A)(f)) + ")"
                              );
                            };
                          } else if ("function" == typeof f) {
                            var g = "inset(".concat(e, " round ");
                            a = function (e) {
                              return g + f(e) + ")";
                            };
                          } else a = "inset(".concat(e, ")");
                          r = "0.001px";
                        } else r = null != f ? f : null;
                      } else if ("function" == typeof A) {
                        if (e) {
                          if ("string" == typeof f)
                            a = function (t) {
                              return "none" !== A(t)
                                ? "inset(".concat(e, " round ").concat(f, ")")
                                : "none";
                            };
                          else if (Array.isArray(f)) {
                            var b = "inset(".concat(e, " round ");
                            a = function (e) {
                              return "none" !== A(e)
                                ? b + e.tween.apply(e, (0, p.A)(f)) + ")"
                                : "none";
                            };
                          } else if ("function" == typeof f) {
                            var y = "inset(".concat(e, " round ");
                            a = function (e) {
                              return "none" !== A(e) ? y + f(e) + ")" : "none";
                            };
                          } else
                            a = function (t) {
                              return "none" !== A(t)
                                ? "inset(".concat(e, ")")
                                : "none";
                            };
                          r = "0.001px";
                        } else
                          f &&
                            (r = function (e) {
                              if ("layout-viewport" === A(e)) return f;
                            });
                      } else
                        "none" === A &&
                          ((a = "none"), (r = null != f ? f : null));
                    } else {
                      var C = ei({}, d),
                        k = ei({}, n);
                      return (
                        delete C.clipBoundary,
                        delete C.clipBorderRadius,
                        delete C.clipTransformOrigin,
                        delete k.clipBoundary,
                        delete k.clipBorderRadius,
                        delete k.clipTransformOrigin,
                        [C, k]
                      );
                    }
                    var S = ei({}, d),
                      E = ei({}, n);
                    return (
                      delete S.clipBoundary,
                      delete S.clipBorderRadius,
                      delete S.clipTransformOrigin,
                      delete E.clipBoundary,
                      delete E.clipBorderRadius,
                      delete E.clipTransformOrigin,
                      "string" == typeof a
                        ? (E.clipPath = a)
                        : (S.clipPath = a),
                      "string" == typeof r
                        ? (E.borderRadius = r)
                        : (S.borderRadius = r),
                      "string" == typeof i && (E.transformOrigin = i),
                      [S, E]
                    );
                  },
                  o = i(l, E),
                  s = (0, f.A)(o, 2),
                  u = s[0],
                  d = s[1],
                  A = i(c, x),
                  m = (0, f.A)(A, 2);
                return {
                  modifiedTravelAnimation: u,
                  modifiedNonAnimatedTravelStyles: d,
                  modifiedStackingAnimation: m[0],
                  modifiedNonAnimatedStackingStyles: m[1],
                };
              },
              [v, x, E, c, l]
            ),
            P = T.modifiedTravelAnimation,
            O = T.modifiedNonAnimatedTravelStyles,
            D = T.modifiedStackingAnimation,
            I = T.modifiedNonAnimatedStackingStyles;
          eo(
            function () {
              var e = a.current,
                t = n && w && ((!o && m) || (o && s >= 1));
              if (t)
                return (
                  nk(e, y),
                  function () {
                    t && nS(e);
                  }
                );
            },
            [n, w, m, o, s]
          );
          var R = (0, b.useMemo)(
            function () {
              return o
                ? ei(
                    ei(ei({}, u), s >= 1 ? I : {}),
                    {},
                    {
                      willChange:
                        s >= 1
                          ? k +
                            ((null == u ? void 0 : u.willChange)
                              ? ", " + (null == u ? void 0 : u.willChange)
                              : "")
                          : null == u
                          ? void 0
                          : u.willChange,
                    }
                  )
                : ei(
                    ei(ei(ei({}, u), m ? O : {}), s >= 1 ? I : {}),
                    {},
                    {
                      willChange: m
                        ? k +
                          ((null == u ? void 0 : u.willChange)
                            ? ", " + (null == u ? void 0 : u.willChange)
                            : "")
                        : null == u
                        ? void 0
                        : u.willChange,
                    }
                  );
            },
            [o, u, O, I, m, s, k]
          );
          return (
            eo(
              function () {
                var e,
                  t,
                  n,
                  r,
                  i = th.findActualFixedComponentsInsideOutlet(a.current);
                if (i.length)
                  return (
                    S &&
                      ((e = o ? s > 0 : m),
                      (t = function () {
                        i.forEach(function (e) {
                          if (e.element && !e.compensated) {
                            var t = 0,
                              n = 0,
                              r = e.element.style.transform,
                              i = window.getComputedStyle(e.element),
                              o = i.getPropertyValue("--silk-fixed-side"),
                              s = i.getPropertyValue("transform");
                            th.updateFixedComponent({
                              id: e.id,
                              initialInlineCSSTransform: r,
                              compensated: !0,
                            }),
                              (t = o.includes("bottom")
                                ? -1 *
                                  (a.current.offsetHeight -
                                    (scrollY + window.innerHeight))
                                : scrollY),
                              (n = o.includes("right")
                                ? -1 *
                                  (a.current.offsetWidth -
                                    (scrollX + window.innerWidth))
                                : scrollX),
                              (0 !== Math.abs(t) || 0 !== Math.abs(n)) &&
                                e.element.style.setProperty(
                                  "transform",
                                  ("none" !== s ? s + " " : "") +
                                    "translateX(" +
                                    n +
                                    "px) translateY(" +
                                    t +
                                    "px)"
                                );
                          }
                        });
                      }),
                      (n = function () {
                        window.removeEventListener("resize", t),
                          window.removeEventListener("scroll", t),
                          i.forEach(function (e) {
                            e.element &&
                              e.compensated &&
                              (e.initialInlineCSSTransform
                                ? (e.element.style.setProperty(
                                    "transform",
                                    e.initialInlineCSSTransform
                                  ),
                                  th.updateFixedComponent({
                                    id: e.id,
                                    initialInlineCSSTransform: void 0,
                                    compensated: !1,
                                  }))
                                : (e.element.style.removeProperty("transform"),
                                  th.updateFixedComponent({
                                    id: e.id,
                                    compensated: !1,
                                  })));
                          });
                      }),
                      e
                        ? (t(),
                          window.addEventListener("resize", t),
                          window.addEventListener("scroll", t))
                        : n(),
                      (r = n)),
                    r
                  );
              },
              [m, n, S, s, o]
            ),
            eo(
              function () {
                return (
                  th.addOutletToSheet(A, n),
                  function () {
                    return th.removeOutletFromSheet(A, n);
                  }
                );
              },
              [n, A]
            ),
            eo(
              function () {
                var e = a.current;
                return (
                  P &&
                    th.addAnimationToSheetOrStack({
                      sheetId: A,
                      type: "travel",
                      element: e,
                      config: P,
                    }),
                  D &&
                    th.addAnimationToSheetOrStack({
                      sheetId: o ? null : A,
                      stackId: o,
                      type: "stacking",
                      element: e,
                      config: D,
                    }),
                  function () {
                    P &&
                      th.removeAnimationFromSheetOrStack({
                        sheetId: A,
                        type: "travel",
                        element: e,
                      }),
                      D &&
                        th.removeAnimationFromSheetOrStack({
                          sheetId: o ? null : A,
                          stackId: o,
                          type: "stacking",
                          element: e,
                        });
                  }
                );
              },
              [A, o, P, D]
            ),
            {
              ref: a,
              outletId: n,
              styleValue: R,
              composedRef: r,
            }
          );
        },
        nx = function (e) {
          return (0, b.useContext)(null != e ? e : t5) || {};
        };
      (ng.displayName = "Sheet.ErrorBoundary"),
        (tW.displayName = "Sheet.Slot.Root");
      var nw = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.forComponent,
          r = e.travelAnimation,
          i = e.stackingAnimation,
          o = e.style,
          s = e.className,
          l = (0, A.A)(e, O),
          c = nx(a),
          u = c.staging,
          d = c.StackContext,
          f = null != d ? d : b.createContext(null),
          p = nE(
            {
              sheetId: a,
              sheetsCount: ((0, b.useContext)(f) || {}).sheetsCount,
              travelAnimation: r,
              stackingAnimation: i,
              style: o,
            },
            t
          ),
          m = p.styleValue,
          h = p.composedRef,
          v = (0, b.useMemo)(
            function () {
              return "none" !== u;
            },
            [u]
          ),
          y = n ? tW : "div",
          C = eh("Sheet", {});
        return (0, g.jsx)(
          y,
          ei(
            ei(
              ei(
                {
                  style: m,
                },
                C("outlet", [], {
                  className: s,
                  dataSilk: [v && "0aj"],
                })
              ),
              l
            ),
            {},
            {
              ref: h,
            }
          )
        );
      });
      nw.displayName = "Sheet.Outlet";
      var nT = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = (0, A.A)(e, D),
          r = n ? tW : "button",
          i = a.forComponent,
          o = a.className,
          s = a["data-silk"],
          l = a.onPress,
          c = a.onClick,
          u = a.children,
          d = a.action,
          f = void 0 === d ? "present" : d,
          p = a.travelAnimation,
          m = a.stackingAnimation,
          h = (0, A.A)(a, I),
          v = nx(i),
          y = v.sheetRole,
          C = v.sheetId,
          k = v.open,
          S = v.onOpenChange,
          E = v.elementFocusedLastBeforeShowing,
          x = th.findSheet(C),
          w = (0, b.useRef)(null),
          T = tB(w, t),
          P = (0, b.useMemo)(
            function () {
              return ("dialog" === y || "alertdialog" === y) && "present" === f
                ? "dialog"
                : void 0;
            },
            [f, y]
          ),
          O = (0, b.useMemo)(
            function () {
              return "present" === f || "dismiss" === f ? k : void 0;
            },
            [f, k]
          ),
          R = eh("Sheet", {});
        return (0, g.jsx)(nw, {
          forComponent: i,
          asChild: !0,
          travelAnimation: p,
          stackingAnimation: m,
          children: (0, g.jsx)(
            r,
            ei(
              ei(
                ei(
                  {},
                  R("trigger", [], {
                    className: o,
                    dataSilk: [s],
                  })
                ),
                {},
                {
                  onClick: function (e) {
                    var t,
                      n,
                      a = eI({
                        nativeEvent: e,
                        defaultBehavior: {
                          forceFocus: !0,
                          runAction: !0,
                        },
                        handler: l,
                      }),
                      r = a.forceFocus,
                      i = a.runAction;
                    r &&
                      (null === (t = w.current) ||
                        void 0 === t ||
                        t.focus({
                          preventScroll: !0,
                        })),
                      i &&
                        ("present" === f
                          ? ((E.current = w.current), S(!0))
                          : "dismiss" === f
                          ? S(!1)
                          : ("step" === f || "step" === f.type) &&
                            (null == x ||
                              null === (n = x.sendToOpennessMachine) ||
                              void 0 === n ||
                              n.call(x, {
                                type: "STEP",
                                direction: "step" === f ? "up" : f.direction,
                                detent: "step" === f ? null : f.detent,
                              }))),
                      null == c || c(e);
                  },
                  "aria-haspopup": P,
                  "aria-controls": C,
                  "aria-expanded": O,
                  ref: T,
                },
                h
              ),
              {},
              {
                children: u,
              }
            )
          ),
        });
      });
      nT.displayName = "Sheet.Trigger";
      var nP = b.forwardRef(function (e, t) {
        var n = e.children,
          a = e.className,
          r = e.action,
          i = void 0 === r ? "step" : r,
          o = (0, A.A)(e, R),
          s =
            1 === ((0, b.useContext)(t3) || {}).detents.length &&
            "dismiss" !== i,
          l = eh("Sheet", {});
        return (0, g.jsx)(
          nT,
          ei(
            ei(
              ei(
                {},
                l("handle", [], {
                  className: a,
                })
              ),
              {},
              {
                action: i,
                disabled: s,
              },
              o
            ),
            {},
            {
              ref: t,
              children: (0, g.jsx)(nb.Root, {
                children: null != n ? n : "dismiss" === i ? "Dismiss" : "Cycle",
              }),
            }
          )
        );
      });
      nP.displayName = "Sheet.Handle";
      var nO = function (e) {
        var t,
          n = (0, b.useState)(!1),
          a = (0, f.A)(n, 2),
          r = a[0],
          i = a[1];
        return (
          (0, b.useEffect)(function () {
            return (
              i(!0),
              function () {
                return i(!1);
              }
            );
          }, []),
          r
            ? v.createPortal(
                e.children,
                null !== (t = e.container) && void 0 !== t ? t : document.body
              )
            : null
        );
      };
      nO.displayName = "Sheet.Portal";
      var nD = function (e) {
          var t = e.rootRef;
          return (
            (0, b.useEffect)(
              function () {
                var e = t.current;
                e &&
                  "1" !==
                    getComputedStyle(e).getPropertyValue("--silk-aY").trim() &&
                  console.warn(
                    "The CSS styles for Silk are not found. Please refer to the documentation on how to import them."
                  );
              },
              [t]
            ),
            null
          );
        },
        nI = b.forwardRef(function (e, t) {
          var n = e.className,
            a = e["data-silk"],
            r = e.license,
            i = e.sheetRole,
            o = e.componentId,
            s = e.forComponent,
            l = e.defaultPresented,
            c = e.presented,
            u = e.onPresentedChange,
            d = e.defaultActiveDetent,
            p = e.activeDetent,
            m = e.onActiveDetentChange,
            h = e.onSafeToUnmountChange,
            v = (0, A.A)(e, j),
            y = (0, b.useRef)(null),
            C = tB(y, t),
            k = null != l && l,
            S = (0, b.useState)(k),
            E = (0, f.A)(S, 2),
            x = E[0],
            w = E[1],
            T = void 0 !== c && void 0 !== u,
            P = (0, b.useMemo)(
              function () {
                return T ? c : x;
              },
              [T, c, x]
            ),
            O = (0, b.useMemo)(
              function () {
                return T ? u : w;
              },
              [T, u, w]
            ),
            D = (0, b.useRef)(null),
            I = (0, b.useState)(!k),
            R = (0, f.A)(I, 2),
            N = R[0],
            M = R[1],
            B = (0, b.useCallback)(
              function (e) {
                null == h || h(e), M(e);
              },
              [h]
            ),
            F = (0, b.useState)(P),
            L = (0, f.A)(F, 2),
            Q = L[0],
            U = L[1],
            W = (0, b.useState)("none"),
            G = (0, f.A)(W, 2),
            _ = G[0],
            V = G[1],
            Y = ei(
              {
                license: r,
                StackContext: "closest" === s ? ny : s,
                CustomSheetContext: o,
                sheetId: tU(),
                sheetRole: i,
                open: P,
                onOpenChange: O,
                onSafeToUnmountChange: B,
                defaultActiveDetent: d,
                activeDetent: p,
                onActiveDetentChange: m,
                safeToUnmount: N,
                longRunning: Q,
                setLongRunning: U,
                staging: _,
                setStaging: V,
                elementFocusedLastBeforeShowing: D,
              },
              v
            ),
            X = eh("Sheet");
          return (0, g.jsxs)(ng, {
            children: [
              (0, g.jsx)(nD, {
                rootRef: y,
              }),
              (0, g.jsx)(eU, {
                genericContext: t5,
                customContext: o,
                value: Y,
                children: (0, g.jsx)(
                  nw,
                  ei(
                    ei(
                      {},
                      X("root", [], {
                        className: n,
                        dataSilk: [a],
                      })
                    ),
                    {},
                    {
                      ref: C,
                    },
                    v
                  )
                ),
              }),
            ],
          });
        });
      nI.displayName = "Sheet.Root";
      var nR = b.forwardRef(function (e, t) {
        var n = nx(e.forComponent),
          a = n.open,
          r = n.safeToUnmount;
        return (
          (a || !r) &&
          (0, g.jsx)(
            nh,
            ei(
              ei({}, e),
              {},
              {
                ref: t,
              }
            )
          )
        );
      });
      nR.displayName = "Sheet.View";
      var nj = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.swipeable,
          r = void 0 === a || a,
          i = (0, A.A)(e, N),
          o = (0, b.useContext)(t3) || {},
          s = o.longRunningState,
          l = o.backdropRef,
          c = o.styleAttributes,
          u = o.setBackdropSwipeable,
          d = o.setBackdropTravelHandler,
          p = i.className,
          m = i["data-silk"],
          h = i.children,
          v = i.travelAnimation,
          y = i.stackingAnimation,
          C = i.themeColorDimming,
          k = void 0 !== C && C,
          S = (0, A.A)(i, M),
          E = tB(l, t);
        (0, b.useEffect)(
          function () {
            return (
              u(r),
              function () {
                u(!1);
              }
            );
          },
          [u, r]
        );
        var x = (0, b.useMemo)(
            function () {
              return ei(
                {
                  opacity: function (e) {
                    return Math.min(0.33 * e.progress, 0.33);
                  },
                },
                v
              );
            },
            [v]
          ),
          w = (0, b.useState)(x),
          T = (0, f.A)(w, 2),
          P = T[0],
          O = T[1],
          D = tU(),
          I = (0, b.useRef)(0);
        return (
          eo(
            function () {
              var e = !1,
                t = function () {
                  e && th.removeThemeColorDimmingOverlay(D);
                };
              if (s.matches("longRunning:true")) {
                if (
                  !(e = !!(
                    eQ() &&
                    !eL() &&
                    "auto" === k &&
                    x.opacity &&
                    th.getAndStoreUnderlyingThemeColorAsRGBArray()
                  ))
                )
                  return;
                var n,
                  a = x.opacity,
                  r = (0, A.A)(x, B);
                if (
                  (O(
                    ei(
                      {
                        opacity: "ignore",
                      },
                      r
                    )
                  ),
                  Array.isArray(a))
                ) {
                  var i = (0, f.A)(a, 2),
                    o = i[0],
                    c = i[1];
                  n = function (e) {
                    return o + (c - o) * e.progress;
                  };
                } else
                  "function" == typeof a &&
                    ((n = a),
                    O(
                      ei(
                        {
                          opacity: "ignore",
                        },
                        r
                      )
                    ));
                if (n && l && d) {
                  var u = window.getComputedStyle(l.current).backgroundColor,
                    p = th.updateThemeColorDimmingOverlay({
                      abortRemoval: !0,
                      dimmingOverlayId: D,
                      color: u,
                      alpha: I.current,
                    }),
                    m = function (e) {
                      var t,
                        a = n(e);
                      th.updateThemeColorDimmingOverlayAlphaValue(p, a),
                        null === (t = l.current) ||
                          void 0 === t ||
                          t.style.setProperty("opacity", a),
                        (I.current = a);
                    };
                  d(function () {
                    return m;
                  });
                }
              }
              return (
                s.matches("longRunning:false") && t(),
                function () {
                  t();
                }
              );
            },
            [s, D, l, d, k, v, x]
          ),
          (0, g.jsx)(
            nw,
            ei(
              ei(
                ei(
                  {},
                  c("backdrop", ["scrollContainerShouldBePassThrough"], {
                    className: p,
                    dataSilk: [m],
                  })
                ),
                {},
                {
                  travelAnimation: P,
                  stackingAnimation: y,
                },
                S
              ),
              {},
              {
                ref: E,
                asChild: n,
                children: h,
              }
            )
          )
        );
      });
      nj.displayName = "Sheet.Backdrop";
      var nN = b.forwardRef(function (e, t) {
        var n,
          a = e.asChild,
          r = e.children,
          i = e.className,
          o = e["data-silk"],
          s = e.travelAnimation,
          l = e.stackingAnimation,
          c = e.style,
          u = (0, A.A)(e, F),
          d = a ? tW : "div",
          f = ((0, b.useContext)(t5) || {}).StackContext,
          p = null != f ? f : b.createContext(null),
          m = nE(
            {
              sheetId: t5,
              sheetsCount: ((0, b.useContext)(p) || {}).sheetsCount,
              travelAnimation: s,
              stackingAnimation: l,
              style: c,
            },
            t
          ),
          h = m.styleValue,
          v = m.composedRef,
          y = (0, b.useContext)(t3) || {},
          C = y.scrollContainerRef,
          k = y.frontSpacerRef,
          S = y.contentWrapperRef,
          E = y.contentRef,
          x = y.backSpacerRef,
          w = y.detentMarkersRefs,
          T = y.leftEdgeRef,
          P = y.nativeEdgeSwipePrevention,
          O = y.scrollContainerTouchStartHandler,
          D = y.scrollContainerTouchEndHandler,
          I = y.styleAttributes,
          R = y.detents,
          j = y.bleedingBackgroundPresent,
          N = tB(E, v);
        return (0, g.jsxs)(
          "div",
          ei(
            ei(
              {},
              I(
                "scrollContainer",
                [
                  "track",
                  "swipeDisabled",
                  "swipeOvershootDisabled",
                  "staging",
                  "positionCoveredStatus",
                  "scrollContainerShouldBePassThrough",
                  "swipeTrap",
                ],
                {
                  dataSilk: ["0ac"],
                }
              )
            ),
            {},
            {
              ref: C,
              onTouchStart: O,
              onTouchEnd: D,
              children: [
                (0, g.jsx)(
                  "div",
                  ei(
                    ei({}, I("frontSpacer", ["track"])),
                    {},
                    {
                      ref: k,
                    }
                  )
                ),
                (0, g.jsxs)(
                  "div",
                  ei(
                    ei(
                      {},
                      I("contentWrapper", [
                        "placement",
                        "track",
                        "swipeOvershootDisabled",
                        "swipeOutDisabledWithDetent",
                        "staging",
                        "position",
                      ])
                    ),
                    {},
                    {
                      ref: S,
                      children: [
                        (0, g.jsx)(
                          d,
                          ei(
                            ei(
                              ei(
                                {},
                                I(
                                  "content",
                                  [
                                    "track",
                                    "placement",
                                    "scrollContainerShouldBePassThrough",
                                  ],
                                  {
                                    className: i,
                                    dataSilk: [o, j && "0af"],
                                  }
                                )
                              ),
                              {},
                              {
                                style: h,
                              },
                              u
                            ),
                            {},
                            {
                              ref: N,
                              children: r,
                            }
                          )
                        ),
                        P &&
                          (0, g.jsx)(
                            "div",
                            ei(
                              ei({}, I("leftEdge", ["track"])),
                              {},
                              {
                                ref: T,
                              }
                            )
                          ),
                      ],
                    }
                  )
                ),
                (0, g.jsx)(
                  "div",
                  ei(
                    ei({}, I("backSpacer", ["track"])),
                    {},
                    {
                      ref: x,
                      children: R.map(function (e, t) {
                        return (0, g.jsx)(
                          "div",
                          ei(
                            ei(
                              {
                                ref: function (e) {
                                  w.current.length > R.length &&
                                    (w.current = w.current.slice(0, R.length)),
                                    (w.current[t] = e);
                                },
                              },
                              I("detentMarker", [
                                "track",
                                "swipeOutDisabledWithDetent",
                              ])
                            ),
                            {},
                            {
                              style: {
                                "--silk-aA":
                                  null !== (n = R[t - 1]) && void 0 !== n
                                    ? n
                                    : "0px",
                                "--silk-aB": e,
                                "--silk-aC": t,
                              },
                            }
                          ),
                          t
                        );
                      }),
                    }
                  )
                ),
              ],
            }
          )
        );
      });
      nN.displayName = "Sheet.Content";
      var nM = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = (0, A.A)(e, L),
          r = a.className,
          i = a["data-silk"],
          o = (0, A.A)(a, Q),
          s = (0, b.useContext)(t3) || {},
          l = s.staging,
          c = s.placement,
          u = s.track,
          d = s.setBleedingBackgroundPresent;
        (0, b.useEffect)(
          function () {
            return (
              d(!0),
              function () {
                d(!1);
              }
            );
          },
          [d]
        );
        var f = eh("Sheet", {
          staging: l,
          placement: c,
          track: u,
          bleedDisabled: "horizontal" === u || "vertical" === u,
        });
        return (0, g.jsx)(
          nw,
          ei(
            ei(
              ei(
                {
                  asChild: n,
                },
                f(
                  "bleedingBackground",
                  ["staging", "placement", "track", "bleedDisabled"],
                  {
                    className: r,
                    dataSilk: [i],
                  }
                )
              ),
              o
            ),
            {},
            {
              ref: t,
            }
          )
        );
      });
      nM.displayName = "Sheet.BleedingBackground";
      var nB = b.forwardRef(function (e, t) {
        var n = e.className,
          a = e["data-silk"],
          r = (0, A.A)(e, U),
          i = ((0, b.useContext)(t3) || {}).travelAxis,
          o = (0, b.useMemo)(
            function () {
              return "vertical" === i ? "horizontal" : "vertical";
            },
            [i]
          ),
          s = (0, b.useState)(!1),
          l = (0, f.A)(s, 2),
          c = l[0],
          u = l[1];
        (0, b.useEffect)(function () {
          return u(eQ());
        }, []);
        var d = eh("SpecialWrapper");
        return (0, g.jsx)(
          tJ.Root,
          ei(
            ei(
              ei(
                {},
                d("root", [], {
                  className: n,
                  dataSilk: [a],
                })
              ),
              {},
              {
                active: c,
                axis: o,
              },
              r
            ),
            {},
            {
              ref: t,
            }
          )
        );
      });
      nB.displayName = "Sheet.SpecialWrapper.Root";
      var nF = b.forwardRef(function (e, t) {
        return (0, g.jsx)(
          tJ.Stabiliser,
          ei(
            ei({}, e),
            {},
            {
              ref: t,
            }
          )
        );
      });
      nF.displayName = "Sheet.SpecialWrapper.Content";
      var nL = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.travelAnimation,
          r = e.stackingAnimation,
          i = (0, A.A)(e, W),
          o = n ? tW : "h2",
          s = (0, b.useContext)(t3).titleId;
        return (0, g.jsx)(nw, {
          asChild: !0,
          travelAnimation: a,
          stackingAnimation: r,
          children: (0, g.jsx)(
            o,
            ei(
              {
                id: s,
                ref: t,
              },
              i
            )
          ),
        });
      });
      nL.displayName = "Sheet.Title";
      var nQ = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.travelAnimation,
          r = e.stackingAnimation,
          i = (0, A.A)(e, G),
          o = (0, b.useContext)(t3).descriptionId,
          s = n ? tW : "p";
        return (0, g.jsx)(nw, {
          asChild: !0,
          travelAnimation: a,
          stackingAnimation: r,
          children: (0, g.jsx)(
            s,
            ei(
              ei(
                {
                  id: o,
                },
                i
              ),
              {},
              {
                ref: t,
              }
            )
          ),
        });
      });
      nQ.displayName = "Sheet.Description";
      var nU = {
        Root: nI,
        Trigger: nT,
        View: nR,
        Backdrop: nj,
        Content: nN,
        BleedingBackground: nM,
        Handle: nP,
        SpecialWrapper: {
          Root: nB,
          Content: nF,
        },
        Outlet: nw,
        Portal: nO,
        Title: nL,
        Description: nQ,
      };
      ng.displayName = "SheetStack.ErrorBoundary";
      var nW = b.forwardRef(function (e, t) {
        var n = e.componentId,
          a = e.className,
          r = e["data-silk"],
          i = e.asChild,
          o = (0, A.A)(e, _),
          s = (0, b.useId)();
        eo(
          function () {
            return (
              th.addSheetStack({
                id: s,
              }),
              function () {
                return th.removeSheetStack(s);
              }
            );
          },
          [s]
        );
        var l = (0, b.useState)([]),
          c = (0, f.A)(l, 2),
          u = c[0],
          d = c[1],
          m = (0, b.useCallback)(function (e) {
            d(function (t) {
              var n,
                a = t.findIndex(function (t) {
                  return t.sheetId === e.sheetId;
                });
              return (
                -1 !== a
                  ? ((n = (0, p.A)(t))[a] = e)
                  : (n = [].concat((0, p.A)(t), [e])),
                n
              );
            });
          }, []),
          h = (0, b.useCallback)(function (e) {
            d(function (t) {
              return t.filter(function (t) {
                return t.sheetId !== e;
              });
            });
          }, []),
          v = (0, b.useCallback)(
            function (e) {
              var t = u.findIndex(function (t) {
                return t.sheetId === e;
              });
              return -1 === t ? u[u.length - 1] : u[t - 1];
            },
            [u]
          ),
          y = (0, b.useState)(0),
          C = (0, f.A)(y, 2),
          k = C[0],
          S = C[1];
        eo(
          function () {
            0 === k && th.removeAllOutletPersistedStylesFromStack(s);
          },
          [k, s]
        );
        var E = (0, b.useState)([]),
          x = (0, f.A)(E, 2),
          w = x[0],
          T = x[1],
          P = (0, b.useCallback)(function (e) {
            T(function (t) {
              var n = t.findIndex(function (t) {
                return t.sheetId === e.sheetId;
              });
              if (-1 === n) return [].concat((0, p.A)(t), [e]);
              var a = (0, p.A)(t);
              return (a[n] = e), a;
            });
          }, []),
          O = (0, b.useCallback)(function (e) {
            T(function (t) {
              return t.filter(function (t) {
                return t.sheetId !== e;
              });
            });
          }, []),
          D = (0, b.useMemo)(
            function () {
              return w.some(function (e) {
                return "none" !== e.staging;
              })
                ? "not-none"
                : "none";
            },
            [w]
          ),
          I = (0, b.useMemo)(
            function () {
              return {
                stackId: s,
                sheetsCount: k,
                setSheetsCount: S,
                updateSheetStagingDataInStack: P,
                removeSheetStagingDataInStack: O,
                sheetsInStackMergedStaging: D,
                updateSheetDataInStack: m,
                removeSheetDataFromStack: h,
                getPreviousSheetDataInStack: v,
              };
            },
            [s, k, P, O, D, m, h, v]
          ),
          R = i ? tW : "div",
          j = eh("SheetStack");
        return (0, g.jsx)(ng, {
          children: (0, g.jsx)(eU, {
            genericContext: ny,
            customContext: n,
            value: I,
            children: (0, g.jsx)(
              R,
              ei(
                ei(
                  {},
                  j("root", [], {
                    className: a,
                    dataSilk: [r],
                  })
                ),
                {},
                {
                  ref: t,
                },
                o
              )
            ),
          }),
        });
      });
      nW.displayName = "SheetStack.Root";
      var nG = b.forwardRef(function (e, t) {
        var n = e.forComponent,
          a = void 0 === n ? "closest" : n,
          r = e.asChild,
          i = e.stackingAnimation,
          o = e.style,
          s = e.className,
          l = (0, A.A)(e, V),
          c = "closest" === a ? ny : a,
          u = (0, b.useContext)(c),
          d = u.stackId,
          f = u.sheetsCount,
          p = u.sheetsInStackMergedStaging;
        eo(
          function () {
            th.addSheetStack({
              id: d,
            });
          },
          [d]
        );
        var m = nE(
            {
              sheetsCount: f,
              stackId: d,
              stackingAnimation: i,
              style: o,
            },
            t
          ),
          h = m.styleValue,
          v = m.composedRef,
          y = (0, b.useMemo)(
            function () {
              return "none" !== p;
            },
            [p]
          ),
          C = eh("SheetStack", {}),
          k = r ? tW : "div";
        return (0, g.jsx)(
          k,
          ei(
            ei(
              ei(
                {
                  style: h,
                },
                C("outlet", [], {
                  className: s,
                  dataSilk: [y && "0aj"],
                })
              ),
              l
            ),
            {},
            {
              ref: v,
            }
          )
        );
      });
      nG.displayName = "SheetStack.Outlet";
      var n_ = {
          Root: nW,
          Outlet: nG,
        },
        nV = b.createContext(null);
      nV.displayName = "Scroll.GenericContext";
      var nY = b.createContext({
        contentRef: null,
      });
      nY.displayName = "Scroll.Anonymous";
      var nX = {
          nativePageScrollReplaced: void 0,
          pageScrollContainer: void 0,
        },
        nz = function (e) {
          return (0, b.useContext)(null != e ? e : nV) || {};
        },
        nH = "android" === eu ? 102 : 54,
        nK = eO ? "instant" : "android" === eu ? "instant" : "smooth",
        nq = function (e, t) {
          var n,
            a =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 300,
            r = e.scrollTop,
            i = function () {
              clearTimeout(n), e.removeEventListener("scroll", o), t();
            },
            o = function () {
              var t = e.scrollTop;
              if (t > r) {
                i();
                return;
              }
              (r = t), clearTimeout(n), (n = setTimeout(i, a));
            };
          (n = setTimeout(i, a)), e.addEventListener("scroll", o);
        },
        nZ = function (e) {
          if (!e)
            return {
              top: 0,
              bottom: 0,
            };
          var t = e.getBoundingClientRect(),
            n = window.getComputedStyle(e);
          return {
            top: t.top + parseFloat(n.borderTopWidth),
            bottom: t.bottom - parseFloat(n.borderBottomWidth),
          };
        },
        nJ = function () {
          var e = window.visualViewport.height,
            t = window.visualViewport.offsetTop;
          return {
            top: t,
            bottom: t + e,
          };
        },
        n$ = function (e, t, n) {
          e.style.setProperty("height", t + "px"), (n.current = t);
        },
        n0 = function (e) {
          var t = e.scrollContainer,
            n = e.elementTop,
            a = e.elementBottom,
            r = e.behavior,
            i = e.scrollMarginTop,
            o = e.scrollMarginBottom,
            s = e.scrollPortTop,
            l = e.scrollPortBottom,
            c = e.visualViewportTop,
            u = e.visualViewportBottom,
            d = e.beforeScrollCallback;
          if (t) {
            var A = n - Math.max(s, c),
              f = Math.min(l, u) - a;
            if (A < i) {
              var p = Math.max(-t.scrollTop, A - i);
              0 !== p &&
                (d(),
                t.scrollBy({
                  top: p,
                  behavior: r,
                }));
            } else if (f < o) {
              var m = Math.min(
                t.scrollHeight - t.clientHeight - t.scrollTop,
                o - f
              );
              0 !== m &&
                (d(),
                t.scrollBy({
                  top: m,
                  behavior: r,
                }));
            }
          }
        };
      ng.displayName = "Scroll.ErrorBoundary";
      var n1 = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.className,
          r = e.componentId,
          i = e.componentRef,
          o = e["data-silk"],
          s = (0, A.A)(e, Y),
          l = n ? tW : "div",
          c = (0, b.useRef)(function () {}),
          u = (0, b.useCallback)(function () {
            return c.current.apply(void 0, arguments);
          }, []),
          d = (0, b.useRef)(function () {}),
          f = (0, b.useCallback)(function () {
            return d.current.apply(void 0, arguments);
          }, []),
          p = (0, b.useMemo)(
            function () {
              return {
                componentRef: i,
                scrollToRef: c,
                scrollTo: u,
                scrollByRef: d,
                scrollBy: f,
              };
            },
            [i, f, u]
          ),
          m = eh("Scroll", {});
        return (0, g.jsx)(ng, {
          children: (0, g.jsx)(eU, {
            genericContext: nV,
            customContext: r,
            value: p,
            children: (0, g.jsx)(
              l,
              ei(
                ei(
                  ei(
                    {},
                    m("root", [], {
                      className: a,
                      dataSilk: [o],
                    })
                  ),
                  s
                ),
                {},
                {
                  ref: t,
                }
              )
            ),
          }),
        });
      });
      n1.displayName = "Scroll.Root";
      var n2 = null,
        n5 = function () {
          var e = (0, b.useRef)(null);
          eo(function () {
            null === n2 &&
              e.current &&
              ((n2 = e.current.offsetWidth - e.current.clientWidth),
              document.body.style.setProperty(
                "--ua-scrollbar-thickness",
                n2 + "px"
              ));
          }, []);
          var t = eh("Scroll"),
            n = (0, g.jsx)(
              "div",
              ei(
                ei({}, t("UAScrollbarMeasurer")),
                {},
                {
                  ref: e,
                }
              )
            );
          return null === n2 ? v.createPortal(n, document.body) : null;
        };
      n5.displayName = "Scroll.Anonymous";
      var n3 = function (e, t, n) {
          var a =
            arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          return "boolean" == typeof e
            ? e
            : "boolean" == typeof (null == e ? void 0 : e[t])
            ? e[t]
            : "boolean" == typeof (null == e ? void 0 : e[n])
            ? e[n]
            : a;
        },
        n4 = b.forwardRef(function (e, t) {
          var n = e.asChild,
            a = e.children,
            r = e.className,
            i = e["data-silk"],
            o = e.forComponent,
            s = e.axis,
            l = void 0 === s ? "y" : s,
            c = e.pageScroll,
            u = void 0 !== c && c,
            d = e.nativePageScrollReplacement,
            p = void 0 !== d && d,
            h = e.safeArea,
            v = void 0 === h ? "visual-viewport" : h,
            y = e.scrollGestureTrap,
            C = void 0 !== y && y,
            k = e.scrollGestureOvershoot,
            S = e.scrollGesture,
            E = void 0 === S ? "auto" : S,
            x = e.onScrollStart,
            w = e.onScroll,
            T = e.onScrollEnd,
            P = e.onFocusInside,
            O = e.nativeFocusScrollPrevention,
            D = void 0 === O || O,
            I = e.scrollAnimationSettings,
            R =
              void 0 === I
                ? {
                    skip: "auto",
                  }
                : I,
            j = e.scrollAnchoring,
            N = e.scrollSnapType,
            M = void 0 === N ? "none" : N,
            B = e.scrollPadding,
            F = void 0 === B ? "auto" : B,
            L = e.scrollTimelineName,
            Q = void 0 === L ? "none" : L,
            U = e.nativeScrollbar,
            W = (0, A.A)(e, X),
            G = (0, b.useMemo)(
              function () {
                var e = n3(C, "xStart", "x"),
                  t = n3(C, "xEnd", "x"),
                  n = n3(C, "yStart", "y"),
                  a = n3(C, "yEnd", "y"),
                  r = e,
                  i = t,
                  o = n,
                  s = a;
                return (
                  "y" === l ? (i = r = e !== t || e) : (s = o = n !== a || n),
                  [r, i, o, s]
                );
              },
              [C, l]
            ),
            _ = (0, f.A)(G, 4),
            V = _[0],
            Y = _[1],
            z = _[2],
            H = _[3],
            K = (0, b.useMemo)(
              function () {
                return V !== Y;
              },
              [Y, V]
            ),
            q = (0, b.useMemo)(
              function () {
                return z !== H;
              },
              [H, z]
            ),
            Z = (0, b.useMemo)(
              function () {
                if ("proximity" === M) {
                  if ("y" === l) return "proximityY";
                  if ("x" === l) return "proximityX";
                } else {
                  if ("mandatory" !== M) return "none";
                  if ("y" === l) return "mandatoryY";
                  if ("x" === l) return "mandatoryX";
                }
              },
              [l, M]
            ),
            J = n ? tW : "div",
            $ = tB((0, b.useRef)(null), t),
            ee = (0, b.useRef)(null),
            et = (0, b.useRef)(null),
            ea = (0, b.useRef)(null),
            er = (0, b.useRef)(null),
            es = (0, b.useRef)(null),
            el = (0, b.useRef)(null),
            ec = tU(),
            ed = nz(o) || {},
            eA = ed.componentRef,
            ef = ed.scrollToRef,
            ep = ed.scrollByRef,
            em = (0, b.useContext)(t3) || {},
            eg = em.getContentCoordinatesWhenRestingOnLastDetent,
            ev = em.contentRef,
            eb = (0, b.useMemo)(
              function () {
                return !1 === E || "auto" !== E;
              },
              [E]
            ),
            ey = (0, b.useState)(!1),
            eC = (0, f.A)(ey, 2),
            ek = eC[0],
            eS = eC[1],
            eE = (0, b.useState)(!1),
            ew = (0, f.A)(eE, 2),
            eP = ew[0],
            eR = ew[1];
          eo(
            function () {
              u &&
                (function (e) {
                  var t = "data-silk-native-page-scroll-replaced",
                    n = document.documentElement.getAttribute(t);
                  if (u || "true" === n) {
                    var a =
                        window.matchMedia("(display-mode: standalone)")
                          .matches || window.navigator.standalone,
                      r = "android" === eu || "ios" === eu || "ipados" === eu;
                    if (!0 !== e && ("auto" !== e || (r && !a))) {
                      eR(!1),
                        (nX = {
                          nativePageScrollReplaced: !1,
                          pageScrollContainer: document.body,
                        });
                      var i,
                        o,
                        s = new Event("silk-page-scroll-data-change");
                      if ((document.dispatchEvent(s), "false" === n)) return;
                      var l =
                        null !==
                          (o =
                            null === (i = ee.current) || void 0 === i
                              ? void 0
                              : i.scrollTop) && void 0 !== o
                          ? o
                          : 0;
                      document.documentElement.setAttribute(t, "false"),
                        "true" === n && window.scrollTo(0, l);
                    } else {
                      eR(!0),
                        (nX = {
                          nativePageScrollReplaced: !0,
                          pageScrollContainer: ee.current,
                        });
                      var c = new Event("silk-page-scroll-data-change");
                      if ((document.dispatchEvent(c), "true" === n)) return;
                      var d = window.pageYOffset;
                      if (
                        (document.documentElement.setAttribute(t, "true"),
                        !ee.current)
                      )
                        return;
                      ee.current.scrollTop = d;
                    }
                  }
                })(p);
            },
            [u, p]
          );
          var ej = (0, b.useState)(!0),
            eN = (0, f.A)(ej, 2),
            eM = eN[0],
            eL = eN[1],
            eQ = (0, b.useState)(!0),
            eU = (0, f.A)(eQ, 2),
            eW = eU[0],
            eG = eU[1];
          eo(
            function () {
              var e = ee.current,
                t = et.current,
                n = ea.current,
                a = er.current,
                r = new ResizeObserver(function () {
                  e &&
                    ("y" === l && e.scrollHeight > e.clientHeight
                      ? eL(!0)
                      : eL(!1),
                    "x" === l && e.scrollWidth > e.clientWidth
                      ? eG(!0)
                      : eG(!1));
                });
              return (
                e &&
                  t &&
                  n &&
                  a &&
                  (r.observe(e, {
                    box: "border-box",
                  }),
                  r.observe(t, {
                    box: "border-box",
                  }),
                  r.observe(n, {
                    box: "border-box",
                  }),
                  r.observe(a, {
                    box: "border-box",
                  })),
                function () {
                  r && r.disconnect();
                }
              );
            },
            [l, eb]
          );
          var e_ = (0, b.useState)(!1),
            eV = (0, f.A)(e_, 2),
            eY = eV[0],
            eX = eV[1];
          eo(
            function () {
              eM || eW
                ? eX(!0)
                : eX(function () {
                    return !1;
                  });
            },
            [eM, eW]
          );
          var ez = (0, b.useState)(!1),
            eH = (0, f.A)(ez, 2),
            eK = eH[0],
            eq = eH[1];
          (0, b.useEffect)(function () {
            eq(eF());
          }, []);
          var eZ = (0, b.useRef)(!1),
            eJ = (0, b.useRef)(!1),
            e$ = K || q,
            e0 = (0, b.useState)(V),
            e1 = (0, f.A)(e0, 2),
            e2 = e1[0],
            e5 = e1[1],
            e3 = (0, b.useState)(z),
            e4 = (0, f.A)(e3, 2),
            e8 = e4[0],
            e9 = e4[1];
          (0, b.useEffect)(
            function () {
              var e;
              if (e$) {
                var t = es.current,
                  n = el.current;
                if (!t || !n) return;
                (e = new IntersectionObserver(
                  function (e) {
                    var a,
                      r = en(e);
                    try {
                      for (r.s(); !(a = r.n()).done; ) {
                        var i = a.value;
                        i.target === t
                          ? i.isIntersecting
                            ? ((eZ.current = !0), "x" === l ? e5(V) : e9(z))
                            : (eZ.current = !1)
                          : i.target === n &&
                            (i.isIntersecting
                              ? ((eJ.current = !0), "x" === l ? e5(Y) : e9(H))
                              : (eJ.current = !1)),
                          eZ.current &&
                            eJ.current &&
                            ("x" === l ? e5(!1) : e9(!1));
                      }
                    } catch (e) {
                      r.e(e);
                    } finally {
                      r.f();
                    }
                  },
                  {
                    root: ee.current,
                    rootMargin: "0px",
                    threshold: [1],
                  }
                )).observe(t),
                  e.observe(n);
              }
              return function () {
                e && e.disconnect();
              };
            },
            [Y, V, H, z, l, e$]
          );
          var e7 = (0, b.useRef)(!1),
            e6 = (0, b.useRef)(),
            te = (0, b.useRef)(""),
            tt = (0, b.useRef)(void 0);
          (0, b.useEffect)(
            function () {
              var e = ee.current;
              if (e) {
                var t = function (e) {
                    (tm.current = !1),
                      eI({
                        nativeEvent: e,
                        defaultBehavior: {},
                        handler: T,
                      });
                    var t = document.activeElement;
                    ("ios" == eu || "ipados" == eu) &&
                      t &&
                      eT(t) &&
                      (void 0 === tt.current &&
                        ((te.current = t.style.getPropertyValue("opacity")),
                        t.style.setProperty("opacity", "0.9999", "important")),
                      clearTimeout(tt.current),
                      (tt.current = void 0),
                      (tt.current = setTimeout(function () {
                        "" === te.current
                          ? t.style.removeProperty("opacity")
                          : t.style.setProperty("opacity", te.current),
                          (tt.current = void 0);
                      }, 55)));
                  },
                  n = function (n) {
                    !e7.current &&
                      eI({
                        nativeEvent: n,
                        defaultBehavior: {
                          dismissKeyboard: !1,
                        },
                        handler: x,
                      }).dismissKeyboard &&
                      !e7.current &&
                      !tm.current &&
                      eD() &&
                      e.focus({
                        preventScroll: !0,
                      }),
                      clearTimeout(e6.current),
                      (e6.current = setTimeout(function () {
                        (e7.current = !1),
                          eS(!1),
                          "onscrollend" in window || t(null);
                      }, 90)),
                      (e7.current = !0),
                      eS(!0);
                  };
                return (
                  e.addEventListener("scroll", n),
                  "onscrollend" in window && e.addEventListener("scrollend", t),
                  function () {
                    e.removeEventListener("scroll", n),
                      "onscrollend" in window &&
                        e.removeEventListener("scrollend", t);
                  }
                );
              }
            },
            [T, x]
          ),
            (0, b.useEffect)(
              function () {
                return (
                  D && th.addNativeFocusScrollPreventer(ec),
                  function () {
                    D && th.removeNativeFocusScrollPreventer(ec);
                  }
                );
              },
              [D, ec]
            );
          var tn = (0, b.useMemo)(
              function () {
                return u && !eP;
              },
              [eP, u]
            ),
            ta = (0, b.useMemo)(
              function () {
                return "y" === l
                  ? tn
                    ? function () {
                        return window.scrollY;
                      }
                    : function () {
                        var e;
                        return null === (e = ee.current) || void 0 === e
                          ? void 0
                          : e.scrollTop;
                      }
                  : tn
                  ? function () {
                      return window.scrollX;
                    }
                  : function () {
                      var e;
                      return null === (e = ee.current) || void 0 === e
                        ? void 0
                        : e.scrollLeft;
                    };
              },
              [l, tn]
            ),
            tr = (0, b.useMemo)(
              function () {
                return "y" === l
                  ? tn
                    ? function () {
                        return document.body.scrollHeight - window.innerHeight;
                      }
                    : function () {
                        var e = ee.current;
                        return (
                          (null == e ? void 0 : e.scrollHeight) -
                          (null == e ? void 0 : e.offsetHeight)
                        );
                      }
                  : tn
                  ? function () {
                      return document.body.scrollWidth - window.innerWidth;
                    }
                  : function () {
                      var e = ee.current;
                      return (
                        (null == e ? void 0 : e.scrollWidth) -
                        (null == e ? void 0 : e.offsetWidth)
                      );
                    };
              },
              [l, tn]
            ),
            ti = (0, b.useCallback)(
              function () {
                return ta() / tr();
              },
              [ta, tr]
            ),
            to = (0, b.useCallback)(
              function (e) {
                null == w ||
                  w({
                    progress: ti(),
                    distance: ta(),
                    availableDistance: tr(),
                    nativeEvent: e,
                  });
              },
              [ti, ta, tr, w]
            );
          (0, b.useEffect)(
            function () {
              return (
                tn && w && document.addEventListener("scroll", to),
                function () {
                  tn && w && document.removeEventListener("scroll", to);
                }
              );
            },
            [tn, w, to]
          );
          var ts = (0, b.useCallback)(
              function (e, t) {
                var n,
                  a = t.progress,
                  r = t.distance,
                  i = t.animationSettings,
                  o =
                    void 0 === i
                      ? {
                          skip: "default",
                        }
                      : i,
                  s = null != r ? r : (null != a ? a : NaN) * tr();
                if (!isNaN(s)) {
                  var c = null == o ? void 0 : o.skip,
                    u = tn ? window : ee.current;
                  null == u ||
                    u["to" === e ? "scrollTo" : "scrollBy"](
                      ((n = {}),
                      (0, m.A)(n, "y" === l ? "top" : "left", s),
                      (0, m.A)(
                        n,
                        "behavior",
                        !0 === c
                          ? "instant"
                          : !1 === c
                          ? "smooth"
                          : "default" === c
                          ? "auto"
                          : eO
                          ? "instant"
                          : "smooth"
                      ),
                      n)
                    );
                }
              },
              [l, tr, tn]
            ),
            tl = (0, b.useCallback)(
              function (e) {
                return ts("to", e);
              },
              [ts]
            ),
            tc = (0, b.useCallback)(
              function (e) {
                return ts("by", e);
              },
              [ts]
            );
          (0, b.useEffect)(
            function () {
              (ef.current = tl), (ep.current = tc);
            },
            [tc, ep, tl, ef]
          ),
            (0, b.useImperativeHandle)(
              eA,
              function () {
                return {
                  getProgress: ti,
                  getDistance: ta,
                  getAvailableDistance: tr,
                  scrollTo: tl,
                  scrollBy: tc,
                };
              },
              [tr, ta, ti, tl, tc]
            );
          var tu = (0, b.useRef)(!1),
            td = (0, b.useRef)(),
            tA = (0, b.useRef)(),
            tf = (0, b.useRef)(0),
            tp = (0, b.useRef)(0),
            tm = (0, b.useRef)(!1),
            tg = (0, b.useCallback)(
              function (e) {
                var t,
                  n,
                  a = e.scrollIntoPlace,
                  r = void 0 === a || a,
                  i = e.scrollBehavior,
                  o = e.safeViewport,
                  s = void 0 === o ? "visual-viewport" : o;
                if (
                  ee.current &&
                  et.current &&
                  er.current &&
                  ea.current &&
                  "y" === l &&
                  "none" !== s &&
                  (null == ev || !ev.current || null !== eg().top) &&
                  ((null == ev ? void 0 : ev.current) || !eg)
                ) {
                  if (null == ev ? void 0 : ev.current) {
                    var c = nZ(ee.current),
                      u = c.top,
                      d = c.bottom,
                      A = ev.current.getBoundingClientRect(),
                      f = A.top,
                      p = A.bottom;
                    (t = eg().top + (u - f)), (n = eg().bottom - (p - d));
                  } else {
                    var m = nZ(ee.current),
                      h = m.top,
                      g = m.bottom;
                    (t = h), (n = g);
                  }
                  var v = nJ(),
                    b = v.top,
                    y = v.bottom,
                    C = Math.min(
                      n,
                      "visual-viewport" === s ? y : window.innerHeight
                    ),
                    k = Math.abs(
                      Math.min(t + ("visual-viewport" === s ? b : 0), 0)
                    ),
                    S = Math.max(
                      n - ("visual-viewport" === s ? y : window.innerHeight),
                      0
                    );
                  if (
                    !(
                      1 > Math.abs(tf.current - k) &&
                      1 > Math.abs(tp.current - S)
                    )
                  ) {
                    var E = -1 * (C - er.current.getBoundingClientRect().top),
                      x =
                        ee.current.offsetHeight - et.current.offsetHeight >= 0,
                      w = function () {
                        n$(ea.current, k, tf), n$(er.current, S, tp);
                      };
                    if (
                      ("smooth" === i && (E < 0 || x)
                        ? r &&
                          ((tm.current = !0),
                          x
                            ? ee.current.scrollTo({
                                top: 0,
                                behavior: i,
                              })
                            : ee.current.scrollBy({
                                top: E,
                                behavior: i,
                              }),
                          (tp.current = S),
                          nq(ee.current, function () {
                            ee.current &&
                              x &&
                              ee.current.scrollTo({
                                top: 0,
                                behavior: "instant",
                              }),
                              w();
                          }))
                        : w(),
                      !r)
                    )
                      return {
                        spacersHeightSetter: w,
                        verticalScrollOffsetRequired: E,
                      };
                  }
                }
              },
              [l, eg, ev]
            ),
            tv = (0, b.useCallback)(
              function () {
                return tg({
                  scrollBehavior: nK,
                  safeViewport: v,
                });
              },
              [v, tg]
            );
          eo(
            function () {
              tv();
            },
            [tv]
          ),
            (0, b.useEffect)(
              function () {
                var e = ee.current,
                  t = function (t) {
                    clearTimeout(td.current), clearTimeout(tA.current);
                    var n = t.target;
                    if (n !== e) {
                      var a = eI({
                        nativeEvent: t,
                        defaultBehavior: {
                          scrollIntoView: !0,
                        },
                        handler: P,
                      }).scrollIntoView;
                      if (!(!eT(n) || ex(n))) {
                        var r = n.getBoundingClientRect().top - 0,
                          i = n.getBoundingClientRect().bottom - 0,
                          o = nZ(ee.current),
                          s = o.top,
                          l = o.bottom,
                          c = s - 0,
                          u = l - 0,
                          d = function e() {
                            if (
                              (clearTimeout(td.current),
                              clearTimeout(tA.current),
                              eD())
                            ) {
                              tu.current = !0;
                              var t = nJ(),
                                n = t.top,
                                o = t.bottom,
                                s = (
                                  tg({
                                    scrollIntoPlace: !1,
                                    scrollBehavior: "smooth",
                                    safeViewport: v,
                                  }) || {}
                                ).spacersHeightSetter;
                              (void 0 === s ? function () {} : s)(),
                                a &&
                                  n0({
                                    scrollContainer: ee.current,
                                    behavior: nK,
                                    scrollMarginTop: 64,
                                    scrollMarginBottom: nH,
                                    elementTop: r,
                                    elementBottom: i,
                                    scrollPortTop: c,
                                    scrollPortBottom: u,
                                    visualViewportTop: n,
                                    visualViewportBottom: o,
                                    beforeScrollCallback: function () {
                                      return (tm.current = !0);
                                    },
                                  }),
                                visualViewport.removeEventListener("resize", e);
                            }
                          };
                        tu.current
                          ? (d(),
                            visualViewport.addEventListener("resize", d),
                            (td.current = setTimeout(function () {
                              visualViewport.removeEventListener("resize", d);
                            }, 900)))
                          : (visualViewport.addEventListener("resize", d),
                            (tA.current = setTimeout(function () {
                              visualViewport.removeEventListener("resize", d),
                                d();
                            }, 900)));
                      }
                    }
                  },
                  n = function (e) {
                    var t = e.target;
                    !eT(t) ||
                      ex(t) ||
                      eT(e.relatedTarget) ||
                      ((tu.current = !1),
                      tg({
                        scrollBehavior: nK,
                        safeViewport: "none" === v ? "none" : "layout-viewport",
                      }));
                  },
                  a = function () {
                    var e;
                    null === (e = ee.current) ||
                      void 0 === e ||
                      e.removeEventListener("scroll", tv),
                      setTimeout(function () {
                        tv(),
                          setTimeout(function () {
                            var e;
                            null === (e = ee.current) ||
                              void 0 === e ||
                              e.addEventListener("scroll", tv, {
                                once: !0,
                              });
                          }, 200);
                      }, 1),
                      setTimeout(function () {
                        return tv;
                      }, 350);
                  };
                return (
                  null == e ||
                    e.addEventListener("focus", t, {
                      capture: !0,
                    }),
                  null == e ||
                    e.addEventListener("blur", n, {
                      capture: !0,
                    }),
                  visualViewport.addEventListener("resize", a),
                  null == e ||
                    e.addEventListener("scroll", tv, {
                      once: !0,
                    }),
                  function () {
                    null == e ||
                      e.removeEventListener("focus", t, {
                        capture: !0,
                      }),
                      null == e ||
                        e.removeEventListener("blur", n, {
                          capture: !0,
                        }),
                      visualViewport.removeEventListener("resize", a),
                      null == e || e.removeEventListener("scroll", tv);
                  }
                );
              },
              [P, v, tg, tv]
            );
          var tb = eB(ee),
            ty = (0, b.useMemo)(
              function () {
                return u && !eP;
              },
              [eP, u]
            ),
            tC = eh("Scroll", {
              axis: l,
              scrollTrapX: e2,
              scrollTrapY: (!eK && e8) || (tb && !ty),
              scrollGestureOvershoot: void 0 === k || k,
              scrollDisabled: eb,
              pageScroll: u,
              nativePageScrollReplacement: p,
              overflowX: eW,
              overflowY: eM,
              skipScrollAnimation: null == R ? void 0 : R.skip,
              scrollAnchoring: void 0 === j || j,
              scrollSnapType: Z,
              nativeScrollbar: void 0 === U || U,
              scrollOngoing: ek,
            });
          return (0, g.jsxs)(nY.Provider, {
            value: {
              contentRef: et,
              axis: l,
              styleAttributes: tC,
              nativeFocusScrollPrevention: D,
              swipeTrapIncapable: ty,
              focusable: eY,
              pageScroll: u,
              nativePageScrollReplacement: p,
              scrollContainerRef: ee,
              swipeTrapObserverRequired: e$,
              startScrollSpyRef: es,
              endScrollSpyRef: el,
              startSpacerRef: ea,
              endSpacerRef: er,
              scrollHandler: to,
              scrollPadding: F,
              scrollTimelineName: Q,
            },
            children: [
              u &&
                !0 !== p &&
                (0, g.jsx)("style", {
                  dangerouslySetInnerHTML: {
                    __html:
                      '\n                            html[data-silk-native-page-scroll-replaced="false"] > body {\n                                scroll-padding: '
                        .concat(
                          F,
                          ";\n                                scroll-timeline-axis: "
                        )
                        .concat(Q, " ")
                        .concat(
                          l,
                          ";\n                            }\n                        "
                        ),
                  },
                }),
              u &&
                !0 === p &&
                (0, g.jsx)("script", {
                  id: "silk-scroll-nativePageScrollReplacement-true",
                  dangerouslySetInnerHTML: {
                    __html:
                      '\n                            document.documentElement.setAttribute("data-silk-native-page-scroll-replaced", "true");\n                        ',
                  },
                }),
              u &&
                !1 === p &&
                (0, g.jsx)("script", {
                  id: "silk-scroll-nativePageScrollReplacement-false",
                  dangerouslySetInnerHTML: {
                    __html:
                      '\n                            document.documentElement.setAttribute("data-silk-native-page-scroll-replaced", "false");\n                        ',
                  },
                }),
              u &&
                "auto" === p &&
                (0, g.jsx)("script", {
                  id: "silk-scroll-nativePageScrollReplacement-auto",
                  dangerouslySetInnerHTML: {
                    __html:
                      '\n                            const standalone =\n                                window.matchMedia(\'(display-mode: standalone)\').matches || window.navigator.standalone;\n                            const mobile = window.navigator.userAgent?.match(/android|iPhone|iPad/i);\n\n                            document.documentElement.setAttribute("data-standalone", !!standalone);\n                            document.documentElement.setAttribute("data-silk-native-page-scroll-replaced", !(mobile && !standalone));\n                        ',
                  },
                }),
              (0, g.jsx)(n5, {}),
              (0, g.jsx)(
                J,
                ei(
                  ei(
                    ei(
                      {},
                      tC(
                        "view",
                        [
                          "axis",
                          "pageScroll",
                          "skipScrollAnimation",
                          "scrollOngoing",
                        ],
                        {
                          className: r,
                          dataSilk: [i],
                        }
                      )
                    ),
                    W
                  ),
                  {},
                  {
                    ref: $,
                    children: a,
                  }
                )
              ),
            ],
          });
        });
      n4.displayName = "Scroll.View";
      var n8 = b.forwardRef(function (e, t) {
        var n = e.side,
          a = (0, A.A)(e, z),
          r = eh("Scroll", {
            side: n,
            axis: ((0, b.useContext)(nY) || {}).axis,
          });
        return (0, g.jsx)(
          "div",
          ei(
            ei({}, r("spy", ["side", "axis"])),
            {},
            {
              ref: t,
            },
            a
          )
        );
      });
      n8.displayName = "Scroll.Anonymous";
      var n9 = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.className,
          r = e["data-silk"],
          i = (0, A.A)(e, H),
          o = n ? tW : "div",
          s = (0, b.useContext)(nY) || {},
          l = s.contentRef,
          c = s.styleAttributes,
          u = s.nativeFocusScrollPrevention,
          d = s.swipeTrapIncapable,
          f = s.focusable,
          p = s.axis,
          m = s.pageScroll,
          h = s.nativePageScrollReplacement,
          v = s.scrollContainerRef,
          y = s.swipeTrapObserverRequired,
          C = s.startScrollSpyRef,
          k = s.endScrollSpyRef,
          S = s.startSpacerRef,
          E = s.endSpacerRef,
          x = s.scrollHandler,
          w = s.scrollPadding,
          T = s.scrollTimelineName,
          P = tB(l, t);
        return (0, g.jsxs)(
          "div",
          ei(
            ei(
              {},
              c(
                "scrollContainer",
                [
                  "axis",
                  "pageScroll",
                  "scrollTrapX",
                  "scrollTrapY",
                  "scrollGestureOvershoot",
                  "scrollDisabled",
                  "overflowX",
                  "overflowY",
                  "skipScrollAnimation",
                  "scrollAnchoring",
                  "scrollSnapType",
                  "nativeScrollbar",
                ],
                {
                  dataSilk: [r, "0ad", u && "0ah", d && "0ai"],
                }
              )
            ),
            {},
            {
              style: {
                scrollPadding: w,
                scrollTimeline: T + " " + p,
              },
              tabIndex: f ? 0 : u ? -1 : void 0,
              role: m && !h ? void 0 : "region",
              onScroll: x,
              ref: v,
              children: [
                y &&
                  (0, g.jsx)(n8, {
                    side: "start",
                    ref: C,
                  }),
                "y" === p &&
                  (0, g.jsx)(
                    "div",
                    ei(
                      {
                        ref: S,
                      },
                      c("startSpacer", ["axis", "pageScroll"])
                    )
                  ),
                (0, g.jsx)(
                  o,
                  ei(
                    ei(
                      ei(
                        {},
                        c(
                          "content",
                          [
                            "axis",
                            "scrollTrapX",
                            "scrollTrapY",
                            "overflowX",
                            "overflowY",
                          ],
                          {
                            className: a,
                            dataSilk: [r],
                          }
                        )
                      ),
                      i
                    ),
                    {},
                    {
                      ref: P,
                    }
                  )
                ),
                "y" === p &&
                  (0, g.jsx)(
                    "div",
                    ei(
                      {
                        ref: E,
                      },
                      c("endSpacer", ["axis", "pageScroll"])
                    )
                  ),
                y &&
                  (0, g.jsx)(n8, {
                    side: "end",
                    ref: k,
                  }),
              ],
            }
          )
        );
      });
      n9.displayName = "Scroll.Content";
      var n7 = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = (0, A.A)(e, K),
          r = n ? tW : "button",
          i = a.forComponent,
          o = a.onPress,
          s = a.onClick,
          l = a.children,
          c = a.action,
          u = (0, A.A)(a, q),
          d = c || {},
          f = d.type,
          p = (0, A.A)(d, Z),
          m = nz(i),
          h = m.scrollTo,
          v = m.scrollBy,
          y = (0, b.useRef)(null),
          C = tB(y, t);
        return (0, g.jsx)(
          r,
          ei(
            ei(
              {
                onClick: function (e) {
                  var t,
                    n = eI({
                      nativeEvent: e,
                      defaultBehavior: {
                        forceFocus: !0,
                        runAction: !0,
                      },
                      handler: o,
                    }),
                    a = n.forceFocus,
                    r = n.runAction;
                  if (
                    (a &&
                      (null === (t = y.current) ||
                        void 0 === t ||
                        t.focus({
                          preventScroll: !0,
                        })),
                    r)
                  ) {
                    if ("scroll-to" === f) return h(p);
                    if ("scroll-by" === f) return v(p);
                  }
                  null == s || s(e);
                },
                ref: C,
              },
              u
            ),
            {},
            {
              children: l,
            }
          )
        );
      });
      n7.displayName = "Sheet.Trigger";
      var n6 = {
        Root: n1,
        Trigger: n7,
        View: n4,
        Content: n9,
      };
      b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.className,
          r = e["data-silk"],
          i = e.timing,
          o = e.forComponent,
          s = e.tabIndex,
          l = (0, A.A)(e, J),
          c = n ? tW : "div",
          u = ((o && (0, b.useContext)(null != o ? o : t5)) || {}).sheetId,
          d = null != u ? u : "any",
          f = (0, b.useCallback)(
            function (e) {
              th.addAutoFocusTarget({
                layerId: d,
                element: e,
                timing: i,
              });
            },
            [d, i]
          ),
          p = (0, b.useCallback)(function (e) {
            th.removeAutoFocusTarget(e);
          }, []),
          m = (0, b.useRef)(null),
          h = (0, b.useCallback)(
            function (e) {
              e ? f(e) : p(m.current), (m.current = e);
            },
            [f, p]
          ),
          v = (0, b.useRef)(!0);
        (0, b.useEffect)(
          function () {
            return (
              m.current && !v.current && f(m.current),
              (v.current = !1),
              function () {
                m.current && p(m.current);
              }
            );
          },
          [f, p]
        );
        var y = tB(h, t),
          C = eh("AutoFocusTarget", {});
        return (0, g.jsx)(
          c,
          ei(
            ei(
              ei(
                ei(
                  {},
                  C("root", [], {
                    className: a,
                    dataSilk: [r],
                  })
                ),
                n || Number.isInteger(s)
                  ? {}
                  : {
                      tabIndex: -1,
                    }
              ),
              l
            ),
            {},
            {
              ref: y,
            }
          )
        );
      }).displayName = "AutoFocusTarget.Root";
      var ae = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.disabled,
          r = void 0 !== a && a,
          i = e.children,
          o = e.contentGetter,
          s = e.forComponent,
          l = (0, A.A)(e, $),
          c = (0, b.useRef)(null),
          u = tB(c, t),
          d = (0, b.useMemo)(
            function () {
              return !!i;
            },
            [i]
          );
        return ((0, b.useEffect)(
          function () {
            var e, t;
            if (!r) {
              var n,
                a = !1;
              if (
                (d && c.current
                  ? (n = c.current)
                  : o && (n = eS(o)) && (a = !0),
                n)
              ) {
                var i = Array.isArray(s) ? s : s ? [s] : [];
                (e = th.addIsland({
                  componentId: i,
                  element: n,
                })),
                  a &&
                    (t = new MutationObserver(function () {
                      eS(o) || (th.removeIsland(e), t.disconnect());
                    })).observe(n.parentElement, {
                      childList: !0,
                    });
              }
            }
            return function () {
              r || (th.removeIsland(e), null == t || t.disconnect());
            };
          },
          [t, r, d, o, s]
        ),
        i)
          ? (0, g.jsx)(
              tJ.Root,
              ei(
                ei(
                  {
                    active: !r,
                    asChild: n,
                    "data-silk": "0ag",
                  },
                  l
                ),
                {},
                {
                  ref: u,
                  children: i,
                }
              )
            )
          : null;
      });
      ae.displayName = "Island.Root";
      var at = b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.children,
          r = (0, A.A)(e, ee);
        return (0, g.jsx)(
          tJ.Stabiliser,
          ei(
            ei(
              {
                asChild: n,
              },
              r
            ),
            {},
            {
              ref: t,
              children: a,
            }
          )
        );
      });
      at.displayName = "Island.Content";
      var an = {
        Root: ae,
        Content: at,
      };
      b.forwardRef(function (e, t) {
        var n = e.asChild,
          a = e.children,
          r = e.contentGetter,
          i = e.disabled,
          o = void 0 !== i && i,
          s = e.selfManagedInertOutside,
          l = void 0 === s || s,
          c = (0, A.A)(e, et),
          u = tU(),
          d = (0, b.useRef)(null),
          f = tB(d, t),
          p = n ? tW : "div",
          m = (0, b.useMemo)(
            function () {
              return !!a;
            },
            [a]
          );
        return (
          eo(
            function () {
              var e;
              if (!o && u) {
                var t,
                  n = !1;
                m && d.current ? (t = d.current) : r && (t = eS(r)) && (n = !0),
                  t &&
                    (th.updateLayer({
                      external: !0,
                      layerId: u,
                      viewElement: t,
                      inertOutside: l,
                      onPresentAutoFocus: {
                        focus: !1,
                      },
                      onDismissAutoFocus: {
                        focus: !1,
                      },
                      defaultClickOutsideAction: function () {},
                      defaultEscapeKeyDownAction: function () {},
                    }),
                    n &&
                      (e = new MutationObserver(function () {
                        eS(r) || (th.removeLayer(u), e.disconnect());
                      })).observe(t.parentElement, {
                        childList: !0,
                      }));
              }
              return function () {
                !o && u && (th.removeLayer(u), null == e || e.disconnect());
              };
            },
            [m, r, o, u, l]
          ),
          (0, g.jsx)(
            p,
            ei(
              ei(
                {
                  ref: f,
                },
                c
              ),
              {},
              {
                children: a,
              }
            )
          )
        );
      }).displayName = "ExternalOverlay.Root";
      var aa = function () {
          var e = b.createContext(null);
          return (e.displayName = "ComponentIdContext"), e;
        },
        ar = function (e) {
          var t = (0, b.useState)(window.matchMedia(e).matches),
            n = (0, f.A)(t, 2),
            a = n[0],
            r = n[1];
          return (
            (0, b.useEffect)(
              function () {
                var t = window.matchMedia(e),
                  n = function (e) {
                    r(e.matches);
                  };
                return (
                  t.addEventListener("change", n),
                  function () {
                    return t.removeEventListener("change", n);
                  }
                );
              },
              [e]
            ),
            a
          );
        },
        ai = function (e) {
          var t = e.elementRef,
            n = e.dimmingColor,
            a = (0, b.useId)(),
            r = (0, b.useRef)(0),
            i = (0, b.useState)(null),
            o = (0, f.A)(i, 2),
            s = o[0],
            l = o[1],
            c = (0, b.useState)(!1),
            u = (0, f.A)(c, 2),
            d = u[0],
            A = u[1],
            p = eG(function (e) {
              var n;
              d && th.updateThemeColorDimmingOverlayAlphaValue(s, e),
                null == t ||
                  null === (n = t.current) ||
                  void 0 === n ||
                  n.style.setProperty("opacity", e),
                (r.current = e);
            }),
            m = eG(function (e) {
              var n = e.keyframes,
                a = e.duration,
                r = e.easing,
                i = (0, f.A)(n, 2),
                o = i[0],
                l = i[1],
                c = function (e) {
                  return o + (l - o) * e;
                };
              eW(
                d
                  ? function (e) {
                      var n,
                        a = c(e);
                      th.updateThemeColorDimmingOverlayAlphaValue(s, a),
                        null == t ||
                          null === (n = t.current) ||
                          void 0 === n ||
                          n.style.setProperty("opacity", a);
                    }
                  : function (e) {
                      var n,
                        a = c(e);
                      null == t ||
                        null === (n = t.current) ||
                        void 0 === n ||
                        n.style.setProperty("opacity", a);
                    },
                {
                  duration: void 0 === a ? 500 : a,
                  cubicBezier: t4(
                    void 0 === r ? "cubic-bezier(0.25, 0.1, 0.25, 1)" : r
                  ),
                }
              );
            });
          return (
            eo(
              function () {
                var e = !!(
                  eQ() &&
                  !eL() &&
                  th.getAndStoreUnderlyingThemeColorAsRGBArray()
                );
                if ((A(e), e))
                  return (
                    l(
                      th.updateThemeColorDimmingOverlay({
                        abortRemoval: !0,
                        dimmingOverlayId: a,
                        color: n,
                        alpha: r.current,
                      })
                    ),
                    function () {
                      e && th.removeThemeColorDimmingOverlay(a);
                    }
                  );
              },
              [n, a]
            ),
            {
              setDimmingOverlayOpacity: p,
              animateDimmingOverlayOpacity: m,
            }
          );
        },
        ao = function () {
          var e = (0, b.useState)(nX),
            t = (0, f.A)(e, 2),
            n = t[0],
            a = t[1];
          return (
            (0, b.useEffect)(function () {
              a(nX);
              var e = function () {
                a(nX);
              };
              return (
                document.addEventListener("silk-page-scroll-data-change", e),
                function () {
                  return document.removeEventListener(
                    "silk-page-scroll-data-change",
                    e
                  );
                }
              );
            }, []),
            n
          );
        },
        as = function (e, t, n) {
          if (e && t) {
            var a = n || {},
              r = a.duration,
              i = a.easing,
              o = e.animate(t, {
                duration: void 0 === r ? 500 : r,
                easing: void 0 === i ? "cubic-bezier(0.25, 0.1, 0.25, 1)" : i,
                fill: "forwards",
              });
            o.onfinish = function () {
              o.commitStyles(), o.cancel();
            };
          }
        };
    },
  },
]);
