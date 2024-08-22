import React, { useEffect } from "react";
import Header from "@/Components/Header";
import $ from "jquery";
import Link from "next/link";
import Contact from "@/Components/Contact";
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

export default function Home({ tst, key, auth, logout }) {

  useEffect(() => {
    var view = "body";
    var viewport = $(view);
    var Image = window.Image;
    var src = $("[data-src]");
    var menu = $(".navbar-menu");
    var goUp = $(".footer-top-icon");
    var input = $("input, textarea");
    var godown = $(".sidebar, .layer-footer");

    // Changes the nav's color to either black or white
    var _scroll = function () {
      $(".navbar-link, .navbar, .navbar-menu").each(function (indx) {
        var type, $link = $(this), link = this.getBoundingClientRect();
        $(".scroll-snap").each(function (i) {
          var $snap = $(this),
            snap = this.getBoundingClientRect();
          if (link.bottom >= snap.top && link.top <= snap.bottom) {
            type =
              $snap.hasClass("light") ||
                ($snap.hasClass("layer-intro") && $(document).width() < 700)
                ? "nav-white"
                : "nav-black";
            $link.addClass(type);
          }
          $link.removeClass(
            type === "nav-white"
              ? "nav-black"
              : type === "nav-black"
                ? "nav-white"
                : "nav-black"
          );
        });
      });
    };

    // Toggle between focused for input and textarea's if
    var blur = function () {
      $(this).each(function () {
        if ($(this).val()) {
          $(this).addClass("focused");
        } else {
          $(this).removeClass("focused");
        }
      });
    };

    if (src.length) {
      // Creates background images with a cool parallax effect
      src.each(function () {
        var $this = $(this);
        var img = new Image();
        var _src = $this.attr("data-src");
        var _class = $this.attr("class");
        var _alt = $this.attr("alt");
        $this.removeAttr("alt");

        img.src = _src;
        img.onload = function () {
          var $img = $(img);
          $img.attr("alt", _alt);
          $img.attr("class", _class);
          $this.before(img);
          $this.css({
            "background-image": "url('" + _src + "')",
          });
        };

        img.onerror = function (o) {
          // console.log("One of the images didn't load: " + o);
        };
      });
    }

    $(document).ready(function () {
      if (menu.length) {
        // Pull out the navbar menu when it is hidden (mobile)
        menu.click(function () {
          $(".navbar.nav2").toggleClass("navbar-list-show");
          $(".navbar.nav2.navbar-list-show li.navbar-link").animate(
            { opacity: "1" },
            500,
            "swing"
          );
          $(".navbar.nav2:not(.navbar-list-show) li.navbar-link").animate(
            { opacity: "0" },
            100,
            "swing"
          );
        });
      }

      if (godown.length) {
        // When clicked goes down to the next layer that scrolling can snap too (".scroll-snap" class)
        godown.click(function (e) {
          var Top = viewport.scrollTop();
          e.preventDefault();
          var Next = $(this).hasClass("the-end")
            ? $(".footer.scroll-snap")
            : $(this).parents(".scroll-snap").next(".scroll-snap");
          viewport.animate(
            { scrollTop: Next.offset().top + Top },
            600,
            "swing"
          );
        });
      }

      if (goUp.length) {
        // When clicked sends the user back to the top
        goUp.click(function (e) {
          e.preventDefault();
          viewport.animate({ scrollTop: 0 }, 1000, "swing");
        });
      }

      if (input.length) {
        // If text is typed set a different style for the input and textarea
        input.on("keyup blur focus", blur);
      }
    });

    viewport.scroll(_scroll);
    viewport.resize(_scroll);
    _scroll();

    function SmoothScroll(speed, smooth) {
      var target = document.body;
      // cross browser support for document scrolling
      var moving = false;
      var pos = target.scrollTop;
      target.addEventListener("mousewheel", scrolled, { passive: true });
      target.addEventListener("DOMMouseScroll", scrolled, { passive: true });

      function scrolled(e) {
        e.preventDefault(); // disable default scrolling

        var delta = normalizeWheelDelta(e);

        pos += -delta * speed;
        pos = Math.max(
          0,
          Math.min(pos, target.scrollHeight - target.clientHeight)
        ); // limit scrolling

        if (!moving) {
          update();
        }
      }

      function normalizeWheelDelta(e) {
        if (e.detail) {
          if (e.wheelDelta) {
            return (e.wheelDelta / e.detail / 40) * (e.detail > 0 ? 1 : -1); // Opera
          } else {
            return -e.detail / 3; // Firefox
          }
        } else {
          return e.wheelDelta / 120; // IE,Safari,Chrome
        }
      }

      function update() {
        moving = true;
        var delta = (pos - target.scrollTop) / smooth;
        target.scrollTop += delta;
        if (Math.abs(delta) > 0.5) {
          requestFrame(update);
        } else {
          moving = false;
        }
      }

      var requestFrame = (function () {
        // requestAnimationFrame cross browser
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (func) {
            window.setTimeout(func, 1000 / 60);
          }
        );
      })();
    }
    // SmoothScroll(120, 40);
  }, []);

  const copyright = (start) => {
    let currentYear = new Date().getFullYear();
    return start === currentYear ? currentYear : `${start}-${currentYear % 100}`;
  }

  return (
    <>
      <Header auth={auth} logout={logout} />
      <main className="main">
        <section className="layout layout-enlarge layer layer-intro scroll-snap">
          <article className="layout-contain layout-contain-large">
            <div className="layer-image">
            </div>
            <div className="layer-title-posititon">
              <h1 className="layer-title style-capital style-center style-bolder">
                Let&apos;s
                <br />
                Fly ✈
              </h1>
            </div>
            <div className="layer-footer">
              <a className="layer-scroll style-uppercase"> Take off </a>
            </div>

            <section className="sidebar sidebar-absolute nav-white wow slideInRight">
              <article className="sidebar-layout">
                <ul className="sidebar-list">
                  <li className="sidebar-link style-uppercase style-regular">
                    <a href="">Take off</a>
                    <span className="track"></span>
                    <span className="thumb"></span>
                  </li>
                </ul>
              </article>
            </section>
          </article>
        </section>

        <section className="layout layout-enlarge layer scroll-snap">
          <article className="layout-contain">
            <div className="layer-header">
              <h3 className="layer-title style-uppercase style-bolder wow fadeIn">
                <span className="style-pink">About</span> Us.
              </h3>
            </div>
            <div className="layer-content">
              <p className="layout-margin-horz-dull wow fadeIn text-justify">
                Welcome to Let&apos;s Fly, your one-stop destination for hassle-free air travel bookings. At Let&apos;s Fly, we understand the importance of seamless travel experiences and strive to make your journey as comfortable as possible. Our user-friendly platform enables you to search, compare and book flights with ease, allowing you to focus on what really matters - your travel plans.
              </p>
              <Link className="more wow fadeIn style-uppercase style-regular layout-margin-vert-bottom" href="/">Learn more</Link>
            </div>
            <div className="layer-footer wow fadeIn">
              <a className="layer-scroll style-uppercase style-pink style-bolder style-small">OUR EFFORT</a>
            </div>
          </article>
        </section>

        <section className="layer layer-black layer-hero scroll-snap light">
          <section className="layout">
            <article className="layout-contain-large layout-padding-vert-large">
              <section className="layer-content">
                <h3
                  className="style-bold style-uppercase layer-title style-center style-pink wow fadeIn"
                >
                  <span className="style-white">Our</span> Efforts.
                </h3>
                <section className="layout-row layout-margin-vert-bottom">
                  <section
                    className="layout-col-4 layout-padding-vert-top-large style-white wow fadeIn"
                  >
                    <h1 className="style-center">
                      <i className="mi icons">place</i>
                    </h1>
                    <h3 className="style-center">69+</h3>
                    <h6
                      className="style-center style-small style-uppercase style-pink style-bold"
                    >
                      Locations
                    </h6>
                  </section>
                  <section
                    className="layout-col-4 layout-padding-vert-top-large style-white wow fadeIn"
                  >
                    <h1 className="style-center">
                      <i className="mi icons">supervisor_account</i>
                    </h1>
                    <h3 className="style-center">100+</h3>
                    <h6
                      className="style-center style-small style-uppercase style-pink style-bold"
                    >
                      Clients
                    </h6>
                  </section>
                  <section
                    className="layout-col-4 layout-padding-vert-top-large style-white wow fadeIn"
                  >
                    <h1 className="style-center">
                      <i className="mi icons">payment</i>
                    </h1>
                    <h3 className="style-center">₹10,000+</h3>
                    <h6
                      className="style-center style-small style-uppercase style-pink style-bold"
                    >
                      Amount Saved
                    </h6>
                  </section>
                </section>
              </section>
              <div className="layer-footer wow fadeIn">
                <a
                  className="layer-scroll style-uppercase style-pink style-bolder style-small"
                >
                  OUR SERVICES
                </a>
              </div>
            </article>
          </section>
          <div className="layer-image layer-hero-image wow fadeIn"></div>
        </section>

        <section className="layout layer scroll-snap">
          <article className="layout-contain-large">
            <section className="layer-content layout-margin-vert-bottom-large">
              <h3
                className="style-bold style-uppercase layer-title layout-margin-vert-bottom-large style-center style-pink wow fadeIn"
              >
                <span className="style-black">Our</span> Services.
              </h3>
              <section className="layout-row">
                <section
                  className="layout-col-4 layout-padding-vert-bottom-large wow fadeIn service-card text-justify"
                >
                  <h1 className="style-center">
                    <i className="mi icons">account_balance_wallet</i>
                  </h1>
                  <span className="style-pink style-bolder style-larger style-fancy"
                  >W</span
                  >e provide competitive pricing for flights, ensuring that our customers get the best deals and offers for their desired destination.
                </section>
                <section
                  className="layout-col-4 layout-padding-vert-bottom-large wow fadeIn service-card text-justify"
                >
                  <h1 className="style-center">
                    <i className="mi icons">format_quote</i>
                  </h1>
                  <span className="style-pink style-bolder style-larger style-fancy"
                  >W</span
                  >e provide high quality service in the form of tour quotes which
                  helps our clients get from here to there with ease.
                </section>
                <section
                  className="layout-col-4 layout-padding-vert-bottom-large wow fadeIn service-card text-justify"
                >
                  <h1 className="style-center"><i className="mi icons">place</i></h1>
                  <span className="style-pink style-bolder style-larger style-fancy"
                  >W</span
                  >e provide high quality service in the form of destinations for
                  special events which helps our clients visit many parts of the
                  world in luxury.
                </section>
              </section>

              <article className="layout-contain style-center">
                <Link className="more style-uppercase style-regular style-center wow fadeIn" href="/">Learn More.</Link>
              </article>
            </section>
            <div className="layer-footer wow fadeIn">
              <a
                className="layer-scroll style-uppercase style-pink style-bolder style-small"
              >
                Contact Us
              </a>
            </div>
          </article>
        </section>


        <section
          className="layer layer-form layer-hero layer-black scroll-snap light"
        >
          <section className="layout layout-enlarge layout-shrink-mini-horz">
            <Contact tst={tst} />
            <div className="layer-footer wow fadeIn the-end">
              <a
                className="layer-scroll style-uppercase style-pink style-bolder style-small layout-margin-vert-top-large"
              >
                The End
              </a>
            </div>
          </section>
          <div
            className="layer-image layer-hero-image wow fadeIn layer-image-bottom"
          ></div>
        </section>
      </main>

      <footer className="footer layer-black scroll-snap light">
        <section
          className="layout layout-margin-vert-dull layout-padding-vert-dull footer-top layout-contain"
        >
          <h5 className="footer-top-icon wow zoomIn">
            <a className="icon-btn style-white">
              <i className="icon material-icons">expand_less</i>
            </a>
          </h5>
        </section>

        <section
          className="layout layout-shrink-shorten-vert layout-padding-vert-small layout-padding-vert-top"
        >
          <article className="layout-contain layout-padding-horz-left">
            <section className="layout-row">
              <section className="layout-col-7">
                <section className="layout-row">
                  <section className="layout-col-6 wow fadeIn">
                    <span className="footer-type">Phone</span>
                    <div className="footer-content">987-654-3210</div>
                  </section>
                  <section className="layout-col-6 wow fadeIn">
                    <span className="footer-type">Email</span>
                    <div className="footer-content">theritiktiwari@gmail.com</div>
                  </section>
                </section>

                <section className="layout-row">
                  <section className="layout-col-6 wow fadeIn">
                    <span className="footer-type">Address</span>
                    <div className="footer-content">
                      34, Nehru Nagar, Sector 45, New Delhi, 110001, India
                    </div>
                  </section>
                  <section className="layout-col-6 wow fadeIn">
                    <span className="footer-type">Social</span>
                    <div className="footer-content">
                      <Link className="links" href="/">FB</Link>
                      <Link className="links" href="/">IG</Link>
                      <Link className="links" href="/">YT</Link>
                    </div>
                  </section>
                </section>
              </section>
              <section className="layout-col-5">
                <h1
                  className="layer-title style-capital style-center wow fadeIn style-bolder"
                >
                  <span className="style-pink">Let&apos;s</span>
                </h1>
                <h1
                  className="layer-title style-capital style-center wow fadeIn layout-margin-vert-dull-bottom"
                >
                  Fly
                </h1>
              </section>
            </section>
          </article>
        </section>

        <section
          className="layout layout-padding-vert-dull layout-margin-vert-top-large"
        >
          <article
            className="layout-contain layout-padding-horz layout-padding-horz-right-small wow fadeIn"
          >
            <hr
              style={{
                border: "transparent",
                borderTop: "1px solid rgba(255, 255, 255, 0.15)"
              }}
            />
          </article>
        </section>

        <section
          className="layout-shorten-horz layout-padding-vert layout-padding-vert-bottom-large"
        >
          <article className="layout-contain">
            <section className="layout-row layout-margin-vert-bottom-large">
              <section className="layout-col-12 style-center wow fadeIn">
                Copyright &copy; {copyright(2023)} <span className="site_name">Let&apos;s Fly</span>. All Rights Reserved.
              </section>
            </section>
          </article>
        </section>
      </footer>
    </>
  )
}
