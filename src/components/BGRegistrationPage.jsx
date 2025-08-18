import React, { useState, useEffect, useRef } from "react";
import Background from "../assets/Background.jpg";
import HGNPP from "../assets/HG_NPP.png"; // Example image, replace with your own
import ISKDHN from "../assets/ISKDHN.png";

export default function BGRegistration() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "", // WhatsApp number
    email: "",
    college: "",
    degree: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  // const [current, setCurrent] = useState(0);
  // const [isPaused, setIsPaused] = useState(false);
  // const touchStartRef = useRef(0);
  // const AUTO_MS = 4000; // 4000ms = 4s
  const YEAR = new Date().getFullYear(); // uses current year
  const OFFER_START = new Date(YEAR, 7, 17, 0, 0, 0).getTime(); // month 7 = August
  const OFFER_END = OFFER_START + 92 * 60 * 60 * 1000; // +72 hours

  // state: timeLeft holds ms until next event (start or end)
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    return now < OFFER_START ? OFFER_START - now : Math.max(0, OFFER_END - now);
  });
  const [hasStarted, setHasStarted] = useState(
    () => Date.now() >= OFFER_START && Date.now() < OFFER_END
  );

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (now < OFFER_START) {
        setHasStarted(false);
        setTimeLeft(OFFER_START - now);
      } else if (now >= OFFER_START && now < OFFER_END) {
        setHasStarted(true);
        setTimeLeft(Math.max(0, OFFER_END - now));
      } else {
        setHasStarted(true);
        setTimeLeft(0);
        // optionally clear interval when expired:
        // clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // helper (same as yours)
  function formatTimeLeft(ms) {
    const total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (ms <= 0) return "0h 0m 0s";
    return `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
  }

  const colleges = [
    "BIT Sindri",
    "IIT BHU",
    "IIT Dhanbad",
    "IIT Guwahati",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Patna",
    "IIT Roorkee",
    "IIESTS",
    "NIT Allahabad",
    "NIT Durgapur",
    "NIT Jamshedpur",
    "NIT Patna",
    "SNMMCH",
    "Other",
  ];

  const degrees = ["B.Tech", "M.Tech", "PhD", "MBA", "Medical", "Others"];
  const years = ["1st", "2nd", "3rd", "4th", "5th"];

  function openModal() {
    setForm({
      name: "",
      mobile: "",
      email: "",
      college: "",
      degree: "",
      year: "",
    });
    setErrors({});
    setSuccess(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Please enter a valid name";

    const digits = (form.mobile || "").replace(/\D/g, "");
    if (!digits || digits.length < 7)
      e.mobile = "Please enter a valid WhatsApp Number";

    if (!form.email || !String(form.email).includes("@"))
      e.email = "Please enter a valid email";

    if (!form.college) e.college = "Please select your college";
    if (!form.degree) e.degree = "Please select your degree";
    if (!form.year) e.year = "Please select your year";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(), // client sends as-is; server will normalize/validate
        email: form.email.trim(),
        college: form.college,
        degree: form.degree,
        year: form.year,
      };

      const res = await fetch(
        "https://music-backend-oumm.onrender.com/api/registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setSuccess(
          `${form.name.trim()} successfully registered for the Learn Gita Course`
        );
      } else if (res.status === 400) {
        setErrors({
          submit: body.message || "Invalid input. Check your fields.",
        });
      } else if (res.status === 409) {
        setErrors({
          submit: body.message || "Mobile number already registered.",
        });
      } else {
        setErrors({
          submit: body.message || "Server error. Please try again later.",
        });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  }

  // sample stats and testimonials — replace with real content
  const stats = [
    { label: "Graduates", value: "12,345+" },
    { label: "Avg. Satisfaction", value: "4.8/5" },
    { label: "Years", value: "8" },
  ];

  const videos = [
    {
      embedUrl: "https://www.youtube.com/embed/UQOmxYI5tD8?si=IuEMbNLQJAku7C9v",
      name: "Hrutidipan Pradhan",
      college: "IIT Dhanbad",
      branch: "FME",
      batch: "2024",
      placedIn: "IOCL",
    },
    {
      embedUrl: "https://www.youtube.com/embed/s8jUlzzV0A4?si=H0EgkfTIw6q1AZFr",
      name: "Bhaavan Sai",
      college: "IIT Dhanbad",
      branch: "M&C",
      batch: "2025",
      placedIn: "PhonePe",
    },
    // {
    //   embedUrl: "https://www.youtube.com/embed/Q0_O8PYNoj0?si=CWo4amxxe87u3omV",
    //   name: "Maya Iyer",
    //   college: "IIT Guwahati",
    //   branch: "Humanities",
    //   batch: "2019",
    //   placedIn: "Research",
    // },
  ];

  // slider state & refs for videos
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null); // index of playing video or null
  const touchStartRef = useRef(0);
  const AUTO_MS = 4000; // 3000..5000 okay
  useEffect(() => {
    // don't start when paused, when a video is playing, or when <=1 slide
    if (isPaused || playingIndex !== null || videos.length <= 1) return;

    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % videos.length);
    }, AUTO_MS);

    // debug line — remove later
    console.log("autoplay started, interval id:", id);

    return () => clearInterval(id);
  }, [isPaused, playingIndex, videos.length]);

  function next() {
    setCurrent((c) => (c + 1) % videos.length);
  }
  function prev() {
    setCurrent((c) => (c - 1 + videos.length) % videos.length);
  }
  function goTo(i) {
    setCurrent(((i % videos.length) + videos.length) % videos.length);
  }
  function playVideo(i) {
    setPlayingIndex(i);
    setIsPaused(true);
  }
  function stopVideo() {
    setPlayingIndex(null);
    setIsPaused(false);
  }

  // helper to extract youtube id and thumbnail
  function getYouTubeId(url) {
    // accepts 'https://www.youtube.com/embed/ID' or full watch URLs
    const m = url.match(/(?:\/embed\/|v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }
  function thumbFromEmbed(url) {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 text-slate-800">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <img
          src={ISKDHN}
          alt="Decoration Right"
          className="absolute top-2 right-2 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain z-20"
        />
        <div
          className="min-h-[480px] md:min-h-[520px] bg-cover bg-center flex items-center sm:pt-0"
          style={{
            backgroundImage: `linear-gradient(rgba(2,6,23,0.35), rgba(2,6,23,0.12)), url(${Background})`,
          }}
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20 pb-8 md:pb-0 pt-14 sm:pt-0">
            <div className="max-w-3xl">
              <span className="inline-block bg-amber-100 text-amber-800 font-semibold px-3 py-1 rounded-full mb-4">
                Learn Gita
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
                Discover the timeless wisdom of the Bhagavad Gita
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                A concise, practice-oriented five-session online course that
                guides you through the Bhagavad Gita’s core teachings — for
                everyday clarity, purpose, and calm.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM14 7a1 1 0 10-2 0 1 1 0 002 0zM9 11a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                  </svg>
                  Register Now
                </button>

                <a
                  href="#why"
                  className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-3 rounded-lg border border-white/30 backdrop-blur"
                >
                  Why join
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Krishna image card */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 mt-6 md:-mt-12 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-4">
              <img
                src={HGNPP}
                alt="Gita"
                className="w-28 h-28 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="text-lg font-semibold">Naam Prem Das</h3>
                <p className="text-sm text-slate-600 mt-1">
                  B.Tech (Mechanical Engineering), 2008
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  President, ISKCON Dhanbad
                </p>
              </div>
            </div>

            <div className="hidden md:block md:col-span-2">
              <div className="flex gap-4 justify-end items-center">
                {stats.map((s) => (
                  <div key={s.label} className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-slate-800">
                      {s.value}
                    </div>
                    <div className="text-sm text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WHY JOIN */}
      <section
        id="why"
        className="container mx-auto px-6 md:px-12 lg:px-20 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold">
              Why register for the Learn Gita course?
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              The Bhagavad Gita offers a practical philosophy for living —
              teaching how to handle stress, make better choices, and live with
              clarity. Our course is built to translate ancient wisdom into
              daily practice.
            </p>

            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold">Practical & Applicable</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Clear lessons with everyday practices and guided reflections.
                </p>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold">Experienced Guides</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Teachers with deep study and compassionate instruction.
                </p>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold">Group Support</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Peer discussions and community practices to integrate
                  teachings.
                </p>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold">Flexible Schedule</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Live sessions + recorded materials to suit your timing.
                </p>
              </li>
            </ul>

            {/* Video Testimonials Slider */}
            <div className="mt-8">
              <h2 className="text-2xl font-extrabold">
                Hear from past attendees
              </h2>

              <div
                className="mt-4 relative w-full"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={(e) =>
                  (touchStartRef.current = e.touches[0].clientX)
                }
                onTouchEnd={(e) => {
                  const endX =
                    (e.changedTouches && e.changedTouches[0].clientX) || 0;
                  const diff = touchStartRef.current - endX;
                  if (Math.abs(diff) > 50) {
                    if (diff > 0) next();
                    else prev();
                  }
                }}
              >
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      width: `${videos.length * 100}%`,
                      transform: `translateX(-${
                        (100 / videos.length) * current
                      }%)`,
                    }}
                  >
                    {videos.map((v, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 px-2"
                        style={{ width: `${100 / videos.length}%` }}
                      >
                        <div className="mx-auto max-w-xl">
                          {/* Video box (reduced height) */}
                          <div
                            className="relative rounded-lg overflow-hidden bg-black"
                            style={{ paddingTop: "50%" }}
                          >
                            {playingIndex === i ? (
                              <>
                                <iframe
                                  title={`video-${i}`}
                                  src={`${v.embedUrl}?autoplay=1&rel=0&showinfo=0`}
                                  className="absolute inset-0 w-full h-full"
                                  frameBorder="0"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                />
                                <button
                                  onClick={stopVideo}
                                  className="absolute top-2 right-2 bg-white/90 text-slate-800 px-2 py-1 rounded-md text-xs"
                                >
                                  Close
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => playVideo(i)}
                                className="absolute inset-0 w-full h-full flex items-center justify-center group"
                                aria-label={`Play ${v.name} video`}
                              >
                                <img
                                  src={thumbFromEmbed(v.embedUrl)}
                                  alt={`${v.name} thumbnail`}
                                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="relative z-10 flex items-center gap-3">
                                  <div className="rounded-full bg-white/95 p-2 shadow-lg">
                                    <svg
                                      className="w-5 h-5 text-amber-600"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </button>
                            )}
                          </div>

                          {/* Compact person card */}
                          <div className="mt-3 bg-white p-3 rounded-md shadow-sm flex items-center gap-3">
                            {/* initials avatar */}
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center text-sm">
                              {(v.name || "")
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>

                            {/* details */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 truncate">
                                {v.name}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {v.college} • {v.branch} • Batch {v.batch}
                              </div>
                            </div>

                            {/* placed pill */}
                            <div className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded">
                              {v.placedIn}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prev / Next */}
                <button
                  onClick={prev}
                  className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow px-3 py-1 rounded-full"
                  aria-label="Previous video"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow px-3 py-1 rounded-full"
                  aria-label="Next video"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {videos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`h-2.5 transition-all ${
                        idx === current
                          ? "bg-amber-600 w-8 rounded-full"
                          : "bg-slate-300 w-2.5 rounded-full"
                      }`}
                      aria-label={`Go to video ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Course Snapshot */}
          <aside className="bg-gradient-to-b from-amber-50 to-white p-6 rounded-lg shadow-lg border border-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-amber-800">Course snapshot</h4>
                <div className="mt-1 text-sm text-slate-600">
                  A concise, practice-oriented Bhagavad Gita course — available
                  to everyone.
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-sm text-slate-500">Original</div>
                <div className="text-lg font-semibold line-through text-slate-500">
                  ₹499
                </div>
                <div className="mt-1 inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center bg-amber-50 p-4 rounded-lg shadow-sm mt-2">
              <div className="text-lg font-semibold text-slate-700">
                Offer ends in:
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600 tracking-wide">
                {hasStarted
                  ? `Ends in: ${formatTimeLeft(timeLeft)}`
                  : `Starts in: ${formatTimeLeft(timeLeft)}`}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <dt className="font-semibold">Format</dt>
                <dd>Live + recorded</dd>
              </div>
              <div>
                <dt className="font-semibold">Duration</dt>
                <dd>5 Sessions</dd>
              </div>
              <div>
                <dt className="font-semibold">Fees</dt>
                <dd className="text-emerald-700 font-semibold">
                  <span className="line-through text-slate-500 mr-2">₹499</span>
                  <span>FREE</span>
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Schedule</dt>
                <dd>25th Aug to 29th Aug</dd>
                <dd>09:00 PM – 10:00 PM</dd>
              </div>
            </dl>
            <div className="text-center mt-6">
              <button
                onClick={openModal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-4 rounded-lg shadow-md flex items-center justify-center gap-2"
              >
                <span>Register Now</span>
                <span className="flex items-center gap-1">
                  (<span className="line-through opacity-80 text-sm">₹499</span>
                  <span className="font-bold text-lg">Free</span>)
                </span>
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 mt-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h4 className="font-bold">Learn Gita</h4>
            <p className="text-sm text-slate-400 mt-1">
              Teaching timeless wisdom with practical application.
            </p>
          </div>

          <div className="text-sm text-slate-400 mt-3 md:mt-0">
            <div>
              Contact us:&nbsp;
              <a
                href="tel:+919570276337"
                className="text-amber-400 hover:underline"
              >
                +91 95702 76337
              </a>
            </div>
            <div className="mt-2">
              © {new Date().getFullYear()} ISKCON Dhanbad
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 z-10">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">
                Register for Learn Gita Course
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form className="mt-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                />
                {errors.name && (
                  <div className="text-xs text-red-600 mt-1">{errors.name}</div>
                )}
              </div>

              {/* WhatsApp */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                />
                {errors.mobile && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.mobile}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
                />
                {errors.email && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* College (select) */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  College
                </label>
                <select
                  value={form.college}
                  onChange={(e) =>
                    setForm({ ...form, college: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 bg-white"
                >
                  <option value="">Select college</option>
                  {colleges.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.college && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.college}
                  </div>
                )}
              </div>

              {/* Degree (select) */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Degree
                </label>
                <select
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 bg-white"
                >
                  <option value="">Select degree</option>
                  {degrees.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.degree && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.degree}
                  </div>
                )}
              </div>

              {/* Year (select) */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Year
                </label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 bg-white"
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <div className="text-xs text-red-600 mt-1">{errors.year}</div>
                )}
              </div>

              {errors.submit && (
                <div className="text-sm text-red-600 mb-2">{errors.submit}</div>
              )}

              {!success ? (
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Submit"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md border"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700">
                  <strong>Success!</strong>
                  <p className="mt-1">{success}</p>
                  <div className="mt-3 text-right">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-md bg-amber-500 text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="text-xs text-slate-400 mt-3">
              We respect your privacy. Your number will only be used for course
              updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
