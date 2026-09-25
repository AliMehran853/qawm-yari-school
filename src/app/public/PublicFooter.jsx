import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, LogIn } from "lucide-react";
import { useSettings } from "../../features/settings/useSettings";

export default function PublicFooter() {
  const { data: settings } = useSettings();

  const schoolName = settings?.school_name || "مکتب قوم یاری";
  const fullName = settings?.school_full_name || "";
  const address = settings?.address || "ولسوالی ورس، بامیان، افغانستان";
  const phone = settings?.phone;
  const email = settings?.email;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معرفی */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={schoolName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                  {schoolName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold">{schoolName}</h3>
                {fullName && (
                  <p className="text-xs text-white/60">{fullName}</p>
                )}
              </div>
            </div>
            {settings?.description && (
              <p className="text-sm text-white/70 leading-relaxed mt-3">
                {settings.description}
              </p>
            )}
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="font-bold mb-3">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-white transition"
                >
                  درباره مکتب
                </Link>
              </li>
              <li>
                <Link
                  to="/staff"
                  className="text-white/70 hover:text-white transition"
                >
                  کادر آموزشی
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-white/70 hover:text-white transition"
                >
                  اخبار و اعلانات
                </Link>
              </li>
              <li>
                <Link
                  to="/photos"
                  className="text-white/70 hover:text-white transition"
                >
                  گالری تصاویر
                </Link>
              </li>
              <li>
                <Link
                  to="/library"
                  className="text-white/70 hover:text-white transition"
                >
                  کتابخانه
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white transition flex items-center gap-1.5"
                >
                  <LogIn size={12} />
                  <span>ورود به پنل</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="font-bold mb-3">تماس با ما</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5 text-white/60" />
                <span className="text-white/70 leading-relaxed">{address}</span>
              </li>
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-white/60" />
                  <a
                    href={`tel:${phone}`}
                    className="text-white/70 hover:text-white transition"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0 text-white/60" />
                  <a
                    href={`mailto:${email}`}
                    className="text-white/70 hover:text-white transition"
                    dir="ltr"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs text-white/50">
            © {year} {fullName || schoolName} — تمام حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  );
}
