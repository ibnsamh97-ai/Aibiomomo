export function DialectGuideSection() {
  const rows = [
    {
      iraqiTerm: 'تبدي / يسوي / وعدنا',
      meaning: 'تبدأ / يقوم بـ / ولدينا',
      pronunciationNote: 'مخارج بغدادية طبيعية مع فتح خفيف وربط سلس في الجملة',
    },
    {
      iraqiTerm: 'الماي / بيها / اللي تخلي',
      meaning: 'الماء / فيها / التي تجعل',
      pronunciationNote: 'نطق عراقي سلس غير متكلف يناسب السرد القصصي الدرامي',
    },
    {
      iraqiTerm: 'السكلرنكيمية / البرنكيمي',
      meaning: 'مصطلحات الأنسجة النباتية العلمية',
      pronunciationNote: 'تُقرأ بوضوح علمي مع الحفاظ على إيقاع السرد التشويقي',
    },
    {
      iraqiTerm: 'منصة بايوڤيرس',
      meaning: 'اسم المنصة التعليمية في الخاتمة',
      pronunciationNote: 'حرف (ڤ) يُلفظ مثل V الإنجليزية مع وقفة تشجيعية للتعليق بكلمة أحياء',
    },
  ];

  return (
    <section
      id="dialect-guide"
      className="border-t border-slate-200 bg-white py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-emerald-700">
            مرجع النطق العراقي والمصطلحات العلمية
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
            كيف يضبط الاستوديو مخارج اللهجة العراقية
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">المفردة العراقية في النص</th>
                <th scope="col" className="px-4 py-3">المعنى الوظيفي</th>
                <th scope="col" className="px-4 py-3">توجيه الإلقاء الصوتي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row) => (
                <tr key={row.iraqiTerm}>
                  <td className="px-4 py-3.5 font-display font-bold text-slate-900">
                    {row.iraqiTerm}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{row.meaning}</td>
                  <td className="px-4 py-3.5 text-slate-600">{row.pronunciationNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
