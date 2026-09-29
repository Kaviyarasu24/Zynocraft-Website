import { useState } from 'react';
import { ArrowRight, Mail, Clock, MessageSquare } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';

const projectTypes = ['Product Engineering', 'Web Application', 'Software System', 'Mobile Application', 'AI / Machine Learning', 'Automation', 'Other'];

// Free key from https://web3forms.com (safe to expose client-side — it only sends to your
// pre-registered inbox). Override via VITE_WEB3FORMS_ACCESS_KEY in a .env file.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', ACCESS_KEY);
    data.append('subject', `New project enquiry — ${data.get('project_type') || 'Zynocraftx'}`);
    data.append('from_name', 'Zynocraftx Website');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error(json.message || 'Submission failed.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please email us directly.');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's talk about your project.</>}
        subtitle="Share what you're building, the challenge you're solving, or where your current product needs to go next."
        image={{ src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Team discussing a project' }}
      />
      <section className="bg-fog py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Info */}
          <Reveal>
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, title: 'Email us', text: 'hello@zynocraftx.com', href: 'mailto:hello@zynocraftx.com' },
                { icon: Clock, title: 'Response time', text: 'We reply within one business day.' },
                { icon: MessageSquare, title: 'No perfect brief needed', text: 'Bring the problem — we’ll suggest a useful first step.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_8px_18px_rgba(228,6,2,0.26)]">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-display text-[16px] font-semibold text-ink">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="mt-1 inline-block text-[14px] text-cobalt hover:underline">{item.text}</a>
                      ) : (
                        <p className="mt-1 text-[14px] text-muted">{item.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-line bg-white p-7 md:p-9">
              {status === 'success' ? (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_10px_24px_rgba(228,6,2,0.3)]">
                    <Mail size={24} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-[19px] font-semibold text-ink">Project details received.</h3>
                  <p className="mt-2 max-w-sm text-[14px] text-muted">
                    Thanks for reaching out — we’ll review your submission and respond within one business day.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn btn-outline mt-6">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* honeypot spam trap */}
                  <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" aria-hidden="true" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" name="name" required />
                    <Field label="Business Email" name="email" type="email" required />
                  </div>
                  <Field label="Company / Organization" name="company" />
                  <div>
                    <Label>Project Type</Label>
                    <select name="project_type" defaultValue="" className="w-full rounded-xl border border-line bg-mist px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-cobalt">
                      <option value="" disabled>Select a project type</option>
                      {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Project Details</Label>
                    <textarea name="message" required rows={5} placeholder="Tell us about your project, goals, and timeline."
                      className="w-full resize-none rounded-xl border border-line bg-mist px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-cobalt" />
                  </div>

                  {status === 'error' && (
                    <p className="text-[13.5px] text-brand">
                      {errorMsg}{' '}
                      <a href="mailto:hello@zynocraftx.com" className="underline">Email us instead</a>.
                    </p>
                  )}

                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full justify-center disabled:opacity-60">
                    {status === 'loading' ? 'Sending…' : <>Send Project Details <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{children}</label>;
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} name={name} required={required}
        className="w-full rounded-xl border border-line bg-mist px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-cobalt" />
    </div>
  );
}
