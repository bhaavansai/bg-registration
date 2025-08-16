import React, { useState, useEffect, useRef } from "react";
import BhagavadGita from "../assets/Bhagavad-Gita.jpg";
import Background from "../assets/Background.jpg";
import HGNPP from "../assets/HG_NPP.png"; // Example image, replace with your own
import SP from "../assets/SP.jfif";
import ISKDHN from "../assets/ISKDHN.png";

// Single-file React component (default export) using Tailwind CSS classes.
// Install/usage notes (brief):
// - This component expects Tailwind CSS to be configured in your project.
// - Paste this file into a React project (Vite / Create React App). Example: src/components/BGRegistration.jsx
// - Import and render <BGRegistration /> in App.jsx.
// - Replace image URLs and API endpoint '/api/register' with your real assets/endpoints.

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
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartRef = useRef(0);
  const AUTO_MS = 4000; // 4000ms = 4s
  // 48-hour limited-time offer timer (starts when page loads)
  const [offerEndsAt] = useState(() => Date.now() + 48 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(offerEndsAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, offerEndsAt - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [offerEndsAt]);

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
    "IIT Kanpur",
    "IIT Roorkee",
    "IIT Guwahati",
    "IIT Kharagpur",
    "IIT Dhanbad",
    "NIT Durgapur",
    "IIESTS",
    "NIT Jamshedpur",
    "IIT Patna",
    "NIT Patna",
    "IIT BHU",
    "NIT Allahabad",
    "BIT Sindri",
    "SNMMCH",
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
      e.mobile = "Please enter a valid WhatsApp number";

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
          `${form.name.trim()} successfully registered for the BG Course`
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

  const testimonials = [
    {
      name: "Suman Mishra",
      text: "This course changed how I approach daily life — deeply insightful and practical.",
    },
    {
      name: "Ravi Kapoor",
      text: "Clear teachings, patient teachers — highly recommended for beginners.",
    },
    {
      name: "Maya Iyer",
      text: "A beautiful blend of philosophy and practice. Felt more centered after completing.",
    },
  ];

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [isPaused, testimonials.length]);

  function next() {
    setCurrent((c) => (c + 1) % testimonials.length);
  }
  function prev() {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }
  function goTo(i) {
    setCurrent(
      ((i % testimonials.length) + testimonials.length) % testimonials.length
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 text-slate-800">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <img
          src={SP}
          alt="Decoration Left"
          className="absolute top-2 left-2 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain z-20"
        />
        <img
          src={ISKDHN}
          alt="Decoration Right"
          className="absolute top-2 right-2 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain z-20"
        />
        <div
          className="h-96 md:h-[520px] bg-cover bg-center flex items-center"
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
                <h3 className="text-lg font-semibold">HG Naam Prem Das</h3>
                <p className="text-sm text-slate-600 mt-1">
                  B.Tech - NIT Jameshedpur(2008)
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
              Why register for the Bhagavad Gita course?
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

            {/* Testimonials Slider */}
            <div className="mt-8">
              <h3 className="text-xl font-bold">Hear from past attendees</h3>

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
                {/* viewport */}
                <div className="overflow-hidden">
                  {/* track */}
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      width: `${testimonials.length * 100}%`,
                      transform: `translateX(-${
                        (100 / testimonials.length) * current
                      }%)`,
                    }}
                  >
                    {testimonials.map((t, i) => (
                      <div
                        key={t.name}
                        className="flex-shrink-0 px-4"
                        style={{
                          width: `${100 / testimonials.length}%`, // 👈 each slide equal width
                          maxWidth: "100%",
                        }}
                        aria-hidden={i === current ? "false" : "true"}
                      >
                        <blockquote className="bg-white p-6 rounded-lg shadow-sm mx-auto max-w-3xl md:max-w-2xl lg:max-w-3xl">
                          <p className="text-sm md:text-base text-slate-700">
                            “{t.text}”
                          </p>
                          <footer className="mt-3 text-xs md:text-sm text-slate-500">
                            — {t.name}
                          </footer>
                        </blockquote>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prev / Next */}
                <button
                  onClick={prev}
                  className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow px-3 py-1 rounded-full"
                  aria-label="Previous testimonial"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow px-3 py-1 rounded-full"
                  aria-label="Next testimonial"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`h-2.5 transition-all ${
                        idx === current
                          ? "bg-amber-600 w-8 rounded-full"
                          : "bg-slate-300 w-2.5 rounded-full"
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
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
                {formatTimeLeft(timeLeft)}
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
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} ISKCON Dhanbad
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
                Register for Bhagavad Gita Course
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
