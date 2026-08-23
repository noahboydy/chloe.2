"use client";

// Always shown for the "hurting" (isSupport) mood — regardless of whether
// a personal letter has been written for it yet. Real, free, UK helplines
// come first; Noah's own words (if any) come after, not instead of them.

export function SupportResources() {
  return (
    <div className="w-full rounded-3xl bg-white border-4 border-pink-100 px-6 py-8 sm:px-8 sm:py-10 text-left">
      <p className="font-hand text-2xl text-pink-700 text-center mb-1">
        You matter, and this deserves more than a website 💙
      </p>
      <p className="text-pink-600 text-sm text-center mb-6">
        Please talk to someone as well as reading this — a parent, teacher,
        school nurse, or one of these:
      </p>

      <ul className="space-y-3 text-sm">
        <li className="rounded-xl bg-pink-50 px-4 py-3">
          <span className="font-semibold text-pink-800">Childline</span> —{" "}
          <a href="tel:08001111" className="underline text-pink-700">
            0800 1111
          </a>
          <span className="block text-pink-500">
            Free, confidential, for under 19s. Won't show on your phone
            bill. Also does online chat at childline.org.uk.
          </span>
        </li>
        <li className="rounded-xl bg-pink-50 px-4 py-3">
          <span className="font-semibold text-pink-800">Shout</span> — text{" "}
          <span className="font-semibold">SHOUT</span> to{" "}
          <a href="sms:85258" className="underline text-pink-700">
            85258
          </a>
          <span className="block text-pink-500">
            Free, 24/7, anonymous text support if talking out loud feels
            too hard.
          </span>
        </li>
        <li className="rounded-xl bg-pink-50 px-4 py-3">
          <span className="font-semibold text-pink-800">Samaritans</span> —{" "}
          <a href="tel:116123" className="underline text-pink-700">
            116 123
          </a>
          <span className="block text-pink-500">
            Free, 24/7, any age, any reason.
          </span>
        </li>
        <li className="rounded-xl bg-pink-100 px-4 py-3">
          <span className="font-semibold text-pink-900">
            If you're in immediate danger right now
          </span>
          <span className="block text-pink-700">
            Call 999 or go to your nearest A&amp;E.
          </span>
        </li>
      </ul>
    </div>
  );
}
