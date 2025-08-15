import React, { useState } from "react";
import BhagavadGita from "../assets/Bhagavad-Gita.jpg";
import Background from "../assets/Background.jpg"; // Example image, replace with your own

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
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [errors, setErrors] = useState({});

  // extensible fields example (you can map/render more fields from this array)
  const fields = [
    { key: "name", label: "Name", placeholder: "Your full name", type: "text" },
    {
      key: "mobile",
      label: "Mobile number",
      placeholder: "10-digit mobile",
      type: "tel",
    },
  ];

  function openModal() {
    setForm({ name: "", mobile: "" });
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
      e.mobile = "Please enter a valid mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSuccess(null);
    // keep client-side validation if you want, otherwise skip it
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(), // sending as the client provides; server will normalize/validate
      };

      const res = await fetch("http://localhost:5001/api/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        // Created
        setSuccess(
          `${form.name.trim()} successfully registered for the BG Course`
        );
      } else if (res.status === 400) {
        // Bad request (e.g. missing fields or mobile format)
        setErrors({
          submit:
            body.message || "Invalid input. Name and mobile are required.",
        });
      } else if (res.status === 409) {
        // Conflict (duplicate mobile)
        setErrors({
          submit: body.message || "Mobile number already registered.",
        });
      } else {
        // Other server errors
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 text-slate-800">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="h-96 md:h-[520px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(2,6,23,0.35), rgba(2,6,23,0.12)), url(${Background})`,
          }}
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl">
              <span className="inline-block bg-amber-100 text-amber-800 font-semibold px-3 py-1 rounded-full mb-4">
                Bhagavad Gita Course
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
                Discover the timeless wisdom of the Bhagavad Gita
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                A concise, practice-oriented course guiding you through the
                Gita’s core teachings — for everyday clarity, purpose and calm.
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
        <div className="container mx-auto px-6 md:px-12 lg:px-20 -mt-12 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-4">
              <img
                src={BhagavadGita}
                alt="Gita"
                className="w-28 h-28 rounded-lg object-cover shadow-md"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  Short Course · 8 Weeks
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Guided readings, group discussions & practice sessions
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

            {/* Testimonials */}
            <div className="mt-8">
              <h3 className="text-xl font-bold">Hear from past attendees</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <blockquote
                    key={t.name}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <p className="text-sm text-slate-700">“{t.text}”</p>
                    <footer className="mt-3 text-xs text-slate-500">
                      — {t.name}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-gradient-to-b from-amber-50 to-white p-6 rounded-lg shadow-lg border border-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-amber-800">Course snapshot</h4>
                <div className="mt-1 text-sm text-slate-600">
                  A concise, practice-oriented Bhagavad Gita course — available
                  to everyone.
                </div>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
                  FREE
                </span>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <dt className="font-semibold">Format</dt>
                <dd>Live + recorded</dd>
              </div>
              <div>
                <dt className="font-semibold">Duration</dt>
                <dd>8 weeks</dd>
              </div>
              <div>
                <dt className="font-semibold">Fees</dt>
                <dd className="text-emerald-700 font-semibold">
                  Free (no charge)
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Next batch</dt>
                <dd>Starting 1st Sept</dd>
              </div>
            </dl>

            <p className="mt-4 text-sm text-slate-700">
              This course is offered free to make the Gita's teachings
              accessible to all. Optional donations welcome to support our
              teachers and operations.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={openModal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-lg shadow"
              >
                Register (Free)
              </button>
              <button
                onClick={openModal}
                className="w-full border border-emerald-200 text-emerald-700 font-medium px-4 py-2 rounded-lg"
              >
                Learn more
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 mt-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold">Bhagavad Gita Course</h4>
            <p className="text-sm text-slate-400 mt-1">
              Teaching timeless wisdom with practical application.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} BG Academy
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
              {fields.map((f) => (
                <div key={f.key} className="mb-3">
                  <label className="block text-sm font-medium text-slate-700">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-amber-400 focus:border-amber-400 px-3 py-2"
                  />
                  {errors[f.key] && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors[f.key]}
                    </div>
                  )}
                </div>
              ))}

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
