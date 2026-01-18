export default function Testimonials() {
  const testimonials = [
    {
      text: 'JobMitra cut our hiring time by 70%. The candidates we received were spot on, not just technically but culturally too.',
      author: 'Sarah Jenkins',
      role: 'CTO at TechFlow',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEhCxiruE8tLo2LdHS5mmIoptZhIp_1JJ4Ei-FjhhrBt2-bZXl28s3tCK_Nxh6oSnexawq53sVX5o7NCKGLTA4EZapnS15c_Kk9sTS4EhI-bWrIZhSQYil8HN0ChcXuNLgmGs_21Ipds-WnIuna5ufTTFLXu5e8keeqBCGZaOSSSl83FRWLzFq24_H6d2ytdPKk7NHyXpryNxN8WfAhvuYBylKDkvqv2J2yCvQ7Op7OdIh6h_Rx3PAsl9GugRilrJnPdgDz0wMFSI',
    },
    {
      text: 'As a freelancer, finding consistent high-quality work is tough. This platform brings the best clients directly to my feed.',
      author: 'David Chen',
      role: 'Senior UX Designer',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqKKRKoC8TwJi-n8yQcn_Gi-utjOzTE9eVtNsGaaCoVb4W4x0Qpiz_YGDOboH_pvAXScfQPvGeH2T0GeqOJyA2av0Xt8jjMizZGHtC-oDRcz7NdlLTNIcFe8qD4XAH8CgQZlFljAdT1ZysIrytfsoDhXPE-87qf_2wvn21GOnAMiwiPnSX24h_CMT4VoNTPVqusdoFwvw6zotAZhOf0uG_GiFTMjkek_gWNsCa91mFqdha0_7VufuaT0JBx7LyIURhg6Fk1pAyesI',
    },
    {
      text: 'The interface is incredibly intuitive. I posted a job and had 3 perfect interviews scheduled within 24 hours.',
      author: 'Emily Rodriguez',
      role: 'HR Director',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3QyVvwsXwoeXe6LcHHQGjLF48an6YWj-T7P2R6Ao_2GHD6UvNFv8vez8TFYyv9l3JV5Y-TkF8sTviSIGHUhDAObaWvjIIdp0_QPdDWbtxQyvgLCzHJqXMXoDQoWnZfRawZnZrRksk7xaphXrdLFYy7eoO9syiiiweI_3WtZAlUNJqyhBhP8iXNrd2zRp6RiBk-SCVb2S4MsFY3sqyV3mGPFJq9DLQ1pJ_VdrWpRj_VrX0RQUF8ooNz3WRpnj7y3EYFNmRAq42Sd8',
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-black text-[#111718] dark:text-white">
          What People Are Saying
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl border border-[#e5e8eb] dark:border-[#3b4f54] bg-surface-light dark:bg-surface-dark p-6"
            >
              <div className="mb-4 flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                ))}
              </div>
              <p className="mb-6 flex-1 text-[#4f6266] dark:text-[#9db4b9]">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-gray-300 bg-cover bg-center"
                  style={{ backgroundImage: `url('${testimonial.image}')` }}
                />
                <div>
                  <p className="text-sm font-bold text-[#111718] dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-[#4f6266] dark:text-[#9db4b9]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
